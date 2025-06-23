export interface ProductivityStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string | null; // ISO Date String
  dailyGoalMet: boolean; // Whether the daily goal was met today
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string; // e.g., Lucide icon name or image URL
  unlocked: boolean;
  unlockedDate: string | null; // ISO Date String
  progress?: number; // Current progress towards the achievement (e.g., 5/10)
  target?: number; // Target value for achievement (e.g., 10 ideas)
}

export interface GamificationDashboardData {
  productivityStreak: ProductivityStreak;
  achievementBadges: AchievementBadge[];
  totalMemoryChunks: number;
  totalIdeas: number;
  totalOpportunitiesEvaluated: number;
}
