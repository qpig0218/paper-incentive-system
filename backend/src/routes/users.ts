import { Router, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { User } from '../types/index.js';

const router = Router();

// Mock users database
const users: User[] = [
  {
    id: '1',
    email: 'admin@chimei.org.tw',
    name: '系統管理員',
    employeeId: 'CM000001',
    department: '資訊部',
    position: '管理員',
    role: 'admin',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    email: 'daming.wang@chimei.org.tw',
    name: '王大明',
    employeeId: 'CM001234',
    department: '心臟內科',
    position: '主治醫師',
    role: 'user',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

// Get all users (admin only)
router.get(
  '/',
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.json({
        success: true,
        data: users.map((u) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          employeeId: u.employeeId,
          department: u.department,
          position: u.position,
          role: u.role,
          createdAt: u.createdAt,
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
      // Only admin can view other users
      if (req.user?.role !== 'admin' && req.user?.id !== req.params.id) {
        return next(new AppError('Access denied', 403));
      }

      const user = users.find((u) => u.id === req.params.id);
      if (!user) {
        return next(new AppError('User not found', 404));
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          employeeId: user.employeeId,
          department: user.department,
          position: user.position,
          role: user.role,
          createdAt: user.createdAt,
        },
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
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      // Only admin can update other users
      if (req.user?.role !== 'admin' && req.user?.id !== req.params.id) {
        return next(new AppError('Access denied', 403));
      }

      const index = users.findIndex((u) => u.id === req.params.id);
      if (index === -1) {
        return next(new AppError('User not found', 404));
      }

      const { name, department, position } = req.body;

      users[index] = {
        ...users[index],
        name: name || users[index].name,
        department: department || users[index].department,
        position: position || users[index].position,
        updatedAt: new Date().toISOString(),
      };

      res.json({
        success: true,
        data: {
          id: users[index].id,
          email: users[index].email,
          name: users[index].name,
          employeeId: users[index].employeeId,
          department: users[index].department,
          position: users[index].position,
          role: users[index].role,
        },
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

      const index = users.findIndex((u) => u.id === req.params.id);
      if (index === -1) {
        return next(new AppError('User not found', 404));
      }

      users[index] = {
        ...users[index],
        role: req.body.role,
        updatedAt: new Date().toISOString(),
      };

      res.json({
        success: true,
        data: users[index],
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
      // Only admin can view other users' stats
      if (req.user?.role !== 'admin' && req.user?.id !== req.params.id) {
        return next(new AppError('Access denied', 403));
      }

      // Mock statistics
      res.json({
        success: true,
        data: {
          totalPapers: 15,
          totalApplications: 12,
          approvedApplications: 10,
          totalRewards: 850000,
          sciPapers: 8,
          nonSciPapers: 7,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
