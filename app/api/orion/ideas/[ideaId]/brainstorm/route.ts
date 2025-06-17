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
// - `@/lib/types/index.ts`: Defines shared types such as `Idea` and `IdeaLog`.
// - `@/lib/orion_llm.ts`: Contains the `generateLLMResponse` function for interacting with the LLM.
// - `@/lib/logger.ts`: Centralized logging utility for comprehensive tracking of operations.
// - `/api/orion/memory/upsert`: Endpoint for persisting brainstorm content in the vector database.
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// - The LLM is correctly configured and accessible.
// - The Neon/Postgres database is operational and has the `ideas` and `idea_logs` tables.
// NOTES: This route ensures that brainstorming sessions are recorded and can be leveraged for future AI interactions.
// TODOS: Implement more sophisticated error handling for LLM and memory storage failures.
// SUGGESTIONS: Allow for different brainstorming models or techniques to be chosen by the user.
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import { Idea, IdeaLog } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import logger from '@/lib/logger'; 

/**
 * API route for generating brainstorming content for an idea
 */
export async function POST(request: NextRequest, { params }: { params: { ideaId: string } }) {
  logger.info('[API][IdeaBrainstorm][POST] Received request for idea brainstorming.', { ideaId: params.ideaId });

  let ideaId: string | undefined; // Declare ideaId here

  try {
    ideaId = params.ideaId; // Assign value here
    const { prompt } = await request.json();

    if (!ideaId || !prompt) {
      logger.warn('[API][IdeaBrainstorm][POST] Missing required fields.', { ideaId, prompt: !!prompt });
      return NextResponse.json(
        {
          success: false,
          error: 'Idea ID and prompt are required.',
          message: 'Please provide both an idea ID and a brainstorming prompt.',
        },
        { status: 400 }
      );
    }

    logger.debug('[API][IdeaBrainstorm][POST] Fetching idea from database.', { ideaId });
    // Fetch the idea to get its current state (title, description)
    const ideaResult = await query<Idea>('SELECT id, title, description FROM ideas WHERE id = $1', [ideaId]);

    const idea = ideaResult.rows[0];

    if (!idea) {
      logger.warn('[API][IdeaBrainstorm][POST] Idea not found.', { ideaId });
      return NextResponse.json(
        { success: false, error: 'Idea not found.', message: `Idea with ID ${ideaId} not found.` },
        { status: 404 }
      );
    }

    logger.info('[API][IdeaBrainstorm][POST] Idea fetched successfully. Constructing LLM prompt.', {
      ideaId,
      ideaTitle: idea.title,
    });
    // Construct prompt for LLM
    const llmPrompt = `
      As an AI assistant, your task is to brainstorm and generate detailed, creative ideas related to the following prompt, focusing on expanding the concept of the idea. Ensure the output is well-structured and provides actionable insights or further questions.\n\n      Idea Title: ${idea.title}\n      Idea Description: ${idea.description}\n      User Prompt: ${prompt}\n\n      Generate a comprehensive brainstorm response based on the above. Structure your response clearly.
    `;

    logger.debug('[API][IdeaBrainstorm][POST] Calling LLM for brainstorm content.', {
      requestType: REQUEST_TYPES.IDEA_BRAINSTORM,
    });
    // Call LLM for brainstorm content
    const llmResponse = await generateLLMResponse(REQUEST_TYPES.IDEA_BRAINSTORM, llmPrompt);

    let brainstormContent: string;
    if (llmResponse.success) {
      brainstormContent = llmResponse.content;
      logger.info('[API][IdeaBrainstorm][POST] LLM brainstorm content generated successfully.');
    } else {
      logger.error('[API][IdeaBrainstorm][POST] Failed to generate brainstorm content from LLM.', {
        error: llmResponse.error,
      });
      throw new Error(llmResponse.error || 'Failed to generate brainstorm content from LLM.');
    }

    logger.debug('[API][IdeaBrainstorm][POST] Logging brainstorm content to idea_logs.');
    // Log brainstorm content to idea_logs
    const brainstormLog: IdeaLog = {
      id: uuidv4(),
      ideaId: ideaId,
      timestamp: new Date().toISOString(),
      logType: 'llm_brainstorm',
      details: 'Generated brainstorm content using LLM.',
      action: 'LLM Brainstorm',
      type: 'llm_brainstorm',
      content: brainstormContent,
      author: 'Orion AI',
    };

    await query(
      `
      INSERT INTO idea_logs (
        id, "ideaId", timestamp, "logType", details, action, type, content, author
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
      [
        brainstormLog.id,
        brainstormLog.ideaId,
        brainstormLog.timestamp,
        brainstormLog.logType,
        brainstormLog.details,
        brainstormLog.action,
        brainstormLog.type,
        brainstormLog.content,
        brainstormLog.author,
      ]
    );
    logger.info('[API][IdeaBrainstorm][POST] Brainstorm content successfully logged to idea_logs.', {
      logId: brainstormLog.id,
    });

    logger.debug('[API][IdeaBrainstorm][POST] Attempting to store brainstorm in memory.');
    // Store in memory for future reference
    try {
      const memoryPoint = {
        id: uuidv4(),
        payload: {
          text: brainstormContent,
          source_id: `idea_brainstorm_${brainstormLog.id}`,
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
      logger.info('[API][IdeaBrainstorm][POST] Brainstorm content successfully stored in memory.', {
        memoryPointId: memoryPoint.id,
      });
    } catch (memoryError: unknown) {
      logger.error('[API][IdeaBrainstorm][POST] Error storing brainstorm in memory:', {
        error: memoryError instanceof Error ? memoryError.message : String(memoryError),
      });
      // Continue even if memory storage fails
    }

    logger.info('[API][IdeaBrainstorm][POST] Brainstorm process completed successfully.', { ideaId });
    return NextResponse.json({ success: true, brainstorm: brainstormContent });
  } catch (error: unknown) {
    logger.error('[API][IdeaBrainstorm][POST] Unexpected error during brainstorming:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'N/A',
    });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred.',
        message: `Failed to brainstorm for idea ${ideaId || '[ID_UNKNOWN]'}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
