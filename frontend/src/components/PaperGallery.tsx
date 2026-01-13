import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import PaperCard from './PaperCard';
import type { Paper, PaperType } from '../types';

interface PaperGalleryProps {
  papers: Paper[];
  isLoading?: boolean;
  onPaperClick?: (paper: Paper) => void;
  showRewards?: boolean;
  rewards?: Record<string, number>;
}

const paperTypeOptions: { value: PaperType | 'all'; label: string }[] = [
  { value: 'all', label: '全部類型' },
  { value: 'original', label: '原著論文' },
  { value: 'case_report', label: '病例報告' },
  { value: 'review', label: '綜說文章' },
  { value: 'letter', label: 'Letter' },
  { value: 'abstract_poster', label: '海報發表' },
  { value: 'abstract_oral', label: '口頭報告' },
  { value: 'image', label: 'Image' },
];

const PaperGallery: React.FC<PaperGalleryProps> = ({
  papers,
  isLoading = false,
  onPaperClick,
  showRewards = false,
  rewards = {},
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PaperType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'impact'>('date');

  // Filter and sort papers
  const filteredPapers = papers
    .filter((paper) => {
      const matchesSearch =
        searchQuery === '' ||
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.titleChinese?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.some((a) =>
          a.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesType =
        selectedType === 'all' || paper.paperType === selectedType;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return (
            new Date(b.publicationDate || 0).getTime() -
            new Date(a.publicationDate || 0).getTime()
          );
        case 'title':
          return a.title.localeCompare(b.title);
        case 'impact':
          return (
            (b.journalInfo?.impactFactor || 0) -
            (a.journalInfo?.impactFactor || 0)
          );
        default:
          return 0;
      }
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋論文標題、作者..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            {/* Type Filter */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as PaperType | 'all')}
                className="input-field pr-10 appearance-none cursor-pointer"
              >
                {paperTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* More Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl transition-colors ${
                showFilters
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/80 text-slate-600 hover:bg-white'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/80 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Extended Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    排序方式
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="input-field"
                  >
                    <option value="date">發表日期（新到舊）</option>
                    <option value="title">標題（A-Z）</option>
                    <option value="impact">Impact Factor（高到低）</option>
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    發表年份
                  </label>
                  <select className="input-field">
                    <option value="">全部年份</option>
                    {[2024, 2023, 2022, 2021, 2020].map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Journal Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    期刊類型
                  </label>
                  <select className="input-field">
                    <option value="">全部</option>
                    <option value="sci">SCI</option>
                    <option value="ssci">SSCI</option>
                    <option value="non_sci">非 SCI</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-slate-600">
          共 <span className="font-semibold text-slate-800">{filteredPapers.length}</span> 篇論文
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-32 bg-slate-200 rounded-xl mb-4" />
              <div className="h-6 bg-slate-200 rounded mb-2" />
              <div className="h-4 bg-slate-200 rounded w-2/3 mb-4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPapers.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            找不到符合條件的論文
          </h3>
          <p className="text-slate-500">
            請嘗試調整搜尋條件或篩選器
          </p>
        </div>
      )}

      {/* Papers Grid/List */}
      {!isLoading && filteredPapers.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredPapers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              onClick={() => onPaperClick?.(paper)}
              showReward={showRewards}
              rewardAmount={rewards[paper.id]}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PaperGallery;
