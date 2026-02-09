// Gamification Components
// Based on Octalysis Framework Core Drives

export { default as AchievementBadge, AchievementUnlockAnimation } from './AchievementBadge';
export { default as LevelProgress, LevelUpAnimation } from './LevelProgress';
export { default as Leaderboard, DepartmentLeaderboard } from './Leaderboard';
export { default as MissionBoard } from './MissionBoard';
export { default as ChallengeCard, ChallengeList, CountdownTimer } from './ChallengeCard';
export { default as StreakTracker } from './StreakTracker';
export { default as BadgeCollection } from './BadgeCollection';

// Re-export types for convenience
export type {
  Achievement,
  UserAchievement,
  AchievementCategory,
  AchievementTier,
  AchievementRequirement,
  UserLevel,
  UserLevelProgress,
  Streak,
  StreakType,
  Challenge,
  ChallengeParticipant,
  LeaderboardEntry,
  LeaderboardType,
  DepartmentLeaderboardEntry,
  HospitalStats,
  AchievementNotification,
} from '../../types/gamification';

export {
  LEVEL_DEFINITIONS,
  PREDEFINED_ACHIEVEMENTS,
  TIER_STYLES,
  CATEGORY_ICONS,
  calculatePoints,
  getLevelFromPoints,
  calculateLevelProgress,
} from '../../types/gamification';
