import { NextRequest, NextResponse } from 'next/server';
import {
  createOpportunityInNotion,
  OpportunityNotionPayload,
  OpportunityNotionPayloadSchema,
} from '@/lib/notion_next_service';
import { auth } from '@/auth';

/**
 * API route for creating an OrionOpportunity in Notion
 */
export async function POST(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse request body
    const body = (await request.json()) as OpportunityNotionPayload;

    // Validate required fields using zod
    const parseResult = OpportunityNotionPayloadSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(
        '[POST /api/orion/notion/OrionOpportunity] Invalid OpportunityNotionPayload:',
        parseResult.error.format()
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid OpportunityNotionPayload',
          details: parseResult.error.format(),
        },
        { status: 400 }
      );
    }

    // Create OrionOpportunity in Notion via Python API
    const result = await createOpportunityInNotion(body);

    return NextResponse.json({
      success: true,
      OrionOpportunity: result,
    });
  } catch (error: unknown) {
    console.error('Error in POST /api/orion/notion/OrionOpportunity:', error);
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

export async function GET() {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  // ... rest of your logic ...
}
