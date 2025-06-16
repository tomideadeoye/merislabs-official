/**
 * Memory integration for Orion
 * Provides a unified interface for interacting with the memory system
 */

// GOAL OF FILE|FEATURES|FUNCTIONS:
// FILEPATH:
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunties to consolidate
// TODOS:
// SUGGESTIONS:

import { MemorySearchOptions, ScoredMemoryPoint, MemoryPayload } from '../..';
import { ORION_MEMORY_COLLECTION_NAME } from './orion_config';


export interface MemoryPoint {
  text: string;
  source_id: string;
  timestamp: string;
  indexed_at: string;
  type: string;
  tags?: string[];
  mood?: string;
  [key: string]: unknown;
}

/**
 * Search memory for relevant content
 */
export async function searchMemory(options: MemorySearchOptions): Promise<{
  success: boolean;
  results?: ScoredMemoryPoint[];
  error?: string;
}> {
  try {
    const queryText = options.query; // Query is now guaranteed to be a string
    const response = await fetch('/api/orion/memory/search-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queryText,
        filter: options.filter,
        limit: options.limit || 10,
        withVectors: options.withVectors || false,
      }),
    });

    return await response.json();
  } catch (error: unknown) {
    console.error('Error searching memory:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred.',
    };
  }
}

/**
 * Add memory to the system
 */
export async function addMemory(
  text: string,
  sourceId: string,
  type: string,
  tags: string[] = [],
  additionalFields: Record<string, unknown> = {},
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Generate embedding for the text
    const embedPayload = { texts: [text] };
    console.log(
      '[addMemory] Requesting embedding:',
      JSON.stringify(embedPayload),
    );
    const embedResponse = await fetch(
      '/api/orion/memory/generate-embeddings-proxy',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(embedPayload),
      },
    );

    const embedData = await embedResponse.json();
    console.log('[addMemory] Embedding response:', JSON.stringify(embedData));
    if (!embedData.success) {
      console.error('[addMemory] Embedding failed:', embedData.error);
      return {
        success: false,
        error: embedData.error || 'Failed to generate embedding',
      };
    }

    // 2. Create memory payload with embedding
    const timestamp = new Date().toISOString();
    const memoryPayload: MemoryPayload = {
      text,
      source_id: sourceId,
      timestamp,
      indexedAt: timestamp,
      type,
      tags,
      ...additionalFields,
    };

    const upsertPayload = {
      points: [
        {
          id: sourceId,
          vector: embedData.embeddings[0],
          payload: memoryPayload,
        },
      ],
      collectionName: ORION_MEMORY_COLLECTION_NAME,
    };
    console.log('[addMemory] Upsert payload:', JSON.stringify(upsertPayload));

    // 3. Store in memory system
    const upsertResponse = await fetch('/api/orion/memory/upsert-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(upsertPayload),
    });

    const upsertData = await upsertResponse.json();
    console.log('[addMemory] Upsert response:', JSON.stringify(upsertData));
    return upsertData;
  } catch (error: unknown) {
    console.error('[addMemory] Error adding memory:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred.',
    };
  }
}

/**
 * Find memories by exact match on a field
 */
export async function findMemoriesByField(
  field: string,
  value: string | number | boolean,
  limit: number = 10,
): Promise<{
  success: boolean;
  results?: ScoredMemoryPoint[];
  error?: string;
}> {
  // Always use 'payload.' prefix for Qdrant filtering
  const key = field.startsWith('payload.') ? field : `payload.${field}`;
  return searchMemory({
    query: '*',
    filter: {
      must: [{ key, match: { value } }],
    },
    limit,
  });
}

/**
 * Find memories by type
 */
export async function findMemoriesByType(
  type: string,
  limit: number = 10,
): Promise<{
  success: boolean;
  results?: ScoredMemoryPoint[];
  error?: string;
}> {
  return findMemoriesByField('payload.type', type, limit);
}

/**
 * Find memories by tag
 */
export async function findMemoriesByTag(
  tag: string,
  limit: number = 10,
): Promise<{
  success: boolean;
  results?: ScoredMemoryPoint[];
  error?: string;
}> {
  return findMemoriesByField('payload.tags', tag, limit);
}
