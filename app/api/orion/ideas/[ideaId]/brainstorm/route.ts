/**
 * GOAL: Brainstorm and develop ideas using LLM, persist logs and context in Neon/Postgres, and store context in memory for future reference.
 * Uses Neon/Postgres (pool from lib/database.ts) for cloud reliability.
 * Related: lib/orion_config.ts, lib/database.ts, reference.md
 */
// GOAL OF FILE|FEATURES|FUNCTIONS:
// This API route handles the brainstorming process for a specific idea, utilizing an LLM to generate content.
// It persists the generated content and related logs in the Neon/Postgres database and also stores relevant context in the memory (Qdrant) for future recall.
// FILEPATH: app/api/orion/ideas/[ideaId]/brainstorm/route.ts
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// - `@/lib/database.ts`: Provides the PostgreSQL client for interacting with the `ideas` and `idea_logs` tables.
// - `@/lib/orion_config.ts`: Contains constants like `ORION_MEMORY_COLLECTION_NAME` for memory storage.
// - `@/lib/types/index.ts`: Defines lib types such as `Idea` and `IdeaLog`.
// - `@/lib/orion_llm.ts`: Contains the `generateLLMResponse` function for interacting with the LLM.
// - `@/lib/logger.ts`: Centralized logging utility for comprehensive tracking of operations.
// - `/api/orion/memory/upsert`: Endpoint for persisting brainstorm content in the vector database.
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// - The LLM is correctly configured and accessible.
// - The Neon/Postgres database is operational and has the `ideas` and `idea_logs` tables. // Assuming 'sql' is the correct export
// NOTES: This route ensures that brainstorming sessions are recorded and can be leveraged for future AI interactions.
// TODOS: Implement more sophisticated error handling for LLM and memory storage failures.
// SUGGESTIONS: Allow for different brainstorming models or techniques to be chosen by the user.
import { NextRequest, NextResponse } from 'next/server';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import { Idea } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import logger from '@/lib/logger';
import { Client, APIResponseError } from '@notionhq/client';
// Removed: import { auth } from '@/auth'; // Authentication removed as per user request
import { handleServerError } from '@/lib/utils/serverErrorHandler'; // Import server error handler
import { HandledApplicationError } from '@/lib/types'; // Import HandledApplicationError

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const notion = NOTION_API_KEY ? new Client({ auth: NOTION_API_KEY }) : null;

export type IdeaStatus = 'new' | 'researching' | 'developing' | 'launched' | 'abandoned' | 'raw_spark';

// Helper function to extract Notion page properties into an Idea object
const notionPageToIdea = (page: unknown): Idea => {
  const properties = (page as { properties: Record<string, unknown> }).properties;
  return {
    id: (page as { id: string }).id,
    title: (properties['Title'] as { title: { plain_text: string }[] })?.title[0]?.plain_text || '',
    description: (properties['Description'] as { rich_text: { plain_text: string }[] })?.rich_text[0]?.plain_text || '',
    status: ((properties['Status'] as { select: { name: IdeaStatus } })?.select?.name as IdeaStatus) || 'raw_spark',
    tags:
      (properties['Tags'] as { multi_select: { name: string }[] })?.multi_select?.map(
        (tag: { name: string }) => tag.name
      ) || [],
    createdAt: (page as { created_time: string }).created_time,
    updatedAt: (page as { last_edited_time: string }).last_edited_time,
    brainstormingNotes:
      (properties['Brainstorming Notes'] as { rich_text: { plain_text: string }[] })?.rich_text[0]?.plain_text || '',
    dueDate: (properties['Due Date'] as { date: { start: string } })?.date?.start || null,
    priority: (properties['Priority'] as { select: { name: string } })?.select?.name || null,
    userId: (properties['User ID'] as { rich_text: { plain_text: string }[] })?.rich_text[0]?.plain_text || null,
  };
};

/**
 * API route for generating brainstorming content for an idea
 */
