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

import { MemorySearchOptions, ScoredMemoryPoint, MemoryPayload, QdrantFilter } from '@/lib/types';
import { ORION_MEMORY_COLLECTION_NAME } from './orion_config';
import logger from '@/lib/logger';

// Placeholder for Qdrant Client
// let qdrantClient: QdrantClient | null = null; // Qdrant client should be used server-side, e.g., in API routes

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
export async function searchMemory(
  queryText: string,
  options?: Omit<MemorySearchOptions, 'query'>
): Promise<{
  success: boolean;
  results?: ScoredMemoryPoint[];
  error?: string;
}> {
  // Client-side validation before making the API call
  if (!queryText || queryText.trim() === '') {
    logger.warn('[searchMemory] Attempted to search with an empty query.');
    return {
      success: false,
      error: 'Query cannot be empty.', // Return the same error message the backend might produce
    };
  }

  try {
    const response = await fetch('/api/orion/memory/search-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queryText,
        filter: options?.filter,
        limit: options?.limit || 10,
        withVectors: options?.withVectors || false,
      }),
    });

    return await response.json();
  } catch (error: unknown) {
    console.error('Error searching memory:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred.',
    };
  }
}

/**
 * @function addMemory
 * @description Adds a new memory to the system.
 * @param text The text content of the memory.
 * @param sourceId A unique identifier for the source of the memory.
 */
/**
 * Add memory to the system
 */
export async function addMemory(
  text: string,
  sourceId: string,
  type: string,
  tags?: string[],
  additionalFields: Record<string, unknown> = {}
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Generate embedding for the text
    const embedPayload = { texts: [text] };
    console.log('[addMemory] Requesting embedding:', JSON.stringify(embedPayload));
    const embedResponse = await fetch('/api/orion/memory/generate-embeddings-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(embedPayload),
    });

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
      error: error instanceof Error ? error.message : 'An unknown error occurred.',
    };
  }
}

/**
 * @function findMemoriesByField
 * @description Finds memories by exact match on a specific field.
 * @param field The field to search within the memory payload.
 * @param value The value to match in the specified field.
 * @param limit The maximum number of memories to return.
 */
/**
 * Find memories by exact match on a field
 */
export async function findMemoriesByField(
  field: string,
  value: string | number | boolean,
  limit: number = 10
): Promise<{
  success: boolean;
  results?: ScoredMemoryPoint[];
  error?: string;
}> {
  // Always use 'payload.' prefix for Qdrant filtering
  const key = field.startsWith('payload.') ? field : `payload.${field}`;
  return searchMemory('*', {
    filter: {
      must: [{ key, match: { value } }],
    },
    limit,
  });
}

/**
 * @function findMemoriesByType
 * @description Finds memories of a specific type.
 * @param type The type of memory to search for.
 * @param limit The maximum number of memories to return.
 */
/**
 * Find memories by type
 */
export async function findMemoriesByType(
  type: string,
  limit: number = 10
): Promise<{
  success: boolean;
  results?: ScoredMemoryPoint[];
  error?: string;
}> {
  return findMemoriesByField('payload.type', type, limit);
}

/**
 * @function findMemoriesByTag
 * @description Finds memories associated with a specific tag.
 * @param tag The tag to search for.
 * @param limit The maximum number of memories to return.
 */
/**
 * Find memories by tag
 */
export async function findMemoriesByTag(
  tag: string,
  limit: number = 10
): Promise<{
  success: boolean;
  results?: ScoredMemoryPoint[];
  error?: string;
}> {
  return findMemoriesByField('payload.tags', tag, limit);
}

/**
 * @function initializeOrionMemory
 * @description Initializes the Qdrant client and ensures the memory collection exists.
 */
/**
 * Initializes the Qdrant client and ensures the memory collection exists.
 */
export async function initializeOrionMemory(): Promise<void> {
  logger.info('[Memory] Attempting to initialize/verify Qdrant memory via API.');
  try {
    // Call the API route for initialization
    const response = await fetch('/api/orion/memory/initialize', {
      method: 'POST',
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      const errorMessage = data.error || `Failed to initialize memory system via API: ${response.statusText}`;
      logger.error('[Memory] Failed to initialize Qdrant memory via API.', { error: errorMessage });
      throw new Error(errorMessage);
    }
    logger.success('[Memory] Qdrant memory initialized/verified via API.', {
      collection: ORION_MEMORY_COLLECTION_NAME, // Assuming this is still relevant, though managed by API
      message: data.message,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[Memory] Failed to initialize Qdrant memory.', { error: errorMessage });
    // Re-throw the original error message or a more specific one
    throw new Error(`Failed to initialize Qdrant memory: ${errorMessage}`);
  }
}

/**
 * @function findRelevantMemories
 * @description Searches Qdrant memory for relevant content based on a query.
 * @param query The search query string.
 * @param limit The maximum number of memories to return.
 * @param filter Optional filter to refine the search.
 */
/**
 * Searches Qdrant memory for relevant content based on a query.
 * NOTE: This is a direct Qdrant search. For full RAG, it should integrate with an embedding model.
 * For now, it will use a simple text search placeholder or a proxy to embedding service.
 */
export async function findRelevantMemories(
  query: string,
  limit: number = 5,
  filter?: QdrantFilter
): Promise<ScoredMemoryPoint[]> {
  // Direct Qdrant client usage is removed from here as this function is likely called client-side.
  // It relies on `searchMemory` which proxies to the backend.
  // Initialization is handled by `MemoryProvider` calling `initializeOrionMemory`,
  // which now correctly calls the API.

  logger.info('[Memory] Finding relevant memories using searchMemory proxy.', { query, limit, filter });

  try {
    // In a real scenario, `query` would be converted to an embedding here.
    // For this placeholder, we'll simulate a search or rely on `searchMemory` if it proxies to a backend that handles embeddings.
    logger.info('[Memory] Simulating relevant memory search.', { query, limit, filter });

    // If searchMemory is a proxy to a backend that handles embeddings/Qdrant,
    // we can reuse it. Otherwise, we'd need embedding logic here.
    const searchResult = await searchMemory(query, { limit, filter });

    if (searchResult.success && searchResult.results) {
      logger.success('[Memory] Simulated relevant memory search successful.', {
        query,
        resultsCount: searchResult.results.length,
      });
      return searchResult.results;
    } else {
      logger.warn('[Memory] No relevant memories found or search failed.', { query, error: searchResult.error });
      return [];
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[Memory] Error during relevant memory search.', { query, error: errorMessage });
    return [];
  }
}
