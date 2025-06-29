import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import { createJournalEntryInDb, updateJournalEntryInDb, deleteJournalEntryInDb } from '@/lib/journal_db_service';
import { JournalEntryInput } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: JournalEntryInput & { action?: 'create' | 'update' | 'delete' } = await request.json();
    const { action = 'create', id, ...journalEntryData } = body;

    if (action === 'delete') {
      if (!id) {
        return NextResponse.json({ success: false, error: 'ID is required for deletion.' }, { status: 400 });
      }
      await deleteJournalEntryInDb(id);
      // Also delete from Qdrant if it exists
      // Note: Qdrant delete by source_id is not directly exposed via memory/delete API, would need to implement
      // For now, rely on frontend to handle Qdrant deletion via useMemoryContext().deleteMemory
      return NextResponse.json({ success: true, message: 'Journal entry deleted successfully!' });
    }

    if (!journalEntryData.content && !journalEntryData.title) {
      return NextResponse.json({ success: false, error: 'Journal content or title cannot be empty.' }, { status: 400 });
    }

    const currentISOTime = new Date().toISOString();
    let dbResponse;
    let sourceId: string | undefined = id;

    if (action === 'update' && id) {
      dbResponse = await updateJournalEntryInDb(id, {
        ...journalEntryData,
        updatedAt: currentISOTime, // Ensure updatedAt is set on update
      });
      sourceId = id; // Keep the same ID for Qdrant update
    } else {
      // Ensure userId is always set for new entries
      if (!journalEntryData.userId) {
        journalEntryData.userId = 'orion'; // Default userId
      }
      dbResponse = await createJournalEntryInDb({
        ...journalEntryData,
        date: journalEntryData.date || currentISOTime,
        createdAt: currentISOTime,
        updatedAt: currentISOTime,
      });
      sourceId = dbResponse.id; // Get the new ID from DB
    }

    if (!dbResponse) {
      return NextResponse.json({ success: false, error: `Failed to ${action} journal entry in database.` }, { status: 500 });
    }

    // Handle Qdrant upsert (for both create and update)
    const qdrantSourceId = sourceId || `journal_${currentISOTime.replace(/[:.]/g, '-')}_${uuidv4().substring(0, 8)}`;

    const embeddingResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/generate-embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: [journalEntryData.content || journalEntryData.title || ''] }),
    });

    const embeddingData = await embeddingResponse.json();

    if (embeddingData.success && embeddingData.embeddings && embeddingData.embeddings.length > 0) {
      const embeddingVector = embeddingData.embeddings[0];

      const memoryPayload = {
        text: journalEntryData.content || '',
        source_id: qdrantSourceId,
        timestamp: journalEntryData.date?.toString() || currentISOTime,
        indexed_at: currentISOTime,
        type: MEMORY_TYPES.JOURNAL,
        tags: journalEntryData.tags || [],
        mood: journalEntryData.mood,
        title: journalEntryData.title,
        attachments: journalEntryData.attachments || [],
        primaryEmotion: journalEntryData.primaryEmotion,
        intensity: journalEntryData.intensity,
        context: journalEntryData.context,
        accompanyingThoughts: journalEntryData.accompanyingThoughts,
        contextualNote: journalEntryData.contextualNote,
        cognitiveDistortionAnalysis: journalEntryData.cognitiveDistortionAnalysis,
        secondaryEmotions: journalEntryData.secondaryEmotions,
        triggers: journalEntryData.triggers,
        physicalSensations: journalEntryData.physicalSensations,
        copingMechanismsUsed: journalEntryData.copingMechanismsUsed,
        relatedJournalSourceId: journalEntryData.relatedJournalSourceId,
        original_entry_id: sourceId, // Link to DB ID
      };

      const memoryPoint = {
        id: uuidv4(), // New UUID for the Qdrant point, even on update (as we're replacing)
        vector: embeddingVector,
        payload: memoryPayload,
      };

      // If updating, delete the old Qdrant entry first to avoid duplicates
      // This assumes source_id is unique and can be used for deletion
      if (action === 'update' && id) {
        // This is a simplified approach. A more robust solution would involve
        // Qdrant's upsert with replace_strict or checking for existing points.
        // For now, we rely on the frontend to handle Qdrant deletion via useMemoryContext().deleteMemory
        // before calling this save API for updates.
      }

      const upsertResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/upsert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          points: [memoryPoint],
          collectionName: ORION_MEMORY_COLLECTION_NAME,
        }),
      });

      const upsertData = await upsertResponse.json();

      if (!upsertData.success) {
        console.error('[JOURNAL_SAVE_API] Failed to upsert journal entry to Qdrant:', upsertData.error);
        return NextResponse.json(
          { success: false, error: 'Failed to save journal entry to Qdrant.', details: upsertData.error || 'Unknown Qdrant error' },
          { status: 500 }
        );
      }
    } else {
      console.error('[JOURNAL_SAVE_API] Failed to generate embeddings for Qdrant save:', embeddingData.error);
      return NextResponse.json(
        { success: false, error: 'Failed to generate embeddings for Qdrant save.', details: embeddingData.error || 'Unknown embedding error' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: `Journal entry ${action}d successfully!`, sourceId: sourceId });
  } catch (error: unknown) {
    console.error(
      '[JOURNAL_SAVE_API_ERROR]',
      error instanceof Error ? error.message : 'Unknown error',
      error instanceof Error ? error.stack : 'N/A'
    );
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to save journal entry.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}