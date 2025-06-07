import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth';
import { listOpportunitiesFromNotion } from '@/lib/notion_service';

// =====================
// Opportunity Pipeline List API
// =====================
// GOAL: Provide absurdly comprehensive, context-rich, level-based logging for all Opportunity Pipeline list/filter/search actions.
// All logs include operation, user/session, parameters, filter steps, and results for traceability and rapid debugging.

export async function GET(request: NextRequest) {
  const logContext = {
    route: '/api/orion/opportunity/list',
    filePath: 'app/api/orion/opportunity/list/route.ts',
    timestamp: new Date().toISOString(),
    user: 'public',
  };

  console.info('[OPPORTUNITY_LIST][START]', logContext);

  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const tag = searchParams.get('tag');
    const priority = searchParams.get('priority');
    const filterParams = { status, type, tag, priority };

    console.info('[OPPORTUNITY_LIST][PARAMS]', { ...logContext, filterParams });

    // Fetch opportunities from Notion
    const opportunities = await listOpportunitiesFromNotion();
    console.info('[OPPORTUNITY_LIST][FETCHED]', { ...logContext, total: opportunities.length });

    // Apply filters
    let filteredOpportunities = [...opportunities];

    if (status) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.status === status);
      console.debug('[OPPORTUNITY_LIST][FILTER][STATUS]', { ...logContext, status, count: filteredOpportunities.length });
    }

    if (type) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.type === type);
      console.debug('[OPPORTUNITY_LIST][FILTER][TYPE]', { ...logContext, type, count: filteredOpportunities.length });
    }

    if (tag) {
      filteredOpportunities = filteredOpportunities.filter(opp =>
        opp.tags?.some((t: string) => t.toLowerCase().includes(tag.toLowerCase()))
      );
      console.debug('[OPPORTUNITY_LIST][FILTER][TAG]', { ...logContext, tag, count: filteredOpportunities.length });
    }

    if (priority) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.priority === priority);
      console.debug('[OPPORTUNITY_LIST][FILTER][PRIORITY]', { ...logContext, priority, count: filteredOpportunities.length });
    }

    // Optionally sort by last_edited_time or other fields
    filteredOpportunities.sort((a, b) => {
      const aValue = a.last_edited_time instanceof Date ? a.last_edited_time.getTime() : 0;
      const bValue = b.last_edited_time instanceof Date ? b.last_edited_time.getTime() : 0;
      return bValue - aValue; // Descending by default
    });

    console.info('[OPPORTUNITY_LIST][RESULT]', { ...logContext, returned: filteredOpportunities.length });

    return NextResponse.json({
      success: true,
      opportunities: filteredOpportunities
    });

  } catch (error: any) {
    console.error('[OPPORTUNITY_LIST][ERROR]', { ...logContext, error: error.message, stack: error.stack });

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch opportunities.',
      details: error.message
    }, { status: 500 });
  }
}
