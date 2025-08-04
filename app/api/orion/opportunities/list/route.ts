import { NextResponse } from 'next/server';
import { listOpportunitiesFromDb } from '@/lib/opportunity_db_service';
import logger from '@/lib/logger';

import { handleApiError, HandledApplicationError } from '@/lib/utils/errorHandler';
import { handleServerError } from '@/lib/utils/serverErrorHandler';

// @fileoverview This file defines the API route for listing opportunities from the Neon database.
// @description This route fetches a list of opportunities from the configured Neon database.
// It is the primary data source for the Orion Opportunity Pipeline page. Future enhancements
// will include dynamic filtering and sorting capabilities directly at the database level.

// =====================
// Opportunity Pipeline List API
// =====================

export async function GET() {
  const logContext = {
    route: '/api/orion/opportunities/list',
    filePath: 'app/api/orion/opportunities/list/route.ts',
    timestamp: new Date().toISOString(),
    user: 'public',
  };

  logger.info('[OPPORTUNITY_LIST][START] Initiating GET request to list opportunities.', logContext);

  try {
    // Currently, listOpportunitiesFromDb fetches all opportunities without filters.
    // Future iterations will integrate searchParams (status, type, tag, priority) into the DB query.
    const opportunitiesResult = await listOpportunitiesFromDb();

    if (opportunitiesResult instanceof HandledApplicationError) {
      logger.error('[OPPORTUNITY_LIST][DB_ERROR] Failed to retrieve opportunities from DB.', {
        ...logContext,
        error: opportunitiesResult.message,
        details: opportunitiesResult.details,
      });
      return NextResponse.json(
        { success: false, error: opportunitiesResult.message, details: opportunitiesResult.details },
        { status: opportunitiesResult.statusCode || 500 }
      );
    }

    const opportunities = opportunitiesResult; // Type is now correctly narrowed to REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA[]

    logger.info('[OPPORTUNITY_LIST][FETCHED]', {
      ...logContext,
      total: opportunities.length,
      message: 'Successfully fetched opportunities from DB.',
    });

    return NextResponse.json({
      success: true,
      opportunities: opportunities,
    });
  } catch (error: unknown) {
    const handledError = handleServerError(error, logContext);
    logger.error('[OPPORTUNITY_LIST][ERROR]', {
      ...logContext,
      error: handledError.message,
      stack: handledError.originalError instanceof Error ? handledError.originalError.stack : undefined,
      message: 'Failed to fetch opportunities from DB.',
    });

    return NextResponse.json(
      {
        success: false,
        error: handledError.message,
        details: handledError.details,
      },
      { status: handledError.statusCode || 500 }
    );
  }
}
