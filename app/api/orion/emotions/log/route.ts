export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@repo/shared/lib/postgres';
import { v4 as uuidv4 } from 'uuid';
import { EmotionalLogEntry, LogEmotionRequestBody } from '@repo/shared/types/orion';

/**
 * API route for logging emotions (Postgres/Neon version)
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LogEmotionRequestBody;

    // Validate required fields - allow either emotion or automatic thought
    if (!body.primaryEmotion && !body.cognitiveDistortionAnalysis?.automaticThought) {
      return NextResponse.json(
        {
          success: false,
          error: 'Primary emotion or an automatic thought is required',
        },
        { status: 400 }
      );
    }

    // Create new emotional log entry
    const newEntry: EmotionalLogEntry = {
      id: uuidv4(),
      timestamp: body.entryTimestamp || new Date().toISOString(),
      primaryEmotion: body.primaryEmotion || 'N/A (Distortion Analysis)',
      secondaryEmotions: body.secondaryEmotions || [],
      intensity: body.intensity || 5,
      triggers: body.triggers || [],
      physicalSensations: body.physicalSensations || [],
      accompanyingThoughts: body.accompanyingThoughts || body.cognitiveDistortionAnalysis?.automaticThought || '',
      copingMechanismsUsed: body.copingMechanismsUsed || [],
      contextualNote: body.contextualNote || '',
      relatedJournalSourceId: body.relatedJournalSourceId || undefined,
      cognitiveDistortionAnalysis: body.cognitiveDistortionAnalysis,
      emotion: body.primaryEmotion || 'N/A (Distortion Analysis)',
      context: body.contextualNote || '',
    };

    // Insert into Postgres
    const insertQuery = `
      INSERT INTO emotional_logs (
        id, timestamp, "primaryEmotion", "secondaryEmotions", intensity, triggers,
        "physicalSensations", "accompanyingThoughts", "copingMechanismsUsed", "contextualNote",
        "relatedJournalSourceId", "cognitiveDistortionAnalysis", emotion, context
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14
      )
    `;

    await query(insertQuery, [
      newEntry.id,
      newEntry.timestamp,
      newEntry.primaryEmotion,
      JSON.stringify(newEntry.secondaryEmotions),
      newEntry.intensity,
      JSON.stringify(newEntry.triggers),
      JSON.stringify(newEntry.physicalSensations),
      newEntry.accompanyingThoughts,
      JSON.stringify(newEntry.copingMechanismsUsed),
      newEntry.contextualNote,
      newEntry.relatedJournalSourceId,
      newEntry.cognitiveDistortionAnalysis ? JSON.stringify(newEntry.cognitiveDistortionAnalysis) : null,
      newEntry.emotion,
      newEntry.context,
    ]);

    return NextResponse.json({
      success: true,
      message: 'Emotional log saved successfully',
      entry: newEntry,
    });
  } catch (error: unknown) {
    console.error('Error in POST /api/orion/emotions/log:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
