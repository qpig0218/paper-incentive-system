import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
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
} from 'lucide-react';
import type { PaperApplication, Paper, Announcement, ApplicantType, ApplicationStatus } from '../types';

// Mock data
interface AdminApplication extends PaperApplication {
  paper: Paper;
  applicantName: string;
}

const mockApplications: AdminApplication[] = [
  {
    id: 'app1',
    paperId: '1',
    applicantId: 'user1',
    applicantName: '王大明',
    applicantType: 'first_author' as ApplicantType,
    status: 'pending' as ApplicationStatus,
    rewardAmount: 85000,
    submittedAt: '2024-03-20',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    paper: {
      id: '1',
      title: 'Machine Learning Approaches for Early Detection of Heart Failure',
      authors: [{ id: '1', name: '王大明', affiliation: '奇美醫院', isFirst: true, isCorresponding: true, order: 1 }],
      paperType: 'original',
      journalInfo: { name: 'JMIR', isSci: true, isSsci: false, impactFactor: 5.428 },
      publicationDate: '2024-03-15',
      createdAt: '2024-03-15',
      updatedAt: '2024-03-15',
    },
  },
  {
    id: 'app2',
    paperId: '2',
    applicantId: 'user2',
    applicantName: '陳醫師',
    applicantType: 'corresponding' as ApplicantType,
    status: 'pending' as ApplicationStatus,
    rewardAmount: 42000,
    submittedAt: '2024-03-18',
    createdAt: '2024-03-18',
    updatedAt: '2024-03-18',
    paper: {
      id: '2',
      title: 'Novel Biomarker for Cardiac Amyloidosis',
      authors: [{ id: '2', name: '陳醫師', affiliation: '奇美醫院', isFirst: false, isCorresponding: true, order: 2 }],
      paperType: 'original',
      journalInfo: { name: 'Circulation', isSci: true, isSsci: false, impactFactor: 39.918 },
      publicationDate: '2024-03-10',
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
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

// Dashboard Component
const AdminDashboard: React.FC = () => {
  const stats = [
    { label: '待審核申請', value: 12, icon: Clock, color: 'from-amber-500 to-orange-500' },
    { label: '本月核准', value: 28, icon: CheckCircle, color: 'from-emerald-500 to-teal-500' },
    { label: '本月退件', value: 3, icon: XCircle, color: 'from-red-500 to-rose-500' },
    { label: '總獎勵金額', value: 'NT$ 458萬', icon: BarChart3, color: 'from-primary-500 to-blue-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-6">
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
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
          {mockApplications.slice(0, 5).map((app) => (
            <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 line-clamp-1">{app.paper.title}</p>
                  <p className="text-sm text-slate-500">{app.applicantName} · {app.paper.journalInfo?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary-600 font-semibold">
                  NT$ {(app.rewardAmount || 0).toLocaleString()}
                </span>
                <button className="btn-secondary text-sm">審核</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Applications Management
const AdminApplications: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const handleApprove = (id: string) => {
    console.log('Approve:', id);
  };

  const handleReject = (id: string) => {
    console.log('Reject:', id);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as typeof selectedStatus)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status === 'all' && '全部'}
                {status === 'pending' && '待審核'}
                {status === 'approved' && '已核准'}
                {status === 'rejected' && '已退件'}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋..."
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
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">申請日期</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockApplications.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-800 line-clamp-1 max-w-xs">{app.paper.title}</p>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                    {app.paper.paperType === 'original' ? '原著論文' : '其他'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-slate-800">{app.applicantName}</p>
                  <p className="text-xs text-slate-500">
                    {app.applicantType === 'first_author' ? '第一作者' : '通訊作者'}
                  </p>
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
                <td className="px-6 py-4 text-slate-500">
                  {new Date(app.submittedAt).toLocaleDateString('zh-TW')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <XCircle className="w-4 h-4" />
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
          <p className="text-slate-500 mt-1">管理論文申請、使用者與系統設定</p>
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
