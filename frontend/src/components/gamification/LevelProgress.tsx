import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import type { UserLevelProgress } from '../../types/gamification';
import { LEVEL_DEFINITIONS } from '../../types/gamification';

interface LevelProgressProps {
  levelProgress: UserLevelProgress;
  showDetails?: boolean;
  compact?: boolean;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  levelProgress,
  showDetails = true,
  compact = false,
}) => {
  const { currentLevel, nextLevel, totalPoints, pointsToNextLevel, progressPercentage } = levelProgress;

  if (compact) {
    return (
      <div className="glass-card p-4">
        {/* Compact header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            bg-gradient-to-br ${currentLevel.color}
            shadow-lg
          `}>
            <span className="text-lg">{currentLevel.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-800">
                Lv.{currentLevel.level} {currentLevel.title}
              </span>
              <span className="text-xs text-slate-600">
                {totalPoints} pts
              </span>
            </div>
            <div className="h-2 bg-slate-200/50 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${currentLevel.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* All Levels Display - Compact */}
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200/80 rounded-full" />
          <div
            className="absolute top-5 left-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentLevel.level - 1) / (LEVEL_DEFINITIONS.length - 1)) * 100}%` }}
          />

          {/* Level nodes */}
          <div className="relative flex justify-between">
            {LEVEL_DEFINITIONS.map((level, index) => {
              const isCompleted = currentLevel.level > level.level;
              const isCurrent = currentLevel.level === level.level;
              const isLocked = currentLevel.level < level.level;

              return (
                <div key={level.level} className="flex flex-col items-center">
                  <motion.div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      border-2 transition-all duration-300
                      ${isCurrent
                        ? `bg-gradient-to-br ${level.color} border-white shadow-lg scale-110`
                        : isCompleted
                        ? 'bg-emerald-500 border-emerald-400'
                        : 'bg-slate-100 border-slate-300'
                      }
                    `}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: isCurrent ? 1.1 : 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span className={`text-lg ${isLocked ? 'opacity-40' : ''}`}>
                        {level.icon}
                      </span>
                    )}
                  </motion.div>
                  <span className={`
                    text-xs mt-1 text-center
                    ${isCurrent ? 'font-bold text-primary-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}
                  `}>
                    Lv.{level.level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            className={`
              w-14 h-14 rounded-2xl flex items-center justify-center
              bg-gradient-to-br ${currentLevel.color}
              shadow-lg
            `}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <span className="text-3xl">{currentLevel.icon}</span>
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Lv.{currentLevel.level} {currentLevel.title}
            </h3>
            <p className="text-sm text-slate-600">{currentLevel.titleEn}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-800">{totalPoints}</p>
          <p className="text-xs text-slate-600">總經驗值</p>
        </div>
      </div>

      {/* All Levels Display */}
      <div className="mb-6 p-4 bg-slate-50/80 rounded-xl">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">等級階層總覽</h4>

        {/* Progress line */}
        <div className="relative mb-2">
          <div className="absolute top-6 left-0 right-0 h-1.5 bg-slate-200 rounded-full" />
          <motion.div
            className="absolute top-6 left-0 h-1.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentLevel.level - 1) / (LEVEL_DEFINITIONS.length - 1)) * 100}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {/* Level nodes */}
          <div className="relative flex justify-between">
            {LEVEL_DEFINITIONS.map((level, index) => {
              const isCompleted = currentLevel.level > level.level;
              const isCurrent = currentLevel.level === level.level;
              const isLocked = currentLevel.level < level.level;

              return (
                <motion.div
                  key={level.level}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <motion.div
                    className={`
                      relative w-12 h-12 rounded-xl flex items-center justify-center
                      border-2 transition-all duration-300 cursor-pointer
                      ${isCurrent
                        ? `bg-gradient-to-br ${level.color} border-white shadow-xl ring-4 ring-primary-200`
                        : isCompleted
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 border-emerald-300 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                      }
                    `}
                    whileHover={{ scale: 1.1 }}
                    animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                    transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <span className={`text-xl ${isLocked ? 'opacity-30 grayscale' : ''}`}>
                        {level.icon}
                      </span>
                    )}
                    {isCurrent && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <span className="text-xs">✓</span>
                      </motion.div>
                    )}
                  </motion.div>

                  <div className="text-center mt-2">
                    <p className={`
                      text-xs font-medium
                      ${isCurrent ? 'text-primary-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}
                    `}>
                      Lv.{level.level}
                    </p>
                    <p className={`
                      text-xs truncate max-w-[60px]
                      ${isCurrent ? 'font-bold text-slate-800' : isCompleted ? 'text-slate-600' : 'text-slate-400'}
                    `}>
                      {level.title}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Bar to Next Level */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-700">
            下一等級進度
          </span>
          <span className="text-sm font-medium text-slate-800">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="h-4 bg-slate-200/50 rounded-full overflow-hidden relative">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${currentLevel.color} relative`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          </motion.div>
          {/* Milestone markers */}
          {[25, 50, 75].map((mark) => (
            <div
              key={mark}
              className={`absolute top-0 bottom-0 w-0.5 ${
                progressPercentage >= mark ? 'bg-white/50' : 'bg-slate-300'
              }`}
              style={{ left: `${mark}%` }}
            />
          ))}
        </div>
      </div>

      {/* Next Level Info */}
      {nextLevel && (
        <motion.div
          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-100/80 to-slate-50/80 border border-slate-200/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              bg-gradient-to-br ${nextLevel.color}
              opacity-60
            `}>
              <span className="text-2xl">{nextLevel.icon}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                下一等級：Lv.{nextLevel.level} {nextLevel.title}
              </p>
              <p className="text-xs text-slate-600">
                還需 <span className="font-bold text-primary-600">{pointsToNextLevel}</span> 經驗值
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">目標</p>
            <p className="text-lg font-bold text-slate-700">{nextLevel.minPoints} pts</p>
          </div>
        </motion.div>
      )}

      {/* Benefits */}
      {showDetails && currentLevel.benefits.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200/50">
          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            當前等級權益
          </p>
          <div className="flex flex-wrap gap-2">
            {currentLevel.benefits.map((benefit, index) => (
              <motion.span
                key={benefit}
                className="px-3 py-1 text-xs font-medium text-primary-700 bg-primary-100/50 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                {benefit}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Level up animation component
export const LevelUpAnimation: React.FC<{
  newLevel: { level: number; title: string; icon: string; color: string };
  onComplete?: () => void;
}> = ({ newLevel, onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onComplete}
    >
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {/* Glow */}
        <motion.div
          className={`absolute w-80 h-80 rounded-full bg-gradient-to-br ${newLevel.color} blur-3xl opacity-40`}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Level Icon */}
        <motion.div
          className={`
            w-40 h-40 rounded-3xl flex items-center justify-center
            bg-gradient-to-br ${newLevel.color}
            shadow-2xl
            relative z-10
          `}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
        >
          <motion.span
            className="text-7xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {newLevel.icon}
          </motion.span>
        </motion.div>

        {/* Text */}
        <motion.div
          className="text-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p
            className="text-amber-400 text-lg uppercase tracking-widest mb-2 font-bold"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            LEVEL UP!
          </motion.p>
          <h2 className="text-white text-4xl font-bold mb-2">
            Lv.{newLevel.level}
          </h2>
          <p className="text-white text-2xl font-medium">
            {newLevel.title}
          </p>
        </motion.div>

        {/* Rays */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-32 bg-gradient-to-t ${newLevel.color} opacity-60`}
            style={{
              transformOrigin: 'bottom center',
              rotate: i * 45,
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: [0, 0.6, 0] }}
            transition={{ duration: 1.5, delay: 0.3 + i * 0.05 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default LevelProgress;
