/**
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides a dedicated service for interacting with the Neon PostgreSQL database for opportunity management.
 *   - Abstracts direct SQL queries, ensuring type safety, consistent data mapping, and robust error handling for opportunity-related operations (list, create, update).
 *
 * FILEPATH: `app/lib/opportunity_db_service.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/database.ts`: Exports the `sql` tagged template literal for database interaction.
 *   - `app/lib/postgres.ts`: The underlying Neon client and connection logic, re-exported via `database.ts`.
 *   - `app/lib/types/index.ts`: Defines `OrionOpportunity`, `OpportunityCreatePayload`, and `OpportunityStatus` interfaces, crucial for type consistency.
 *   - `app/lib/logger.ts`: Used for comprehensive, context-rich logging of all database operations within this service.
 *   - `app/api/orion/opportunity/list/route.ts`: Consumes `listOpportunitiesFromDb` to fetch opportunities for the API.
 *   - `app/api/orion/opportunity/create/route.ts`: Consumes `createOpportunityInDb` to add new opportunities via the API.
 *   - `app/api/orion/opportunity/update-status/route.ts`: Consumes `updateOpportunityStatusInDb` to modify opportunity statuses via the API.
 *   - `app/hooks/useOpportunities.ts`: Indirectly uses these database functions via the API routes to manage opportunity data in the UI.
 *   - `app/database/schema.sql`: Defines the `opportunities` table schema, dictating data structure and constraints.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the Neon database is correctly configured and accessible via `DATABASE_URL` environment variable.
 *   - Assumes `requirements` column in the `opportunities` table is of type `TEXT[]` in PostgreSQL, allowing direct array insertion/retrieval with the Neon client.
 *   - NOTE: Error handling is robust, logging details and re-throwing custom errors for upstream consumption.
 *
 * NOTES:
 *   - COMPONENTS TO MERGE WITH: This service acts as a single point of data access for opportunities, centralizing logic previously spread across Notion API calls and mock data.
 *   - OPPORTUNITIES FOR IMPROVEMENT: Implement more advanced filtering, pagination, and sorting directly at the database query level for large datasets. Consider adding transaction support for multi-step operations.
 *   - OPPORTUNITIES TO CONSOLIDATE: This service is a consolidation of opportunity data persistence logic.
 */
import { sql } from './database';
import { OrionOpportunity, OpportunityCreatePayload, OpportunityStatus } from './types';
import logger from './logger';

// GOAL: Provide a dedicated service for interacting with the Neon PostgreSQL database for opportunity management.
// This service abstracts direct SQL queries, ensuring type safety, consistent data mapping, and robust error handling.
//
// RELATION TO OTHER FILES, FUNCTIONS, COMPONENTS, AND FEATURES:
// - `app/lib/database.ts`: Provides the `sql` tagged template literal for database interaction.
// - `app/lib/types/index.ts`: Defines the `OrionOpportunity` and `OpportunityCreatePayload` interfaces, ensuring type consistency.
// - `app/lib/logger.ts`: Used for comprehensive logging of database operations.
// - `app/api/orion/opportunity/list/route.ts` (future): Will consume `listOpportunitiesFromDb` to fetch opportunities.
// - `app/api/orion/opportunity/create/route.ts` (future): Will consume `createOpportunityInDb` to add new opportunities.
// - `app/hooks/useOpportunities.ts` (future): Will indirectly use these functions via API routes.
// - `app/database/schema.sql`: Defines the `opportunities` table schema.

/**
 * Fetches a list of opportunities from the Neon database.
 * @returns A promise that resolves to an array of OrionOpportunity objects.
 */
