/**
 * Memory utilities for Orion
 */

import axios from 'axios';
import { ORION_MEMORY_COLLECTION_NAME } from './orion_config';
import type { ScoredMemoryPoint, QdrantFilter } from '@/types/orion'; // Import necessary types

const MEMORY_API_ENDPOINT = '/api/orion/memory';

/**
 * Process text for indexing in memory
 */
export async function processTextForIndexing(text: string, sourceId: string, tags: string[] = []) {
  try {
    const response = await axios.post(`${MEMORY_API_ENDPOINT}/add-memory`, {
      text,
      sourceId,
      tags
    });

    return response.data;
  } catch (error) {
    console.error('Error processing text for indexing:', error);
    throw error;
  }
}

/**
 * Search memory for relevant content
 */
export async function searchMemory(params: {
  query: string;
  limit?: number;
  filter?: QdrantFilter; // Use specific filter type
  collectionName?: string;
}): Promise<ScoredMemoryPoint[]> { // Specify return type
  try {
    // Call the dedicated search API route instead of the internal search endpoint
    const response = await axios.post(`${MEMORY_API_ENDPOINT}/search`, { // Call /api/orion/memory/search
      query: params.query,
      limit: params.limit ?? 5, // Use default if not provided
      filter: params.filter,
      collectionName: params.collectionName || ORION_MEMORY_COLLECTION_NAME
    });

    // The /api/orion/memory/search route returns { success: boolean, results: ScoredMemoryPoint[], query: string }
    if (response.data.success) {
      return response.data.results; // Return the array of results
    } else {
      console.error('Error in memory search API response:', response.data.error);
      throw new Error(response.data.error || 'Memory search API returned an error.');
    }
  } catch (error: any) {
    console.error('Error searching memory:', error);
    // Ensure consistent error return type, maybe return empty array or re-throw
    throw error; // Re-throw the error to be handled by the caller
  }
}
