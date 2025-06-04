export const BLOCK_TYPES = [
  "CV_SNIPPET",
  "OPPORTUNITY_HIGHLIGHT",
  "JOURNAL_INSIGHT",
  "PROMPT_TEMPLATE",
  "GENERAL_BLOCK"
] as const;
export type BlockType = typeof BLOCK_TYPES[number];

export interface Block {
  id: string;
  type: BlockType;
  title: string;
  content: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface CreateBlockPayload {
  type: BlockType;
  title: string;
  content: string;
  tags?: string[];
}
