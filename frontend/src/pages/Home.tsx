import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload,
  TrendingUp,
  Award,
  FileText,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Marquee from '../components/Marquee';
import PaperGallery from '../components/PaperGallery';
import type { Paper, Announcement, DashboardStats } from '../types';

// Mock data for demonstration
const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: '重要公告',
    content: '114年度論文獎勵申請截止日期為12月31日，請同仁把握時間提出申請。',
    type: 'urgent',
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    title: '系統更新',
    content: 'AI 自動辨識功能已上線，可自動判別論文類型及計算獎勵金額。',
    type: 'success',
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    title: '獎勵加成',
    content: '刊登於「醫療品質」雜誌之文章，獎勵加成50%；刊登於「醫學教育」雜誌之文章，獎勵加成100%。',
    type: 'info',
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    createdAt: '2024-01-01',
  },
];

const mockPapers: Paper[] = [
  {
    id: '1',
    title: 'Machine Learning Approaches for Early Detection of Heart Failure: A Systematic Review',
    titleChinese: '機器學習方法於心臟衰竭早期偵測之系統性回顧',
    authors: [
      { id: '1', name: '王大明', affiliation: '奇美醫院', isCorresponding: true, isFirst: true, order: 1 },
      { id: '2', name: '李小華', affiliation: '奇美醫院', isCorresponding: false, isFirst: false, order: 2 },
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
      { id: '3', name: '陳醫師', affiliation: '奇美醫院', isCorresponding: true, isFirst: true, order: 1 },
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
    volume: '24',
    pages: '89',
    doi: '10.1186/s12872-024-03089-2',
    createdAt: '2024-02-20',
    updatedAt: '2024-02-20',
  },
  {
    id: '3',
    title: 'Implementation of Patient Safety Culture in Taiwan Hospitals',
    authors: [
      { id: '4', name: '林護理長', affiliation: '奇美醫院', isCorresponding: false, isFirst: true, order: 1 },
      { id: '5', name: '張主任', affiliation: '奇美醫院', isCorresponding: true, isFirst: false, order: 2 },
    ],
    paperType: 'original',
    journalInfo: {
      name: '醫療品質雜誌',
      isSci: false,
      isSsci: false,
    },
    publicationDate: '2024-01-10',
    volume: '18',
    issue: '1',
    pages: '12-25',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
];

const mockStats: DashboardStats = {
  totalPapers: 156,
  pendingApplications: 12,
  approvedThisMonth: 8,
  totalRewardThisYear: 1250000,
  sciPaperCount: 89,
  topAuthors: [
    { name: '王大明', count: 15 },
    { name: '陳醫師', count: 12 },
    { name: '李小華', count: 10 },
  ],
};

const Home: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>(mockPapers);
  const [announcements] = useState<Announcement[]>(mockAnnouncements);
  const [stats] = useState<DashboardStats>(mockStats);
  const [isLoading, setIsLoading] = useState(false);

  // In production, fetch from API
  useEffect(() => {
    // paperApi.getAll().then(data => setPapers(data.papers));
    // announcementApi.getActive().then(setAnnouncements);
  }, []);

  const statCards = [
    {
      label: '總論文數',
      value: stats.totalPapers,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'SCI 論文',
      value: stats.sciPaperCount,
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: '待審核申請',
      value: stats.pendingApplications,
      icon: Users,
      color: 'from-amber-500 to-orange-500',
    },
    {
      label: '本年度獎勵總額',
      value: `NT$ ${(stats.totalRewardThisYear / 10000).toFixed(0)} 萬`,
      icon: Award,
      color: 'from-purple-500 to-violet-500',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Marquee Announcements */}
      <Marquee announcements={announcements} />

      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                AI 驅動的智慧論文管理
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                論文發表獎勵系統
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                自動辨識論文類型、計算獎勵金額，讓您的學術成就獲得應有的肯定
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            >
              <Link to="/upload" className="btn-primary flex items-center gap-2">
                <Upload className="w-5 h-5" />
                上傳論文申請獎勵
              </Link>
              <Link to="/my-papers" className="btn-secondary flex items-center gap-2">
                查看我的論文
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          >
            {statCards.map((stat, index) => (
              <div
                key={stat.label}
                className="glass-card p-6 text-center"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recent Papers Gallery */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">最新發表論文</h2>
              <p className="text-slate-500 mt-1">瀏覽院內同仁最新學術成果</p>
            </div>
            <Link
              to="/papers"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <PaperGallery
            papers={papers}
            isLoading={isLoading}
            onPaperClick={(paper) => console.log('Paper clicked:', paper)}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">系統特色</h2>
            <p className="text-slate-600">AI 智慧化處理，簡化申請流程</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔍',
                title: 'AI 自動辨識',
                description: '透過 OCR 自動提取論文資訊，識別文章類型、期刊 Impact Factor',
              },
              {
                icon: '💰',
                title: '智慧計算獎勵',
                description: '根據規定自動計算獎勵金額，包含各項加成條件',
              },
              {
                icon: '📊',
                title: '職涯歷程追蹤',
                description: '完整記錄個人學術發表歷程，累積職涯成就',
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ y: -5 }}
                className="glass-card p-8 text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
