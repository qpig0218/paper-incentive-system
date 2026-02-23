import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  User,
  BookOpen,
  Award,
  Save,
  Brain,
  AlertTriangle,
  Table,
  Lightbulb,
  MessageSquare,
  Loader2,
  Send,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import api from '../services/api';
import { aiApi } from '../services/api';
import type { AIAnalysisResult, ExcelAnalysisResult, PaperType, AuthorRole, Author } from '../types';

type Step = 'upload' | 'review' | 'author' | 'reward' | 'confirm';

const steps: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: 'upload', label: '上傳論文', icon: FileText },
  { id: 'review', label: '資料確認', icon: BookOpen },
  { id: 'author', label: '作者資訊', icon: User },
  { id: 'reward', label: '獎勵計算', icon: Award },
  { id: 'confirm', label: '確認送出', icon: CheckCircle },
];

const paperTypeLabels: Record<PaperType, string> = {
  original: '原著論文 (Original Article)',
  case_report: '病例報告 (Case Report)',
  review: '綜說文章 (Review Article)',
  letter: 'Letter',
  note: 'Note',
  communication: 'Communication',
  image: 'Image',
  abstract_poster: '海報發表',
  abstract_oral: '口頭報告',
  comment: 'Comment',
  book_chapter: '書籍章節',
  translation: '翻譯書籍',
};

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    titleChinese: '',
    paperType: 'original' as PaperType,
    journalName: '',
    volume: '',
    issue: '',
    pages: '',
    doi: '',
    publicationDate: '',
    impactFactor: '',
    isScis: false,
    authorRole: 'first' as AuthorRole,
    hasHolisticCare: false,
    hasMedicalQuality: false,
    hasMedicalEducation: false,
  });

  const [authors, setAuthors] = useState<Partial<Author>[]>([
    { name: '', affiliation: '奇美醫院', isFirst: true, isCorresponding: false, order: 1 },
  ]);

  const [reward, setReward] = useState({
    baseAmount: 0,
    bonuses: [] as { type: string; percentage: number; amount: number }[],
    totalAmount: 0,
  });

  // Excel analysis state
  const [uploadedFileType, setUploadedFileType] = useState<'pdf' | 'excel' | null>(null);
  const [excelResult, setExcelResult] = useState<ExcelAnalysisResult | null>(null);
  const [excelQuestion, setExcelQuestion] = useState('');
  const [excelAnswer, setExcelAnswer] = useState('');
  const [askingExcel, setAskingExcel] = useState(false);

  const handleFileSelect = (file: File) => {
    const isExcel = file.name.match(/\.xlsx?$/i) ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel';
    setUploadedFileType(isExcel ? 'excel' : 'pdf');
    setExcelResult(null);
    setExcelAnswer('');
  };

  const handleAnalyze = async (file: File) => {
    setIsAnalyzing(true);

    const isExcel = file.name.match(/\.xlsx?$/i) ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel';

    if (isExcel) {
      // Excel analysis flow
      try {
        const result = await aiApi.analyzeExcel(file);
        if (result.success && result.data) {
          setExcelResult(result.data);
        } else {
          alert('Excel 分析失敗，請稍後再試');
        }
      } catch (err) {
        console.error('Excel analysis error:', err);
        alert('Excel 分析發生錯誤，請稍後再試');
      } finally {
        setIsAnalyzing(false);
      }
      return;
    }

    // PDF analysis flow
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.success && data.data) {
        const result: AIAnalysisResult = data.data;
        setAnalysisResult(result);

        // Pre-fill form with extracted data
        setFormData((prev) => ({
          ...prev,
          title: result.extractedFields?.title || '',
          paperType: result.paperType || prev.paperType,
          journalName: result.extractedFields?.journal || '',
          volume: result.extractedFields?.volume || '',
          issue: result.extractedFields?.issue || '',
          pages: result.extractedFields?.pages || '',
          doi: result.extractedFields?.doi || '',
          impactFactor: result.journalInfo?.impactFactor?.toString() || '',
          isScis: result.journalInfo?.isSci || false,
          hasMedicalQuality: result.contentAnalysis?.hasMedicalQuality || false,
          hasHolisticCare: result.contentAnalysis?.hasHolisticCare || false,
          hasMedicalEducation: result.contentAnalysis?.hasMedicalEducation || false,
        }));

        // Pre-fill authors
        if (result.extractedFields?.authors) {
          setAuthors(
            result.extractedFields.authors.map((name, index) => ({
              name,
              affiliation: '奇美醫院',
              isFirst: index === 0,
              isCorresponding: false,
              order: index + 1,
            }))
          );
        }

        // Pre-fill reward
        if (result.suggestedReward) {
          setReward({
            baseAmount: result.suggestedReward.baseAmount,
            bonuses: result.suggestedReward.bonuses.map((b) => ({
              type: b.type,
              percentage: b.percentage,
              amount: b.amount,
            })),
            totalAmount: result.suggestedReward.totalAmount,
          });
        }

        setCurrentStep('review');
      } else {
        alert('AI 分析失敗：' + (data.message || '請稍後再試'));
      }
    } catch (err) {
      console.error('AI analysis error:', err);
      alert('AI 分析發生錯誤，請稍後再試');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAskExcel = async () => {
    if (!excelResult?.fileId || !excelQuestion.trim()) return;
    setAskingExcel(true);
    try {
      const result = await aiApi.askAboutExcel(excelResult.fileId, excelQuestion);
      if (result.success && result.data) {
        setExcelAnswer(result.data.answer);
      }
    } catch (err) {
      console.error('Excel Q&A error:', err);
      setExcelAnswer('抱歉，無法取得回答，請稍後再試。');
    } finally {
      setAskingExcel(false);
    }
  };

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Step 1: Create the paper
      const paperRes = await api.post('/papers', {
        title: formData.title,
        titleChinese: formData.titleChinese || undefined,
        paperType: formData.paperType,
        publicationDate: formData.publicationDate || undefined,
        volume: formData.volume || undefined,
        issue: formData.issue || undefined,
        pages: formData.pages || undefined,
        doi: formData.doi || undefined,
        authors: authors.map((a, idx) => ({
          name: a.name,
          affiliation: a.affiliation || '奇美醫院',
          isFirst: a.isFirst || false,
          isCorresponding: a.isCorresponding || false,
          order: idx + 1,
        })),
        journalInfo: formData.journalName ? {
          name: formData.journalName,
          isSci: formData.isScis,
          isSsci: false,
          impactFactor: formData.impactFactor ? parseFloat(formData.impactFactor) : undefined,
        } : undefined,
      });

      if (!paperRes.data.success) {
        alert('論文建立失敗：' + (paperRes.data.message || '請稍後再試'));
        return;
      }

      const paperId = paperRes.data.data.id;

      // Step 2: Submit application for the paper
      const appRes = await api.post('/applications', {
        paperId,
        applicantType: formData.authorRole === 'first' ? 'first_author' : formData.authorRole === 'corresponding' ? 'corresponding' : 'co_author',
        rewardAmount: reward.totalAmount || undefined,
      });

      if (appRes.data.success) {
        alert('申請已送出！');
        navigate('/my-papers');
      } else {
        alert('申請送出失敗：' + (appRes.data.message || '請稍後再試'));
      }
    } catch (err: unknown) {
      console.error('Submit error:', err);
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      alert('送出失敗：' + (e.response?.data?.message || e.message || '請稍後再試'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首頁
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">上傳論文申請獎勵</h1>
          <p className="text-slate-500 mt-1">請依步驟完成論文資料填寫與送出申請</p>
        </div>

        {/* Progress Steps */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = index < currentStepIndex;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isActive
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 ${
                        isActive ? 'text-primary-600 font-medium' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded ${
                        index < currentStepIndex ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-8"
          >
            {/* Step 1: Upload */}
            {currentStep === 'upload' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">上傳論文檔案</h2>
                  <p className="text-slate-500">
                    上傳論文 PDF 或 Excel 檔案後，AI 將自動分析並提取相關資訊
                  </p>
                </div>

                <FileUpload
                  onFileSelect={handleFileSelect}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  analysisResult={
                    analysisResult
                      ? { success: true, message: 'AI 分析完成，已自動填入論文資訊' }
                      : excelResult
                      ? { success: true, message: 'Excel 分析完成' }
                      : undefined
                  }
                  accept={{
                    'application/pdf': ['.pdf'],
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                    'application/vnd.ms-excel': ['.xls'],
                  }}
                  formatLabel="支援 PDF / Excel 格式"
                />

                {/* PDF Analysis Result */}
                {analysisResult && uploadedFileType === 'pdf' && (
                  <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-emerald-800">AI 分析結果</p>
                        <p className="text-sm text-emerald-600 mt-1">
                          辨識為：{paperTypeLabels[analysisResult.paperType]}（信心度：
                          {Math.round(analysisResult.confidence * 100)}%）
                        </p>
                        {analysisResult.journalInfo && (
                          <p className="text-sm text-emerald-600">
                            期刊 Impact Factor：{analysisResult.journalInfo.impactFactor?.toFixed(3)}
                            {analysisResult.journalInfo.quartile && ` (${analysisResult.journalInfo.quartile})`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Excel Analysis Result */}
                {excelResult && uploadedFileType === 'excel' && (
                  <div className="mt-6 space-y-4">
                    {/* Data Overview */}
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Table className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-emerald-800">Excel 資料概覽</p>
                          <div className="grid grid-cols-3 gap-4 mt-2">
                            <div className="text-center p-2 bg-white rounded-lg">
                              <p className="text-lg font-bold text-emerald-700">{excelResult.totalSheets}</p>
                              <p className="text-xs text-slate-500">工作表</p>
                            </div>
                            <div className="text-center p-2 bg-white rounded-lg">
                              <p className="text-lg font-bold text-emerald-700">{excelResult.totalRows.toLocaleString()}</p>
                              <p className="text-xs text-slate-500">資料列</p>
                            </div>
                            <div className="text-center p-2 bg-white rounded-lg">
                              <p className="text-lg font-bold text-emerald-700">{excelResult.totalCells.toLocaleString()}</p>
                              <p className="text-xs text-slate-500">儲存格</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Data Preview */}
                    {excelResult.sheets.map((sheet) => (
                      <div key={sheet.name} className="glass-card overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                          <h4 className="font-medium text-slate-700 flex items-center gap-2">
                            <Table className="w-4 h-4 text-emerald-500" />
                            {sheet.name}
                            <span className="text-xs text-slate-400">({sheet.rowCount} 列 × {sheet.columnCount} 欄)</span>
                          </h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                              <tr>
                                {sheet.headers.map((h) => (
                                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {sheet.preview.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  {sheet.headers.map((h) => (
                                    <td key={h} className="px-3 py-2 text-slate-700 whitespace-nowrap max-w-[200px] truncate">
                                      {String(row[h] ?? '')}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {sheet.rowCount > 5 && (
                          <div className="px-4 py-2 text-center text-xs text-slate-400 bg-slate-50 border-t">
                            顯示前 5 筆，共 {sheet.rowCount} 筆資料
                          </div>
                        )}
                      </div>
                    ))}

                    {/* AI Analysis */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-blue-800 mb-2">AI 分析結果</p>
                          <p className="text-sm text-blue-700 mb-3">{excelResult.aiAnalysis.summary}</p>

                          {excelResult.aiAnalysis.keyFindings.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-semibold text-blue-800 mb-1 flex items-center gap-1">
                                <Lightbulb className="w-3 h-3" /> 關鍵發現
                              </p>
                              <ul className="space-y-1">
                                {excelResult.aiAnalysis.keyFindings.map((f, i) => (
                                  <li key={i} className="text-sm text-blue-700 flex items-start gap-1">
                                    <span className="text-blue-400 mt-1">•</span> {f}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {excelResult.aiAnalysis.insights.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-semibold text-blue-800 mb-1">洞見</p>
                              <ul className="space-y-1">
                                {excelResult.aiAnalysis.insights.map((ins, i) => (
                                  <li key={i} className="text-sm text-blue-700 flex items-start gap-1">
                                    <span className="text-blue-400 mt-1">•</span> {ins}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {excelResult.aiAnalysis.recommendations.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-blue-800 mb-1">建議</p>
                              <ul className="space-y-1">
                                {excelResult.aiAnalysis.recommendations.map((rec, i) => (
                                  <li key={i} className="text-sm text-blue-700 flex items-start gap-1">
                                    <span className="text-blue-400 mt-1">•</span> {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ask AI about Excel */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary-500" />
                        向 AI 提問
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={excelQuestion}
                          onChange={(e) => setExcelQuestion(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAskExcel()}
                          placeholder="例如：這份資料中有哪些論文？"
                          className="input-field flex-1"
                        />
                        <button
                          onClick={handleAskExcel}
                          disabled={askingExcel || !excelQuestion.trim()}
                          className="btn-primary flex items-center gap-2 disabled:opacity-50"
                        >
                          {askingExcel ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {excelAnswer && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">{excelAnswer}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Review Data */}
            {currentStep === 'review' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">確認論文資訊</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      英文標題 *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input-field"
                      placeholder="論文英文標題"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      中文標題
                    </label>
                    <input
                      type="text"
                      value={formData.titleChinese}
                      onChange={(e) => setFormData({ ...formData, titleChinese: e.target.value })}
                      className="input-field"
                      placeholder="論文中文標題（選填）"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      論文類型 *
                    </label>
                    <select
                      value={formData.paperType}
                      onChange={(e) => setFormData({ ...formData, paperType: e.target.value as PaperType })}
                      className="input-field"
                    >
                      {Object.entries(paperTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      期刊名稱 *
                    </label>
                    <input
                      type="text"
                      value={formData.journalName}
                      onChange={(e) => setFormData({ ...formData, journalName: e.target.value })}
                      className="input-field"
                      placeholder="期刊名稱"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      卷 (Volume)
                    </label>
                    <input
                      type="text"
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="input-field"
                      placeholder="Volume"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      期 (Issue)
                    </label>
                    <input
                      type="text"
                      value={formData.issue}
                      onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                      className="input-field"
                      placeholder="Issue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      頁數 (Pages)
                    </label>
                    <input
                      type="text"
                      value={formData.pages}
                      onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                      className="input-field"
                      placeholder="e.g., 123-456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      DOI
                    </label>
                    <input
                      type="text"
                      value={formData.doi}
                      onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                      className="input-field"
                      placeholder="10.xxxx/xxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Impact Factor
                    </label>
                    <input
                      type="text"
                      value={formData.impactFactor}
                      onChange={(e) => setFormData({ ...formData, impactFactor: e.target.value })}
                      className="input-field"
                      placeholder="e.g., 5.428"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      出版日期
                    </label>
                    <input
                      type="date"
                      value={formData.publicationDate}
                      onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      期刊索引
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isScis}
                        onChange={(e) => setFormData({ ...formData, isScis: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-slate-700">SCI / SSCI 期刊</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Author Info */}
            {currentStep === 'author' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">作者資訊</h2>

                <div className="space-y-4">
                  {authors.map((author, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-slate-700">
                          作者 {index + 1}
                        </span>
                        {authors.length > 1 && (
                          <button
                            onClick={() => setAuthors(authors.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            移除
                          </button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          value={author.name || ''}
                          onChange={(e) => {
                            const newAuthors = [...authors];
                            newAuthors[index].name = e.target.value;
                            setAuthors(newAuthors);
                          }}
                          className="input-field"
                          placeholder="姓名"
                        />
                        <input
                          type="text"
                          value={author.affiliation || ''}
                          onChange={(e) => {
                            const newAuthors = [...authors];
                            newAuthors[index].affiliation = e.target.value;
                            setAuthors(newAuthors);
                          }}
                          className="input-field"
                          placeholder="服務單位"
                        />
                        <div className="flex items-center gap-4">
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={author.isFirst || false}
                              onChange={(e) => {
                                const newAuthors = [...authors];
                                newAuthors[index].isFirst = e.target.checked;
                                setAuthors(newAuthors);
                              }}
                              className="w-4 h-4 rounded"
                            />
                            <span className="text-sm">第一作者</span>
                          </label>
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={author.isCorresponding || false}
                              onChange={(e) => {
                                const newAuthors = [...authors];
                                newAuthors[index].isCorresponding = e.target.checked;
                                setAuthors(newAuthors);
                              }}
                              className="w-4 h-4 rounded"
                            />
                            <span className="text-sm">通訊作者</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setAuthors([
                      ...authors,
                      { name: '', affiliation: '奇美醫院', isFirst: false, isCorresponding: false, order: authors.length + 1 },
                    ])
                  }
                  className="btn-secondary w-full"
                >
                  + 新增作者
                </button>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">作者身份說明</p>
                      <ul className="list-disc list-inside space-y-1 text-amber-700">
                        <li>第一作者或通訊作者可獲全額獎勵</li>
                        <li>第二作者申請獎勵時，以獎勵金之 50% 計算</li>
                        <li>第三至第六作者申請時，以獎勵金之 20% 計算</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Reward Calculation */}
            {currentStep === 'reward' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">獎勵金額計算</h2>

                {/* Bonus Themes */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h3 className="font-medium text-slate-700 mb-3">主題加成（可複選）</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.hasHolisticCare}
                        onChange={(e) => setFormData({ ...formData, hasHolisticCare: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span>全人照護主題</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.hasMedicalQuality}
                        onChange={(e) => setFormData({ ...formData, hasMedicalQuality: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span>醫品病安主題</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.hasMedicalEducation}
                        onChange={(e) => setFormData({ ...formData, hasMedicalEducation: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span>醫學教育主題</span>
                    </label>
                  </div>
                </div>

                {/* Reward Breakdown */}
                <div className="p-6 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl">
                  <h3 className="font-semibold text-slate-800 mb-4">獎勵金額明細</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">基本獎勵</span>
                      <span className="font-medium">NT$ {reward.baseAmount.toLocaleString()}</span>
                    </div>

                    {reward.bonuses.map((bonus, index) => (
                      <div key={index} className="flex justify-between items-center text-emerald-600">
                        <span>+ {bonus.type} ({bonus.percentage}%)</span>
                        <span className="font-medium">NT$ {bonus.amount.toLocaleString()}</span>
                      </div>
                    ))}

                    <div className="border-t border-slate-200 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg text-slate-800">預估總獎勵</span>
                        <span className="font-bold text-2xl text-primary-600">
                          NT$ {reward.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-500 text-center">
                  * 最終獎勵金額以審核結果為準
                </p>
              </div>
            )}

            {/* Step 5: Confirm */}
            {currentStep === 'confirm' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">確認送出申請</h2>
                  <p className="text-slate-500">
                    請確認以下資訊無誤後送出申請
                  </p>
                </div>

                {/* Summary */}
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h3 className="font-medium text-slate-700 mb-2">論文資訊</h3>
                    <p className="text-slate-800">{formData.title}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {formData.journalName} • {paperTypeLabels[formData.paperType]}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h3 className="font-medium text-slate-700 mb-2">作者</h3>
                    <p className="text-slate-800">
                      {authors.map((a) => a.name).join(', ')}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">預估獎勵金額</span>
                      <span className="font-bold text-xl text-primary-600">
                        NT$ {reward.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={goToPrevStep}
                disabled={currentStepIndex === 0}
                className={`btn-secondary flex items-center gap-2 ${
                  currentStepIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                上一步
              </button>

              {currentStep === 'confirm' ? (
                <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {submitting ? '送出中...' : '送出申請'}
                </button>
              ) : currentStep === 'upload' && !analysisResult && !excelResult ? (
                <button disabled className="btn-primary opacity-50 cursor-not-allowed flex items-center gap-2">
                  請先上傳並分析檔案
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={goToNextStep} className="btn-primary flex items-center gap-2">
                  下一步
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Upload;
