import { Router, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import { authenticate, requireReviewer, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import prisma from '../lib/prisma.js';

const router = Router();

const mapApp = (a: any) => ({
  id: a.id,
  paperId: a.paperId,
  applicantId: a.applicantId,
  applicantType: a.applicantType.toLowerCase(),
  status: a.status.toLowerCase(),
  rewardAmount: a.rewardAmount,
  rewardFormula: a.rewardFormula,
  hasHolisticCare: a.hasHolisticCare,
  hasMedicalQuality: a.hasMedicalQuality,
  hasMedicalEducation: a.hasMedicalEducation,
  submittedAt: a.submittedAt?.toISOString(),
  reviewedAt: a.reviewedAt?.toISOString(),
  reviewComment: a.reviewComment,
  reviewerId: a.reviewerId,
  createdAt: a.createdAt?.toISOString(),
  updatedAt: a.updatedAt?.toISOString(),
  paper: a.paper ? {
    id: a.paper.id,
    title: a.paper.title,
    paperType: a.paper.paperType.toLowerCase(),
  } : undefined,
  applicant: a.applicant ? {
    id: a.applicant.id,
    name: a.applicant.name,
    department: a.applicant.department,
  } : undefined,
});

// Get all applications
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
      const status = req.query.status as string | undefined;

      const where: any = {};

      if (req.user?.role === 'user') {
        where.applicantId = req.user.id;
      }

      if (status) {
        where.status = status.toUpperCase();
      }

      const [apps, total] = await Promise.all([
        prisma.paperApplication.findMany({
          where,
          include: {
            paper: { select: { id: true, title: true, paperType: true } },
            applicant: { select: { id: true, name: true, department: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.paperApplication.count({ where }),
      ]);

      res.json({
        success: true,
        data: apps.map(mapApp),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
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
      const apps = await prisma.paperApplication.findMany({
        where: { applicantId: req.user!.id },
        include: {
          paper: { select: { id: true, title: true, paperType: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: apps.map(mapApp),
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
      const app = await prisma.paperApplication.findUnique({
        where: { id: req.params.id },
        include: {
          paper: { select: { id: true, title: true, paperType: true } },
          applicant: { select: { id: true, name: true, department: true } },
        },
      });

      if (!app) {
        return next(new AppError('Application not found', 404));
      }

      if (req.user?.role === 'user' && app.applicantId !== req.user.id) {
        return next(new AppError('Access denied', 403));
      }

      res.json({ success: true, data: mapApp(app) });
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

      const { paperId, applicantType, rewardAmount } = req.body;

      const app = await prisma.paperApplication.create({
        data: {
          paperId,
          applicantId: req.user!.id,
          applicantType: applicantType.toUpperCase(),
          status: 'PENDING',
          rewardAmount,
        },
        include: {
          paper: { select: { id: true, title: true, paperType: true } },
        },
      });

      res.status(201).json({
        success: true,
        data: mapApp(app),
        message: '申請已送出',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Review application
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

      const existing = await prisma.paperApplication.findUnique({ where: { id: req.params.id } });
      if (!existing) {
        return next(new AppError('Application not found', 404));
      }

      const { status, comment, rewardAmount } = req.body;

      const app = await prisma.paperApplication.update({
        where: { id: req.params.id },
        data: {
          status: status.toUpperCase(),
          reviewedAt: new Date(),
          reviewerId: req.user!.id,
          reviewComment: comment,
          ...(rewardAmount !== undefined && { rewardAmount }),
        },
        include: {
          paper: { select: { id: true, title: true, paperType: true } },
        },
      });

      const statusMessage: Record<string, string> = {
        approved: '已核准', rejected: '已退件', revision: '需修改',
      };

      res.json({
        success: true,
        data: mapApp(app),
        message: `申請${statusMessage[status]}`,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Cancel / Delete application
router.delete(
  '/:id',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const app = await prisma.paperApplication.findUnique({ where: { id: req.params.id } });
      if (!app) {
        return next(new AppError('Application not found', 404));
      }

      const isAdminOrReviewer = req.user?.role === 'admin' || req.user?.role === 'reviewer';

      if (isAdminOrReviewer) {
        // Admin/Reviewer can delete any application regardless of status
        const deletedStatus = app.status.toLowerCase();
        await prisma.paperApplication.delete({ where: { id: req.params.id } });
        res.json({
          success: true,
          message: deletedStatus === 'approved' ? '已刪除核准的申請' : '申請已刪除',
          deletedStatus,
        });
      } else {
        // Regular user: can only delete own pending applications
        if (app.applicantId !== req.user!.id) {
          return next(new AppError('Access denied', 403));
        }
        if (app.status !== 'PENDING') {
          return next(new AppError('只能取消待審核的申請', 400));
        }
        await prisma.paperApplication.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: '申請已取消', deletedStatus: 'pending' });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
