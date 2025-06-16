import { NextRequest, NextResponse } from 'next/server';
import { getOpportunityDetails } from '@/lib/notion_service';

export async function GET(
  request: NextRequest, // Marked as unused, but kept for route signature consistency
  { params }: { params: { opportunityId: string } }
) {
  try {
    const { opportunityId } = params;
    const result = await getOpportunityDetails(opportunityId);

    if (result) {
      return NextResponse.json({ success: true, opportunity: result });
    } else {
      return NextResponse.json({ success: false, error: 'Opportunity not found' }, { status: 404 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
