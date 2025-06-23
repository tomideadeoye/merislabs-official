/**
 * @fileoverview Legacy Habitica Task Scoring API (Migration in Progress)
 * @description Handles task scoring operations through Habitica's API as part of our phased migration to
 * a Neon Postgres-based agentic workflow. This route will be deprecated once all task management features
 * have been ported to the new system. New development should focus on `app/(orion_admin)/admin/agentic-workflow/`.
 *
 * PERSONAL APP CONTEXT:
 *   - Designed exclusively for Tomide's personal use
 *   - No authentication implemented as this is a single-user system
 *   - Not intended for public deployment or multi-user scenarios
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provide endpoint for updating task scores in Habitica
 *   - Handle error scenarios and logging for scoring operations
 *   - Integrate with Orion's logging and configuration systems
 *
 * FILEPATH: app/api/orion/habitica/score/route.ts
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/lib/habitica_client`: Core Habitica API client used for actual scoring operations
 *   - `@/lib/logger`: Central logging system for tracking scoring attempts and errors
 *   - `app/components/orion/Habitica/`: UI components that trigger scoring requests
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - PERSONAL APP CONTEXT: This is a personal application for Tomide's use only
 *   - Authentication removed as this is a locally-run personal tool
 *   - Assumes HABITICA_USER_ID and HABITICA_API_TOKEN are set in environment
 *   - Uses placeholder user ID since authentication is disabled
 *
 * NOTES:
 *   - Error handling includes detailed logging but could benefit from retry logic
 *   - Input validation currently minimal due to controlled client usage
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Implement Zod schema validation for request body
 *   - Add caching for frequent scoring operations
 *   - Consider rate limiting for Habitica API protection
 */
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { scoreTask } from '@/lib/habitica_client';

interface LogContextType {
  route: string;
  timestamp: string;
  userId?: string;
  operation?: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  const logContext: LogContextType = {
    route: '/api/orion/habitica/score',
    timestamp: new Date().toISOString(),
    operation: 'POST',
  };
  logger.info('[HABITICA_SCORE_API][POST][START] Received request to score a Habitica task.', logContext);

  // Authentication deliberately removed - Personal app for Tomide's exclusive use
  // Previous auth implementation:
  // const session = await getServerSession(authConfig);
  // if (!session || !session.user || !session.user.id) {
  //   logger.warn('[HABITICA_SCORE_API][POST][AUTH_FAIL] Unauthorized access attempt.', logContext);
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  // Use a placeholder userId since authentication is removed
  const userId = 'unauthenticated_user';
  logContext.userId = userId;

  try {
    const { taskId, direction } = await request.json();

    if (!taskId || !direction) {
      logger.warn('[HABITICA_SCORE_API][POST][VALIDATION_FAIL] Missing taskId or direction.', logContext);
      return NextResponse.json({ success: false, error: 'Task ID and direction are required.' }, { status: 400 });
    }

    const habiticaUserId = process.env.HABITICA_USER_ID;
    const habiticaApiToken = process.env.HABITICA_API_TOKEN;

    if (!habiticaUserId || !habiticaApiToken) {
      logger.error('[HABITICA_SCORE_API][POST][CONFIG_ERROR] Habitica API credentials not configured.', logContext);
      return NextResponse.json({ success: false, error: 'Habitica API credentials not configured.' }, { status: 500 });
    }

    logger.debug('[HABITICA_SCORE_API][POST][PROCESSING] Scoring Habitica task.', { ...logContext, taskId, direction });

    const scoredTask = await scoreTask(taskId, direction, habiticaUserId, habiticaApiToken);

    logger.success('[HABITICA_SCORE_API][POST][SUCCESS] Habitica task scored successfully.', {
      ...logContext,
      taskId,
      direction,
      score: scoredTask.value,
    });
    return NextResponse.json({ success: true, task: scoredTask });
  } catch (error: unknown) {
    logger.error('[HABITICA_SCORE_API][POST][ERROR] Failed to score Habitica task.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to score Habitica task.' }, { status: 500 });
  }
}
