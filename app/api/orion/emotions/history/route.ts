import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { EmotionalLogEntry, CognitiveDistortionAnalysisData } from '@/lib/types';

export const dynamic = 'force-dynamic';

// interface EmotionalLogQueryParams {
//   startDate?: string;
//   endDate?: string;
//   emotion?: string;
//   limit: number;
//   offset: number;
// }

interface RawEmotionalLogEntry {
  id: string;
  timestamp: string;
  primary_emotion: string;
  primaryEmotion: string;
  intensity: number;
  contextual_note: string;
  contextualNote: string;
  accompanying_thoughts?: string;
  accompanyingThoughts?: string;
  cognitive_distortion_analysis?: CognitiveDistortionAnalysisData;
  cognitiveDistortionAnalysis?: CognitiveDistortionAnalysisData;
  secondary_emotions?: string[];
  secondaryEmotions?: string[];
  triggers?: string[];
  coping_mechanisms_used?: string[];
  copingMechanismsUsed?: string[];
  related_journal_source_id?: string;
  relatedJournalSourceId?: string;
}

/**
 * API route for retrieving emotion logs
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const emotion = url.searchParams.get('emotion');
    const hasDistortionAnalysis = url.searchParams.get('hasDistortionAnalysis');

    // Build query with filters
    let queryStr = `SELECT * FROM emotional_logs WHERE 1=1`;
    const params: Record<string, string | number | undefined> = {};

    if (startDate) {
      queryStr += ` AND timestamp >= @startDate`;
      params.startDate = startDate;
    }

    if (endDate) {
      queryStr += ` AND timestamp <= @endDate`;
      params.endDate = endDate;
    }

    if (emotion) {
      queryStr += ` AND primaryEmotion = @emotion`;
      params.emotion = emotion;
    }

    if (hasDistortionAnalysis === 'true') {
      queryStr += ` AND cognitiveDistortionAnalysis IS NOT NULL`;
    }
    if (hasDistortionAnalysis === 'false') {
      queryStr += ` AND cognitiveDistortionAnalysis IS NULL`;
    }

    // Add sorting and pagination
    queryStr += ` ORDER BY timestamp DESC LIMIT @limit OFFSET @offset`;
    params.limit = limit;
    params.offset = offset;

    // Execute query using Postgres
    // Convert SQLite named parameters (@param) to Postgres ($1, $2, ...)
    const paramKeys = Object.keys(params);
    const values = paramKeys.map((k) => params[k]);
    let pgQuery = queryStr;
    paramKeys.forEach((k, i) => {
      pgQuery = pgQuery.replaceAll(`@${k}`, `$${i + 1}`);
    });

    const { rows } = await query(pgQuery, values);

    // Parse JSON fields
    const logs: EmotionalLogEntry[] = rows.map((row: RawEmotionalLogEntry) => ({
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

    // Get total count for pagination
    const countResult = await query(`SELECT COUNT(*) as count FROM emotional_logs`);
    const total = parseInt(countResult.rows[0]?.count || '0', 10);

    return NextResponse.json({
      success: true,
      logs,
      total,
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/orion/emotions/history:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
