import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '@/lib/habitica_client';

// GOAL OF FILE|FEATURES|FUNCTIONS:
// FILEPATH:
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunties to consolidate
// TODOS:
// SUGGESTIONS:

/**
 * API route for fetching Habitica user stats
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, apiToken } = await req.json();

    if (!userId || !apiToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Habitica User ID and API Token are required',
        },
        { status: 400 }
      );
    }

    // Fetch user data (including stats) using the shared client
    // Note: This uses the client configured with environment variables, not the provided userId/apiToken
    const stats = await getUserData();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: unknown) {
    console.error('Error in POST /api/orion/habitica/stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
