import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@shared/auth';
import { listOpportunitiesFromNotion } from '@shared/lib/notion_service';

/**
 * @fileoverview This file defines the API route for listing opportunities from Notion.
 * @description This route fetches a list of opportunities from the configured Notion database.
 * It is the primary data source for the Opportunity Pipeline page. It supports dynamic
 * filtering based on query parameters like status, type, and priority, and now
 * enforces a base filter to only retrieve items with a 'Content Type' of 'Opportunity',
 * ensuring the pipeline is not cluttered with other data types like 'CV Component'.
 */

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

    // Base filter to only get "Opportunity" content types
    const notionFilter: any = {
      and: [
        {
          property: 'Content Type',
          select: {
            equals: 'Opportunity',
          },
        },
      ],
    };

    // Add additional filters if they are provided in the query
    if (status) {
      notionFilter.and.push({ property: 'Status', select: { equals: status } });
    }
    if (type) {
      notionFilter.and.push({ property: 'Type', select: { equals: type } });
    }
    if (tag) {
      notionFilter.and.push({ property: 'Tags', multi_select: { contains: tag } });
    }
    if (priority) {
      notionFilter.and.push({ property: 'Priority', select: { equals: priority } });
    }

    // Define sorts
    const sorts = [
      {
        timestamp: 'last_edited_time',
        direction: 'descending',
      },
    ];

    // Fetch opportunities from Notion
    const opportunities = await listOpportunitiesFromNotion({ notionFilter, sorts });
    console.info('[OPPORTUNITY_LIST][FETCHED]', { ...logContext, total: opportunities.length });

    return NextResponse.json({
      success: true,
      opportunities: opportunities
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
