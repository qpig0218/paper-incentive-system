import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
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
  UserCheck,
  ShieldCheck,
  MessageSquare,
  Check,
  X,
  RotateCcw,
  ExternalLink,
  Calculator,
  ClipboardCheck,
  History,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type {
  Announcement,
  ApplicantType,
  ApplicationStatus,
  ApprovalLevel,
  ApprovalStatus,
  ApplicationWithWorkflow,
  VerificationChecklist,
} from '../types';

// Mock data for applications with workflow
const mockApplicationsWithWorkflow: ApplicationWithWorkflow[] = [
  {
    id: 'app1',
    paperId: '1',
    applicantId: 'user1',
    applicantName: '王大明',
    applicantDepartment: '心臟內科',
    applicantType: 'first_author' as ApplicantType,
    status: 'pending' as ApplicationStatus,
    rewardAmount: 85000,
    rewardCalculation: {
      baseAmount: 60000,
      bonuses: [
        { type: 'impact_factor', description: 'IF 5.428 加成', percentage: 20, amount: 12000 },
        { type: 'first_author', description: '第一作者加成', percentage: 15, amount: 9000 },
        { type: 'q1_journal', description: 'Q1 期刊加成', percentage: 10, amount: 6000 },
      ],
      deductions: [
        { type: 'multi_author', description: '多作者分攤', percentage: 2, amount: 2000 },
      ],
      totalAmount: 85000,
      formula: '60000 + 12000 + 9000 + 6000 - 2000 = 85000',
    },
    submittedAt: '2024-03-20',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    currentApprovalLevel: 'reviewer',
    approvalSteps: [
      {
        id: 'step1',
        applicationId: 'app1',
        level: 'reviewer',
        status: 'pending',
        createdAt: '2024-03-20',
      },
    ],
    paper: {
      id: '1',
      title: 'Machine Learning Approaches for Early Detection of Heart Failure: A Multi-Center Retrospective Study',
      titleChinese: '機器學習在心臟衰竭早期偵測之應用：多中心回顧性研究',
      authors: [
        { id: '1', name: '王大明', affiliation: '奇美醫院心臟內科', isFirst: true, isCorresponding: true, order: 1 },
        { id: '2', name: '李小華', affiliation: '奇美醫院心臟內科', isFirst: false, isCorresponding: false, order: 2 },
        { id: '3', name: '張文志', affiliation: '成功大學醫學院', isFirst: false, isCorresponding: false, order: 3 },
      ],
      paperType: 'original',
      journalInfo: {
        name: 'Journal of Medical Internet Research',
        issn: '1438-8871',
        isSci: true,
        isSsci: false,
        impactFactor: 5.428,
        quartile: 'Q1',
        ranking: 12,
        totalInField: 98,
      },
      publicationDate: '2024-03-15',
      volume: '26',
      issue: '3',
      pages: 'e45678',
      doi: '10.2196/45678',
      pmid: '38512345',
      createdAt: '2024-03-15',
      updatedAt: '2024-03-15',
    },
  },
  {
    id: 'app2',
    paperId: '2',
    applicantId: 'user2',
    applicantName: '陳醫師',
    applicantDepartment: '病理科',
    applicantType: 'corresponding' as ApplicantType,
    status: 'pending' as ApplicationStatus,
    rewardAmount: 120000,
    rewardCalculation: {
      baseAmount: 80000,
      bonuses: [
        { type: 'impact_factor', description: 'IF 39.918 加成', percentage: 40, amount: 32000 },
        { type: 'corresponding_author', description: '通訊作者加成', percentage: 10, amount: 8000 },
      ],
      deductions: [],
      totalAmount: 120000,
      formula: '80000 + 32000 + 8000 = 120000',
    },
    submittedAt: '2024-03-18',
    createdAt: '2024-03-18',
    updatedAt: '2024-03-18',
    currentApprovalLevel: 'supervisor',
    approvalSteps: [
      {
        id: 'step2a',
        applicationId: 'app2',
        level: 'reviewer',
        status: 'approved',
        approverId: 'reviewer1',
        approverName: '林審核員',
        comment: '資料確認無誤，獎勵金額計算正確。',
        createdAt: '2024-03-18',
        updatedAt: '2024-03-19',
      },
      {
        id: 'step2b',
        applicationId: 'app2',
        level: 'supervisor',
        status: 'pending',
        createdAt: '2024-03-19',
      },
    ],
    paper: {
      id: '2',
      title: 'Novel Biomarker for Cardiac Amyloidosis: A Breakthrough Discovery',
      titleChinese: '心臟類澱粉沉積症的新型生物標記：一項突破性發現',
      authors: [
        { id: '2', name: '陳醫師', affiliation: '奇美醫院病理科', isFirst: false, isCorresponding: true, order: 2 },
        { id: '4', name: '黃研究員', affiliation: '奇美醫院病理科', isFirst: true, isCorresponding: false, order: 1 },
      ],
      paperType: 'original',
      journalInfo: {
        name: 'Circulation',
        issn: '0009-7322',
        isSci: true,
        isSsci: false,
        impactFactor: 39.918,
        quartile: 'Q1',
        ranking: 1,
        totalInField: 145,
      },
      publicationDate: '2024-03-10',
      volume: '149',
      issue: '10',
      pages: '789-801',
      doi: '10.1161/CIRCULATIONAHA.124.012345',
      pmid: '38498765',
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
    },
  },
  {
    id: 'app3',
    paperId: '3',
    applicantId: 'user3',
    applicantName: '林護理師',
    applicantDepartment: '護理部',
    applicantType: 'first_author' as ApplicantType,
    status: 'pending' as ApplicationStatus,
    rewardAmount: 25000,
    rewardCalculation: {
      baseAmount: 20000,
      bonuses: [
        { type: 'first_author', description: '第一作者加成', percentage: 15, amount: 3000 },
        { type: 'medical_education', description: '醫學教育主題加成', percentage: 10, amount: 2000 },
      ],
      deductions: [],
      totalAmount: 25000,
      formula: '20000 + 3000 + 2000 = 25000',
    },
    submittedAt: '2024-03-15',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
    currentApprovalLevel: 'director',
    approvalSteps: [
      {
        id: 'step3a',
        applicationId: 'app3',
        level: 'reviewer',
        status: 'approved',
        approverId: 'reviewer1',
        approverName: '林審核員',
        comment: '資料正確，符合醫學教育類論文獎勵標準。',
        createdAt: '2024-03-15',
        updatedAt: '2024-03-16',
      },
      {
        id: 'step3b',
        applicationId: 'app3',
        level: 'supervisor',
        status: 'approved',
        approverId: 'supervisor1',
        approverName: '張主任',
        comment: '同意核發獎勵。',
        createdAt: '2024-03-16',
        updatedAt: '2024-03-17',
      },
      {
        id: 'step3c',
        applicationId: 'app3',
        level: 'director',
        status: 'pending',
        createdAt: '2024-03-17',
      },
    ],
    paper: {
      id: '3',
      title: 'Implementing Simulation-Based Training in Nursing Education',
      titleChinese: '模擬訓練在護理教育的實施與成效',
      authors: [
        { id: '5', name: '林護理師', affiliation: '奇美醫院護理部', isFirst: true, isCorresponding: true, order: 1 },
      ],
      paperType: 'original',
      journalInfo: {
        name: '台灣醫學教育雜誌',
        isSci: false,
        isSsci: false,
        impactFactor: undefined,
      },
      publicationDate: '2024-03-01',
      volume: '28',
      issue: '1',
      pages: '45-58',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-01',
    },
  },
];

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: '114年度論文獎勵申請',
    content: '114年度論文獎勵申請截止日期為12月31日',
    type: 'urgent',
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'AI 自動辨識功能上線',
    content: '新增 AI 自動辨識論文功能',
    type: 'success',
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    createdAt: '2024-01-01',
  },
];

