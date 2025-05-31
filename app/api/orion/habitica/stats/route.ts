import { NextRequest, NextResponse } from 'next/server';
import { getUserStats } from '@/lib/habitica_client';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  try {
    // Get user credentials from query parameters
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get('userId') || undefined;
    const apiToken = searchParams.get('apiToken') || undefined;

    // Fetch user stats from Habitica
    const stats = await getUserStats(userId, apiToken);

    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    console.error('[HABITICA_STATS_API_ERROR]', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Habitica stats.', details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
