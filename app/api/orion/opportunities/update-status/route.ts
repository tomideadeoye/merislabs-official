import { NextRequest, NextResponse } from 'next/server';
import { updateOpportunityStatusInDb } from '@/lib/opportunity_db_service';
import logger from '@/lib/logger';

// =====================
// Opportunity Pipeline Create API
// =====================
// GOAL: Provide comprehensive, context-rich, level-based logging for all opportunity creation actions.
// All logs include operation, user/session, parameters, validation, and results for traceability and rapid debugging.

export async function POST(request: NextRequest) {
  const logContext = {
    route: '/api/orion/opportunity/update-status',
    filePath: 'app/api/orion/opportunity/update-status/route.ts',
    timestamp: new Date().toISOString(),
    user: 'public',
  };

  logger.info('[OPPORTUNITY_UPDATE_STATUS][START] Initiating POST request to update opportunity status.', logContext);

  try {
    const { id, newStatus } = await request.json();
    logger.info('[OPPORTUNITY_UPDATE_STATUS][PAYLOAD] Received update status payload.', {
      ...logContext,
      id,
      newStatus,
    });

    if (!id || !newStatus) {
      logger.warn(
        '[OPPORTUNITY_UPDATE_STATUS][VALIDATION_FAIL] Missing required fields (id or newStatus).',
        { ...logContext, id, newStatus }
      );
      return NextResponse.json(
        { success: false, error: 'Opportunity ID and new status are required.' },
        { status: 400 }
      );
    }

    await updateOpportunityStatusInDb(id, newStatus);

    logger.info('[OPPORTUNITY_UPDATE_STATUS][SUCCESS] Successfully updated opportunity status in Neon DB.', {
      ...logContext,
      id,
      newStatus,
    });

    return NextResponse.json({ success: true, message: 'Opportunity status updated successfully.' });
  } catch (error: unknown) {
    logger.error('[OPPORTUNITY_UPDATE_STATUS][ERROR] An error occurred during status update.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update opportunity status.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
