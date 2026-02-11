import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Lightbulb,
  ArrowRight,
  BookOpen,
  FileText,
  Search,
  BarChart3,
  PenTool,
  CheckCircle,
  AlertTriangle,
  Zap,
  GraduationCap,
  Database,
  Microscope,
  MessageSquare,
  FileCheck,
  Send,
  Edit3,
  RefreshCw,
  Shield,
} from 'lucide-react';
import api from '../services/api';

// AI Tools data (static configuration)
const aiTools = [
  { id: 'irb', name: 'IRB 撰寫助理', description: '協助撰寫 IRB 計畫書，自動生成研究倫理相關文件', icon: Shield, color: 'from-blue-500 to-cyan-500', status: 'available' },
  { id: 'most', name: '國科會計畫撰寫 AI', description: '協助撰寫國科會研究計畫，包含摘要、文獻回顧、方法學', icon: GraduationCap, color: 'from-purple-500 to-violet-500', status: 'available' },
  { id: 'hospital-project', name: '院內計畫撰寫 AI', description: '協助撰寫院內研究計畫申請書', icon: FileText, color: 'from-emerald-500 to-teal-500', status: 'available' },
  { id: 'literature', name: '文獻搜尋 AI', description: '智慧搜尋相關文獻，自動整理參考資料', icon: Search, color: 'from-amber-500 to-orange-500', status: 'available' },
  { id: 'topic', name: '研究主題探索 AI', description: '探索研究趨勢，發掘創新研究主題', icon: Lightbulb, color: 'from-pink-500 to-rose-500', status: 'available' },
  { id: 'analysis', name: '資料分析 AI', description: '統計分析、資料處理、結果解讀', icon: BarChart3, color: 'from-indigo-500 to-blue-500', status: 'available' },
  { id: 'chart', name: '學術圖表製作 AI', description: '自動生成專業學術圖表與視覺化', icon: BarChart3, color: 'from-cyan-500 to-blue-500', status: 'available' },
  { id: 'writing', name: '學術文章協作助理', description: '論文寫作輔助，語法修正，學術用語建議', icon: PenTool, color: 'from-violet-500 to-purple-500', status: 'available' },
  { id: 'citation', name: '文獻格式整理 AI', description: '自動整理引用格式，支援各種期刊規範', icon: BookOpen, color: 'from-teal-500 to-emerald-500', status: 'available' },
  { id: 'plagiarism', name: '文章抄襲檢查 AI', description: '檢測文章相似度，確保學術誠信', icon: FileCheck, color: 'from-red-500 to-orange-500', status: 'available' },
  { id: 'journal', name: '期刊投稿建議 AI', description: '推薦適合投稿的期刊，分析接受率', icon: Send, color: 'from-blue-500 to-indigo-500', status: 'available' },
  { id: 'peer-review', name: '同儕審閱 AI', description: '模擬同儕審查，提供修改建議', icon: MessageSquare, color: 'from-green-500 to-emerald-500', status: 'available' },
  { id: 'editor', name: '期刊主編助理 AI', description: '協助處理投稿流程與審稿管理', icon: Edit3, color: 'from-slate-500 to-gray-600', status: 'coming_soon' },
  { id: 'revision', name: 'Revision 助理 AI', description: '協助處理審稿意見，撰寫回覆信', icon: RefreshCw, color: 'from-orange-500 to-amber-500', status: 'available' },
];

interface UserStats {
  totalPapers: number;
  totalApplications: number;
  approvedApplications: number;
  totalRewards: number;
  sciPapers: number;
  nonSciPapers: number;
}

interface PaperData {
  id: string;
  title: string;
  paperType: string;
  journalInfo?: {
    name: string;
    isSci: boolean;
    impactFactor?: number;
    category?: string;
  };
}

const AIInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'matching' | 'tools'>('analysis');
  const [, setSelectedTool] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [papers, setPapers] = useState<PaperData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const [papersRes, statsRes] = await Promise.all([
          api.get('/papers/my'),
          user.id ? api.get(`/users/${user.id}/stats`) : Promise.resolve({ data: { success: false } }),
        ]);

        if (papersRes.data.success) setPapers(papersRes.data.data);
        if (statsRes.data.success) setUserStats(statsRes.data.data);
      } catch (err) {
        console.error('Failed to fetch AI insights data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute metrics from real data
  const totalPapers = userStats?.totalPapers || papers.length;
  const sciPapers = userStats?.sciPapers || papers.filter((p) => p.journalInfo?.isSci).length;
  const nonSciPapers = userStats?.nonSciPapers || totalPapers - sciPapers;
  const totalRewards = userStats?.totalRewards || 0;
  const impactFactorSum = papers.reduce((sum, p) => sum + (p.journalInfo?.impactFactor || 0), 0);

  // Compute research domains from paper categories
  const domainMap: Record<string, number> = {};
  papers.forEach((p) => {
    const category = p.journalInfo?.category || (p.journalInfo?.isSci ? 'SCI 期刊' : '其他');
    domainMap[category] = (domainMap[category] || 0) + 1;
  });
  const researchDomains = Object.entries(domainMap)
    .map(([name, count]) => ({ name, percentage: totalPapers > 0 ? Math.round((count / totalPapers) * 100) : 0 }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  // Compute strengths and improvements
  const sciRatio = totalPapers > 0 ? Math.round((sciPapers / totalPapers) * 100) : 0;

  const strengths = [];
  if (sciPapers > 0) {
    strengths.push({ area: 'SCI 論文發表', score: Math.min(95, 60 + sciPapers * 5), description: `共發表 ${sciPapers} 篇 SCI 論文` });
  }
  if (totalPapers >= 5) {
    strengths.push({ area: '研究產出', score: Math.min(95, 50 + totalPapers * 3), description: `累積 ${totalPapers} 篇論文發表` });
  }
  if (impactFactorSum > 10) {
    strengths.push({ area: '期刊品質', score: Math.min(95, 50 + Math.round(impactFactorSum * 2)), description: `IF 總和 ${impactFactorSum.toFixed(1)}` });
  }
  if (strengths.length === 0) {
    strengths.push({ area: '研究起步', score: 30, description: '建議開始累積論文發表記錄' });
  }

  const improvements = [];
  if (sciRatio < 50) {
    improvements.push({ area: 'SCI 比例', score: sciRatio, suggestion: '建議提高 SCI 論文比例至 50% 以上' });
  }
  improvements.push({ area: '跨領域合作', score: Math.min(60, researchDomains.length * 15), suggestion: '建議拓展跨科部合作研究' });
  improvements.push({ area: '國際合作', score: 35, suggestion: '可考慮與國外機構建立研究合作關係' });

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-slate-500">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-primary-700 text-sm font-medium mb-4">
            <Brain className="w-4 h-4" />
            AI 驅動的研究輔助
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">AI 洞察與援助</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            透過 AI 分析您的研究能量，提供個人化建議與資源媒合
          </p>
        </motion.div>

        <motion.div className="flex justify-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass-card p-1.5 inline-flex gap-1">
            {[
              { id: 'analysis', label: '個人研究分析', icon: BarChart3 },
              { id: 'matching', label: '資源媒合', icon: Users },
              { id: 'tools', label: 'AI 工具庫', icon: Zap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {activeTab === 'analysis' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-500" />
                  研究能量概覽
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {[
                    { label: '總論文數', value: totalPapers, color: 'text-blue-600' },
                    { label: 'SCI 論文', value: sciPapers, color: 'text-emerald-600' },
                    { label: '非SCI論文', value: nonSciPapers, color: 'text-purple-600' },
                    { label: '累計獎勵', value: totalRewards > 0 ? `${(totalRewards / 10000).toFixed(0)}萬` : '0', color: 'text-amber-600' },
                    { label: 'IF 總和', value: impactFactorSum.toFixed(1), color: 'text-rose-600' },
                  ].map((metric) => (
                    <div key={metric.label} className="text-center p-4 rounded-xl bg-slate-50/80">
                      <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                      <p className="text-sm text-slate-600">{metric.label}</p>
                    </div>
                  ))}
                </div>

                {researchDomains.length > 0 && (
                  <>
                    <h3 className="font-semibold text-slate-700 mb-3">研究領域分布</h3>
                    <div className="space-y-3">
                      {researchDomains.map((domain) => (
                        <div key={domain.name}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-slate-700">{domain.name}</span>
                            <span className="text-sm text-slate-500">{domain.percentage}%</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${domain.percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  表現優異領域
                </h2>
                <div className="space-y-4">
                  {strengths.map((strength, index) => (
                    <motion.div
                      key={strength.area}
                      className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                        {strength.score}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{strength.area}</h4>
                        <p className="text-sm text-slate-600">{strength.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  建議強化領域
                </h2>
                <div className="space-y-4">
                  {improvements.map((item, index) => (
                    <motion.div
                      key={item.area}
                      className="flex items-start gap-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200/50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                        {item.score}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{item.area}</h4>
                        <p className="text-sm text-slate-600">{item.suggestion}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                  AI 個人化建議
                </h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200/50">
                    <h4 className="font-medium text-primary-700 mb-2">下一步建議</h4>
                    <p className="text-sm text-slate-600">
                      {sciPapers > 0
                        ? '建議嘗試投稿更高 IF 的期刊，或開展跨領域合作研究。'
                        : '建議先以 SCI 期刊為目標，建立穩定的研究產出。'}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50">
                    <h4 className="font-medium text-emerald-700 mb-2">合作機會</h4>
                    <p className="text-sm text-slate-600">
                      建議與其他科部的研究者進行跨科合作，可增加國際合作機會。
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50">
                    <h4 className="font-medium text-amber-700 mb-2">獎勵提醒</h4>
                    <p className="text-sm text-slate-600">
                      {totalRewards > 0
                        ? `您已累積 NT$ ${totalRewards.toLocaleString()} 獎勵，持續發表以增加獎勵金額。`
                        : '發表論文後記得申請獎勵，第一作者或通訊作者可獲全額獎勵。'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  研究趨勢預測
                </h2>
                <div className="space-y-3">
                  {[
                    { trend: 'AI 輔助診斷', growth: '+45%', hot: true },
                    { trend: '精準醫療', growth: '+38%', hot: true },
                    { trend: '遠距醫療', growth: '+32%', hot: false },
                    { trend: '基因治療', growth: '+28%', hot: false },
                  ].map((item) => (
                    <div key={item.trend} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/80">
                      <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        {item.hot && <span className="text-xs">🔥</span>}
                        {item.trend}
                      </span>
                      <span className="text-sm font-bold text-emerald-600">{item.growth}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'matching' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-500" />
                推薦合作研究者
              </h2>
              <p className="text-slate-600 mb-6">
                AI 資源媒合功能即將上線，將根據您的研究領域推薦合適的院內合作研究者。
              </p>
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-500">此功能正在開發中，敬請期待</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-500" />
                  推薦資料庫
                </h2>
                <p className="text-sm text-slate-600 mb-4">常用研究資料庫：</p>
                <div className="space-y-3">
                  {[
                    { name: '健保資料庫', reason: '臨床研究' },
                    { name: 'TriNex 資料庫', reason: '臨床預測模型' },
                    { name: '全國癌登全人檔', reason: '跨疾病研究' },
                  ].map((db) => (
                    <div key={db.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/80">
                      <div>
                        <p className="font-medium text-slate-800">{db.name}</p>
                        <p className="text-xs text-slate-500">{db.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-purple-500" />
                  推薦實驗室
                </h2>
                <p className="text-sm text-slate-600 mb-4">院內研究資源：</p>
                <div className="space-y-3">
                  {[
                    { name: 'AI 醫療影像實驗室', pi: '待公布' },
                    { name: '臨床大數據分析中心', pi: '待公布' },
                    { name: '轉譯醫學研究室', pi: '待公布' },
                  ].map((lab) => (
                    <div key={lab.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/80">
                      <div>
                        <p className="font-medium text-slate-800">{lab.name}</p>
                        <p className="text-xs text-slate-500">PI: {lab.pi}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tools' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                AI 研究工具庫
              </h2>
              <p className="text-slate-600">
                14 種 AI 工具協助您的學術研究，從文獻搜尋到論文發表的完整支援
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {aiTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  className={`glass-card p-5 cursor-pointer transition-all ${tool.status === 'coming_soon' ? 'opacity-60' : 'hover:shadow-lg'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={tool.status !== 'coming_soon' ? { y: -4 } : undefined}
                  onClick={() => tool.status !== 'coming_soon' && setSelectedTool(tool.id)}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-800">{tool.name}</h3>
                    {tool.status === 'coming_soon' && (
                      <span className="px-2 py-0.5 text-xs bg-slate-200 text-slate-600 rounded-full">即將推出</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{tool.description}</p>
                  {tool.status !== 'coming_soon' && (
                    <button className="w-full py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                      開始使用
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
