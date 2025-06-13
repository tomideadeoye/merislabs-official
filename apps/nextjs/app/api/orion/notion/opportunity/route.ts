import { NextRequest, NextResponse } from "next/server";
import {
  createOpportunityInNotion,
  OpportunityNotionPayload,
  OpportunityNotionPayloadSchema,
} from "@repo/shared/notion_next_service";
import { auth } from "@repo/sharedauth";
import { fetchOpportunityByIdFromNotion } from "@repo/shared/notion_service";

/**
 * API route for creating an OrionOpportunity in Notion
 */
export async function POST(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Parse request body
    const body = (await request.json()) as OpportunityNotionPayload;

    // Validate required fields using zod
    const parseResult = OpportunityNotionPayloadSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(
        "[POST /api/orion/notion/OrionOpportunity] Invalid OpportunityNotionPayload:",
        parseResult.error.format()
      );
      return NextResponse.json(
        {
          success: false,
          error: "Invalid OpportunityNotionPayload",
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
  } catch (error: any) {
    console.error("Error in POST /api/orion/notion/OrionOpportunity:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create OrionOpportunity in Notion",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  // ... rest of your logic ...
}
