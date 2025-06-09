import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { ORION_MEMORY_COLLECTION_NAME, QDRANT_URL } from '@shared/lib/orion_config';
import { QdrantClient } from '@qdrant/js-client-rest';

/**
 * @api {post} /api/orion/memory/index-text Index text in memory
 * @apiName IndexText
 * @apiGroup Memory
 * @apiDescription Indexes a text string into Qdrant memory with OpenAI embedding.
 *
 * @apiParam {string} text The text to index (required)
 * @apiParam {string} [sourceId] Optional source ID (default: uuid)
 * @apiParam {string} type The type of memory (required)
 * @apiParam {string[]} [tags] Optional tags
 * @apiParam {object} [additionalFields] Optional additional fields
 *
 * @apiSuccess {boolean} success
 * @apiSuccess {string} memoryId
 * @apiError {string} error
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, sourceId = uuidv4(), type, tags = [], additionalFields = {} } = body;

    if (!text) {
      console.error('[INDEX_TEXT_API] Text is required');
      return NextResponse.json({ success: false, error: 'Text is required' }, { status: 400 });
    }
    if (!type) {
      console.error('[INDEX_TEXT_API] Type is required');
      return NextResponse.json({ success: false, error: 'Type is required' }, { status: 400 });
    }

    // 1. Generate embedding using local HuggingFace endpoint
    const embedResponse = await fetch('/api/orion/memory/generate-embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: [text] })
    });
    const embedData = await embedResponse.json();
    if (!embedData.success || !embedData.embeddings || !embedData.embeddings[0]) {
      console.error('[INDEX_TEXT_API] Embedding failed:', embedData);
      return NextResponse.json({
        success: false,
        error: embedData.error || 'Failed to generate embedding'
      }, { status: 500 });
    }
    const embedding = embedData.embeddings[0];
    if (embedding.length !== 384) {
      console.warn(`[INDEX_TEXT_API] Embedding vector size is ${embedding.length}, expected 384.`);
    }

    // 2. Create memory point
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

    // 3. Upsert to Qdrant
    const qdrantClient = new QdrantClient({ url: QDRANT_URL || 'http://localhost:6333' });
    const upsertResult = await qdrantClient.upsert(ORION_MEMORY_COLLECTION_NAME, {
      points: [{
        id: sourceId,
        vector: embedding,
        payload: memoryPoint
      }]
    });
    if (upsertResult.status !== 'completed' && upsertResult.status !== 'acknowledged') {
      console.error('[INDEX_TEXT_API] Qdrant upsert failed:', upsertResult);
      return NextResponse.json({
        success: false,
        error: 'Failed to upsert memory point'
      }, { status: 500 });
    }
    console.info(`[INDEX_TEXT_API] Memory point indexed successfully: ${sourceId}`);
    return NextResponse.json({ success: true, id: sourceId });
  } catch (error) {
    let errorMsg = 'Unexpected error';
    if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
      errorMsg = (error as any).message;
    }
    console.error('[INDEX_TEXT_API] Unexpected error:', error);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
