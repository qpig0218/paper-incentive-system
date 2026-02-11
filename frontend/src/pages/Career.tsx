import React, { useState, useEffect } from 'react';
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
  Sparkles,
  ArrowRight,
  Trophy,
  Briefcase,
} from 'lucide-react';
import api from '../services/api';

interface PaperData {
  id: string;
  title: string;
  paperType: string;
  publicationDate?: string;
  journalInfo?: {
    name: string;
    isSci: boolean;
    isSsci: boolean;
    impactFactor?: number;
  };
  conferenceInfo?: {
    name: string;
    type: string;
  };
}

interface AppData {
  id: string;
  paperId: string;
  status: string;
  rewardAmount: number | null;
  submittedAt: string | null;
}

interface YearRecord {
  year: number;
  totalReward: number;
  sciPaperCount: number;
  nonSciPaperCount: number;
  conferenceCount: number;
  papers: PaperData[];
}

interface UserStats {
  totalPapers: number;
  totalApplications: number;
  approvedApplications: number;
  totalRewards: number;
  sciPapers: number;
  nonSciPapers: number;
}

const Career: React.FC = () => {
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'publications' | 'projects' | 'ai-analysis'>('publications');
  const [loading, setLoading] = useState(true);
  const [papers, setPapers] = useState<PaperData[]>([]);
  const [, setApplications] = useState<AppData[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [yearRecords, setYearRecords] = useState<YearRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const [papersRes, appsRes, statsRes] = await Promise.all([
          api.get('/papers/my'),
          api.get('/applications/my'),
          user.id ? api.get(`/users/${user.id}/stats`) : Promise.resolve({ data: { success: false } }),
        ]);

        const papersData: PaperData[] = papersRes.data.success ? papersRes.data.data : [];
        const appsData: AppData[] = appsRes.data.success ? appsRes.data.data : [];
        const stats: UserStats | null = statsRes.data.success ? statsRes.data.data : null;

        setPapers(papersData);
        setApplications(appsData);
        setUserStats(stats);

        // Group papers by year
        const yearMap: Record<number, YearRecord> = {};
        papersData.forEach((p) => {
          const year = p.publicationDate ? new Date(p.publicationDate).getFullYear() : new Date().getFullYear();
          if (!yearMap[year]) {
            yearMap[year] = { year, totalReward: 0, sciPaperCount: 0, nonSciPaperCount: 0, conferenceCount: 0, papers: [] };
          }
          yearMap[year].papers.push(p);
          if (p.conferenceInfo) {
            yearMap[year].conferenceCount++;
          } else if (p.journalInfo?.isSci) {
            yearMap[year].sciPaperCount++;
          } else {
            yearMap[year].nonSciPaperCount++;
          }
        });

        // Add reward amounts from approved applications
        appsData.forEach((app) => {
          if (app.status === 'approved' && app.rewardAmount) {
            const paper = papersData.find((p) => p.id === app.paperId);
            if (paper) {
              const year = paper.publicationDate ? new Date(paper.publicationDate).getFullYear() : new Date().getFullYear();
              if (yearMap[year]) {
                yearMap[year].totalReward += app.rewardAmount;
              }
            }
          }
        });

        const records = Object.values(yearMap).sort((a, b) => b.year - a.year);
        setYearRecords(records);
        if (records.length > 0) {
          setExpandedYear(records[0].year);
        }
      } catch (err) {
        console.error('Failed to fetch career data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalReward = userStats?.totalRewards || yearRecords.reduce((sum, r) => sum + r.totalReward, 0);
  const totalSciPapers = userStats?.sciPapers || yearRecords.reduce((sum, r) => sum + r.sciPaperCount, 0);
  const totalNonSciPapers = userStats?.nonSciPapers || yearRecords.reduce((sum, r) => sum + r.nonSciPaperCount, 0);
  const totalConferences = yearRecords.reduce((sum, r) => sum + r.conferenceCount, 0);

  const stats = [
    {
      label: '累計獎勵金額',
      value: totalReward > 0 ? `NT$ ${(totalReward / 10000).toFixed(0)} 萬` : 'NT$ 0',
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

  // Compute AI-style career insights from real data
  const totalPapers = papers.length;
  const avgPapersPerYear = yearRecords.length > 0 ? totalPapers / yearRecords.length : 0;
  const researchOutput = Math.min(100, Math.round((avgPapersPerYear / 5) * 100));
  const sciRatio = totalPapers > 0 ? Math.round((totalSciPapers / totalPapers) * 100) : 0;
  const overallScore = Math.round((researchOutput + sciRatio) / 2);

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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">職涯學術歷程</h1>
          <p className="text-slate-600 mt-1">完整記錄您的學術發表成就</p>
        </div>

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
          {activeTab === 'publications' && (
            <motion.div
              key="publications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {yearRecords.length > 0 && (
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-800">獎勵金額趨勢</h3>
                      <BarChart3 className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="h-48 flex items-end justify-around gap-2">
                      {yearRecords.slice(0, 6).reverse().map((record) => {
                        const maxReward = Math.max(...yearRecords.map((r) => r.totalReward), 1);
                        return (
                          <div key={record.year} className="flex flex-col items-center gap-2">
                            <div
                              className="w-16 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all hover:from-primary-600 hover:to-primary-500"
                              style={{ height: `${Math.max(4, (record.totalReward / maxReward) * 150)}px` }}
                            />
                            <span className="text-sm text-slate-700">{record.year}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-800">論文類型分布</h3>
                      <PieChart className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="h-48 flex items-center justify-center">
                      {(totalSciPapers + totalNonSciPapers + totalConferences) > 0 ? (
                        <div className="relative w-40 h-40">
                          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#0ea5e9" strokeWidth="20"
                              strokeDasharray={`${(totalSciPapers / (totalSciPapers + totalNonSciPapers + totalConferences)) * 251.2} 251.2`}
                            />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20"
                              strokeDasharray={`${(totalNonSciPapers / (totalSciPapers + totalNonSciPapers + totalConferences)) * 251.2} 251.2`}
                              strokeDashoffset={`-${(totalSciPapers / (totalSciPapers + totalNonSciPapers + totalConferences)) * 251.2}`}
                            />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="20"
                              strokeDasharray={`${(totalConferences / (totalSciPapers + totalNonSciPapers + totalConferences)) * 251.2} 251.2`}
                              strokeDashoffset={`-${((totalSciPapers + totalNonSciPapers) / (totalSciPapers + totalNonSciPapers + totalConferences)) * 251.2}`}
                            />
                          </svg>
                        </div>
                      ) : (
                        <p className="text-slate-400">尚無論文資料</p>
                      )}
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span className="text-sm text-slate-700">SCI ({totalSciPapers})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                        <span className="text-sm text-slate-700">非SCI ({totalNonSciPapers})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full" />
                        <span className="text-sm text-slate-700">學會 ({totalConferences})</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-slate-800">歷年發表記錄</h3>
                  <button className="btn-secondary text-sm flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    匯出報表
                  </button>
                </div>

                {yearRecords.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>尚無發表記錄</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {yearRecords.map((record) => (
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
                              className={`w-5 h-5 text-slate-500 transition-transform ${expandedYear === record.year ? 'rotate-180' : ''}`}
                            />
                          </div>
                        </button>

                        {expandedYear === record.year && (
                          <div className="px-6 py-4 space-y-3">
                            {record.papers.map((paper) => (
                              <div
                                key={paper.id}
                                className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-100"
                              >
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-5 h-5 text-primary-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-slate-800 line-clamp-1">{paper.title}</h4>
                                  <p className="text-sm text-slate-600 mt-1">
                                    {paper.journalInfo?.name || paper.conferenceInfo?.name || '-'}
                                    {paper.journalInfo?.impactFactor && (
                                      <span className="ml-2 text-primary-600">IF: {paper.journalInfo.impactFactor}</span>
                                    )}
                                  </p>
                                  {paper.publicationDate && (
                                    <p className="text-xs text-slate-500 mt-1">
                                      {new Date(paper.publicationDate).toLocaleDateString('zh-TW')}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    paper.journalInfo?.isSci ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {paper.journalInfo?.isSci ? 'SCI' : paper.conferenceInfo ? '學會' : '非 SCI'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass-card p-12 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">計畫管理功能即將上線</h3>
                <p className="text-slate-500">
                  此功能將可記錄國科會計畫、院內計畫、產學合作等申請歷程
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'ai-analysis' && (
            <motion.div
              key="ai-analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass-card p-6 mb-6 bg-gradient-to-r from-primary-500/10 to-accent-500/10">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">AI 職涯發展分析</h2>
                    <p className="text-slate-600">
                      根據您的 {totalPapers} 篇論文發表記錄，AI 分析您的學術職涯現況
                    </p>
                  </div>
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </motion.div>
                </div>
              </div>

              <div className="glass-card p-6 mb-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <svg viewBox="0 0 100 100" className="w-32 h-32">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                      <motion.circle
                        cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray="283"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{ strokeDashoffset: 283 - (283 * overallScore) / 100 }}
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
                      <span className="text-3xl font-bold text-slate-800">{overallScore}</span>
                      <span className="text-sm text-slate-600">綜合分數</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      {overallScore >= 70 ? '表現優秀' : overallScore >= 40 ? '持續成長中' : '建議加強研究產出'}
                    </h3>
                    <p className="text-slate-600 mb-4">
                      您共發表 {totalPapers} 篇論文，其中 SCI 論文 {totalSciPapers} 篇（佔比 {sciRatio}%），
                      平均每年發表 {avgPapersPerYear.toFixed(1)} 篇。
                      {totalReward > 0 && `累計獲得獎勵 NT$ ${totalReward.toLocaleString()}。`}
                    </p>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      <span className="text-sm font-medium text-slate-700">
                        {totalSciPapers >= 10 ? '資深研究者' : totalSciPapers >= 5 ? '中階研究者' : '新進研究者'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {[
                  {
                    category: '研究產出',
                    icon: '📊',
                    currentLevel: researchOutput,
                    suggestions: totalPapers > 0 ? [
                      `近 ${yearRecords.length} 年共發表 ${totalPapers} 篇論文`,
                      avgPapersPerYear >= 3 ? '研究產出量穩定，保持良好節奏' : '建議每年維持至少 3 篇論文發表',
                      '可嘗試系統性文獻回顧或統合分析文章提升產量',
                    ] : ['尚無論文發表記錄，建議開始研究計畫'],
                  },
                  {
                    category: 'SCI 品質',
                    icon: '🏆',
                    currentLevel: sciRatio,
                    suggestions: [
                      `SCI 論文佔比 ${sciRatio}%`,
                      sciRatio >= 50 ? 'SCI 佔比良好，可考慮投稿更高 IF 期刊' : '建議提高 SCI 論文比例',
                      '投稿 Q1 期刊可大幅提升學術影響力',
                    ],
                  },
                  {
                    category: '獎勵成效',
                    icon: '💰',
                    currentLevel: Math.min(100, Math.round((totalReward / 500000) * 100)),
                    suggestions: [
                      `累計獎勵 NT$ ${totalReward.toLocaleString()}`,
                      totalReward > 0 ? '持續申請獎勵以累積研究資源' : '發表論文後記得申請獎勵',
                      '第一作者或通訊作者可獲全額獎勵',
                    ],
                  },
                  {
                    category: '發表持續性',
                    icon: '📈',
                    currentLevel: Math.min(100, yearRecords.length * 25),
                    suggestions: [
                      `已有 ${yearRecords.length} 年的發表記錄`,
                      yearRecords.length >= 3 ? '發表連續性良好' : '建議維持每年穩定發表',
                      '持續的研究產出有助於學術升等',
                    ],
                  },
                ].map((insight, index) => (
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

              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-primary-500" />
                  <h3 className="font-semibold text-slate-800">建議行動項目</h3>
                </div>
                <div className="space-y-3">
                  {[
                    ...(sciRatio < 50 ? [{ priority: 'high' as const, action: '提高 SCI 論文比例', deadline: '本年度', impact: '提升學術影響力' }] : []),
                    ...(avgPapersPerYear < 3 ? [{ priority: 'high' as const, action: '增加研究產出', deadline: '持續進行', impact: '累積學術成果' }] : []),
                    { priority: 'medium' as const, action: '投稿 Q1 期刊論文', deadline: '本季度', impact: '提升學術影響力' },
                    { priority: 'medium' as const, action: '建立跨科合作研究', deadline: '持續進行', impact: '拓展研究領域' },
                    { priority: 'low' as const, action: '擔任期刊審稿人', deadline: '有機會時', impact: '提升學術能見度' },
                  ].slice(0, 4).map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${
                        item.priority === 'high' ? 'bg-red-50/50 border-red-200'
                        : item.priority === 'medium' ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-slate-50/50 border-slate-200'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        item.priority === 'high' ? 'bg-red-500' : item.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
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
