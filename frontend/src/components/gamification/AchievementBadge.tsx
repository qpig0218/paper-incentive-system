import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import type { Achievement, AchievementTier } from '../../types/gamification';
import { TIER_STYLES } from '../../types/gamification';

interface AchievementBadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
};

const iconSizes = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
};

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  isUnlocked,
  size = 'md',
  showDetails = false,
  onClick,
}) => {
  const tierStyle = TIER_STYLES[achievement.tier as AchievementTier];

  return (
    <motion.div
      className={`flex flex-col items-center gap-2 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      {/* Badge Circle */}
      <motion.div
        className={`
          ${sizeClasses[size]}
          rounded-full
          flex items-center justify-center
          relative
          ${isUnlocked
            ? `bg-gradient-to-br ${tierStyle.gradient} ${tierStyle.shadow} shadow-lg`
            : 'bg-slate-300/50 backdrop-blur-sm'
          }
          ${tierStyle.border}
          border-2
        `}
        initial={isUnlocked ? { scale: 0, rotate: -180 } : undefined}
        animate={isUnlocked ? { scale: 1, rotate: 0 } : undefined}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {isUnlocked ? (
          <span className={`${iconSizes[size]} filter drop-shadow-md`}>
            {achievement.icon}
          </span>
        ) : (
          <Lock
            className={`
              ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-8 h-8'}
              text-slate-400
            `}
            strokeWidth={1.5}
          />
        )}

        {/* Shine effect for unlocked badges */}
        {isUnlocked && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        )}

        {/* Tier indicator ring */}
        {isUnlocked && (
          <motion.div
            className={`absolute inset-0 rounded-full border-2 ${tierStyle.border}`}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
        )}
      </motion.div>

      {/* Badge Details */}
      {showDetails && (
        <motion.div
          className="text-center max-w-[120px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className={`
            font-medium text-sm leading-tight
            ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}
          `}>
            {achievement.isHidden && !isUnlocked ? '???' : achievement.name}
          </p>
          {isUnlocked && (
            <p className="text-xs text-slate-500 mt-0.5">
              {achievement.description}
            </p>
          )}
          {!isUnlocked && !achievement.isHidden && (
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
              {achievement.description}
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

// Unlock animation component
export const AchievementUnlockAnimation: React.FC<{
  achievement: Achievement;
  onComplete?: () => void;
}> = ({ achievement, onComplete }) => {
  const tierStyle = TIER_STYLES[achievement.tier as AchievementTier];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onComplete}
    >
      <motion.div
        className="flex flex-col items-center gap-6 p-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
      >
        {/* Glow effect */}
        <motion.div
          className={`absolute w-64 h-64 rounded-full bg-gradient-to-br ${tierStyle.gradient} blur-3xl opacity-30`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Badge */}
        <motion.div
          className={`
            w-32 h-32
            rounded-full
            flex items-center justify-center
            bg-gradient-to-br ${tierStyle.gradient}
            shadow-2xl
            border-4 ${tierStyle.border}
            relative
            z-10
          `}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
        >
          <motion.span
            className="text-6xl filter drop-shadow-lg"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {achievement.icon}
          </motion.span>
        </motion.div>

        {/* Text */}
        <motion.div
          className="text-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-white/80 text-sm uppercase tracking-wider mb-2">
            成就解鎖
          </p>
          <h2 className="text-white text-2xl font-bold mb-2">
            {achievement.name}
          </h2>
          <p className="text-white/70 text-sm">
            {achievement.description}
          </p>
        </motion.div>

        {/* Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full bg-gradient-to-br ${tierStyle.gradient}`}
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: Math.cos((i * 30 * Math.PI) / 180) * 150,
              y: Math.sin((i * 30 * Math.PI) / 180) * 150,
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1,
              delay: 0.5 + i * 0.05,
              ease: 'easeOut',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AchievementBadge;
