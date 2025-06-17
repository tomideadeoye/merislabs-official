import { NextResponse } from 'next/server';
import { getCVComponentsFromNotion } from '@/lib/notion_service';
// import { auth } from '@/libauth';

/**
 * API route for fetching CV components from Notion
 */
export async function GET() {
  // TEMP: Disable authentication for local testing
  // const session = await auth();
  // if (!session || !session.user) {
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    // Fetch CV components from Notion via Python API
    const cvComponents = await getCVComponentsFromNotion();

    return NextResponse.json({
      success: true,
      components: cvComponents,
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/orion/notion/cv-components:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
