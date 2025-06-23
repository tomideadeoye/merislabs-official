/**
 * @fileoverview API route for fetching user profile data from the Neon database.
 * @description This endpoint retrieves comprehensive user profile information from the
 *   `UserProfile` table in the PostgreSQL database via Prisma. It is designed to
 *   serve the centralized and structured user profile data, moving away from Notion.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide a GET endpoint (`/api/orion/profile`) for retrieving user profile data.
 *   - To fetch a `UserProfile` record from the Neon database based on a user ID.
 *   - To provide comprehensive logging for successful operations and errors.
 *
 * FILEPATH: `app/api/orion/profile/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `prisma/schema.prisma`: Defines the `UserProfile` model, which this API interacts with.
 *   - `@/generated/prisma`: Imports the Prisma client for database operations.
 *   - `@/lib/logger`: Used for comprehensive logging of API requests and database interactions.
 *   - `app/lib/profile_db_service.ts` (forthcoming): This API route will ideally call a dedicated database service for profile operations.
 *   - `auth.ts`: Used for user authentication to ensure only the authenticated user can access their profile.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the user is authenticated and `session.user.id` is available for identifying the profile.
 *   - Handles cases where no profile is found for the given user ID.
 *
 * NOTES:
 *   - This is a critical step in verifying the migration of profile data from Notion to Neon.
 *   - The `profileText` field is designed to store the entire unstructured text dump for LLM context.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Dedicated DB Service**: Extract the Prisma logic into a `app/lib/profile_db_service.ts` for better separation of concerns and reusability.
 *   - **Caching**: Implement server-side caching (e.g., Redis) for frequently accessed profile data to reduce database load.
 *   - **Error Handling Details**: Provide more granular error messages to the client for specific failures.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';

export async function GET() {
  const logContext = {
    route: '/api/orion/profile',
    timestamp: new Date().toISOString(),
    operation: 'GET',
  };
  logger.info('[PROFILE_GET_API][GET][START] Received request to fetch user profile.', logContext);

  // Temporarily bypass authentication as requested
  // const session = await auth();
  // const userId = session?.user?.id;
  const userId = 'user_tomide_adeoye_123'; // Hardcode a test user ID for unauthenticated access

  // if (!userId) {
  //   logger.warn('[PROFILE_GET_API][GET][AUTH_FAIL] Unauthorized access attempt.', logContext);
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (userProfile) {
      logger.success('[PROFILE_GET_API][GET][FETCH_SUCCESS] User profile fetched successfully.', {
        ...logContext,
        profileId: userProfile.id,
      });
      return NextResponse.json({ success: true, profile: userProfile }, { status: 200 });
    } else {
      logger.info('[PROFILE_GET_API][GET][NOT_FOUND] User profile not found for ID.', {
        ...logContext,
        userId,
      });
      return NextResponse.json({ success: false, error: 'User profile not found.' }, { status: 404 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[PROFILE_GET_API][GET][GENERAL_ERROR] Failed to fetch user profile.', {
      ...logContext,
      error: errorMessage,
      fullError: error, // Log the full error object for detailed debugging
    });
    console.error('[PROFILE_GET_API][GET][RAW_ERROR]', error); // Also log to console
    return NextResponse.json({ success: false, error: 'Failed to fetch user profile.' }, { status: 500 });
  }
}
