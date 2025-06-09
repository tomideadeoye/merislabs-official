export type BlockType =
  | "CV_SNIPPET"
  | "OPPORTUNITY_HIGHLIGHT"
  | "JOURNAL_INSIGHT"
  | "PROMPT_TEMPLATE"
  | "GENERAL_BLOCK";
/**
 * NOTE: BLOCK_TYPES is a runtime constant, not a type declaration.
 * To use in a .d.ts file, declare as a value, not with an initializer.
 * Move the initializer to a .ts file if you need the runtime value.
 */
declare const BLOCK_TYPES: readonly BlockType[];

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
