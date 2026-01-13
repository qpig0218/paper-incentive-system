import { Router, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import { authenticate, requireReviewer, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { PaperApplication, ApplicationStatus } from '../types/index.js';

const router = Router();

// Mock applications database
const applications: PaperApplication[] = [
  {
    id: '1',
    paperId: '1',
    applicantId: '1',
    applicantType: 'first_author',
    status: 'pending',
    rewardAmount: 85000,
    submittedAt: '2024-03-20',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
  },
];

// Get all applications (admin/reviewer)
router.get(
  '/',
  authenticate,
  [
    query('status').optional().isIn(['pending', 'approved', 'rejected', 'revision']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as ApplicationStatus | undefined;

      let filteredApplications = [...applications];

      // Filter by user if not admin/reviewer
      if (req.user?.role === 'user') {
        filteredApplications = filteredApplications.filter(
          (a) => a.applicantId === req.user?.id
        );
      }

      // Filter by status
      if (status) {
        filteredApplications = filteredApplications.filter((a) => a.status === status);
      }

      // Pagination
      const total = filteredApplications.length;
      const startIndex = (page - 1) * limit;
      const paginatedApplications = filteredApplications.slice(
        startIndex,
        startIndex + limit
      );

      res.json({
        success: true,
        data: paginatedApplications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get my applications
router.get(
  '/my',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const myApplications = applications.filter(
        (a) => a.applicantId === req.user?.id
      );

      res.json({
        success: true,
        data: myApplications,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get application by ID
router.get(
  '/:id',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const application = applications.find((a) => a.id === req.params.id);
      if (!application) {
        return next(new AppError('Application not found', 404));
      }

      // Check permission
      if (
        req.user?.role === 'user' &&
        application.applicantId !== req.user.id
      ) {
        return next(new AppError('Access denied', 403));
      }

      res.json({
        success: true,
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Submit new application
router.post(
  '/',
  authenticate,
  [
    body('paperId').notEmpty().withMessage('請選擇論文'),
    body('applicantType').isIn(['first_author', 'corresponding', 'co_author']),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { paperId, applicantType, rewardAmount, rewardCalculation } = req.body;

      const newApplication: PaperApplication = {
        id: (applications.length + 1).toString(),
        paperId,
        applicantId: req.user!.id,
        applicantType,
        status: 'pending',
        rewardAmount,
        rewardCalculation,
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      applications.push(newApplication);

      res.status(201).json({
        success: true,
        data: newApplication,
        message: '申請已送出',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Review application (approve/reject)
router.put(
  '/:id/review',
  authenticate,
  requireReviewer,
  [
    body('status').isIn(['approved', 'rejected', 'revision']),
    body('comment').optional().isString(),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const index = applications.findIndex((a) => a.id === req.params.id);
      if (index === -1) {
        return next(new AppError('Application not found', 404));
      }

      const { status, comment, rewardAmount } = req.body;

      applications[index] = {
        ...applications[index],
        status,
        reviewedAt: new Date().toISOString(),
        reviewedBy: req.user!.id,
        reviewComment: comment,
        rewardAmount: rewardAmount || applications[index].rewardAmount,
        updatedAt: new Date().toISOString(),
      };

      const statusMessage = {
        approved: '已核准',
        rejected: '已退件',
        revision: '需修改',
      };

      res.json({
        success: true,
        data: applications[index],
        message: `申請${statusMessage[status as keyof typeof statusMessage]}`,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Cancel application
router.delete(
  '/:id',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const index = applications.findIndex((a) => a.id === req.params.id);
      if (index === -1) {
        return next(new AppError('Application not found', 404));
      }

      // Check permission
      if (
        req.user?.role === 'user' &&
        applications[index].applicantId !== req.user.id
      ) {
        return next(new AppError('Access denied', 403));
      }

      // Can only cancel pending applications
      if (applications[index].status !== 'pending') {
        return next(new AppError('只能取消待審核的申請', 400));
      }

      applications.splice(index, 1);

      res.json({
        success: true,
        message: '申請已取消',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
