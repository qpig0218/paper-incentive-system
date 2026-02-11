import { Router, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { AppError } from '../middleware/errorHandler.js';
import prisma from '../lib/prisma.js';

const router = Router();

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
      const type = req.query.type as string | undefined;
      const search = req.query.search as string | undefined;

      const where: any = {};

      if (type) {
        where.paperType = type.toUpperCase();
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { titleChinese: { contains: search, mode: 'insensitive' } },
          { authors: { some: { name: { contains: search, mode: 'insensitive' } } } },
        ];
      }

      const [papers, total] = await Promise.all([
        prisma.paper.findMany({
          where,
          include: {
            authors: { orderBy: { order: 'asc' } },
            journalInfo: true,
            conferenceInfo: true,
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.paper.count({ where }),
      ]);

      const data = papers.map((p) => ({
        id: p.id,
        title: p.title,
        titleChinese: p.titleChinese,
        authors: p.authors.map((a) => ({
          id: a.id,
          name: a.name,
          affiliation: a.affiliation,
          department: a.department,
          isFirst: a.isFirst,
          isCorresponding: a.isCorresponding,
          order: a.order,
        })),
        paperType: p.paperType.toLowerCase(),
        journalInfo: p.journalInfo ? {
          name: p.journalInfo.name,
          isSci: p.journalInfo.isSci,
          isSsci: p.journalInfo.isSsci,
          impactFactor: p.journalInfo.impactFactor,
          quartile: p.journalInfo.quartile,
          ranking: p.journalInfo.ranking,
          totalInField: p.journalInfo.totalInField,
          category: p.journalInfo.category,
        } : undefined,
        conferenceInfo: p.conferenceInfo ? {
          name: p.conferenceInfo.name,
          location: p.conferenceInfo.location,
          date: p.conferenceInfo.date?.toISOString(),
          type: p.conferenceInfo.type.toLowerCase(),
          presentationType: p.conferenceInfo.presentationType.toLowerCase(),
        } : undefined,
        publicationDate: p.publicationDate?.toISOString().split('T')[0],
        volume: p.volume,
        issue: p.issue,
        pages: p.pages,
        doi: p.doi,
        pmid: p.pmid,
        pdfUrl: p.pdfUrl,
        createdAt: p.createdAt.toISOString().split('T')[0],
        updatedAt: p.updatedAt.toISOString().split('T')[0],
      }));

      res.json({
        success: true,
        data,
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

// Get my papers (papers submitted by the current user)
router.get(
  '/my',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const papers = await prisma.paper.findMany({
        where: { submittedById: req.user!.id },
        include: {
          authors: { orderBy: { order: 'asc' } },
          journalInfo: true,
          conferenceInfo: true,
        },
        orderBy: { publicationDate: 'desc' },
      });

      const data = papers.map((p) => ({
        id: p.id,
        title: p.title,
        titleChinese: p.titleChinese,
        authors: p.authors.map((a) => ({
          id: a.id,
          name: a.name,
          affiliation: a.affiliation,
          department: a.department,
          isFirst: a.isFirst,
          isCorresponding: a.isCorresponding,
          order: a.order,
        })),
        paperType: p.paperType.toLowerCase(),
        journalInfo: p.journalInfo ? {
          name: p.journalInfo.name,
          isSci: p.journalInfo.isSci,
          isSsci: p.journalInfo.isSsci,
          impactFactor: p.journalInfo.impactFactor,
          quartile: p.journalInfo.quartile,
          ranking: p.journalInfo.ranking,
          totalInField: p.journalInfo.totalInField,
          category: p.journalInfo.category,
        } : undefined,
        conferenceInfo: p.conferenceInfo ? {
          name: p.conferenceInfo.name,
          location: p.conferenceInfo.location,
          date: p.conferenceInfo.date?.toISOString(),
          type: p.conferenceInfo.type.toLowerCase(),
          presentationType: p.conferenceInfo.presentationType.toLowerCase(),
        } : undefined,
        publicationDate: p.publicationDate?.toISOString().split('T')[0],
        volume: p.volume,
        issue: p.issue,
        pages: p.pages,
        doi: p.doi,
        pmid: p.pmid,
        pdfUrl: p.pdfUrl,
        createdAt: p.createdAt.toISOString().split('T')[0],
        updatedAt: p.updatedAt.toISOString().split('T')[0],
      }));

      res.json({ success: true, data });
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
      const paper = await prisma.paper.findUnique({
        where: { id: req.params.id },
        include: {
          authors: { orderBy: { order: 'asc' } },
          journalInfo: true,
          conferenceInfo: true,
        },
      });

      if (!paper) {
        return next(new AppError('Paper not found', 404));
      }

      res.json({
        success: true,
        data: {
          id: paper.id,
          title: paper.title,
          titleChinese: paper.titleChinese,
          authors: paper.authors.map((a) => ({
            id: a.id,
            name: a.name,
            affiliation: a.affiliation,
            department: a.department,
            isFirst: a.isFirst,
            isCorresponding: a.isCorresponding,
            order: a.order,
          })),
          paperType: paper.paperType.toLowerCase(),
          journalInfo: paper.journalInfo ? {
            name: paper.journalInfo.name,
            isSci: paper.journalInfo.isSci,
            isSsci: paper.journalInfo.isSsci,
            impactFactor: paper.journalInfo.impactFactor,
            quartile: paper.journalInfo.quartile,
          } : undefined,
          publicationDate: paper.publicationDate?.toISOString().split('T')[0],
          volume: paper.volume,
          issue: paper.issue,
          pages: paper.pages,
          doi: paper.doi,
          pmid: paper.pmid,
          pdfUrl: paper.pdfUrl,
          createdAt: paper.createdAt.toISOString().split('T')[0],
          updatedAt: paper.updatedAt.toISOString().split('T')[0],
        },
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

      const { title, titleChinese, paperType, publicationDate, volume, issue, pages, doi, authors, journalInfo } = req.body;

      const paper = await prisma.paper.create({
        data: {
          title,
          titleChinese,
          paperType: paperType.toUpperCase(),
          publicationDate: publicationDate ? new Date(publicationDate) : undefined,
          volume,
          issue,
          pages,
          doi,
          submittedById: req.user!.id,
          authors: authors ? {
            create: authors.map((a: any, idx: number) => ({
              name: a.name,
              affiliation: a.affiliation || '奇美醫院',
              department: a.department,
              isFirst: idx === 0,
              isCorresponding: a.isCorresponding || false,
              order: idx + 1,
            })),
          } : undefined,
          journalInfo: journalInfo ? {
            create: {
              name: journalInfo.name,
              isSci: journalInfo.isSci || false,
              isSsci: journalInfo.isSsci || false,
              impactFactor: journalInfo.impactFactor,
              quartile: journalInfo.quartile?.toUpperCase(),
            },
          } : undefined,
        },
        include: {
          authors: { orderBy: { order: 'asc' } },
          journalInfo: true,
        },
      });

      res.status(201).json({
        success: true,
        data: {
          id: paper.id,
          title: paper.title,
          paperType: paper.paperType.toLowerCase(),
          createdAt: paper.createdAt.toISOString(),
          updatedAt: paper.updatedAt.toISOString(),
        },
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
      const existing = await prisma.paper.findUnique({ where: { id: req.params.id } });
      if (!existing) {
        return next(new AppError('Paper not found', 404));
      }

      const { title, titleChinese, paperType, publicationDate, volume, issue, pages, doi } = req.body;

      const paper = await prisma.paper.update({
        where: { id: req.params.id },
        data: {
          ...(title && { title }),
          ...(titleChinese !== undefined && { titleChinese }),
          ...(paperType && { paperType: paperType.toUpperCase() }),
          ...(publicationDate && { publicationDate: new Date(publicationDate) }),
          ...(volume !== undefined && { volume }),
          ...(issue !== undefined && { issue }),
          ...(pages !== undefined && { pages }),
          ...(doi !== undefined && { doi }),
        },
        include: {
          authors: { orderBy: { order: 'asc' } },
          journalInfo: true,
        },
      });

      res.json({
        success: true,
        data: {
          id: paper.id,
          title: paper.title,
          paperType: paper.paperType.toLowerCase(),
          updatedAt: paper.updatedAt.toISOString(),
        },
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
      const existing = await prisma.paper.findUnique({ where: { id: req.params.id } });
      if (!existing) {
        return next(new AppError('Paper not found', 404));
      }

      await prisma.paper.delete({ where: { id: req.params.id } });

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
