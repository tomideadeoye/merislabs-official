/**
 * Memory integration for Orion
 * Provides a unified interface for interacting with the memory system
 */

import { ORION_MEMORY_COLLECTION_NAME } from './orion_config';

export interface MemoryPoint {
  text: string;
  source_id: string;
  timestamp: string;
  indexed_at?: string;
  type: string;
  tags?: string[];
  mood?: string;
  [key: string]: any; // Allow additional fields
}

export interface MemorySearchFilter {
  must?: Array<{key: string, match: {value: string | number | boolean}}>;
  should?: Array<{key: string, match: {value: string | number | boolean}}>;
  must_not?: Array<{key: string, match: {value: string | number | boolean}}>;
}

export interface MemorySearchOptions {
  filter?: MemorySearchFilter;
  limit?: number;
  withVectors?: boolean;
}

export interface ScoredMemoryPoint {
  score: number;
  payload: MemoryPoint;
  vector?: number[];
}

/**
 * Search memory for relevant content
 */
export async function searchMemory(
  queryText: string,
  options: MemorySearchOptions = {}
): Promise<{success: boolean, results?: ScoredMemoryPoint[], error?: string}> {
  try {
    const response = await fetch('/api/orion/memory/search-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        queryText,
        filter: options.filter,
        limit: options.limit || 10,
        withVectors: options.withVectors || false
      })
    });

    return await response.json();
  } catch (error: any) {
    console.error('Error searching memory:', error);
    return { success: false, error: error.message };
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
  additionalFields: Record<string, any> = {}
): Promise<{success: boolean, error?: string}> {
  try {
    // 1. Generate embedding for the text
    const embedPayload = { texts: [text] };
    console.log('[addMemory] Requesting embedding:', JSON.stringify(embedPayload));
    const embedResponse = await fetch('/api/orion/memory/generate-embeddings-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(embedPayload)
    });

    const embedData = await embedResponse.json();
    console.log('[addMemory] Embedding response:', JSON.stringify(embedData));
    if (!embedData.success) {
      console.error('[addMemory] Embedding failed:', embedData.error);
      return { success: false, error: embedData.error || 'Failed to generate embedding' };
    }

    // 2. Create memory point with embedding
    const timestamp = new Date().toISOString();
    const memoryPoint = {
      text,
      source_id: sourceId,
      timestamp,
      indexed_at: timestamp,
      type,
      tags,
      ...additionalFields
    };
    const upsertPayload = {
      points: [{
        id: sourceId,
        vector: embedData.embeddings[0],
        payload: memoryPoint
      }],
      collectionName: ORION_MEMORY_COLLECTION_NAME
    };
    console.log('[addMemory] Upsert payload:', JSON.stringify(upsertPayload));

    // 3. Store in memory system
    const upsertResponse = await fetch('/api/orion/memory/upsert-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(upsertPayload)
    });

    const upsertData = await upsertResponse.json();
    console.log('[addMemory] Upsert response:', JSON.stringify(upsertData));
    return upsertData;
  } catch (error: any) {
    console.error('[addMemory] Error adding memory:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Find memories by exact match on a field
 */
export async function findMemoriesByField(
  field: string,
  value: string | number | boolean,
  limit: number = 10
): Promise<{success: boolean, results?: ScoredMemoryPoint[], error?: string}> {
  return searchMemory('*', {
    filter: {
      must: [{ key: field, match: { value } }]
    },
    limit
  });
}

/**
 * Find memories by type
 */
export async function findMemoriesByType(
  type: string,
  limit: number = 10
): Promise<{success: boolean, results?: ScoredMemoryPoint[], error?: string}> {
  return findMemoriesByField('type', type, limit);
}

/**
 * Find memories by tag
 */
export async function findMemoriesByTag(
  tag: string,
  limit: number = 10
): Promise<{success: boolean, results?: ScoredMemoryPoint[], error?: string}> {
  // This assumes tags are stored in an array field and the backend supports array contains operations
  return searchMemory('*', {
    filter: {
      must: [{ key: 'tags', match: { value: tag } }]
    },
    limit
  });
}
