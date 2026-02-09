// Octalysis Framework Gamification Types

// Achievement Categories based on Octalysis Core Drives
export type AchievementCategory =
  | 'paper'         // Development & Accomplishment - 論文相關成就
  | 'impact'        // Epic Meaning & Calling - 影響力成就
  | 'collaboration' // Social Influence & Relatedness - 合作成就
  | 'streak'        // Loss & Avoidance - 連續紀錄成就
  | 'special';      // Unpredictability & Curiosity - 隱藏/特殊成就

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export type StreakType = 'yearly_publication' | 'monthly_submission' | 'consecutive_approval';

// Achievement Requirement Types
export interface AchievementRequirement {
  type: 'paper_count' | 'sci_count' | 'impact_factor' | 'quartile' | 'collaboration' | 'streak' | 'special';
  value: number;
  comparison: 'gte' | 'lte' | 'eq';
  additionalCriteria?: Record<string, unknown>;
}

// Achievement Definition
export interface Achievement {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  tier: AchievementTier;
  requirement: AchievementRequirement;
  isHidden: boolean; // For mystery badges
  createdAt: string;
}

// User Achievement (Unlocked)
export interface UserAchievement {
  id: string;
  odcId: string;
  achievementId: string;
  achievement: Achievement;
  unlockedAt: string;
}

// User Level System
export interface UserLevel {
  level: number;
  title: string;
  titleEn: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
  icon: string;
  color: string;
}

// User Level Progress
export interface UserLevelProgress {
  userId: string;
  currentLevel: UserLevel;
  nextLevel: UserLevel | null;
  totalPoints: number;
  pointsToNextLevel: number;
  progressPercentage: number;
}

// Level Definitions
export const LEVEL_DEFINITIONS: UserLevel[] = [
  { level: 1, title: '學術新手', titleEn: 'Novice', minPoints: 0, maxPoints: 99, benefits: ['基本功能存取'], icon: '🌱', color: 'from-slate-400 to-slate-500' },
  { level: 2, title: '學術入門', titleEn: 'Beginner', minPoints: 100, maxPoints: 299, benefits: ['查看基本排行榜'], icon: '📚', color: 'from-green-400 to-green-500' },
  { level: 3, title: '學術研究員', titleEn: 'Researcher', minPoints: 300, maxPoints: 599, benefits: ['進階統計分析'], icon: '🔬', color: 'from-blue-400 to-blue-500' },
  { level: 4, title: '學術專家', titleEn: 'Expert', minPoints: 600, maxPoints: 999, benefits: ['成就徽章展示'], icon: '⭐', color: 'from-purple-400 to-purple-500' },
  { level: 5, title: '學術大師', titleEn: 'Master', minPoints: 1000, maxPoints: 1999, benefits: ['專屬頭銜顯示'], icon: '🎓', color: 'from-amber-400 to-amber-500' },
  { level: 6, title: '學術導師', titleEn: 'Mentor', minPoints: 2000, maxPoints: 3999, benefits: ['指導新進人員'], icon: '👨‍🏫', color: 'from-rose-400 to-rose-500' },
  { level: 7, title: '學術領袖', titleEn: 'Leader', minPoints: 4000, maxPoints: 7999, benefits: ['院內學術委員'], icon: '🏆', color: 'from-indigo-400 to-indigo-500' },
  { level: 8, title: '學術泰斗', titleEn: 'Legend', minPoints: 8000, maxPoints: Infinity, benefits: ['永久榮譽殿堂'], icon: '👑', color: 'from-yellow-400 to-yellow-500' },
];

// Streak Record
export interface Streak {
  id: string;
  userId: string;
  type: StreakType;
  count: number;
  lastDate: string;
  bestCount: number;
}

// Challenge System
export interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  targetType: 'paper_count' | 'sci_count' | 'total_if' | 'department_rank';
  targetValue: number;
  currentValue?: number;
  bonusRate: number; // e.g., 0.1 for 10% bonus
  isActive: boolean;
  participantCount?: number;
  isJoined?: boolean;
}

// Challenge Participant
export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  joinedAt: string;
  progress: number;
  isCompleted: boolean;
}

// Leaderboard Entry
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  department: string;
  avatar?: string;
  value: number; // Could be paper count, IF sum, reward amount, etc.
  change?: number; // Position change from last period
  achievements?: Achievement[];
}

// Leaderboard Types
export type LeaderboardType =
  | 'monthly_papers'      // 本月發表榜
  | 'yearly_papers'       // 年度累積榜
  | 'total_if'            // Impact Factor 總和榜
  | 'total_rewards'       // 獎勵金額榜
  | 'sci_papers'          // SCI 論文榜
  | 'collaboration';      // 合作次數榜

// Department Leaderboard Entry
export interface DepartmentLeaderboardEntry {
  rank: number;
  department: string;
  paperCount: number;
  sciCount: number;
  totalIF: number;
  totalRewards: number;
  memberCount: number;
  change?: number;
}

