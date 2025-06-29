/**
 * @fileoverview Database service for creating and managing journal entries in Orion.
 * @description Provides functions to create journal entries in the Neon/Postgres database using Prisma. This is the canonical source for all journal entry persistence, replacing legacy WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES logic.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provide a robust, type-safe function to create journal entries in the database.
 *   - Support the journal save API and any other features that require journal persistence.
 *   - Ensure all journal entry creation is centralized and DRY.
 *
 * FILEPATH: app/lib/journal_db_service.ts
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - Consumed by: app/api/orion/journal/save/route.ts (for saving journal entries)
 *   - Uses: app/lib/prisma.ts (Prisma client)
 *   - Related to: schema.prisma (JournalEntry model)
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes Prisma is properly configured and connected to the Neon/Postgres database.
 *   - Assumes the JournalEntry model in schema.prisma matches the fields used here.
 *   - Add more methods for update/delete/list as needed for future features.
 *
 * NOTES:
 *   - [PERFORMANCE OPTIMIZATIONS]: Consider batching or upserting for bulk operations in the future.
 *   - [ERROR HANDLING ROBUSTNESS]: All errors are logged and rethrown for upstream handling.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Add Zod validation for input data.
 *   - Add more granular logging and metrics.
 *   - Implement update/delete/list methods for full CRUD support.
 */
import { prisma } from './prisma';
import logger from './logger';

/**
 * Create a journal entry in the database.
 * @param {Object} params - The journal entry data.
 * @param {string} params.userId - The user ID for the journal entry.
 * @param {Date|string} params.date - The date of the journal entry.
 * @param {string} [params.content] - The content of the journal entry.
 * @returns {Promise<JournalEntry>} The created journal entry.
 *
 * NOTE: Only fields present in the Prisma JournalEntry model are used. Add more fields as needed in the future.
 */
export async function createJournalEntryInDb({
  userId,
  date,
  content,
}: {
  userId: string;
  date: Date | string;
  content?: string;
}) {
  try {
    const entry = await prisma.journalEntry.create({
      data: {
        userId,
        date: new Date(date),
        content,
        // TODO: Add more fields if/when the JournalEntry model is extended
      },
    });
    logger.info('[journal_db_service] Journal entry created in DB', { id: entry.id, userId });
    return entry;
  } catch (error) {
    logger.error('[journal_db_service] Failed to create journal entry', { error });
    throw error;
  }
}
