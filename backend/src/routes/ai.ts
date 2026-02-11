import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { upload, isExcelFile } from '../middleware/upload.js';
import { AppError } from '../middleware/errorHandler.js';
import { analyzeAIService, analyzeExcelWithAI, askAboutExcel } from '../services/aiService.js';
import { parseExcelFile, filterExcelData } from '../services/excelService.js';
import type { ExcelParseResult } from '../services/excelService.js';
import { calculateReward } from '../services/rewardService.js';
import type { AIAnalysisResult, PaperType } from '../types/index.js';

const router = Router();

// In-memory cache for parsed Excel data
const excelCache = new Map<string, ExcelParseResult>();

// Analyze PDF with AI
router.post(
  '/analyze',
  authenticate,
  upload.single('file'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return next(new AppError('Please upload a PDF file', 400));
      }

      // Call AI service to analyze the PDF
      const result = await analyzeAIService(req.file.path);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Classify paper type
router.post(
  '/classify',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { title, abstract, content } = req.body;

      if (!title && !abstract && !content) {
        return next(new AppError('Please provide title, abstract, or content', 400));
      }

      // Mock classification result
      const paperTypes: { type: PaperType; probability: number }[] = [
        { type: 'original', probability: 0.75 },
        { type: 'case_report', probability: 0.15 },
        { type: 'review', probability: 0.10 },
      ];

      res.json({
        success: true,
        data: {
          predictedType: paperTypes[0].type,
          confidence: paperTypes[0].probability,
          allPredictions: paperTypes,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Look up journal information
router.get(
  '/journal',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { name, issn } = req.query;

      if (!name && !issn) {
        return next(new AppError('Please provide journal name or ISSN', 400));
      }

      // Mock journal lookup
      const journalInfo = {
        name: name || 'Journal of Medical Internet Research',
        abbreviation: 'J Med Internet Res',
        issn: issn || '1438-8871',
        isSci: true,
        isSsci: false,
        impactFactor: 5.428,
        quartile: 'Q1',
        ranking: 12,
        totalInField: 120,
        category: 'Medical Informatics',
      };

      res.json({
        success: true,
        data: journalInfo,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Calculate reward
router.post(
  '/calculate-reward',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        paperType,
        journalType,
        impactFactor,
        authorRole,
        hasHolisticCare,
        hasMedicalQuality,
        hasMedicalEducation,
        journalName,
      } = req.body;

      if (!paperType || !journalType) {
        return next(new AppError('Please provide paper type and journal type', 400));
      }

      const reward = calculateReward({
        paperType,
        journalType,
        impactFactor: impactFactor ? parseFloat(impactFactor) : undefined,
        authorRole: authorRole || 'first',
        hasHolisticCare: hasHolisticCare || false,
        hasMedicalQuality: hasMedicalQuality || false,
        hasMedicalEducation: hasMedicalEducation || false,
        journalName: journalName || '',
      });

      res.json({
        success: true,
        data: reward,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Analyze content themes
router.post(
  '/analyze-content',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { title, abstract, content } = req.body;

      // Mock content analysis
      const themes = {
        hasHolisticCare: false,
        hasMedicalQuality: true,
        hasMedicalEducation: false,
        detectedThemes: ['醫療品質', '病人安全', '人工智慧'],
        keywords: ['machine learning', 'early detection', 'heart failure'],
      };

      res.json({
        success: true,
        data: themes,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Analyze Excel file with AI
router.post(
  '/analyze-excel',
  authenticate,
  upload.single('file'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return next(new AppError('請上傳 Excel 檔案', 400));
      }

      if (!isExcelFile(req.file.mimetype)) {
        return next(new AppError('請上傳 Excel 格式檔案 (.xlsx, .xls)', 400));
      }

      // Parse Excel
      const parseResult = parseExcelFile(req.file.path, req.file.originalname);

      // Cache with file ID (use the generated filename without extension)
      const fileId = req.file.filename.replace(/\.[^/.]+$/, '');
      excelCache.set(fileId, parseResult);

      // AI analysis
      const aiResult = await analyzeExcelWithAI(parseResult.fullTextContent, req.file.originalname);

      res.json({
        success: true,
        data: {
          fileId,
          fileName: parseResult.fileName,
          totalSheets: parseResult.totalSheets,
          totalRows: parseResult.totalRows,
          totalCells: parseResult.totalCells,
          sheets: parseResult.sheets.map((s) => ({
            name: s.name,
            headers: s.headers,
            rowCount: s.rowCount,
            columnCount: s.columnCount,
            preview: s.rows.slice(0, 5),
          })),
          aiAnalysis: aiResult,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get parsed Excel data with filtering/pagination
router.get(
  '/excel-data/:fileId',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { fileId } = req.params;
      const parseResult = excelCache.get(fileId);

      if (!parseResult) {
        return next(new AppError('找不到已解析的 Excel 資料，請重新上傳', 404));
      }

      const filtered = filterExcelData(parseResult, {
        search: req.query.search as string | undefined,
        sheetName: req.query.sheetName as string | undefined,
        columns: req.query.columns ? (req.query.columns as string).split(',') : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      });

      res.json({
        success: true,
        data: filtered,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Ask AI about uploaded Excel
router.post(
  '/excel-ask',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { fileId, question } = req.body;

      if (!fileId || !question) {
        return next(new AppError('請提供 fileId 和問題', 400));
      }

      const parseResult = excelCache.get(fileId);
      if (!parseResult) {
        return next(new AppError('找不到已解析的 Excel 資料，請重新上傳', 404));
      }

      const answer = await askAboutExcel(parseResult.fullTextContent, question);

      res.json({
        success: true,
        data: { answer },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
