import { NextRequest, NextResponse } from 'next/server';
import { HabiticaApiClient } from '@/lib/habitica_client';

/**
 * API route for fetching Habitica user stats
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, apiToken } = await req.json();
    
    if (!userId || !apiToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'Habitica User ID and API Token are required' 
      }, { status: 400 });
    }
    
    // Create Habitica client with provided credentials
    const habiticaClient = new HabiticaApiClient({ userId, apiToken });
    
    // Fetch user stats
    const stats = await habiticaClient.getUserStats();
    
    return NextResponse.json({ 
      success: true, 
      data: stats 
    });
  } catch (error: any) {
    console.error('Error in POST /api/orion/habitica/stats:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}