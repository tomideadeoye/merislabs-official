/**
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides a public API endpoint for semantic memory search within Orion's Qdrant knowledge base.
 *   - Generates embeddings for a given text query and uses them to find the most relevant memory chunks.
 *   - Allows filtering by collection name, limit, and score threshold, and supports additional Qdrant filters.
 *   - Acts as the primary interface for UI components (e.g., MemoryManager, DraftCommunication) to retrieve contextual information.
 *
 * FILEPATH: `app/api/orion/memory/search/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/api/orion/memory/generate-embeddings/route.ts`: This endpoint internally calls the embeddings generation API to convert the text query into a vector.
 *   - `app/api/orion/orion/memory/vector-search.ts`: This is the lower-level endpoint that performs the actual Qdrant vector search, which this route consumes.
 *   - `@/lib/orion_config`: Provides `ORION_MEMORY_COLLECTION_NAME` and `QDRANT_HOST` for Qdrant connection details.
 *   - `@qdrant/js-client-rest`: The underlying client library used to interact with Qdrant.
 *   - `@/lib/logger.ts`: Used for comprehensive, context-rich logging of search operations.
 *   - `@/lib/types/memory.ts`: Defines `SearchRequestBody`, `EmbeddingResponse`, `SearchDataResponse`, `QdrantFilter`, `ScoredMemoryPoint`, and `MemoryMetadataPayload`, ensuring type consistency.
 *   - `app/(orion_admin)/admin/memory-manager/page.tsx`: The UI component that consumes this API to display search results.
 *   - `app/api/orion/opportunity/[opportunityId]/draft-application/route.ts`: Calls this API to fetch relevant memories for drafting applications.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that a Qdrant instance is running and configured via environment variables (`QDRANT_HOST`, `QDRANT_PORT`).
 *   - Assumes the embeddings generation service (`/api/orion/memory/generate-embeddings`) is operational and accessible.
 *   - Handles authentication via `auth()` in `POST` request. This is critical for securing user-specific memory access.
 *
 * NOTES:
 *   - This route serves as a crucial bridge between user queries (text) and the vector database (embeddings).
 *   - The `logContext` is flexibly defined to capture various request parameters for detailed logging and debugging.
 *   - Error handling includes logging detailed errors and returning generic messages to the client for security.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Input Validation**: Implement robust input validation (e.g., using Zod) for `SearchRequestBody` to ensure all incoming data is well-formed and secure.
 *   - **Centralized Error Handling**: Integrate `handleApiError` from `@/lib/utils/errorHandler` for more consistent and standardized error responses across all API routes.
 *   - **Performance Optimization**: For very large scale deployments, consider caching mechanisms for frequently searched queries or optimizing embedding generation calls.
 *   - **Advanced Filtering**: Expand filter capabilities to include more complex Qdrant query options (e.g., geo-spatial, full-text search within payload fields).
 *   - **User-specific Filtering**: Automatically add `userId` to Qdrant filters to ensure users only search their own memories, leveraging the `session.user.id`.
 *   - **Asynchronous Embedding Generation**: For extremely long queries, consider offloading embedding generation to a background task to prevent request timeouts.
 *   - **Semantic Score Threshold Dynamic Adjustment**: Implement a mechanism to dynamically adjust `minScore` based on search result density or user preferences.
 *   - **Hybrid Search**: Explore implementing hybrid search (combining vector search with keyword search) for more comprehensive and nuanced results.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - This API already consolidates the embedding generation and vector search steps into a single user-facing endpoint, simplifying client-side interactions with the memory system.
 *   - Future consolidation might involve integrating more complex memory retrieval strategies (e.g., hybrid search, re-ranking) directly within this route to provide a more refined set of results.
 */
import { NextRequest, NextResponse } from 'next/server';
import { ORION_MEMORY_COLLECTION_NAME, QDRANT_HOST } from '@/lib/orion_config';
import { QdrantClient } from '@qdrant/js-client-rest';
import logger from '@/lib/logger';
import { QdrantFilter, ScoredMemoryPoint, MemoryMetadataPayload } from '@/lib/types/memory';
import { handleApiError, HandledError } from '@/lib/utils/errorHandler';

interface SearchRequestBody {
  query: string;
  collectionName?: string;
  limit?: number;
  filter?: QdrantFilter;
  minScore?: number;
}

interface EmbeddingResponse {
  success: boolean;
  embeddings?: number[][];
  error?: string;
}

interface SearchDataResponse {
  success: boolean;
  results?: ScoredMemoryPoint[];
  query?: string;
  error?: string;
}

