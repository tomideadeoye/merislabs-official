import { NextResponse } from 'next/server';
import { listOpportunitiesFromDb } from '@/lib/opportunity_db_service';
import logger from '@/lib/logger';

// @fileoverview This file defines the API route for listing opportunities from the Neon database.
// @description This route fetches a list of opportunities from the configured Neon database.
// It is the primary data source for the Orion Opportunity Pipeline page. Future enhancements
// will include dynamic filtering and sorting capabilities directly at the database level.

// =====================
// Opportunity Pipeline List API
// =====================

export async function GET() {
  const logContext = {
    route: '/api/orion/opportunity/list',
    filePath: 'app/api/orion/opportunity/list/route.ts',
    timestamp: new Date().toISOString(),
    user: 'public',
  };

  logger.info('[OPPORTUNITY_LIST][START] Initiating GET request to list opportunities.', logContext);

  try {
    // Currently, listOpportunitiesFromDb fetches all opportunities without filters.
    // Future iterations will integrate searchParams (status, type, tag, priority) into the DB query.
    const opportunities = await listOpportunitiesFromDb();

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
    logger.error('[OPPORTUNITY_LIST][ERROR]', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      message: 'Failed to fetch opportunities from DB.',
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch opportunities.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
