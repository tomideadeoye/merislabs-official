/**
 * Runtime constant for all valid block types.
 * Use this for validation, iteration, and runtime checks.
 */
export type BlockType =
  | "CV_SNIPPET"
  | "OPPORTUNITY_HIGHLIGHT"
  | "JOURNAL_INSIGHT"
  | "PROMPT_TEMPLATE"
  | "GENERAL_BLOCK";

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

export const BLOCK_TYPES: readonly BlockType[] = [
  "CV_SNIPPET",
  "OPPORTUNITY_HIGHLIGHT",
  "JOURNAL_INSIGHT",
  "PROMPT_TEMPLATE",
  "GENERAL_BLOCK"
] as const;
