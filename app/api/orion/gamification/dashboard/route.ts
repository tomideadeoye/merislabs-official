/**
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides a serverless API endpoint for retrieving comprehensive gamification data for the authenticated user.
 *   - Calculates and tracks the user's productivity streak based on journal entries.
 *   - Evaluates and assigns achievement badges based on various user activities (journal entries, ideas, memory indexing, opportunity evaluations).
 *   - Integrates with Prisma (for JournalEntry, Idea, Opportunity models) and WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES (for Memory entries) to gather necessary data.
 *
 * FILEPATH: `app/api/orion/gamification/dashboard/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/auth`: Used for session authentication to ensure authorized access and retrieve the `userId`.
 *   - `@/lib/logger.ts`: Utilized for comprehensive, context-rich logging throughout the route's execution.
 *   - `@WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILEShq/client`: Integrates with the WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES API to count memory entries, which are stored in a central WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES database.
 *   - `@/lib/types`: Imports `ProductivityStreak`, `AchievementBadge`, and `GamificationDashboardData` for type consistency of data structures.
 *   - `@/generated/prisma`: Imports PrismaClient and Prisma for database interactions with JournalEntry, Idea, and Opportunity models.
 *   - `date-fns`: Used for date manipulation and comparison in streak calculation (e.g., `isToday`, `parseISO`, `differenceInDays`).
 *   - `app/lib/utils/errorHandler.ts`: Imports `handleApiError` for centralized and consistent error handling.
 *   - `app/(orion_admin)/admin/gamification/dashboard/page.tsx` (hypothetical UI path): The frontend component that would consume this API to display the gamification dashboard.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES_API_KEY` and `WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES_DATABASE_ID` are correctly configured in environment variables for WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES integration.
 *   - Assumes a valid user session with a `session.user.id` is available for all operations.
 *   - Streak calculation relies on the `date` field of `JournalEntry` and assumes daily entries for streak progression.
 *   - Memory counting relies on a 'Type' property in WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES database entries set to 'Memory'.
 *
 * NOTES:
 *   - The route combines data from both relational database (Prisma) and NoSQL database (WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES) to compile a holistic gamification view.
 *   - Logging is extensively used at various stages (start, debug, success, error, warn) to provide full traceability and aid in debugging.
 *   - Error handling is consistent, returning appropriate HTTP status codes and detailed error messages.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Performance Optimization**: For very large datasets (e.g., millions of journal entries), consider optimizing database queries (e.g., indexing, server-side pagination for `journalEntry.findMany`).
 *   - **Badge State Persistence**: Instead of re-evaluating all badges on every request, consider persisting unlocked badge states and progress in the database to optimize performance and track historical achievements.
 *   - **Badge Configuration**: Externalize badge definitions and unlock conditions to a configurable source (e.g., database, JSON file) to allow easier modification without code changes.
 *   - **Real-time Updates**: Implement WebSockets or server-sent events to push real-time gamification updates to the frontend, rather than relying solely on client-side polling.
 *   - **Modularity**: Break down `evaluateAchievementBadges` into smaller, more focused functions for each badge category (e.g., `evaluateJournalBadges`, `evaluateIdeaBadges`).
 *   - **Test Coverage**: Add comprehensive unit and integration tests for `calculateProductivityStreak` and `evaluateAchievementBadges` functions to cover all logic paths and edge cases.
 *   - **User Customization**: Allow users to define their own custom goals or badges that can be tracked.
 *   - **WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES API Robustness**: Implement caching mechanisms or more resilient retry logic for WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES API calls, especially for `databases.query`, to improve performance and stability when fetching memory counts.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - **Shared `PrismaClient` Instance**: Ensure a single `PrismaClient` instance is reused across relevant API routes and services to optimize database connections.
 *   - The `logContext` pattern is well-applied here; ensure similar context-rich logging is consistent across other API routes.
 *   - The API successfully consolidates multiple data sources into a single, cohesive dashboard response.
 *   - **Gamification Logic Service**: If gamification features expand significantly, consider abstracting the core gamification logic (streak calculation, badge evaluation) into a dedicated service or module to enhance reusability and separation of concerns.
 */
