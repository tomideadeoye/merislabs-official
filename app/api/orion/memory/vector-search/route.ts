import { NextRequest, NextResponse } from 'next/server';
import { QdrantClient } from '@qdrant/js-client-rest';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';

// Initialize Qdrant client
const qdrantClient = new QdrantClient({ 
  url: process.env.QDRANT_URL || 'http://localhost:6333'
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vector,
      collectionName = ORION_MEMORY_COLLECTION_NAME,
      limit = 5,
      filter = {},
      withPayload = true,
      withVector = false,
      scoreThreshold = 0.7
    } = body;

    if (!vector || !Array.isArray(vector)) {
      return NextResponse.json({ success: false, error: 'Vector is required and must be an array.' }, { status: 400 });
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
      score_threshold: scoreThreshold
    });

    console.log(`[VECTOR_SEARCH_API] Search successful. Found ${searchResults.length} results.`);

    return NextResponse.json({ 
      success: true, 
      results: searchResults,
      count: searchResults.length
    });

  } catch (error: any) {
    console.error('[VECTOR_SEARCH_API_ERROR]', error.message, error.stack);
    return NextResponse.json(
      { success: false, error: 'Failed to search vectors.', details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}