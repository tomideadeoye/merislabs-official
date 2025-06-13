import { NextRequest, NextResponse } from "next/server";
import { getCVComponentsFromNotion } from "@repo/shared/notion_service";
// import { auth } from '@repo/sharedauth';

/**
 * API route for fetching CV components from Notion
 */
export async function GET(request: NextRequest) {
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
  } catch (error: any) {
    console.error("Error in GET /api/orion/notion/cv-components:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch CV components",
      },
      { status: 500 }
    );
  }
}
