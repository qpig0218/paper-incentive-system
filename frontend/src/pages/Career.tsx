import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  FileText,
  TrendingUp,
  Calendar,
  Download,
  ChevronDown,
  BarChart3,
  PieChart,
  Brain,
  Target,
  Lightbulb,
  CheckCircle,
  Clock,
  XCircle,
  Sparkles,
  ArrowRight,
  Trophy,
  Briefcase,
} from 'lucide-react';
import type { CareerRecord, Paper } from '../types';

// Mock data
const mockCareerRecords: CareerRecord[] = [
  {
    id: '1',
    userId: 'user1',
    year: 2024,
    papers: [],
    totalReward: 320000,
    sciPaperCount: 4,
    nonSciPaperCount: 2,
    conferenceCount: 3,
  },
  {
    id: '2',
    userId: 'user1',
    year: 2023,
    papers: [],
    totalReward: 280000,
    sciPaperCount: 3,
    nonSciPaperCount: 3,
    conferenceCount: 4,
  },
  {
    id: '3',
    userId: 'user1',
    year: 2022,
    papers: [],
    totalReward: 195000,
    sciPaperCount: 2,
    nonSciPaperCount: 2,
    conferenceCount: 2,
  },
];

const mockPapersByYear: Record<number, Paper[]> = {
  2024: [
    {
      id: '1',
      title: 'Machine Learning Approaches for Early Detection of Heart Failure',
      authors: [{ id: '1', name: '王大明', affiliation: '奇美醫院', isFirst: true, isCorresponding: true, order: 1 }],
      paperType: 'original',
      journalInfo: { name: 'Journal of Medical Internet Research', isSci: true, isSsci: false, impactFactor: 5.428 },
      publicationDate: '2024-03-15',
      createdAt: '2024-03-15',
      updatedAt: '2024-03-15',
    },
    {
      id: '2',
      title: 'A Novel Biomarker for Cardiac Amyloidosis Detection',
      authors: [{ id: '1', name: '王大明', affiliation: '奇美醫院', isFirst: true, isCorresponding: false, order: 1 }],
      paperType: 'original',
      journalInfo: { name: 'Circulation', isSci: true, isSsci: false, impactFactor: 39.918 },
      publicationDate: '2024-01-20',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
    },
  ],
  2023: [
    {
      id: '3',
      title: 'Implementation of Patient Safety Culture in Taiwan Hospitals',
      authors: [{ id: '1', name: '王大明', affiliation: '奇美醫院', isFirst: false, isCorresponding: true, order: 2 }],
      paperType: 'original',
      journalInfo: { name: '醫療品質雜誌', isSci: false, isSsci: false },
      publicationDate: '2023-06-10',
      createdAt: '2023-06-10',
      updatedAt: '2023-06-10',
    },
  ],
};

// Project/Grant application records
interface ProjectApplication {
  id: string;
  title: string;
  type: 'MOST' | 'hospital' | 'industry' | 'other';
  status: 'approved' | 'rejected' | 'pending' | 'ongoing';
  submissionDate: string;
  startDate?: string;
  endDate?: string;
  amount?: number;
  role: 'PI' | 'Co-PI' | 'participant';
}

const mockProjectApplications: ProjectApplication[] = [
  {
    id: '1',
    title: '運用機器學習預測心臟衰竭早期徵兆之研究',
    type: 'MOST',
    status: 'approved',
    submissionDate: '2024-02-15',
    startDate: '2024-08-01',
    endDate: '2025-07-31',
    amount: 1200000,
    role: 'PI',
  },
  {
    id: '2',
    title: '心臟澱粉樣變性病之生物標記研究',
    type: 'MOST',
    status: 'ongoing',
    submissionDate: '2023-02-20',
    startDate: '2023-08-01',
    endDate: '2024-07-31',
    amount: 800000,
    role: 'PI',
  },
  {
    id: '3',
    title: '院內醫療品質提升計畫',
    type: 'hospital',
    status: 'approved',
    submissionDate: '2024-01-10',
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    amount: 200000,
    role: 'Co-PI',
  },
  {
    id: '4',
    title: 'AI輔助心電圖診斷系統開發',
    type: 'industry',
    status: 'pending',
    submissionDate: '2024-06-01',
    role: 'PI',
  },
  {
    id: '5',
    title: '急性心肌梗塞預後預測模型開發',
    type: 'MOST',
    status: 'rejected',
    submissionDate: '2023-02-15',
    role: 'PI',
  },
];