// Approval level configuration
const approvalLevelConfig: Record<ApprovalLevel, { label: string; icon: React.ElementType; color: string }> = {
  reviewer: { label: '審核員', icon: FileCheck, color: 'from-blue-500 to-cyan-500' },
  supervisor: { label: '科主任', icon: UserCheck, color: 'from-amber-500 to-orange-500' },
  director: { label: '院長室', icon: ShieldCheck, color: 'from-emerald-500 to-teal-500' },
};

const approvalStatusConfig: Record<ApprovalStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: '待審核', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  approved: { label: '已核准', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  rejected: { label: '已退件', color: 'text-red-700', bgColor: 'bg-red-100' },
  returned: { label: '退回修改', color: 'text-blue-700', bgColor: 'bg-blue-100' },
};

// Dashboard Component
const AdminDashboard: React.FC = () => {
  const stats = [
    { label: '待審核申請', value: 12, icon: Clock, color: 'from-amber-500 to-orange-500' },
    { label: '本月核准', value: 28, icon: CheckCircle, color: 'from-emerald-500 to-teal-500' },
    { label: '本月退件', value: 3, icon: XCircle, color: 'from-red-500 to-rose-500' },
    { label: '總獎勵金額', value: 'NT$ 458萬', icon: BarChart3, color: 'from-primary-500 to-blue-500' },
  ];

  const levelStats = [
    { level: 'reviewer' as ApprovalLevel, count: 5 },
    { level: 'supervisor' as ApprovalLevel, count: 4 },
    { level: 'director' as ApprovalLevel, count: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
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

      {/* Approval Pipeline */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">審核流程進度</h3>
        <div className="flex items-center justify-between">
          {levelStats.map((item, index) => {
            const config = approvalLevelConfig[item.level];
            return (
              <React.Fragment key={item.level}>
                <div className="flex-1 text-center">
                  <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center mb-2`}>
                    <config.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-medium text-slate-800">{config.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{item.count}</p>
                  <p className="text-xs text-slate-500">待審核</p>
                </div>
                {index < levelStats.length - 1 && (
                  <ChevronRight className="w-8 h-8 text-slate-300 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
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
          {mockApplicationsWithWorkflow.slice(0, 5).map((app) => {
            const levelConfig = approvalLevelConfig[app.currentApprovalLevel];
            return (
              <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${levelConfig.color} rounded-lg flex items-center justify-center`}>
                    <levelConfig.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 line-clamp-1">{app.paper.title}</p>
                    <p className="text-sm text-slate-600">{app.applicantName} · {app.applicantDepartment}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-primary-600 font-semibold">
                      NT$ {(app.rewardAmount || 0).toLocaleString()}
                    </span>
                    <p className="text-xs text-slate-500">{levelConfig.label}審核中</p>
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

// Review Detail Component - Comprehensive paper review page
const ReviewDetail: React.FC = () => {
  const navigate = useNavigate();
  const [application] = useState<ApplicationWithWorkflow>(mockApplicationsWithWorkflow[0]);
  const [checklist, setChecklist] = useState<VerificationChecklist>({
    paperInfoCorrect: false,
    authorInfoCorrect: false,
    journalInfoCorrect: false,
    impactFactorVerified: false,
    rewardCalculationCorrect: false,
    documentsComplete: false,
    notes: '',
  });
  const [comment, setComment] = useState('');
  const [showRewardDetail, setShowRewardDetail] = useState(false);
  const [adjustedReward, setAdjustedReward] = useState(application.rewardAmount || 0);

  const allChecked = Object.entries(checklist)
    .filter(([key]) => key !== 'notes')
    .every(([, value]) => value === true);

  const handleApprove = () => {
    console.log('Approve with checklist:', checklist, 'comment:', comment, 'adjusted reward:', adjustedReward);
    navigate('/admin/applications');
  };

  const handleReject = () => {
    console.log('Reject with comment:', comment);
    navigate('/admin/applications');
  };

  const handleReturn = () => {
    console.log('Return for revision with comment:', comment);
    navigate('/admin/applications');
  };

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
        <div className={`px-4 py-2 rounded-full ${approvalStatusConfig.pending.bgColor} ${approvalStatusConfig.pending.color} font-medium`}>
          {approvalLevelConfig[application.currentApprovalLevel].label}審核中
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
                <label className="text-xs text-slate-500 uppercase tracking-wide">英文標題</label>
                <p className="text-slate-800 font-medium">{application.paper.title}</p>
              </div>
              {application.paper.titleChinese && (
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide">中文標題</label>
                  <p className="text-slate-800">{application.paper.titleChinese}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide">論文類型</label>
                  <p className="text-slate-800">原著論文</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide">發表日期</label>
                  <p className="text-slate-800">{application.paper.publicationDate}</p>
                </div>
              </div>
              {application.paper.doi && (
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide">DOI</label>
                  <a
                    href={`https://doi.org/${application.paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline flex items-center gap-1"
                  >
                    {application.paper.doi}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Author Information */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-500" />
                作者資訊
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

            <div className="space-y-3">
              {application.paper.authors.map((author, index) => (
                <div key={author.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-slate-800">{author.name}</p>
                      <p className="text-sm text-slate-500">{author.affiliation}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {author.isFirst && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        第一作者
                      </span>
                    )}
                    {author.isCorresponding && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                        通訊作者
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-800">
                <strong>申請人：</strong>{application.applicantName}（{application.applicantDepartment}）
                <br />
                <strong>申請身份：</strong>
                {application.applicantType === 'first_author' ? '第一作者' :
                 application.applicantType === 'corresponding' ? '通訊作者' : '共同作者'}
              </p>
            </div>
          </div>

          {/* Journal Information */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                期刊資訊
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

            {application.paper.journalInfo && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide">期刊名稱</label>
                  <p className="text-slate-800 font-medium">{application.paper.journalInfo.name}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wide">ISSN</label>
                    <p className="text-slate-800">{application.paper.journalInfo.issn || '-'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wide">SCI/SSCI</label>
                    <p className="text-slate-800">
                      {application.paper.journalInfo.isSci ? 'SCI' : ''}
                      {application.paper.journalInfo.isSsci ? 'SSCI' : ''}
                      {!application.paper.journalInfo.isSci && !application.paper.journalInfo.isSsci ? '非 SCI/SSCI' : ''}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wide">卷期</label>
                    <p className="text-slate-800">
                      {application.paper.volume && `Vol. ${application.paper.volume}`}
                      {application.paper.issue && `, No. ${application.paper.issue}`}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wide">頁數</label>
                    <p className="text-slate-800">{application.paper.pages || '-'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Impact Factor Verification */}
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

            {application.paper.journalInfo && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-primary-600">
                    {application.paper.journalInfo.impactFactor?.toFixed(3) || '-'}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">Impact Factor</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-amber-600">
                    {application.paper.journalInfo.quartile || '-'}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">JCR Quartile</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-emerald-600">
                    {application.paper.journalInfo.ranking || '-'}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">領域排名</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-slate-600">
                    {application.paper.journalInfo.totalInField || '-'}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">領域總數</p>
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
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

            <button
              onClick={() => setShowRewardDetail(!showRewardDetail)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <span className="text-sm font-medium text-slate-700">查看計算明細</span>
              {showRewardDetail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {showRewardDetail && application.rewardCalculation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">基本獎勵</span>
                      <span className="font-medium">NT$ {application.rewardCalculation.baseAmount.toLocaleString()}</span>
                    </div>

                    {application.rewardCalculation.bonuses.map((bonus, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-emerald-600">+ {bonus.description}</span>
                        <span className="font-medium text-emerald-600">+{bonus.amount.toLocaleString()}</span>
                      </div>
                    ))}

                    {application.rewardCalculation.deductions.map((deduction, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-red-600">- {deduction.description}</span>
                        <span className="font-medium text-red-600">-{deduction.amount.toLocaleString()}</span>
                      </div>
                    ))}

                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-500 font-mono">
                        {application.rewardCalculation.formula}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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

          {/* Approval History */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-primary-500" />
              簽核歷程
            </h3>

            <div className="relative">
              {application.approvalSteps.map((step, index) => {
                const levelConfig = approvalLevelConfig[step.level];
                const statusConfig = approvalStatusConfig[step.status];
                return (
                  <div key={step.id} className="relative pl-8 pb-6 last:pb-0">
                    {index < application.approvalSteps.length - 1 && (
                      <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-slate-200" />
                    )}
                    <div className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      step.status === 'approved' ? 'bg-emerald-500' :
                      step.status === 'rejected' ? 'bg-red-500' :
                      step.status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}>
                      {step.status === 'approved' ? <Check className="w-4 h-4 text-white" /> :
                       step.status === 'rejected' ? <X className="w-4 h-4 text-white" /> :
                       step.status === 'pending' ? <Clock className="w-4 h-4 text-white" /> :
                       <RotateCcw className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">{levelConfig.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusConfig.bgColor} ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      {step.approverName && (
                        <p className="text-sm text-slate-600">{step.approverName}</p>
                      )}
                      {step.comment && (
                        <p className="text-sm text-slate-500 mt-1 italic">"{step.comment}"</p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        {step.updatedAt || step.createdAt}
                      </p>
                    </div>
                  </div>
                );
              })}
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
          <div className="space-y-3">
            <button
              onClick={handleApprove}
              disabled={!allChecked}
              className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                allChecked
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              核准通過
            </button>
            <button
              onClick={handleReturn}
              className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              退回修改
            </button>
            <button
              onClick={handleReject}
              className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              <XCircle className="w-5 h-5" />
              退件
            </button>
          </div>

          {!allChecked && (
            <p className="text-sm text-amber-600 text-center">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              請完成所有檢核項目後才能核准
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Applications Management with Workflow
const AdminApplications: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<'all' | ApprovalLevel>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApplications = mockApplicationsWithWorkflow.filter((app) => {
    if (selectedLevel !== 'all' && app.currentApprovalLevel !== selectedLevel) return false;
    if (searchTerm && !app.paper.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !app.applicantName.includes(searchTerm)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedLevel('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedLevel === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全部
            </button>
            {(['reviewer', 'supervisor', 'director'] as ApprovalLevel[]).map((level) => {
              const config = approvalLevelConfig[level];
              return (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    selectedLevel === level
                      ? `bg-gradient-to-r ${config.color} text-white`
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <config.icon className="w-4 h-4" />
                  {config.label}
                </button>
              );
            })}
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
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">論文資訊</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">申請人</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">期刊</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">獎勵金額</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">審核階段</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredApplications.map((app) => {
              const levelConfig = approvalLevelConfig[app.currentApprovalLevel];
              return (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800 line-clamp-1 max-w-xs">{app.paper.title}</p>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      {app.paper.paperType === 'original' ? '原著論文' : '其他'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-800">{app.applicantName}</p>
                    <p className="text-xs text-slate-500">{app.applicantDepartment}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-800">{app.paper.journalInfo?.name}</p>
                    {app.paper.journalInfo?.impactFactor && (
                      <p className="text-xs text-primary-600">IF: {app.paper.journalInfo.impactFactor}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-primary-600">
                      NT$ {(app.rewardAmount || 0).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${levelConfig.color} text-white`}>
                      <levelConfig.icon className="w-3 h-3" />
                      {levelConfig.label}
                    </span>
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
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">沒有符合條件的申請</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Announcements Management
const AdminAnnouncements: React.FC = () => {
  const [announcements] = useState(mockAnnouncements);

  const typeColors = {
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    urgent: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">公告管理</h3>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新增公告
        </button>
      </div>

      <div className="glass-card overflow-hidden">
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[ann.type]}`}>
                    {ann.type === 'info' && '一般'}
                    {ann.type === 'success' && '成功'}
                    {ann.type === 'warning' && '警告'}
                    {ann.type === 'urgent' && '緊急'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ann.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {ann.isActive ? '啟用中' : '已停用'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {ann.startDate} ~ {ann.endDate}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Admin Component
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
              <Route path="users" element={
                <div className="glass-card p-6">
                  <h3 className="font-semibold text-slate-800 mb-4">使用者管理</h3>
                  <p className="text-slate-500">使用者管理功能開發中...</p>
                </div>
              } />
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
