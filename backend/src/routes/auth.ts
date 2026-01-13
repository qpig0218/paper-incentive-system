import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { AppError } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Mock user database (replace with Prisma in production)
const users: Array<{
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin' | 'reviewer';
  department?: string;
  employeeId?: string;
}> = [
  {
    id: '1',
    email: 'admin@chimei.org.tw',
    password: '$2a$10$example', // bcrypt hash
    name: '系統管理員',
    role: 'admin',
    department: '資訊部',
    employeeId: 'CM000001',
  },
];

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

      // Find user
      const user = users.find((u) => u.email === email);
      if (!user) {
        return next(new AppError('帳號或密碼錯誤', 401));
      }

      // Verify password (for demo, accept any password)
      // In production: const isValid = await bcrypt.compare(password, user.password);

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
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

      // Check if email already exists
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        return next(new AppError('此電子郵件已被註冊', 400));
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = {
        id: (users.length + 1).toString(),
        email,
        password: hashedPassword,
        name,
        role: 'user' as const,
        department,
        employeeId,
      };
      users.push(newUser);

      // Generate token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
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
      const user = users.find((u) => u.id === req.user?.id);
      if (!user) {
        return next(new AppError('User not found', 404));
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
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
