/**
 * @fileoverview Database service layer for opportunity management operations.
 * @description Provides type-safe, transactional operations for CRUD operations on opportunities within Orion's PostgreSQL database. Integrates Prisma ORM with application-specific business logic.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides a dedicated service for interacting with the Neon PostgreSQL database for opportunity management.
 *   - Abstracts direct SQL queries, ensuring type safety, consistent data mapping, and robust error handling for opportunity-related operations (list, create, update).
 *
 * FILEPATH: `app/lib/opportunity_db_service.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `../generated/prisma`: Imports the Prisma Client for type-safe database interactions.
 *   - `app/lib/types/index.ts`: Defines `OrionOpportunity`, `OpportunityCreatePayload`, `OpportunityStatus`, `OpportunityType`, and `OpportunityPriority` interfaces/enums, crucial for type consistency with Prisma.
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
 *   - COMPONENTS TO MERGE WITH: This service acts as a single point of data access for opportunities, centralizing logic previously spread across Notion API calls and mock data.
 *   - **Performance Optimization**: Implement more advanced filtering, pagination, and sorting directly at the database query level for large datasets.
 *   - **Transaction Support**: Consider adding transaction support for multi-step operations to ensure atomicity and data consistency.
 *   - **Soft Deletion**: For opportunities, instead of hard deleting, consider implementing a soft delete mechanism (e.g., using a `deletedAt` timestamp) to retain historical data and allow for recovery.
 *   - **Auditing Fields**: Introduce common auditing fields (e.g., `createdBy`, `updatedBy`, `createdAt`, `updatedAt` for records beyond just the standard Prisma ones) to track changes and responsible users.
 *   - **Batch Operations**: Implement functions for batch creation, updating, or deleting opportunities to improve efficiency for bulk operations.
 *   - **Data Caching**: For frequently accessed opportunities or lists, explore adding a caching layer (e.g., Redis or in-memory cache) to reduce database load and improve response times.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - **Generic Database Service**: If similar database interaction patterns emerge for other entities (e.g., journal entries, ideas), consider abstracting common CRUD operations into a more generic database service utility.
 *   - **Type Mapping Utility**: Refine the `mapPrismaOpportunityToOrionOpportunity` into a more generic, reusable utility if similar mapping logic is required for other Prisma models to application-specific types.
 *   - This service is a consolidation of opportunity data persistence logic.
 */
import { Prisma, OpportunityStatus as PrismaOpportunityStatus, Opportunity } from '@/generated/prisma';
import { JsonValue } from '@prisma/client/runtime/library';
import {
  OrionOpportunity,
  OpportunityCreatePayload,
  OpportunityStatus,
  OpportunityType,
  EvaluationOutput,
  OpportunityPriority,
  EvaluationGapDetail,
  HandledApplicationError,
} from './types';
import logger from './logger';
import prisma from './prisma'; // Import the lib Prisma Client instance
import { handleApiError } from './utils/errorHandler'; // Import centralized error handler

// Define a type that matches the fields selected in Prisma queries
interface PrismaSelectedOpportunity {
  id: string;
  title: string;
  company: string | null;
  type: string | null;
  position: string | null;
  status: string | null;
  location: string | null;
  salary: string | null;
  content: string | null;
  tags: string[] | null;
  url: string | null;
  dateIdentified: Date | null;
  notes: string | null;
  contactPerson: string | null;
  contactEmail: string | null;
  stage: string | null;
  attachments: string[] | null;
  relatedEvaluationId: string | null;
  sourceUrl: string | null;
  nextActionDate: Date | null;
  priority: string | null;
  tailoredCv: string | null;
  deadline: Date | null;
  contact: string | null;
  lastStatusUpdate: Date | null;
  notionPageId: string | null;
  createdAt: Date;
  updatedAt: Date;
  applicationMaterialIds?: string[];
  evaluationResult: JsonValue | null;
}

