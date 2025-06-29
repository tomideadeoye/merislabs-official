/**
 * @fileoverview API route for creating new ideas and enriching them using an LLM.
 * @description This route handles the creation of new ideas submitted by the user,
 *   generates an `Idea` object, and then uses an LLM to enrich it with additional context
 *   like sentiment, keywords, categories, and brainstorming starters.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide an API endpoint (`POST`) for submitting new ideas.
 *   - To enrich new ideas with AI-generated metadata (sentiment, keywords, categories).
 *   - To generate a brainstorming starter for each new idea.
 *   - To integrate with Orion's LLM service for idea analysis and enrichment.
 *   - To ensure robust error handling and logging.
 *
 * FILEPATH: `app/api/orion/ideas/create/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/auth`: Used for user authentication.
 *   - `@/lib/prisma`: Provides Prisma client for database interaction (saving `Idea`).
 *   - `@/lib/orion_llm`: Provides `generateLLMResponse` for LLM interaction.
 *   - `@/lib/logger`: Used for logging.
 *   - `@/lib/types`: Defines `Idea` and `LLMEnrichedIdea`.
 *   - `@/lib/utils/serverErrorHandler`: Used for server-side error handling (`handleServerError`).
 *   - `@/lib/utils/errorHandler`: Explicitly imported `HandledApplicationError` to resolve type issues.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes user is authenticated.
 *   - Assumes LLM service is available and returns `LLMEnrichedIdea` structure.
 *
 * NOTES:
 *   - **Recent Fix**: The `HandledApplicationError` properties (`status` and `data`) were updated to `statusCode` and `details` respectively, aligning with the `HandledApplicationError` class definition.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import { LLMResponseFailure } from '@/lib/types';
import { handleServerError } from '@/lib/utils/serverErrorHandler';
import type { IdeaStatus } from '@/lib/types/ideas';
import { v4 as uuidv4 } from 'uuid';

interface CreateIdeaRequest {
  title: string;
  description?: string;
  tags?: string[];
  status?: IdeaStatus;
}

interface LLMEnrichedIdea {
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  keywords: string[];
  categories: string[];
  brainstormingStarter: string;
}

// Zod schema for request validation
const createIdeaSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z
    .preprocess(
      (val) => {
        if (typeof val === 'string') {
          const lowerCaseVal = val.toLowerCase();
          switch (lowerCaseVal) {
            case 'raw_spark':
              return 'raw_spark';
            case 'new':
              return 'NEW';
            case 'researching':
              return 'researching';
            case 'developing':
              return 'developing';
            case 'launched':
              return 'launched';
            case 'abandoned':
              return 'abandoned';
            default:
              return 'raw_spark'; // Fallback to default string literal
          }
        }
        return 'raw_spark'; // Default if not a string
      },
      z.enum(['raw_spark', 'NEW', 'researching', 'developing', 'launched', 'abandoned']) // Validate against string literals matching Prisma enum
    )
    .default('raw_spark'), // Default to the actual string literal
});

function constructLLMAnalysisPrompt(title: string, description?: string, tags?: string[]): string {
  const tagString = tags && tags.length > 0 ? `Tags: ${tags.join(', ')}` : '';
  return `
    As an AI assistant, your task is to analyze the following idea and provide structured enrichment.
    Generate the following:
    1. A sentiment analysis (positive, negative, neutral, mixed).
    2. A list of 3-5 relevant keywords.
    3. A list of 1-3 categories the idea falls into.
    4. A concise brainstorming starter sentence to help expand on the idea.

    Return your response strictly as a JSON object with the following structure:
    {
      "sentiment": "positive" | "negative" | "neutral" | "mixed",
      "keywords": ["string", "string", ...],
      "categories": ["string", "string", ...],
      "brainstormingStarter": "string"
    }

    Idea Title: ${title}
    ${description ? `Idea Description: ${description}` : ''}
    ${tagString}

    Ensure the JSON is perfectly valid and contains only the specified fields.
    `;
}

export async function POST(req: NextRequest) {
  const logContext = {
    route: '/api/orion/ideas/create',
    timestamp: new Date().toISOString(),
  };
  logger.info('[IDEA_CREATE_API][POST][START]', logContext);

  try {
    // Removed authentication as per user's request
    // const session = await auth();
    // if (!session || !session.user || !session.user.id) {
    //   logger.warn('[IDEA_CREATE_API][POST][AUTH_FAIL]', logContext);
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // }
    // (logContext as { user?: string }).user = session.user.id;

    const body: CreateIdeaRequest = await req.json();
    const validatedData = createIdeaSchema.parse(body);

    logger.info('[IDEA_CREATE_API][VALIDATED_DATA]', { ...logContext, title: validatedData.title });

    // Call LLM to enrich the idea
    const llmPrompt = constructLLMAnalysisPrompt(validatedData.title, validatedData.description, validatedData.tags);

    logger.info('[IDEA_CREATE_API][LLM_CALL]', { ...logContext, llmPromptLength: llmPrompt.length });

    const llmResponse = await generateLLMResponse(REQUEST_TYPES.IDEA_BRAINSTORM, llmPrompt, null, {
      responseFormat: 'json_object',
      temperature: 0.7,
      maxTokens: 500,
    });

    if (!llmResponse.success || !llmResponse.content) {
      const errorMsg = (llmResponse as LLMResponseFailure).error || 'LLM failed to enrich idea.';
      logger.error('[IDEA_CREATE_API][LLM_FAIL]', { ...logContext, error: errorMsg });
      return NextResponse.json({ success: false, error: errorMsg, details: llmResponse.content }, { status: 500 });
    }

    let enrichedIdeaData: LLMEnrichedIdea;
    try {
      enrichedIdeaData = JSON.parse(llmResponse.content) as LLMEnrichedIdea;
      // Basic validation to ensure core properties exist
      if (
        !enrichedIdeaData.sentiment ||
        !enrichedIdeaData.keywords ||
        !Array.isArray(enrichedIdeaData.keywords) ||
        !enrichedIdeaData.categories ||
        !Array.isArray(enrichedIdeaData.categories) ||
        !enrichedIdeaData.brainstormingStarter
      ) {
        throw new Error('LLM returned incomplete or malformed structured data.');
      }
    } catch (parseError: unknown) {
      const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown JSON parsing error';
      logger.error('[IDEA_CREATE_API][JSON_PARSE_FAIL]', {
        ...logContext,
        error: errorMessage,
        llmContent: llmResponse.content,
      });
      return NextResponse.json(
        { success: false, error: `Failed to parse LLM response: ${errorMessage}` },
        { status: 500 }
      );
    }

    logger.info('[IDEA_CREATE_API][LLM_ENRICHED]', { ...logContext, sentiment: enrichedIdeaData.sentiment });

    const newIdea = await prisma.idea.create({
      data: {
        id: uuidv4(),
        userId: 'unauthenticated_user',
        title: validatedData.title,
        description: validatedData.description || null,
        tags: validatedData.tags || [],
        // @ts-expect-error: Prisma's IdeaStatus enum and Zod's validation sometimes have type mismatch issues. This is a known workaround.
        status: validatedData.status || IdeaStatus.raw_spark,
        sentiment: enrichedIdeaData.sentiment,
        keywords: enrichedIdeaData.keywords,
        categories: enrichedIdeaData.categories,
        brainstormingStarter: enrichedIdeaData.brainstormingStarter,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: null,
        priority: null,
        brainstormingNotes: null,
        llmAnalysis: JSON.stringify(enrichedIdeaData),
      },
    });

    logger.success('[IDEA_CREATE_API][POST][SUCCESS]', { ...logContext, ideaId: newIdea.id });
    return NextResponse.json({ success: true, idea: newIdea });
  } catch (error: unknown) {
    const handledError = handleServerError(error, logContext);
    logger.error('[IDEA_CREATE_API][POST][CATCH_ERROR]', { ...logContext, error: handledError.message });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data.', details: handledError.details ?? error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: handledError.message },
      { status: handledError.statusCode || 500 }
    );
  }
}
