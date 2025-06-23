/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * @fileoverview Database service for managing user prompts in the Orion system.
 * @description This service provides a centralized interface for interacting with the `Prompt` model in the PostgreSQL database via Prisma. It encapsulates all CRUD operations (Create, Read, Update, Delete) for user-defined prompts, ensuring data integrity and consistency. This service supports the 'My Prompts' feature, allowing users to store and retrieve their frequently used AI prompts.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To abstract database interactions for the `Prompt` model.
 *   - To provide functions to fetch all prompts for a given user.
 *   - To provide functions to create new prompts with unique IDs.
 *   - To provide functions to update existing prompts.
 *   - To provide functions to delete prompts.
 *   - To ensure type safety and robust error handling for all database operations.
 *
 * FILEPATH: `app/lib/prompt_db_service.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `prisma/schema.prisma`: Defines the `Prompt` model schema that this service interacts with.
 *   - `@/generated/prisma`: Imports the Prisma client for database operations.
 *   - `@/lib/logger`: Used for comprehensive logging of database interactions.
 *   - `@/lib/types`: May define interfaces for Prompt-related data if needed (though Prisma types often suffice).
 *   - `app/api/orion/prompts/*`: API routes will consume these service functions to handle frontend requests.
 *   - `app/components/orion/MyPromptsStudio.tsx`: The UI component that will interact with the API routes, which in turn use this service.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the Prisma client (`prisma`) is correctly initialized and connected to the PostgreSQL database.
 *   - Assumes `userId` is always provided for operations that require user context (e.g., fetching user-specific prompts).
 *   - Errors during database operations are caught and logged, providing clear messages for debugging.
 *   - `uniqueId` generation is handled at the service layer to ensure uniqueness.
 *
 * NOTES:
 *   - This service is a critical component for the 'My Prompts' feature, ensuring reliable storage and retrieval of user prompts.
 *   - All functions include logging for traceability and debugging.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Validation Layer:** Implement a more explicit input validation layer (e.g., using Zod) within this service or at the API layer for incoming prompt data.
 *   - **Pagination:** For a large number of prompts, implement pagination for `getAllPromptsByUserId` to improve performance.
 *   - **Full-Text Search:** Consider adding full-text search capabilities for prompt content if the user desires advanced searching.
 *   - **Soft Deletes:** Instead of hard-deleting, implement soft deletes (marking as `deleted: true`) for prompts to allow recovery.
 */

import { prisma } from '@/lib/prisma'; // Corrected import to the instantiated Prisma client
import logger from '@/lib/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; // Corrected import path
import { v4 as uuidv4 } from 'uuid'; // New: Import uuidv4 for generating unique IDs

/**
 * Interface for the data needed to create or update a prompt.
 * This can be extended as needed based on the Prompt model.
 */
interface PromptInput {
  name: string;
  content: string;
  category?: string;
}

/**
 * Fetches all prompts associated with a specific user ID.
 * @param userId The ID of the user whose prompts to fetch.
 * @returns A promise that resolves to an array of Prompt objects, or an empty array if none found.
 */
export async function getAllPromptsByUserId(userId: string) {
  const logContext = { function: 'getAllPromptsByUserId', userId };
  logger.info('[PromptDbService][getAllPromptsByUserId][START]', logContext);
  try {
    const prompts = await prisma.prompt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    logger.success('[PromptDbService][getAllPromptsByUserId][SUCCESS]', { ...logContext, count: prompts.length });
    return prompts;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('[PromptDbService][getAllPromptsByUserId][ERROR]', { ...logContext, error: errorMessage });
    throw new Error(`Failed to fetch prompts: ${errorMessage}`);
  }
}

/**
 * @function createPrompt
 * @description Creates a new prompt for a given user.
 * @param userId The ID of the user creating the prompt.
 * @param promptData The data for the new prompt (name, content, category).
 */
/**
 * Creates a new prompt for a given user.
 * @param userId The ID of the user creating the prompt.
 * @param promptData The data for the new prompt (name, content, category).
 * @returns A promise that resolves to the newly created Prompt object.
 */
export async function createPrompt(userId: string, promptData: PromptInput) {
  const logContext = { function: 'createPrompt', userId, promptName: promptData.name };
  logger.info('[PromptDbService][createPrompt][START]', logContext);
  try {
    const newPrompt = await prisma.prompt.create({
      data: {
        ...promptData,
        userId, // Ensure userId is passed
        uniqueId: uuidv4(), // Use uuidv4 for robust unique ID generation
      },
    });
    logger.success('[PromptDbService][createPrompt][SUCCESS]', { ...logContext, promptId: newPrompt.id });
    return newPrompt;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('[PromptDbService][createPrompt][ERROR]', { ...logContext, error: errorMessage });
    throw new Error(`Failed to create prompt: ${errorMessage}`);
  }
}

/**
 * @function updatePrompt
 * @description Updates an existing prompt.
 * @param uniqueId The unique ID of the prompt to update.
 * @param userId The ID of the user who owns the prompt (for authorization).
 * @param updateData The data to update (name, content, category - partial allowed).
 */
/**
 * Updates an existing prompt.
 * @param uniqueId The unique ID of the prompt to update.
 * @param userId The ID of the user who owns the prompt (for authorization).
 * @param updateData The data to update (name, content, category - partial allowed).
 * @returns A promise that resolves to the updated Prompt object.
 */
export async function updatePrompt(uniqueId: string, userId: string, updateData: Partial<PromptInput>) {
  const logContext = { function: 'updatePrompt', uniqueId, userId, updateData };
  logger.info('[PromptDbService][updatePrompt][START]', logContext);
  try {
    const updatedPrompt = await prisma.prompt.update({
      where: { uniqueId, userId }, // Ensure user owns the prompt
      data: updateData,
    });
    logger.success('[PromptDbService][updatePrompt][SUCCESS]', { ...logContext, promptId: updatedPrompt.id });
    return updatedPrompt;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof PrismaClientKnownRequestError && error.code === 'P2025'
        ? 'Prompt not found or user not authorized.'
        : error instanceof Error
          ? error.message
          : 'Unknown error';
    logger.error('[PromptDbService][updatePrompt][ERROR]', { ...logContext, error: errorMessage });
    throw new Error(`Failed to update prompt: ${errorMessage}`);
  }
}

/**
 * @function deletePrompt
 * @description Deletes a prompt by its unique ID.
 * @param uniqueId The unique ID of the prompt to delete.
 * @param userId The ID of the user who owns the prompt (for authorization).
 */
/**
 * Deletes a prompt by its unique ID.
 * @param uniqueId The unique ID of the prompt to delete.
 * @param userId The ID of the user who owns the prompt (for authorization).
 * @returns A promise that resolves to the deleted Prompt object.
 */
export async function deletePrompt(uniqueId: string, userId: string) {
  const logContext = { function: 'deletePrompt', uniqueId, userId };
  logger.info('[PromptDbService][deletePrompt][START]', logContext);
  try {
    const deletedPrompt = await prisma.prompt.delete({
      where: { uniqueId, userId }, // Ensure user owns the prompt
    });
    logger.success('[PromptDbService][deletePrompt][SUCCESS]', { ...logContext, promptId: deletedPrompt.id });
    return deletedPrompt;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof PrismaClientKnownRequestError && error.code === 'P2025'
        ? 'Prompt not found or user not authorized.'
        : error instanceof Error
          ? error.message
          : 'Unknown error';
    logger.error('[PromptDbService][deletePrompt][ERROR]', { ...logContext, error: errorMessage });
    throw new Error(`Failed to delete prompt: ${errorMessage}`);
  }
}