// Hospital Statistics (for Mission Board)
export interface HospitalStats {
  yearlyGoal: {
    sciPapers: { target: number; current: number };
    totalPapers: { target: number; current: number };
    totalRewards: { target: number; current: number };
  };
  milestones: {
    id: string;
    title: string;
    target: number;
    current: number;
    isReached: boolean;
    reachedAt?: string;
  }[];
  departmentContributions: DepartmentLeaderboardEntry[];
  recentAchievements: {
    userName: string;
    department: string;
    achievement: Achievement;
    unlockedAt: string;
  }[];
}

// Achievement Notification
export interface AchievementNotification {
  id: string;
  type: 'achievement_unlocked' | 'level_up' | 'streak_milestone' | 'challenge_completed' | 'rank_change';
  title: string;
  message: string;
  icon: string;
  data?: Record<string, unknown>;
  createdAt: string;
  isRead: boolean;
}

// Predefined Achievements
export const PREDEFINED_ACHIEVEMENTS: Omit<Achievement, 'id' | 'createdAt'>[] = [
  // Paper Count Achievements
  { name: '首篇論文', nameEn: 'First Paper', description: '發表第一篇論文', icon: '📝', category: 'paper', tier: 'bronze', requirement: { type: 'paper_count', value: 1, comparison: 'gte' }, isHidden: false },
  { name: '學術新星', nameEn: 'Rising Star', description: '發表 5 篇論文', icon: '⭐', category: 'paper', tier: 'silver', requirement: { type: 'paper_count', value: 5, comparison: 'gte' }, isHidden: false },
  { name: '研究達人', nameEn: 'Research Pro', description: '發表 20 篇論文', icon: '🏅', category: 'paper', tier: 'gold', requirement: { type: 'paper_count', value: 20, comparison: 'gte' }, isHidden: false },
  { name: '學術巨擘', nameEn: 'Academic Giant', description: '發表 50 篇論文', icon: '👑', category: 'paper', tier: 'platinum', requirement: { type: 'paper_count', value: 50, comparison: 'gte' }, isHidden: false },
  { name: '傳奇學者', nameEn: 'Legendary Scholar', description: '發表 100 篇論文', icon: '💎', category: 'paper', tier: 'diamond', requirement: { type: 'paper_count', value: 100, comparison: 'gte' }, isHidden: false },

  // SCI Achievements
  { name: 'SCI 突破', nameEn: 'SCI Breakthrough', description: '發表首篇 SCI 論文', icon: '🎯', category: 'impact', tier: 'silver', requirement: { type: 'sci_count', value: 1, comparison: 'gte' }, isHidden: false },
  { name: 'SCI 專家', nameEn: 'SCI Expert', description: '發表 10 篇 SCI 論文', icon: '🔬', category: 'impact', tier: 'gold', requirement: { type: 'sci_count', value: 10, comparison: 'gte' }, isHidden: false },
  { name: 'SCI 大師', nameEn: 'SCI Master', description: '發表 30 篇 SCI 論文', icon: '🏆', category: 'impact', tier: 'platinum', requirement: { type: 'sci_count', value: 30, comparison: 'gte' }, isHidden: false },

  // Impact Factor Achievements
  { name: '高影響力', nameEn: 'High Impact', description: '發表 IF≥10 的論文', icon: '💥', category: 'impact', tier: 'gold', requirement: { type: 'impact_factor', value: 10, comparison: 'gte' }, isHidden: false },
  { name: '頂尖期刊', nameEn: 'Top Journal', description: '發表 IF≥20 的論文', icon: '🌟', category: 'impact', tier: 'platinum', requirement: { type: 'impact_factor', value: 20, comparison: 'gte' }, isHidden: false },
  { name: 'Q1 專家', nameEn: 'Q1 Expert', description: '發表 3 篇 Q1 期刊論文', icon: '🥇', category: 'impact', tier: 'gold', requirement: { type: 'quartile', value: 3, comparison: 'gte', additionalCriteria: { quartile: 'Q1' } }, isHidden: false },

  // Collaboration Achievements
  { name: '團隊合作', nameEn: 'Team Player', description: '與其他部門合作發表論文', icon: '🤝', category: 'collaboration', tier: 'bronze', requirement: { type: 'collaboration', value: 1, comparison: 'gte' }, isHidden: false },
  { name: '跨界達人', nameEn: 'Cross-field Pro', description: '與 5 個以上部門合作', icon: '🌐', category: 'collaboration', tier: 'gold', requirement: { type: 'collaboration', value: 5, comparison: 'gte' }, isHidden: false },

  // Streak Achievements
  { name: '持之以恆', nameEn: 'Consistent', description: '連續 3 年發表論文', icon: '📆', category: 'streak', tier: 'silver', requirement: { type: 'streak', value: 3, comparison: 'gte' }, isHidden: false },
  { name: '學術馬拉松', nameEn: 'Academic Marathon', description: '連續 5 年發表論文', icon: '🏃', category: 'streak', tier: 'gold', requirement: { type: 'streak', value: 5, comparison: 'gte' }, isHidden: false },
  { name: '十年如一日', nameEn: 'Decade of Excellence', description: '連續 10 年發表論文', icon: '🎖️', category: 'streak', tier: 'diamond', requirement: { type: 'streak', value: 10, comparison: 'gte' }, isHidden: false },

  // Hidden/Special Achievements
  { name: '深夜研究者', nameEn: 'Night Owl', description: '凌晨 12 點後提交申請', icon: '🦉', category: 'special', tier: 'bronze', requirement: { type: 'special', value: 1, comparison: 'gte', additionalCriteria: { timeRange: 'midnight' } }, isHidden: true },
  { name: '週末戰士', nameEn: 'Weekend Warrior', description: '週末提交論文', icon: '⚔️', category: 'special', tier: 'bronze', requirement: { type: 'special', value: 1, comparison: 'gte', additionalCriteria: { dayType: 'weekend' } }, isHidden: true },
  { name: '開門紅', nameEn: 'New Year Start', description: '在新年第一週發表論文', icon: '🎊', category: 'special', tier: 'silver', requirement: { type: 'special', value: 1, comparison: 'gte', additionalCriteria: { period: 'new_year_week' } }, isHidden: true },
  { name: '全能學者', nameEn: 'All-rounder', description: '發表過所有類型的論文', icon: '🎪', category: 'special', tier: 'platinum', requirement: { type: 'special', value: 1, comparison: 'gte', additionalCriteria: { allTypes: true } }, isHidden: true },
];

