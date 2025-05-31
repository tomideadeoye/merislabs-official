/**
 * Types for Habitica API integration
 */

export interface HabiticaTask {
  _id?: string;
  id: string;
  userId?: string;
  type: 'habit' | 'daily' | 'todo' | 'reward';
  text: string;
  notes?: string;
  tags?: string[];
  value?: number;
  priority?: number; // Difficulty: 0.1 (Trivial) to 2 (Hard)
  attribute?: 'str' | 'int' | 'per' | 'con';
  checklist?: HabiticaChecklistItem[];
  completed?: boolean;
  date?: string; // Due date for todos
  createdAt?: string;
  updatedAt?: string;
}

export interface HabiticaChecklistItem {
  text: string;
  completed: boolean;
  id: string;
}

export interface HabiticaTaskCreateData {
  text: string;
  type: 'todo' | 'habit' | 'daily' | 'reward';
  notes?: string;
  date?: string;
  priority?: number;
  tags?: string[];
}

export interface HabiticaTaskScoreData {
  delta: number;
  hp: number;
  mp: number;
  exp: number;
  gp: number;
  lvl: number;
}

export interface HabiticaUserStats {
  profile?: { name?: string };
  stats?: {
    hp: number;
    maxHealth: number;
    mp: number;
    maxMP: number;
    exp: number;
    toNextLevel: number;
    lvl: number;
    gp: number;
    class?: string;
  };
}

export interface HabiticaCredentials {
  userId: string;
  apiToken: string;
}