import { NextResponse } from 'next/server';
import { createOpportunityInNotion } from '@/lib/notion_service';

export async function POST(request: Request) {
    try {
        const opportunityData = await request.json();
        // Validate opportunityData against OpportunityNotionInput type if necessary

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
