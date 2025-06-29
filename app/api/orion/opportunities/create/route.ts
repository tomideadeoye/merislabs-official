import { OpportunityCreatePayload } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { createOpportunityInDb } from '@/lib/opportunity_db_service';
import logger from '@/lib/logger';

// =====================
// Opportunity Pipeline Create API
// =====================
// GOAL: Provide comprehensive, context-rich, level-based logging for all opportunity creation actions.
// All logs include operation, user/session, parameters, validation, and results for traceability and rapid debugging.

export async function POST(request: NextRequest) {
  const logContext = {
    route: '/api/orion/opportunity/create',
    filePath: 'app/api/orion/opportunity/create/route.ts',
    timestamp: new Date().toISOString(),
    user: 'public',
  };

  logger.info('[OPPORTUNITY_CREATE][START] Initiating POST request to create an opportunity.', logContext);

  try {
    const body: OpportunityCreatePayload = await request.json();
    logger.info('[OPPORTUNITY_CREATE][PAYLOAD] Received request body for opportunity creation.', {
      ...logContext,
      body,
    });

    // Basic validation
    if (!body.title || !body.companyOrInstitution) {
      logger.warn('[OPPORTUNITY_CREATE][VALIDATION_FAIL] Missing required fields (title or companyOrInstitution).', {
        ...logContext,
        body,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Title and Company are required.',
        },
        { status: 400 }
      );
    }

    // Use the new database service to create the opportunity in Neon DB
    const createdOpportunity = await createOpportunityInDb(body);

    logger.info('[OPPORTUNITY_CREATE][SUCCESS] Successfully created opportunity in Neon DB.', {
      ...logContext,
      opportunityId: createdOpportunity.id,
      company: createdOpportunity.company,
    });

    return NextResponse.json({
      success: true,
      opportunity: createdOpportunity,
    });
  } catch (error: unknown) {
    // Robust error handling: ensure type safety for 'unknown' error, log with context-rich details
    let errorMessage = 'Unknown error';
    let errorStack = undefined;
    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    logger.error('[OPPORTUNITY_CREATE][ERROR] An error occurred during opportunity creation.', {
      ...logContext,
      error: errorMessage,
      stack: errorStack,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create opportunity.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
