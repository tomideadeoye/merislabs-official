import { NextRequest, NextResponse } from 'next/server';
import { listOpportunitiesFromNotion } from 'src/lib/notion_service';
import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';

// Define local types to mirror Notion API filter structures used in this file,
// as some types like PropertyFilter are not directly exported.

type LocalNotionPropertyFilter =
  | { property: string; select: { equals: string | null | undefined } }
  | { property: string; multi_select: { contains: string } };

type LocalNotionFilterElement =
  | LocalNotionPropertyFilter
  | { and: LocalNotionFilterElement[] }
  | { or: LocalNotionFilterElement[] };

interface LocalCompoundFilterObject {
  and: LocalNotionFilterElement[];
}

/**
 * @fileoverview This file defines the API route for listing opportunities from Notion.
 * @description This route fetches a list of opportunities from the configured Notion database.
 * It is the primary data source for the OrionOpportunity Pipeline page. It supports dynamic
 * filtering based on query parameters like status, type, and priority, and now
 * enforces a base filter to only retrieve items with a 'Content Type' of 'OrionOpportunity',
 * ensuring the pipeline is not cluttered with other data types like 'CV Component'.
 */

// =====================
// OrionOpportunity Pipeline List API
// =====================
// GOAL: Provide absurdly comprehensive, context-rich, level-based logging for all OrionOpportunity Pipeline list/filter/search actions.
// All logs include operation, user/session, parameters, filter steps, and results for traceability and rapid debugging.

export async function GET(request: NextRequest) {
  const logContext = {
    route: '/api/orion/OrionOpportunity/list',
    filePath: 'app/api/orion/OrionOpportunity/list/route.ts',
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

    // Base filter to only get "OrionOpportunity" content types
    const notionFilter: QueryDatabaseParameters['filter'] = {
      and: [
        {
          property: 'Content Type',
          select: {
            equals: 'OrionOpportunity',
          },
        },
      ],
    };

    // Cast to the local interface for type-safe manipulation of the 'and' array.
    // This cast is safe because we initialized notionFilter as a CompoundFilterObject variant.
    const typedNotionFilter = notionFilter as LocalCompoundFilterObject;

    // Add additional filters if they are provided in the query
    if (status) {
      typedNotionFilter.and.push({ property: 'Status', select: { equals: status } });
    }
    if (type) {
      typedNotionFilter.and.push({ property: 'Type', select: { equals: type } });
    }
    if (tag) {
      typedNotionFilter.and.push({
        property: 'Tags',
        multi_select: { contains: tag },
      });
    }
    if (priority) {
      typedNotionFilter.and.push({
        property: 'Priority',
        select: { equals: priority },
      });
    }

    // Define sorts
    const sorts: QueryDatabaseParameters['sorts'] = [
      {
        timestamp: 'last_edited_time',
        direction: 'descending',
      },
    ];

    // Fetch opportunities from Notion
    const opportunities = await listOpportunitiesFromNotion({
      notionFilter, // Pass the original notionFilter, which is still compatible with QueryDatabaseParameters['filter']
      sorts,
    });
    console.info('[OPPORTUNITY_LIST][FETCHED]', {
      ...logContext,
      total: opportunities.length,
    });

    return NextResponse.json({
      success: true,
      opportunities: opportunities,
    });
  } catch (error: unknown) {
    console.error('[OPPORTUNITY_LIST][ERROR]', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch opportunities.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