export async function POST(request: NextRequest, { params }: { params: { ideaId: string } }) {
  const logContext = {
    route: '/api/orion/ideas/[ideaId]/brainstorm',
    timestamp: new Date().toISOString(),
  };
  logger.info('[API][IdeaBrainstorm][POST] Received request for idea brainstorming.', {
    ...logContext,
    ideaId: params.ideaId,
  });

  // Removed authentication check as per user's request
  // const session = await auth(); // Get session
  // if (!session || !session.user || !session.user.id) {
  //   logger.warn('[API][IdeaBrainstorm][POST] Unauthorized access attempt.', logContext);
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }
  // (logContext as { user?: string }).user = session.user.id; // Removed user ID from log context

  let ideaId: string | undefined; // Declare ideaId here

  try {
    ideaId = params.ideaId;
    const { prompt } = await request.json();

    if (!ideaId || !prompt) {
      logger.warn('[API][IdeaBrainstorm][POST] Missing required fields.', { ...logContext, ideaId, prompt: !!prompt });
      return NextResponse.json(
        {
          success: false,
          error: 'Idea ID and prompt are required.',
          message: 'Please provide both an idea ID and a brainstorming prompt.',
        },
        { status: 400 }
      );
    }

    if (!notion || !NOTION_DATABASE_ID) {
      logger.error(
        '[API][IdeaBrainstorm][NOTION_CONFIG_FAIL] Notion client or Database ID not configured.',
        logContext
      );
      return NextResponse.json(
        { success: false, error: 'Notion client or Database ID not configured.' },
        { status: 500 }
      );
    }

    logger.debug('[API][IdeaBrainstorm][POST] Fetching idea from Notion.', { ...logContext, ideaId });
    // Fetch the idea to get its current state (title, description) from Notion
    let ideaPage;
    try {
      ideaPage = await notion.pages.retrieve({ page_id: ideaId });
    } catch (notionFetchError: unknown) {
      const handledError = handleServerError(notionFetchError, { ...logContext, stage: 'notion_fetch' }); // Use handleServerError
      logger.error('[API][IdeaBrainstorm][NOTION_FETCH_ERROR] Error fetching idea from Notion.', {
        ...logContext,
        ideaId,
        error: handledError.message,
        stack: handledError.originalError instanceof Error ? handledError.originalError.stack : undefined,
      });
      return NextResponse.json(
        {
          success: false,
          error: handledError.message,
          details: handledError.details,
        },
        { status: handledError.statusCode || 500 }
      );
    }

    const idea = notionPageToIdea(ideaPage);

    if (!idea || !idea.title) {
      logger.warn('[API][IdeaBrainstorm][POST] Idea not found or invalid in Notion.', {
        ...logContext,
        ideaId,
        ideaPage,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Idea not found or invalid.',
          message: `Idea with ID ${ideaId} not found or has missing title.`,
        },
        { status: 404 }
      );
    }

    logger.info('[API][IdeaBrainstorm][POST] Idea fetched successfully from Notion. Constructing LLM prompt.', {
      ...logContext,
      ideaId,
      ideaTitle: idea.title,
    });
    // Construct prompt for LLM
    const llmPrompt = `
      As an AI assistant, your task is to brainstorm and generate detailed, creative ideas related to the following prompt, focusing on expanding the concept of the idea. Ensure the output is well-structured and provides actionable insights or further questions. Provide different angles or perspectives.\n\n      Idea Title: ${idea.title}\n      Idea Description: ${idea.description || 'No description provided.'}\n      User Prompt: ${prompt}\n\n      Generate a comprehensive brainstorm response based on the above.
    `;

    logger.debug('[API][IdeaBrainstorm][POST] Calling LLM for brainstorm content.', {
      ...logContext,
      requestType: REQUEST_TYPES.IDEA_BRAINSTORM,
    });
    // Call LLM for brainstorm content
    const llmResponse = await generateLLMResponse(REQUEST_TYPES.IDEA_BRAINSTORM, llmPrompt, null); // userId is now nullable

    let brainstormContent: string;
    if (llmResponse.success) {
      brainstormContent = llmResponse.content;
      logger.info('[API][IdeaBrainstorm][POST] LLM brainstorm content generated successfully.', logContext);
    } else {
      const handledError = handleServerError(llmResponse.error, { ...logContext, stage: 'llm_generation' }); // Use handleServerError
      logger.error('[API][IdeaBrainstorm][POST] Failed to generate brainstorm content from LLM.', {
        ...logContext,
        error: handledError.message,
        stack: handledError.originalError instanceof Error ? handledError.originalError.stack : undefined,
      });
      // It's already a HandledApplicationError, re-throw it directly.
      throw handledError;
    }

    // Update Notion page with brainstorm content
    const currentBrainstormNotes = idea.brainstormingNotes || '';
    const newBrainstormNotes = `${currentBrainstormNotes}\n\n---\n\n**Brainstorming Session (${new Date().toLocaleString()}):**\n${brainstormContent}`;

    try {
      await notion.pages.update({
        page_id: ideaId,
        properties: {
          'Brainstorming Notes': {
            rich_text: [{ text: { content: newBrainstormNotes } }],
          },
          'Last Brainstormed At': {
            // Add a new property to track last brainstorm date
            date: { start: new Date().toISOString() },
          },
        },
      });
      logger.info('[API][IdeaBrainstorm][POST] Notion page successfully updated with brainstorm content.', {
        ...logContext,
        ideaId,
      });
    } catch (notionUpdateError: unknown) {
      const handledError = handleServerError(notionUpdateError, { ...logContext, stage: 'notion_update' }); // Use handleServerError
      logger.error('[API][IdeaBrainstorm][NOTION_UPDATE_ERROR] Error updating Notion page with brainstorm content.', {
        ...logContext,
        ideaId,
        error: handledError.message,
        stack: handledError.originalError instanceof Error ? handledError.originalError.stack : undefined,
      });
      // Continue even if Notion update fails, as the brainstorm was generated.
    }

    logger.debug('[API][IdeaBrainstorm][POST] Attempting to store brainstorm in memory (Qdrant).', { ...logContext });
    // Store in memory for future reference (Qdrant)
    try {
      const memoryPoint = {
        id: uuidv4(),
        payload: {
          text: brainstormContent,
          source_id: `idea_brainstorm_${ideaId}`,
          type: 'idea_brainstorm',
          related_idea_id: ideaId,
          related_idea_title: idea.title,
          timestamp: new Date().toISOString(),
          tags: ['idea', 'brainstorm', ...(idea.tags || [])],
        },
      };

      await fetch('/api/orion/memory/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          points: [memoryPoint],
          collectionName: ORION_MEMORY_COLLECTION_NAME,
        }),
      });
      logger.info('[API][IdeaBrainstorm][POST] Brainstorm content successfully stored in memory (Qdrant).', {
        ...logContext,
        memoryPointId: memoryPoint.id,
      });
    } catch (memoryError: unknown) {
      const handledError = handleServerError(memoryError, { ...logContext, stage: 'memory_storage' }); // Use handleServerError
      logger.error('[API][IdeaBrainstorm][MEMORY_STORAGE_ERROR] Error storing brainstorm in memory (Qdrant):', {
        ...logContext,
        error: handledError.message,
        stack: handledError.originalError instanceof Error ? handledError.originalError.stack : undefined,
      });
      // Continue even if memory storage fails
    }

    logger.info('[API][IdeaBrainstorm][POST] Brainstorm process completed successfully.', { ...logContext, ideaId });
    return NextResponse.json({ success: true, brainstorm: brainstormContent });
  } catch (error: unknown) {
    const handledError = handleServerError(error, { ...logContext, stage: 'overall_brainstorm_process' }); // Use handleServerError for overall catch
    logger.error('[API][IdeaBrainstorm][FATAL_ERROR]', {
      ...logContext,
      error: handledError.message,
      stack: handledError.originalError instanceof Error ? handledError.originalError.stack : undefined,
    });
    return NextResponse.json(
      { success: false, error: handledError.message, details: handledError.details },
      { status: handledError.statusCode || 500 }
    );
  }
}
