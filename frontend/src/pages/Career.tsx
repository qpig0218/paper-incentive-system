import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  FileText,
  TrendingUp,
  Calendar,
  Download,
  ChevronDown,
  BarChart3,
  PieChart,
} from 'lucide-react';
import type { CareerRecord, Paper } from '../types';

// Mock data
const mockCareerRecords: CareerRecord[] = [
  {
    id: '1',
    userId: 'user1',
    year: 2024,
    papers: [],
    totalReward: 320000,
    sciPaperCount: 4,
    nonSciPaperCount: 2,
    conferenceCount: 3,
  },
  {
    id: '2',
    userId: 'user1',
    year: 2023,
    papers: [],
    totalReward: 280000,
    sciPaperCount: 3,
    nonSciPaperCount: 3,
    conferenceCount: 4,
  },
  {
    id: '3',
    userId: 'user1',
    year: 2022,
    papers: [],
    totalReward: 195000,
    sciPaperCount: 2,
    nonSciPaperCount: 2,
    conferenceCount: 2,
  },
];

const mockPapersByYear: Record<number, Paper[]> = {
  2024: [
    {
      id: '1',
      title: 'Machine Learning Approaches for Early Detection of Heart Failure',
      authors: [{ id: '1', name: '王大明', affiliation: '奇美醫院', isFirst: true, isCorresponding: true, order: 1 }],
      paperType: 'original',
      journalInfo: { name: 'Journal of Medical Internet Research', isSci: true, isSsci: false, impactFactor: 5.428 },
      publicationDate: '2024-03-15',
      createdAt: '2024-03-15',
      updatedAt: '2024-03-15',
    },
    {
      id: '2',
      title: 'A Novel Biomarker for Cardiac Amyloidosis Detection',
      authors: [{ id: '1', name: '王大明', affiliation: '奇美醫院', isFirst: true, isCorresponding: false, order: 1 }],
      paperType: 'original',
      journalInfo: { name: 'Circulation', isSci: true, isSsci: false, impactFactor: 39.918 },
      publicationDate: '2024-01-20',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
    },
  ],
  2023: [
    {
      id: '3',
      title: 'Implementation of Patient Safety Culture in Taiwan Hospitals',
      authors: [{ id: '1', name: '王大明', affiliation: '奇美醫院', isFirst: false, isCorresponding: true, order: 2 }],
      paperType: 'original',
      journalInfo: { name: '醫療品質雜誌', isSci: false, isSsci: false },
      publicationDate: '2023-06-10',
      createdAt: '2023-06-10',
      updatedAt: '2023-06-10',
    },
  ],
};

const Career: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [expandedYear, setExpandedYear] = useState<number | null>(2024);

  const totalReward = mockCareerRecords.reduce((sum, r) => sum + r.totalReward, 0);
  const totalSciPapers = mockCareerRecords.reduce((sum, r) => sum + r.sciPaperCount, 0);
  const totalNonSciPapers = mockCareerRecords.reduce((sum, r) => sum + r.nonSciPaperCount, 0);
  const totalConferences = mockCareerRecords.reduce((sum, r) => sum + r.conferenceCount, 0);

  const stats = [
    {
      label: '累計獎勵金額',
      value: `NT$ ${(totalReward / 10000).toFixed(0)} 萬`,
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

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">職涯學術歷程</h1>
          <p className="text-slate-500 mt-1">完整記錄您的學術發表成就</p>
        </div>

        {/* Stats Overview */}
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
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Trend Chart Placeholder */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">獎勵金額趨勢</h3>
              <BarChart3 className="w-5 h-5 text-slate-400" />
            </div>
            <div className="h-48 flex items-end justify-around gap-2">
              {mockCareerRecords.map((record) => (
                <div key={record.year} className="flex flex-col items-center gap-2">
                  <div
                    className="w-16 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all hover:from-primary-600 hover:to-primary-500"
                    style={{
                      height: `${(record.totalReward / 350000) * 150}px`,
                    }}
                  />
                  <span className="text-sm text-slate-600">{record.year}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Paper Distribution */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">論文類型分布</h3>
              <PieChart className="w-5 h-5 text-slate-400" />
            </div>
            <div className="h-48 flex items-center justify-center">
              <div className="relative w-40 h-40">
                {/* Simple pie chart visualization */}
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="20"
                    strokeDasharray={`${(totalSciPapers / (totalSciPapers + totalNonSciPapers + totalConferences)) * 251.2} 251.2`}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeDasharray={`${(totalNonSciPapers / (totalSciPapers + totalNonSciPapers + totalConferences)) * 251.2} 251.2`}
                    strokeDashoffset={`-${(totalSciPapers / (totalSciPapers + totalNonSciPapers + totalConferences)) * 251.2}`}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="20"
                    strokeDasharray={`${(totalConferences / (totalSciPapers + totalNonSciPapers + totalConferences)) * 251.2} 251.2`}
                    strokeDashoffset={`-${((totalSciPapers + totalNonSciPapers) / (totalSciPapers + totalNonSciPapers + totalConferences)) * 251.2}`}
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm text-slate-600">SCI 論文</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-sm text-slate-600">非 SCI 論文</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full" />
                <span className="text-sm text-slate-600">學會發表</span>
              </div>
            </div>
          </div>
        </div>

        {/* Year by Year Records */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">歷年發表記錄</h3>
            <button className="btn-secondary text-sm flex items-center gap-2">
              <Download className="w-4 h-4" />
              匯出報表
            </button>
          </div>

          <div className="space-y-4">
            {mockCareerRecords.map((record) => (
              <div key={record.year} className="border border-slate-200 rounded-xl overflow-hidden">
                {/* Year Header */}
                <button
                  onClick={() => setExpandedYear(expandedYear === record.year ? null : record.year)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-slate-800">{record.year} 年</span>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        SCI {record.sciPaperCount}
                      </span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                        非SCI {record.nonSciPaperCount}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        學會 {record.conferenceCount}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-primary-600">
                      NT$ {record.totalReward.toLocaleString()}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        expandedYear === record.year ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Papers List */}
                {expandedYear === record.year && mockPapersByYear[record.year] && (
                  <div className="px-6 py-4 space-y-3">
                    {mockPapersByYear[record.year].map((paper) => (
                      <div
                        key={paper.id}
                        className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-100"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-800 line-clamp-1">
                            {paper.title}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1">
                            {paper.journalInfo?.name}
                            {paper.journalInfo?.impactFactor && (
                              <span className="ml-2 text-primary-600">
                                IF: {paper.journalInfo.impactFactor}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(paper.publicationDate || '').toLocaleDateString('zh-TW')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            paper.journalInfo?.isSci
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {paper.journalInfo?.isSci ? 'SCI' : '非 SCI'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
