import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  FileText,
  Download,
} from 'lucide-react';
import PaperCard from '../components/PaperCard';
import api from '../services/api';
import type { ApplicationStatus } from '../types';

interface AppData {
  id: string;
  paperId: string;
  applicantType: string;
  status: ApplicationStatus;
  rewardAmount: number | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewComment: string | null;
  paper?: {
    id: string;
    title: string;
    paperType: string;
  };
}

const MyPapers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [applications, setApplications] = useState<AppData[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, papersRes] = await Promise.all([
          api.get('/applications/my'),
          api.get('/papers?limit=100'),
        ]);
        if (appsRes.data.success) setApplications(appsRes.data.data);
        if (papersRes.data.success) setPapers(papersRes.data.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredApplications = applications.filter((app) => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    totalReward: applications
      .filter((a) => a.status === 'approved')
      .reduce((sum, a) => sum + (a.rewardAmount || 0), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-slate-500">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
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

        <div className="glass-card p-2 mb-6">
          <div className="flex items-center gap-2">
            {(['all', 'pending', 'approved'] as const).map((tab) => {
              const labels: Record<string, string> = { all: '全部', pending: '審核中', approved: '已核准' };
              const colors: Record<string, string> = { all: 'bg-primary-500', pending: 'bg-amber-500', approved: 'bg-emerald-500' };
              const count = tab === 'all' ? stats.total : tab === 'pending' ? stats.pending : stats.approved;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab
                    ? `${colors[tab]} text-white`
                    : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {labels[tab]} ({count})
                </button>
              );
            })}
            <div className="flex-1" />
            <button className="btn-secondary text-sm flex items-center gap-2">
              <Download className="w-4 h-4" />
              匯出
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((application) => {
            const paper = papers.find((p: any) => p.id === application.paperId);
            if (!paper) {
              return (
                <div key={application.id} className="glass-card p-4">
                  <p className="font-medium text-slate-800">{application.paper?.title || '論文資料載入中...'}</p>
                  <p className="text-sm text-slate-500 mt-1">類型: {application.paper?.paperType || '-'}</p>
                  <div className="flex justify-between mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      application.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      application.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {application.status === 'approved' ? '已核准' : application.status === 'pending' ? '審核中' : '已退件'}
                    </span>
                    {application.rewardAmount && (
                      <span className="text-primary-600 font-semibold">NT$ {application.rewardAmount.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <PaperCard
                key={application.id}
                paper={paper}
                showReward={true}
                rewardAmount={application.rewardAmount || undefined}
                applicationStatus={application.status}
                submittedAt={application.submittedAt || undefined}
                onClick={() => console.log('Paper clicked:', paper)}
              />
            );
          })}
        </div>

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
