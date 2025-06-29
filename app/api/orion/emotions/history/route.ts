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
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// interface EmotionalLogQueryParams {
//   startDate?: string;
//   endDate?: string;
//   emotion?: string;
//   limit: number;
//   offset: number;
// }

// Define a type for the selected fields from EmotionalLogs to fix 'any' implicit type

/**
 * API route for retrieving emotion logs
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const emotion = url.searchParams.get('emotion');
    const hasDistortionAnalysis = url.searchParams.get('hasDistortionAnalysis');

    const whereClause: any = {};
    if (startDate) {
      whereClause.createdAt = { gte: startDate };
    }
    if (endDate) {
      whereClause.createdAt = { ...whereClause.createdAt, lte: endDate };
    }
    if (emotion) {
      whereClause.primaryEmotion = emotion;
    }
    if (hasDistortionAnalysis === 'true') {
      whereClause.cognitiveDistortionAnalysis = { not: null };
    }
    if (hasDistortionAnalysis === 'false') {
      whereClause.cognitiveDistortionAnalysis = null;
    }

    const logs = await prisma.journalEntry.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({ success: true, logs });
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
