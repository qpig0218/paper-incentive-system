import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle2,
  Circle,
  PartyPopper,
} from 'lucide-react';
import type { HospitalStats } from '../../types/gamification';

interface MissionBoardProps {
  stats: HospitalStats;
  compact?: boolean;
}

const MissionBoard: React.FC<MissionBoardProps> = ({ stats, compact = false }) => {
  const { yearlyGoal, milestones, recentAchievements } = stats;

  const calculateProgress = (current: number, target: number) =>
    Math.min((current / target) * 100, 100);

  if (compact) {
    return (
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary-500" />
          <h3 className="font-bold text-slate-800">院內學術目標</h3>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {yearlyGoal.sciPapers.current}
            </div>
            <div className="text-xs text-slate-600">
              / {yearlyGoal.sciPapers.target} SCI
            </div>
            <div className="mt-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress(yearlyGoal.sciPapers.current, yearlyGoal.sciPapers.target)}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {yearlyGoal.totalPapers.current}
            </div>
            <div className="text-xs text-slate-600">
              / {yearlyGoal.totalPapers.target} 篇
            </div>
            <div className="mt-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress(yearlyGoal.totalPapers.current, yearlyGoal.totalPapers.target)}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">
              {(yearlyGoal.totalRewards.current / 10000).toFixed(0)}
            </div>
            <div className="text-xs text-slate-600">
              / {yearlyGoal.totalRewards.target / 10000} 萬
            </div>
            <div className="mt-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress(yearlyGoal.totalRewards.current, yearlyGoal.totalRewards.target)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">院內學術使命</h2>
              <p className="text-sm text-slate-600">2024 年度目標進度</p>
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-amber-500" />
        </div>
      </div>

      {/* Goals Section */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          年度目標
        </h3>

        <div className="space-y-6">
          {/* SCI Papers Goal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">SCI 論文</span>
              <span className="text-sm text-slate-600">
                <span className="font-bold text-primary-600">{yearlyGoal.sciPapers.current}</span>
                {' / '}{yearlyGoal.sciPapers.target} 篇
              </span>
            </div>
            <div className="h-3 bg-slate-200/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress(yearlyGoal.sciPapers.current, yearlyGoal.sciPapers.target)}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              </motion.div>
            </div>
          </div>

          {/* Total Papers Goal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">總論文數</span>
              <span className="text-sm text-slate-600">
                <span className="font-bold text-emerald-600">{yearlyGoal.totalPapers.current}</span>
                {' / '}{yearlyGoal.totalPapers.target} 篇
              </span>
            </div>
            <div className="h-3 bg-slate-200/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress(yearlyGoal.totalPapers.current, yearlyGoal.totalPapers.target)}%` }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
          </div>

          {/* Rewards Goal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">獎勵金額</span>
              <span className="text-sm text-slate-600">
                <span className="font-bold text-amber-600">
                  NT$ {(yearlyGoal.totalRewards.current / 10000).toFixed(0)} 萬
                </span>
                {' / '}{yearlyGoal.totalRewards.target / 10000} 萬
              </span>
            </div>
            <div className="h-3 bg-slate-200/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress(yearlyGoal.totalRewards.current, yearlyGoal.totalRewards.target)}%` }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="p-6 bg-slate-50/50 border-t border-slate-200/50">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4" />
          里程碑
        </h3>

        <div className="space-y-3">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              className={`
                flex items-center gap-3 p-3 rounded-xl
                ${milestone.isReached
                  ? 'bg-emerald-50/80 border border-emerald-200'
                  : 'bg-white/50 border border-slate-200/50'
                }
              `}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              {milestone.isReached ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  milestone.isReached ? 'text-emerald-700' : 'text-slate-700'
                }`}>
                  {milestone.title}
                </p>
                {milestone.isReached && milestone.reachedAt && (
                  <p className="text-xs text-emerald-600">
                    達成於 {new Date(milestone.reachedAt).toLocaleDateString('zh-TW')}
                  </p>
                )}
                {!milestone.isReached && (
                  <p className="text-xs text-slate-600">
                    進度 {milestone.current} / {milestone.target}
                  </p>
                )}
              </div>
              {milestone.isReached && (
                <PartyPopper className="w-5 h-5 text-amber-500" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div className="p-6 border-t border-slate-200/50">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            最新成就動態
          </h3>

          <div className="space-y-3">
            {recentAchievements.slice(0, 3).map((item, index) => (
              <motion.div
                key={`${item.userName}-${item.unlockedAt}`}
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <span className="text-2xl">{item.achievement.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">{item.userName}</span>
                    <span className="text-slate-600"> 獲得了 </span>
                    <span className="font-medium text-primary-600">{item.achievement.name}</span>
                  </p>
                  <p className="text-xs text-slate-600">{item.department}</p>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(item.unlockedAt).toLocaleDateString('zh-TW')}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionBoard;
