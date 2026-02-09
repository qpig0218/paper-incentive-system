import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Clock,
  Users,
  CheckCircle,
  Gift,
  ChevronRight,
} from 'lucide-react';
import type { Challenge } from '../../types/gamification';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: (challengeId: string) => void;
  isJoined?: boolean;
}

// Countdown Timer Component
const CountdownTimer: React.FC<{ endDate: string }> = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center gap-1 text-sm">
      <Clock className="w-4 h-4 text-amber-500" />
      <span className="font-mono">
        {timeLeft.days > 0 && <span>{timeLeft.days}天 </span>}
        <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
        <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
        <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
      </span>
    </div>
  );
};

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onJoin,
  isJoined = false,
}) => {
  const [joined, setJoined] = useState(isJoined);

  const handleJoin = () => {
    if (!joined && onJoin) {
      onJoin(challenge.id);
      setJoined(true);
    }
  };

  const progressPercentage = challenge.currentValue
    ? Math.min((challenge.currentValue / challenge.targetValue) * 100, 100)
    : 0;

  return (
    <motion.div
      className="glass-card overflow-hidden"
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Header with gradient */}
      <div className="relative p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20">
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-xs font-bold text-amber-700 bg-amber-100 rounded-full">
            +{(challenge.bonusRate * 100).toFixed(0)}% 獎勵
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 mb-1">{challenge.title}</h3>
            <p className="text-sm text-slate-700 line-clamp-2">
              {challenge.description}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Time and Participants */}
        <div className="flex items-center justify-between mb-4">
          <CountdownTimer endDate={challenge.endDate} />
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <Users className="w-4 h-4" />
            <span>{challenge.participantCount || 0} 人參加</span>
          </div>
        </div>

        {/* Progress (if joined) */}
        {joined && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-600">您的進度</span>
              <span className="text-sm font-medium text-slate-800">
                {challenge.currentValue || 0} / {challenge.targetValue}
              </span>
            </div>
            <div className="h-2 bg-slate-200/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <motion.button
          onClick={handleJoin}
          disabled={joined}
          className={`
            w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2
            transition-all
            ${joined
              ? 'bg-emerald-100 text-emerald-700 cursor-default'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg'
            }
          `}
          whileHover={!joined ? { scale: 1.02 } : undefined}
          whileTap={!joined ? { scale: 0.98 } : undefined}
        >
          {joined ? (
            <>
              <CheckCircle className="w-4 h-4" />
              已參加
            </>
          ) : (
            <>
              <Gift className="w-4 h-4" />
              參加挑戰
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

// Challenge List Component
export const ChallengeList: React.FC<{
  challenges: Challenge[];
  onJoin?: (challengeId: string) => void;
}> = ({ challenges, onJoin }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5 text-amber-500" />
        <h2 className="text-lg font-bold text-slate-800">進行中的挑戰</h2>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-8 text-slate-600">
          目前沒有進行中的挑戰
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ChallengeCard
                challenge={challenge}
                onJoin={onJoin}
                isJoined={challenge.isJoined}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export { CountdownTimer };
export default ChallengeCard;
