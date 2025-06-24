/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Defines the data structures for memory points stored in and retrieved from Qdrant, ensuring type consistency between the API layer and the UI.
 *   - Provides interfaces for `MemoryMetadataPayload`, `ScoredMemoryPoint`, `QdrantFilter`, and `QdrantFilterCondition` to standardize memory interactions.
 *
 * FILEPATH: `app/lib/types/memory.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/api/orion/memory/search/route.ts`: Consumes these types for defining request/response bodies and handling Qdrant search results.
 *   - `app/api/orion/orion/memory/vector-search.ts`: Uses these types for defining direct vector search parameters and results.
 *   - `app/(orion_admin)/admin/memory-manager/page.tsx`: Consumes `ScoredMemoryPoint` to display memory search results in the UI.
 *   - `app/lib/types/index.ts`: Re-exports these types as part of the central type definitions for the Orion project.
 *   - Qdrant Client (`@qdrant/js-client-rest`): These interfaces mirror the structure of data sent to and received from the Qdrant database.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `MemoryMetadataPayload` directly corresponds to the `payload` field within Qdrant memory points.
 *   - `ScoredMemoryPoint` includes both `id`, `score`, `content`, and the `payload` (metadata) for comprehensive representation of a search result.
 *
 * NOTES:
 *   - This file is critical for maintaining type safety and data consistency across all memory-related functionalities in Orion.
 *   - The `[key: string]: unknown;` index signature in `MemoryMetadataPayload` allows for flexibility to include additional metadata fields from Qdrant without strict type enforcement for every possible field.
 *   - The `payload` property in `ScoredMemoryPoint` was intentionally named to align with the Qdrant client's response structure.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Schema Validation**: Consider integrating a schema validation library (e.g., Zod) for runtime validation of memory payloads, especially when receiving data from external sources or APIs.
 *   - **Detailed Metadata Types**: As the application evolves, more specific interfaces could be defined for different `type` values within `MemoryMetadataPayload` (e.g., `JournalMemoryPayload`, `OpportunityMemoryPayload`) to provide stricter type checking for type-specific fields.
 *   - **Documentation**: Expand comments for each field within the interfaces to provide clearer explanations of their purpose and origin.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - This file already consolidates all memory-specific type definitions, preventing scattering of related types across the codebase.
 *   - There is no immediate opportunity to consolidate this file further without sacrificing clarity or introducing circular dependencies.
 */

/**
 * Defines the structure of the metadata payload stored within a Qdrant memory point.
 * This directly corresponds to the `payload` field from Qdrant, which contains
 * rich contextual information about the memory.
 */
export interface MemoryMetadataPayload {
  text: string; // The original text content (also mapped to 'content' at top-level of ScoredMemoryPoint)
  source_id: string;
  timestamp: string;
  indexedAt: string;
  type: string; // e.g., 'journal_entry', 'general_note'
  tags?: string[];
  mood?: string;
  original_entry_id?: string;
  originalTaskText?: string;
  title?: string; // Critical for display in UI, comes from Qdrant payload
  opportunityId?: string;
  company?: string;
  status?: string;
  outcome?: string;
  quadrant?: string; // Explicitly define the quadrant property
  [key: string]: unknown; // Allows for additional flexible fields
}

/**
 * Defines the structure of a memory point as returned by the Qdrant search API
 * and consumed by the frontend. This is the "scored" result.
 */
export interface ScoredMemoryPoint {
  id: string;
  score: number;
  content: string;
  vector: number[];
  payload?: MemoryMetadataPayload; // Optional additional metadata
}

export interface QdrantFilter {
  must?: QdrantFilterCondition[];
  should?: QdrantFilterCondition[];
  must_not?: QdrantFilterCondition[];
}

export interface QdrantFilterCondition {
  key: string;
  match: {
    value: string | number | boolean;
  };
}

export interface MemorySearchOptions {
  collectionName?: string;
  limit?: number;
  filter?: QdrantFilter;
  minScore?: number;
}

export interface MemorySearchResponse {
  success: boolean;
  results?: ScoredMemoryPoint[];
  query?: string;
  error?: string;
}
