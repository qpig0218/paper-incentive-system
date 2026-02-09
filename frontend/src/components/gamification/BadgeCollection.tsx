import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Lock, Sparkles, Filter, X } from 'lucide-react';
import AchievementBadge from './AchievementBadge';
import type { Achievement, AchievementCategory, AchievementTier } from '../../types/gamification';
import { CATEGORY_ICONS, TIER_STYLES } from '../../types/gamification';

interface BadgeCollectionProps {
  allAchievements: Achievement[];
  unlockedIds: string[];
  showFilters?: boolean;
}

const categoryLabels: Record<AchievementCategory, string> = {
  paper: '論文成就',
  impact: '影響力',
  collaboration: '合作',
  streak: '連續紀錄',
  special: '特殊',
};

const tierLabels: Record<AchievementTier, string> = {
  bronze: '銅',
  silver: '銀',
  gold: '金',
  platinum: '白金',
  diamond: '鑽石',
};

const BadgeCollection: React.FC<BadgeCollectionProps> = ({
  allAchievements,
  unlockedIds,
  showFilters = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedTier, setSelectedTier] = useState<AchievementTier | 'all'>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);

  const categories = Object.keys(categoryLabels) as AchievementCategory[];
  const tiers = Object.keys(tierLabels) as AchievementTier[];

  const filteredAchievements = allAchievements.filter((achievement) => {
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) return false;
    if (selectedTier !== 'all' && achievement.tier !== selectedTier) return false;
    if (showUnlockedOnly && !unlockedIds.includes(achievement.id)) return false;
    return true;
  });

  const unlockedCount = unlockedIds.length;
  const totalCount = allAchievements.filter((a) => !a.isHidden).length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border-b border-slate-200/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">成就收藏館</h2>
              <p className="text-sm text-slate-500">
                已解鎖 {unlockedCount} / {totalCount} 個成就
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {progressPercentage.toFixed(0)}%
            </div>
            <p className="text-xs text-slate-500">完成度</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-slate-200/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 border-b border-slate-200/50 space-y-3">
          {/* Category Filter */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">類別</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${selectedCategory === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100/50 text-slate-600 hover:bg-slate-200/50'
                  }
                `}
              >
                全部
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1
                    ${selectedCategory === cat
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-100/50 text-slate-600 hover:bg-slate-200/50'
                    }
                  `}
                >
                  <span>{CATEGORY_ICONS[cat]}</span>
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Tier & Status Filter */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-2 block">等級</label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedTier('all')}
                  className={`
                    px-2.5 py-1 rounded-lg text-xs font-medium transition-all
                    ${selectedTier === 'all'
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-100/50 text-slate-600 hover:bg-slate-200/50'
                    }
                  `}
                >
                  全部
                </button>
                {tiers.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`
                      px-2.5 py-1 rounded-lg text-xs font-medium transition-all
                      ${selectedTier === tier
                        ? `bg-gradient-to-r ${TIER_STYLES[tier].gradient} text-white`
                        : 'bg-slate-100/50 text-slate-600 hover:bg-slate-200/50'
                      }
                    `}
                  >
                    {tierLabels[tier]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 mb-2 block">狀態</label>
              <button
                onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1
                  ${showUnlockedOnly
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100/50 text-slate-600 hover:bg-slate-200/50'
                  }
                `}
              >
                <Sparkles className="w-3 h-3" />
                只顯示已解鎖
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Badge Grid */}
      <div className="p-6">
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Filter className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>沒有符合條件的成就</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredAchievements.map((achievement, index) => {
                const isUnlocked = unlockedIds.includes(achievement.id);
                return (
                  <motion.div
                    key={achievement.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <AchievementBadge
                      achievement={achievement}
                      isUnlocked={isUnlocked}
                      size="md"
                      showDetails
                      onClick={() => setSelectedBadge(achievement)}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              className="glass-card max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-200/50 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>

              {/* Badge Display */}
              <div className="flex flex-col items-center text-center">
                <AchievementBadge
                  achievement={selectedBadge}
                  isUnlocked={unlockedIds.includes(selectedBadge.id)}
                  size="lg"
                />

                <h3 className="text-xl font-bold text-slate-800 mt-4">
                  {selectedBadge.isHidden && !unlockedIds.includes(selectedBadge.id)
                    ? '???'
                    : selectedBadge.name
                  }
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedBadge.nameEn}
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    bg-gradient-to-r ${TIER_STYLES[selectedBadge.tier as AchievementTier].gradient}
                    text-white
                  `}>
                    {tierLabels[selectedBadge.tier as AchievementTier]}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    {CATEGORY_ICONS[selectedBadge.category as AchievementCategory]} {categoryLabels[selectedBadge.category as AchievementCategory]}
                  </span>
                </div>

                <p className="text-slate-600 mt-4">
                  {selectedBadge.isHidden && !unlockedIds.includes(selectedBadge.id)
                    ? '這是一個隱藏成就，達成條件後即可解鎖！'
                    : selectedBadge.description
                  }
                </p>

                {unlockedIds.includes(selectedBadge.id) ? (
                  <div className="mt-4 flex items-center gap-2 text-emerald-600">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">已解鎖</span>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2 text-slate-400">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">尚未解鎖</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BadgeCollection;
