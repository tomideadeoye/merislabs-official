export interface HabiticaTask {
  _id: string;
  text: string;
  type: 'todo' | 'daily' | 'habit' | 'reward';
  notes?: string;
  priority?: number;
  completed?: boolean; // Add if tasks can have a completed status
  orionOrigin?: OrionOrigin; // Added to support Orion's origin tracking
  date?: string; // Added for daily tasks to track due dates
}

export interface OrionOrigin {
  orionSourceModule: string;
  orionSourceReferenceId: string;
  createdAt: string;
}

export interface HabiticaStat {
  label: string;
  value: number;
  [key: string]: string | number; // Add index signature
}

export interface HabiticaTaskCompletionStat {
  id: string;
  label: string;
  value: number;
}

export interface HabiticaStatsData {
  stats: {
    hp: number;
    exp: number;
    mp: number;
    gp: number;
  };
  // Add other top-level stats properties if known and used
}

export interface HabiticaTaskCreationParams {
  text: string;
  type: 'habit' | 'daily' | 'todo' | 'reward';
  priority?: number;
  notes?: string;
  tags?: string[];
  checklist?: { text: string }[];
  date?: string; // Added date property
}

export interface HabiticaUserStats {
  hp: number;
  maxHealth: number;
  mp: number;
  maxMP: number;
  exp: number;
  toNextLevel: number;
  lvl: number;
  gp: number;
  class?: string; // Added missing property
}

export interface HabiticaUserData {
  stats: HabiticaUserStats;
  // ... other user data
}

export type HabiticaTaskCreateData = HabiticaTaskCreationParams;

export interface HabiticaDailyCheckItem {
  id: string;
  text: string;
  completed: boolean;
}
