import { NextResponse } from 'next/server';
import { fetchUserProfile } from '@/lib/profile_service';
import logger from '@/lib/logger';
import { fetchServerUserProfile } from '@/lib/server_profile_fetcher';

export const revalidate = 300; // Revalidate every 5 minutes

/**
 * @swagger
 * /api/orion/profile:
 *   get:
 *     summary: Fetches the user's profile data
 *     description: Retrieves the user's profile from Notion or local files, with server-side caching.
 *     tags:
 *       - Orion
 *     responses:
 *       200:
 *         description: Successfully fetched profile data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileData'
 *       404:
 *         description: Profile not found.
 *       500:
 *         description: Failed to fetch profile data.
 */
export async function GET() {
  try {
    logger.info('Fetching user profile from API route', {
      operation: 'GET /api/orion/profile',
      timestamp: new Date().toISOString(),
    });

    const profileData = await fetchServerUserProfile();
    if (profileData.success && profileData.profile) {
      // Attempt to extract email from profileText if profile.email is not directly available
      let userEmail = profileData.profile.email;
      if (!userEmail && profileData.profileText) {
        const emailMatch = profileData.profileText.match(/Email: (\S+@\S+\.\S+)/);
        if (emailMatch && emailMatch[1]) {
          userEmail = emailMatch[1];
          logger.info('[GET /api/orion/profile] Extracted email from profileText', { email: userEmail });
        }
      }

      // Ensure the profile object has an email property for frontend consumption
      const responseProfile = {
        ...profileData.profile,
        email: userEmail || profileData.profile.email || 'not-provided@example.com', // Ensure email is always present
      };

      logger.success('Successfully fetched user profile', {
        operation: 'GET /api/orion/profile',
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({
        success: true,
        profile: responseProfile,
        profileText: profileData.profileText,
        source: profileData.source,
      });
    }

    logger.error('Profile not found', {
      operation: 'GET /api/orion/profile',
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      {
        success: false,
        error: 'Profile not found',
        message: 'The user profile could not be found. Please check your Notion configuration or local files.',
      },
      { status: 404 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error fetching profile', {
      operation: 'GET /api/orion/profile',
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
