import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Mock data for achievements
const achievements = [
  { id: '1', name: '首篇論文', nameEn: 'First Paper', description: '發表第一篇論文', icon: '📝', category: 'PAPER', tier: 'BRONZE', requirement: { type: 'paper_count', value: 1, comparison: 'gte' }, isHidden: false, createdAt: '2024-01-01' },
  { id: '2', name: '學術新星', nameEn: 'Rising Star', description: '發表 5 篇論文', icon: '⭐', category: 'PAPER', tier: 'SILVER', requirement: { type: 'paper_count', value: 5, comparison: 'gte' }, isHidden: false, createdAt: '2024-01-01' },
  { id: '3', name: '研究達人', nameEn: 'Research Pro', description: '發表 20 篇論文', icon: '🏅', category: 'PAPER', tier: 'GOLD', requirement: { type: 'paper_count', value: 20, comparison: 'gte' }, isHidden: false, createdAt: '2024-01-01' },
  { id: '4', name: 'SCI 突破', nameEn: 'SCI Breakthrough', description: '發表首篇 SCI 論文', icon: '🎯', category: 'IMPACT', tier: 'SILVER', requirement: { type: 'sci_count', value: 1, comparison: 'gte' }, isHidden: false, createdAt: '2024-01-01' },
  { id: '5', name: '高影響力', nameEn: 'High Impact', description: '發表 IF≥10 的論文', icon: '💥', category: 'IMPACT', tier: 'GOLD', requirement: { type: 'impact_factor', value: 10, comparison: 'gte' }, isHidden: false, createdAt: '2024-01-01' },
  { id: '6', name: 'Q1 專家', nameEn: 'Q1 Expert', description: '發表 3 篇 Q1 期刊論文', icon: '🥇', category: 'IMPACT', tier: 'GOLD', requirement: { type: 'quartile', value: 3, comparison: 'gte', additionalCriteria: { quartile: 'Q1' } }, isHidden: false, createdAt: '2024-01-01' },
  { id: '7', name: '團隊合作', nameEn: 'Team Player', description: '與其他部門合作發表論文', icon: '🤝', category: 'COLLABORATION', tier: 'BRONZE', requirement: { type: 'collaboration', value: 1, comparison: 'gte' }, isHidden: false, createdAt: '2024-01-01' },
  { id: '8', name: '持之以恆', nameEn: 'Consistent', description: '連續 3 年發表論文', icon: '📆', category: 'STREAK', tier: 'SILVER', requirement: { type: 'streak', value: 3, comparison: 'gte' }, isHidden: false, createdAt: '2024-01-01' },
  { id: '9', name: '深夜研究者', nameEn: 'Night Owl', description: '凌晨 12 點後提交申請', icon: '🦉', category: 'SPECIAL', tier: 'BRONZE', requirement: { type: 'special', value: 1, comparison: 'gte' }, isHidden: true, createdAt: '2024-01-01' },
  { id: '10', name: '週末戰士', nameEn: 'Weekend Warrior', description: '週末提交論文', icon: '⚔️', category: 'SPECIAL', tier: 'BRONZE', requirement: { type: 'special', value: 1, comparison: 'gte' }, isHidden: true, createdAt: '2024-01-01' },
];

// Mock user achievements
const userAchievements: Record<string, string[]> = {
  '1': ['1', '2', '4', '7'], // Admin user
  '2': ['1', '2', '3', '4', '5', '7', '8'], // Wang Daming
};

// Mock user levels
const userLevels: Record<string, { level: number; points: number }> = {
  '1': { level: 3, points: 450 },
  '2': { level: 5, points: 1250 },
};

// Mock streaks
const userStreaks: Record<string, { type: string; count: number; bestCount: number; lastDate: string }[]> = {
  '2': [
    { type: 'YEARLY_PUBLICATION', count: 5, bestCount: 5, lastDate: '2024-12-15' },
    { type: 'MONTHLY_SUBMISSION', count: 3, bestCount: 6, lastDate: '2024-12-20' },
  ],
};

// Mock challenges
const challenges = [
  {
    id: '1',
    title: '年度衝刺月',
    description: '在 12 月份提交論文申請，獎勵金額加成 10%',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    targetType: 'paper_count',
    targetValue: 1,
    bonusRate: 0.1,
    isActive: true,
    participantCount: 45,
  },
  {
    id: '2',
    title: '醫學教育推廣週',
    description: '發表醫學教育相關論文，獎勵加成 20%',
    startDate: '2024-12-15',
    endDate: '2024-12-31',
    targetType: 'paper_count',
    targetValue: 1,
    bonusRate: 0.2,
    isActive: true,
    participantCount: 23,
  },
  {
    id: '3',
    title: 'SCI 論文挑戰',
    description: '本季度發表 SCI 論文，額外獲得 50 點經驗值',
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    targetType: 'sci_count',
    targetValue: 1,
    bonusRate: 0,
    isActive: true,
    participantCount: 78,
  },
];

