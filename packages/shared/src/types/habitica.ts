export interface HabiticaTask {
  id: string;
  _id?: string;
  text: string;
  type: string;
  completed: boolean;
  notes?: string;
  date?: string;
  orionOrigin?: {
    orionSourceModule: string;
    orionSourceReferenceId: string;
    createdAt: string;
  };
}

export interface HabiticaTaskCreationParams {
  text: string;
  type: string;
  notes?: string;
  priority?: string;
}

export interface HabiticaUserStats {
  hp: number;
  exp: number;
  gp: number;
  mp: number;
  stats?: {
    hp: number;
    maxHealth: number;
    mp: number;
    maxMP: number;
    exp: number;
    toNextLevel: number;
    lvl: number;
    gp: number;
  };
  profile?: {
    name: string;
  };
  auth?: {
    local?: {
      username: string;
    };
  };
}

export type HabiticaTaskCreateData = HabiticaTaskCreationParams;
