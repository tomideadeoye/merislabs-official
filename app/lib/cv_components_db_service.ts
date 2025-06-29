/**
 * @fileoverview Service layer for CV Component data with the Neon (Postgres) database.
 * @description This module handles all database operations for CV components, ensuring a clean
 * separation of concerns from the API routes that will use it. It is a core service for the
 * CV Tailoring & Assembly Studio, specifically responsible for data provisioning and integrity.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide robust CRUD operations for `CVComponent` data in the Neon PostgreSQL database.
 *   - **FR-1.1:** To enable the CV Tailoring Studio to fetch all available CV components via `fetchAllCvComponents`.
 *   - **FR-1.2:** To ensure each component stored and retrieved conforms to the `CVComponent` Prisma model, including `uniqueId`, `name`, `type`, `content` (JSON), and `tags`.
 *   - To facilitate the import, saving, updating, and deletion of individual CV components.
 *
 * FILEPATH: `app/lib/cv_components_db_service.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `prisma/schema.prisma`: Defines the authoritative `CVComponent` model that this service interacts with.
 *   - `@/lib/types/index.ts`: Defines `CVComponent` and `RawCvComponentJsonData` interfaces for type safety and consistent data structures, supporting FR-1.2.
 *   - `app/api/orion/cv-components/route.ts`: Calls `fetchAllCvComponents` (for GET) and `saveOrUpdateCvComponent` (for POST) to expose CV component data to the frontend.
 *   - `app/api/orion/cv/suggest-components/route.ts`: Calls `fetchAllCvComponents` to provide the LLM with all available components for suggestions (part of FR-2.2).
 *   - `app/api/orion/cv/assemble/route.ts`: Calls Prisma directly (`prisma.cVComponent.findMany`) to fetch selected components for assembly (part of FR-5.2).
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[id]/cv-tailoring/page.tsx`: The server component that indirectly uses `fetchAllCvComponents` to pass data to the client.
 *   - `@/lib/logger`: Integrates comprehensive logging for all database operations, aiding traceability and debugging.
 *   - `@/lib/prisma`: Imports the Prisma client instance to interact with the database.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the Prisma client (`@/lib/prisma`) is correctly initialized and connected to the Neon database.
 *   - Assumes `RawCvComponentJsonData` provides the necessary fields for mapping to the `CVComponent` Prisma model.
 *   - The `userId` for new components is currently hardcoded to `orion_default_user` (TODO for actual user ID integration).
 *   - Error handling is implemented within each function to catch database operation failures and log them.
 *
 * NON-FUNCTIONAL REQUIREMENTS:
 *   - Performance: Optimized database queries to ensure efficient retrieval and persistence of CV components.
 *   - Reliability: Robust error handling for database operations to prevent data loss or service interruption.
 *   - Data Integrity: Ensures data consistency and adherence to the `CVComponent` schema (FR-1.2).
 *   - Security: (Implicit) While this service does not handle authentication directly, it operates within an authenticated environment.
 *
 * NOTES:
 *   - This service is the single source of truth for CV component data access, promoting modularity and maintainability.
 *   - The `mapRawDataToPrismaCVComponent` function handles the transformation from raw JSON to the Prisma model.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **User ID Integration**: Replace the `orion_default_user` placeholder with an actual user ID from the authentication session when creating or updating components.
 *   - **Content Validation**: Implement more rigorous validation for the `content` field of `CVComponent` to ensure it's always valid JSON or a parsable string.
 *   - **Soft Deletes**: Instead of hard deletes, consider implementing soft deletes (e.g., adding an `isActive` or `deletedAt` field) for better data recovery and auditability.
 *   - **Pagination/Filtering**: For `fetchAllCvComponents`, add parameters for pagination, sorting, and filtering to handle a large number of components efficiently.
 *   - **Optimistic Locking**: For `saveOrUpdateCvComponent`, consider implementing optimistic locking to prevent race conditions during concurrent updates.
 *   - **Schema Enhancements**: Introduce more specific fields for `CVComponent` content (e.g., dedicated fields for `title`, `duration`, `description` for experience components) instead of a generic `content` JSON field, allowing for more structured data querying and rendering.
 */

