/**
 * GOAL: Save action reflections to Qdrant (primary) and Neon/Postgres (secondary for structured links).
 * Related: lib/database.ts, prd.md, lib/orion_config.ts
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@shared/auth';
import { ORION_MEMORY_COLLECTION_NAME } from '@shared/lib/orion_config';
import { v4 as uuidv4 } from 'uuid';
import { query, sql } from '@shared/lib/database';

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

    console.log(`[ACTION_REFLECTION_API][VERBOSE] Received POST request with body:`, JSON.stringify(body, null, 2));

    if (!habiticaTaskId || !reflectionText || !timestamp || !originalTaskText) {
      console.error(`[ACTION_REFLECTION_API][ERROR] Missing required fields: habiticaTaskId=${habiticaTaskId}, reflectionText=${reflectionText}, timestamp=${timestamp}, originalTaskText=${originalTaskText}`);
      return NextResponse.json({
        success: false,
        error: 'Missing required fields for action reflection.'
      }, { status: 400 });
    }

    const currentISOTime = new Date().toISOString();
    const internalApiUrlBase = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // 1. Generate Embeddings for the reflection text
    console.log(`[ACTION_REFLECTION_API][VERBOSE] Generating embeddings for reflectionText: "${reflectionText}"`);
    const embeddingResponse = await fetch(`${internalApiUrlBase}/api/orion/memory/generate-embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: [reflectionText] }),
    });

    const embeddingData = await embeddingResponse.json();
    console.log(`[ACTION_REFLECTION_API][VERBOSE] Embedding response:`, JSON.stringify(embeddingData, null, 2));

    if (!embeddingData.success || !embeddingData.embeddings || embeddingData.embeddings.length === 0) {
      console.error(`[ACTION_REFLECTION_API][ERROR] Failed to generate embeddings:`, embeddingData.error);
      throw new Error(embeddingData.error || 'Failed to generate embeddings for action reflection.');
    }

    const embeddingVector: number[] = embeddingData.embeddings[0];
    console.log(`[ACTION_REFLECTION_API][VERBOSE] Embedding vector generated:`, embeddingVector);

    // 2. Prepare memory point for the Action Reflection
    const reflectionSourceId = `action_reflection_${habiticaTaskId}_${timestamp.replace(/[:.]/g, '-')}`;
    console.log(`[ACTION_REFLECTION_API][VERBOSE] Generated reflectionSourceId: ${reflectionSourceId}`);

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

    console.log(`[ACTION_REFLECTION_API][VERBOSE] Memory payload:`, JSON.stringify(memoryPayload, null, 2));

    const memoryPoint = {
      id: uuidv4(),
      vector: embeddingVector,
      payload: memoryPayload,
    };

    console.log(`[ACTION_REFLECTION_API][VERBOSE] Memory point to upsert:`, JSON.stringify(memoryPoint, null, 2));

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
    console.log(`[ACTION_REFLECTION_API][VERBOSE] Upsert response:`, JSON.stringify(upsertData, null, 2));

    if (!upsertData.success) {
      console.error(`[ACTION_REFLECTION_API][ERROR] Failed to upsert memory:`, upsertData.error);
      throw new Error(upsertData.error || 'Failed to save action reflection to memory.');
    }

    // 4. Store the reflection link in Neon/Postgres
    try {
      console.log(`[ACTION_REFLECTION_API][VERBOSE] Inserting reflection link into Neon/Postgres for habiticaTaskId: ${habiticaTaskId}`);
      await query(
        `INSERT INTO habitica_task_links (
          id, habiticaTaskId, orionSourceModule, orionSourceReferenceId, orionTaskText, createdAt, reflectionId, reflectionText
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (habiticaTaskId) DO UPDATE SET
          reflectionId = EXCLUDED.reflectionId,
          reflectionText = EXCLUDED.reflectionText
        `,
        [
          uuidv4(),
          habiticaTaskId,
          orionSourceModule || 'unknown',
          orionSourceReferenceId || 'unknown',
          originalTaskText,
          currentISOTime,
          reflectionSourceId,
          reflectionText
        ]
      );
      console.log(`[ACTION_REFLECTION_API][VERBOSE] Reflection link saved to Neon/Postgres for task ID: ${habiticaTaskId}`);
    } catch (pgError: any) {
      console.error(`[ACTION_REFLECTION_API][ERROR] Failed to save reflection link to Neon/Postgres: ${pgError.message}`);
      // Continue even if database update fails, as we've already saved to memory
    }

    console.log(`[ACTION_REFLECTION_API][VERBOSE] Action reflection saved. Source ID: ${reflectionSourceId}`);

    return NextResponse.json({
      success: true,
      message: 'Action reflection saved successfully!',
      data: memoryPoint
    });

  } catch (error: any) {
    console.error('[ACTION_REFLECTION_API_ERROR][FATAL]', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to save action reflection.',
      details: error.message
    }, { status: 500 });
  }
}
