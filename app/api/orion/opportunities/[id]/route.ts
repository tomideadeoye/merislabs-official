import { NextRequest, NextResponse } from 'next/server';
import {
  getOpportunityByIdFromDb,
  updateOpportunityStatusInDb /* you'll need a more generic updateOpportunityInDb */,
} from '@/lib/opportunity_db_service';
// import { OpportunityUpdatePayload } from '@/lib/types'; // Removed as it was unused
import { auth } from '@/auth';
import logger from '@/lib/logger';
import { z } from 'zod';
import { OpportunityStatus } from '@/lib/types';
// import { OrionOpportunity, OpportunityStatus } from '@/lib/types';

// Define Zod schema for updates if needed, or handle partial updates carefully
// const updateOpportunitySchema = z
//   .object({
//     // Define fields that can be updated, all optional
//     title: z.string().optional(),
//     companyOrInstitution: z.string().nullish(),
//     status: z.nativeEnum(OpportunityStatus).optional(),
//     // ... other updatable fields
//   })
//   .partial();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const logContext = {
    route: `/api/orion/opportunities/${id}`,
    method: 'GET',
    opportunityId: id,
    filePath: 'app/api/orion/opportunities/[id]/route.ts',
    timestamp: new Date().toISOString(),
  };
  logger.info('[OPPORTUNITY_API][GET_BY_ID][START]', logContext);

  const session = await auth();
  if (!session || !session.user) {
    logger.warn('[OPPORTUNITY_API][GET_BY_ID][UNAUTHORIZED]', logContext);
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  (logContext as { user?: string }).user = session.user.id;

  try {
    const opportunity = await getOpportunityByIdFromDb(id);
    if (!opportunity) {
      logger.warn('[OPPORTUNITY_API][GET_BY_ID][NOT_FOUND]', logContext);
      return NextResponse.json({ success: false, error: 'Opportunity not found' }, { status: 404 });
    }
    logger.info('[OPPORTUNITY_API][GET_BY_ID][SUCCESS]', logContext);
    return NextResponse.json({ success: true, opportunity });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[OPPORTUNITY_API][GET_BY_ID][ERROR]', { ...logContext, error: errorMessage });
    return NextResponse.json(
      { success: false, error: 'Failed to fetch opportunity', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const logContext = {
    route: `/api/orion/opportunities/${id}`,
    method: 'PUT',
    opportunityId: id,
    filePath: 'app/api/orion/opportunities/[id]/route.ts',
    timestamp: new Date().toISOString(),
  };
  logger.info('[OPPORTUNITY_API][UPDATE][START]', logContext);

  const session = await auth();
  if (!session || !session.user) {
    logger.warn('[OPPORTUNITY_API][UPDATE][UNAUTHORIZED]', logContext);
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  (logContext as { user?: string }).user = session.user.id;

  try {
    const body = await request.json();
    // For now, let's assume a simple status update, expand later
    // const validatedData = updateOpportunitySchema.parse(body);

    // Example for status update, you'll need a generic update function in opportunity_db_service.ts
    if (body.status && Object.values(OpportunityStatus).includes(body.status as OpportunityStatus)) {
      await updateOpportunityStatusInDb(id, body.status as OpportunityStatus);
      const updatedOpportunity = await getOpportunityByIdFromDb(id); // Fetch again to return updated
      logger.info('[OPPORTUNITY_API][UPDATE][SUCCESS]', { ...logContext, updatedFields: ['status'] });
      return NextResponse.json({ success: true, opportunity: updatedOpportunity });
    } else {
      // Placeholder for more generic update
      logger.warn('[OPPORTUNITY_API][UPDATE][NO_ACTION]', { ...logContext, body });
      return NextResponse.json(
        { success: false, error: 'No valid fields to update or update logic not fully implemented.' },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[OPPORTUNITY_API][UPDATE][ERROR]', {
      ...logContext,
      error: errorMessage,
      requestBody: await request.text().catch(() => 'Could not read body'),
    });
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update opportunity', details: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE handler can be added here later if needed.
