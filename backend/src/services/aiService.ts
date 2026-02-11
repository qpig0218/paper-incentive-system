import fs from 'fs';
import path from 'path';
import type { AIAnalysisResult, PaperType } from '../types/index.js';
import OpenAI from 'openai';

// Azure OpenAI client
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_KEY || process.env.OPENAI_API_KEY || '',
  baseURL: process.env.AZURE_OPENAI_ENDPOINT
    ? `${process.env.AZURE_OPENAI_ENDPOINT}`
    : undefined,
  defaultQuery: process.env.AZURE_OPENAI_ENDPOINT
    ? { 'api-version': '2024-12-01-preview' }
    : undefined,
  defaultHeaders: process.env.AZURE_OPENAI_ENDPOINT
    ? { 'api-key': process.env.AZURE_OPENAI_KEY || '' }
    : undefined,
});

export async function analyzeAIService(filePath: string): Promise<AIAnalysisResult> {
  try {
    // Try to use AI for analysis
    const pdfParse = await import('pdf-parse');
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse.default(pdfBuffer);
    const pdfText = pdfData.text.substring(0, 4000); // Limit text length

    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert at analyzing academic papers. Analyze the following paper text and extract structured information. Return a JSON object with:
{
  "paperType": "original|case_report|review|letter|note|communication|image",
  "confidence": 0.0-1.0,
  "extractedFields": {
    "title": "paper title",
    "authors": ["author names"],
    "journal": "journal name",
    "volume": "volume",
    "issue": "issue",
    "pages": "pages",
    "doi": "DOI if found",
    "abstract": "abstract text"
  },
  "contentAnalysis": {
    "hasHolisticCare": true/false,
    "hasMedicalQuality": true/false,
    "hasMedicalEducation": true/false,
    "themes": ["theme keywords"]
  }
}`
        },
        { role: 'user', content: pdfText }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        paperType: parsed.paperType || 'original',
        confidence: parsed.confidence || 0.7,
        extractedFields: parsed.extractedFields || {},
        contentAnalysis: parsed.contentAnalysis || {
          hasHolisticCare: false,
          hasMedicalQuality: false,
          hasMedicalEducation: false,
          themes: [],
        },
        journalInfo: undefined,
        suggestedReward: undefined,
      } as AIAnalysisResult;
    }
  } catch (error) {
    console.error('AI analysis error, falling back to mock:', error);
  }

  // Fallback mock result
  const mockResult: AIAnalysisResult = {
    paperType: 'original',
    confidence: 0.92,
    extractedFields: {
      title: 'Paper Analysis Unavailable',
      authors: [],
      journal: '',
      volume: '',
      issue: '',
      pages: '',
      doi: '',
      abstract: '',
    },
    contentAnalysis: {
      hasHolisticCare: false,
      hasMedicalQuality: false,
      hasMedicalEducation: false,
      themes: [],
    },
    journalInfo: undefined,
    suggestedReward: undefined,
  };
  return mockResult;
}

export async function classifyPaperType(
  title: string,
  abstract?: string,
  content?: string
): Promise<{ type: PaperType; confidence: number }> {
  try {
    const text = `Title: ${title}\nAbstract: ${abstract || ''}\nContent: ${content || ''}`;
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Classify this paper into one of: original, case_report, review, letter, note, communication, image, abstract_poster, abstract_oral, comment, book_chapter, translation. Return JSON: {"type": "...", "confidence": 0.0-1.0}'
        },
        { role: 'user', content: text }
      ],
      max_tokens: 100,
      temperature: 0.2,
    });

    const respContent = response.choices[0]?.message?.content || '';
    const jsonMatch = respContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { type: parsed.type || 'original', confidence: parsed.confidence || 0.7 };
    }
  } catch (error) {
    console.error('AI classification error, using keyword fallback:', error);
  }

  // Keyword-based fallback
  const text = `${title} ${abstract || ''} ${content || ''}`.toLowerCase();
  if (text.includes('case report') || text.includes('病例報告')) return { type: 'case_report', confidence: 0.85 };
  if (text.includes('review') || text.includes('meta-analysis') || text.includes('綜說')) return { type: 'review', confidence: 0.80 };
  if (text.includes('letter') || text.includes('correspondence')) return { type: 'letter', confidence: 0.75 };
  if (text.includes('poster') || text.includes('海報')) return { type: 'abstract_poster', confidence: 0.90 };
  if (text.includes('oral presentation') || text.includes('口頭報告')) return { type: 'abstract_oral', confidence: 0.90 };
  return { type: 'original', confidence: 0.70 };
}

export async function lookupJournalInfo(journalName: string): Promise<{
  name: string;
  isSci: boolean;
  isSsci: boolean;
  impactFactor?: number;
  quartile?: string;
} | null> {
  // Mock journal database
  const journals: Record<string, any> = {
    'journal of medical internet research': {
      name: 'Journal of Medical Internet Research',
      isSci: true, isSsci: false, impactFactor: 5.428, quartile: 'Q1',
    },
    'circulation': {
      name: 'Circulation',
      isSci: true, isSsci: false, impactFactor: 39.918, quartile: 'Q1',
    },
    'bmc cardiovascular disorders': {
      name: 'BMC Cardiovascular Disorders',
      isSci: true, isSsci: false, impactFactor: 2.078, quartile: 'Q3',
    },
    '醫療品質雜誌': { name: '醫療品質雜誌', isSci: false, isSsci: false },
    '醫學教育': { name: '醫學教育', isSci: false, isSsci: false },
  };

  const normalizedName = journalName.toLowerCase().trim();
  return journals[normalizedName] || null;
}

export interface ExcelAIAnalysis {
  summary: string;
  insights: string[];
  dataPatterns: string[];
  recommendations: string[];
  keyFindings: string[];
}

export async function analyzeExcelWithAI(
  fullTextContent: string,
  fileName: string
): Promise<ExcelAIAnalysis> {
  const truncated = fullTextContent.substring(0, 100000);

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `你是一位擅長分析學術資料的 AI 助理。請以繁體中文回覆。
分析以下 Excel 檔案的完整內容，提供結構化分析結果。
請回傳 JSON 格式：
{
  "summary": "資料摘要（200字以內）",
  "insights": ["洞見1", "洞見2", ...],
  "dataPatterns": ["資料模式1", "資料模式2", ...],
  "recommendations": ["建議1", "建議2", ...],
  "keyFindings": ["關鍵發現1", "關鍵發現2", ...]
}

分析面向：
1. 資料結構與完整性
2. 與論文/學術研究的相關性
3. 數據模式與趨勢
4. 潛在問題或缺漏
5. 改善建議`
        },
        {
          role: 'user',
          content: `檔案名稱: ${fileName}\n\n${truncated}`
        }
      ],
      max_tokens: 3000,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: parsed.summary || '分析完成',
        insights: parsed.insights || [],
        dataPatterns: parsed.dataPatterns || [],
        recommendations: parsed.recommendations || [],
        keyFindings: parsed.keyFindings || [],
      };
    }
  } catch (error) {
    console.error('Excel AI analysis error, using fallback:', error);
  }

  // Fallback result
  return {
    summary: `已解析檔案「${fileName}」，但 AI 分析暫時無法使用。以下為基本資料摘要。`,
    insights: ['資料已成功解析', '建議手動檢視內容'],
    dataPatterns: ['需要進一步分析以識別資料模式'],
    recommendations: ['請確認資料完整性', '可嘗試重新進行 AI 分析'],
    keyFindings: ['檔案已成功上傳並解析'],
  };
}

export async function askAboutExcel(
  fullTextContent: string,
  question: string
): Promise<string> {
  const truncated = fullTextContent.substring(0, 100000);

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `你是一位擅長分析學術資料的 AI 助理。請以繁體中文回覆。
以下是一份 Excel 檔案的完整內容，請根據使用者的問題提供準確的回答。`
        },
        {
          role: 'user',
          content: `Excel 內容:\n${truncated}\n\n問題: ${question}`
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || '無法產生回答';
  } catch (error) {
    console.error('Excel Q&A error:', error);
    return '抱歉，AI 分析暫時無法使用，請稍後再試。';
  }
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

  const hasHolisticCare =
    text.includes('全人照護') || text.includes('holistic care') || text.includes('patient-centered');
  const hasMedicalQuality =
    text.includes('醫療品質') || text.includes('病人安全') || text.includes('medical quality') ||
    text.includes('patient safety') || text.includes('quality improvement');
  const hasMedicalEducation =
    text.includes('醫學教育') || text.includes('medical education') ||
    text.includes('clinical teaching') || text.includes('residency training');

  const themes: string[] = [];
  if (hasHolisticCare) themes.push('全人照護');
  if (hasMedicalQuality) themes.push('醫品病安');
  if (hasMedicalEducation) themes.push('醫學教育');

  return { hasHolisticCare, hasMedicalQuality, hasMedicalEducation, themes };
}
