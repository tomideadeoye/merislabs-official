import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '@/lib/habitica_client';
import { cookies } from 'next/headers';

// GOAL OF FILE|FEATURES|FUNCTIONS:
// This file provides API endpoints for managing Habitica user credentials and fetching user data.
// The GET endpoint retrieves user stats, while the POST endpoint saves user ID and API token to secure cookies after validation.
// FILEPATH: app/api/orion/habitica/user/route.ts
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// - '@/lib/habitica_client': Provides functions to interact with the Habitica API (getUserData).
// - 'next/headers': Used for accessing and setting cookies securely.
// - HabiticaCredentialsForm.tsx (UI component): Interacts with these API endpoints to allow users to set their credentials.
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// - Credentials stored in httpOnly, secure, sameSite=strict cookies for security.
// NOTES: This API acts as a secure proxy to the Habitica API, preventing direct client-side exposure of API tokens.
// TODOS:
// SUGGESTIONS:

/**
 * GET handler for Habitica user stats
 */
export async function GET() {
  try {
    const cookieStore = cookies(); // Await cookies() directly, remove 'any' type assertion
    const userId = cookieStore.get('HABITICA_USER_ID')?.value;
    const apiToken = cookieStore.get('HABITICA_API_TOKEN')?.value;
    console.info('[HabiticaUserAPI][GET] Read cookies', { userId, apiToken });

    if (!userId || !apiToken) {
      console.warn('[HabiticaUserAPI][GET] Missing credentials in cookies');
      return NextResponse.json(
        {
          success: false,
          error: 'Habitica credentials not found',
          message: 'Habitica credentials not found. Please set them via the settings.',
        },
        { status: 401 }
      );
    }

    // Get user stats using the shared client
    const userStats = await getUserData();

    if (!userStats) {
      console.error('[HabiticaUserAPI][GET] Failed to fetch user stats');
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch Habitica user stats',
          message: 'Could not retrieve user stats from Habitica. Please check your credentials.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, userStats });
  } catch (error: unknown) {
    console.error('Error in GET /api/orion/habitica/user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        message: `Failed to retrieve Habitica user data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler to save Habitica credentials
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, apiToken } = body;
    console.info('[HabiticaUserAPI][POST] Received credentials', {
      userId,
      apiToken,
    });

    // Validate required fields
    if (!userId || !apiToken) {
      console.warn('[HabiticaUserAPI][POST] Missing userId or apiToken');
      return NextResponse.json(
        {
          success: false,
          error: 'User ID and API Token are required',
          message: 'User ID and API Token cannot be empty.',
        },
        { status: 400 }
      );
    }

    // Test the credentials by fetching user stats using the shared client
    const userStats = await getUserData();

    if (!userStats) {
      console.warn('[HabiticaUserAPI][POST] Invalid Habitica credentials');
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Habitica credentials',
          message: 'The provided Habitica User ID or API Token is invalid. Please check and try again.',
        },
        { status: 401 }
      );
    }

    // Store credentials in cookies (secure in production)
    const response = NextResponse.json({
      success: true,
      message: 'Habitica credentials saved successfully',
      userStats,
    });
    response.cookies.set('HABITICA_USER_ID', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    response.cookies.set('HABITICA_API_TOKEN', apiToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    console.info('[HabiticaUserAPI][POST] Set cookies for credentials', {
      userId,
      apiToken,
    });
    return response;
  } catch (error: unknown) {
    console.error('Error in POST /api/orion/habitica/user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        message: `Failed to save Habitica credentials: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