import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { ProductivityStreak, AchievementBadge, GamificationDashboardData } from '@/lib/types';
import { PrismaClient, Prisma } from '@/generated/prisma';
import { isToday, parseISO, differenceInDays } from 'date-fns';
import { handleApiError } from '@/lib/utils/errorHandler';
import { prisma } from '@/lib/prisma';

const calculateProductivityStreak = async (userId: string): Promise<ProductivityStreak> => {
  const logContext = { userId, function: 'calculateProductivityStreak' };
  logger.info('[GAMIFICATION][STREAK][CALC] Starting streak calculation.', logContext);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dailyGoalMetToday = false;
  let currentStreak = 0;
  let longestStreak = 0;
  let lastCompletionDate: string | null = null;

  try {
    const completedTasks = await prisma.task.findMany({
      where: {
        userId: userId,
        status: 'DONE', // Only consider completed tasks for streaks
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        createdAt: true, // Use createdAt for completion date for tasks
      },
    });

    logger.debug('[GAMIFICATION][STREAK][TASKS_FETCHED]', { ...logContext, count: completedTasks.length });

    if (completedTasks.length === 0) {
      logger.info('[GAMIFICATION][STREAK][NO_ENTRIES] No completed tasks found.', logContext);
      return { currentStreak: 0, longestStreak: 0, lastCompletionDate: null, dailyGoalMet: false };
    }

    let sortedDates = completedTasks.map((task: { createdAt: Date }) => parseISO(task.createdAt.toISOString()));
    sortedDates = sortedDates.sort((a: Date, b: Date) => b.getTime() - a.getTime());

    let tempCurrentStreak = 0;
    let previousDate: Date | null = null;

    for (const entryDate of sortedDates) {
      const entryDay = new Date(entryDate.setHours(0, 0, 0, 0));

      if (isToday(entryDay)) {
        dailyGoalMetToday = true;
      }

      if (previousDate === null) {
        tempCurrentStreak = 1;
      } else {
        const diff = differenceInDays(previousDate, entryDay);
        if (diff === 1) {
          tempCurrentStreak++;
        } else if (diff > 1) {
          if (tempCurrentStreak > longestStreak) {
            longestStreak = tempCurrentStreak;
          }
          tempCurrentStreak = 1;
        }
      }

      if (tempCurrentStreak > longestStreak) {
        longestStreak = tempCurrentStreak;
      }
      previousDate = entryDay;
    }

    if (tempCurrentStreak > currentStreak) {
      currentStreak = tempCurrentStreak;
    }

    lastCompletionDate = sortedDates.length > 0 ? sortedDates[0].toISOString() : null;

    logger.info('[GAMIFICATION][STREAK][CALC_COMPLETE]', {
      ...logContext,
      currentStreak,
      longestStreak,
      dailyGoalMetToday,
    });

    return {
      currentStreak,
      longestStreak,
      lastCompletionDate,
      dailyGoalMet: dailyGoalMetToday,
    };
  } catch (error: unknown) {
    handleApiError(error, logContext); // Log the error, but return default values
    return { currentStreak: 0, longestStreak: 0, lastCompletionDate: null, dailyGoalMet: false };
  }
};

