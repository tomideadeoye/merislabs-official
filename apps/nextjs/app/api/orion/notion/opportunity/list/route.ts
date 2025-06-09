import { NextRequest, NextResponse } from 'next/server';
import { listOpportunitiesFromNotion } from '@shared/lib/notion_service';
import { z } from 'zod';

const OpportunityNotionOutputSharedSchema = z.object({
  id: z.string(),
  notion_page_id: z.string().optional(),
  title: z.string(),
  company: z.string(),
  content: z.string().nullable().optional(),
  descriptionSummary: z.string().nullable().optional(),
  type: z.union([z.string(), z.null()]).optional(),
  status: z.union([z.string(), z.null()]).optional(),
  priority: z.union([z.string(), z.null()]).optional(),
  url: z.string().nullable().optional(),
  jobUrl: z.string().nullable().optional(),
  sourceURL: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  salary: z.string().nullable().optional(),
  contact: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  dateIdentified: z.string().nullable().optional(),
  nextActionDate: z.string().nullable().optional(),
  evaluationOutput: z.any().nullable().optional(),
  tailoredCV: z.string().nullable().optional(),
  webResearchContext: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  pros: z.array(z.string()).nullable().optional(),
  cons: z.array(z.string()).nullable().optional(),
  missingSkills: z.array(z.string()).nullable().optional(),
  contentType: z.string().nullable().optional(),
  relatedEvaluationId: z.string().nullable().optional(),
  lastStatusUpdate: z.string().nullable().optional(),
  last_edited_time: z.union([z.string(), z.date(), z.null()]).optional(),
});

// =====================
// Opportunity Notion List API
// =====================
// GOAL: Provide comprehensive, context-rich, level-based logging for all Notion Opportunity list actions.
// All logs include operation, parameters, validation, and results for traceability and rapid debugging.

export async function GET(request: NextRequest) {
  const logContext = {
    route: '/api/orion/notion/opportunity/list',
    filePath: 'app/api/orion/notion/opportunity/list/route.ts',
    timestamp: new Date().toISOString(),
    // No user/session for this endpoint, but could be added if auth is required
  };

  console.info('[OPPORTUNITY_NOTION_LIST][START]', logContext);

  try {
    const opportunities = await listOpportunitiesFromNotion();
    const validOpportunities = [];
    const invalidOpportunities = [];
    for (const opp of opportunities) {
      const parseResult = OpportunityNotionOutputSharedSchema.safeParse(opp);
      if (parseResult.success) {
        validOpportunities.push(parseResult.data);
      } else {
        console.warn('[OPPORTUNITY_NOTION_LIST][VALIDATION_FAIL]', { ...logContext, opp, error: parseResult.error.format() });
        invalidOpportunities.push({ opp, error: parseResult.error.format() });
      }
    }
    console.info('[OPPORTUNITY_NOTION_LIST][VALIDATION_SUMMARY]', { ...logContext, valid: validOpportunities.length, invalid: invalidOpportunities.length });
    console.info('[OPPORTUNITY_NOTION_LIST][SUCCESS]', { ...logContext, validOpportunitiesCount: validOpportunities.length });

    return NextResponse.json({ success: true, opportunities: validOpportunities, invalidOpportunities });
  } catch (error: any) {
    console.error('[OPPORTUNITY_NOTION_LIST][ERROR]', { ...logContext, error: error.message, stack: error.stack });
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch opportunities from Notion' },
      { status: 500 }
    );
  }
}

// Add other HTTP methods like POST, PATCH, DELETE if needed for this route later
// export async function POST(request: Request) { /* ... */ }