// Mock leaderboard data
const leaderboardData = [
  { rank: 1, userId: '2', name: '王大明', department: '心臟內科', value: 15, change: 0 },
  { rank: 2, userId: '3', name: '陳醫師', department: '神經內科', value: 12, change: 1 },
  { rank: 3, userId: '4', name: '李小華', department: '胸腔內科', value: 10, change: -1 },
  { rank: 4, userId: '5', name: '張主任', department: '急診醫學部', value: 9, change: 2 },
  { rank: 5, userId: '6', name: '林護理長', department: '護理部', value: 8, change: 0 },
  { rank: 6, userId: '7', name: '黃研究員', department: '研究部', value: 7, change: -2 },
  { rank: 7, userId: '8', name: '吳教授', department: '教學部', value: 6, change: 1 },
  { rank: 8, userId: '9', name: '趙藥師', department: '藥劑部', value: 5, change: 0 },
  { rank: 9, userId: '10', name: '周技師', department: '檢驗醫學科', value: 4, change: -1 },
  { rank: 10, userId: '11', name: '鄭營養師', department: '營養科', value: 3, change: 0 },
];

// Mock department leaderboard
const departmentLeaderboard = [
  { rank: 1, department: '心臟內科', paperCount: 45, sciCount: 32, totalIF: 156.8, totalRewards: 2850000, memberCount: 25, change: 0 },
  { rank: 2, department: '神經內科', paperCount: 38, sciCount: 28, totalIF: 134.2, totalRewards: 2450000, memberCount: 22, change: 1 },
  { rank: 3, department: '胸腔內科', paperCount: 35, sciCount: 24, totalIF: 118.5, totalRewards: 2100000, memberCount: 20, change: -1 },
  { rank: 4, department: '急診醫學部', paperCount: 28, sciCount: 18, totalIF: 89.6, totalRewards: 1650000, memberCount: 35, change: 0 },
  { rank: 5, department: '護理部', paperCount: 25, sciCount: 12, totalIF: 45.2, totalRewards: 980000, memberCount: 150, change: 2 },
];

// Mock hospital stats
const hospitalStats = {
  yearlyGoal: {
    sciPapers: { target: 200, current: 156 },
    totalPapers: { target: 350, current: 289 },
    totalRewards: { target: 15000000, current: 12500000 },
  },
  milestones: [
    { id: '1', title: '100 篇 SCI 論文', target: 100, current: 156, isReached: true, reachedAt: '2024-08-15' },
    { id: '2', title: '150 篇 SCI 論文', target: 150, current: 156, isReached: true, reachedAt: '2024-11-20' },
    { id: '3', title: '200 篇 SCI 論文', target: 200, current: 156, isReached: false },
    { id: '4', title: '千萬獎勵里程碑', target: 10000000, current: 12500000, isReached: true, reachedAt: '2024-09-30' },
  ],
  recentAchievements: [
    { userName: '王大明', department: '心臟內科', achievement: achievements[4], unlockedAt: '2024-12-18T10:30:00' },
    { userName: '陳醫師', department: '神經內科', achievement: achievements[2], unlockedAt: '2024-12-17T14:20:00' },
    { userName: '李小華', department: '胸腔內科', achievement: achievements[5], unlockedAt: '2024-12-16T09:15:00' },
  ],
};

// ============================================
// Achievement Routes
// ============================================

// Get all achievements (visible ones for users)
router.get('/achievements', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const visibleAchievements = achievements.filter((a) => !a.isHidden);
    res.json({
      success: true,
      data: visibleAchievements,
    });
  } catch (error) {
    next(error);
  }
});

// Get all achievements including hidden (for admin)
router.get('/achievements/all', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    next(error);
  }
});

