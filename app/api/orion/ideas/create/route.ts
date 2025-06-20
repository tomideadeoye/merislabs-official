/**
 * GOAL: API route for creating a new idea in Orion, using Neon/Postgres for cloud scalability, reliability, and auditability.
 * - Persists new ideas and logs to the central Postgres DB.
 * - Absurdly comprehensive logging for every step, with context and error details.
 * - Connects to: lib/database.ts (Postgres pool), types/ideas.d.ts, reference.md (feature doc), tests/e2e.test.ts (tests)
 * - All features preserved from SQLite version, now with improved error handling and observability.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import logger from '@/lib/logger';
import { Client, APIResponseError } from '@notionhq/client';
import { generateLLMResponse } from '@/lib/orion_llm';
import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const notion = NOTION_API_KEY ? new Client({ auth: NOTION_API_KEY }) : null;

// Interface for LLM-enriched idea data
interface LLMEnrichedIdea {
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  keywords: string[];
  categories: string[];
  brainstormingStarter: string;
}

// Function to construct the LLM prompt
function constructLLMAnalysisPrompt(title: string, description?: string, tags?: string[]): string {
  let prompt = `Analyze the following idea and provide structured insights to help Tomide develop it further.\n\nIdea:\nTitle: ${title}\n`;
  if (description) {
    prompt += `Description: ${description}\n`;
  }
  if (tags && tags.length > 0) {
    prompt += `Tags: ${tags.join(', ')}\n`;
  }
  prompt += `\nProvide your response in JSON format with the following fields:\n{\n  "sentiment": "(positive|negative|neutral|mixed)",\n  "keywords": ["keyword1", "keyword2"],\n  "categories": ["category1", "category2"],\n  "brainstormingStarter": "A few sentences or bullet points to kickstart brainstorming."\n}\n\nDo not include any additional text outside the JSON.`;
  return prompt;
}

export async function POST(req: NextRequest) {
  const logContext = {
    route: '/api/orion/ideas/create',
    timestamp: new Date().toISOString(),
  };
  logger.info('[IDEAS_CREATE][START] Request received for new idea creation.', logContext);

  try {
    const session = await auth();
    if (!session || !session.user) {
      logger.warn('[IDEAS_CREATE][AUTH_FAIL] Unauthorized access attempt.', logContext);
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!notion || !NOTION_DATABASE_ID) {
      logger.error('[IDEAS_CREATE][NOTION_CONFIG_FAIL] Notion client or Database ID not configured.', logContext);
      return NextResponse.json(
        { success: false, error: 'Notion client or Database ID not configured.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { title, description, tags = [], priority, dueDate } = body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      logger.warn('[IDEAS_CREATE][VALIDATION_FAIL] Missing or invalid title.', { ...logContext, body });
      return NextResponse.json({ success: false, error: 'Idea title is required' }, { status: 400 });
    }

    let enrichedIdea: LLMEnrichedIdea | null = null;

    // --- Step 1: Enrich idea with LLM ---
    logger.info('[IDEAS_CREATE][LLM_ENRICHMENT] Initiating LLM analysis for idea enrichment.', logContext);
    try {
      const llmPrompt = constructLLMAnalysisPrompt(title, description, tags);
      const llmResponse = await generateLLMResponse('IDEA_ANALYSIS', llmPrompt, {
        systemContext:
          'You are an expert idea analyst and brainstorming assistant. Your task is to analyze new ideas and provide structured insights to help Tomide develop them further.',
      });

      if (llmResponse.success && llmResponse.content) {
        try {
          enrichedIdea = JSON.parse(llmResponse.content) as LLMEnrichedIdea;
          logger.success('[IDEAS_CREATE][LLM_ENRICHMENT_SUCCESS] Idea successfully enriched by LLM.', {
            ...logContext,
            llmResponse: enrichedIdea,
          });
        } catch (parseError: unknown) {
          logger.error('[IDEAS_CREATE][LLM_PARSE_ERROR] Failed to parse LLM response JSON.', {
            ...logContext,
            error: parseError,
            rawContent: llmResponse.content,
          });
        }
      } else {
        // If LLM call itself failed (success is false)
        if (!llmResponse.success) {
          logger.warn('[IDEAS_CREATE][LLM_ENRICHMENT_FAIL] LLM call was not successful.', {
            ...logContext,
            llmError: llmResponse.error || 'No specific error message provided', // Safely access error
          });
        } else {
          // If llmResponse.success is true but llmResponse.content is missing
          logger.warn('[IDEAS_CREATE][LLM_ENRICHMENT_FAIL] LLM returned success but content was missing.', {
            ...logContext,
            llmResponse: llmResponse, // Log the full response to debug missing content
          });
        }
      }
    } catch (llmCallError: unknown) {
      logger.error('[IDEAS_CREATE][LLM_CALL_ERROR] Error calling LLM service for idea enrichment.', {
        ...logContext,
        error: llmCallError,
      });
    }

    // --- Step 2: Persist enriched idea to Notion ---
    logger.info('[IDEAS_CREATE][NOTION_PERSISTENCE] Saving idea to Notion database.', logContext);
    const notionProperties: NonNullable<CreatePageParameters['properties']> = {
      Title: { title: [{ text: { content: title.trim() } }] },
      Status: { select: { name: 'Raw Spark' } }, // Default status
      Type: { select: { name: 'Idea' } }, // Set 'Type' property for central database
    };

    if (description) {
      notionProperties['Description'] = { rich_text: [{ text: { content: description.trim() } }] };
    }
    if (tags && tags.length > 0) {
      notionProperties['Tags'] = { multi_select: tags.map((t: string) => ({ name: t.trim() })) };
    }
    if (priority) {
      notionProperties['Priority'] = { select: { name: priority } };
    }
    if (dueDate) {
      notionProperties['Due Date'] = { date: { start: new Date(dueDate).toISOString().split('T')[0] } };
    }

    // Add LLM enriched data to Notion properties
    if (enrichedIdea) {
      notionProperties['Sentiment'] = { select: { name: enrichedIdea.sentiment } };
      notionProperties['Keywords (AI)'] = { multi_select: enrichedIdea.keywords.map((k) => ({ name: k })) };
      notionProperties['Categories (AI)'] = { multi_select: enrichedIdea.categories.map((c) => ({ name: c })) };
      notionProperties['Brainstorming Starter (AI)'] = {
        rich_text: [{ text: { content: enrichedIdea.brainstormingStarter } }],
      };
    }

    const notionResponse = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID! },
      properties: notionProperties,
    });

    logger.success('[IDEAS_CREATE][NOTION_PERSISTENCE_SUCCESS] Idea successfully saved to Notion.', {
      ...logContext,
      notionPageId: notionResponse.id,
    });

    // Respond with success
    return NextResponse.json({
      success: true,
      message: 'Idea captured and enriched successfully!',
      idea: { id: notionResponse.id, title, description, tags, priority, dueDate, ...enrichedIdea },
    });
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    let errorDetails: {
      code?: string;
      status?: number;
      body?: unknown;
      stack?: string;
    } = {}; // Explicitly type errorDetails

    if (error instanceof APIResponseError) {
      errorMessage = `Notion API Error: ${error.message}`;
      errorDetails = { code: error.code, status: error.status, body: error.body };
      logger.error('[IDEAS_CREATE][NOTION_API_ERROR]', { ...logContext, error: errorMessage, details: errorDetails });
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = { stack: error.stack };
      logger.error('[IDEAS_CREATE][GENERAL_ERROR]', { ...logContext, error: errorMessage, details: errorDetails });
    } else {
      logger.error('[IDEAS_CREATE][UNKNOWN_ERROR]', { ...logContext, error: String(error) });
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
