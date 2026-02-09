import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Microscope,
  FileText,
  Shield,
  ExternalLink,
  Users,
  BookOpen,
  Calendar,
  ChevronRight,
  Download,
  Beaker,
  Server,
  HardDrive,
  Award,
  Link2,
  Clock,
  CheckCircle,
} from 'lucide-react';

// Mock data for databases
const databases = [
  {
    id: 'nhird',
    name: '健保資料庫 (NHIRD)',
    description: '全民健保研究資料庫，涵蓋就醫紀錄、用藥資料、檢驗檢查等',
    type: '全國性資料庫',
    dataRange: '2000 年至今',
    records: '2,300 萬人',
    accessLevel: '需申請',
    status: 'available',
    contact: '研究部 分機 1234',
    features: ['門診處方', '住院紀錄', '手術紀錄', '影像檢查', '實驗室數據'],
  },
  {
    id: 'tcr',
    name: '全國癌登全人檔',
    description: '台灣癌症登記資料庫，包含癌症病例資料與追蹤資訊',
    type: '全國性資料庫',
    dataRange: '1979 年至今',
    records: '180 萬例',
    accessLevel: '需申請',
    status: 'available',
    contact: '研究部 分機 1235',
    features: ['癌症診斷', '分期資料', '治療方式', '存活追蹤'],
  },
  {
    id: 'trinex',
    name: 'TriNex 資料庫',
    description: '三軍總醫院電子病歷資料庫合作平台',
    type: '跨院資料庫',
    dataRange: '2010 年至今',
    records: '500 萬人次',
    accessLevel: '需簽約',
    status: 'available',
    contact: '研究部 分機 1236',
    features: ['多院區資料', '電子病歷', '影像資料'],
  },
  {
    id: 'cohort',
    name: '各科部自建 Cohort',
    description: '各臨床科部建立的專科疾病世代追蹤資料庫',
    type: '院內資料庫',
    dataRange: '依科部而異',
    records: '多個 Cohort',
    accessLevel: '科部主管核准',
    status: 'available',
    contact: '各科部研究負責人',
    features: ['心臟內科 CHF Cohort', '神經內科 Stroke Cohort', '腫瘤科 Cancer Cohort', '急診 Trauma Cohort'],
  },
  {
    id: 'hyperion',
    name: '院內 Hyperion 系統',
    description: '奇美醫院整合性臨床資料倉儲系統',
    type: '院內資料庫',
    dataRange: '2005 年至今',
    records: '1,200 萬人次',
    accessLevel: 'IRB 通過後',
    status: 'available',
    contact: '資訊部 分機 2000',
    features: ['病歷資料', '檢驗報告', '影像報告', '手術紀錄', '護理紀錄'],
  },
];

// Mock data for labs
const labs = [
  {
    id: 'lab1',
    name: 'AI 醫療影像研究室',
    type: 'Dry Lab',
    pi: '張明華 教授',
    members: 8,
    focus: ['醫療影像 AI', '深度學習', '電腦輔助診斷'],
    recentPapers: 12,
    avgIF: 4.5,
    currentProjects: ['肺癌早期偵測 AI', '骨折自動辨識系統'],
    equipment: ['GPU 運算叢集', 'PACS 連接', '標註平台'],
    contact: '研究大樓 5F, 分機 3001',
  },
  {
    id: 'lab2',
    name: '臨床大數據分析中心',
    type: 'Dry Lab',
    pi: '李志偉 主任',
    members: 12,
    focus: ['大數據分析', '機器學習', '預測模型'],
    recentPapers: 18,
    avgIF: 5.2,
    currentProjects: ['心衰竭預測模型', '敗血症早期警示'],
    equipment: ['HPC 叢集', 'SAS/R/Python', '資料庫存取'],
    contact: '研究大樓 6F, 分機 3002',
  },
  {
    id: 'lab3',
    name: '分子醫學研究室',
    type: 'Wet Lab',
    pi: '王美玲 研究員',
    members: 6,
    focus: ['基因體學', '轉譯醫學', '生物標記'],
    recentPapers: 8,
    avgIF: 6.8,
    currentProjects: ['癌症基因標記', '藥物反應預測'],
    equipment: ['NGS 定序儀', 'qPCR', 'ELISA Reader'],
    contact: '研究大樓 3F, 分機 3003',
  },
  {
    id: 'lab4',
    name: '細胞治療研究中心',
    type: 'Wet Lab',
    pi: '陳建宏 主任',
    members: 10,
    focus: ['細胞治療', '再生醫學', '幹細胞'],
    recentPapers: 6,
    avgIF: 8.2,
    currentProjects: ['CAR-T 細胞製備', '間質幹細胞研究'],
    equipment: ['GMP 無塵室', '流式細胞儀', '細胞培養設備'],
    contact: '細胞治療中心 2F, 分機 3004',
  },
  {
    id: 'lab5',
    name: '藥物動力學研究室',
    type: 'Wet Lab',
    pi: '黃藥師',
    members: 5,
    focus: ['藥物動力學', '臨床藥學', '藥物交互作用'],
    recentPapers: 10,
    avgIF: 3.8,
    currentProjects: ['抗生素劑量優化', 'TDM 研究'],
    equipment: ['LC-MS/MS', 'HPLC', '藥動軟體'],
    contact: '藥劑部 B1, 分機 3005',
  },
];

