/**
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides a dedicated API endpoint for performing direct vector searches against the Qdrant memory database.
 *   - Enables searching for relevant memory chunks based on a provided vector embedding, with options for filtering, limiting results, and setting score thresholds.
 *   - Acts as a low-level interface for memory retrieval, consumed by higher-level search and drafting functionalities.
 *
 * FILEPATH: `app/api/orion/orion/memory/vector-search.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@qdrant/js-client-rest`: Core library for interacting with the Qdrant vector database.
 *   - `@/lib/orion_config`: Provides `ORION_MEMORY_COLLECTION_NAME` to specify the target collection for searches.
 *   - `app/api/orion/memory/search/route.ts`: This higher-level API route likely calls this `vector-search` endpoint internally after generating an embedding for a text query.
 *   - `app/lib/types/memory.ts`: Defines the `QdrantFilter`, `ScoredMemoryPoint` and `MemoryMetadataPayload` interfaces, crucial for type consistency of search parameters and results.
 *   - Environment Variables: Relies on `process.env.QDRANT_URL` and `process.env.QDRANT_PORT` for connecting to the Qdrant instance.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes Qdrant is running and accessible at the configured URL and port.
 *   - Expects a pre-generated vector embedding in the request body for searching.
 *   - Authentication and authorization are handled upstream (e.g., in parent API routes or middleware), as this endpoint is designed for internal service-to-service calls.
 *
 * NOTES:
 *   - This API is designed for internal use by Orion's memory and LLM services, not direct exposure to the frontend.
 *   - Comprehensive logging is included for tracing search requests and errors.
 *   - Uses `NextRequest` and `NextResponse` for compatibility with the Next.js App Router, indicating it is not a traditional Next.js Pages API route.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Input Validation**: Implement Zod schema validation for the request body (`vector`, `limit`, `filter`, etc.) to ensure robust input handling and prevent malformed queries.
 *   - **Error Handling**: Centralize error handling using `errorHandler.ts` for consistent logging and response formatting, similar to other Orion API routes.
 *   - **Authentication/Authorization**: If this endpoint were ever exposed directly to external consumers, it would require explicit authentication and authorization checks.
 *   - **Performance**: For very high-throughput scenarios, consider connection pooling for Qdrant client or optimizing filter logic.
 *   - **Flexibility**: Allow more flexible Qdrant query options (e.g., `lookup` for sparse vectors, `query_by_text` if a text embedding model is integrated directly here).
 *   - **Documentation**: Extend API documentation (e.g., OpenAPI/Swagger) for internal consumers.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - This endpoint serves a specific, low-level purpose. Its logic is intentionally granular to be reusable by various higher-level memory functionalities (e.g., semantic search, context retrieval).
 */
import { NextRequest, NextResponse } from 'next/server';
import { QdrantClient } from '@qdrant/js-client-rest';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';

// Initialize Qdrant client
const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
});

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await req.json();
    const {
      vector,
      collectionName = ORION_MEMORY_COLLECTION_NAME,
      limit = 5,
      filter = {},
      withPayload = true,
      withVector = false,
      scoreThreshold = 0.7,
    } = body;

    if (!vector || !Array.isArray(vector)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vector is required and must be an array.',
        },
        { status: 400 }
      );
    }

    console.log(`[VECTOR_SEARCH_API] Searching in collection: ${collectionName}`);
    console.log(`[VECTOR_SEARCH_API] Filter:`, JSON.stringify(filter));

    // Perform the search
    const searchResults = await qdrantClient.search(collectionName, {
      vector,
      limit,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      with_payload: withPayload,
      with_vector: withVector,
      score_threshold: scoreThreshold,
    });

    console.log(`[VECTOR_SEARCH_API] Search successful. Found ${searchResults.length} results.`);

    return NextResponse.json(
      {
        success: true,
        results: searchResults,
        count: searchResults.length,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(
      '[VECTOR_SEARCH_API_ERROR]',
      error instanceof Error ? error.message : String(error),
      error instanceof Error ? error.stack : 'N/A'
    );
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search vectors.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
