import { NextRequest, NextResponse } from 'next/server';
import { fetchCVComponentsFromNotion } from '@/lib/notion_service';
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

/**
 * API route for fetching CV components from Notion
 */
export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch CV components from Notion via Python API
    const cvComponents = await fetchCVComponentsFromNotion();

    return NextResponse.json({
      success: true,
      components: cvComponents
    });
  } catch (error: any) {
    console.error('Error in GET /api/orion/notion/cv-components:', error);

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch CV components'
    }, { status: 500 });
  }
}