// Helper function to map Prisma Opportunity to OrionOpportunity
const mapPrismaOpportunityToOrionOpportunity = (opportunity: PrismaSelectedOpportunity): OrionOpportunity => {
  const evaluationResult = opportunity.evaluationResult
    ? (JSON.parse(opportunity.evaluationResult as string) as EvaluationOutput)
    : null;

  // Ensure 'gaps' are always in the { gap: string, solution: string } format
  if (evaluationResult && Array.isArray(evaluationResult.gaps)) {
    evaluationResult.gaps = evaluationResult.gaps.map((gap: string | EvaluationGapDetail) => {
      if (typeof gap === 'string') {
        return { gap: gap, solution: 'N/A' };
      }
      return gap;
    });
  }

  // Ensure 'strengths' are always in the { title: string, reasoning: string } format if they also show variability
  if (evaluationResult && Array.isArray(evaluationResult.strengths)) {
    evaluationResult.strengths = evaluationResult.strengths.map((strength: unknown) => {
      if (typeof strength === 'string') {
        return { title: strength, reasoning: 'N/A' };
      }
      return strength as { title: string; reasoning: string };
    });
  }

  // Ensure 'alignmentHighlights' are always in the { title: string, reasoning: string } format if they also show variability
  if (evaluationResult && Array.isArray(evaluationResult.alignmentHighlights)) {
    evaluationResult.alignmentHighlights = evaluationResult.alignmentHighlights.map((highlight: unknown) => {
      if (typeof highlight === 'string') {
        return { title: highlight, reasoning: 'N/A' };
      }
      return highlight as { title: string; reasoning: string };
    });
  }

  return {
    id: opportunity.id,
    title: opportunity.title,
    company: opportunity.company || null,
    type: (opportunity.type || null) as OpportunityType | null,
    status: (opportunity.status || null) as OpportunityStatus | null,
    content: opportunity.content || null,
    url: opportunity.url || null,
    tags: opportunity.tags || null,
    dateIdentified: opportunity.dateIdentified?.toISOString() || null,
    notes: opportunity.notes || null,
    contactPerson: opportunity.contactPerson || null,
    contactEmail: opportunity.contactEmail || null,
    stage: opportunity.stage || null,
    attachments: opportunity.attachments || null,
    companyOrInstitution: opportunity.company || null,
    relatedEvaluationId: opportunity.relatedEvaluationId || null,
    sourceUrl: opportunity.sourceUrl || null,
    nextActionDate: opportunity.nextActionDate?.toISOString() || null,
    priority: (opportunity.priority || null) as OpportunityPriority | null,
    tailoredCv: opportunity.tailoredCv || null,
    deadline: opportunity.deadline?.toISOString() || null,
    location: opportunity.location || null,
    salary: opportunity.salary || null,
    contact: opportunity.contact || null,
    position: opportunity.position || null,
    lastStatusUpdate: opportunity.lastStatusUpdate?.toISOString() || null,
    notionPageId: opportunity.notionPageId || null,
    createdAt: opportunity.createdAt.toISOString(),
    updatedAt: opportunity.updatedAt.toISOString(),
    evaluationOutput: evaluationResult,
    webResearchContext: null,
    pros: null,
    cons: null,
    missingSkills: null,
    contentType: null,
    lastEditedTime: opportunity.updatedAt.toISOString(),
    cvComponentSuggestions: null,
    alignmentScore: null,
    actionableAdvice: null,
    applicationMaterialIds: opportunity.applicationMaterialIds || null,
  };
};

/**
 * @function getOpportunityByIdFromDb
 * @description Fetches an opportunity by its ID from the database.
 * @param id The ID of the opportunity to fetch.
 * @returns The OrionOpportunity object if found, null if not found, or a HandledApplicationError on database error.
 */
/**
 * Fetches an opportunity by its ID from the database.
 * @param id The ID of the opportunity to fetch.
 * @returns The OrionOpportunity object if found, null if not found, or a HandledApplicationError on database error.
 */
