import { NextResponse } from 'next/server';
import { ORION_ACCESSIBLE_LOCAL_DIRECTORIES } from '@/lib/orion_config';

/**
 * API route to list configured accessible directories
 */
export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      directories: ORION_ACCESSIBLE_LOCAL_DIRECTORIES 
    });
  } catch (error: any) {
    console.error('Error in GET /api/orion/local-fs/list-configured-dirs:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}