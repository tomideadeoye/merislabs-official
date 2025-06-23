/**
 * FILEPATH: `app/api/orion/habitica/tasks/route.ts`
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides the API route for fetching Habitica tasks within the Orion application.
 *   - Fetches tasks from the external Habitica API and then augments them with origin information (e.g., source module, reference ID) from the internal PostgreSQL (Neon) database.
 *   - Ensures comprehensive logging throughout the process for observability and debugging.
 *   - Replaced previous SQLite interactions with Prisma for improved type safety and scalability.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/habitica/page.tsx`: This frontend page likely consumes this API to display user Habitica tasks.
 *   - `@/lib/habitica_client.ts`: Used to interact with the external Habitica API to fetch raw task data.
 *   - `@/lib/types`: Defines `HabiticaTask` and `HabiticaTaskLinkRow` for data structures.
 *   - `@/generated/prisma`: Provides the `PrismaClient` for interactions with the internal database.
 *   - `prisma/schema.prisma`: Defines the `HabiticaTaskLink` model, crucial for augmenting tasks with Orion-specific origin data.
 *   - `lib/logger.ts`: Although direct `console` calls are used, future integration with this centralized logger is intended for consistent and context-rich logging.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `HABITICA_USER_ID` and `HABITICA_API_TOKEN` environment variables are correctly configured for Habitica API access.
 *   - Handles cases where `userId` or `apiToken` are not provided in the request body, falling back to environment variables.
 *   - Optimistically updates the UI during drag-and-drop operations, with a rollback mechanism on backend update failure.
 *   - Assumes `onStatusChange` prop will handle the actual backend status update for Kanban board changes.
 *
 * NOTES:
 *   - This route is a vital part of the Habitica integration, providing a synchronized view of user tasks.
 *   - The transition from raw SQL to Prisma for `habitica_task_links` ensures more robust and type-safe database operations.
 *   - Consider implementing the centralized `logger` utility for all console output for unified logging and enhanced observability.
 */
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { getTasks } from '@/lib/habitica_client';
import type { HabiticaTask } from '@/lib/types';
import { PrismaClient } from '@/generated/prisma';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const logContext = {
    route: '/api/orion/habitica/tasks',
    timestamp: new Date().toISOString(),
  };
  try {
    logger.info('[HABITICA_TASKS][START]', logContext);

    const { userId, apiToken } = await req.json();

    // Use env vars if not provided
    const finalUserId = userId || process.env.HABITICA_USER_ID;
    const finalApiToken = apiToken || process.env.HABITICA_API_TOKEN;

    if (!finalUserId || !finalApiToken) {
      logger.warn('[HABITICA_TASKS][VALIDATION_FAIL] Missing userId or apiToken.', { ...logContext });
      return NextResponse.json(
        {
          success: false,
          error: 'Habitica User ID and API Token are required',
        },
        { status: 400 }
      );
    }

    // Fetch all tasks using the lib client
    let allTasks: HabiticaTask[] = [];
    try {
      allTasks = await getTasks(finalUserId, finalApiToken);
      logger.info('[HABITICA_TASKS][FETCHED]', {
        count: allTasks.length,
        ...logContext,
      });
    } catch (fetchErr: unknown) {
      logger.error('[HABITICA_TASKS][ERROR_FETCHING]', {
        fetchErr: fetchErr instanceof Error ? fetchErr.message : String(fetchErr),
        ...logContext,
      });
      throw fetchErr; // Re-throw to propagate the error
    }

    // Filter by type if requested, else return all types
    const todos = allTasks.filter((t) => t.type === 'todo');
    const dailys = allTasks.filter((t) => t.type === 'daily');
    const habits = allTasks.filter((t) => t.type === 'habit');
    const rewards = allTasks.filter((t) => t.type === 'reward');

    // Augment tasks with origin information from Postgres
    const augment = async (tasks: HabiticaTask[]) => {
      return Promise.all(
        tasks.map(async (task: HabiticaTask) => {
          if (!task._id) {
            logger.debug('[HABITICA_TASKS][DB][SKIP_AUGMENT] Task has no _id, skipping database augmentation.', {
              taskId: task._id,
            });
            return task;
          }
          try {
            logger.debug('[HABITICA_TASKS][DB][QUERY_START] Querying habitica_task_links for task.', {
              taskId: task._id,
              ...logContext,
            });
            const habiticaLinks = await prisma.habiticaTaskLink.findMany({
              where: {
                habiticaTaskId: task._id,
              },
              select: {
                orionSourceModule: true,
                orionSourceReferenceId: true,
                createdAt: true,
              },
            });

            if (habiticaLinks && habiticaLinks.length > 0) {
              logger.info('[HABITICA_TASKS][DB][FOUND_ORIGIN]', {
                taskId: task._id,
                linkCount: habiticaLinks.length,
                ...logContext,
              });
              return {
                ...task,
                orionOrigin: habiticaLinks[0], // Assuming one origin per task for now, adjust if multiple are possible
              };
            }
            logger.debug('[HABITICA_TASKS][DB][NO_ORIGIN_FOUND] No origin found for task.', {
              taskId: task._id,
              ...logContext,
            });
            return task;
          } catch (dbError: unknown) {
            logger.error('[HABITICA_TASKS][DB][ERROR_FETCHING_ORIGIN]', {
              taskId: task._id,
              dbError: dbError instanceof Error ? dbError.message : String(dbError),
              ...logContext,
            });
            return task; // Return original task if DB error
          }
        })
      );
    };

    const [augTodos, augDailys, augHabits, augRewards] = await Promise.all([
      augment(todos),
      augment(dailys),
      augment(habits),
      augment(rewards),
    ]);

    logger.info('[HABITICA_TASKS][SUCCESS]', logContext);

    return NextResponse.json({
      success: true,
      todos: augTodos,
      dailys: augDailys,
      habits: augHabits,
      rewards: augRewards,
    });
  } catch (error: unknown) {
    logger.error('[HABITICA_TASKS][ERROR]', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
