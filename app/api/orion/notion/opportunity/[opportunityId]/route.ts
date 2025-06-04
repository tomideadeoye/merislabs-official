import { NextResponse } from 'next/server';
import { updateNotionOpportunity } from '@/lib/notion_service';
import { fetchOpportunityByIdFromNotion } from '@/lib/notion_service';

export async function PATCH(
    request: Request,
    { params }: { params: { opportunityId: string } }
) {
    const { opportunityId } = params;
    console.log('[PATCH /api/orion/notion/opportunity/[opportunityId]] Received opportunityId:', opportunityId);

    if (!opportunityId) {
        return NextResponse.json({ success: false, error: 'Opportunity ID is required' }, { status: 400 });
    }

    // Validate updateData against Partial<OpportunityNotionInput> if necessary

    const updateData = await request.json();
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
            console.log(`[GET /api/orion/notion/opportunity/${opportunityId}] Successfully fetched opportunity.`, fetchResult.opportunity.id);
            return NextResponse.json({ success: true, opportunity: fetchResult.opportunity });
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