const evaluateAchievementBadges = async (userId: string): Promise<AchievementBadge[]> => {
  const logContext = { userId, function: 'evaluateAchievementBadges' };
  logger.info('[GAMIFICATION][BADGES][EVAL] Starting badge evaluation.', logContext);

  const badges: AchievementBadge[] = [
    {
      id: 'first_journal_entry',
      name: 'First Task Completed',
      description: 'Complete your first task in Orion.',
      icon: 'BookOpen',
      unlocked: false,
      unlockedDate: null,
    },
    {
      id: 'ten_journal_entries',
      name: 'Task Master',
      description: 'Complete 10 tasks in Orion.',
      icon: 'BookOpen',
      unlocked: false,
      unlockedDate: null,
      progress: 0,
      target: 10,
    },
    {
      id: 'first_idea',
      name: 'Idea Seedling',
      description: 'Capture your first idea.',
      icon: 'Lightbulb',
      unlocked: false,
      unlockedDate: null,
    },
    {
      id: 'five_ideas',
      name: 'Idea Cultivator',
      description: 'Capture 5 ideas.',
      icon: 'Lightbulb',
      unlocked: false,
      unlockedDate: null,
      progress: 0,
      target: 5,
    },
    {
      id: 'first_memory_indexed',
      name: 'Memory Weaver',
      description: 'Index your first memory chunk.',
      icon: 'Brain',
      unlocked: false,
      unlockedDate: null,
    },
    {
      id: 'ten_memories_indexed',
      name: 'Memory Master',
      description: 'Index 10 memory chunks.',
      icon: 'Brain',
      unlocked: false,
      unlockedDate: null,
      progress: 0,
      target: 10,
    },
    {
      id: 'first_opportunity_evaluated',
      name: 'Opportunity Scout',
      description: 'Evaluate your first opportunity.',
      icon: 'Briefcase',
      unlocked: false,
      unlockedDate: null,
    },
  ];

  try {
    const completedTasksCount = await prisma.task.count({
      where: { userId: userId, status: 'DONE' },
    });
    logger.debug('[GAMIFICATION][BADGES][COMPLETED_TASKS_COUNT]', { ...logContext, count: completedTasksCount });

    // Update 'First Spark' badge to reflect first completed task
    const firstTaskBadge = badges.find((b) => b.id === 'first_journal_entry'); // Renaming ID in UI later
    if (firstTaskBadge && completedTasksCount >= 1) {
      firstTaskBadge.unlocked = true;
      if (!firstTaskBadge.unlockedDate) firstTaskBadge.unlockedDate = new Date().toISOString();
      firstTaskBadge.name = 'First Task Completed'; // Rename for clarity
      firstTaskBadge.description = 'Complete your first task in Orion.'; // Update description
    }
    // Update 'Journal Enthusiast' badge to reflect ten completed tasks
    const tenTasksBadge = badges.find((b) => b.id === 'ten_journal_entries'); // Renaming ID in UI later
    if (tenTasksBadge) {
      tenTasksBadge.progress = completedTasksCount;
      if (completedTasksCount >= (tenTasksBadge.target || 0)) {
        tenTasksBadge.unlocked = true;
        if (!tenTasksBadge.unlockedDate) tenTasksBadge.unlockedDate = new Date().toISOString();
        tenTasksBadge.name = 'Task Master'; // Rename for clarity
        tenTasksBadge.description = 'Complete 10 tasks in Orion.'; // Update description
      }
    }

    const ideaCount = await prisma.idea.count({
      where: { userId: userId },
    });
    logger.debug('[GAMIFICATION][BADGES][IDEA_COUNT]', { ...logContext, count: ideaCount });

    const firstIdeaBadge = badges.find((b) => b.id === 'first_idea');
    if (firstIdeaBadge && ideaCount >= 1) {
      firstIdeaBadge.unlocked = true;
      if (!firstIdeaBadge.unlockedDate) firstIdeaBadge.unlockedDate = new Date().toISOString();
    }
    const fiveIdeasBadge = badges.find((b) => b.id === 'five_ideas');
    if (fiveIdeasBadge) {
      fiveIdeasBadge.progress = ideaCount;
      if (ideaCount >= (fiveIdeasBadge.target || 0)) {
        fiveIdeasBadge.unlocked = true;
        if (!fiveIdeasBadge.unlockedDate) fiveIdeasBadge.unlockedDate = new Date().toISOString();
      }
    }

    // Memory entries from canonical DB (replace Notion logic)
    const memoryCount = 0;
    // TODO: Implement memory count using Neon/Postgres/Prisma only. For now, set to 0.
    // memoryCount = await prisma.memory.count({ where: { userId } }); // Uncomment and implement if memory table exists

    const firstMemoryBadge = badges.find((b) => b.id === 'first_memory_indexed');
    if (firstMemoryBadge && memoryCount >= 1) {
      firstMemoryBadge.unlocked = true;
      if (!firstMemoryBadge.unlockedDate) firstMemoryBadge.unlockedDate = new Date().toISOString();
    }
    const tenMemoriesBadge = badges.find((b) => b.id === 'ten_memories_indexed');
    if (tenMemoriesBadge) {
      tenMemoriesBadge.progress = memoryCount;
      if (memoryCount >= (tenMemoriesBadge.target || 0)) {
        tenMemoriesBadge.unlocked = true;
        if (!tenMemoriesBadge.unlockedDate) tenMemoriesBadge.unlockedDate = new Date().toISOString();
      }
    }

    const opportunityCount = await prisma.opportunity.count({
      where: { evaluationResult: { not: { equals: null } } }, // Count only evaluated opportunities
    });
    logger.debug('[GAMIFICATION][BADGES][OPPORTUNITY_COUNT]', { ...logContext, count: opportunityCount });

    const firstOpportunityBadge = badges.find((b) => b.id === 'first_opportunity_evaluated');
    if (firstOpportunityBadge && opportunityCount >= 1) {
      firstOpportunityBadge.unlocked = true;
      if (!firstOpportunityBadge.unlockedDate) firstOpportunityBadge.unlockedDate = new Date().toISOString();
    }

    logger.info('[GAMIFICATION][BADGES][EVAL_COMPLETE] Badge evaluation complete.', logContext);
    return badges;
  } catch (error: unknown) {
    handleApiError(error, logContext); // Log the error but return current badges (possibly incomplete)
    return badges; // Return the badges array even if an error occurred during evaluation
  }
};