export async function getOpportunityByIdFromDb(id: string): Promise<OrionOpportunity | null | HandledApplicationError> {
  const logContext = {
    service: 'opportunity_db_service',
    function: 'getOpportunityByIdFromDb',
    opportunityId: id,
    queryComplexity: 'SINGLE_RECORD',
    cacheStatus: 'NONE'
  };
  logger.info('[OPPORTUNITY_DB_SERVICE][GET_BY_ID][START]', logContext);
  const startTime = Date.now();
  try {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        company: true,
        type: true,
        position: true,
        status: true,
        location: true,
        salary: true,
        content: true,
        tags: true,
        url: true,
        dateIdentified: true,
        notes: true,
        contactPerson: true,
        contactEmail: true,
        stage: true,
        attachments: true,
        relatedEvaluationId: true,
        sourceUrl: true,
        nextActionDate: true,
        priority: true,
        tailoredCv: true,
        deadline: true,
        contact: true,
        lastStatusUpdate: true,
        notionPageId: true,
        createdAt: true,
        updatedAt: true,
        applicationMaterialIds: true,
        evaluationResult: true,
      },
    });
    if (!opportunity) {
      logger.warn('[OPPORTUNITY_DB_SERVICE][GET_BY_ID][NOT_FOUND]', logContext);
      return null;
    }
    logger.info('[OPPORTUNITY_DB_SERVICE][GET_BY_ID][SUCCESS]', logContext);
    return mapPrismaOpportunityToOrionOpportunity(opportunity);
  } catch (error: unknown) {
    const handledError = handleApiError(error, logContext);
    logger.error('[OPPORTUNITY_DB_SERVICE][GET_BY_ID][ERROR] Failed to fetch opportunity.', handledError.logContext);
    return handledError;
  }
}

/**
 * @function listOpportunitiesFromDb
 * @description Fetches a list of opportunities from the Neon database.
 * @returns A promise that resolves to an array of OrionOpportunity objects or a HandledApplicationError.
 */
/**
 * Fetches a list of opportunities from the Neon database.
 * @returns A promise that resolves to an array of OrionOpportunity objects or a HandledApplicationError.
 */
