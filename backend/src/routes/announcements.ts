import { Router, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { Announcement } from '../types/index.js';

const router = Router();

// Mock announcements database
const announcements: Announcement[] = [
  {
    id: '1',
    title: '重要公告',
    content: '114年度論文獎勵申請截止日期為12月31日，請同仁把握時間提出申請。',
    type: 'urgent',
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    title: '系統更新',
    content: 'AI 自動辨識功能已上線，可自動判別論文類型及計算獎勵金額。',
    type: 'success',
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    title: '獎勵加成',
    content: '刊登於「醫療品質」雜誌之文章，獎勵加成50%；刊登於「醫學教育」雜誌之文章，獎勵加成100%。',
    type: 'info',
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    createdAt: '2024-01-01',
  },
];

// Get active announcements (public)
router.get(
  '/active',
  async (req, res: Response, next) => {
    try {
      const now = new Date().toISOString().split('T')[0];
      const activeAnnouncements = announcements.filter(
        (a) => a.isActive && a.startDate <= now && a.endDate >= now
      );

      res.json({
        success: true,
        data: activeAnnouncements,
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
  async (req: AuthRequest, res: Response, next) => {
    try {
      res.json({
        success: true,
        data: announcements,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get announcement by ID
router.get(
  '/:id',
  async (req, res: Response, next) => {
    try {
      const announcement = announcements.find((a) => a.id === req.params.id);
      if (!announcement) {
        return next(new AppError('Announcement not found', 404));
      }

      res.json({
        success: true,
        data: announcement,
      });
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
  async (req: AuthRequest, res: Response, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { title, content, type, startDate, endDate, isActive = true } = req.body;

      const newAnnouncement: Announcement = {
        id: (announcements.length + 1).toString(),
        title,
        content,
        type,
        isActive,
        startDate,
        endDate,
        createdAt: new Date().toISOString(),
      };

      announcements.push(newAnnouncement);

      res.status(201).json({
        success: true,
        data: newAnnouncement,
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
  async (req: AuthRequest, res: Response, next) => {
    try {
      const index = announcements.findIndex((a) => a.id === req.params.id);
      if (index === -1) {
        return next(new AppError('Announcement not found', 404));
      }

      announcements[index] = {
        ...announcements[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      res.json({
        success: true,
        data: announcements[index],
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
  async (req: AuthRequest, res: Response, next) => {
    try {
      const index = announcements.findIndex((a) => a.id === req.params.id);
      if (index === -1) {
        return next(new AppError('Announcement not found', 404));
      }

      announcements.splice(index, 1);

      res.json({
        success: true,
        message: '公告已刪除',
      });
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
  async (req: AuthRequest, res: Response, next) => {
    try {
      const index = announcements.findIndex((a) => a.id === req.params.id);
      if (index === -1) {
        return next(new AppError('Announcement not found', 404));
      }

      announcements[index].isActive = !announcements[index].isActive;
      announcements[index].updatedAt = new Date().toISOString();

      res.json({
        success: true,
        data: announcements[index],
        message: announcements[index].isActive ? '公告已啟用' : '公告已停用',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
