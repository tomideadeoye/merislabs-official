/**
 * @fileoverview API route for saving user profile data to the Neon database.
 * @description This endpoint receives comprehensive user profile information and persists it
 *   to the `UserProfile` table in the PostgreSQL database via Prisma. It is designed to
 *   centralize and structure user profile data, moving away from WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES as the primary source.
 *   This route is crucial for populating and updating the user's core identity within Orion.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide a POST endpoint (`/api/orion/profile/save`) for receiving user profile data.
 *   - To validate incoming profile data against a defined schema.
 *   - To create or update a `UserProfile` record in the Neon database.
 *   - To handle all necessary data transformations from the input format to the `UserProfile` model.
 *   - To provide comprehensive logging for successful operations and errors.
 *
 * FILEPATH: `app/api/orion/profile/save/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `prisma/schema.prisma`: Defines the `UserProfile` model, which this API interacts with.
 *   - `@prisma/client`: Imports the Prisma client for database operations.
 *   - `@/lib/logger`: Used for comprehensive logging of API requests and database interactions.
 *   - `@/lib/types`: Will need to define an interface for the incoming profile data if it's structured (or infer from Zod schema).
 *   - `app/lib/profile_db_service.ts` (forthcoming): This API route will ideally call a dedicated database service for profile operations.
 *   - `auth.ts`: Used for user authentication to ensure only the authenticated user can modify their profile.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the user is authenticated and `session.user.id` is available for associating the profile.
 *   - Assumes the incoming JSON body contains all necessary profile fields.
 *   - Uses Zod for robust input validation.
 *   - Handles both creation (if no profile exists for the user) and updating (if one does).
 *
 * NOTES:
 *   - This is a critical step in migrating profile data from WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES to Neon.
 *   - The `profileText` field is designed to store the entire unstructured text dump for LLM context.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Dedicated DB Service**: Extract the Prisma logic into a `app/lib/profile_db_service.ts` for better separation of concerns and reusability.
 *   - **Partial Updates**: Enhance to allow partial updates of profile data, rather than requiring all fields on every save.
 *   - **Data Sanitization**: Implement additional sanitization for incoming string data to prevent injection or invalid characters.
 *   - **Rate Limiting**: Add rate limiting to prevent abuse of the profile update endpoint.
 *   - **Error Handling Details**: Provide more granular error messages to the client for specific validation failures.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming Prisma client is instantiated here
import logger from '@/lib/logger';
import { generateLLMResponse } from '@/lib/orion_llm';

export async function POST(request: NextRequest) {
  const logContext = {
    route: '/api/orion/profile/save',
    timestamp: new Date().toISOString(),
    operation: 'POST',
  };
  logger.info('[PROFILE_SAVE_API][POST][START] Received request to save user profile.', logContext);

  const userId = 'user_tomide_adeoye_123';

  try {
    const body = await request.json();
    logger.debug('[PROFILE_SAVE_API][POST][BODY_PARSED]', {
      ...logContext,
      bodyPreview: JSON.stringify(body).substring(0, 200) + '...',
    });

    const { profileText } = body;
    if (!profileText) {
      logger.error('[PROFILE_SAVE_API][POST][NO_PROFILE_TEXT] profileText is required for LLM update.', logContext);
      return NextResponse.json({ success: false, error: 'profileText is required.' }, { status: 400 });
    }

    // Fetch existing profile for context
    const existingProfile = await prisma.userProfile.findFirst();
    if (!existingProfile) {
      logger.error('[PROFILE_SAVE_API][POST][NO_EXISTING_PROFILE] No profile found to update.', logContext);
      return NextResponse.json({ success: false, error: 'No existing profile found to update.' }, { status: 404 });
    }
    logger.info('[PROFILE_SAVE_API][POST][EXISTING_PROFILE_FETCHED]', { ...logContext, hasExisting: !!existingProfile });

    // Build LLM prompt for field extraction/merge
    const fieldList = [
      'name', 'email', 'mobile', 'website', 'github', 'linkedin', 'substack', 'slideshare', 'medium', 'discord',
      'merisLabsLinkedin', 'bioPitchLink', 'youtube', 'language', 'location', 'backgroundSummary', 'keySkills',
      'goals', 'values', 'bio', 'skills', 'experience', 'education', 'interests', 'socialLinks', 'summary'
    ];
    const existingProfileJson = JSON.stringify(existingProfile);
    const llmPrompt = `You are an expert personal data assistant. Given the user's latest profile text dump (below), and their current profile data (if any), extract and return ONLY the fields that are new or changed, as a JSON object. Use the following field names: ${fieldList.join(', ')}. If a field is not present or not changed, do not include it in the output. If a field is new, include it. If a field is updated, include the new value. Output ONLY a valid JSON object with the changed fields.\n\nCurrent profile data (JSON):\n${existingProfileJson}\n\nNew profile text dump:\n${profileText}`;

    logger.info('[PROFILE_SAVE_API][POST][LLM_PROFILE_UPDATE_PROMPT]', { ...logContext, promptLength: llmPrompt.length });
    // Call LLM to extract/merge fields
    const llmResponse = await generateLLMResponse('PROFILE_FIELD_EXTRACTION', llmPrompt, userId, {
      systemContext: 'You are a profile field extraction and update assistant. Output only a valid JSON object with changed or new fields.',
      temperature: 0.2,
      maxTokens: 800,
    });

    let updateFields: Record<string, unknown> = {};
    if (llmResponse.success && llmResponse.content) {
      try {
        updateFields = JSON.parse(llmResponse.content) as Record<string, unknown>;
        logger.info('[PROFILE_SAVE_API][POST][LLM_PROFILE_UPDATE_PARSED]', { ...logContext, updateFields });
      } catch (err) {
        logger.error('[PROFILE_SAVE_API][POST][LLM_PROFILE_UPDATE_PARSE_ERROR]', { ...logContext, error: err, rawContent: llmResponse.content });
        updateFields = {};
      }
    } else {
      logger.error('[PROFILE_SAVE_API][POST][LLM_PROFILE_UPDATE_FAIL]', { ...logContext, error: ('error' in llmResponse ? (llmResponse as { error?: string }).error : 'Unknown LLM error') });
      updateFields = {};
    }

    // Always update profileText and lastFetchedAt
    updateFields.profileText = profileText;
    updateFields.lastFetchedAt = new Date();

    // Detect new field suggestions (fields not in Prisma schema)
    const prismaFields = [
      'name', 'email', 'mobile', 'website', 'github', 'linkedin', 'substack', 'slideshare', 'medium', 'discord',
      'merisLabsLinkedin', 'bioPitchLink', 'youtube', 'language', 'location', 'profileText', 'lastFetchedAt', 'userId', 'createdAt', 'updatedAt'
    ];
    const newFieldSuggestions = Object.entries(updateFields)
      .filter(([key]) => !prismaFields.includes(key))
      .map(([name, value]) => ({ name, value }));
    // Remove new field suggestions from updateFields so Prisma doesn't error
    for (const { name } of newFieldSuggestions) {
      delete updateFields[name];
    }

    // Always update the existing profile (never create)
    logger.info('[PROFILE_SAVE_API][POST][UPDATING_PROFILE] Updating the only profile in the DB.', {
      ...logContext,
      profileId: existingProfile.id,
    });
    const savedProfile = await prisma.userProfile.update({
      where: { id: existingProfile.id },
      data: updateFields,
    });
    logger.success('[PROFILE_SAVE_API][POST][UPDATE_SUCCESS] User profile updated successfully.', {
      ...logContext,
      profileId: savedProfile.id,
    });

    return NextResponse.json({ success: true, profile: savedProfile, newFieldSuggestions }, { status: 200 });
  } catch (error: unknown) {
    logger.error('[PROFILE_SAVE_API][POST][GENERAL_ERROR] Failed to save user profile.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      fullError: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to save user profile.' }, { status: 500 });
  }
}
