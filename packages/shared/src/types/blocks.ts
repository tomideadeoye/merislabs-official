export interface Block {
  id: string;
  type: BlockType;
  content: string;
}

export type BlockType = 'text' | 'image' | 'video' | 'audio' | 'code' | 'other';

export const BLOCK_TYPES: BlockType[] = ['text', 'image', 'video', 'audio', 'code', 'other'];

export interface CreateBlockPayload {
  type: BlockType;
  content: string;
}
