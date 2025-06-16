/**
 * GOAL: Brainstorm and develop ideas using LLM, persist logs and context in Neon/Postgres, and store context in memory for future reference.
 * Uses Neon/Postgres (pool from lib/database.ts) for cloud reliability.
 * Related: lib/orion_config.ts, lib/database.ts, reference.md
 */
// GOAL OF FILE|FEATURES|FUNCTIONS:
// FILEPATH:
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunties to consolidate
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/shared/lib/postgres';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import type { IdeaLog } from '@/app/shared/types/ideas';
import { v4 as uuidv4 } from 'uuid';
import { Idea } from '@/app/shared/types/ideas';
import { generateLLMResponse } from '@/app/shared/lib/orion_llm';
import { REQUEST_TYPES as OriginalRequestTypes } from '@/app/shared/lib/orion_llm'; // Rename original import
import { logger } from '@/app/shared/lib/logger';

const REQUEST_TYPES = OriginalRequestTypes; // Re-assign to force type inference

/**
 * API route for generating brainstorming content for an idea
 */
export async function POST(req: NextRequest, { params }: { params: { ideaId: string } }) {
  logger.info('[API][IdeaBrainstorm][POST] Received request for idea brainstorming.', { ideaId: params.ideaId });

  try {
    const { ideaId } = params;
    const { prompt } = await req.json();

    if (!ideaId || !prompt) {
      logger.warn('[API][IdeaBrainstorm][POST] Missing required fields.', { ideaId, prompt: !!prompt });
      return NextResponse.json({ success: false, error: 'Idea ID and prompt are required.' }, { status: 400 });
    }

    logger.debug('[API][IdeaBrainstorm][POST] Fetching idea from database.', { ideaId });
    // Fetch the idea to get its current state (title, description)
    const ideaResult = await query<Idea>('SELECT id, title, description FROM ideas WHERE id = $1', [ideaId]);

    const idea = ideaResult.rows[0];

    if (!idea) {
      logger.warn('[API][IdeaBrainstorm][POST] Idea not found.', { ideaId });
      return NextResponse.json({ success: false, error: 'Idea not found.' }, { status: 404 });
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
      brainstormContent = llmResponse.content as string;
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
      },
      { status: 500 }
    );
  }
}
