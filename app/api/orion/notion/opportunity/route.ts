import { NextRequest, NextResponse } from 'next/server';
import { createOpportunityInNotion, OpportunityNotionPayload } from '@/lib/notion_next_service';
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

/**
 * API route for creating an opportunity in Notion
 */
export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse request body
    const body = await request.json() as OpportunityNotionPayload;

    // Validate required fields
    if (!body.title || !body.company) {
      return NextResponse.json({
        success: false,
        error: 'Title and company are required'
      }, { status: 400 });
    }

    // Create opportunity in Notion via Python API
    const result = await createOpportunityInNotion(body);

    return NextResponse.json({
      success: true,
      opportunity: result
    });
  } catch (error: any) {
    console.error('Error in POST /api/orion/notion/opportunity:', error);

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create opportunity in Notion'
    }, { status: 500 });
  }
}
