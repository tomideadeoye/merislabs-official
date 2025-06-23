/**
 * @fileoverview API route for saving user profile data to the Neon database.
 * @description This endpoint receives comprehensive user profile information and persists it
 *   to the `UserProfile` table in the PostgreSQL database via Prisma. It is designed to
 *   centralize and structure user profile data, moving away from Notion as the primary source.
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
 *   - `@/generated/prisma`: Imports the Prisma client for database operations.
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
 *   - This is a critical step in migrating profile data from Notion to Neon.
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
import { z } from 'zod';
import { prisma } from '@/lib/prisma'; // Assuming Prisma client is instantiated here
import logger from '@/lib/logger';
// Define the Zod schema for the incoming profile data
const profileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  mobile: z.string().optional(),
  website: z.string().url().optional(),
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  substack: z.string().url().optional(),
  slideshare: z.string().url().optional(),
  medium: z.string().url().optional(),
  discord: z.string().optional(),
  merisLabsLinkedin: z.string().url().optional(),
  bioPitchLink: z.string().url().optional(),
  youtube: z.string().url().optional(),
  language: z.string().optional(),
  location: z.string().optional(),
  profileText: z.string(), // This will contain the entire unstructured text
});

export async function POST(request: NextRequest) {
  const logContext = {
    route: '/api/orion/profile/save',
    timestamp: new Date().toISOString(),
    operation: 'POST',
  };
  logger.info('[PROFILE_SAVE_API][POST][START] Received request to save user profile.', logContext);

  // Temporarily bypass authentication as requested
  // const session = await auth();
  // const userId = session?.user?.id;
  const userId = 'user_tomide_adeoye_123'; // Hardcode a test user ID for unauthenticated access

  // if (!userId) {
  //   logger.warn('[PROFILE_SAVE_API][POST][AUTH_FAIL] Unauthorized access attempt.', logContext);
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const body = await request.json();
    console.log('[API_DEBUG][RAW_BODY]', body); // Added for debugging
    logger.debug('[PROFILE_SAVE_API][POST][BODY_PARSED]', {
      ...logContext,
      bodyPreview: JSON.stringify(body).substring(0, 200) + '...',
    });

    const validatedData = profileSchema.parse(body);
    console.log('[API_DEBUG][VALIDATED_DATA]', validatedData); // Added for debugging
    logger.debug('[PROFILE_SAVE_API][POST][VALIDATION_SUCCESS]', {
      ...logContext,
      validatedKeys: Object.keys(validatedData),
    });

    // Check if a profile already exists for this userId
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    let savedProfile;
    if (existingProfile) {
      // Update existing profile
      logger.info('[PROFILE_SAVE_API][POST][UPDATING_PROFILE] Existing profile found, updating.', {
        ...logContext,
        profileId: existingProfile.id,
      });
      savedProfile = await prisma.userProfile.update({
        where: { userId },
        data: {
          ...validatedData,
          lastFetchedAt: new Date(), // Update fetch timestamp on save
        },
      });
      logger.success('[PROFILE_SAVE_API][POST][UPDATE_SUCCESS] User profile updated successfully.', {
        ...logContext,
        profileId: savedProfile.id,
      });
    } else {
      // Create new profile
      logger.info('[PROFILE_SAVE_API][POST][CREATING_PROFILE] No existing profile, creating new one.', logContext);
      savedProfile = await prisma.userProfile.create({
        data: {
          ...validatedData,
          userId, // Link the profile to the authenticated user
          lastFetchedAt: new Date(), // Set fetch timestamp on creation
        },
      });
      logger.success('[PROFILE_SAVE_API][POST][CREATE_SUCCESS] User profile created successfully.', {
        ...logContext,
        profileId: savedProfile.id,
      });
    }

    return NextResponse.json({ success: true, profile: savedProfile }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      logger.error('[PROFILE_SAVE_API][POST][VALIDATION_ERROR] Invalid input for saving profile.', {
        ...logContext,
        error: error.errors,
      });
      return NextResponse.json(
        { success: false, error: 'Invalid input for saving profile.', details: error.errors },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[PROFILE_SAVE_API][POST][GENERAL_ERROR] Failed to save user profile.', {
      ...logContext,
      error: errorMessage,
      fullError: error, // Log the full error object for detailed debugging
    });
    // Also log to console for immediate visibility in terminal output
    console.error('[PROFILE_SAVE_API][POST][RAW_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to save user profile.' }, { status: 500 });
  }
}