// Tier Colors and Styles
export const TIER_STYLES: Record<AchievementTier, { gradient: string; shadow: string; border: string }> = {
  bronze: {
    gradient: 'from-amber-600 to-amber-800',
    shadow: 'shadow-amber-500/30',
    border: 'border-amber-500/50',
  },
  silver: {
    gradient: 'from-slate-300 to-slate-500',
    shadow: 'shadow-slate-400/30',
    border: 'border-slate-400/50',
  },
  gold: {
    gradient: 'from-yellow-400 to-amber-500',
    shadow: 'shadow-yellow-500/40',
    border: 'border-yellow-500/50',
  },
  platinum: {
    gradient: 'from-cyan-300 to-blue-500',
    shadow: 'shadow-cyan-400/40',
    border: 'border-cyan-400/50',
  },
  diamond: {
    gradient: 'from-violet-400 to-purple-600',
    shadow: 'shadow-violet-500/50',
    border: 'border-violet-500/50',
  },
};

// Category Icons
export const CATEGORY_ICONS: Record<AchievementCategory, string> = {
  paper: '📄',
  impact: '💫',
  collaboration: '🤝',
  streak: '🔥',
  special: '✨',
};

// Points calculation helper
export function calculatePoints(papers: { isSci: boolean; impactFactor?: number; quartile?: string }[]): number {
  return papers.reduce((total, paper) => {
    let points = 10; // Base points per paper
    if (paper.isSci) points += 20;
    if (paper.impactFactor) {
      if (paper.impactFactor >= 10) points += 50;
      else if (paper.impactFactor >= 5) points += 30;
      else if (paper.impactFactor >= 2) points += 15;
    }
    if (paper.quartile === 'Q1') points += 25;
    else if (paper.quartile === 'Q2') points += 15;
    return total + points;
  }, 0);
}

// Get level from points
export function getLevelFromPoints(points: number): UserLevel {
  return LEVEL_DEFINITIONS.find(
    (level) => points >= level.minPoints && points <= level.maxPoints
  ) || LEVEL_DEFINITIONS[0];
}

// Calculate progress to next level
export function calculateLevelProgress(points: number): UserLevelProgress {
  const currentLevel = getLevelFromPoints(points);
  const currentIndex = LEVEL_DEFINITIONS.findIndex((l) => l.level === currentLevel.level);
  const nextLevel = currentIndex < LEVEL_DEFINITIONS.length - 1 ? LEVEL_DEFINITIONS[currentIndex + 1] : null;

  const pointsInCurrentLevel = points - currentLevel.minPoints;
  const pointsNeededForLevel = (nextLevel?.minPoints || currentLevel.maxPoints) - currentLevel.minPoints;
  const progressPercentage = nextLevel ? (pointsInCurrentLevel / pointsNeededForLevel) * 100 : 100;

  return {
    userId: '',
    currentLevel,
    nextLevel,
    totalPoints: points,
    pointsToNextLevel: nextLevel ? nextLevel.minPoints - points : 0,
    progressPercentage: Math.min(progressPercentage, 100),
  };
}
