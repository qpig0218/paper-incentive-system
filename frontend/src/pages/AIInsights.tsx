import React, { useState } from 'react';
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
  Link2,
  GraduationCap,
  Microscope,
  Database,
  MessageSquare,
  FileCheck,
  Send,
  Edit3,
  RefreshCw,
  Shield,
} from 'lucide-react';

// AI Tools data
const aiTools = [
  {
    id: 'irb',
    name: 'IRB 撰寫助理',
    description: '協助撰寫 IRB 計畫書，自動生成研究倫理相關文件',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
    status: 'available',
  },
  {
    id: 'most',
    name: '國科會計畫撰寫 AI',
    description: '協助撰寫國科會研究計畫，包含摘要、文獻回顧、方法學',
    icon: GraduationCap,
    color: 'from-purple-500 to-violet-500',
    status: 'available',
  },
  {
    id: 'hospital-project',
    name: '院內計畫撰寫 AI',
    description: '協助撰寫院內研究計畫申請書',
    icon: FileText,
    color: 'from-emerald-500 to-teal-500',
    status: 'available',
  },
  {
    id: 'literature',
    name: '文獻搜尋 AI',
    description: '智慧搜尋相關文獻，自動整理參考資料',
    icon: Search,
    color: 'from-amber-500 to-orange-500',
    status: 'available',
  },
  {
    id: 'topic',
    name: '研究主題探索 AI',
    description: '探索研究趨勢，發掘創新研究主題',
    icon: Lightbulb,
    color: 'from-pink-500 to-rose-500',
    status: 'available',
  },
  {
    id: 'analysis',
    name: '資料分析 AI',
    description: '統計分析、資料處理、結果解讀',
    icon: BarChart3,
    color: 'from-indigo-500 to-blue-500',
    status: 'available',
  },
  {
    id: 'chart',
    name: '學術圖表製作 AI',
    description: '自動生成專業學術圖表與視覺化',
    icon: BarChart3,
    color: 'from-cyan-500 to-blue-500',
    status: 'available',
  },
  {
    id: 'writing',
    name: '學術文章協作助理',
    description: '論文寫作輔助，語法修正，學術用語建議',
    icon: PenTool,
    color: 'from-violet-500 to-purple-500',
    status: 'available',
  },
  {
    id: 'citation',
    name: '文獻格式整理 AI',
    description: '自動整理引用格式，支援各種期刊規範',
    icon: BookOpen,
    color: 'from-teal-500 to-emerald-500',
    status: 'available',
  },
  {
    id: 'plagiarism',
    name: '文章抄襲檢查 AI',
    description: '檢測文章相似度，確保學術誠信',
    icon: FileCheck,
    color: 'from-red-500 to-orange-500',
    status: 'available',
  },
  {
    id: 'journal',
    name: '期刊投稿建議 AI',
    description: '推薦適合投稿的期刊，分析接受率',
    icon: Send,
    color: 'from-blue-500 to-indigo-500',
    status: 'available',
  },
  {
    id: 'peer-review',
    name: '同儕審閱 AI',
    description: '模擬同儕審查，提供修改建議',
    icon: MessageSquare,
    color: 'from-green-500 to-emerald-500',
    status: 'available',
  },
  {
    id: 'editor',
    name: '期刊主編助理 AI',
    description: '協助處理投稿流程與審稿管理',
    icon: Edit3,
    color: 'from-slate-500 to-gray-600',
    status: 'coming_soon',
  },
  {
    id: 'revision',
    name: 'Revision 助理 AI',
    description: '協助處理審稿意見，撰寫回覆信',
    icon: RefreshCw,
    color: 'from-orange-500 to-amber-500',
    status: 'available',
  },
];

// Mock researcher analysis data
const mockResearcherAnalysis = {
  strengths: [
    { area: '心血管疾病研究', score: 92, description: '在心臟衰竭早期偵測領域有傑出表現' },
    { area: '機器學習應用', score: 88, description: '善於將 AI 技術應用於臨床研究' },
    { area: '系統性文獻回顧', score: 85, description: '具備紮實的文獻回顧與統合分析能力' },
  ],
  improvements: [
    { area: '跨領域合作', score: 45, suggestion: '建議增加與其他科部的合作研究' },
    { area: '國際合作', score: 38, suggestion: '可考慮與國外機構建立研究合作關係' },
    { area: '臨床試驗經驗', score: 52, suggestion: '建議參與更多 RCT 或前瞻性研究' },
  ],
  researchDomains: [
    { name: '心血管醫學', percentage: 45 },
    { name: '人工智慧', percentage: 30 },
    { name: '流行病學', percentage: 15 },
    { name: '醫療品質', percentage: 10 },
  ],
  metrics: {
    totalPapers: 15,
    sciPapers: 8,
    hIndex: 6,
    citations: 124,
    impactFactorSum: 42.5,
  },
};

// Mock similar researchers
const mockSimilarResearchers = [
  {
    id: '1',
    name: '陳醫師',
    department: '神經內科',
    similarity: 85,
    expertise: ['AI 醫療應用', '神經退化疾病'],
    recentPaper: 'Deep Learning for Early Detection of Alzheimer\'s Disease',
  },
  {
    id: '2',
    name: '林研究員',
    department: '研究部',
    similarity: 78,
    expertise: ['機器學習', '生物資訊'],
    recentPaper: 'Machine Learning in Clinical Decision Support Systems',
  },
  {
    id: '3',
    name: '張主任',
    department: '資訊部',
    similarity: 72,
    expertise: ['醫療資訊', '資料科學'],
    recentPaper: 'Big Data Analytics in Healthcare',
  },
];

const AIInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'matching' | 'tools'>('analysis');
  const [, setSelectedTool] = useState<string | null>(null);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-primary-700 text-sm font-medium mb-4">
            <Brain className="w-4 h-4" />
            AI 驅動的研究輔助
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            AI 洞察與援助
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            透過 AI 分析您的研究能量，提供個人化建議與資源媒合
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="glass-card p-1.5 inline-flex gap-1">
            {[
              { id: 'analysis', label: '個人研究分析', icon: BarChart3 },
              { id: 'matching', label: '資源媒合', icon: Users },
              { id: 'tools', label: 'AI 工具庫', icon: Zap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100/50'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'analysis' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Research Metrics */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-500" />
                  研究能量概覽
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {[
                    { label: '總論文數', value: mockResearcherAnalysis.metrics.totalPapers, color: 'text-blue-600' },
                    { label: 'SCI 論文', value: mockResearcherAnalysis.metrics.sciPapers, color: 'text-emerald-600' },
                    { label: 'H-Index', value: mockResearcherAnalysis.metrics.hIndex, color: 'text-purple-600' },
                    { label: '總引用數', value: mockResearcherAnalysis.metrics.citations, color: 'text-amber-600' },
                    { label: 'IF 總和', value: mockResearcherAnalysis.metrics.impactFactorSum, color: 'text-rose-600' },
                  ].map((metric) => (
                    <div key={metric.label} className="text-center p-4 rounded-xl bg-slate-50/80">
                      <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                      <p className="text-sm text-slate-600">{metric.label}</p>
                    </div>
                  ))}
                </div>

                {/* Research Domains */}
                <h3 className="font-semibold text-slate-700 mb-3">研究領域分布</h3>
                <div className="space-y-3">
                  {mockResearcherAnalysis.researchDomains.map((domain) => (
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
              </div>

              {/* Strengths */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  表現優異領域
                </h2>
                <div className="space-y-4">
                  {mockResearcherAnalysis.strengths.map((strength, index) => (
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

              {/* Areas for Improvement */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  建議強化領域
                </h2>
                <div className="space-y-4">
                  {mockResearcherAnalysis.improvements.map((item, index) => (
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

            {/* AI Suggestions Sidebar */}
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
                      根據您的研究專長，建議嘗試將 AI 技術應用於其他臨床領域，如神經內科或腫瘤科的預測模型開發。
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50">
                    <h4 className="font-medium text-emerald-700 mb-2">合作機會</h4>
                    <p className="text-sm text-slate-600">
                      發現 3 位院內研究者與您的研究興趣相近，建議進行跨科部合作。
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50">
                    <h4 className="font-medium text-amber-700 mb-2">計畫建議</h4>
                    <p className="text-sm text-slate-600">
                      今年度國科會計畫截止日期將近，建議以您的 AI 醫療研究方向提出申請。
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Similar Researchers */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-500" />
                推薦合作研究者
              </h2>
              <p className="text-slate-600 mb-6">
                根據您的研究領域與專長，以下是與您研究方向相近的院內研究者：
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {mockSimilarResearchers.map((researcher, index) => (
                  <motion.div
                    key={researcher.id}
                    className="p-5 rounded-xl bg-slate-50/80 border border-slate-200/50 hover:border-primary-300 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold">
                          {researcher.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{researcher.name}</h4>
                          <p className="text-sm text-slate-500">{researcher.department}</p>
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                        {researcher.similarity}% 相似
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-slate-500 mb-1">研究專長</p>
                      <div className="flex flex-wrap gap-1">
                        {researcher.expertise.map((exp) => (
                          <span key={exp} className="px-2 py-0.5 text-xs bg-slate-200/80 text-slate-600 rounded-full">
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-slate-500 mb-1">近期發表</p>
                      <p className="text-sm text-slate-700 line-clamp-2">{researcher.recentPaper}</p>
                    </div>

                    <button className="w-full py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2">
                      <Link2 className="w-4 h-4" />
                      聯繫合作
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Resource Matching */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-500" />
                  推薦資料庫
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  根據您的研究方向，以下資料庫可能對您有幫助：
                </p>
                <div className="space-y-3">
                  {[
                    { name: '健保資料庫', match: '95%', reason: '心血管疾病研究' },
                    { name: 'TriNex 資料庫', match: '88%', reason: '臨床預測模型' },
                    { name: '全國癌登全人檔', match: '72%', reason: '跨疾病研究' },
                  ].map((db) => (
                    <div key={db.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/80">
                      <div>
                        <p className="font-medium text-slate-800">{db.name}</p>
                        <p className="text-xs text-slate-500">{db.reason}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">{db.match}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-purple-500" />
                  推薦實驗室
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  以下實驗室的研究主題與您相關：
                </p>
                <div className="space-y-3">
                  {[
                    { name: 'AI 醫療影像實驗室', pi: '張教授', match: '92%' },
                    { name: '臨床大數據分析中心', pi: '李主任', match: '85%' },
                    { name: '轉譯醫學研究室', pi: '王研究員', match: '78%' },
                  ].map((lab) => (
                    <div key={lab.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/80">
                      <div>
                        <p className="font-medium text-slate-800">{lab.name}</p>
                        <p className="text-xs text-slate-500">PI: {lab.pi}</p>
                      </div>
                      <span className="text-sm font-bold text-purple-600">{lab.match}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tools' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
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
                  className={`
                    glass-card p-5 cursor-pointer transition-all
                    ${tool.status === 'coming_soon' ? 'opacity-60' : 'hover:shadow-lg'}
                  `}
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
                      <span className="px-2 py-0.5 text-xs bg-slate-200 text-slate-600 rounded-full">
                        即將推出
                      </span>
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
