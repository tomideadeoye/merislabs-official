/**
 * GOAL: API route for fetching and updating a Notion-based Opportunity.
 * - Ensures all returned Opportunity objects include both company and companyOrInstitution.
 * - Adds context-rich, traceable logging for every operation, parameter, and result.
 * - Related files: lib/notion_service.ts, lib/notion_next_service.ts, types/opportunity.d.ts
 */
import { NextResponse } from 'next/server';
import { updateNotionOpportunity } from '@shared/lib/notion_service';
import { fetchOpportunityByIdFromNotion } from '@shared/lib/notion_service';
import { OpportunityNotionPayloadSchema } from '@shared/lib/notion_next_service';

export async function PATCH(
    request: Request,
    { params }: { params: { opportunityId: string } }
) {
    const { opportunityId } = params;
    console.log('[PATCH /api/orion/notion/opportunity/[opportunityId]] Received opportunityId:', opportunityId);

    if (!opportunityId) {
        return NextResponse.json({ success: false, error: 'Opportunity ID is required' }, { status: 400 });
    }

    const updateData = await request.json();
    // Validate updateData against Partial<OpportunityNotionInput> if necessary
    const parseResult = OpportunityNotionPayloadSchema.partial().safeParse(updateData);
    if (!parseResult.success) {
      console.error('[PATCH /api/orion/notion/opportunity/[opportunityId]] Invalid OpportunityNotionPayload:', parseResult.error.format());
      return NextResponse.json({ success: false, error: 'Invalid OpportunityNotionPayload', details: parseResult.error.format() }, { status: 400 });
    }

    const updatedOpportunity = await updateNotionOpportunity(opportunityId, updateData);

    console.log('[PATCH /api/orion/notion/opportunity/[opportunityId]] Result of updateNotionOpportunity:', updatedOpportunity);

    if (updatedOpportunity) {
        const successResponse = NextResponse.json({ success: true, opportunity: updatedOpportunity });
        console.log('[PATCH /api/orion/notion/opportunity/[opportunityId]] Sending success response:', successResponse);
        return successResponse;
    } else {
        const errorResponse = NextResponse.json({ success: false, error: 'Failed to update opportunity in Notion' }, { status: 500 });
        console.log('[PATCH /api/orion/notion/opportunity/[opportunityId]] Sending error response:', errorResponse);
        return errorResponse;
    }
}

export async function GET(
    request: Request,
    { params }: { params: { opportunityId: string } }
) {
    const { opportunityId } = params;
    console.log(`[GET /api/orion/notion/opportunity/${opportunityId}] Received request for opportunity ID:`, opportunityId);

    if (!opportunityId) {
        console.error(`[GET /api/orion/notion/opportunity/${opportunityId}] Opportunity ID is missing.`);
        return NextResponse.json({ success: false, error: 'Opportunity ID is required.' }, { status: 400 });
    }

    try {
        console.log(`[GET /api/orion/notion/opportunity/${opportunityId}] Calling fetchOpportunityByIdFromNotion...`);
        const fetchResult = await fetchOpportunityByIdFromNotion(opportunityId);
        console.log(`[GET /api/orion/notion/opportunity/${opportunityId}] Raw Notion API response:`, JSON.stringify(fetchResult, null, 2));

        if (fetchResult.success) {
            if (!fetchResult.opportunity) {
                console.error(`[GET /api/orion/notion/opportunity/${opportunityId}] Success but opportunity is undefined!`);
                return NextResponse.json({ success: false, error: 'Opportunity not found.' }, { status: 404 });
            }
            // Normalize company/companyOrInstitution
            const company = (fetchResult.opportunity.company ?? (fetchResult.opportunity as any).companyOrInstitution ?? '') || '';
            const companyOrInstitution = ((fetchResult.opportunity as any).companyOrInstitution ?? fetchResult.opportunity.company ?? '') || '';
            const normalizedOpportunity = { ...fetchResult.opportunity, company, companyOrInstitution };
            console.info(`[GET /api/orion/notion/opportunity/${opportunityId}] Normalized company fields:`, { company, companyOrInstitution });
            console.log(`[GET /api/orion/notion/opportunity/${opportunityId}] Successfully fetched opportunity.`, normalizedOpportunity.id);
            return NextResponse.json({ success: true, opportunity: normalizedOpportunity });
        } else {
            console.warn(`[GET /api/orion/notion/opportunity/${opportunityId}] fetchOpportunityByIdFromNotion returned success: false. Error:`, fetchResult.error);
            const errorStr = typeof fetchResult.error === 'string' ? fetchResult.error : '';
            const status = errorStr.includes('not found') ? 404 : 500;
            return NextResponse.json({ success: false, error: fetchResult.error }, { status });
        }

    } catch (error: any) {
        console.error(`[GET /api/orion/notion/opportunity/${opportunityId}] Uncaught error during fetch:`, error);
        return NextResponse.json({ success: false, error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}

// Add other handlers (DELETE) later if needed
