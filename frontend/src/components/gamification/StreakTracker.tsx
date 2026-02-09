import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, Trophy, AlertTriangle } from 'lucide-react';
import type { Streak, StreakType } from '../../types/gamification';

interface StreakTrackerProps {
  streaks: Streak[];
  compact?: boolean;
}

const streakTypeInfo: Record<StreakType, { label: string; icon: string; description: string }> = {
  yearly_publication: {
    label: '年度連續發表',
    icon: '📅',
    description: '連續每年發表至少一篇論文',
  },
  monthly_submission: {
    label: '月度提交紀錄',
    icon: '📝',
    description: '連續每月提交論文申請',
  },
  consecutive_approval: {
    label: '連續審核通過',
    icon: '✅',
    description: '論文申請連續審核通過',
  },
};

const StreakTracker: React.FC<StreakTrackerProps> = ({ streaks, compact = false }) => {
  if (compact) {
    const mainStreak = streaks.find((s) => s.type === 'yearly_publication') || streaks[0];
    if (!mainStreak) return null;

    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-200/50">
        <motion.div
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Flame className="w-5 h-5 text-white" />
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-600">{mainStreak.count}</span>
            <span className="text-sm text-slate-700">年連續發表</span>
          </div>
          <p className="text-xs text-slate-600">最佳紀錄：{mainStreak.bestCount} 年</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-slate-800">連續紀錄</h3>
      </div>

      {streaks.length === 0 ? (
        <div className="text-center py-6 text-slate-600">
          <Calendar className="w-12 h-12 mx-auto mb-2 text-slate-400" />
          <p>尚未建立連續紀錄</p>
          <p className="text-sm">開始發表論文建立您的紀錄！</p>
        </div>
      ) : (
        <div className="space-y-4">
          {streaks.map((streak, index) => {
            const info = streakTypeInfo[streak.type as StreakType];
            const isAtRisk = streak.count > 0 && streak.count >= streak.bestCount;

            return (
              <motion.div
                key={streak.type}
                className={`
                  p-4 rounded-xl border
                  ${isAtRisk
                    ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
                    : 'bg-slate-50/50 border-slate-200/50'
                  }
                `}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon & Count */}
                  <div className="relative">
                    <motion.div
                      className={`
                        w-14 h-14 rounded-xl flex items-center justify-center
                        ${streak.count > 0
                          ? 'bg-gradient-to-br from-orange-500 to-red-500'
                          : 'bg-slate-300'
                        }
                      `}
                      animate={streak.count > 0 ? { scale: [1, 1.05, 1] } : undefined}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-2xl">{info.icon}</span>
                    </motion.div>
                    {streak.count > 0 && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, delay: 0.3 }}
                      >
                        {streak.count}
                      </motion.div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-800">{info.label}</h4>
                      {isAtRisk && (
                        <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          保持中
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{info.description}</p>

                    {/* Stats */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-slate-700">
                          目前：{streak.count}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium text-slate-700">
                          最佳：{streak.bestCount}
                        </span>
                      </div>
                    </div>

                    {/* Progress to beat best */}
                    {streak.count > 0 && streak.count < streak.bestCount && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-600">距離最佳紀錄</span>
                          <span className="text-xs text-slate-700">
                            還差 {streak.bestCount - streak.count}
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(streak.count / streak.bestCount) * 100}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* At best record indicator */}
                    {streak.count > 0 && streak.count >= streak.bestCount && (
                      <motion.div
                        className="mt-3 flex items-center gap-2 text-sm text-orange-600 font-medium"
                        animate={{ opacity: [1, 0.6, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Trophy className="w-4 h-4" />
                        正在創造新紀錄！
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-3 rounded-xl bg-amber-50/50 border border-amber-200/50">
        <p className="text-sm text-amber-700">
          <strong>💡 小提示：</strong>
          保持連續紀錄可以獲得額外成就徽章！連續 3 年發表可獲得「持之以恆」徽章。
        </p>
      </div>
    </div>
  );
};

export default StreakTracker;
