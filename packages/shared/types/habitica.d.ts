/**
 * Types for Habitica integration
 */

export interface HabiticaUserStats {
  _id: string;
  auth?: {
    local: {
      username: string;
    };
  };
  stats: {
    hp: number;
    mp: number;
    exp: number;
    gp: number;
    lvl: number;
    class: string;
    points: number;
    str: number;
    con: number;
    int: number;
    per: number;
    toNextLevel: number;
    maxHealth: number;
    maxMP: number;
  };
  profile: {
    name: string;
  };
}

export interface HabiticaTask {
  _id: string;
  id?: string;
  text: string;
  type: 'habit' | 'daily' | 'todo' | 'reward';
  notes: string;
  tags: string[];
  value: number;
  priority: 0.1 | 1 | 1.5 | 2;
  attribute: string;
  challenge: any;
  group: any;
  date: string | null;
  dateCompleted: string | null;
  completed: boolean;
  isDue?: boolean;
  nextDue?: string[];
  streak?: number;
  frequency?: string;
  everyX?: number;
  checklist?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  orionOrigin?: {
    orionSourceModule: string;
    orionSourceReferenceId: string;
    createdAt: string;
  };
}

export interface HabiticaTaskCreationParams {
  text: string;
  type: 'habit' | 'daily' | 'todo' | 'reward';
  notes?: string;
  date?: string;
  priority?: 0.1 | 1 | 1.5 | 2;
  tags?: string[];
}

export interface HabiticaTaskCreateData {
  text: string;
  type: string;
  notes?: string;
  priority?: number;
}