// Mock data for funding opportunities
const fundingOpportunities = [
  {
    id: 'most',
    name: '國科會專題研究計畫',
    organization: '國家科學及技術委員會',
    deadline: '2024-03-31',
    amount: '50-150 萬/年',
    duration: '1-3 年',
    status: 'open',
    url: 'https://www.nstc.gov.tw',
    documents: ['計畫申請書', '研究計畫', '預算表', 'CV'],
  },
  {
    id: 'mohw',
    name: '衛福部科技研究計畫',
    organization: '衛生福利部',
    deadline: '2024-04-15',
    amount: '80-200 萬/年',
    duration: '1-2 年',
    status: 'open',
    url: 'https://www.mohw.gov.tw',
    documents: ['計畫申請書', '研究計畫', '預算表', '倫理審查'],
  },
  {
    id: 'hospital',
    name: '院內研究計畫',
    organization: '奇美醫院研究部',
    deadline: '全年受理',
    amount: '10-50 萬',
    duration: '1 年',
    status: 'open',
    url: '/research/apply',
    documents: ['院內申請表', '研究計畫書', '預算表'],
  },
  {
    id: 'tctf',
    name: '台灣癌症臨床研究發展基金會',
    organization: 'TCTF',
    deadline: '2024-05-31',
    amount: '30-100 萬',
    duration: '1 年',
    status: 'open',
    url: 'https://www.tctf.org.tw',
    documents: ['申請表', '計畫書', '推薦函'],
  },
  {
    id: 'industry',
    name: '產學合作研究計畫',
    organization: '各廠商',
    deadline: '不定期',
    amount: '依計畫而定',
    duration: '1-3 年',
    status: 'varies',
    url: '/research/industry',
    documents: ['合作意向書', '研究計畫', '合約書'],
  },
];

// Mock data for IRB resources
const irbResources = [
  {
    id: 'irb-forms',
    title: '申請表單下載',
    items: [
      { name: '新案申請表', url: '#', type: 'docx' },
      { name: '變更申請表', url: '#', type: 'docx' },
      { name: '結案申請表', url: '#', type: 'docx' },
      { name: '年度報告表', url: '#', type: 'docx' },
      { name: '不良事件報告表', url: '#', type: 'docx' },
      { name: '知情同意書範本', url: '#', type: 'docx' },
    ],
  },
  {
    id: 'irb-guides',
    title: '申請指引',
    items: [
      { name: 'IRB 申請流程說明', url: '#', type: 'pdf' },
      { name: '研究倫理審查要點', url: '#', type: 'pdf' },
      { name: '知情同意書撰寫指引', url: '#', type: 'pdf' },
      { name: '受試者保護準則', url: '#', type: 'pdf' },
    ],
  },
  {
    id: 'irb-training',
    title: '教育訓練',
    items: [
      { name: 'GCP 課程報名', url: '#', type: 'link' },
      { name: '研究倫理工作坊', url: '#', type: 'link' },
      { name: '線上學習平台', url: '#', type: 'link' },
    ],
  },
];