export async function listOpportunitiesFromDb(): Promise<OrionOpportunity[] | HandledApplicationError> {
  const logContext = { service: 'opportunity_db_service', function: 'listOpportunitiesFromDb' };
  logger.info(
    '[OPPORTUNITY_DB_SERVICE][LIST_OPPORTUNITIES][START] Attempting to fetch opportunities from Neon DB.',
    logContext
  );

  try {
    const opportunities = await prisma.opportunity.findMany({
      select: {
        id: true,
        title: true,
        company: true,
        type: true,
        position: true,
        status: true,
        location: true,
        salary: true,
        content: true,
        tags: true,
        url: true,
        dateIdentified: true,
        notes: true,
        contactPerson: true,
        contactEmail: true,
        stage: true,
        attachments: true,
        relatedEvaluationId: true,
        sourceUrl: true,
        nextActionDate: true,
        priority: true,
        tailoredCv: true,
        deadline: true,
        contact: true,
        lastStatusUpdate: true,
        notionPageId: true,
        createdAt: true,
        updatedAt: true,
        applicationMaterialIds: true,
        evaluationResult: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    logger.info('[OPPORTUNITY_DB_SERVICE][LIST_OPPORTUNITIES][SUCCESS]', {
      ...logContext,
      opportunitiesCount: opportunities.length,
    });

    const mappedOpportunities: OrionOpportunity[] = opportunities.map(mapPrismaOpportunityToOrionOpportunity);

    return mappedOpportunities;
  } catch (error: unknown) {
    const handledError = handleApiError(error, logContext);
    logger.error(
      '[OPPORTUNITY_DB_SERVICE][LIST_OPPORTUNITIES][ERROR] Failed to list opportunities.',
      handledError.logContext
    );
    return handledError;
  }
}

/**
 * @function createOpportunityInDb
 * @description Creates a new opportunity in the Neon database.
 * @param payload The data for the new opportunity.
 * @returns A promise that resolves to the created OrionOpportunity object.
 */
/**
 * Creates a new opportunity in the Neon database.
 * @param payload The data for the new opportunity.
 * @returns A promise that resolves to the created OrionOpportunity object.
 */
export async function createOpportunityInDb(payload: OpportunityCreatePayload): Promise<OrionOpportunity> {
  const logContext = { service: 'opportunity_db_service', function: 'createOpportunityInDb', payload };
  logger.info('[OPPORTUNITY_DB_SERVICE][CREATE_OPPORTUNITY][START]', logContext);

  try {
    const dataToCreate: Prisma.OpportunityCreateInput = {
      title: payload.title,
      company: payload.companyOrInstitution || null,
      type: payload.type || null,
      position: payload.position || null,
      status: payload.status as unknown as PrismaOpportunityStatus, // Ensure correct casting to Prisma's enum
      location: payload.location || null,
      salary: payload.salary || null,
      content: payload.content || null,
      tags: payload.tags || [],
      url: payload.url || null,
      dateIdentified: payload.dateIdentified ? new Date(payload.dateIdentified) : null,
      notes: payload.notes || null,
      contactPerson: payload.contactPerson || null,
      contactEmail: payload.contactEmail || null,
      stage: payload.stage || null,
      attachments: payload.attachments || [],
      relatedEvaluationId: payload.relatedEvaluationId || null,
      sourceUrl: payload.sourceUrl || null,
      nextActionDate: payload.nextActionDate ? new Date(payload.nextActionDate) : null,
      priority: payload.priority || null,
      tailoredCv: payload.tailoredCv || null,
      deadline: payload.deadline ? new Date(payload.deadline) : null,
      contact: payload.contact || null,
      lastStatusUpdate: payload.lastStatusUpdate ? new Date(payload.lastStatusUpdate) : null,
      notionPageId: payload.notionPageId || null,
      applicationMaterialIds: payload.applicationMaterialIds || [],
    };

    const createdOpportunity = await prisma.opportunity.create({
      data: dataToCreate,
    });

    logger.info('[OPPORTUNITY_DB_SERVICE][CREATE_OPPORTUNITY][SUCCESS]', {
      ...logContext,
      opportunityId: createdOpportunity.id,
      company: createdOpportunity.company,
    });

    return mapPrismaOpportunityToOrionOpportunity(createdOpportunity);
  } catch (error: unknown) {
    const handledError = handleApiError(error, logContext);
    throw handledError.originalError;
  }
}

/**
 * @function updateOpportunityStatusInDb
 * @description Updates the status of an existing opportunity in the Neon database.
 * @param opportunityId The ID of the opportunity to update.
 * @param newStatus The new status to set for the opportunity.
 */
/**
 * Updates the status of an existing opportunity in the Neon database.
 * @param opportunityId The ID of the opportunity to update.
 * @param newStatus The new status to set for the opportunity.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateOpportunityStatusInDb(opportunityId: string, newStatus: OpportunityStatus): Promise<void> {
  const logContext = {
    service: 'opportunity_db_service',
    function: 'updateOpportunityStatusInDb',
    opportunityId,
    newStatus,
  };
  logger.info('[OPPORTUNITY_DB_SERVICE][UPDATE_STATUS][START]', logContext);

  try {
    const updatedOpportunity = await prisma.opportunity.update({
      where: { id: opportunityId },
      data: {
        status: newStatus as unknown as PrismaOpportunityStatus, // Ensure correct casting to Prisma's enum
        updatedAt: new Date(),
      },
    });

    if (!updatedOpportunity) {
      logger.warn('[OPPORTUNITY_DB_SERVICE][UPDATE_STATUS][NOT_FOUND]', {
        ...logContext,
        message: 'No opportunity found with the given ID to update.',
      });
      throw new Error(`Opportunity with ID ${opportunityId} not found.`);
    }

    logger.info('[OPPORTUNITY_DB_SERVICE][UPDATE_STATUS][SUCCESS]', logContext);
  } catch (error: unknown) {
    const handledError = handleApiError(error, logContext);
    throw handledError.originalError;
  }
}
