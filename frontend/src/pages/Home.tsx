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
  Search,
  Trophy,
  Zap,
  Star,
} from 'lucide-react';
import Marquee from '../components/Marquee';
import PaperGallery from '../components/PaperGallery';
import {
  MissionBoard,
  Leaderboard,
  ChallengeCard,
  StreakTracker,
} from '../components/gamification';
import api from '../services/api';
import type { Paper, Announcement, DashboardStats } from '../types';
import type {
  LeaderboardEntry,
  LeaderboardType,
  Challenge,
  Streak,
  HospitalStats,
} from '../types/gamification';

// Paper categories (static UI config)
const paperCategories = [
  { id: 'sci', label: 'SCI/SSCI', icon: '🔬', color: 'from-blue-500 to-cyan-500' },
  { id: 'domestic', label: '國內期刊', icon: '📚', color: 'from-emerald-500 to-teal-500' },
  { id: 'conference', label: '會議論文', icon: '🎤', color: 'from-purple-500 to-violet-500' },
  { id: 'special', label: '特色主題', icon: '⭐', color: 'from-amber-500 to-orange-500' },
];

const Home: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [showAllPapers, setShowAllPapers] = useState(false);
  const [totalHighImpact, setTotalHighImpact] = useState(0);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPapers: 0,
    pendingApplications: 0,
    approvedThisMonth: 0,
    totalRewardThisYear: 0,
    sciPaperCount: 0,
    topAuthors: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('monthly_papers');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [challenges] = useState<Challenge[]>([]);
  const [streaks] = useState<Streak[]>([]);
  const [hospitalStats] = useState<HospitalStats>({
    yearlyGoal: { sciPapers: { target: 200, current: 0 }, totalPapers: { target: 350, current: 0 }, totalRewards: { target: 15000000, current: 0 } },
    milestones: [],
    departmentContributions: [],
    recentAchievements: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [highImpactRes, annRes, appsRes] = await Promise.all([
          api.get('/papers/high-impact?limit=6'),
          api.get('/announcements/active'),
          api.get('/applications?limit=1000').catch(() => ({ data: { success: false } })),
        ]);

        if (highImpactRes.data.success) {
          setPapers(highImpactRes.data.data);
          setTotalHighImpact(highImpactRes.data.total || highImpactRes.data.data.length);

          // Build leaderboard from paper applicants
          const authorCounts: Record<string, { name: string; department: string; count: number }> = {};
          highImpactRes.data.data.forEach((p: any) => {
            if (p.applicant) {
              const key = p.applicant.name;
              if (!authorCounts[key]) {
                authorCounts[key] = { name: p.applicant.name, department: p.applicant.department || '', count: 0 };
              }
              authorCounts[key].count++;
            }
            p.authors?.forEach((a: any) => {
              if (!authorCounts[a.name]) {
                authorCounts[a.name] = { name: a.name, department: a.department || a.affiliation || '', count: 0 };
              }
              authorCounts[a.name].count++;
            });
          });
          const sorted = Object.values(authorCounts).sort((a, b) => b.count - a.count).slice(0, 5);
          setLeaderboardData(sorted.map((a, i) => ({
            rank: i + 1,
            userId: String(i),
            name: a.name,
            department: a.department,
            value: a.count,
            change: 0,
          })));
        }

        // Build stats from applications
        if (appsRes.data.success && appsRes.data.data) {
          const apps = appsRes.data.data;
          const pendingApps = apps.filter((a: any) => a.status === 'pending').length;
          const approvedApps = apps.filter((a: any) => a.status === 'approved').length;
          const totalReward = apps
            .filter((a: any) => a.status === 'approved')
            .reduce((sum: number, a: any) => sum + (a.rewardAmount || 0), 0);

          setStats({
            totalPapers: apps.length,
            pendingApplications: pendingApps,
            approvedThisMonth: approvedApps,
            totalRewardThisYear: totalReward,
            sciPaperCount: highImpactRes.data.total || 0,
            topAuthors: [],
          });
        }

        if (annRes.data.success) {
          setAnnouncements(annRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewAll = async () => {
    if (showAllPapers) {
      // Collapse back to 6
      try {
        const res = await api.get('/papers/high-impact?limit=6');
        if (res.data.success) setPapers(res.data.data);
      } catch (err) {
        console.error('Failed to fetch papers:', err);
      }
      setShowAllPapers(false);
    } else {
      // Fetch all this year's papers
      try {
        const res = await api.get('/papers/high-impact?all=true');
        if (res.data.success) setPapers(res.data.data);
      } catch (err) {
        console.error('Failed to fetch papers:', err);
      }
      setShowAllPapers(true);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await api.get(`/papers?search=${encodeURIComponent(searchQuery)}&limit=20`);
      if (res.data.success) setPapers(res.data.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const statCards = [
    { label: '總論文數', value: stats.totalPapers.toLocaleString(), icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { label: 'SCI 論文', value: stats.sciPaperCount, icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
    { label: '待審核申請', value: stats.pendingApplications, icon: Users, color: 'from-amber-500 to-orange-500' },
    { label: '總獎勵金額', value: `NT$ ${(stats.totalRewardThisYear / 10000).toFixed(0)} 萬`, icon: Award, color: 'from-purple-500 to-violet-500' },
  ];

  return (
    <div className="min-h-screen">
      {/* Marquee Announcements */}
      <Marquee announcements={announcements} />

      {/* Hero Section */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#4f46e5' }}>
                <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                AI 驅動的智慧論文管理
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">論文發表獎勵系統</h1>
              <p className="text-xl text-slate-700 max-w-2xl mx-auto">自動辨識論文類型、計算獎勵金額，讓您的學術成就獲得應有的肯定</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, index) => (
              <motion.div key={stat.label} className="liquid-glass-hover p-6 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1 }}>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-700">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Leaderboard + Quick Links Section */}
      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Leaderboard */}
            <div className="lg:col-span-2">
              <Leaderboard entries={leaderboardData} type={leaderboardType} currentUserId="" onTypeChange={setLeaderboardType} showTypeSelector />
            </div>

            {/* Quick Links */}
            <div className="glass-card p-4">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                快速連結
              </h3>
              <div className="space-y-2">
                {[
                  { to: '/career', icon: '📊', label: '我的職涯歷程' },
                  { to: '/resources', icon: '📖', label: '研究資源' },
                  { to: '/ai-insights', icon: '🤖', label: 'AI 分析洞察' },
                ].map((link) => (
                  <Link key={link.to} to={link.to} className="flex items-center justify-between p-3 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{link.icon}</span>
                      <span className="font-medium text-slate-800">{link.label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }} className="glass-card p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary-500" />
              院內著作搜尋
            </h2>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="搜尋作者姓名、部門、論文標題、關鍵字..." className="input-field pl-12" />
              </div>
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Search className="w-4 h-4" />
                搜尋
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === null ? 'bg-primary-500 text-white shadow-lg' : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80'}`}>
                全部
              </button>
              {paperCategories.map((cat) => (
                <motion.button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${selectedCategory === cat.id ? `bg-gradient-to-r ${cat.color} text-white shadow-lg` : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80'}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <span>{cat.icon}</span>
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* High Impact Papers Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500" />
                高影響因子期刊論文
              </h2>
              <p className="text-slate-700 mt-1">瀏覽院內同仁最新優秀學術成果</p>
            </div>
            <button
              onClick={handleViewAll}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              {showAllPapers ? '收合' : `查看全部 (${totalHighImpact})`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <PaperGallery papers={papers} isLoading={isLoading} onPaperClick={(paper) => console.log('Paper clicked:', paper)} hideSearchBar />

          {streaks.length > 0 && (
            <div className="mt-8">
              <StreakTracker streaks={streaks} compact />
            </div>
          )}

          {challenges.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                進行中的挑戰
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {challenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} onJoin={(id) => console.log('Join challenge:', id)} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <MissionBoard stats={hospitalStats} />
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
              { icon: '🔍', title: 'AI 自動辨識', description: '透過 OCR 自動提取論文資訊，識別文章類型、期刊 Impact Factor' },
              { icon: '💰', title: '智慧計算獎勵', description: '根據規定自動計算獎勵金額，包含各項加成條件' },
              { icon: '🎮', title: '遊戲化激勵', description: '成就徽章、排行榜、挑戰任務，讓學術發表更有動力' },
            ].map((feature) => (
              <motion.div key={feature.title} whileHover={{ y: -5 }} className="glass-card p-8 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
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
