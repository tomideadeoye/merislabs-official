import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import { db } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      text,
      sourceId,
      tags = [],
      metadata = {}
    } = body;

    if (!text || typeof text !== 'string' || text.trim() === "") {
      return NextResponse.json({ success: false, error: 'Text cannot be empty.' }, { status: 400 });
    }

    if (!sourceId || typeof sourceId !== 'string') {
      return NextResponse.json({ success: false, error: 'Source ID is required.' }, { status: 400 });
    }

    const currentISOTime = new Date().toISOString();
    
    // 1. Generate Embeddings for the text
    console.log(`[MEMORY_API] Requesting embedding for text...`);
    const embeddingResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/generate-embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || ''
      },
      body: JSON.stringify({
        texts: [text]
      })
    });

    const embeddingData = await embeddingResponse.json();
    
    if (!embeddingData.success || !embeddingData.embeddings || embeddingData.embeddings.length === 0) {
      console.error("[MEMORY_API] Failed to generate embeddings:", embeddingData.error);
      throw new Error(embeddingData.error || 'Failed to generate embeddings.');
    }

    const embeddingVector = embeddingData.embeddings[0];
    console.log(`[MEMORY_API] Embeddings generated successfully.`);

    // 2. Prepare the MemoryPoint for Qdrant
    const memoryPayload = {
      text: text,
      source_id: sourceId,
      timestamp: metadata.timestamp || currentISOTime,
      indexed_at: currentISOTime,
      type: metadata.type || "general",
      tags: [...tags.map((t: string) => String(t).toLowerCase().trim()).filter(Boolean)],
      ...metadata
    };

    const memoryPoint = {
      id: uuidv4(),
      vector: embeddingVector,
      payload: memoryPayload,
    };
    
    console.log(`[MEMORY_API] Preparing to upsert memory with ID: ${memoryPoint.id} and source_id: ${sourceId}`);

    // 3. Upsert the MemoryPoint into Qdrant
    const upsertResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || ''
      },
      body: JSON.stringify({
        points: [memoryPoint],
        collectionName: ORION_MEMORY_COLLECTION_NAME
      })
    });

    const upsertData = await upsertResponse.json();
    
    if (!upsertData.success) {
      console.error("[MEMORY_API] Failed to upsert memory to Qdrant:", upsertData.error);
      throw new Error(upsertData.error || 'Failed to save memory.');
    }

    console.log(`[MEMORY_API] Memory successfully saved. Source ID: ${sourceId}`);

    // 4. Also save to SQLite for structured access (if it's a specific type we want to track)
    if (['opportunity_evaluation', 'opportunity_reflection', 'lessons_learned', 'application_draft'].includes(metadata.type)) {
      try {
        db.prepare(`
          INSERT INTO memory_entries (
            id, source_id, text, type, timestamp, metadata
          ) VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          memoryPoint.id,
          sourceId,
          text,
          metadata.type,
          metadata.timestamp || currentISOTime,
          JSON.stringify(metadata)
        );
        
        console.log(`[MEMORY_API] Memory also saved to SQLite. ID: ${memoryPoint.id}`);
      } catch (sqliteError) {
        console.error("[MEMORY_API] SQLite save error (non-critical):", sqliteError);
        // Continue even if SQLite save fails - Qdrant is the primary store
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Memory saved successfully!', 
      memoryId: memoryPoint.id,
      sourceId: sourceId
    });

  } catch (error: any) {
    console.error('[MEMORY_API_ERROR]', error.message, error.stack);
    return NextResponse.json(
      { success: false, error: 'Failed to save memory.', details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}