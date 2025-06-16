import { EmotionalLogEntry } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import { query } from 'src/lib/database';
import { logger } from 'src/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    logger.info('[EMOTIONS_HISTORY] Fetching emotional log history.');
    const result = await query(
      `SELECT
        id,
        timestamp,
        "primaryEmotion" as primary_emotion,
        "secondaryEmotions" as secondary_emotions,
        intensity,
        triggers,
        "physicalSensations" as physical_sensations,
        "accompanyingThoughts" as accompanying_thoughts,
        "copingMechanismsUsed" as coping_mechanisms_used,
        "contextualNote" as contextual_note,
        "relatedJournalSourceId" as related_journal_source_id,
        "cognitiveDistortionAnalysis" as cognitive_distortion_analysis
      FROM emotional_logs
      ORDER BY timestamp DESC
      LIMIT 100
      `
    );

    const logs: EmotionalLogEntry[] = result.rows.map((row: any) => ({
      id: row.id,
      timestamp: row.timestamp,
      emotion: row.primary_emotion || row.primaryEmotion,
      primaryEmotion: row.primary_emotion || row.primaryEmotion,
      intensity: row.intensity,
      context: row.contextual_note || row.contextualNote,
      accompanyingThoughts: row.accompanying_thoughts || row.accompanyingThoughts,
      contextualNote: row.contextual_note || row.contextualNote,
      cognitiveDistortionAnalysis: row.cognitive_distortion_analysis || row.cognitiveDistortionAnalysis,
      secondaryEmotions: row.secondary_emotions || row.secondaryEmotions,
      triggers: row.triggers,
      copingMechanismsUsed: row.coping_mechanisms_used || row.copingMechanismsUsed,
      relatedJournalSourceId: row.related_journal_source_id || row.relatedJournalSourceId,
    }));

    logger.info('[EMOTIONS_HISTORY] Successfully fetched history.', {
      count: logs.length,
    });
    return NextResponse.json({ success: true, history: logs });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    logger.error('[EMOTIONS_HISTORY] Error fetching history.', {
      error: errorMessage,
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
