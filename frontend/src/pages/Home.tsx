import React, { useState } from 'react';
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
  Search,
  Trophy,
  Zap,
} from 'lucide-react';
import Marquee from '../components/Marquee';
import PaperGallery from '../components/PaperGallery';
import {
  MissionBoard,
  Leaderboard,
  ChallengeCard,
  StreakTracker,
  LevelProgress,
} from '../components/gamification';
import type { Paper, Announcement, DashboardStats } from '../types';
import type {
  LeaderboardEntry,
  LeaderboardType,
  Challenge,
  Streak,
  HospitalStats,
  UserLevelProgress,
} from '../types/gamification';

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

// Mock gamification data
const mockLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, userId: '2', name: '王大明', department: '心臟內科', value: 15, change: 0 },
  { rank: 2, userId: '3', name: '陳醫師', department: '神經內科', value: 12, change: 1 },
  { rank: 3, userId: '4', name: '李小華', department: '胸腔內科', value: 10, change: -1 },
  { rank: 4, userId: '5', name: '張主任', department: '急診醫學部', value: 9, change: 2 },
  { rank: 5, userId: '6', name: '林護理長', department: '護理部', value: 8, change: 0 },
];

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: '年度衝刺月',
    description: '在 12 月份提交論文申請，獎勵金額加成 10%',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    targetType: 'paper_count',
    targetValue: 1,
    bonusRate: 0.1,
    isActive: true,
    participantCount: 45,
  },
  {
    id: '2',
    title: '醫學教育推廣週',
    description: '發表醫學教育相關論文，獎勵加成 20%',
    startDate: '2024-12-15',
    endDate: '2024-12-31',
    targetType: 'paper_count',
    targetValue: 1,
    bonusRate: 0.2,
    isActive: true,
    participantCount: 23,
  },
];

const mockStreaks: Streak[] = [
  { id: '1', userId: '2', type: 'yearly_publication', count: 5, lastDate: '2024-12-15', bestCount: 5 },
];

const mockHospitalStats: HospitalStats = {
  yearlyGoal: {
    sciPapers: { target: 200, current: 156 },
    totalPapers: { target: 350, current: 289 },
    totalRewards: { target: 15000000, current: 12500000 },
  },
  milestones: [
    { id: '1', title: '100 篇 SCI 論文', target: 100, current: 156, isReached: true, reachedAt: '2024-08-15' },
    { id: '2', title: '150 篇 SCI 論文', target: 150, current: 156, isReached: true, reachedAt: '2024-11-20' },
    { id: '3', title: '200 篇 SCI 論文', target: 200, current: 156, isReached: false },
  ],
  departmentContributions: [],
  recentAchievements: [
    {
      userName: '王大明',
      department: '心臟內科',
      achievement: {
        id: '5',
        name: '高影響力',
        nameEn: 'High Impact',
        description: '發表 IF≥10 的論文',
        icon: '💥',
        category: 'impact',
        tier: 'gold',
        requirement: { type: 'impact_factor', value: 10, comparison: 'gte' },
        isHidden: false,
        createdAt: '2024-01-01',
      },
      unlockedAt: '2024-12-18T10:30:00',
    },
  ],
};

const mockLevelProgress: UserLevelProgress = {
  userId: '2',
  currentLevel: {
    level: 5,
    title: '學術大師',
    titleEn: 'Master',
    minPoints: 1000,
    maxPoints: 1999,
    benefits: ['專屬頭銜顯示'],
    icon: '🎓',
    color: 'from-amber-400 to-amber-500',
  },
  nextLevel: {
    level: 6,
    title: '學術導師',
    titleEn: 'Mentor',
    minPoints: 2000,
    maxPoints: 3999,
    benefits: ['指導新進人員'],
    icon: '👨‍🏫',
    color: 'from-rose-400 to-rose-500',
  },
  totalPoints: 1250,
  pointsToNextLevel: 750,
  progressPercentage: 25,
};

// Paper categories
const paperCategories = [
  { id: 'sci', label: 'SCI/SSCI', icon: '🔬', color: 'from-blue-500 to-cyan-500' },
  { id: 'domestic', label: '國內期刊', icon: '📚', color: 'from-emerald-500 to-teal-500' },
  { id: 'conference', label: '會議論文', icon: '🎤', color: 'from-purple-500 to-violet-500' },
  { id: 'special', label: '特色主題', icon: '⭐', color: 'from-amber-500 to-orange-500' },
];

const Home: React.FC = () => {
  const [papers] = useState<Paper[]>(mockPapers);
  const [announcements] = useState<Announcement[]>(mockAnnouncements);
  const [stats] = useState<DashboardStats>(mockStats);
  const [isLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('monthly_papers');

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  return (
    <div className="min-h-screen">
      {/* Marquee Announcements */}
      <Marquee announcements={announcements} />

      {/* Hero Section */}
      <section className="relative py-12 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#4f46e5' }}>
                <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                AI 驅動的智慧論文管理
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                論文發表獎勵系統
              </h1>
              <p className="text-xl text-slate-700 max-w-2xl mx-auto">
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
                <Upload className="w-5 h-5" strokeWidth={1.5} />
                上傳論文申請獎勵
              </Link>
              <Link to="/my-papers" className="btn-secondary flex items-center gap-2">
                查看我的論文
                <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
              </Link>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="liquid-glass-hover p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-700">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Level Progress (User's gamification status) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8"
          >
            <LevelProgress levelProgress={mockLevelProgress} compact />
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary-500" />
              院內著作搜尋
            </h2>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜尋作者姓名、部門、論文標題、關鍵字..."
                  className="input-field pl-12"
                />
              </div>
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Search className="w-4 h-4" />
                搜尋
              </button>
            </form>

            {/* Category Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${selectedCategory === null
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80'
                  }
                `}
              >
                全部
              </button>
              {paperCategories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2
                    ${selectedCategory === cat.id
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                      : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Papers & Mission */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Papers Gallery */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary-500" />
                      最新發表論文
                    </h2>
                    <p className="text-slate-700 mt-1">瀏覽院內同仁最新學術成果</p>
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

              {/* Challenges Section */}
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  進行中的挑戰
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {mockChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onJoin={(id) => console.log('Join challenge:', id)}
                    />
                  ))}
                </div>
              </div>

              {/* Mission Board */}
              <MissionBoard stats={mockHospitalStats} />
            </div>

            {/* Right Column - Gamification */}
            <div className="space-y-6">
              {/* Streak Tracker */}
              <StreakTracker streaks={mockStreaks} compact />

              {/* Leaderboard */}
              <Leaderboard
                entries={mockLeaderboardData}
                type={leaderboardType}
                currentUserId="2"
                onTypeChange={setLeaderboardType}
                showTypeSelector
              />

              {/* Quick Links */}
              <div className="glass-card p-4">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  快速連結
                </h3>
                <div className="space-y-2">
                  <Link
                    to="/achievements"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🏅</span>
                      <span className="font-medium text-slate-800">成就收藏館</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </Link>
                  <Link
                    to="/leaderboard"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🏆</span>
                      <span className="font-medium text-slate-800">完整排行榜</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </Link>
                  <Link
                    to="/career"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📊</span>
                      <span className="font-medium text-slate-800">我的職涯歷程</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">系統特色</h2>
            <p className="text-slate-700">AI 智慧化處理，簡化申請流程</p>
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
                icon: '🎮',
                title: '遊戲化激勵',
                description: '成就徽章、排行榜、挑戰任務，讓學術發表更有動力',
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
                <p className="text-slate-700">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