export async function listOpportunitiesFromDb(): Promise<OrionOpportunity[]> {
  logger.info('[OPPORTUNITY_DB_SERVICE][LIST_OPPORTUNITIES][START] Attempting to fetch opportunities from Neon DB.');
  try {
    const result = await sql<OrionOpportunity[]>`
      SELECT
        id,
        company,
        position,
        status,
        location,
        salary,
        description,
        requirements,
        notes,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM opportunities
      ORDER BY created_at DESC;
    `;

    logger.debug('[OPPORTUNITY_DB_SERVICE][LIST_OPPORTUNITIES][DB_QUERY_SUCCESS]', {
      rowCount: result.length, // result from direct sql call is an array, length is rowCount
    });

    const opportunities: OrionOpportunity[] = result.map((row) => ({
      id: row.id,
      company: row.company,
      position: row.position,
      status: row.status as OpportunityStatus, // Type assertion based on schema CHECK constraint
      location: row.location,
      salary: row.salary,
      description: row.description,
      requirements: row.requirements || undefined, // Ensure it's an array or undefined
      notes: row.notes || undefined,
      createdAt: row.createdAt || undefined, // Already a string from DB
      updatedAt: row.updatedAt || undefined, // Already a string from DB
      title: row.position || row.company || undefined,
      type: undefined,
      content: row.description,
      url: undefined,
      tags: row.requirements || undefined, // Use requirements as tags, as it is a TEXT[] column
      dateIdentified: row.createdAt || undefined,
      contactPerson: undefined,
      contactEmail: undefined,
      stage: row.status,
      attachments: undefined,
      companyOrInstitution: row.company,
      relatedEvaluationId: undefined,
      sourceUrl: undefined,
      nextActionDate: undefined,
      priority: undefined,
      tailoredCv: undefined,
      deadline: undefined,
      contact: undefined,
      lastStatusUpdate: row.updatedAt || undefined,
      notionPageId: undefined,
      evaluationOutput: undefined,
      webResearchContext: undefined,
      pros: undefined,
      cons: undefined,
      missingSkills: undefined,
      contentType: undefined,
      lastEditedTime:
        row.lastEditedTime instanceof Date ? row.lastEditedTime.toISOString() : row.lastEditedTime || undefined, // Handle Date or string
      cvComponentSuggestions: undefined,
      alignmentScore: undefined,
      actionableAdvice: undefined,
    }));

    logger.info('[OPPORTUNITY_DB_SERVICE][LIST_OPPORTUNITIES][SUCCESS]', {
      opportunitiesCount: opportunities.length,
    });
    return opportunities;
  } catch (error) {
    logger.error('[OPPORTUNITY_DB_SERVICE][LIST_OPPORTUNITIES][ERROR]', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'N/A',
    });
    throw new Error(
      `Failed to list opportunities from database: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Creates a new opportunity in the Neon database.
 * @param payload The data for the new opportunity.
 * @returns A promise that resolves to the created OrionOpportunity object.
 */
export async function createOpportunityInDb(payload: OpportunityCreatePayload): Promise<OrionOpportunity> {
  logger.info('[OPPORTUNITY_DB_SERVICE][CREATE_OPPORTUNITY][START]', { payload });
  try {
    const {
      companyOrInstitution,
      position,
      status,
      location,
      salary,
      content, // Maps to description
      tags, // Maps to requirements
      url,
      type,
      dateIdentified,
      nextActionDate,
      priority,
      tailoredCv,
      deadline,
      contact,
      cvComponentSuggestions,
      alignmentScore,
      pros,
      cons,
      actionableAdvice,
    } = payload;

    // Ensure tags is an array for direct insertion into TEXT[] column
    const requirementsArray = Array.isArray(tags) ? tags : [];

    const result = await sql<OrionOpportunity[]>`
      INSERT INTO opportunities (
        company,
        position,
        status,
        location,
        salary,
        description,
        requirements
      ) VALUES (
        ${companyOrInstitution},
        ${position},
        ${status},
        ${location},
        ${salary},
        ${content},
        ${requirementsArray} -- Pass array directly for TEXT[] column
      )
      RETURNING
        id,
        company,
        position,
        status,
        location,
        salary,
        description,
        requirements,
        created_at as "createdAt",
        updated_at as "updatedAt";
    `;

    logger.info('[OPPORTUNITY_DB_SERVICE][CREATE_OPPORTUNITY][DB_QUERY_SUCCESS]', { createdRow: result[0] });

    const createdOpportunity: OrionOpportunity = result[0]; // Explicitly type the result of the first row
    if (!createdOpportunity) {
      throw new Error('Failed to retrieve created opportunity after insert.');
    }

    logger.info('[OPPORTUNITY_DB_SERVICE][CREATE_OPPORTUNITY][SUCCESS]', {
      opportunityId: createdOpportunity.id,
      company: createdOpportunity.company,
    });
    return createdOpportunity;
  } catch (error) {
    logger.error('[OPPORTUNITY_DB_SERVICE][CREATE_OPPORTUNITY][ERROR]', {
      error: error instanceof Error ? error.message : String(error),
      payload,
      stack: error instanceof Error ? error.stack : 'N/A',
    });
    throw new Error(
      `Failed to create opportunity in database: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Updates the status of an existing opportunity in the Neon database.
 * @param opportunityId The ID of the opportunity to update.
 * @param newStatus The new status to set for the opportunity.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateOpportunityStatusInDb(opportunityId: string, newStatus: string): Promise<void> {
  logger.info('[OPPORTUNITY_DB_SERVICE][UPDATE_STATUS][START]', { opportunityId, newStatus });
  try {
    const result = await sql<Array<{ id: string }>>`
      UPDATE opportunities
      SET
        status = ${newStatus},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${opportunityId}
      RETURNING id; -- Return id to check if a row was affected
    `;

    if (result.length === 0) {
      logger.warn('[OPPORTUNITY_DB_SERVICE][UPDATE_STATUS][NOT_FOUND]', {
        opportunityId,
        newStatus,
        message: 'No opportunity found with the given ID to update.',
      });
      throw new Error(`Opportunity with ID ${opportunityId} not found.`);
    }

    logger.info('[OPPORTUNITY_DB_SERVICE][UPDATE_STATUS][SUCCESS]', {
      opportunityId,
      newStatus,
    });
  } catch (error) {
    logger.error('[OPPORTUNITY_DB_SERVICE][UPDATE_STATUS][ERROR]', {
      error: error instanceof Error ? error.message : String(error),
      opportunityId,
      newStatus,
      stack: error instanceof Error ? error.stack : 'N/A',
    });
    throw new Error(
      `Failed to update opportunity status in database: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
