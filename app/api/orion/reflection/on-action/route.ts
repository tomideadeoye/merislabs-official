import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/database';

interface ActionReflectionRequestBody {
  habiticaTaskId: string;
  orionSourceModule?: string;
  orionSourceReferenceId?: string;
  originalTaskText: string;
  reflectionText: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: ActionReflectionRequestBody = await request.json();
    const { 
      habiticaTaskId, 
      orionSourceModule, 
      orionSourceReferenceId,
      originalTaskText,
      reflectionText, 
      timestamp 
    } = body;

    if (!habiticaTaskId || !reflectionText || !timestamp || !originalTaskText) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields for action reflection.' 
      }, { status: 400 });
    }

    const currentISOTime = new Date().toISOString();
    const internalApiUrlBase = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // 1. Generate Embeddings for the reflection text
    const embeddingResponse = await fetch(`${internalApiUrlBase}/api/orion/memory/generate-embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: [reflectionText] }),
    });
    
    const embeddingData = await embeddingResponse.json();

    if (!embeddingData.success || !embeddingData.embeddings || embeddingData.embeddings.length === 0) {
      throw new Error(embeddingData.error || 'Failed to generate embeddings for action reflection.');
    }
    
    const embeddingVector: number[] = embeddingData.embeddings[0];

    // 2. Prepare memory point for the Action Reflection
    const reflectionSourceId = `action_reflection_${habiticaTaskId}_${timestamp.replace(/[:.]/g, '-')}`;
    
    const memoryPayload = {
      text: reflectionText,
      source_id: reflectionSourceId,
      timestamp: timestamp,
      indexed_at: currentISOTime,
      type: "action_reflection",
      tags: ["reflection", "action_review", "habitica_task", ...(orionSourceModule ? [orionSourceModule.toLowerCase()] : [])],
      related_habitica_task_id: habiticaTaskId,
      original_task_text: originalTaskText,
      related_orion_source_id: orionSourceReferenceId,
    };

    const memoryPoint = {
      id: uuidv4(),
      vector: embeddingVector,
      payload: memoryPayload,
    };

    // 3. Upsert the Action Reflection into memory
    const upsertResponse = await fetch(`${internalApiUrlBase}/api/orion/memory/upsert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        points: [memoryPoint],
        collectionName: ORION_MEMORY_COLLECTION_NAME,
      }),
    });
    
    const upsertData = await upsertResponse.json();

    if (!upsertData.success) {
      throw new Error(upsertData.error || 'Failed to save action reflection to memory.');
    }

    // 4. Store the reflection link in the database
    try {
      const linkStmt = db.prepare(`
        INSERT INTO habitica_task_links (
          id, habiticaTaskId, orionSourceModule, orionSourceReferenceId, orionTaskText, createdAt, reflectionId, reflectionText
        ) VALUES (
          @id, @habiticaTaskId, @orionSourceModule, @orionSourceReferenceId, @orionTaskText, @createdAt, @reflectionId, @reflectionText
        )
        ON CONFLICT(habiticaTaskId) DO UPDATE SET
          reflectionId = @reflectionId,
          reflectionText = @reflectionText
      `);
      
      linkStmt.run({
        id: uuidv4(),
        habiticaTaskId,
        orionSourceModule: orionSourceModule || 'unknown',
        orionSourceReferenceId: orionSourceReferenceId || 'unknown',
        orionTaskText: originalTaskText,
        createdAt: currentISOTime,
        reflectionId: reflectionSourceId,
        reflectionText: reflectionText
      });
      
      console.log(`[ACTION_REFLECTION_API] Reflection link saved to database for task ID: ${habiticaTaskId}`);
    } catch (dbError: any) {
      console.error(`[ACTION_REFLECTION_API] Failed to save reflection link to database: ${dbError.message}`);
      // Continue even if database update fails, as we've already saved to memory
    }

    console.log(`[ACTION_REFLECTION_API] Action reflection saved. Source ID: ${reflectionSourceId}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Action reflection saved successfully!', 
      data: memoryPoint 
    });

  } catch (error: any) {
    console.error('[ACTION_REFLECTION_API_ERROR]', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save action reflection.', 
      details: error.message 
    }, { status: 500 });
  }
}