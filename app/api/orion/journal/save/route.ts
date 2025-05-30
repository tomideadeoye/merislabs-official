import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import { checkAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Check authentication
  const authError = await checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      text,
      mood,
      tags = [],
      entryTimestamp,
    } = body;

    if (!text || typeof text !== 'string' || text.trim() === "") {
      return NextResponse.json({ success: false, error: 'Journal text cannot be empty.' }, { status: 400 });
    }

    const currentISOTime = new Date().toISOString();
    const journalEntryTimestamp = entryTimestamp || currentISOTime;

    // 1. Generate Embeddings for the journal text
    console.log(`[JOURNAL_SAVE_API] Requesting embedding for journal entry...`);
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
      console.error("[JOURNAL_SAVE_API] Failed to generate embeddings:", embeddingData.error);
      throw new Error(embeddingData.error || 'Failed to generate embeddings for journal entry.');
    }

    const embeddingVector = embeddingData.embeddings[0];
    console.log(`[JOURNAL_SAVE_API] Embeddings generated successfully.`);

    // 2. Prepare the MemoryPoint for Qdrant
    const sourceId = `journal_${journalEntryTimestamp.replace(/[:.]/g, '-')}_${uuidv4().substring(0, 8)}`;
    
    const memoryPayload = {
      text: text,
      source_id: sourceId,
      timestamp: journalEntryTimestamp,
      indexed_at: currentISOTime,
      type: "journal_entry",
      tags: ["journal", ...tags.map((t: string) => String(t).toLowerCase().trim()).filter(Boolean)],
      mood: mood,
    };

    const memoryPoint = {
      id: uuidv4(),
      vector: embeddingVector,
      payload: memoryPayload,
    };
    
    console.log(`[JOURNAL_SAVE_API] Preparing to upsert journal entry with ID: ${memoryPoint.id} and source_id: ${sourceId}`);

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
      console.error("[JOURNAL_SAVE_API] Failed to upsert journal entry to Qdrant:", upsertData.error);
      throw new Error(upsertData.error || 'Failed to save journal entry to memory.');
    }

    console.log(`[JOURNAL_SAVE_API] Journal entry successfully saved to memory. Source ID: ${sourceId}`);

    // 4. Generate LLM reflection on the journal entry
    try {
      const reflectionResponse = await fetch(`${request.nextUrl.origin}/api/orion/llm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': request.headers.get('Authorization') || ''
        },
        body: JSON.stringify({
          requestType: "JOURNAL_REFLECTION",
          primaryContext: `Analyze the following journal entry and provide thoughtful insights, patterns, and reflections. Be supportive, insightful, and help the user gain deeper understanding of their thoughts and feelings:\n\n${text}`,
          mood: mood || undefined,
          temperature: 0.7,
          maxTokens: 500
        })
      });

      const reflectionData = await reflectionResponse.json();
      
      if (reflectionData.success && reflectionData.content) {
        // Store the reflection in memory
        const reflectionSourceId = `reflection_${sourceId}`;
        const reflectionPayload = {
          text: reflectionData.content,
          source_id: reflectionSourceId,
          original_entry_id: sourceId,
          timestamp: currentISOTime,
          indexed_at: currentISOTime,
          type: "journal_reflection",
          tags: ["reflection", "journal_reflection", ...tags.map((t: string) => String(t).toLowerCase().trim()).filter(Boolean)],
        };

        // Generate embedding for the reflection
        const reflectionEmbeddingResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/generate-embeddings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': request.headers.get('Authorization') || ''
          },
          body: JSON.stringify({
            texts: [reflectionData.content]
          })
        });

        const reflectionEmbeddingData = await reflectionEmbeddingResponse.json();
        
        if (reflectionEmbeddingData.success && reflectionEmbeddingData.embeddings && reflectionEmbeddingData.embeddings.length > 0) {
          const reflectionPoint = {
            id: uuidv4(),
            vector: reflectionEmbeddingData.embeddings[0],
            payload: reflectionPayload,
          };

          // Upsert the reflection
          await fetch(`${request.nextUrl.origin}/api/orion/memory/upsert`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': request.headers.get('Authorization') || ''
            },
            body: JSON.stringify({
              points: [reflectionPoint],
              collectionName: ORION_MEMORY_COLLECTION_NAME
            })
          });

          console.log(`[JOURNAL_SAVE_API] Reflection saved to memory. Source ID: ${reflectionSourceId}`);
          
          // Return the journal entry ID and reflection
          return NextResponse.json({ 
            success: true, 
            message: 'Journal entry saved successfully!', 
            sourceId: sourceId,
            reflection: reflectionData.content
          });
        }
      }
    } catch (reflectionError) {
      console.error("[JOURNAL_SAVE_API] Error generating reflection:", reflectionError);
      // Continue without reflection if it fails
    }

    // Return success even if reflection failed
    return NextResponse.json({ 
      success: true, 
      message: 'Journal entry saved successfully!', 
      sourceId: sourceId 
    });

  } catch (error: any) {
    console.error('[JOURNAL_SAVE_API_ERROR]', error.message, error.stack);
    return NextResponse.json(
      { success: false, error: 'Failed to save journal entry.', details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}