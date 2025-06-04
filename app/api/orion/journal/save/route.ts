import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth';
import { createJournalEntryInNotion } from '@/lib/notion_service'; // Import the Notion save function
import type { JournalEntryNotionInput } from '@/types/orion'; // Import the type
import { JOURNAL_REFLECTION_REQUEST_TYPE } from '@/lib/orion_config';

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      text,
      mood,
      tags = [],
      entryTimestamp,
      saveToNotion = true, // Default to true if not provided
      saveToQdrant = true, // Default to true if not provided
      // saveToSQLite, // Not handled in backend API yet
    } = body;

    if (!text || typeof text !== 'string' || text.trim() === "") {
      return NextResponse.json({ success: false, error: 'Journal text cannot be empty.' }, { status: 400 });
    }

    const currentISOTime = new Date().toISOString();
    const journalEntryTimestamp = entryTimestamp || currentISOTime;

    let notionSaved = false;
    let qdrantSaved = false;
    let reflectionContent: string | undefined = undefined;
    let sourceId: string | undefined = undefined; // Will be Notion ID if saved to Notion

    // 1. Save the journal entry to Notion (if requested)
    if (saveToNotion) {
      console.log(`[JOURNAL_SAVE_API] Attempting to save journal entry to Notion...`);
      const journalEntryData = {
        title: text.substring(0, 100) + (text.length > 100 ? '...' : ''), // Use first 100 chars as title
        date:
          typeof journalEntryTimestamp === 'string'
            ? journalEntryTimestamp
            : (
                journalEntryTimestamp &&
                typeof journalEntryTimestamp === 'object' &&
                typeof (journalEntryTimestamp as { toISOString?: unknown }).toISOString === 'function'
              )
              ? (journalEntryTimestamp as { toISOString: () => string }).toISOString()
              : String(journalEntryTimestamp),
        content: text,
        mood: mood,
        tags: tags,
      };

      const notionResponse = await createJournalEntryInNotion(journalEntryData);

      if (notionResponse) {
        notionSaved = true;
        sourceId = notionResponse.entry?.notionPageId; // Get the Notion page ID from the response
        console.log(`[JOURNAL_SAVE_API] Journal entry successfully saved to Notion. Page ID: ${sourceId}`);
      } else {
        console.error("[JOURNAL_SAVE_API] Failed to save journal entry to Notion.");
        // If Notion save fails and it was requested, return an error.
        return NextResponse.json({ success: false, error: 'Failed to save journal entry to Notion.' }, { status: 500 });
      }
    } else {
      console.log(`[JOURNAL_SAVE_API] Skipping Notion save as not requested.`);
    }

    // Determine sourceId for Qdrant - use Notion ID if saved, otherwise generate new UUID
    const qdrantSourceId = sourceId || `journal_${journalEntryTimestamp.replace(/[:.]/g, '-')}_${uuidv4().substring(0, 8)}`;

    // 2. Save the journal entry to Qdrant (if requested)
    if (saveToQdrant) {
      console.log(`[JOURNAL_SAVE_API] Attempting to save journal entry to Qdrant...`);
      // Generate Embeddings for the journal text
      const embeddingResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/generate-embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': request.headers.get('Authorization') || ''
        },
        body: JSON.stringify({
          texts: [text] // Use the original text for embedding
        })
      });

      const embeddingData = await embeddingResponse.json();

      if (embeddingData.success && embeddingData.embeddings && embeddingData.embeddings.length > 0) {
        const embeddingVector = embeddingData.embeddings[0];
        console.log(`[JOURNAL_SAVE_API] Embeddings generated successfully.`);

        // Prepare the MemoryPoint for Qdrant
        const memoryPayload = {
          text: text, // Save original text or a summary if preferred
          source_id: qdrantSourceId, // Use the determined source ID (Notion ID or UUID)
          timestamp: journalEntryTimestamp,
          indexed_at: currentISOTime,
          type: "journal_entry",
          tags: ["journal", ...tags.map((t: string) => String(t).toLowerCase().trim()).filter(Boolean)],
          mood: mood,
          original_entry_id: sourceId, // Link back to the Notion page ID if available
        };

        const memoryPoint = {
          id: uuidv4(),
          vector: embeddingVector,
          payload: memoryPayload,
        };

        console.log(`[JOURNAL_SAVE_API] Preparing to upsert journal entry to Qdrant with ID: ${memoryPoint.id} and source_id: ${qdrantSourceId}`);

        // Upsert the MemoryPoint into Qdrant
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

        if (upsertData.success) {
          qdrantSaved = true;
          console.log(`[JOURNAL_SAVE_API] Journal entry successfully saved to Qdrant.`);
        } else {
          console.error("[JOURNAL_SAVE_API] Failed to upsert journal entry to Qdrant:", upsertData.error);
          // Log warning, but don't return error if Notion save was successful
          if (!notionSaved) { // Only return error if Qdrant save failed and Notion was not saved/requested
            return NextResponse.json({ success: false, error: 'Failed to save journal entry to Qdrant.', details: upsertData.error || "Unknown Qdrant error" }, { status: 500 });
          }
        }
      } else {
        console.error("[JOURNAL_SAVE_API] Failed to generate embeddings for Qdrant save:", embeddingData.error);
        // Log warning, but don't return error if Notion save was successful
        if (!notionSaved) { // Only return error if embedding failed and Notion was not saved/requested
          return NextResponse.json({ success: false, error: 'Failed to generate embeddings for Qdrant save.', details: embeddingData.error || "Unknown embedding error" }, { status: 500 });
        }
      }
    } else {
      console.log(`[JOURNAL_SAVE_API] Skipping Qdrant save as not requested.`);
    }

    // 3. Generate LLM reflection on the journal entry (if Notion or Qdrant save was successful, or maybe always?)
    // Let's generate reflection if at least one primary storage (Notion/Qdrant) was requested.
    if (saveToNotion || saveToQdrant) {
      try {
        const reflectionResponse = await fetch(`${request.nextUrl.origin}/api/orion/llm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': request.headers.get('Authorization') || ''
          },
          body: JSON.stringify({
            requestType: JOURNAL_REFLECTION_REQUEST_TYPE, // Use constant
            primaryContext: text, // Pass the journal text as primary context
            mood: mood || undefined,
            temperature: 0.7,
            maxTokens: 500,
            // Potentially add system_prompt_override here if needed
          })
        });

        const reflectionData = await reflectionResponse.json();

        if (reflectionData.success && reflectionData.content) {
          reflectionContent = reflectionData.content;
          console.log("[JOURNAL_SAVE_API] LLM Reflection generated successfully.");

          // Store the reflection in memory ONLY IF Qdrant save of original entry was successful
          if (qdrantSaved && sourceId) { // Need a valid sourceId (Notion ID) to link reflection
            const reflectionSourceId = `reflection_${sourceId}`;
            const reflectionPayload = {
              text: reflectionContent,
              source_id: reflectionSourceId,
              original_entry_id: sourceId, // Link back to the Notion page ID
              timestamp: currentISOTime, // Use current time for reflection timestamp
              indexed_at: currentISOTime,
              type: "journal_reflection",
              tags: ["reflection", "journal_reflection", ...tags.map((t: string) => String(t).toLowerCase().trim()).filter(Boolean)],
              // mood? // Should reflection inherit mood? For now, no.
            };

            // Generate embedding for the reflection
            const reflectionEmbeddingResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/generate-embeddings`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': request.headers.get('Authorization') || ''
              },
              body: JSON.stringify({
                texts: [reflectionContent]
              })
            });

            const reflectionEmbeddingData = await reflectionEmbeddingResponse.json();

            if (reflectionEmbeddingData.success && reflectionEmbeddingData.embeddings && reflectionEmbeddingData.embeddings.length > 0) {
              const reflectionPoint = {
                id: uuidv4(), // New UUID for the reflection Qdrant entry
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
        }
      } catch (reflectionError) {
        console.error("[JOURNAL_SAVE_API] Error generating reflection:", reflectionError);
        // Continue without reflection if it fails
      }
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