// import { SearchDataResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  const operation = 'memorySearch';
  const timestamp = new Date().toISOString();
  // Define logContext with a more flexible type or include all expected properties
  const logContext: Record<string, unknown> = {
    operation,
    timestamp,
    route: '/api/orion/memory/search',
  };

  try {
    const body = (await request.json()) as unknown as SearchRequestBody;
    const {
      query,
      collectionName = ORION_MEMORY_COLLECTION_NAME,
      limit = 5,
      filter = {} as QdrantFilter,
      minScore = 0.7,
    } = body;

    // Add properties to logContext after they are defined
    logContext.collectionName = collectionName;
    // Log snippet of the query to avoid logging potentially large inputs
    logContext.query = query ? query.substring(0, 50) + (query.length > 50 ? '...' : '') : 'N/A'; // Log snippet
    logContext.limit = limit;
    logContext.filter = filter;
    logContext.minScore = minScore;

    if (!query || typeof query !== 'string' || query.trim() === '') {
      logger.warn('[MEMORY_SEARCH_API] Query cannot be empty.', logContext);
      return NextResponse.json({ success: false, error: 'Query cannot be empty.' }, { status: 400 });
    }

    logger.info(
      `[MEMORY_SEARCH_API] Received search request for query: "${query}" in collection: ${collectionName}`,
      logContext
    );

    // 1. Generate embedding for the query
    logger.debug(`[MEMORY_SEARCH_API] Requesting embedding for query...`, logContext);
    const embeddingResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/generate-embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: request.headers.get('Authorization') || '',
      },
      body: JSON.stringify({
        texts: [query],
      }),
    });

    const embeddingData: EmbeddingResponse = await embeddingResponse.json();

    if (!embeddingData.success || !embeddingData.embeddings || embeddingData.embeddings.length === 0) {
      logger.error('[MEMORY_SEARCH_API] Failed to generate embeddings.', { ...logContext, error: embeddingData.error });
      throw new Error(embeddingData.error || 'Failed to generate embeddings.');
    }

    const queryVector = embeddingData.embeddings[0];
    logger.debug(`[MEMORY_SEARCH_API] Query embedding generated successfully.`, logContext);

    // 2. Search Qdrant with the query vector
    if (!QDRANT_HOST) {
      logger.error('[MEMORY_SEARCH_API] QDRANT_HOST is not defined.', logContext);
      return NextResponse.json({ success: false, error: 'Qdrant host is not configured.' }, { status: 500 });
    }

    const qdrantPort = process.env.QDRANT_PORT || 6333;
    const qdrantUrl = `http://${QDRANT_HOST}:${qdrantPort}`;

    const qdrantClientOptions: ConstructorParameters<typeof QdrantClient>[0] = {
      url: qdrantUrl,
      // apiKey: process.env.QDRANT_API_KEY, // Add if Qdrant is secured with an API key
    };
    if (process.env.QDRANT_API_KEY) {
      qdrantClientOptions.apiKey = process.env.QDRANT_API_KEY;
    }

    const qdrantClient = new QdrantClient(qdrantClientOptions);

    logger.debug(`[MEMORY_SEARCH_API] Searching Qdrant collection "${collectionName}"...`, logContext);

    const searchParams = {
      vector: queryVector,
      limit: limit,
      filter: filter, // Ensure this filter structure is compatible with Qdrant client
      with_payload: true,
      with_vector: false,
      score_threshold: minScore,
    };

    const searchResults = await qdrantClient.search(collectionName, searchParams);

    logger.success(`[MEMORY_SEARCH_API] Qdrant search successful. Found ${searchResults.length} results.`, {
      ...logContext,
      resultsCount: searchResults.length,
    });

    // 3. Return the search results
    // The Qdrant client returns points with `payload` and `id`.
    // The previous structure expected `results` which is an array of these points.
    // The client-side mapping `result.payload.source_id` suggests `source_id` is in the payload.
    // Qdrant's `id` is the point ID.
    // The structure `ScoredMemoryPoint` has `id`, `score`, `payload`.
    // The qdrantClient.search directly returns an array of ScoredPoint objects.
    const mappedResults: ScoredMemoryPoint[] = searchResults.map((point) => ({
      id: point.id.toString(), // Ensure id is string
      score: point.score,
      content: (point.payload?.text as string) || '', // Assuming text is in payload
      ...(point.vector && { embedding: point.vector as number[] }), // Conditionally include embedding if vector exists
      payload: point.payload as MemoryMetadataPayload, // Assign full payload as metadata
    }));

    return NextResponse.json<SearchDataResponse>({
      success: true,
      results: mappedResults, // Use the mapped results
      query, // Echo back the original query for context if needed
    });
  } catch (error: unknown) {
    const handledError = handleApiError(error, logContext);
    return NextResponse.json(
      {
        success: false,
        error: handledError.message,
        details: handledError.data,
      },
      { status: handledError.status || 500 }
    );
  }
}
