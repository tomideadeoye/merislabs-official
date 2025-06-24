/**
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides an API endpoint for upserting (inserting or updating) vector points into Orion's Qdrant memory collection.
 *   - This endpoint is crucial for populating and maintaining the vector database, enabling semantic search and retrieval-augmented generation (RAG).
 *   - Validates incoming `points` to ensure they have required `id`, `vector`, and `payload` (metadata) fields.
 *   - Filters out points without valid embeddings to prevent Qdrant errors.
 *   - Handles connection to Qdrant using environment variables (`QDRANT_HOST`, `QDRANT_PORT`, `QDRANT_API_KEY`).
 *   - Employs comprehensive logging to trace the upsert process, including validation, Qdrant client initialization, and operation results.
 *
 * FILEPATH: `app/api/orion/memory/upsert/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@qdrant/js-client-rest`: The core library for interacting with the Qdrant vector database.
 *   - `@/lib/orion_config`: Provides `ORION_MEMORY_COLLECTION_NAME` for consistent collection naming.
 *   - `@/lib/logger.ts`: Used for structured, context-rich logging throughout the upsert process.
 *   - `@/lib/types/memory.ts`: Defines `ScoredMemoryPoint` and `MemoryMetadataPayload`, ensuring type safety for memory data.
 *   - `app/api/orion/memory/generate-embeddings/route.ts`: This endpoint typically generates the `embedding` (vector) data that is then upserted by this route.
 *   - `app/api/orion/memory/search/route.ts`: Queries the memory collection populated by this upsert route.
 *   - `app/(orion_admin)/admin/memory-manager/page.tsx`: The UI component that initiates memory upsert operations (e.g., when a user adds a new memory).
 *   - `app/components/ui/orion/DedicatedAddToMemoryFormComponent.tsx`: The form component that ultimately triggers this upsert API call.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes Qdrant is running and accessible via the provided `QDRANT_HOST`, `QDRANT_PORT`, and optionally `QDRANT_API_KEY` environment variables.
 *   - Expects `points` in the request body to be an array of `ScoredMemoryPoint` objects, each containing an `id`, `vector`, and `payload`.
 *   - The `wait: true` option is used in the Qdrant upsert call to ensure the operation completes before a response is sent, which can be adjusted for higher throughput async operations if needed.
 *   - Error handling differentiates between validation failures, Qdrant specific errors, and general fatal errors.
 *
 * NOTES:
 *   - This API route is critical for maintaining the freshness and completeness of Orion's knowledge base.
 *   - Extensive logging aids in debugging and monitoring the memory ingestion pipeline.
 *   - The route is designed to be robust against malformed input by filtering out invalid points.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Batch Processing**: For very large numbers of points, consider implementing a queuing mechanism (e.g., Kafka, RabbitMQ) to handle upserts asynchronously and provide immediate API responses.
 *   - **Input Validation (Zod)**: Implement more rigorous input validation using Zod schemas for the request body to ensure data integrity and improve error messages.
 *   - **Qdrant Collection Management**: Implement a more sophisticated collection management strategy (e.g., dynamic collection creation with more flexible vector parameters, or schema validation at the Qdrant level).
 *   - **Rate Limiting**: Add rate limiting to protect the Qdrant instance from abuse or accidental overload, especially if exposed to external systems.
 *   - **Security**: Enhance authorization checks beyond just session authentication if specific user permissions are required for memory upsertion.
 *   - **Monitoring & Alerts**: Integrate with external monitoring systems (e.g., Prometheus, Grafana) to track upsert performance and alert on failures.
 *   - **Asynchronous Processing**: For large-scale upserts, consider implementing an asynchronous processing mechanism (e.g., a message queue) to handle point ingestion without blocking the API response, providing better scalability and responsiveness.
 *   - **Qdrant Collection Schema Optimization**: Explore defining more granular schemas or payload indexing for the Qdrant collection to enhance search performance and filtering capabilities based on metadata fields (e.g., `type`, `tags`).
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - The `logContext` pattern is consistently applied; ensure similar structured logging is used across all critical API routes.
 *   - The error handling logic could be further consolidated by leveraging the `handleApiError` utility from `app/lib/utils/errorHandler.ts`, similar to other API routes.
 */
import { NextRequest, NextResponse } from 'next/server';
import { QdrantClient } from '@qdrant/js-client-rest';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import logger from '@/lib/logger';
import { ScoredMemoryPoint } from '@/lib/types/memory';
import { handleApiError } from '@/lib/utils/errorHandler';

interface LogContextType {
  route: string;
  timestamp: string;
  collectionName?: string;
  pointsCount?: number;
  qdrantError?: string;
  qdrantErrorDetails?: unknown;
  error?: string;
  originalError?: unknown;
  [key: string]: unknown; // Add index signature directly within the interface
}

