import { Router, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import prisma from '../lib/prisma.js';

const router = Router();

const mapAnn = (a: any) => ({
  id: a.id,
  title: a.title,
  content: a.content,
  type: a.type.toLowerCase(),
  isActive: a.isActive,
  startDate: a.startDate?.toISOString().split('T')[0],
  endDate: a.endDate?.toISOString().split('T')[0],
  createdAt: a.createdAt?.toISOString(),
  updatedAt: a.updatedAt?.toISOString(),
});

// Get active announcements (public)
router.get(
  '/active',
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const now = new Date();
      const announcements = await prisma.announcement.findMany({
        where: {
          isActive: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: announcements.map(mapAnn),
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all announcements (admin)
router.get(
  '/',
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const announcements = await prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: announcements.map(mapAnn),
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get announcement by ID
router.get(
  '/:id',
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const announcement = await prisma.announcement.findUnique({
        where: { id: req.params.id },
      });

      if (!announcement) {
        return next(new AppError('Announcement not found', 404));
      }

      res.json({ success: true, data: mapAnn(announcement) });
    } catch (error) {
      next(error);
    }
  }
);

// Create announcement (admin)
router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('title').notEmpty().withMessage('請輸入標題'),
    body('content').notEmpty().withMessage('請輸入內容'),
    body('type').isIn(['info', 'success', 'warning', 'urgent']),
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { title, content, type, startDate, endDate, isActive = true } = req.body;

      const announcement = await prisma.announcement.create({
        data: {
          title,
          content,
          type: type.toUpperCase(),
          isActive,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      });

      res.status(201).json({
        success: true,
        data: mapAnn(announcement),
        message: '公告已建立',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update announcement (admin)
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const existing = await prisma.announcement.findUnique({ where: { id: req.params.id } });
      if (!existing) {
        return next(new AppError('Announcement not found', 404));
      }

      const { title, content, type, startDate, endDate, isActive } = req.body;

      const announcement = await prisma.announcement.update({
        where: { id: req.params.id },
        data: {
          ...(title && { title }),
          ...(content && { content }),
          ...(type && { type: type.toUpperCase() }),
          ...(startDate && { startDate: new Date(startDate) }),
          ...(endDate && { endDate: new Date(endDate) }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      res.json({
        success: true,
        data: mapAnn(announcement),
        message: '公告已更新',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete announcement (admin)
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const existing = await prisma.announcement.findUnique({ where: { id: req.params.id } });
      if (!existing) {
        return next(new AppError('Announcement not found', 404));
      }

      await prisma.announcement.delete({ where: { id: req.params.id } });

      res.json({ success: true, message: '公告已刪除' });
    } catch (error) {
      next(error);
    }
  }
);

// Toggle announcement status (admin)
router.put(
  '/:id/toggle',
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const existing = await prisma.announcement.findUnique({ where: { id: req.params.id } });
      if (!existing) {
        return next(new AppError('Announcement not found', 404));
      }

      const announcement = await prisma.announcement.update({
        where: { id: req.params.id },
        data: { isActive: !existing.isActive },
      });

      res.json({
        success: true,
        data: mapAnn(announcement),
        message: announcement.isActive ? '公告已啟用' : '公告已停用',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