export async function GET(): Promise<
  NextResponse<{ success: boolean; data?: GamificationDashboardData; error?: string }>
> {
  const logContext = {
    operation: 'fetchGamificationDashboard',
    message: 'Attempting to fetch gamification dashboard data.',
  };
  logger.info('[API][GET][gamification-dashboard][START]', logContext);

  // Removed authentication as per user's request
  // const session = await auth();
  // if (!session || !session.user || !session.user.id) {
  //   logger.warn('[API][GET][gamification-dashboard][UNAUTHORIZED]', { ...logContext, message: 'Unauthorized access attempt.' });
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }
  const userId = 'unauthenticated_user'; // Placeholder for unauthenticated user
  (logContext as { user?: string }).user = userId;

  try {
    const streakData = await calculateProductivityStreak(userId);
    const badges = await evaluateAchievementBadges(userId);

    const totalMemoryChunks = 0;
    // TODO: Implement totalMemoryChunks using Neon/Postgres/Prisma only. For now, set to 0.
    // totalMemoryChunks = await prisma.memory.count({ where: { userId } }); // Uncomment and implement if memory table exists

    const totalIdeas = await prisma.idea.count({
      where: { userId: userId },
    });
    logger.debug('[GAMIFICATION][TOTAL_IDEAS]', { ...logContext, count: totalIdeas });

    const totalOpportunitiesEvaluated = await prisma.opportunity.count({
      where: {
        evaluationResult: {
          not: { equals: null }, // Fix: filter for non-null JSON
        },
      },
    });
    logger.debug('[GAMIFICATION][TOTAL_OPPORTUNITIES_EVALUATED]', {
      ...logContext,
      count: totalOpportunitiesEvaluated,
    });

    const dashboardData: GamificationDashboardData = {
      productivityStreak: streakData,
      achievementBadges: badges,
      totalMemoryChunks,
      totalIdeas,
      totalOpportunitiesEvaluated,
    };

    logger.info('[API][GET][gamification-dashboard][SUCCESS]', { ...logContext, data: dashboardData });
    return NextResponse.json({ success: true, data: dashboardData });
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, logContext); // Centralized error handling
    return NextResponse.json(
      { success: false, error: errorMessage.message },
      { status: errorMessage.statusCode || 500 }
    );
  }
}