// AI Career Analysis data
interface CareerInsight {
  category: string;
  icon: string;
  currentLevel: number;
  targetLevel: number;
  suggestions: string[];
}

const mockCareerInsights: CareerInsight[] = [
  {
    category: '研究產出',
    icon: '📊',
    currentLevel: 75,
    targetLevel: 100,
    suggestions: [
      '建議每年維持至少 3 篇 SCI 論文發表',
      '考慮投稿 Q1 期刊以提升學術影響力',
      '可嘗試系統性文獻回顧或統合分析文章',
    ],
  },
  {
    category: '計畫申請',
    icon: '📝',
    currentLevel: 60,
    targetLevel: 100,
    suggestions: [
      '目前國科會計畫通過率良好，可持續申請',
      '建議嘗試多年期計畫以累積更完整研究成果',
      '可考慮與其他醫院或學術單位進行跨機構合作計畫',
    ],
  },
  {
    category: '學術影響力',
    icon: '🌟',
    currentLevel: 55,
    targetLevel: 100,
    suggestions: [
      '累積 H-index 有成長空間，建議多參與合作研究',
      '考慮擔任期刊審稿人以提升學術能見度',
      '可積極參與國際學術會議發表或擔任主持人',
    ],
  },
  {
    category: '跨領域合作',
    icon: '🤝',
    currentLevel: 40,
    targetLevel: 100,
    suggestions: [
      '目前合作對象集中於單一科別，建議拓展跨科合作',
      '可與基礎醫學或資訊科學領域建立合作關係',
      '參與多中心研究可增加國際合作機會',
    ],
  },
];

