import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { AppError } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import prisma from '../lib/prisma.js';

const router = Router();

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('請輸入有效的電子郵件'),
    body('password').notEmpty().withMessage('請輸入密碼'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return next(new AppError('帳號或密碼錯誤', 401));
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return next(new AppError('帳號或密碼錯誤', 401));
      }

      const role = user.role.toLowerCase() as 'user' | 'admin' | 'reviewer';

      const token = jwt.sign(
        { id: user.id, email: user.email, role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role,
            department: user.department,
            employeeId: user.employeeId,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Register
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('請輸入有效的電子郵件'),
    body('password').isLength({ min: 6 }).withMessage('密碼至少需要6個字元'),
    body('name').notEmpty().withMessage('請輸入姓名'),
    body('employeeId').notEmpty().withMessage('請輸入員工編號'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email, password, name, employeeId, department } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return next(new AppError('此電子郵件已被註冊', 400));
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          employeeId,
          department,
          role: 'USER',
        },
      });

      const role = 'user';
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
      );

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role,
            department: newUser.department,
            employeeId: newUser.employeeId,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get current user
router.get(
  '/me',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
      });
      if (!user) {
        return next(new AppError('User not found', 404));
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role.toLowerCase(),
          department: user.department,
          employeeId: user.employeeId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
