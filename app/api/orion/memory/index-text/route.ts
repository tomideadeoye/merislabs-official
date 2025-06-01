import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { ORION_MEMORY_COLLECTION_NAME, PYTHON_API_URL } from '@/lib/orion_config';

/**
 * API route for indexing text in memory
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, sourceId = uuidv4(), type, tags = [], additionalFields = {} } = body;
    
    if (!text) {
      return NextResponse.json({ 
        success: false, 
        error: 'Text is required' 
      }, { status: 400 });
    }
    
    if (!type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Type is required' 
      }, { status: 400 });
    }
    
    // 1. Generate embedding for the text
    const embedResponse = await fetch(`${PYTHON_API_URL}/api/memory/generate-embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        texts: [text]
      })
    });
    
    const embedData = await embedResponse.json();
    if (!embedData.success) {
      return NextResponse.json({ 
        success: false, 
        error: embedData.error || 'Failed to generate embedding' 
      }, { status: 500 });
    }
    
    // 2. Create memory point with embedding
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
    
    // 3. Store in memory system
    const upsertResponse = await fetch(`${PYTHON_API_URL}/api/memory/upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        points: [{
          id: sourceId,
          vector: embedData.embeddings[0],
          payload: memoryPoint
        }],
        collectionName: ORION_MEMORY_COLLECTION_NAME
      })
    });
    
    const upsertData = await upsertResponse.json();
    if (!upsertData.success) {
      return NextResponse.json({ 
        success: false, 
        error: upsertData.error || 'Failed to store memory' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      memoryId: sourceId
    });
  } catch (error: any) {
    console.error('Error indexing text:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}