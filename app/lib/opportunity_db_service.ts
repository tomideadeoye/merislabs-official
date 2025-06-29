/**
 * @fileoverview Database service layer for opportunity management operations.
 * @description Provides type-safe, transactional operations for CRUD operations on opportunities within Orion's PostgreSQL database. Integrates Prisma ORM with application-specific business logic.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides a dedicated service for interacting with the Neon PostgreSQL database for opportunity management.
 *   - Abstracts direct SQL queries, ensuring type safety, consistent data mapping, and robust error handling for opportunity-related operations (list, create, update).
 *   - Uses the Prisma Opportunity model as the canonical type for all internal logic and API responses. UI-specific mapping and transformation (e.g., Date to string, enum mapping) should be handled in the UI layer, not here.
 *
 * FILEPATH: `app/lib/opportunity_db_service.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `../generated/prisma`: Imports the Prisma Client for type-safe database interactions.
 *   - `app/lib/types/index.ts`: Defines UI-specific types, but the canonical type here is the Prisma model.
 *   - `app/lib/logger.ts`: Used for comprehensive, context-rich logging of all database operations within this service.
 *   - `app/api/orion/opportunity/list/route.ts`: Consumes `listOpportunitiesFromDb` to fetch opportunities for the API.
 *   - `app/api/orion/opportunity/create/route.ts`: Consumes `createOpportunityInDb` to add new opportunities via the API.
 *   - `app/api/orion/opportunity/update-status/route.ts`: Consumes `updateOpportunityStatusInDb` to modify opportunity statuses via the API.
 *   - `app/hooks/useOpportunities.ts`: Indirectly uses these database functions via the API routes to manage opportunity data in the UI.
 *   - `prisma/schema.prisma`: Defines the Prisma schema, dictating data structure and constraints, and from which the Prisma Client is generated.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the Neon database is correctly configured and accessible via `DATABASE_URL` environment variable.
 *   - Prisma now handles mapping `TEXT[]` to `String[]` and custom ENUM types.
 *   - NOTE: Error handling is robust, logging details and re-throwing custom errors for upstream consumption.
 *
 * NOTES:
 *   - COMPONENTS TO MERGE WITH: This service acts as a single point of data access for opportunities, centralizing logic previously spread across WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES API calls and mock data.
 *   - **Performance Optimization**: Implement more advanced filtering, pagination, and sorting directly at the database query level for large datasets.
 *   - **Transaction Support**: Consider adding transaction support for multi-step operations to ensure atomicity and data consistency.
 *   - **Soft Deletion**: For opportunities, instead of hard deleting, consider implementing a soft delete mechanism (e.g., using a `deletedAt` timestamp) to retain historical data and allow for recovery.
 *   - **Auditing Fields**: Introduce common auditing fields (e.g., `createdBy`, `updatedBy`, `createdAt`, `updatedAt` for records beyond just the standard Prisma ones) to track changes and responsible users.
 *   - **Batch Operations**: Implement functions for batch creation, updating, or deleting opportunities to improve efficiency for bulk operations.
 *   - **Data Caching**: For frequently accessed opportunities or lists, explore adding a caching layer (e.g., Redis or in-memory cache) to reduce database load and improve response times.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - **Generic Database Service**: If similar database interaction patterns emerge for other entities (e.g., journal entries, ideas), consider abstracting common CRUD operations into a more generic database service utility.
 *   - **Type Mapping Utility**: If UI-specific mapping is needed, implement it in the UI layer, not here.
 *   - This service is a consolidation of opportunity data persistence logic.
 *
 * NOTE: This file only uses types directly from Prisma and returns raw Opportunity objects. All transformation (e.g., Date to string, enum mapping) must be handled in the UI layer. All mapping helpers and unused functions have been removed for DRYness and type safety. See README for canonical type policy.
 */
import { Prisma } from '@prisma/client';
import { Opportunity, $Enums } from '@/lib/types';
import { EvaluationGapDetail, EvaluationOutput } from '@/lib/types';
import logger from '@/lib/logger';
import prisma from './prisma'; // Import the lib Prisma Client instance
import { handleApiError, HandledApplicationError } from '@/lib/utils/errorHandler'; // Import HandledApplicationError from errorHandler

/**
 * @function getOpportunityByIdFromDb
 * @description Fetches an opportunity by its ID from the database.
 * @param id The ID of the opportunity to fetch.
 * @returns The Opportunity object if found, null if not found, or a HandledApplicationError on database error.
 */
/**
 * Fetches an opportunity by its ID from the database.
 * @param id The ID of the opportunity to fetch.
 * @returns The Opportunity object if found, null if not found, or a HandledApplicationError on database error.
 */
export async function getOpportunityByIdFromDb(id: string): Promise<Opportunity | null | HandledApplicationError> {
  const logContext = {
    service: 'opportunity_db_service',
    function: 'getOpportunityByIdFromDb',
    id: id,
    queryComplexity: 'SINGLE_RECORD',
    cacheStatus: 'NONE',
  };
  logger.debug('[OPPORTUNITY_DB_SERVICE][GET_BY_ID][PARAMS]', { ...logContext, id });
  logger.info('[OPPORTUNITY_DB_SERVICE][GET_BY_ID][START]', logContext);
  try {
    logger.debug('[OPPORTUNITY_DB_SERVICE][GET_BY_ID][QUERY]', { ...logContext, query: { id } });
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
    });
    logger.debug('[OPPORTUNITY_DB_SERVICE][GET_BY_ID][RESULT]', { ...logContext, found: !!opportunity, opportunity });
    if (!opportunity) {
      logger.warn('[OPPORTUNITY_DB_SERVICE][GET_BY_ID][NOT_FOUND]', logContext);
      return null;
    }
    logger.info('[OPPORTUNITY_DB_SERVICE][GET_BY_ID][SUCCESS]', logContext);
    return opportunity;
  } catch (error: unknown) {
    const handledError = handleApiError(error, logContext);
    logger.error('[OPPORTUNITY_DB_SERVICE][GET_BY_ID][ERROR] Failed to fetch opportunity.', { ...logContext, error });
    return handledError;
  }
}