export async function POST(request: NextRequest) {
  const logContext: LogContextType = {
    route: '/api/orion/memory/upsert',
    timestamp: new Date().toISOString(),
  };
  logger.info('[MEMORY_UPSERT][START] Received request to upsert memory points.', logContext);

  try {
    const body = await request.json();
    const { points, collectionName = ORION_MEMORY_COLLECTION_NAME } = body as {
      points: ScoredMemoryPoint[];
      collectionName?: string;
    };

    logContext.collectionName = collectionName;
    logContext.pointsCount = points?.length || 0;

    if (!points || !Array.isArray(points) || points.length === 0) {
      logger.warn('[MEMORY_UPSERT][VALIDATION_FAIL] No memory points provided for upsert.', logContext);
      return NextResponse.json({ success: false, error: 'No memory points provided for upsert.' }, { status: 400 });
    }

    // Filter out points that do not have an embedding, as vectors are required for Qdrant upsert
    const pointsWithEmbeddings = points.filter((point) => {
      if (!point.vector || point.vector.length === 0) {
        logger.warn('[MEMORY_UPSERT][FILTERED_POINT] Skipping memory point due to missing or empty vector.', {
          ...logContext,
          pointId: point.id, // Log the ID of the skipped point if available
          pointTitle: point.payload?.title, // Attempt to log title from payload with optional chaining
        });
        return false;
      }
      return true;
    });

    if (pointsWithEmbeddings.length === 0) {
      logger.warn(
        '[MEMORY_UPSERT][VALIDATION_FAIL] All provided memory points were skipped due to missing embeddings.',
        logContext
      );
      return NextResponse.json(
        { success: false, error: 'No valid memory points with embeddings provided for upsert.' },
        { status: 400 }
      );
    }

    logger.debug('[MEMORY_UPSERT][INFO] Attempting to create Qdrant client instance.', logContext);
    const qdrantPort = process.env.QDRANT_PORT || 6333;
    const qdrantUrl = `http://${process.env.QDRANT_HOST}:${qdrantPort}`;

    const qdrantClient = new QdrantClient({
      url: qdrantUrl,
      apiKey: process.env.QDRANT_API_KEY,
      checkCompatibility: false,
    });

    // Ensure the collection exists
    try {
      const collections = await qdrantClient.getCollections();
      const collectionExists = collections.collections.some((c) => c.name === collectionName);

      if (!collectionExists) {
        logger.info(
          `[MEMORY_UPSERT][COLLECTION_CHECK] Collection '${collectionName}' does not exist. Creating...`,
          logContext
        );

        // Get vector dimension from the first point
        const vectorSize = (pointsWithEmbeddings[0]!.vector as number[]).length;

        await qdrantClient.createCollection(collectionName, {
          vectors: {
            size: vectorSize,
            distance: 'Cosine',
          },
        });

        logger.success(
          `[MEMORY_UPSERT][COLLECTION_CREATE] Collection '${collectionName}' created successfully.`,
          logContext
        );
      }
    } catch (collectionError: unknown) {
      logger.error(
        '[MEMORY_UPSERT][COLLECTION_ERROR] Error checking/creating collection. Continuing with upsert assuming it exists or operation will fail.',
        {
          ...logContext,
          collectionError: collectionError instanceof Error ? collectionError.message : String(collectionError),
          originalError: collectionError,
        }
      );
      // Continue anyway, as the collection might exist despite the error, or the upsert will fail later.
    }

    logger.debug('[MEMORY_UPSERT][INFO] Qdrant client created. Attempting to upsert points.', {
      ...logContext,
      pointsCount: pointsWithEmbeddings.length, // Log the count of points actually being upserted
      collection: collectionName,
    });

    // Convert ScoredMemoryPoint to Qdrant point format (payload, vector)
    const qdrantPoints = pointsWithEmbeddings.map((point) => ({
      id: point.id,
      payload: point.payload, // Use point.payload for payload
      vector: point.vector, // Use point.vector instead of point.embedding
    }));

    const result = await qdrantClient.upsert(collectionName, {
      wait: true,
      points: qdrantPoints,
    });

    if (result.status === 'completed' || result.status === 'acknowledged') {
      logger.success('[MEMORY_UPSERT][SUCCESS] Successfully upserted memory points.', {
        ...logContext,
        status: result.status,
        operationId: result.operation_id,
      });
      return NextResponse.json({ success: true, message: 'Memory points upserted successfully.' });
    } else {
      logger.error('[MEMORY_UPSERT][QDRANT_ERROR] Qdrant upsert operation failed.', {
        ...logContext,
        status: result.status,
        error: `Qdrant upsert returned unexpected status: ${result.status}`,
      });
      return NextResponse.json(
        { success: false, error: `Qdrant upsert failed with status: ${result.status}` },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const handledError = handleApiError(error, logContext);
    return NextResponse.json(
      {
        success: false,
        error: handledError.message,
        details: handledError.details,
      },
      { status: handledError.statusCode || 500 }
    );
  }
}