import { CVComponent, Prisma } from '@prisma/client';
import logger from '@/lib/logger';
import { RawCvComponentJsonData } from '@/lib/types';
import prisma from '@/lib/prisma';
import { HandledApplicationError } from '@/lib/utils/errorHandler';

// Use Prisma input types for create/update
export type CVComponentCreateData = Prisma.CVComponentCreateInput;
export type CVComponentUpdateData = Prisma.CVComponentUpdateInput;

/**
 * Maps incoming JSON data from cv-data.json to the Prisma CVComponent model structure.
 * @param data Raw JSON data for a CV component.
 * @returns Mapped data for Prisma create/update.
 */
function mapRawDataToPrismaCVComponent(data: RawCvComponentJsonData): Prisma.CVComponentCreateInput {
  const processTags = (input: unknown): string[] => {
    if (Array.isArray(input)) {
      return input
        .filter((s): s is string => typeof s === 'string')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (typeof input === 'string') {
      return input
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
    return [] as string[];
  };

  const keywords = processTags(data.Keywords);
  const targetRoleTags = processTags(data['Target Role Tags']);
  const combinedTags = Array.from(new Set([...keywords, ...targetRoleTags]));

  // Ensure content is always a valid JSON value (never null or undefined)
  let content: Prisma.InputJsonValue = {};
  if (data['Content (Primary)']) {
    try {
      const parsed = JSON.parse(JSON.stringify(data['Content (Primary)']));
      content = parsed === null || parsed === undefined ? {} : parsed;
    } catch {
      content = {};
    }
  }
  if (content === null || content === undefined) {
    content = {};
  }

  const mappedData: Prisma.CVComponentCreateInput = {
    uniqueId: data.UniqueID,
    name: data['Component Name'],
    type: data['Component Type'],
    content,
    tags: combinedTags,
    userId: 'orion_default_user',
  };

  logger.debug('[CV_DB_SERVICE][MAP_DATA]', { raw: data, mapped: mappedData });
  return mappedData;
}

/**
 * @function saveOrUpdateCvComponent
 * @description Saves or updates a CV component in the database.
 * @param componentData The raw JSON data for the CV component.
 */
/**
 * Saves or updates a CV component in the database.
 * If a component with the same uniqueId exists, it updates it; otherwise, it creates a new one.
 * @param componentData The raw JSON data for the CV component.
 * @returns The saved or updated CV component.
 */
export async function saveOrUpdateCvComponent(componentData: RawCvComponentJsonData): Promise<CVComponent> {
  const logContext = { operation: 'saveOrUpdateCvComponent', uniqueId: componentData.UniqueID };

  if (!componentData.UniqueID) {
    logger.warn('[CV_DB_SERVICE][SAVE_OR_UPDATE] Skipping CV component with no UniqueID.', {
      componentName: componentData['Component Name'],
    });
    throw new HandledApplicationError('CV Component UniqueID is missing.', 400, 'VALIDATION_ERROR', logContext);
  }
  logger.info('[CV_DB_SERVICE][SAVE_OR_UPDATE][START]', logContext);

  try {
    const dataToSave = mapRawDataToPrismaCVComponent(componentData);
    const existingComponent = await prisma.cVComponent.findUnique({
      where: { uniqueId: componentData.UniqueID },
    });

    let savedComponent: CVComponent;

    if (existingComponent) {
      logger.info('[CV_DB_SERVICE][SAVE_OR_UPDATE][UPDATE] Existing component found, updating.', {
        uniqueId: componentData.UniqueID,
      });
      savedComponent = await prisma.cVComponent.update({
        where: { uniqueId: componentData.UniqueID },
        data: dataToSave,
      });
    } else {
      logger.info('[CV_DB_SERVICE][SAVE_OR_UPDATE][CREATE] No existing component found, creating new.', {
        uniqueId: componentData.UniqueID,
      });
      savedComponent = await prisma.cVComponent.create({
        data: dataToSave,
      });
    }
    logger.success('[CV_DB_SERVICE][SAVE_OR_UPDATE][SUCCESS]', { ...logContext, id: savedComponent.id });
    return savedComponent;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const dbErrorMatch = errorMessage.includes("Can't reach database server") || errorMessage.includes('timed out');
    const userFriendlyMessage = dbErrorMatch
      ? 'Database connection issue: Please wait a moment and try again. The database might be waking up.'
      : `Failed to save or update CV component: ${errorMessage}`;

    logger.error('[CV_DB_SERVICE][SAVE_OR_UPDATE][ERROR]', {
      ...logContext,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      isDatabaseError: dbErrorMatch,
    });

    throw new HandledApplicationError(
      userFriendlyMessage,
      500,
      dbErrorMatch ? 'DB_CONNECTION_ERROR' : 'DB_OPERATION_ERROR',
      logContext,
      error
    );
  }
}

/**
 * @function fetchAllCvComponents
 * @description Fetches all CV components from the database.
 * @returns An array of CVComponent objects or a HandledApplicationError.
 */
/**
 * Fetches all CV components from the database.
 * @returns An array of CVComponent objects or a HandledApplicationError.
 */
export async function fetchAllCvComponents(): Promise<CVComponent[] | HandledApplicationError> {
  logger.info('[CV_DB_SERVICE][FETCH_ALL][START]');
  try {
    const components = await prisma.cVComponent.findMany({
      orderBy: {
        // Consider ordering by a more meaningful field, e.g., 'name' or 'type', then 'updatedAt'
        updatedAt: 'desc',
      },
    });
    logger.success(`[CV_DB_SERVICE][FETCH_ALL][SUCCESS] Successfully fetched ${components.length} CV components.`);
    return components;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const dbErrorMatch = errorMessage.includes("Can't reach database server") || errorMessage.includes('timed out');
    const userFriendlyMessage = dbErrorMatch
      ? 'Database connection issue: Please wait a moment and try again. The database might be waking up.'
      : `Failed to fetch CV components: ${errorMessage}`;

    logger.error('[CV_DB_SERVICE][FETCH_ALL][ERROR]', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      isDatabaseError: dbErrorMatch,
    });
    return new HandledApplicationError(
      userFriendlyMessage,
      500,
      dbErrorMatch ? 'DB_CONNECTION_ERROR' : 'DB_OPERATION_ERROR',
      { operation: 'fetchAllCvComponents' },
      error
    );
  }
}

/**
 * @function deleteCvComponent
 * @description Deletes a CV component by its uniqueId.
 * @param uniqueId The unique ID of the CV component to delete.
 * @returns The deleted CV component.
 */
/**
 * Deletes a CV component by its uniqueId.
 * @param uniqueId The unique ID of the CV component to delete.
 * @returns The deleted CV component.
 */
export async function deleteCvComponent(uniqueId: string): Promise<CVComponent> {
  const logContext = { operation: 'deleteCvComponent', uniqueId };
  logger.info('[CV_DB_SERVICE][DELETE][START]', logContext);
  try {
    const deletedComponent = await prisma.cVComponent.delete({
      where: { uniqueId },
    });
    logger.success('[CV_DB_SERVICE][DELETE][SUCCESS]', { ...logContext, id: deletedComponent.id });
    return deletedComponent;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const dbErrorMatch = errorMessage.includes("Can't reach database server") || errorMessage.includes('timed out');
    const userFriendlyMessage = dbErrorMatch
      ? 'Database connection issue: Please wait a moment and try again. The database might be waking up.'
      : `Failed to delete CV component: ${errorMessage}`;

    logger.error('[CV_DB_SERVICE][DELETE][ERROR]', {
      ...logContext,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      isDatabaseError: dbErrorMatch,
    });
    throw new HandledApplicationError(
      userFriendlyMessage,
      500,
      dbErrorMatch ? 'DB_CONNECTION_ERROR' : 'DB_OPERATION_ERROR',
      logContext,
      error
    );
  }
}

/**
 * @function findCvComponentByUniqueId
 * @description Finds a CV component by its uniqueId.
 * @param uniqueId The unique ID of the CV component.
 * @returns The found CV component or null if not found.
 */
/**
 * Finds a CV component by its uniqueId.
 * @param uniqueId The unique ID of the CV component.
 * @returns The found CV component or null if not found.
 */
export async function findCvComponentByUniqueId(uniqueId: string): Promise<CVComponent | null> {
  const logContext = { operation: 'findCvComponentByUniqueId', uniqueId };
  logger.info('[CV_DB_SERVICE][FIND_BY_UNIQUE_ID][START]', logContext);
  try {
    const component = await prisma.cVComponent.findUnique({
      where: { uniqueId },
    });
    logger.success('[CV_DB_SERVICE][FIND_BY_UNIQUE_ID][SUCCESS]', { ...logContext, found: !!component });
    return component;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const dbErrorMatch = errorMessage.includes("Can't reach database server") || errorMessage.includes('timed out');
    const userFriendlyMessage = dbErrorMatch
      ? 'Database connection issue: Please wait a moment and try again. The database might be waking up.'
      : `Failed to find CV component by ID: ${errorMessage}`;

    logger.error('[CV_DB_SERVICE][FIND_BY_UNIQUE_ID][ERROR]', {
      ...logContext,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      isDatabaseError: dbErrorMatch,
    });
    throw new HandledApplicationError(
      userFriendlyMessage,
      500,
      dbErrorMatch ? 'DB_CONNECTION_ERROR' : 'DB_OPERATION_ERROR',
      logContext,
      error
    );
  }
}

/**
 * @function recordCVFeedback
 * @description Records user feedback on a CV tailoring process or a specific CV component.
 * @param userId The ID of the user providing feedback.
 * @param id The ID of the opportunity related to the feedback.
 * @param feedbackType The type of feedback (e.g., 'positive', 'negative', 'suggestion').
 * @param feedbackDetails Detailed text of the feedback.
 * @param componentId Optional: The ID of the specific CV component being feedback on.
 * @param originalContent Optional: The original content of the component/section.
 * @param generatedContent Optional: The AI-generated content.
 */
/**
 * Records user feedback on a CV tailoring process or a specific CV component.
 * @param userId The ID of the user providing feedback.
 * @param id The ID of the opportunity related to the feedback.
 * @param feedbackType The type of feedback (e.g., 'positive', 'negative', 'suggestion').
 * @param feedbackDetails Detailed text of the feedback.
 * @param componentId Optional: The ID of the specific CV component being feedback on.
 * @param originalContent Optional: The original content of the component/section.
 * @param generatedContent Optional: The AI-generated content.
 * @returns A promise that resolves to the created feedback entry.
 */
export async function recordCVFeedback(
  userId: string,
  id: string,
  feedbackType: 'positive' | 'negative' | 'suggestion' | 'bug',
  feedbackDetails: string,
  componentId?: string,
  originalContent?: string,
  generatedContent?: string
) {
  const logContext = { operation: 'recordCVFeedback', userId, id, feedbackType, componentId };
  logger.info('[CV_DB_SERVICE][RECORD_FEEDBACK][START]', logContext);

  try {
    const feedbackEntry = await prisma.cVFeedback.create({
      data: {
        userId,
        id,
        feedbackType,
        feedbackDetails,
        componentId,
        originalContent,
        generatedContent,
      },
    });
    logger.success('[CV_DB_SERVICE][RECORD_FEEDBACK][SUCCESS]', { ...logContext, feedbackId: feedbackEntry.id });
    return feedbackEntry;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[CV_DB_SERVICE][RECORD_FEEDBACK][ERROR]', {
      ...logContext,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new HandledApplicationError(
      `Failed to record CV feedback: ${errorMessage}`,
      500,
      'DB_OPERATION_ERROR',
      logContext,
      error
    );
  }
}
