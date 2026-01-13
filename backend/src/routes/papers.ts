import { Router, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { AppError } from '../middleware/errorHandler.js';
import type { Paper, PaperType } from '../types/index.js';

const router = Router();

// Mock papers database
const papers: Paper[] = [
  {
    id: '1',
    title: 'Machine Learning Approaches for Early Detection of Heart Failure',
    titleChinese: '機器學習方法於心臟衰竭早期偵測之系統性回顧',
    authors: [
      { id: '1', name: '王大明', affiliation: '奇美醫院', isFirst: true, isCorresponding: true, order: 1 },
      { id: '2', name: '李小華', affiliation: '奇美醫院', isFirst: false, isCorresponding: false, order: 2 },
    ],
    paperType: 'original',
    journalInfo: {
      name: 'Journal of Medical Internet Research',
      isSci: true,
      isSsci: false,
      impactFactor: 5.428,
      quartile: 'Q1',
    },
    publicationDate: '2024-03-15',
    volume: '26',
    issue: '3',
    pages: 'e45678',
    doi: '10.2196/45678',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
  },
];

// Get all papers
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('type').optional().isString(),
    query('search').optional().isString(),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const type = req.query.type as PaperType | undefined;
      const search = req.query.search as string | undefined;

      let filteredPapers = [...papers];

      // Filter by type
      if (type) {
        filteredPapers = filteredPapers.filter((p) => p.paperType === type);
      }

      // Search
      if (search) {
        const searchLower = search.toLowerCase();
        filteredPapers = filteredPapers.filter(
          (p) =>
            p.title.toLowerCase().includes(searchLower) ||
            p.titleChinese?.toLowerCase().includes(searchLower) ||
            p.authors.some((a) => a.name.toLowerCase().includes(searchLower))
        );
      }

      // Pagination
      const total = filteredPapers.length;
      const startIndex = (page - 1) * limit;
      const paginatedPapers = filteredPapers.slice(startIndex, startIndex + limit);

      res.json({
        success: true,
        data: paginatedPapers,
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

// Get paper by ID
router.get(
  '/:id',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const paper = papers.find((p) => p.id === req.params.id);
      if (!paper) {
        return next(new AppError('Paper not found', 404));
      }

      res.json({
        success: true,
        data: paper,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create paper
router.post(
  '/',
  authenticate,
  [
    body('title').notEmpty().withMessage('請輸入論文標題'),
    body('paperType').notEmpty().withMessage('請選擇論文類型'),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const newPaper: Paper = {
        id: (papers.length + 1).toString(),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      papers.push(newPaper);

      res.status(201).json({
        success: true,
        data: newPaper,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update paper
router.put(
  '/:id',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const index = papers.findIndex((p) => p.id === req.params.id);
      if (index === -1) {
        return next(new AppError('Paper not found', 404));
      }

      papers[index] = {
        ...papers[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      res.json({
        success: true,
        data: papers[index],
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete paper
router.delete(
  '/:id',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const index = papers.findIndex((p) => p.id === req.params.id);
      if (index === -1) {
        return next(new AppError('Paper not found', 404));
      }

      papers.splice(index, 1);

      res.json({
        success: true,
        message: 'Paper deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Upload paper PDF
router.post(
  '/upload',
  authenticate,
  upload.single('file'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return next(new AppError('Please upload a file', 400));
      }

      res.json({
        success: true,
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          path: `/uploads/${req.file.filename}`,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
