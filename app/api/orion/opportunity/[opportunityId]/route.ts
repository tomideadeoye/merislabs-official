import { NextRequest, NextResponse } from 'next/server';
import { fetchOpportunityByIdFromNotion } from '@repo/shared/notion_service';
import { OpportunityNotionOutputShared } from '@repo/shared/types/orion';

export async function GET(request: NextRequest, { params }: { params: { opportunityId: string } }) {
  const opportunityId = params.opportunityId;

  if (!opportunityId) {
    return NextResponse.json({ success: false, error: 'Opportunity ID is required.' }, { status: 400 });
  }

  try {
    const fetchResult = await fetchOpportunityByIdFromNotion(opportunityId);

    if (fetchResult.success && fetchResult.OrionOpportunity) {
      // Ensure the returned opportunity conforms to OpportunityNotionOutputShared
      const opportunity: OpportunityNotionOutputShared = fetchResult.OrionOpportunity;
      return NextResponse.json({ success: true, opportunity }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, error: fetchResult.error || 'Opportunity not found.' },
        { status: 404 }
      );
    }
  } catch (error: unknown) {
    console.error(`[API/Opportunity/ID] Error fetching opportunity ${opportunityId}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
