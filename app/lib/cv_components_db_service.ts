/**
 * @fileoverview Service layer for CV Component data with the Neon (Postgres) database.
 * @description This module handles all database operations for CV components, ensuring a clean
 * separation of concerns from the API routes that will use it.
 *
 * RELATION TO OTHER FILES, FUNCTIONS, COMPONENTS, AND FEATURES:
 * - `prisma/schema.prisma`: Defines the `CVComponent` model.
 * - `lib/types/index.ts`: Defines relevant interfaces for type safety.
 * - `app/api/orion/cv-components/import/route.ts`: Consumes these functions to import CV data.
 * - prisma ORM, neon, postgres
 * - Logging via `@/lib/logger`.
 */

import { Prisma } from '@/generated/prisma'; // Correct Prisma import
import logger from '@/lib/logger';
import { CVComponent, RawCvComponentJsonData } from '@/lib/types';
import prisma from '@/lib/prisma'; // Import the lib Prisma client instance

// Helper to ensure correct Prisma payload type for CVComponent
// It's good practice to define payload types if you need them for return types,
// but Prisma's inferred types are often sufficient.
// For example, the return type of prisma.cVComponent.create is Prisma.CVComponentGetPayload<{}>
// which can be simplified to just `CVComponent` from `@prisma/client` if your model is named `CVComponent`.
// Assuming `CVComponent` from `@prisma/client` is the desired return type.
type CVComponentPayload = CVComponent;

/**
 * Maps incoming JSON data from cv-data.json to the Prisma CVComponent model structure.
 * @param data Raw JSON data for a CV component.
 * @returns Mapped data for Prisma create/update.
 */
function mapRawDataToPrismaCVComponent(data: RawCvComponentJsonData): Omit<Prisma.CVComponentCreateInput, 'id'> {
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
    return [] as string[]; // Explicitly type as string[]
  };

  const keywords = processTags(data.Keywords);
  const targetRoleTags = processTags(data['Target Role Tags']);
  const combinedTags = Array.from(new Set([...keywords, ...targetRoleTags])); // Use Array.from(new Set()) to ensure unique tags and avoid iteration warning

  const mappedData: Prisma.CVComponentCreateInput = {
    uniqueId: data.UniqueID,
    name: data['Component Name'],
    type: data['Component Type'],
    content: JSON.stringify(data['Content (Primary)']),
    tags: { set: combinedTags }, // Use Prisma's `set` for array fields
    userId: 'orion_default_user', // TODO: Replace with actual user ID from session/auth
  };

  logger.debug('[CV_DB_SERVICE][MAP_DATA]', { raw: data, mapped: mappedData });
  return mappedData;
}
/**
 * Saves or updates a CV component in the database.
 * If a component with the same uniqueId exists, it updates it; otherwise, it creates a new one.
 * @param componentData The raw JSON data for the CV component.
 * @returns The saved or updated CV component.
 */
export async function saveOrUpdateCvComponent(componentData: RawCvComponentJsonData): Promise<CVComponentPayload> {
  const logContext = { operation: 'saveOrUpdateCvComponent', uniqueId: componentData.UniqueID };

  if (!componentData.UniqueID) {
    logger.warn('[CV_DB_SERVICE][SAVE_OR_UPDATE] Skipping CV component with no UniqueID.', {
      componentName: componentData['Component Name'],
    });
    // To satisfy the Promise<CVComponentPayload> return type, we must throw or return a valid object.
    // Throwing an error might be more appropriate if a UniqueID is strictly required.
    // For a bulk import, skipping and logging might be preferred.
    // Let's throw for now, as the function signature implies a successful save/update.
    throw new Error('CV Component UniqueID is missing.');
  }
  logger.info('[CV_DB_SERVICE][SAVE_OR_UPDATE][START]', logContext);

  try {
    const dataToSave = mapRawDataToPrismaCVComponent(componentData);
    const existingComponent = await prisma.cVComponent.findUnique({
      where: { uniqueId: componentData.UniqueID },
    });

    let savedComponent: CVComponentPayload;

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
    logger.error('[CV_DB_SERVICE][SAVE_OR_UPDATE][ERROR]', {
      ...logContext,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(`Failed to save or update CV component: ${errorMessage}`);
  }
}

/**
 * Fetches all CV components from the database.
 * @returns An array of CVComponent objects.
 */
export async function fetchAllCvComponents(): Promise<CVComponentPayload[]> {
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
    logger.error('[CV_DB_SERVICE][FETCH_ALL][ERROR]', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(`Failed to fetch CV components: ${errorMessage}`);
  }
}

/**
 * Deletes a CV component by its uniqueId.
 * @param uniqueId The unique ID of the CV component to delete.
 * @returns The deleted CV component.
 */
export async function deleteCvComponent(uniqueId: string): Promise<CVComponentPayload> {
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
    logger.error('[CV_DB_SERVICE][DELETE][ERROR]', {
      ...logContext,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(`Failed to delete CV component: ${errorMessage}`);
  }
}

/**
 * Finds a CV component by its uniqueId.
 * @param uniqueId The unique ID of the CV component.
 * @returns The found CV component or null if not found.
 */
export async function findCvComponentByUniqueId(uniqueId: string): Promise<CVComponentPayload | null> {
  const logContext = { operation: 'findCvComponentByUniqueId', uniqueId };
  logger.debug('[CV_DB_SERVICE][FIND_BY_UNIQUE_ID][START]', logContext);
  try {
    const component = await prisma.cVComponent.findUnique({
      where: { uniqueId },
    });
    if (component) {
      logger.debug('[CV_DB_SERVICE][FIND_BY_UNIQUE_ID][FOUND]', { ...logContext, found: true });
    } else {
      logger.debug('[CV_DB_SERVICE][FIND_BY_UNIQUE_ID][NOT_FOUND]', { ...logContext, found: false });
    }
    return component;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[CV_DB_SERVICE][FIND_BY_UNIQUE_ID][ERROR]', {
      ...logContext,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(`Failed to find CV component by uniqueId: ${errorMessage}`);
  }
}
