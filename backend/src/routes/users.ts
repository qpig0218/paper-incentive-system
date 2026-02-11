import { Router, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import prisma from '../lib/prisma.js';

const router = Router();

// Get all users (admin only)
router.get(
  '/',
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true, email: true, name: true, employeeId: true,
          department: true, position: true, role: true, createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: users.map((u) => ({
          ...u,
          role: u.role.toLowerCase(),
          createdAt: u.createdAt.toISOString(),
        })),
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get user by ID
router.get(
  '/:id',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== 'admin' && req.user?.id !== req.params.id) {
        return next(new AppError('Access denied', 403));
      }

      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: {
          id: true, email: true, name: true, employeeId: true,
          department: true, position: true, role: true, createdAt: true,
        },
      });

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      res.json({
        success: true,
        data: { ...user, role: user.role.toLowerCase(), createdAt: user.createdAt.toISOString() },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update user profile
router.put(
  '/:id',
  authenticate,
  [
    body('name').optional().isString(),
    body('department').optional().isString(),
    body('position').optional().isString(),
    body('employeeId').optional().isString(),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      if (req.user?.role !== 'admin' && req.user?.id !== req.params.id) {
        return next(new AppError('Access denied', 403));
      }

      const { name, department, position, employeeId } = req.body;

      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: {
          ...(name && { name }),
          ...(department && { department }),
          ...(position && { position }),
          ...(employeeId && { employeeId }),
        },
        select: {
          id: true, email: true, name: true, employeeId: true,
          department: true, position: true, role: true,
        },
      });

      res.json({
        success: true,
        data: { ...user, role: user.role.toLowerCase() },
        message: '資料已更新',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update user role (admin only)
router.put(
  '/:id/role',
  authenticate,
  requireAdmin,
  [body('role').isIn(['user', 'admin', 'reviewer'])],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: { role: req.body.role.toUpperCase() },
        select: {
          id: true, email: true, name: true, employeeId: true,
          department: true, position: true, role: true,
        },
      });

      res.json({
        success: true,
        data: { ...user, role: user.role.toLowerCase() },
        message: '角色已更新',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get user statistics
router.get(
  '/:id/stats',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== 'admin' && req.user?.id !== req.params.id) {
        return next(new AppError('Access denied', 403));
      }

      const [totalPapers, totalApplications, approvedApps, totalRewards] = await Promise.all([
        prisma.paper.count({ where: { submittedById: req.params.id } }),
        prisma.paperApplication.count({ where: { applicantId: req.params.id } }),
        prisma.paperApplication.count({ where: { applicantId: req.params.id, status: 'APPROVED' } }),
        prisma.paperApplication.aggregate({
          where: { applicantId: req.params.id, status: 'APPROVED' },
          _sum: { rewardAmount: true },
        }),
      ]);

      const sciPapers = await prisma.paper.count({
        where: {
          submittedById: req.params.id,
          journalInfo: { isSci: true },
        },
      });

      res.json({
        success: true,
        data: {
          totalPapers,
          totalApplications,
          approvedApplications: approvedApps,
          totalRewards: totalRewards._sum.rewardAmount || 0,
          sciPapers,
          nonSciPapers: totalPapers - sciPapers,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
