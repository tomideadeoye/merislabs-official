import { NextResponse } from 'next/server';
import { createOpportunityInNotion } from '@shared/lib/notion_service';
import { OpportunityNotionPayloadSchema } from '@shared/lib/notion_next_service';

export async function POST(request: Request) {
    try {
        const opportunityData = await request.json();
        // Validate opportunityData against OpportunityNotionInput type if necessary
        const parseResult = OpportunityNotionPayloadSchema.safeParse(opportunityData);
        if (!parseResult.success) {
            console.error('[POST /api/orion/notion/opportunity/create] Invalid OpportunityNotionPayload:', parseResult.error.format());
            return NextResponse.json({ success: false, error: 'Invalid OpportunityNotionPayload', details: parseResult.error.format() }, { status: 400 });
        }

        const newOpportunity = await createOpportunityInNotion(opportunityData);

        if (newOpportunity) {
            return NextResponse.json({ success: true, opportunity: newOpportunity });
        } else {
            return NextResponse.json({ success: false, error: 'Failed to create opportunity in Notion' }, { status: 500 });
        }
    } catch (error: any) {
        console.error("Error in Create Opportunity API route:", error);
        return NextResponse.json({ success: false, error: error.message || 'An unexpected error occurred' }, { status: 500 });
    }
}
