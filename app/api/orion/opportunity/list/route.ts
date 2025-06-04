import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth';
import { listOpportunitiesFromNotion } from '@/lib/notion_service';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const tag = searchParams.get('tag');
    const priority = searchParams.get('priority');
    // Notion API does not support all filters natively, so we filter after fetch

    // Fetch opportunities from Notion
    const opportunities = await listOpportunitiesFromNotion();

    // Apply filters
    let filteredOpportunities = [...opportunities];

    if (status) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.status === status);
    }

    if (type) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.type === type);
    }

    if (tag) {
      filteredOpportunities = filteredOpportunities.filter(opp =>
        opp.tags?.some((t: string) => t.toLowerCase().includes(tag.toLowerCase()))
      );
    }

    if (priority) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.priority === priority);
    }

    // Optionally sort by last_edited_time or other fields
    filteredOpportunities.sort((a, b) => {
      const aValue = a.last_edited_time instanceof Date ? a.last_edited_time.getTime() : 0;
      const bValue = b.last_edited_time instanceof Date ? b.last_edited_time.getTime() : 0;
      return bValue - aValue; // Descending by default
    });

    console.log('[OPPORTUNITY_LIST] Returning opportunities:', filteredOpportunities);

    return NextResponse.json({
      success: true,
      opportunities: filteredOpportunities
    });

  } catch (error: any) {
    console.error('[OPPORTUNITY_LIST_API_ERROR]', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch opportunities.',
      details: error.message
    }, { status: 500 });
  }
}
