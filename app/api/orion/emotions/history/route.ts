/**
 * @fileoverview API route for retrieving historical emotional log entries.
 * @description This endpoint allows users to fetch a paginated and filterable history of their emotional logs
 *   from the database. It supports filtering by date range, primary emotion, and whether a log has
 *   associated cognitive distortion analysis. This is crucial for the Emotional Tracker feature,
 *   enabling users to review their emotional patterns over time.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide a secure API endpoint (`GET`) for fetching `EmotionalLogEntry` records.
 *   - To support query parameters for filtering (startDate, endDate, emotion, hasDistortionAnalysis).
 *   - To support pagination (limit, offset) for efficient data retrieval.
 *   - To deserialize JSON string fields (e.g., `secondaryEmotions`, `cognitiveDistortionAnalysis`) back into their native types.
 *   - To integrate with Prisma for database interactions (`prisma.emotionalLogs.findMany`, `count`).
 *
 * FILEPATH: `app/api/orion/emotions/history/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/lib/types/index.ts`: Defines `EmotionalLogEntry` and `CognitiveDistortionAnalysisData` for type consistency.
 *   - `@/generated/prisma`: Imports `PrismaClient` for direct database access.
 *   - `@/lib/logger.ts`: Used for logging API request details, filtering parameters, and response summaries.
 *   - `app/(orion_admin)/admin/emotional-tracker/page.tsx`: A frontend page that would consume this API to display emotional history.
 *   - `app/components/orion/emotional-tracker/EmotionalLogList.tsx` (hypothetical): A component that would render the fetched logs.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `timestamp` fields in the database are stored in a format compatible with date range queries.
 *   - Assumes `secondaryEmotions`, `triggers`, `copingMechanismsUsed`, and `cognitiveDistortionAnalysis` are stored as JSON strings in the database.
 *   - `dynamic = 'force-dynamic'` is set to prevent caching of dynamic data.
 *   - This route does not currently enforce authentication; this is a potential security improvement area.
 *
 * NOTES:
 *   - This API is a core data provider for the Emotional Tracker, enabling historical analysis of emotional states.
 *   - The mapping logic transforms raw Prisma results into the `EmotionalLogEntry` interface for consistency.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Authentication**: Implement authentication to ensure only authorized users can retrieve their emotional history.
 *   - **Input Validation**: Use Zod or similar for robust validation of query parameters (`limit`, `offset`, `startDate`, `endDate`, `emotion`).
 *   - **Unified Error Handling**: Integrate `handleApiError` from `app/lib/utils/errorHandler.ts` for consistent error responses and logging.
 *   - **More Filtering Options**: Add support for filtering by secondary emotions, tags, or specific context keywords.
 *   - **Performance Optimization**: For very large datasets, consider optimizing queries with database indexes on `timestamp` and `primaryEmotion`.
 *   - **Data Visualization Integration**: This data is ripe for visualization; consider an API that returns aggregated/summarized data for charts.
 */

import { NextRequest, NextResponse } from 'next/server';
import { EmotionalLogEntry, CognitiveDistortionAnalysisData } from '@/lib/types';
import { PrismaClient } from '@/generated/prisma';

export const dynamic = 'force-dynamic';

// interface EmotionalLogQueryParams {
//   startDate?: string;
//   endDate?: string;
//   emotion?: string;
//   limit: number;
//   offset: number;
// }

const prisma = new PrismaClient();

// Define a type for the selected fields from EmotionalLogs to fix 'any' implicit type
interface EmotionalLogPrismaSelect {
  id: string;
  timestamp: string;
  primaryEmotion: string;
  secondaryEmotions: string | null;
  intensity: number;
  triggers: string | null;
  physicalSensations: string | null;
  accompanyingThoughts: string;
  copingMechanismsUsed: string | null;
  contextualNote: string | null;
  relatedJournalSourceId: string | null;
  cognitiveDistortionAnalysis: string | null;
  emotion: string;
  context: string;
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

    type WhereClause = {
      timestamp?: { gte?: string; lte?: string };
      primaryEmotion?: string;
      cognitiveDistortionAnalysis?: { not: null } | null;
    };
    const whereClause: WhereClause = {};

    if (startDate) {
      whereClause.timestamp = { gte: startDate };
    }

    if (endDate) {
      whereClause.timestamp = { ...whereClause.timestamp, lte: endDate };
    }

    if (emotion) {
      whereClause.primaryEmotion = emotion;
    }

    if (hasDistortionAnalysis === 'true') {
      whereClause.cognitiveDistortionAnalysis = { not: null };
    }
    if (hasDistortionAnalysis === 'false') {
      whereClause.cognitiveDistortionAnalysis = null; // Matches null explicitly
    }

    const logs = await prisma.emotionalLogs.findMany({
      where: whereClause,
      select: {
        id: true,
        timestamp: true,
        primaryEmotion: true,
        secondaryEmotions: true,
        intensity: true,
        triggers: true,
        physicalSensations: true,
        accompanyingThoughts: true,
        copingMechanismsUsed: true,
        contextualNote: true,
        relatedJournalSourceId: true,
        cognitiveDistortionAnalysis: true,
        emotion: true,
        context: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const mappedLogs: EmotionalLogEntry[] = logs.map((log: EmotionalLogPrismaSelect) => ({
      id: log.id,
      timestamp: log.timestamp,
      emotion: log.emotion,
      primaryEmotion: log.primaryEmotion,
      intensity: Number(log.intensity), // Ensure intensity is a number
      context: log.contextualNote || log.context, // Use contextualNote primarily, fallback to context
      accompanyingThoughts: log.accompanyingThoughts,
      contextualNote: log.contextualNote,
      // Parse JSON string fields back to arrays/objects
      cognitiveDistortionAnalysis: log.cognitiveDistortionAnalysis
        ? (JSON.parse(log.cognitiveDistortionAnalysis) as CognitiveDistortionAnalysisData)
        : undefined,
      secondaryEmotions: log.secondaryEmotions ? (JSON.parse(log.secondaryEmotions) as string[]) : [],
      triggers: log.triggers ? (JSON.parse(log.triggers) as string[]) : undefined, // Match type
      copingMechanismsUsed: log.copingMechanismsUsed ? (JSON.parse(log.copingMechanismsUsed) as string[]) : [],
      relatedJournalSourceId: log.relatedJournalSourceId || null,
    }));

    // Get total count for pagination
    const total = await prisma.emotionalLogs.count({
      where: whereClause,
    });

    return NextResponse.json({
      success: true,
      logs: mappedLogs,
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
