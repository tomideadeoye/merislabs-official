import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { EmotionalLogEntry } from '@/types/orion';

export const dynamic = "force-dynamic";

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
    let query = `SELECT * FROM emotional_logs WHERE 1=1`;
    const params: any = {};

    if (startDate) {
      query += ` AND timestamp >= @startDate`;
      params.startDate = startDate;
    }

    if (endDate) {
      query += ` AND timestamp <= @endDate`;
      params.endDate = endDate;
    }

    if (emotion) {
      query += ` AND primaryEmotion = @emotion`;
      params.emotion = emotion;
    }

    if (hasDistortionAnalysis === 'true') {
      query += ` AND cognitiveDistortionAnalysis IS NOT NULL`;
    } else if (hasDistortionAnalysis === 'false') {
      query += ` AND cognitiveDistortionAnalysis IS NULL`;
    }

    // Add sorting and pagination
    query += ` ORDER BY timestamp DESC LIMIT @limit OFFSET @offset`;
    params.limit = limit;
    params.offset = offset;

    // Execute query
    const stmt = db.prepare(query);
    const rows = stmt.all(params);

    // Parse JSON fields
    const logs: EmotionalLogEntry[] = rows.map((row: any) => ({
      id: row.id,
      timestamp: row.timestamp,
      primaryEmotion: row.primaryEmotion,
      secondaryEmotions: JSON.parse(row.secondaryEmotions || '[]'),
      intensity: row.intensity,
      triggers: JSON.parse(row.triggers || '[]'),
      physicalSensations: JSON.parse(row.physicalSensations || '[]'),
      accompanyingThoughts: row.accompanyingThoughts,
      copingMechanismsUsed: JSON.parse(row.copingMechanismsUsed || '[]'),
      contextualNote: row.contextualNote,
      relatedJournalSourceId: row.relatedJournalSourceId,
      cognitiveDistortionAnalysis: row.cognitiveDistortionAnalysis ?
                                  JSON.parse(row.cognitiveDistortionAnalysis) :
                                  undefined
    }));

    return NextResponse.json({
      success: true,
      logs,
      total: db.prepare('SELECT COUNT(*) as count FROM emotional_logs').get().count
    });

  } catch (error: any) {
    console.error('Error in GET /api/orion/emotions/history:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}
