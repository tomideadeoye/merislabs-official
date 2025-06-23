/**
 * @fileoverview API routes for managing LLM model settings within the Orion system.
 * @description This file provides endpoints for fetching and updating user-specific LLM preferences,
 *   ensuring persistent storage in the Neon PostgreSQL database via Prisma.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - `GET /api/orion/llm-settings`: Retrieve the current LLM settings for the authenticated user.
 *     - If no settings exist, a default or empty configuration is returned.
 *   - `PATCH /api/orion/llm-settings`: Update the LLM settings for the authenticated user.
 *     - Creates a new entry if no settings exist for the user, otherwise updates the existing one.
 *   - Ensure secure, server-side handling of LLM configuration data.
 *   - Provide robust error handling and logging for API operations.
 *
 * FILEPATH: `app/api/orion/llm-settings/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/lib/db`: Imports the Prisma client for database interactions.
 *   - `@/lib/logger`: Used for structured, context-rich logging of API requests and responses.
 *   - `@/auth`: Imports the NextAuth.js `auth` function for session management and user authentication.
 *   - `@/lib/types`: Imports `LlmSettingsPayload` for type-safe request body validation.
 *   - `app/(orion_admin)/admin/system-settings/components/LlmModelSettings.tsx`: The frontend component that consumes these API endpoints for fetching and saving LLM preferences.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes user authentication is handled by NextAuth.js and `session.user.id` is available for identifying the user.
 *   - Assumes the Prisma client (`db`) is correctly initialized and connected to the Neon PostgreSQL database.
 *   - `requestTypeOverrides` is stored as a JSON field, allowing flexible storage of key-value pairs for specific model overrides.
 *   - Error handling is comprehensive, distinguishing between authentication, validation, and database errors.
 *
 * NOTES:
 *   - This API route is crucial for making LLM configurations persistent and synchronized across user sessions/devices.
 *   - The `upsert` operation in Prisma is ideal for handling both creation and updating of settings in a single call.
 *   - Logging helps in debugging issues related to saving or fetching settings.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Zod Validation**: Implement Zod schema validation for the `PATCH` request body to ensure incoming data conforms to `LlmSettingsPayload` and provide more descriptive validation errors.
 *   - **Rate Limiting**: Add rate limiting to protect the API from excessive requests.
 *   - **Authorization Granularity**: If different user roles have different permissions for modifying LLM settings, enhance authorization checks.
 *   - **Default Settings Management**: Implement a more sophisticated system for global default LLM settings that can be configured by an admin and propagate to new users.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - This file consolidates all CRUD operations for user-specific LLM settings.
 *   - Consistent logging patterns align with other API routes in the application.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth'; // Re-enable auth import
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';
import { LlmSettingsPayload, PreferredModels } from '@/lib/types';
import { AVAILABLE_LLM_MODELS } from '@/lib/orion_config'; // Import AVAILABLE_LLM_MODELS

interface LogContextType {
  route: string;
  timestamp: string;
  userId?: string;
  operation?: string;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  const logContext: LogContextType = {
    route: '/api/orion/llm-settings',
    timestamp: new Date().toISOString(),
    operation: 'GET',
  };
  logger.info('[LLM_SETTINGS_API][GET][START] Received request to fetch LLM settings.', logContext);

  // Temporarily bypass authentication as requested.
  // NOTE: This is for development purposes. Re-enable auth in production.
  // const session = await auth();
  // if (!session || !session.user || !session.user.id) {
  //   logger.warn('[LLM_SETTINGS_API][GET][AUTH_FAIL] Unauthorized access attempt.', logContext);
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }
  const userId = 'DEVELOPMENT_USER_ID'; // Use a fixed ID for development when auth is bypassed
  // logContext.userId = userId; // Commented out as userId is now a fixed string for development

  // Remove this line to use dynamic user ID once authentication is re-enabled.
  // const userId = session.user.id; // Use authenticated user ID
  logContext.userId = userId; // Keep this line for logging, even with fixed ID

  try {
    const settings = await prisma.llmSettings.findUnique({
      where: { userId: userId },
    });

    if (settings) {
      logger.success('[LLM_SETTINGS_API][GET][SUCCESS] LLM settings fetched successfully.', logContext);
      // Ensure requestTypeOverrides is parsed if it's stored as JSONB string
      const parsedOverrides = settings.requestTypeOverrides
        ? (settings.requestTypeOverrides as PreferredModels['requestTypeOverrides'])
        : undefined;
      return NextResponse.json({
        success: true,
        settings: {
          id: settings.id,
          userId: settings.userId,
          globalDefaultModel: settings.globalDefaultModel,
          requestTypeOverrides: parsedOverrides,
          createdAt: settings.createdAt,
          updatedAt: settings.updatedAt,
        },
      });
    } else {
      logger.info('[LLM_SETTINGS_API][GET][NOT_FOUND] No LLM settings found for user. Returning empty.', logContext);
      return NextResponse.json({
        success: true,
        settings: {},
        message: 'No LLM settings found for this user.',
      });
    }
  } catch (error: unknown) {
    logger.error('[LLM_SETTINGS_API][GET][ERROR] Failed to fetch LLM settings.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to fetch LLM settings.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const logContext: LogContextType = {
    route: '/api/orion/llm-settings',
    timestamp: new Date().toISOString(),
    operation: 'PATCH',
  };
  logger.info('[LLM_SETTINGS_API][PATCH][START] Received request to update LLM settings.', logContext);

  // Temporarily bypass authentication as requested.
  // NOTE: This is for development purposes. Re-enable auth in production.
  // const session = await auth();
  // if (!session || !session.user || !session.user.id) {
  //   logger.warn('[LLM_SETTINGS_API][PATCH][AUTH_FAIL] Unauthorized access attempt.', logContext);
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }
  const userId = 'DEVELOPMENT_USER_ID'; // Use a fixed ID for development when auth is bypassed
  // logContext.userId = userId; // Commented out as userId is now a fixed string for development

  // Remove this line to use dynamic user ID once authentication is re-enabled.
  // const userId = session.user.id; // Use authenticated user ID
  logContext.userId = userId; // Keep this line for logging, even with fixed ID

  try {
    const body: LlmSettingsPayload = await request.json();
    logger.debug('[LLM_SETTINGS_API][PATCH][PAYLOAD]', { ...logContext, body });

    const { globalDefaultModel, requestTypeOverrides } = body;

    if (globalDefaultModel === undefined && requestTypeOverrides === undefined) {
      logger.warn('[LLM_SETTINGS_API][PATCH][VALIDATION_FAIL] No fields provided for update.', logContext);
      return NextResponse.json({ success: false, error: 'No fields provided for update.' }, { status: 400 });
    }

    // Validate globalDefaultModel
    if (
      globalDefaultModel !== undefined &&
      globalDefaultModel !== null &&
      !AVAILABLE_LLM_MODELS.some((model) => model.id === globalDefaultModel)
    ) {
      logger.warn('[LLM_SETTINGS_API][PATCH][VALIDATION_FAIL] Invalid globalDefaultModel provided.', {
        ...logContext,
        globalDefaultModel,
      });
      return NextResponse.json({ success: false, error: 'Invalid global default model ID provided.' }, { status: 400 });
    }

    // Validate requestTypeOverrides
    if (requestTypeOverrides) {
      for (const [requestType, modelId] of Object.entries(requestTypeOverrides)) {
        if (modelId !== undefined && modelId !== null && !AVAILABLE_LLM_MODELS.some((model) => model.id === modelId)) {
          logger.warn('[LLM_SETTINGS_API][PATCH][VALIDATION_FAIL] Invalid model ID in requestTypeOverrides.', {
            ...logContext,
            requestType,
            modelId,
          });
          return NextResponse.json(
            { success: false, error: `Invalid model ID provided for request type: ${requestType}` },
            { status: 400 }
          );
        }
      }
    }

    // Convert requestTypeOverrides to a plain object for Prisma if it's a Map
    const overridesToStore =
      requestTypeOverrides instanceof Map ? Object.fromEntries(requestTypeOverrides) : requestTypeOverrides;

    const updatedSettings = await prisma.llmSettings.upsert({
      where: { userId: userId },
      update: {
        globalDefaultModel: globalDefaultModel,
        requestTypeOverrides: overridesToStore,
      },
      create: {
        userId: userId,
        globalDefaultModel: globalDefaultModel,
        requestTypeOverrides: overridesToStore,
      },
    });

    logger.success('[LLM_SETTINGS_API][PATCH][SUCCESS] LLM settings updated successfully.', {
      ...logContext,
      settingsId: updatedSettings.id,
    });

    // Ensure requestTypeOverrides is parsed back for the response
    const parsedOverrides = updatedSettings.requestTypeOverrides
      ? (updatedSettings.requestTypeOverrides as PreferredModels['requestTypeOverrides'])
      : undefined;

    return NextResponse.json({
      success: true,
      message: 'LLM settings updated successfully.',
      settings: {
        id: updatedSettings.id,
        userId: updatedSettings.userId,
        globalDefaultModel: updatedSettings.globalDefaultModel,
        requestTypeOverrides: parsedOverrides,
        createdAt: updatedSettings.createdAt,
        updatedAt: updatedSettings.updatedAt,
      },
    });
  } catch (error: unknown) {
    logger.error('[LLM_SETTINGS_API][PATCH][ERROR] Failed to update LLM settings.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to update LLM settings.' }, { status: 500 });
  }
}

export async function GET_LLM_MODELS() {
  const logContext = {
    route: '/api/orion/llm-settings',
    operation: 'GET_LLM_MODELS',
    timestamp: new Date().toISOString(),
  };
  logger.info('[LLM_SETTINGS_API][GET][START] Request received for LLM models.', logContext);

  try {
    // TODO: In a real application, this would dynamically fetch models from an LLM provider
    // or a configuration service.
    const availableModels = [
      'azure/gpt-4.1-mini',
      'azure/gpt-4.1-turbo',
      'azure/gemini-pro',
      'google/gemini-1.5-flash-latest',
      'google/gemini-1.5-pro-latest',
    ];

    logger.success('[LLM_SETTINGS_API][GET][SUCCESS] Successfully fetched LLM models.', {
      ...logContext,
      modelCount: availableModels.length,
      models: availableModels,
    });
    return NextResponse.json({ success: true, models: availableModels });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    logger.error('[LLM_SETTINGS_API][GET][ERROR] Failed to fetch LLM models.', {
      ...logContext,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : 'N/A',
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
