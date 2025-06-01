import { NextRequest, NextResponse } from 'next/server';
import { fetchCvComponentsFromNotion } from '@/lib/notion_next_service';
import { auth } from '@/auth';

/**
 * API route for fetching CV components from Notion
 */
export async function GET(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch CV components from Notion via Python API
    const components = await fetchCvComponentsFromNotion();
    
    return NextResponse.json({
      success: true,
      components
    });
  } catch (error: any) {
    console.error('Error in GET /api/orion/notion/cv-components:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch CV components from Notion'
    }, { status: 500 });
  }
}