// Get user's unlocked achievements
router.get('/achievements/user', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || '2';
    const unlockedIds = userAchievements[userId] || [];
    const unlockedAchievements = achievements.filter((a) => unlockedIds.includes(a.id));

    res.json({
      success: true,
      data: {
        unlocked: unlockedAchievements,
        total: achievements.filter((a) => !a.isHidden).length,
        unlockedCount: unlockedAchievements.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Check and unlock new achievements
router.post('/achievements/check', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || '2';
    // In production, this would check paper stats and unlock achievements
    // For now, return mock newly unlocked achievement
    res.json({
      success: true,
      data: {
        newlyUnlocked: [],
        message: '已檢查成就解鎖狀態',
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Level Routes
// ============================================

// Get user's level and progress
router.get('/level', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || '2';
    const levelData = userLevels[userId] || { level: 1, points: 0 };

    const levelDefinitions = [
      { level: 1, title: '學術新手', titleEn: 'Novice', minPoints: 0, maxPoints: 99, icon: '🌱', color: 'from-slate-400 to-slate-500' },
      { level: 2, title: '學術入門', titleEn: 'Beginner', minPoints: 100, maxPoints: 299, icon: '📚', color: 'from-green-400 to-green-500' },
      { level: 3, title: '學術研究員', titleEn: 'Researcher', minPoints: 300, maxPoints: 599, icon: '🔬', color: 'from-blue-400 to-blue-500' },
      { level: 4, title: '學術專家', titleEn: 'Expert', minPoints: 600, maxPoints: 999, icon: '⭐', color: 'from-purple-400 to-purple-500' },
      { level: 5, title: '學術大師', titleEn: 'Master', minPoints: 1000, maxPoints: 1999, icon: '🎓', color: 'from-amber-400 to-amber-500' },
      { level: 6, title: '學術導師', titleEn: 'Mentor', minPoints: 2000, maxPoints: 3999, icon: '👨‍🏫', color: 'from-rose-400 to-rose-500' },
      { level: 7, title: '學術領袖', titleEn: 'Leader', minPoints: 4000, maxPoints: 7999, icon: '🏆', color: 'from-indigo-400 to-indigo-500' },
      { level: 8, title: '學術泰斗', titleEn: 'Legend', minPoints: 8000, maxPoints: Infinity, icon: '👑', color: 'from-yellow-400 to-yellow-500' },
    ];

    const currentLevel = levelDefinitions.find(
      (l) => levelData.points >= l.minPoints && levelData.points <= l.maxPoints
    ) || levelDefinitions[0];

    const currentIndex = levelDefinitions.findIndex((l) => l.level === currentLevel.level);
    const nextLevel = currentIndex < levelDefinitions.length - 1 ? levelDefinitions[currentIndex + 1] : null;

    const pointsInCurrentLevel = levelData.points - currentLevel.minPoints;
    const pointsNeededForLevel = (nextLevel?.minPoints || currentLevel.maxPoints) - currentLevel.minPoints;
    const progressPercentage = nextLevel ? (pointsInCurrentLevel / pointsNeededForLevel) * 100 : 100;

    res.json({
      success: true,
      data: {
        currentLevel,
        nextLevel,
        totalPoints: levelData.points,
        pointsToNextLevel: nextLevel ? nextLevel.minPoints - levelData.points : 0,
        progressPercentage: Math.min(progressPercentage, 100),
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Leaderboard Routes
// ============================================

// Get leaderboard
router.get('/leaderboard', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const type = req.query.type as string || 'monthly_papers';
    const limit = parseInt(req.query.limit as string) || 10;

    // In production, calculate based on actual data
    res.json({
      success: true,
      data: {
        type,
        entries: leaderboardData.slice(0, limit),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get department leaderboard
router.get('/leaderboard/department', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: {
        entries: departmentLeaderboard,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Streak Routes
// ============================================

// Get user's streaks
router.get('/streaks', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || '2';
    const streaks = userStreaks[userId] || [];

    res.json({
      success: true,
      data: streaks,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Challenge Routes
// ============================================

// Get active challenges
router.get('/challenges', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const activeChallenges = challenges.filter((c) => c.isActive);

    res.json({
      success: true,
      data: activeChallenges,
    });
  } catch (error) {
    next(error);
  }
});

// Join a challenge
router.post('/challenges/:id/join', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const challengeId = req.params.id;
    const challenge = challenges.find((c) => c.id === challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: '找不到此挑戰',
      });
    }

    res.json({
      success: true,
      data: {
        challengeId,
        joinedAt: new Date().toISOString(),
        progress: 0,
      },
      message: '已成功加入挑戰！',
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Hospital Stats Routes (Mission Board)
// ============================================

// Get hospital statistics
router.get('/stats/hospital', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: hospitalStats,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Notification Routes
// ============================================

// Get gamification notifications
router.get('/notifications', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Mock notifications
    const notifications = [
      {
        id: '1',
        type: 'achievement_unlocked',
        title: '恭喜解鎖新成就！',
        message: '您已獲得「高影響力」徽章',
        icon: '💥',
        isRead: false,
        createdAt: '2024-12-18T10:30:00',
      },
      {
        id: '2',
        type: 'level_up',
        title: '等級提升！',
        message: '您已升級為「學術大師」',
        icon: '🎓',
        isRead: false,
        createdAt: '2024-12-17T15:00:00',
      },
      {
        id: '3',
        type: 'streak_milestone',
        title: '連續發表紀錄！',
        message: '您已連續 5 年發表論文',
        icon: '🔥',
        isRead: true,
        createdAt: '2024-12-15T09:00:00',
      },
    ];

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
});

// Mark notification as read
router.put('/notifications/:id/read', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      message: '通知已標記為已讀',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
