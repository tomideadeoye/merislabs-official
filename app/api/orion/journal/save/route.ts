import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import { createJournalEntryInDb } from '@/lib/journal_db_service'; // Use the DB-backed save function
import { JOURNAL_REFLECTION_REQUEST_TYPE } from '@/lib/orion_config';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      text,
      mood,
      tags = [],
      entryTimestamp,
      saveToQdrant = true, // Default to true if not provided
    } = body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json({ success: false, error: 'Journal text cannot be empty.' }, { status: 400 });
    }

    const currentISOTime = new Date().toISOString();
    const journalEntryTimestamp = entryTimestamp || currentISOTime;

    let qdrantSaved = false;
    let reflectionContent: string | undefined = undefined;
    let sourceId: string | undefined = undefined;

    // 1. Save the journal entry to the database
    const journalEntryData = {
      userId: 'orion', // Static userId for now
      date: new Date(journalEntryTimestamp),
      content: text,
    };

    const dbResponse = await createJournalEntryInDb(journalEntryData);

    if (dbResponse) {
      sourceId = dbResponse.id;
      console.log(`[JOURNAL_SAVE_API] Journal entry successfully saved to database. Entry ID: ${sourceId}`);
    } else {
      console.error('[JOURNAL_SAVE_API] Failed to save journal entry to database.');
      return NextResponse.json({ success: false, error: 'Failed to save journal entry to database.' }, { status: 500 });
    }

    // Determine sourceId for Qdrant - use DB ID if saved, otherwise generate new UUID
    const qdrantSourceId =
      sourceId || `journal_${journalEntryTimestamp.replace(/[:.]/g, '-')}_${uuidv4().substring(0, 8)}`;

    // 2. Save the journal entry to Qdrant (if requested)
    if (saveToQdrant) {
      console.log(`[JOURNAL_SAVE_API] Attempting to save journal entry to Qdrant...`);
      // Generate Embeddings for the journal text
      const embeddingResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/generate-embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts: [text],
        }),
      });

      const embeddingData = await embeddingResponse.json();

      if (embeddingData.success && embeddingData.embeddings && embeddingData.embeddings.length > 0) {
        const embeddingVector = embeddingData.embeddings[0];
        console.log(`[JOURNAL_SAVE_API] Embeddings generated successfully.`);

        // Prepare the MemoryPoint for Qdrant
        const memoryPayload = {
          text: text,
          source_id: qdrantSourceId,
          timestamp: journalEntryTimestamp,
          indexed_at: currentISOTime,
          type: 'journal_entry',
          tags: ['journal', ...tags.map((t: string) => String(t).toLowerCase().trim()).filter(Boolean)],
          mood: mood,
          original_entry_id: sourceId,
        };

        const memoryPoint = {
          id: uuidv4(),
          vector: embeddingVector,
          payload: memoryPayload,
        };

        console.log(
          `[JOURNAL_SAVE_API] Preparing to upsert journal entry to Qdrant with ID: ${memoryPoint.id} and source_id: ${qdrantSourceId}`
        );

        // Upsert the MemoryPoint into Qdrant
        const upsertResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/upsert`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            points: [memoryPoint],
            collectionName: ORION_MEMORY_COLLECTION_NAME,
          }),
        });

        const upsertData = await upsertResponse.json();

        if (upsertData.success) {
          qdrantSaved = true;
          console.log(`[JOURNAL_SAVE_API] Journal entry successfully saved to Qdrant.`);
        } else {
          console.error('[JOURNAL_SAVE_API] Failed to upsert journal entry to Qdrant:', upsertData.error);
          return NextResponse.json(
            {
              success: false,
              error: 'Failed to save journal entry to Qdrant.',
              details: upsertData.error || 'Unknown Qdrant error',
            },
            { status: 500 }
          );
        }
      } else {
        console.error('[JOURNAL_SAVE_API] Failed to generate embeddings for Qdrant save:', embeddingData.error);
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to generate embeddings for Qdrant save.',
            details: embeddingData.error || 'Unknown embedding error',
          },
          { status: 500 }
        );
      }
    } else {
      console.log(`[JOURNAL_SAVE_API] Skipping Qdrant save as not requested.`);
    }

    // 3. Generate LLM reflection on the journal entry (if Qdrant save was successful)
    if (qdrantSaved) {
      try {
        const reflectionResponse = await fetch(`${request.nextUrl.origin}/api/orion/llm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requestType: JOURNAL_REFLECTION_REQUEST_TYPE,
            primaryContext: text,
            mood: mood || undefined,
            temperature: 0.7,
            maxTokens: 500,
          }),
        });

        const reflectionData = await reflectionResponse.json();

        if (reflectionData.success && reflectionData.content) {
          reflectionContent = reflectionData.content;
          console.log('[JOURNAL_SAVE_API] LLM Reflection generated successfully.');

          // Store the reflection in memory ONLY IF Qdrant save of original entry was successful
          if (sourceId) {
            const reflectionSourceId = `reflection_${sourceId}`;
            const reflectionPayload = {
              text: reflectionContent,
              source_id: reflectionSourceId,
              original_entry_id: sourceId,
              timestamp: currentISOTime,
              indexed_at: currentISOTime,
              type: 'journal_reflection',
              tags: [
                'reflection',
                'journal_reflection',
                ...tags.map((t: string) => String(t).toLowerCase().trim()).filter(Boolean),
              ],
            };

            // Generate embedding for the reflection
            const reflectionEmbeddingResponse = await fetch(
              `${request.nextUrl.origin}/api/orion/memory/generate-embeddings`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  texts: [reflectionContent],
                }),
              }
            );

            const reflectionEmbeddingData = await reflectionEmbeddingResponse.json();

            if (
              reflectionEmbeddingData.success &&
              reflectionEmbeddingData.embeddings &&
              reflectionEmbeddingData.embeddings.length > 0
            ) {
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
                },
                body: JSON.stringify({
                  points: [reflectionPoint],
                  collectionName: ORION_MEMORY_COLLECTION_NAME,
                }),
              });

              console.log(`[JOURNAL_SAVE_API] Reflection saved to memory. Source ID: ${reflectionSourceId}`);

              // Return the journal entry ID and reflection
              return NextResponse.json({
                success: true,
                message: 'Journal entry saved successfully!',
                sourceId: sourceId,
                reflection: reflectionData.content,
              });
            }
          }
        }
      } catch (reflectionError) {
        console.error('[JOURNAL_SAVE_API] Error generating reflection:', reflectionError);
        // Continue without reflection if it fails
      }
    }

    // Return success even if reflection failed
    return NextResponse.json({
      success: true,
      message: 'Journal entry saved successfully!',
      sourceId: sourceId,
    });
  } catch (error: unknown) {
    console.error(
      '[JOURNAL_SAVE_API_ERROR]',
      error instanceof Error ? error.message : 'Unknown error',
      error instanceof Error ? error.stack : 'N/A'
    );
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save journal entry.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
