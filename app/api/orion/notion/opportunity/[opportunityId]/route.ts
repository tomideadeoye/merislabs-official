import { NextResponse } from 'next/server';
import { updateNotionOpportunity } from '@/lib/notion_service';
import { fetchOpportunityByIdFromNotion } from '@/lib/notion_service';

export async function PATCH(
    request: Request,
    { params }: { params: { opportunityId: string } }
) {
    try {
        const { opportunityId } = params;
        const updateData = await request.json();

        if (!opportunityId) {
            return NextResponse.json({ success: false, error: 'Opportunity ID is required' }, { status: 400 });
        }

        // Validate updateData against Partial<OpportunityNotionInput> if necessary

        const updatedOpportunity = await updateNotionOpportunity(opportunityId, updateData);

        if (updatedOpportunity) {
            return NextResponse.json({ success: true, opportunity: updatedOpportunity });
        } else {
            return NextResponse.json({ success: false, error: 'Failed to update opportunity in Notion' }, { status: 500 });
        }
    } catch (error: any) {
        console.error(`Error in Update Opportunity API route for ID ${params.opportunityId}:`, error);
        return NextResponse.json({ success: false, error: error.message || 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: { opportunityId: string } }
) {
    const { opportunityId } = params;

    if (!opportunityId) {
        return NextResponse.json({ success: false, error: 'Opportunity ID is required.' }, { status: 400 });
    }

    try {
        const opportunity = await fetchOpportunityByIdFromNotion(opportunityId);

        if (opportunity) {
            return NextResponse.json({ success: true, opportunity });
        } else {
            return NextResponse.json({ success: false, error: 'Opportunity not found or could not be fetched.' }, { status: 404 });
        }

    } catch (error: any) {
        console.error(`Error in GET /api/orion/notion/opportunity/${opportunityId}:`, error);
        return NextResponse.json({ success: false, error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}

// Add other handlers (DELETE) later if needed
