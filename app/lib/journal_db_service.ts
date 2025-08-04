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
import { JournalEntryInput } from './types'; // Import the unified JournalEntryInput type

export async function createJournalEntryInDb(data: JournalEntryInput) {
  try {
    const entry = await prisma.journalEntry.create({
      data: {
        ...data,
        date: new Date(data.date),
        // Ensure attachments is handled as a string array
        attachments: data.attachments || [],
        // Handle JSON fields
        cognitiveDistortionAnalysis: data.cognitiveDistortionAnalysis ? JSON.stringify(data.cognitiveDistortionAnalysis) : undefined,
        // Ensure array fields are properly initialized if undefined
        tags: data.tags || [],
        secondaryEmotions: data.secondaryEmotions || [],
        triggers: data.triggers || [],
        physicalSensations: data.physicalSensations || [],
        copingMechanismsUsed: data.copingMechanismsUsed || [],
      },
    });
    logger.info('[journal_db_service] Journal entry created in DB', {
      id: entry.id,
      userId: data.userId,
      attachments: Array.isArray(entry.attachments) ? entry.attachments : 'NOT ARRAY',
      attachmentsType: typeof entry.attachments,
    });
    return entry;
  } catch (error) {
    logger.error('[journal_db_service] Failed to create journal entry', { error });
    throw error;
  }
}

export async function updateJournalEntryInDb(id: string, data: Partial<JournalEntryInput>) {
  try {
    const entry = await prisma.journalEntry.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
        attachments: data.attachments || [],
        cognitiveDistortionAnalysis: data.cognitiveDistortionAnalysis ? JSON.stringify(data.cognitiveDistortionAnalysis) : undefined,
        tags: data.tags || undefined,
        secondaryEmotions: data.secondaryEmotions || undefined,
        triggers: data.triggers || undefined,
        physicalSensations: data.physicalSensations || undefined,
        copingMechanismsUsed: data.copingMechanismsUsed || undefined,
      },
    });
    logger.info('[journal_db_service] Journal entry updated in DB', {
      id: entry.id,
      userId: entry.userId,
      attachments: Array.isArray(entry.attachments) ? entry.attachments : 'NOT ARRAY',
      attachmentsType: typeof entry.attachments,
    });
    return entry;
  } catch (error) {
    logger.error('[journal_db_service] Failed to update journal entry', { id, error });
    throw error;
  }
}

export async function deleteJournalEntryInDb(id: string) {
  try {
    const entry = await prisma.journalEntry.delete({
      where: { id },
    });
    logger.info('[journal_db_service] Journal entry deleted from DB', { id: entry.id });
    return entry;
  } catch (error) {
    logger.error('[journal_db_service] Failed to delete journal entry', { id, error });
    throw error;
  }
}

export async function getJournalEntriesFromDb(limit: number = 10, offset: number = 0) {
  try {
    const entries = await prisma.journalEntry.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
    logger.info('[journal_db_service] Fetched journal entries from DB', { count: entries.length });
    return entries.map(entry => ({
      ...entry,
      cognitiveDistortionAnalysis: entry.cognitiveDistortionAnalysis ? JSON.parse(entry.cognitiveDistortionAnalysis as string) : null,
    }));
  } catch (error) {
    logger.error('[journal_db_service] Failed to fetch journal entries', { error });
    throw error;
  }
}

export async function getJournalEntryByIdFromDb(id: string) {
  try {
    const entry = await prisma.journalEntry.findUnique({
      where: { id },
    });
    if (entry && entry.cognitiveDistortionAnalysis) {
      return {
        ...entry,
        cognitiveDistortionAnalysis: JSON.parse(entry.cognitiveDistortionAnalysis as string),
      };
    }
    logger.info('[journal_db_service] Fetched single journal entry from DB', { id });
    return entry;
  } catch (error) {
    logger.error('[journal_db_service] Failed to fetch single journal entry', { id, error });
    throw error;
  }
}

