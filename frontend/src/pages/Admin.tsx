import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Bell,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Search,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  ArrowLeft,
  FileCheck,
  MessageSquare,
  Check,
  X,
  RotateCcw,
  Calculator,
  ClipboardCheck,
  History,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import api from '../services/api';
import type {
  Announcement,
  ApplicationStatus,
} from '../types';

// -------------------------------------------------------------------
// Shared types for API response shapes
// -------------------------------------------------------------------

interface ApiApplication {
  id: string;
  paperId: string;
  applicantId: string;
  applicantType: string;
  status: ApplicationStatus;
  rewardAmount: number | null;
  rewardFormula: string | null;
  hasHolisticCare: boolean;
  hasMedicalQuality: boolean;
  hasMedicalEducation: boolean;
  submittedAt: string;
  reviewedAt: string | null;
  reviewComment: string | null;
  reviewerId: string | null;
  paper: {
    id: string;
    title: string;
    paperType: string;
  };
  applicant: {
    id: string;
    name: string;
    department: string;
  };
}

interface ApiUser {
  id: string;
  employeeId?: string;
  name: string;
  email: string;
  department: string;
  position?: string;
  role?: string;
}

// Status badge config
const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: '待審核', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  approved: { label: '已核准', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  rejected: { label: '已退件', color: 'text-red-700', bgColor: 'bg-red-100' },
  revision: { label: '退回修改', color: 'text-blue-700', bgColor: 'bg-blue-100' },
};

const paperTypeLabels: Record<string, string> = {
  original: '原著論文',
  case_report: '個案報告',
  review: '回顧文章',
  letter: '讀者投書',
  note: '短篇報告',
  communication: '通訊',
  image: '影像報告',
  abstract_poster: '壁報摘要',
  abstract_oral: '口頭摘要',
  comment: '評論',
  book_chapter: '書籍章節',
  translation: '翻譯',
};

const applicantTypeLabels: Record<string, string> = {
  first_author: '第一作者',
  corresponding: '通訊作者',
  co_author: '共同作者',
};

