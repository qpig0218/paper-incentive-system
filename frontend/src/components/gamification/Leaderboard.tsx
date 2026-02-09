import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Medal,
  Building2,
  Users,
  ChevronRight,
} from 'lucide-react';
import type { LeaderboardEntry, DepartmentLeaderboardEntry, LeaderboardType } from '../../types/gamification';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  type: LeaderboardType;
  currentUserId?: string;
  onTypeChange?: (type: LeaderboardType) => void;
  showTypeSelector?: boolean;
}

const leaderboardTypes: { value: LeaderboardType; label: string; icon: string }[] = [
  { value: 'monthly_papers', label: '本月發表', icon: '📅' },
  { value: 'yearly_papers', label: '年度累積', icon: '📊' },
  { value: 'total_if', label: 'IF 總和', icon: '📈' },
  { value: 'total_rewards', label: '獎勵金額', icon: '💰' },
  { value: 'sci_papers', label: 'SCI 論文', icon: '🔬' },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-5 h-5 text-amber-500" />;
    case 2:
      return <Medal className="w-5 h-5 text-slate-400" />;
    case 3:
      return <Medal className="w-5 h-5 text-amber-600" />;
    default:
      return <span className="text-sm font-bold text-slate-500">{rank}</span>;
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200';
    case 2:
      return 'bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200';
    case 3:
      return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200';
    default:
      return 'bg-white/50 border-slate-100';
  }
};

const getChangeIndicator = (change?: number) => {
  if (change === undefined || change === 0) {
    return <Minus className="w-4 h-4 text-slate-400" />;
  }
  if (change > 0) {
    return (
      <span className="flex items-center text-emerald-500 text-xs font-medium">
        <TrendingUp className="w-3 h-3 mr-0.5" />
        {change}
      </span>
    );
  }
  return (
    <span className="flex items-center text-red-500 text-xs font-medium">
      <TrendingDown className="w-3 h-3 mr-0.5" />
      {Math.abs(change)}
    </span>
  );
};

const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  type,
  currentUserId,
  onTypeChange,
  showTypeSelector = true,
}) => {
  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-800">排行榜</h3>
          </div>
        </div>

        {/* Type Selector */}
        {showTypeSelector && onTypeChange && (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {leaderboardTypes.map((lt) => (
              <motion.button
                key={lt.value}
                onClick={() => onTypeChange(lt.value)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                  whitespace-nowrap transition-all
                  ${type === lt.value
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{lt.icon}</span>
                {lt.label}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Leaderboard List */}
      <div className="divide-y divide-slate-100/50">
        <AnimatePresence mode="popLayout">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.userId}
              className={`
                flex items-center gap-4 p-4
                ${entry.userId === currentUserId ? 'bg-primary-50/50' : ''}
                ${getRankStyle(entry.rank)}
                border-l-4
              `}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Rank */}
              <div className="w-8 h-8 flex items-center justify-center">
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar & Name */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold text-sm">
                    {entry.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className={`
                      font-medium truncate
                      ${entry.userId === currentUserId ? 'text-primary-700' : 'text-slate-800'}
                    `}>
                      {entry.name}
                      {entry.userId === currentUserId && (
                        <span className="ml-2 text-xs text-primary-500">(您)</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-600 truncate">{entry.department}</p>
                  </div>
                </div>
              </div>

              {/* Value */}
              <div className="text-right">
                <p className="font-bold text-slate-800">
                  {type === 'total_rewards'
                    ? `$${(entry.value / 10000).toFixed(0)}萬`
                    : type === 'total_if'
                    ? entry.value.toFixed(1)
                    : entry.value
                  }
                </p>
                <div className="flex justify-end mt-0.5">
                  {getChangeIndicator(entry.change)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* View All Link */}
      <div className="p-3 border-t border-slate-200/50">
        <button className="w-full flex items-center justify-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
          查看完整排行榜
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Department Leaderboard Component
export const DepartmentLeaderboard: React.FC<{
  entries: DepartmentLeaderboardEntry[];
}> = ({ entries }) => {
  const [sortBy, setSortBy] = useState<'paperCount' | 'sciCount' | 'totalIF' | 'totalRewards'>('paperCount');

  const sortedEntries = [...entries].sort((a, b) => b[sortBy] - a[sortBy]).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-bold text-slate-800">部門排名</h3>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {[
            { key: 'paperCount', label: '論文數' },
            { key: 'sciCount', label: 'SCI' },
            { key: 'totalIF', label: 'IF' },
            { key: 'totalRewards', label: '獎勵' },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setSortBy(option.key as typeof sortBy)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium
                transition-all
                ${sortBy === option.key
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100/50">
        {sortedEntries.map((entry, index) => (
          <motion.div
            key={entry.department}
            className={`
              flex items-center gap-4 p-4
              ${getRankStyle(entry.rank)}
              border-l-4
            `}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Rank */}
            <div className="w-8 h-8 flex items-center justify-center">
              {getRankIcon(entry.rank)}
            </div>

            {/* Department Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 truncate">{entry.department}</p>
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <Users className="w-3 h-3" />
                {entry.memberCount} 人
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-right text-sm">
              <div>
                <span className="text-slate-600">論文</span>
                <span className="ml-1 font-bold text-slate-800">{entry.paperCount}</span>
              </div>
              <div>
                <span className="text-slate-600">SCI</span>
                <span className="ml-1 font-bold text-slate-800">{entry.sciCount}</span>
              </div>
              <div>
                <span className="text-slate-600">IF</span>
                <span className="ml-1 font-bold text-slate-800">{entry.totalIF.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-slate-600">獎勵</span>
                <span className="ml-1 font-bold text-slate-800">${(entry.totalRewards / 10000).toFixed(0)}萬</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