/**
 * @function listOpportunitiesFromDb
 * @description Fetches a list of opportunities from the Neon database.
 * @returns A promise that resolves to an array of Opportunity objects or a HandledApplicationError.
 */
/**
 * Fetches a list of opportunities from the Neon database.
 * @returns A promise that resolves to an array of Opportunity objects or a HandledApplicationError.
 */
export async function listOpportunitiesFromDb(): Promise<Opportunity[] | HandledApplicationError> {
  const logContext = { service: 'opportunity_db_service', function: 'listOpportunitiesFromDb' };
  logger.debug('[OPPORTUNITY_DB_SERVICE][LIST_OPPORTUNITIES][PARAMS]', logContext);
  logger.info(
    '[OPPORTUNITY_DB_SERVICE][LIST_OPPORTUNITIES][START] Attempting to fetch opportunities from Neon DB.',
    logContext
  );

  try {
    logger.debug('[OPPORTUNITY_DB_SERVICE][LIST_OPPORTUNITIES][QUERY]', {
      ...logContext,
      orderBy: { createdAt: 'desc' },
    });
    const opportunities = await prisma.opportunity.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    logger.debug('[OPPORTUNITY_DB_SERVICE][LIST_OPPORTUNITIES][RESULT]', {
      ...logContext,
      count: opportunities.length,
      opportunities,
    });
    logger.info('[OPPORTUNITY_DB_SERVICE][LIST_OPPORTUNITIES][SUCCESS]', {
      ...logContext,
      opportunitiesCount: opportunities.length,
    });
    return opportunities;
  } catch (error: unknown) {
    const handledError = handleApiError(error, logContext);
    logger.error('[OPPORTUNITY_DB_SERVICE][LIST_OPPORTUNITIES][ERROR] Failed to list opportunities.', {
      ...logContext,
      error,
    });
    return handledError;
  }
}

/**
 * @function createOpportunityInDb
 * @description Creates a new opportunity in the Neon database.
 * @param payload The data for the new opportunity.
 * @returns A promise that resolves to the created Opportunity object.
 */
/**
 * Creates a new opportunity in the Neon database.
 * @param payload The data for the new opportunity.
 * @returns A promise that resolves to the created Opportunity object.
 */
export async function createOpportunityInDb(payload: Prisma.OpportunityCreateInput): Promise<Opportunity> {
  const logContext = { service: 'opportunity_db_service', function: 'createOpportunityInDb', payload };
  logger.debug('[OPPORTUNITY_DB_SERVICE][CREATE_OPPORTUNITY][PARAMS]', { ...logContext, payload });
  logger.info('[OPPORTUNITY_DB_SERVICE][CREATE_OPPORTUNITY][START]', logContext);

  try {
    logger.debug('[OPPORTUNITY_DB_SERVICE][CREATE_OPPORTUNITY][VALIDATION]', { ...logContext, payload });
    const createdOpportunity = await prisma.opportunity.create({
      data: payload,
    });
    logger.debug('[OPPORTUNITY_DB_SERVICE][CREATE_OPPORTUNITY][RESULT]', { ...logContext, createdOpportunity });
    logger.info('[OPPORTUNITY_DB_SERVICE][CREATE_OPPORTUNITY][SUCCESS]', {
      ...logContext,
      id: createdOpportunity.id,
      company: createdOpportunity.company,
    });
    return createdOpportunity;
  } catch (error: unknown) {
    const handledError = handleApiError(error, logContext);
    logger.error('[OPPORTUNITY_DB_SERVICE][CREATE_OPPORTUNITY][ERROR] Failed to create opportunity.', {
      ...logContext,
      error,
    });
    throw handledError.originalError;
  }
}

/**
 * @function updateOpportunityStatusInDb
 * @description Updates the status of an existing opportunity in the Neon database.
 * @param id The ID of the opportunity to update.
 * @param newStatus The new status to set for the opportunity.
 */
/**
 * Updates the status of an existing opportunity in the Neon database.
 * @param id The ID of the opportunity to update.
 * @param newStatus The new status to set for the opportunity.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateOpportunityStatusInDb(
  id: string,
  newStatus: $Enums.OpportunityStatus
): Promise<void> {
  const logContext = {
    service: 'opportunity_db_service',
    function: 'updateOpportunityStatusInDb',
    id,
    newStatus,
  };
  logger.info('[OPPORTUNITY_DB_SERVICE][UPDATE_STATUS][START]', logContext);

  try {
    const updatedOpportunity = await prisma.opportunity.update({
      where: { id: id },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
    });

    if (!updatedOpportunity) {
      logger.warn('[OPPORTUNITY_DB_SERVICE][UPDATE_STATUS][NOT_FOUND]', {
        ...logContext,
        message: 'No opportunity found with the given ID to update.',
      });
      throw new Error(`Opportunity with ID ${id} not found.`);
    }

    logger.info('[OPPORTUNITY_DB_SERVICE][UPDATE_STATUS][SUCCESS]', logContext);
  } catch (error: unknown) {
    const handledError = handleApiError(error, logContext);
    throw handledError.originalError;
  }
}
