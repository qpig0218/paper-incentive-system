import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
} from 'lucide-react';
import type { Paper, PaperApplication, ApplicantType, ApplicationStatus } from '../types';

// Mock data
const mockPapers: Paper[] = [
  {
    id: '1',
    title: 'Machine Learning Approaches for Early Detection of Heart Failure',
    titleChinese: '機器學習方法於心臟衰竭早期偵測之系統性回顧',
    authors: [
      { id: '1', name: '王大明', affiliation: '奇美醫院', isCorresponding: true, isFirst: true, order: 1 },
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
  {
    id: '2',
    title: 'A Rare Case of Cardiac Amyloidosis Presenting with Syncope',
    titleChinese: '以暈厥為表現之罕見心臟澱粉樣變性病例報告',
    authors: [
      { id: '1', name: '王大明', affiliation: '奇美醫院', isCorresponding: true, isFirst: true, order: 1 },
    ],
    paperType: 'case_report',
    journalInfo: {
      name: 'BMC Cardiovascular Disorders',
      isSci: true,
      isSsci: false,
      impactFactor: 2.078,
      quartile: 'Q3',
    },
    publicationDate: '2024-02-20',
    createdAt: '2024-02-20',
    updatedAt: '2024-02-20',
  },
];

const mockApplications: PaperApplication[] = [
  {
    id: 'app1',
    paperId: '1',
    applicantId: 'user1',
    applicantType: 'first_author' as ApplicantType,
    status: 'approved' as ApplicationStatus,
    rewardAmount: 85000,
    submittedAt: '2024-03-20',
    reviewedAt: '2024-03-25',
    reviewedBy: 'admin1',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-25',
  },
  {
    id: 'app2',
    paperId: '2',
    applicantId: 'user1',
    applicantType: 'first_author' as ApplicantType,
    status: 'pending' as ApplicationStatus,
    rewardAmount: 32000,
    submittedAt: '2024-03-01',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
];

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: {
    label: '審核中',
    color: 'bg-amber-100 text-amber-700',
    icon: Clock,
  },
  approved: {
    label: '已核准',
    color: 'bg-emerald-100 text-emerald-700',
    icon: CheckCircle,
  },
  rejected: {
    label: '已退件',
    color: 'bg-red-100 text-red-700',
    icon: XCircle,
  },
  revision: {
    label: '需修改',
    color: 'bg-blue-100 text-blue-700',
    icon: AlertCircle,
  },
};

const MyPapers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredApplications = mockApplications.filter((app) => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const stats = {
    total: mockApplications.length,
    pending: mockApplications.filter((a) => a.status === 'pending').length,
    approved: mockApplications.filter((a) => a.status === 'approved').length,
    totalReward: mockApplications
      .filter((a) => a.status === 'approved')
      .reduce((sum, a) => sum + (a.rewardAmount || 0), 0),
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">我的論文</h1>
            <p className="text-slate-500 mt-1">管理您的論文發表與獎勵申請</p>
          </div>
          <Link to="/upload" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            上傳新論文
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-6">
            <p className="text-sm text-slate-500">總申請數</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm text-slate-500">審核中</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm text-slate-500">已核准</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved}</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm text-slate-500">累計獎勵</p>
            <p className="text-2xl font-bold text-primary-600 mt-1">
              NT$ {stats.totalReward.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-card p-2 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              全部 ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              審核中 ({stats.pending})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'approved'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              已核准 ({stats.approved})
            </button>
            <div className="flex-1" />
            <button className="btn-secondary text-sm flex items-center gap-2">
              <Download className="w-4 h-4" />
              匯出
            </button>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const paper = mockPapers.find((p) => p.id === application.paperId);
            const status = statusConfig[application.status];
            const StatusIcon = status.icon;

            if (!paper) return null;

            return (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Paper Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-7 h-7 text-primary-600" />
                  </div>

                  {/* Paper Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-800 line-clamp-1">
                          {paper.title}
                        </h3>
                        {paper.titleChinese && (
                          <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                            {paper.titleChinese}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${status.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                      {/* Journal */}
                      <span className="text-slate-600">
                        {paper.journalInfo?.name}
                      </span>

                      {/* SCI Badge */}
                      {paper.journalInfo?.isSci && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          SCI
                        </span>
                      )}

                      {/* Impact Factor */}
                      {paper.journalInfo?.impactFactor && (
                        <span className="text-primary-600 font-medium">
                          IF: {paper.journalInfo.impactFactor}
                        </span>
                      )}

                      {/* Submitted Date */}
                      <span className="text-slate-400">
                        申請日期: {new Date(application.submittedAt).toLocaleDateString('zh-TW')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500">
                          申請身份: {application.applicantType === 'first_author' ? '第一作者' : '通訊作者'}
                        </span>
                        {application.reviewedAt && (
                          <span className="text-sm text-slate-400">
                            審核日期: {new Date(application.reviewedAt).toLocaleDateString('zh-TW')}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-slate-500">預計獎勵金額</span>
                        <p className="text-xl font-bold text-primary-600">
                          NT$ {(application.rewardAmount || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredApplications.length === 0 && (
            <div className="glass-card p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                尚無申請記錄
              </h3>
              <p className="text-slate-500 mb-6">
                上傳您的論文開始申請獎勵
              </p>
              <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                上傳論文
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPapers;
