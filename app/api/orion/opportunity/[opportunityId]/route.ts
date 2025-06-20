import { NextRequest, NextResponse } from 'next/server';
import { getOpportunityByIdFromDb } from '@/lib/opportunity_db_service';
import logger from '@/lib/logger';

export async function GET(
  request: NextRequest, // Marked as unused, but kept for route signature consistency
  { params }: { params: { opportunityId: string } }
) {
  const logContext = { route: '/api/orion/opportunity/[opportunityId]', opportunityId: params.opportunityId };
  logger.info('[OPPORTUNITY_DETAIL_API][GET_START] Attempting to fetch opportunity details.', logContext);

  try {
    const { opportunityId } = params;
    const opportunity = await getOpportunityByIdFromDb(opportunityId);

    if (opportunity) {
      logger.info('[OPPORTUNITY_DETAIL_API][GET_SUCCESS] Opportunity details fetched.', {
        ...logContext,
        opportunityTitle: opportunity.title,
      });
      return NextResponse.json({ success: true, opportunity: opportunity });
    } else {
      logger.warn('[OPPORTUNITY_DETAIL_API][NOT_FOUND] Opportunity not found.', logContext);
      return NextResponse.json({ success: false, error: 'Opportunity not found' }, { status: 404 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    logger.error('[OPPORTUNITY_DETAIL_API][GET_ERROR] Failed to fetch opportunity details.', {
      ...logContext,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : 'N/A',
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
