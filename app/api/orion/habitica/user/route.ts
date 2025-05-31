import { NextRequest, NextResponse } from 'next/server';
import { HabiticaApiClient } from '@/lib/habitica_client';
import { cookies } from 'next/headers';

/**
 * GET handler for Habitica user stats
 */
export async function GET(req: NextRequest) {
  try {
    // Get Habitica credentials from session
    const userId = cookies().get('HABITICA_USER_ID')?.value;
    const apiToken = cookies().get('HABITICA_API_TOKEN')?.value;
    
    if (!userId || !apiToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'Habitica credentials not found' 
      }, { status: 401 });
    }
    
    // Create Habitica client
    const habiticaClient = new HabiticaApiClient({ userId, apiToken });
    
    // Get user stats
    const userStats = await habiticaClient.getUserStats();
    
    if (!userStats) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch Habitica user stats' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, userStats });
  } catch (error: any) {
    console.error('Error in GET /api/orion/habitica/user:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}

/**
 * POST handler to save Habitica credentials
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, apiToken } = body;
    
    // Validate required fields
    if (!userId || !apiToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID and API Token are required' 
      }, { status: 400 });
    }
    
    // Create Habitica client to validate credentials
    const habiticaClient = new HabiticaApiClient({ userId, apiToken });
    
    // Test the credentials by fetching user stats
    const userStats = await habiticaClient.getUserStats();
    
    if (!userStats) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid Habitica credentials' 
      }, { status: 401 });
    }
    
    // Store credentials in cookies (secure in production)
    cookies().set('HABITICA_USER_ID', userId, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    
    cookies().set('HABITICA_API_TOKEN', apiToken, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Habitica credentials saved successfully',
      userStats
    });
  } catch (error: any) {
    console.error('Error in POST /api/orion/habitica/user:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}