import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  FileText,
  Download,
} from 'lucide-react';
import PaperCard from '../components/PaperCard';
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
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'all'
                ? 'bg-primary-500 text-white'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              全部 ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'pending'
                ? 'bg-amber-500 text-white'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              審核中 ({stats.pending})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'approved'
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

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((application) => {
            const paper = mockPapers.find((p) => p.id === application.paperId);
            if (!paper) return null;

            return (
              <PaperCard
                key={application.id}
                paper={paper}
                showReward={true}
                rewardAmount={application.rewardAmount}
                applicationStatus={application.status}
                submittedAt={application.submittedAt}
                onClick={() => console.log('Paper clicked:', paper)}
              />
            );
          })}
        </div>

        {/* Empty State */}
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
  );
};

export default MyPapers;
