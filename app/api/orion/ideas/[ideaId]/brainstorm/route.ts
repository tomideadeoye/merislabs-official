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
import { QueryDatabaseParameters, UpdatePageParameters } from '@notionhq/client/build/src/api-endpoints';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const notion = NOTION_API_KEY ? new Client({ auth: NOTION_API_KEY }) : null;

type IdeaStatus = 'new' | 'researching' | 'developing' | 'launched' | 'abandoned' | 'raw_spark';

// Helper function to extract Notion page properties into an Idea object
const notionPageToIdea = (page: any): Idea => {
  const properties = page.properties;
  return {
    id: page.id,
    title: properties['Title']?.title[0]?.plain_text || '',
    description: properties['Description']?.rich_text[0]?.plain_text || '',
    status: (properties['Status']?.select?.name as IdeaStatus) || 'raw_spark',
    tags: properties['Tags']?.multi_select?.map((tag: { name: string }) => tag.name) || [],
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
    brainstormingNotes: properties['Brainstorming Notes']?.rich_text[0]?.plain_text || '',
    dueDate: properties['Due Date']?.date?.start || null,
    priority: properties['Priority']?.select?.name || null,
    userId: properties['User ID']?.rich_text[0]?.plain_text || null, // Assuming a User ID property in Notion
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
      logger.error('[API][IdeaBrainstorm][NOTION_FETCH_ERROR] Error fetching idea from Notion.', {
        ...logContext,
        ideaId,
        error: notionFetchError,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch idea from Notion.',
          details: notionFetchError instanceof Error ? notionFetchError.message : String(notionFetchError),
        },
        { status: 500 }
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
      As an AI assistant, your task is to brainstorm and generate detailed, creative ideas related to the following prompt, focusing on expanding the concept of the idea. Ensure the output is well-structured and provides actionable insights or further questions. Provide different angles or perspectives.\n\n      Idea Title: ${idea.title}\n      Idea Description: ${idea.description || 'No description provided.'}\n      User Prompt: ${prompt}\n\n      Generate a comprehensive brainstorm response based on the above. Structure your response clearly.
    `;

    logger.debug('[API][IdeaBrainstorm][POST] Calling LLM for brainstorm content.', {
      ...logContext,
      requestType: REQUEST_TYPES.IDEA_BRAINSTORM,
    });
    // Call LLM for brainstorm content
    const llmResponse = await generateLLMResponse(REQUEST_TYPES.IDEA_BRAINSTORM, llmPrompt);

    let brainstormContent: string;
    if (llmResponse.success) {
      brainstormContent = llmResponse.content;
      logger.info('[API][IdeaBrainstorm][POST] LLM brainstorm content generated successfully.', logContext);
    } else {
      logger.error('[API][IdeaBrainstorm][POST] Failed to generate brainstorm content from LLM.', {
        ...logContext,
        error: llmResponse.error,
      });
      throw new Error(llmResponse.error || 'Failed to generate brainstorm content from LLM.');
    }

    logger.debug('[API][IdeaBrainstorm][POST] Updating Notion page with brainstorm content.', {
      ...logContext,
      ideaId,
    });
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
      logger.error('[API][IdeaBrainstorm][NOTION_UPDATE_ERROR] Error updating Notion page with brainstorm content.', {
        ...logContext,
        ideaId,
        error: notionUpdateError,
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
      logger.error('[API][IdeaBrainstorm][MEMORY_STORAGE_ERROR] Error storing brainstorm in memory (Qdrant):', {
        ...logContext,
        error: memoryError instanceof Error ? memoryError.message : String(memoryError),
      });
      // Continue even if memory storage fails
    }

    logger.info('[API][IdeaBrainstorm][POST] Brainstorm process completed successfully.', { ...logContext, ideaId });
    return NextResponse.json({ success: true, brainstorm: brainstormContent });
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    let errorDetails: any = {};

    if (error instanceof APIResponseError) {
      errorMessage = `Notion API Error: ${error.message}`;
      errorDetails = { code: error.code, status: error.status, body: error.body };
      logger.error('[API][IdeaBrainstorm][NOTION_API_ERROR]', {
        ...logContext,
        error: errorMessage,
        details: errorDetails,
      });
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = { stack: error.stack };
      logger.error('[API][IdeaBrainstorm][GENERAL_ERROR]', {
        ...logContext,
        error: errorMessage,
        details: errorDetails,
      });
    } else {
      logger.error('[API][IdeaBrainstorm][UNKNOWN_ERROR]', { ...logContext, error: String(error) });
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: `Failed to brainstorm for idea ${ideaId || '[ID_UNKNOWN]'}: ${errorMessage}`,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