const ResearchResources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'databases' | 'labs' | 'funding' | 'irb'>('databases');
  const [expandedLab, setExpandedLab] = useState<string | null>(null);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            奇美醫院研究資源中心
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            研究資源
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            整合院內外研究資源，支援您的學術研究之路
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="glass-card p-1.5 inline-flex gap-1 flex-wrap justify-center">
            {[
              { id: 'databases', label: '可用資料庫', icon: Database },
              { id: 'labs', label: '實驗室', icon: Microscope },
              { id: 'funding', label: '研究計畫', icon: Award },
              { id: 'irb', label: 'IRB 資源', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
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

        {/* Databases Tab */}
        {activeTab === 'databases' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {databases.map((db, index) => (
              <motion.div
                key={db.id}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <HardDrive className="w-7 h-7 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-800">{db.name}</h3>
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">{db.type}</span>
                      {db.status === 'available' && (
                        <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> 可申請
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 mb-4">{db.description}</p>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-500">資料期間</p>
                        <p className="font-medium text-slate-700">{db.dataRange}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">資料量</p>
                        <p className="font-medium text-slate-700">{db.records}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">申請方式</p>
                        <p className="font-medium text-slate-700">{db.accessLevel}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">聯絡窗口</p>
                        <p className="font-medium text-slate-700">{db.contact}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-2">包含資料</p>
                      <div className="flex flex-wrap gap-2">
                        {db.features.map((feature) => (
                          <span key={feature} className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 flex-shrink-0">
                    申請使用
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Labs Tab */}
        {activeTab === 'labs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="glass-card p-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-slate-700">Dry Lab</span>
                  <span className="text-sm text-slate-500">（計算/分析）</span>
                </div>
                <div className="flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium text-slate-700">Wet Lab</span>
                  <span className="text-sm text-slate-500">（實驗/生物）</span>
                </div>
              </div>
            </div>

            {labs.map((lab, index) => (
              <motion.div
                key={lab.id}
                className="glass-card overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedLab(expandedLab === lab.id ? null : lab.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      lab.type === 'Wet Lab'
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                        : 'bg-gradient-to-br from-blue-500 to-indigo-500'
                    }`}>
                      {lab.type === 'Wet Lab' ? (
                        <Beaker className="w-7 h-7 text-white" />
                      ) : (
                        <Server className="w-7 h-7 text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-slate-800">{lab.name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          lab.type === 'Wet Lab'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {lab.type}
                        </span>
                      </div>
                      <p className="text-slate-600">
                        <span className="font-medium">PI:</span> {lab.pi} ｜
                        <span className="font-medium"> 成員:</span> {lab.members} 人 ｜
                        <span className="font-medium"> 近期發表:</span> {lab.recentPapers} 篇 (平均 IF: {lab.avgIF})
                      </p>
                    </div>

                    <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedLab === lab.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {expandedLab === lab.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 border-t border-slate-200/50"
                  >
                    <div className="pt-4 grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-700 mb-2">研究重點</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {lab.focus.map((f) => (
                            <span key={f} className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full">
                              {f}
                            </span>
                          ))}
                        </div>

                        <h4 className="font-semibold text-slate-700 mb-2">目前執行計畫</h4>
                        <ul className="space-y-1 mb-4">
                          {lab.currentProjects.map((proj) => (
                            <li key={proj} className="text-sm text-slate-600 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              {proj}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-700 mb-2">設備資源</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {lab.equipment.map((eq) => (
                            <span key={eq} className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded-full">
                              {eq}
                            </span>
                          ))}
                        </div>

                        <h4 className="font-semibold text-slate-700 mb-2">聯絡方式</h4>
                        <p className="text-sm text-slate-600">{lab.contact}</p>

                        <button className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center gap-2">
                          <Link2 className="w-4 h-4" />
                          聯繫實驗室
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Funding Tab */}
        {activeTab === 'funding' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {fundingOpportunities.map((fund, index) => (
              <motion.div
                key={fund.id}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Award className="w-7 h-7 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-800">{fund.name}</h3>
                      {fund.status === 'open' && (
                        <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> 開放申請
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 mb-4">{fund.organization}</p>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-500">截止日期</p>
                        <p className="font-medium text-slate-700 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {fund.deadline}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">補助金額</p>
                        <p className="font-medium text-slate-700">{fund.amount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">執行期間</p>
                        <p className="font-medium text-slate-700">{fund.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">申請網址</p>
                        <a href={fund.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                          前往申請
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-2">需要文件</p>
                      <div className="flex flex-wrap gap-2">
                        {fund.documents.map((doc) => (
                          <span key={doc} className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded-full flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center gap-2">
                      查看詳情
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      下載範本
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* IRB Tab */}
        {activeTab === 'irb' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* IRB Info Card */}
            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">奇美醫院人體試驗委員會 (IRB)</h2>
                  <p className="text-slate-600 mb-4">
                    本院 IRB 負責審查涉及人體試驗之研究計畫，確保受試者權益受到保護。
                    所有人體研究計畫須經 IRB 核准後方可執行。
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      審查時程：約 2-4 週
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      會議：每月第二、四週三
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="w-4 h-4" />
                      聯絡：研究部 IRB 組 分機 1240
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* IRB Resources Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {irbResources.map((section) => (
                <div key={section.id} className="glass-card p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">{section.title}</h3>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <a
                        key={item.name}
                        href={item.url}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50/80 hover:bg-slate-100 transition-colors"
                      >
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          item.type === 'pdf' ? 'bg-red-100 text-red-600' :
                          item.type === 'docx' ? 'bg-blue-100 text-blue-600' :
                          'bg-emerald-100 text-emerald-600'
                        }`}>
                          {item.type.toUpperCase()}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* IRB Process */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">IRB 申請流程</h3>
              <div className="flex flex-col md:flex-row gap-4">
                {[
                  { step: 1, title: '準備文件', desc: '填寫申請表、研究計畫書、知情同意書' },
                  { step: 2, title: '線上送件', desc: '透過 IRB 系統提交申請' },
                  { step: 3, title: '行政審查', desc: '確認文件完整性' },
                  { step: 4, title: '委員審查', desc: '簡審或會議審查' },
                  { step: 5, title: '核准執行', desc: '取得核准函後執行研究' },
                ].map((item, index) => (
                  <div key={item.step} className="flex-1 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{item.title}</h4>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                    {index < 4 && (
                      <ChevronRight className="w-5 h-5 text-slate-300 hidden md:block mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResearchResources;
