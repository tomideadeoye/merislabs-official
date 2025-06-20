/**
 * FILEPATH: `app/api/orion/emotions/log/route.ts`
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides the API endpoint for logging user emotional states and cognitive distortion analysis.
 *   - Receives emotional log entries, validates required fields, and persists the data to the PostgreSQL (Neon) database via Prisma.
 *   - Ensures data integrity and type safety for emotional log entries.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/emotional-tracker/page.tsx`: This frontend page likely consumes this API to save emotional logs.
 *   - `@/lib/types`: Defines the `EmotionalLogEntry` and `LogEmotionRequestBody` interfaces used for data structures.
 *   - `@/generated/prisma`: Provides the `PrismaClient` for database interactions.
 *   - `prisma/schema.prisma`: Defines the `EmotionalLogs` model, which this API interacts with.
 *   - `lib/logger.ts`: Although direct `console.error` is currently used, future improvements should integrate the centralized logger here for consistent, context-rich logging.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `uuid` is correctly generating unique IDs for new entries.
 *   - Handles cases where `primaryEmotion` or `cognitiveDistortionAnalysis.automaticThought` might be missing.
 *   - Explicitly handles potential `undefined` values for string fields by providing empty string fallbacks before Prisma insertion, ensuring type compatibility.
 *
 * NOTES:
 *   - This API is a critical component of the Emotional Tracker feature, providing the backend for recording and analyzing user's emotional data over time.
 *   - Future enhancements could include more granular input validation and advanced error response structures.
 *   - Consider integrating the lib `logger` utility for all console output for unified logging and observability.
 */
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { EmotionalLogEntry, LogEmotionRequestBody } from '@/lib/types';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

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
      accompanyingThoughts: body.accompanyingThoughts || body.cognitiveDistortionAnalysis?.automaticThought || '', // accompanyingThoughts is string | undefined in type, but Prisma expects string | null
      copingMechanismsUsed: body.copingMechanismsUsed || [],
      contextualNote: body.contextualNote || '',
      relatedJournalSourceId: body.relatedJournalSourceId || null,
      cognitiveDistortionAnalysis: body.cognitiveDistortionAnalysis,
      emotion: body.primaryEmotion || 'N/A (Distortion Analysis)',
      context: body.contextualNote || '',
    };

    // Insert into Postgres using Prisma
    await prisma.emotionalLogs.create({
      data: {
        id: newEntry.id,
        timestamp: newEntry.timestamp,
        primaryEmotion: newEntry.primaryEmotion,
        secondaryEmotions: newEntry.secondaryEmotions ? JSON.stringify(newEntry.secondaryEmotions) : JSON.stringify([]),
        intensity: newEntry.intensity,
        triggers: newEntry.triggers ? JSON.stringify(newEntry.triggers) : JSON.stringify([]),
        physicalSensations: newEntry.physicalSensations
          ? JSON.stringify(newEntry.physicalSensations)
          : JSON.stringify([]),
        accompanyingThoughts: newEntry.accompanyingThoughts || '',
        copingMechanismsUsed: newEntry.copingMechanismsUsed
          ? JSON.stringify(newEntry.copingMechanismsUsed)
          : JSON.stringify([]),
        contextualNote: newEntry.contextualNote,
        relatedJournalSourceId: newEntry.relatedJournalSourceId,
        cognitiveDistortionAnalysis: newEntry.cognitiveDistortionAnalysis
          ? JSON.stringify(newEntry.cognitiveDistortionAnalysis)
          : null,
        emotion: newEntry.emotion,
        context: newEntry.context,
      },
    });

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
