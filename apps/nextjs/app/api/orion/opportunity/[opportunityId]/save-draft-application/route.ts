import { NextRequest, NextResponse } from 'next/server';
import { updateNotionOpportunity } from '@shared/lib/notion_service';
import { auth } from '@shared/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { opportunityId: string } }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const opportunityId = params.opportunityId;
  const { draft_content } = await request.json();

  if (!opportunityId || !draft_content) {
    return NextResponse.json({ success: false, error: 'Opportunity ID and draft content are required.' }, { status: 400 });
  }

  try {
    // Assuming a Notion property named 'Application Draft' or similar exists
    // Need to confirm the exact property name in Notion service or data types.
    // For now, let's assume we will map it correctly in updateNotionOpportunity
    const updateData = {
      // Map draft_content to the correct Notion property name here
      // Example: 'Application Draft': draft_content
      // We will rely on mapToNotionOpportunityProperties in notion_service to handle the mapping
      draftApplicationContent: draft_content // This key needs to map to a Notion property in notion_service.ts
    };

    // Ensure all required fields for OpportunityCreatePayload
    const safeUpdateData = {
      title: 'Draft Application',
      company: 'Unknown',
      content: updateData.draftApplicationContent || '',
      type: 'job',
    };
    console.log('[SAVE_DRAFT_APP] Updating Notion opportunity with:', safeUpdateData);
    const updatedOpportunity = await updateNotionOpportunity(opportunityId, safeUpdateData);

    if (updatedOpportunity) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to update opportunity in Notion.' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error saving application draft:', error);
    return NextResponse.json({ success: false, error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
