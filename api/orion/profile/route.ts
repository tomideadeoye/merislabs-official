/**
 * api/orion/profile/route.ts
 * GOAL: This API route provides access to the user's profile information.
 * It fetches the profile data using `fetchUserProfile` and returns it as a JSON response.
 *
 * RELATION TO OTHER FILES, FUNCTIONS AND FEATURES:
 * - This route interacts with `lib/profile_service.ts` to retrieve user profile data.
 * - It uses `lib/logger.ts` for logging operational information.
 * - Frontend components (e.g., user profile dashboards, contextual AI prompts) will consume this API.
 */
import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { fetchUserProfile } from '@/lib/profile_service';

export const dynamic = 'force-dynamic';

export async function GET() {
  logger.info('[API][Profile][GET] Received request to fetch user profile.');
  try {
    const userProfile = await fetchUserProfile();

    if (!userProfile) {
      logger.warn('[API][Profile][GET] User profile not found.');
      return NextResponse.json({ success: false, error: 'User profile not found' }, { status: 404 });
    }

    logger.info('[API][Profile][GET] Successfully fetched user profile.');
    return NextResponse.json({ success: true, profile: userProfile });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    logger.error('[API][Profile][GET] Error fetching user profile:', { error: errorMessage });
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile', details: errorMessage },
      { status: 500 }
    );
  }
}