const Career: React.FC = () => {
  const [expandedYear, setExpandedYear] = useState<number | null>(2024);
  const [activeTab, setActiveTab] = useState<'publications' | 'projects' | 'ai-analysis'>('publications');

  const totalReward = mockCareerRecords.reduce((sum, r) => sum + r.totalReward, 0);
  const totalSciPapers = mockCareerRecords.reduce((sum, r) => sum + r.sciPaperCount, 0);
  const totalNonSciPapers = mockCareerRecords.reduce((sum, r) => sum + r.nonSciPaperCount, 0);
  const totalConferences = mockCareerRecords.reduce((sum, r) => sum + r.conferenceCount, 0);

  const stats = [
    {
      label: '累計獎勵金額',
      value: `NT$ ${(totalReward / 10000).toFixed(0)} 萬`,
      icon: Award,
      color: 'from-amber-500 to-yellow-500',
    },
    {
      label: 'SCI 論文',
      value: totalSciPapers,
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: '非 SCI 論文',
      value: totalNonSciPapers,
      icon: FileText,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: '學會發表',
      value: totalConferences,
      icon: Calendar,
      color: 'from-purple-500 to-violet-500',
    },
  ];

  const tabs = [
    { id: 'publications', label: '發表記錄', icon: FileText },
    { id: 'projects', label: '計畫申請', icon: Briefcase },
    { id: 'ai-analysis', label: 'AI職涯分析', icon: Brain },
  ];

  const getProjectTypeLabel = (type: ProjectApplication['type']) => {
    const types = {
      MOST: { label: '國科會', color: 'bg-blue-100 text-blue-700' },
      hospital: { label: '院內計畫', color: 'bg-emerald-100 text-emerald-700' },
      industry: { label: '產學合作', color: 'bg-amber-100 text-amber-700' },
      other: { label: '其他', color: 'bg-slate-100 text-slate-700' },
    };
    return types[type];
  };

  const getStatusInfo = (status: ProjectApplication['status']) => {
    const statuses = {
      approved: { label: '已通過', icon: CheckCircle, color: 'text-emerald-600' },
      rejected: { label: '未通過', icon: XCircle, color: 'text-red-500' },
      pending: { label: '審核中', icon: Clock, color: 'text-amber-600' },
      ongoing: { label: '執行中', icon: TrendingUp, color: 'text-blue-600' },
    };
    return statuses[status];
  };

  const projectStats = {
    total: mockProjectApplications.length,
    approved: mockProjectApplications.filter((p) => p.status === 'approved' || p.status === 'ongoing').length,
    pending: mockProjectApplications.filter((p) => p.status === 'pending').length,
    totalAmount: mockProjectApplications
      .filter((p) => p.status === 'approved' || p.status === 'ongoing')
      .reduce((sum, p) => sum + (p.amount || 0), 0),
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">職涯學術歷程</h1>
          <p className="text-slate-600 mt-1">完整記錄您的學術發表成就</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="glass-card p-2 mb-6">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-100/80'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Publications Tab */}
          {activeTab === 'publications' && (
            <motion.div
              key="publications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Charts Section */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Trend Chart */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800">獎勵金額趨勢</h3>
                    <BarChart3 className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="h-48 flex items-end justify-around gap-2">
                    {mockCareerRecords.map((record) => (
                      <div key={record.year} className="flex flex-col items-center gap-2">
                        <div
                          className="w-16 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all hover:from-primary-600 hover:to-primary-500"
                          style={{
                            height: `${(record.totalReward / 350000) * 150}px`,
                          }}
                        />
                        <span className="text-sm text-slate-700">{record.year}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Paper Distribution */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800">論文類型分布</h3>
                    <PieChart className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="h-48 flex items-center justify-center">
                    <div className="relative w-40 h-40">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#0ea5e9"
                          strokeWidth="20"
                          strokeDasharray={`${(totalSciPapers / (totalSciPapers + totalNonSciPapers + totalConferences)) * 251.2} 251.2`}
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="20"
                          strokeDasharray={`${(totalNonSciPapers / (totalSciPapers + totalNonSciPapers + totalConferences)) * 251.2} 251.2`}
                          strokeDashoffset={`-${(totalSciPapers / (totalSciPapers + totalNonSciPapers + totalConferences)) * 251.2}`}
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#8b5cf6"
                          strokeWidth="20"
                          strokeDasharray={`${(totalConferences / (totalSciPapers + totalNonSciPapers + totalConferences)) * 251.2} 251.2`}
                          strokeDashoffset={`-${((totalSciPapers + totalNonSciPapers) / (totalSciPapers + totalNonSciPapers + totalConferences)) * 251.2}`}
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-sm text-slate-700">SCI 論文</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                      <span className="text-sm text-slate-700">非 SCI 論文</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full" />
                      <span className="text-sm text-slate-700">學會發表</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Year by Year Records */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-slate-800">歷年發表記錄</h3>
                  <button className="btn-secondary text-sm flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    匯出報表
                  </button>
                </div>

                <div className="space-y-4">
                  {mockCareerRecords.map((record) => (
                    <div key={record.year} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedYear(expandedYear === record.year ? null : record.year)}
                        className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100/80 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-semibold text-slate-800">{record.year} 年</span>
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              SCI {record.sciPaperCount}
                            </span>
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                              非SCI {record.nonSciPaperCount}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              學會 {record.conferenceCount}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-primary-600">
                            NT$ {record.totalReward.toLocaleString()}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-500 transition-transform ${
                              expandedYear === record.year ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {expandedYear === record.year && mockPapersByYear[record.year] && (
                        <div className="px-6 py-4 space-y-3">
                          {mockPapersByYear[record.year].map((paper) => (
                            <div
                              key={paper.id}
                              className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-100"
                            >
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-primary-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-slate-800 line-clamp-1">
                                  {paper.title}
                                </h4>
                                <p className="text-sm text-slate-600 mt-1">
                                  {paper.journalInfo?.name}
                                  {paper.journalInfo?.impactFactor && (
                                    <span className="ml-2 text-primary-600">
                                      IF: {paper.journalInfo.impactFactor}
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  {new Date(paper.publicationDate || '').toLocaleDateString('zh-TW')}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  paper.journalInfo?.isSci
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {paper.journalInfo?.isSci ? 'SCI' : '非 SCI'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Project Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{projectStats.total}</p>
                  <p className="text-sm text-slate-600">總申請數</p>
                </div>
                <div className="glass-card p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{projectStats.approved}</p>
                  <p className="text-sm text-slate-600">通過/執行中</p>
                </div>
                <div className="glass-card p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{projectStats.pending}</p>
                  <p className="text-sm text-slate-600">審核中</p>
                </div>
                <div className="glass-card p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mb-3">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">NT$ {(projectStats.totalAmount / 10000).toFixed(0)}萬</p>
                  <p className="text-sm text-slate-600">累計經費</p>
                </div>
              </div>

              {/* Project List */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-slate-800">計畫申請記錄</h3>
                  <button className="btn-secondary text-sm flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    匯出記錄
                  </button>
                </div>

                <div className="space-y-4">
                  {mockProjectApplications.map((project, index) => {
                    const typeInfo = getProjectTypeLabel(project.type);
                    const statusInfo = getStatusInfo(project.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl border border-slate-200 bg-white/50 hover:bg-white/80 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-primary-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                                {typeInfo.label}
                              </span>
                              <span className={`flex items-center gap-1 text-xs font-medium ${statusInfo.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusInfo.label}
                              </span>
                            </div>
                            <h4 className="font-medium text-slate-800 mb-1">{project.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span>角色：{project.role === 'PI' ? '計畫主持人' : project.role === 'Co-PI' ? '共同主持人' : '參與人員'}</span>
                              <span>申請日期：{new Date(project.submissionDate).toLocaleDateString('zh-TW')}</span>
                            </div>
                            {project.startDate && project.endDate && (
                              <div className="text-sm text-slate-600 mt-1">
                                執行期間：{new Date(project.startDate).toLocaleDateString('zh-TW')} ~ {new Date(project.endDate).toLocaleDateString('zh-TW')}
                              </div>
                            )}
                          </div>
                          {project.amount && (
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary-600">
                                NT$ {project.amount.toLocaleString()}
                              </p>
                              <p className="text-xs text-slate-600">核定經費</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* AI Analysis Tab */}
          {activeTab === 'ai-analysis' && (
            <motion.div
              key="ai-analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* AI Analysis Header */}
              <div className="glass-card p-6 mb-6 bg-gradient-to-r from-primary-500/10 to-accent-500/10">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">AI 職涯發展分析</h2>
                    <p className="text-slate-600">
                      根據您的發表記錄、計畫申請歷程，AI 分析您的學術職涯現況並提供個人化建議
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </motion.div>
                </div>
              </div>

              {/* Overall Score */}
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <svg viewBox="0 0 100 100" className="w-32 h-32">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="8"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="283"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{ strokeDashoffset: 283 - (283 * 72) / 100 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        transform="rotate(-90 50 50)"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-slate-800">72</span>
                      <span className="text-sm text-slate-600">綜合分數</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">整體評估：持續成長中</h3>
                    <p className="text-slate-600 mb-4">
                      您的學術發展軌跡良好，近三年研究產出穩定成長。建議可加強跨領域合作與提升學術影響力，以達到下一階段的職涯目標。
                    </p>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      <span className="text-sm font-medium text-slate-700">目標：副教授等級研究能量</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Insights */}
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {mockCareerInsights.map((insight, index) => (
                  <motion.div
                    key={insight.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{insight.icon}</span>
                      <h3 className="font-semibold text-slate-800">{insight.category}</h3>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">目前水平</span>
                        <span className="text-sm font-medium text-primary-600">{insight.currentLevel}%</span>
                      </div>
                      <div className="h-3 bg-slate-200/50 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${insight.currentLevel}%` }}
                          transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="space-y-2">
                      {insight.suggestions.map((suggestion, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-slate-700">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Action Items */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-primary-500" />
                  <h3 className="font-semibold text-slate-800">建議行動項目</h3>
                </div>

                <div className="space-y-3">
                  {[
                    { priority: 'high', action: '投稿 Q1 期刊論文', deadline: '本季度', impact: '提升學術影響力' },
                    { priority: 'medium', action: '申請國科會多年期計畫', deadline: '明年 2 月', impact: '累積研究成果' },
                    { priority: 'medium', action: '建立跨科合作研究', deadline: '持續進行', impact: '拓展研究領域' },
                    { priority: 'low', action: '擔任期刊審稿人', deadline: '有機會時', impact: '提升學術能見度' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl border
                        ${item.priority === 'high'
                          ? 'bg-red-50/50 border-red-200'
                          : item.priority === 'medium'
                          ? 'bg-amber-50/50 border-amber-200'
                          : 'bg-slate-50/50 border-slate-200'
                        }
                      `}
                    >
                      <div className={`
                        w-2 h-2 rounded-full
                        ${item.priority === 'high' ? 'bg-red-500' : item.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'}
                      `} />
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{item.action}</p>
                        <p className="text-sm text-slate-600">{item.impact}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-slate-700">{item.deadline}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Career;
