/**
 * @fileoverview API route for logging user emotional states and cognitive distortion analysis.
 * @description This endpoint provides the functionality to receive emotional log entries from the frontend,
 *   validate essential fields, and persist this data securely to the PostgreSQL (Neon) database using Prisma.
 *   It plays a central role in the Emotional Tracker feature by enabling the recording of granular emotional data.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To serve as the API endpoint (`POST`) for saving new `EmotionalLogEntry` records.
 *   - To validate that each log entry contains either a primary emotion or a cognitive thought for context.
 *   - To serialize complex fields (arrays, objects) into JSON strings for database storage.
 *   - To ensure data integrity and type compatibility with the Prisma `EmotionalLogs` model.
 *
 * FILEPATH: `app/api/orion/emotions/log/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/emotional-tracker/page.tsx`: This frontend page sends emotional log data to this API.
 *   - `@/lib/types/index.ts`: Defines `EmotionalLogEntry` and `LogEmotionRequestBody` for strict type enforcement.
 *   - `@/generated/prisma`: Imports `PrismaClient` for ORM-based interaction with the `EmotionalLogs` table.
 *   - `prisma/schema.prisma`: Defines the `EmotionalLogs` database schema, which this route adheres to.
 *   - `lib/logger.ts`: Although currently using `console.error`, this file should integrate with `logger` for consistent, context-rich logging.
 *   - `uuid`: Used for generating unique identifiers for new emotional log entries.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that optional array/object fields will be `JSON.stringify`-ed before saving to database columns defined as `Json` or `String`.
 *   - `runtime = 'nodejs'` is specified, indicating this route runs in a Node.js environment.
 *   - This route currently uses `console.error`; it should be refactored to use the centralized `logger` for consistency.
 *
 * NOTES:
 *   - This API is fundamental for the Emotional Tracker, providing the write functionality to build a historical record of emotional states.
 *   - The data transformation logic ensures that complex JavaScript types are correctly stored in the database.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Authentication**: Implement robust authentication to ensure only authenticated users can log emotions.
 *   - **Unified Logging**: Replace `console.error` with `logger.error` for all logging within this file.
 *   - **Zod Validation**: Introduce Zod for comprehensive input validation of the `LogEmotionRequestBody`.
 *   - **Error Handling**: Integrate `handleApiError` from `app/lib/utils/errorHandler.ts` for standardized error responses.
 *   - **Data Enrichment**: Explore opportunities to enrich log entries (e.g., sentiment analysis on notes) before saving.
 *   - **Performance**: Optimize database write operations for high-volume logging, if applicable.
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
      accompanyingThoughts: String(
        body.accompanyingThoughts || body.cognitiveDistortionAnalysis?.automaticThought || ''
      ).trim(),
      copingMechanismsUsed: body.copingMechanismsUsed || [],
      contextualNote: String(body.contextualNote || '').trim(),
      relatedJournalSourceId: body.relatedJournalSourceId || null,
      cognitiveDistortionAnalysis: body.cognitiveDistortionAnalysis,
      emotion: body.primaryEmotion || 'N/A (Distortion Analysis)',
      context: String(body.contextualNote || '').trim(),
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
        accompanyingThoughts: String(newEntry.accompanyingThoughts).trim(),
        copingMechanismsUsed: newEntry.copingMechanismsUsed
          ? JSON.stringify(newEntry.copingMechanismsUsed)
          : JSON.stringify([]),
        contextualNote: newEntry.contextualNote,
        relatedJournalSourceId: newEntry.relatedJournalSourceId,
        cognitiveDistortionAnalysis: newEntry.cognitiveDistortionAnalysis
          ? JSON.stringify(newEntry.cognitiveDistortionAnalysis)
          : JSON.stringify({}),
        emotion: newEntry.primaryEmotion,
        context: String(newEntry.contextualNote).trim(),
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
