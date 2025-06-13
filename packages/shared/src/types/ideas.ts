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
  briefDescription?: string;
  status: IdeaStatus;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface IdeaLog {
  id: string;
  ideaId: string;
  timestamp: string;
  type: 'initial_capture' | 'note' | 'llm_brainstorm' | 'research_snippet' | 'status_change' | 'link';
  content: string;
  author: 'Tomide' | 'Orion';
}
