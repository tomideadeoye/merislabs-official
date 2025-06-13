import { NextRequest, NextResponse } from "next/server";
// import { auth } from '@repo/sharedauth';
import { fetchUserProfile } from "@repo/shared/profile_service";
import { logger } from "@repo/shared/logger";

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
    logger.info("Fetching user profile from API route", {
      operation: "GET /api/orion/profile",
      timestamp: new Date().toISOString(),
    });

    const profileData = await fetchUserProfile();
    if (profileData) {
      logger.success("Successfully fetched user profile", {
        operation: "GET /api/orion/profile",
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(profileData);
    }

    logger.error("Profile not found", {
      operation: "GET /api/orion/profile",
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      {
        error: "Profile not found",
        message:
          "The user profile could not be found. Please check your Notion configuration or local files.",
      },
      { status: 404 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error("Error fetching profile", {
      operation: "GET /api/orion/profile",
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