// -------------------------------------------------------------------
// Dashboard Component
// -------------------------------------------------------------------
const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<ApiApplication[]>([]);
  const [paperCount, setPaperCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appRes, paperRes] = await Promise.all([
          api.get('/applications'),
          api.get('/papers', { params: { limit: 1 } }),
        ]);
        const apps: ApiApplication[] = appRes.data?.data ?? appRes.data?.applications ?? [];
        setApplications(apps);
        const pagination = paperRes.data?.pagination ?? {};
        setPaperCount(pagination.total ?? paperRes.data?.data?.length ?? 0);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'rejected').length;
  const totalReward = applications
    .filter((a) => a.status === 'approved')
    .reduce((sum, a) => sum + (a.rewardAmount ?? 0), 0);

  const stats = [
    { label: '待審核申請', value: pendingCount, icon: Clock, color: 'from-amber-500 to-orange-500' },
    { label: '已核准', value: approvedCount, icon: CheckCircle, color: 'from-emerald-500 to-teal-500' },
    { label: '已退件', value: rejectedCount, icon: XCircle, color: 'from-red-500 to-rose-500' },
    {
      label: '總獎勵金額',
      value: `NT$ ${totalReward.toLocaleString()}`,
      icon: BarChart3,
      color: 'from-primary-500 to-blue-500',
    },
  ];

  const summaryCards = [
    { label: '論文總數', value: paperCount, icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { label: '申請總數', value: applications.length, icon: FileCheck, color: 'from-amber-500 to-orange-500' },
    { label: '退回修改', value: applications.filter((a) => a.status === 'revision').length, icon: RotateCcw, color: 'from-indigo-500 to-purple-500' },
  ];

  const recentApps = [...applications]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-sm text-slate-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Summary Pipeline */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">系統總覽</h3>
        <div className="flex items-center justify-between">
          {summaryCards.map((item, index) => (
            <React.Fragment key={item.label}>
              <div className="flex-1 text-center">
                <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-2`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <p className="font-medium text-slate-800">{item.label}</p>
                <p className="text-2xl font-bold text-slate-800">{item.value}</p>
              </div>
              {index < summaryCards.length - 1 && (
                <ChevronRight className="w-8 h-8 text-slate-300 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">最新申請</h3>
          <Link to="/admin/applications" className="text-primary-600 text-sm hover:underline flex items-center gap-1">
            查看全部 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentApps.length === 0 && (
            <p className="text-slate-500 text-center py-8">目前沒有申請資料</p>
          )}
          {recentApps.map((app) => {
            const sc = statusConfig[app.status] ?? statusConfig.pending;
            return (
              <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sc.bgColor}`}>
                    {app.status === 'approved' ? <CheckCircle className={`w-5 h-5 ${sc.color}`} /> :
                     app.status === 'rejected' ? <XCircle className={`w-5 h-5 ${sc.color}`} /> :
                     app.status === 'revision' ? <RotateCcw className={`w-5 h-5 ${sc.color}`} /> :
                     <Clock className={`w-5 h-5 ${sc.color}`} />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 line-clamp-1">{app.paper?.title ?? '-'}</p>
                    <p className="text-sm text-slate-600">
                      {app.applicant?.name ?? '-'} · {app.applicant?.department ?? '-'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-primary-600 font-semibold">
                      NT$ {(app.rewardAmount ?? 0).toLocaleString()}
                    </span>
                    <p className={`text-xs ${sc.color}`}>{sc.label}</p>
                  </div>
                  <Link to={`/admin/review/${app.id}`} className="btn-secondary text-sm">
                    審核
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// Review Detail Component
// -------------------------------------------------------------------
const ReviewDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<ApiApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [comment, setComment] = useState('');
  const [adjustedReward, setAdjustedReward] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showRewardDetail, setShowRewardDetail] = useState(false);
  const [checklist, setChecklist] = useState({
    paperInfoCorrect: false,
    authorInfoCorrect: false,
    journalInfoCorrect: false,
    impactFactorVerified: false,
    rewardCalculationCorrect: false,
    documentsComplete: false,
  });

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/applications/${id}`);
        const app: ApiApplication = res.data?.data ?? res.data;
        setApplication(app);
        setAdjustedReward(app.rewardAmount ?? 0);
      } catch (err) {
        console.error('Failed to fetch application', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchApplication();
  }, [id]);

  const allChecked = Object.values(checklist).every((v) => v === true);

  const handleReview = async (status: 'approved' | 'rejected' | 'revision') => {
    if (!application) return;
    setSubmitting(true);
    try {
      await api.put(`/applications/${application.id}/review`, {
        status,
        comment,
        rewardAmount: status === 'approved' ? adjustedReward : undefined,
      });
      navigate('/admin/applications');
    } catch (err) {
      console.error('Review action failed', err);
      alert('操作失敗，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteApplication = async () => {
    if (!application) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/applications/${application.id}`);
      navigate('/admin/applications');
    } catch (err) {
      console.error('Delete failed', err);
      alert('刪除失敗，請稍後再試');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="glass-card p-6 text-center">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">找不到此申請</p>
        <button onClick={() => navigate('/admin/applications')} className="btn-secondary mt-4">
          返回列表
        </button>
      </div>
    );
  }

  const sc = statusConfig[application.status] ?? statusConfig.pending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/applications')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-800">論文審核</h2>
          <p className="text-sm text-slate-600">申請編號：{application.id}</p>
        </div>
        <div className={`px-4 py-2 rounded-full ${sc.bgColor} ${sc.color} font-medium`}>
          {sc.label}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Paper Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Paper Information */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                論文資訊
              </h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.paperInfoCorrect}
                  onChange={(e) => setChecklist({ ...checklist, paperInfoCorrect: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-600">資訊正確</span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide">論文標題</label>
                <p className="text-slate-800 font-medium">{application.paper?.title ?? '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide">論文類型</label>
                  <p className="text-slate-800">
                    {paperTypeLabels[application.paper?.paperType] ?? application.paper?.paperType ?? '-'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide">提交日期</label>
                  <p className="text-slate-800">{application.submittedAt ? new Date(application.submittedAt).toLocaleDateString('zh-TW') : '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Applicant Information */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-500" />
                申請人資訊
              </h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.authorInfoCorrect}
                  onChange={(e) => setChecklist({ ...checklist, authorInfoCorrect: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-600">資訊正確</span>
              </label>
            </div>

            <div className="p-3 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-800">
                <strong>申請人：</strong>{application.applicant?.name ?? '-'}（{application.applicant?.department ?? '-'}）
                <br />
                <strong>申請身份：</strong>
                {applicantTypeLabels[application.applicantType] ?? application.applicantType}
              </p>
            </div>
          </div>

          {/* Content Analysis Flags */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-500" />
                內容分析
              </h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.journalInfoCorrect}
                  onChange={(e) => setChecklist({ ...checklist, journalInfoCorrect: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-600">資訊正確</span>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl text-center ${application.hasHolisticCare ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                {application.hasHolisticCare ? (
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                ) : (
                  <XCircle className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                )}
                <p className="text-sm font-medium text-slate-700">全人照護</p>
              </div>
              <div className={`p-4 rounded-xl text-center ${application.hasMedicalQuality ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                {application.hasMedicalQuality ? (
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                ) : (
                  <XCircle className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                )}
                <p className="text-sm font-medium text-slate-700">醫療品質</p>
              </div>
              <div className={`p-4 rounded-xl text-center ${application.hasMedicalEducation ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                {application.hasMedicalEducation ? (
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                ) : (
                  <XCircle className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                )}
                <p className="text-sm font-medium text-slate-700">醫學教育</p>
              </div>
            </div>
          </div>

          {/* IF Verification placeholder */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-500" />
                Impact Factor 驗證
              </h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.impactFactorVerified}
                  onChange={(e) => setChecklist({ ...checklist, impactFactorVerified: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-600">已驗證</span>
              </label>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                請至 <a href="https://jcr.clarivate.com" target="_blank" rel="noopener noreferrer" className="underline">JCR 官網</a> 驗證 Impact Factor 資訊
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Reward & Actions */}
        <div className="space-y-6">
          {/* Reward Calculation */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary-500" />
                獎勵金計算
              </h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.rewardCalculationCorrect}
                  onChange={(e) => setChecklist({ ...checklist, rewardCalculationCorrect: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-600">金額正確</span>
              </label>
            </div>

            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-emerald-600">
                NT$ {adjustedReward.toLocaleString()}
              </p>
              <p className="text-sm text-slate-500 mt-1">預估獎勵金額</p>
            </div>

            {application.rewardFormula && (
              <>
                <button
                  onClick={() => setShowRewardDetail(!showRewardDetail)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <span className="text-sm font-medium text-slate-700">查看計算公式</span>
                  {showRewardDetail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <AnimatePresence>
                  {showRewardDetail && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 font-mono whitespace-pre-wrap">
                          {application.rewardFormula}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            <div className="mt-4">
              <label className="text-sm text-slate-600 block mb-2">調整獎勵金額</label>
              <input
                type="number"
                value={adjustedReward}
                onChange={(e) => setAdjustedReward(Number(e.target.value))}
                className="input-field w-full"
              />
            </div>
          </div>

          {/* Document Checklist */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-primary-500" />
                文件檢核
              </h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.documentsComplete}
                  onChange={(e) => setChecklist({ ...checklist, documentsComplete: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-600">文件齊全</span>
              </label>
            </div>

            <div className="space-y-2">
              {[
                { label: '論文 PDF 全文', checked: true },
                { label: '作者貢獻聲明', checked: true },
                { label: '期刊收稿證明', checked: true },
                { label: '出版證明', checked: false },
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50">
                  {doc.checked ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                  <span className={`text-sm ${doc.checked ? 'text-slate-700' : 'text-amber-700'}`}>
                    {doc.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review History */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-primary-500" />
              審核紀錄
            </h3>

            <div className="relative">
              <div className="relative pl-8 pb-4">
                <div className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  application.status === 'approved' ? 'bg-emerald-500' :
                  application.status === 'rejected' ? 'bg-red-500' :
                  application.status === 'revision' ? 'bg-blue-500' : 'bg-amber-500'
                }`}>
                  {application.status === 'approved' ? <Check className="w-4 h-4 text-white" /> :
                   application.status === 'rejected' ? <X className="w-4 h-4 text-white" /> :
                   application.status === 'revision' ? <RotateCcw className="w-4 h-4 text-white" /> :
                   <Clock className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">目前狀態</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${sc.bgColor} ${sc.color}`}>
                      {sc.label}
                    </span>
                  </div>
                  {application.reviewComment && (
                    <p className="text-sm text-slate-500 mt-1 italic">"{application.reviewComment}"</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    提交於 {new Date(application.submittedAt).toLocaleDateString('zh-TW')}
                    {application.reviewedAt && ` · 審核於 ${new Date(application.reviewedAt).toLocaleDateString('zh-TW')}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Review Comment */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary-500" />
              審核意見
            </h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="請輸入審核意見..."
              className="input-field w-full h-24 resize-none"
            />
          </div>

          {/* Action Buttons */}
          {application.status === 'pending' || application.status === 'revision' ? (
            <div className="space-y-3">
              <button
                onClick={() => handleReview('approved')}
                disabled={!allChecked || submitting}
                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  allChecked && !submitting
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                {submitting ? '處理中...' : '核准通過'}
              </button>
              <button
                onClick={() => handleReview('revision')}
                disabled={submitting}
                className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-5 h-5" />
                退回修改
              </button>
              <button
                onClick={() => handleReview('rejected')}
                disabled={submitting}
                className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-5 h-5" />
                退件
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={submitting}
                className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
                刪除申請
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="glass-card p-4 text-center">
                <p className={`font-medium ${sc.color}`}>此申請已{sc.label}</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 border-red-300 text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                刪除申請
              </button>
            </div>
          )}

          {!allChecked && (application.status === 'pending' || application.status === 'revision') && (
            <p className="text-sm text-amber-600 text-center">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              請完成所有檢核項目後才能核准
            </p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && application && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !deleteLoading && setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  application.status === 'approved' ? 'bg-red-100' : 'bg-amber-100'
                }`}>
                  <AlertCircle className={`w-6 h-6 ${
                    application.status === 'approved' ? 'text-red-600' : 'text-amber-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {application.status === 'approved' ? '刪除已核准申請' : '刪除申請'}
                  </h3>
                  <p className="text-sm text-slate-500">此操作無法復原</p>
                </div>
              </div>

              {application.status === 'approved' && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700 font-medium">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    警告：此申請已核准，獎勵金額為 NT$ {(application.rewardAmount ?? 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    刪除後相關獎勵紀錄將一併移除，請確認已完成相關行政作業。
                  </p>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl mb-4">
                <p className="text-sm text-slate-800 font-medium line-clamp-2">{application.paper?.title ?? '-'}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {application.applicant?.name ?? '-'} · {sc.label}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                  className="btn-secondary disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={handleDeleteApplication}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      刪除中...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      確認刪除
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// -------------------------------------------------------------------
// Applications Management
// -------------------------------------------------------------------
const AdminApplications: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApiApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'all' | ApplicationStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ApiApplication | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await api.get('/applications');
        const apps: ApiApplication[] = res.data?.data ?? res.data?.applications ?? [];
        setApplications(apps);
      } catch (err) {
        console.error('Failed to fetch applications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) => {
    if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (
        !(app.paper?.title ?? '').toLowerCase().includes(term) &&
        !(app.applicant?.name ?? '').toLowerCase().includes(term)
      ) {
        return false;
      }
    }
    return true;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/applications/${deleteTarget.id}`);
      setApplications((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete application', err);
      alert('刪除失敗，請稍後再試');
    } finally {
      setDeleting(false);
    }
  };

  const statusFilters: { key: 'all' | ApplicationStatus; label: string; color: string }[] = [
    { key: 'all', label: '全部', color: 'bg-primary-500 text-white' },
    { key: 'pending', label: '待審核', color: 'bg-amber-500 text-white' },
    { key: 'approved', label: '已核准', color: 'bg-emerald-500 text-white' },
    { key: 'rejected', label: '已退件', color: 'bg-red-500 text-white' },
    { key: 'revision', label: '退回修改', color: 'bg-blue-500 text-white' },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedStatus(filter.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === filter.key
                    ? filter.color
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter.label}
                {filter.key !== 'all' && (
                  <span className="ml-1 text-xs opacity-80">
                    ({applications.filter((a) => a.status === filter.key).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋論文或申請人..."
              className="input-field pl-10 w-64"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            匯出
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">論文資訊</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">申請人</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">申請身份</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">獎勵金額</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">狀態</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">提交日期</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.map((app) => {
                const sc = statusConfig[app.status] ?? statusConfig.pending;
                return (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800 line-clamp-1 max-w-xs">{app.paper?.title ?? '-'}</p>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                        {paperTypeLabels[app.paper?.paperType] ?? app.paper?.paperType ?? '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-800">{app.applicant?.name ?? '-'}</p>
                      <p className="text-xs text-slate-500">{app.applicant?.department ?? '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-800 text-sm">
                        {applicantTypeLabels[app.applicantType] ?? app.applicantType}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-primary-600">
                        NT$ {(app.rewardAmount ?? 0).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${sc.bgColor} ${sc.color}`}>
                        {app.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                        {app.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {app.status === 'pending' && <Clock className="w-3 h-3" />}
                        {app.status === 'revision' && <RotateCcw className="w-3 h-3" />}
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(app.submittedAt).toLocaleDateString('zh-TW')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/review/${app.id}`)}
                          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          審核
                        </button>
                        <button
                          onClick={() => setDeleteTarget(app)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="刪除申請"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {!loading && filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">沒有符合條件的申請</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !deleting && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  deleteTarget.status === 'approved' ? 'bg-red-100' : 'bg-amber-100'
                }`}>
                  <AlertCircle className={`w-6 h-6 ${
                    deleteTarget.status === 'approved' ? 'text-red-600' : 'text-amber-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {deleteTarget.status === 'approved' ? '刪除已核准申請' : '刪除申請'}
                  </h3>
                  <p className="text-sm text-slate-500">此操作無法復原</p>
                </div>
              </div>

              {deleteTarget.status === 'approved' && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700 font-medium">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    警告：此申請已核准，獎勵金額為 NT$ {(deleteTarget.rewardAmount ?? 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    刪除後相關獎勵紀錄將一併移除，請確認已完成相關行政作業。
                  </p>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl mb-4">
                <p className="text-sm text-slate-800 font-medium line-clamp-2">{deleteTarget.paper?.title ?? '-'}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {deleteTarget.applicant?.name ?? '-'} · {(statusConfig[deleteTarget.status] ?? statusConfig.pending).label}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="btn-secondary disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      刪除中...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      確認刪除
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// -------------------------------------------------------------------
// Announcements Management
// -------------------------------------------------------------------
const AdminAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAnn, setNewAnn] = useState({
    title: '',
    content: '',
    type: 'info' as Announcement['type'],
    startDate: '',
    endDate: '',
  });
  const [creating, setCreating] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/announcements');
      const data = res.data?.data ?? res.data ?? [];
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch announcements', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleCreate = async () => {
    if (!newAnn.title || !newAnn.content) return;
    setCreating(true);
    try {
      await api.post('/announcements', {
        ...newAnn,
        isActive: true,
      });
      setShowCreateModal(false);
      setNewAnn({ title: '', content: '', type: 'info', startDate: '', endDate: '' });
      await fetchAnnouncements();
    } catch (err) {
      console.error('Failed to create announcement', err);
      alert('建立公告失敗');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此公告？')) return;
    try {
      await api.delete(`/announcements/${id}`);
      await fetchAnnouncements();
    } catch (err) {
      console.error('Failed to delete announcement', err);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await api.put(`/announcements/${id}/toggle`);
      await fetchAnnouncements();
    } catch (err) {
      console.error('Failed to toggle announcement', err);
    }
  };

  const typeColors: Record<string, string> = {
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    urgent: 'bg-red-100 text-red-700',
  };

  const typeLabels: Record<string, string> = {
    info: '一般',
    success: '成功',
    warning: '警告',
    urgent: '緊急',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">公告管理</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          新增公告
        </button>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-slate-800 mb-4">新增公告</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">標題</label>
                  <input
                    type="text"
                    value={newAnn.title}
                    onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                    className="input-field w-full"
                    placeholder="輸入公告標題"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">內容</label>
                  <textarea
                    value={newAnn.content}
                    onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                    className="input-field w-full h-24 resize-none"
                    placeholder="輸入公告內容"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">類型</label>
                  <select
                    value={newAnn.type}
                    onChange={(e) => setNewAnn({ ...newAnn, type: e.target.value as Announcement['type'] })}
                    className="input-field w-full"
                  >
                    <option value="info">一般</option>
                    <option value="success">成功</option>
                    <option value="warning">警告</option>
                    <option value="urgent">緊急</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-600 block mb-1">開始日期</label>
                    <input
                      type="date"
                      value={newAnn.startDate}
                      onChange={(e) => setNewAnn({ ...newAnn, startDate: e.target.value })}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 block mb-1">結束日期</label>
                    <input
                      type="date"
                      value={newAnn.endDate}
                      onChange={(e) => setNewAnn({ ...newAnn, endDate: e.target.value })}
                      className="input-field w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating || !newAnn.title || !newAnn.content}
                  className="btn-primary disabled:opacity-50"
                >
                  {creating ? '建立中...' : '建立'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcements Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">標題</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">類型</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">狀態</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">期間</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {announcements.map((ann) => (
                <tr key={ann.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{ann.title}</p>
                    <p className="text-sm text-slate-500 line-clamp-1">{ann.content}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[ann.type] ?? 'bg-slate-100 text-slate-600'}`}>
                      {typeLabels[ann.type] ?? ann.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggle(ann.id)}
                      className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        ann.isActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {ann.isActive ? '啟用中' : '已停用'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {ann.startDate ? new Date(ann.startDate).toLocaleDateString('zh-TW') : '-'} ~ {ann.endDate ? new Date(ann.endDate).toLocaleDateString('zh-TW') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(ann.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                        title={ann.isActive ? '停用' : '啟用'}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ann.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="刪除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && announcements.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">目前沒有公告</p>
          </div>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// User Management
// -------------------------------------------------------------------
const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/users');
        const data = res.data?.data ?? res.data ?? [];
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      (u.email ?? '').toLowerCase().includes(term) ||
      (u.department ?? '').toLowerCase().includes(term) ||
      (u.employeeId ?? '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">使用者管理</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋使用者..."
            className="input-field pl-10 w-64"
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">姓名</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">員工編號</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">部門</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">職稱</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">角色</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
                        {user.name?.charAt(0) ?? '?'}
                      </div>
                      <span className="font-medium text-slate-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.employeeId ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.email ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.department ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.position ?? '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'reviewer' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {user.role === 'admin' ? '管理員' :
                       user.role === 'reviewer' ? '審核員' : '一般使用者'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">沒有符合條件的使用者</p>
          </div>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// Main Admin Component
// -------------------------------------------------------------------
const Admin: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: '總覽', icon: LayoutDashboard },
    { path: '/admin/applications', label: '申請審核', icon: FileText },
    { path: '/admin/users', label: '使用者管理', icon: Users },
    { path: '/admin/announcements', label: '公告管理', icon: Bell },
    { path: '/admin/settings', label: '系統設定', icon: Settings },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">管理後台</h1>
          <p className="text-slate-600 mt-1">管理論文申請、審核流程與系統設定</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="glass-card p-4 space-y-2 sticky top-24">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path ||
                  (item.path !== '/admin' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-primary-500 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="review/:id" element={<ReviewDetail />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={
                <div className="glass-card p-6">
                  <h3 className="font-semibold text-slate-800 mb-4">系統設定</h3>
                  <p className="text-slate-500">系統設定功能開發中...</p>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
