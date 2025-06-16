export type IdeaStatus =
  | 'raw_spark'
  | 'fleshing_out'
  | 'researching'
  | 'prototyping'
  | 'on_hold'
  | 'archived'
  | 'completed';

export interface Idea {
  id: string;
  title: string;
  description?: string;
  status: IdeaStatus;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  dueDate?: string;
  priority?: string;
}

export interface IdeaLog {
  id: string;
  ideaId: string;
  timestamp: string;
  logType: 'status_change' | 'note' | 'llm_brainstorm' | 'initial_capture';
  details: string;
  action: string;
  type: string;
  content: string;
  author: string;
}
