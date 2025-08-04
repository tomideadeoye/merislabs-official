/**
 * @fileoverview Implements dynamic, fallback-based semantic memory search for Orion using Qdrant.
 * @description This API route performs a semantic search over the memory collection, dynamically lowering the minScore threshold if too few results are found, to maximize relevant recall. It logs every step for traceability and debugging.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provide robust, user-friendly memory search with automatic fallback for sparse queries.
 *   - Log all search attempts, thresholds, and results for rapid debugging and improvement.
 *   - Directly supports Orion's memory management and recall features.
 *
 * FILEPATH: app/api/orion/memory/search/route.ts
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - Consumes embedding generation from the Python backend (see generate-embeddings/route.ts).
 *   - Uses Qdrant config from app/lib/orion_config.ts.
 *   - Used by the Memory Manager UI and other memory search consumers.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes Qdrant is running and accessible at configured host/port.
 *   - Assumes embedding model and vector size match those used for indexing.
 *   - Logs are essential for all search attempts and fallback logic.
 *
 * NOTES:
 *   - [PERFORMANCE OPTIMIZATIONS]: Could cache embedding results for repeated queries.
 *   - [ERROR HANDLING ROBUSTNESS]: All errors are logged and returned with context.
 *   - [OPPORTUNITIES FOR IMPROVEMENT]: Expose fallback logic as a tunable parameter; add user feedback loop for relevance.
 */
import { NextRequest, NextResponse } from 'next/server';
import { ORION_MEMORY_COLLECTION_NAME, QDRANT_HOST, QDRANT_PORT } from '@/lib/orion_config';
import { QdrantFilter, ScoredMemoryPoint } from '@/lib/types/memory';



// import { SearchDataResponse } from '@/lib/types';

export async function POST(req: NextRequest) {
  const sessionId = req.headers.get('x-session-id') || 'unknown-session';
  const userId = req.headers.get('x-user-id') || 'unknown-user';
  const logContext = `[MemorySearch][session:${sessionId}][user:${userId}]`;
  try {
    const body = await req.json();
    const query = body.query;
    const limit = body.limit || 5;
    const thresholds = [0.7, 0.3, 0.1, 0.0];
    let results = [];
    let minScoreUsed = null;
    let lastError = null;
    for (const minScore of thresholds) {
      console.info(`${logContext} Attempting search with minScore=${minScore}, query='${query}', limit=${limit}`);
      const embeddingRes = await fetch(`${process.env.PYTHON_API_URL || 'http://localhost:8000'}/api/v1/embeddings/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: [query] })
      });
      if (!embeddingRes.ok) {
        lastError = `Embedding API error: ${embeddingRes.status}`;
        console.error(`${logContext} Embedding API error: ${embeddingRes.status}`);
        continue;
      }
      const embeddingData = await embeddingRes.json();
      const embedding = embeddingData.embeddings[0];
      const qdrantRes = await fetch(`http://${QDRANT_HOST}:${QDRANT_PORT}/collections/${ORION_MEMORY_COLLECTION_NAME}/points/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vector: embedding,
          limit,
          score_threshold: minScore,
          with_payload: true,
          with_vector: false
        })
      });
      if (!qdrantRes.ok) {
        lastError = `Qdrant API error: ${qdrantRes.status}`;
        console.error(`${logContext} Qdrant API error: ${qdrantRes.status}`);
        continue;
      }
      const qdrantData = await qdrantRes.json();
      results = (qdrantData.result || []).map((item: { id: string; score: number; vector: number[]; payload?: Record<string, any> }) => ({
        id: item.id,
        score: item.score,
        content: item.payload?.text || '',
        vector: item.vector || [],
        payload: item.payload || {},
      }));
      console.info(`${logContext} minScore=${minScore} yielded ${results.length} results.`);
      if (results.length > 0) {
        minScoreUsed = minScore;
        break;
      }
    }
    if (results.length === 0) {
      console.warn(`${logContext} No results found for query='${query}' after all thresholds. Last error: ${lastError}`);
    } else {
      console.info(`${logContext} Returning ${results.length} results for query='${query}' at minScore=${minScoreUsed}`);
    }
    return NextResponse.json({ success: true, results, query, minScoreUsed });
  } catch (error) {
    console.error(`${logContext} Memory search error:`, error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
