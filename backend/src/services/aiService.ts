import fs from 'fs';
import path from 'path';
import type { AIAnalysisResult, PaperType } from '../types/index.js';

// In production, use OpenAI API or other AI services
// import OpenAI from 'openai';

export async function analyzeAIService(filePath: string): Promise<AIAnalysisResult> {
  // Read PDF file
  // In production, use pdf-parse or OpenAI's document analysis

  // For now, return mock analysis result
  const mockResult: AIAnalysisResult = {
    paperType: 'original',
    confidence: 0.92,
    extractedFields: {
      title: 'Machine Learning Approaches for Early Detection of Heart Failure: A Systematic Review',
      authors: ['王大明', '李小華', '張醫師'],
      journal: 'Journal of Medical Internet Research',
      volume: '26',
      issue: '3',
      pages: 'e45678',
      doi: '10.2196/45678',
      abstract: 'This systematic review examines machine learning approaches for early detection of heart failure...',
    },
    contentAnalysis: {
      hasHolisticCare: false,
      hasMedicalQuality: true,
      hasMedicalEducation: false,
      themes: ['人工智慧', '機器學習', '心臟衰竭', '早期偵測'],
    },
    journalInfo: {
      name: 'Journal of Medical Internet Research',
      abbreviation: 'J Med Internet Res',
      isSci: true,
      isSsci: false,
      impactFactor: 5.428,
      quartile: 'Q1',
      ranking: 12,
      totalInField: 120,
      category: 'Medical Informatics',
    },
    suggestedReward: {
      baseAmount: 60000,
      bonuses: [
        {
          type: 'highImpact',
          description: 'IF ≧ 5 加成',
          percentage: 100,
          amount: 60000,
        },
      ],
      deductions: [],
      totalAmount: 120000,
      formula: '基本獎勵 NT$60,000 + IF加成 NT$60,000 = NT$120,000',
    },
  };

  return mockResult;
}

export async function classifyPaperType(
  title: string,
  abstract?: string,
  content?: string
): Promise<{ type: PaperType; confidence: number }> {
  // In production, use AI model for classification

  // Mock classification based on keywords
  const text = `${title} ${abstract || ''} ${content || ''}`.toLowerCase();

  if (text.includes('case report') || text.includes('病例報告')) {
    return { type: 'case_report', confidence: 0.85 };
  }

  if (text.includes('review') || text.includes('meta-analysis') || text.includes('綜說')) {
    return { type: 'review', confidence: 0.80 };
  }

  if (text.includes('letter') || text.includes('correspondence')) {
    return { type: 'letter', confidence: 0.75 };
  }

  if (text.includes('poster') || text.includes('海報')) {
    return { type: 'abstract_poster', confidence: 0.90 };
  }

  if (text.includes('oral presentation') || text.includes('口頭報告')) {
    return { type: 'abstract_oral', confidence: 0.90 };
  }

  // Default to original article
  return { type: 'original', confidence: 0.70 };
}

export async function lookupJournalInfo(journalName: string): Promise<{
  name: string;
  isSci: boolean;
  isSsci: boolean;
  impactFactor?: number;
  quartile?: string;
} | null> {
  // In production, query JCR database or API

  // Mock journal database
  const journals: Record<string, any> = {
    'journal of medical internet research': {
      name: 'Journal of Medical Internet Research',
      isSci: true,
      isSsci: false,
      impactFactor: 5.428,
      quartile: 'Q1',
    },
    'circulation': {
      name: 'Circulation',
      isSci: true,
      isSsci: false,
      impactFactor: 39.918,
      quartile: 'Q1',
    },
    'bmc cardiovascular disorders': {
      name: 'BMC Cardiovascular Disorders',
      isSci: true,
      isSsci: false,
      impactFactor: 2.078,
      quartile: 'Q3',
    },
    '醫療品質雜誌': {
      name: '醫療品質雜誌',
      isSci: false,
      isSsci: false,
    },
    '醫學教育': {
      name: '醫學教育',
      isSci: false,
      isSsci: false,
    },
  };

  const normalizedName = journalName.toLowerCase().trim();
  return journals[normalizedName] || null;
}

export async function analyzeContentThemes(
  title: string,
  abstract?: string,
  content?: string
): Promise<{
  hasHolisticCare: boolean;
  hasMedicalQuality: boolean;
  hasMedicalEducation: boolean;
  themes: string[];
}> {
  const text = `${title} ${abstract || ''} ${content || ''}`.toLowerCase();

  // Check for specific themes
  const hasHolisticCare =
    text.includes('全人照護') ||
    text.includes('holistic care') ||
    text.includes('patient-centered');

  const hasMedicalQuality =
    text.includes('醫療品質') ||
    text.includes('病人安全') ||
    text.includes('medical quality') ||
    text.includes('patient safety') ||
    text.includes('quality improvement');

  const hasMedicalEducation =
    text.includes('醫學教育') ||
    text.includes('medical education') ||
    text.includes('clinical teaching') ||
    text.includes('residency training');

  // Extract themes
  const themes: string[] = [];
  if (hasHolisticCare) themes.push('全人照護');
  if (hasMedicalQuality) themes.push('醫品病安');
  if (hasMedicalEducation) themes.push('醫學教育');

  return {
    hasHolisticCare,
    hasMedicalQuality,
    hasMedicalEducation,
    themes,
  };
}
