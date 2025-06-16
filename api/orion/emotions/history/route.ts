import logger from '@/lib/logger';
import { CognitiveDistortionAnalysisData, EmotionalLogEntry } from '@/lib/types';
import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export const dynamic = 'force-dynamic';

interface EmotionalLogRow {
  id: string;
  timestamp: string;
  primary_emotion: string;
  secondary_emotions: string[];
  intensity: number;
  triggers: string[];
  physical_sensations: string[];
  accompanying_thoughts: string;
  coping_mechanisms_used: string[];
  contextual_note: string;
  related_journal_source_id: string;
  cognitive_distortion_analysis: CognitiveDistortionAnalysisData;
}

export async function GET() {
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

    const logs: EmotionalLogEntry[] = result.rows.map((row: EmotionalLogRow) => ({
      id: row.id,
      timestamp: row.timestamp,
      emotion: row.primary_emotion,
      primaryEmotion: row.primary_emotion,
      intensity: row.intensity,
      context: row.contextual_note,
      accompanyingThoughts: row.accompanying_thoughts,
      contextualNote: row.contextual_note,
      cognitiveDistortionAnalysis: row.cognitive_distortion_analysis,
      secondaryEmotions: row.secondary_emotions,
      triggers: row.triggers,
      copingMechanismsUsed: row.coping_mechanisms_used,
      relatedJournalSourceId: row.related_journal_source_id,
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
