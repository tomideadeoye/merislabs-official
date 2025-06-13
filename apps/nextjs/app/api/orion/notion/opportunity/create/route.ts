import { NextResponse } from "next/server";
import { createOpportunityInNotion } from "@repo/shared/notion_service";
import { OpportunityNotionPayloadSchema } from "@repo/shared/notion_next_service";

export async function POST(request: Request) {
  try {
    const opportunityData = await request.json();
    // Validate opportunityData against OpportunityNotionInput type if necessary
    const parseResult =
      OpportunityNotionPayloadSchema.safeParse(opportunityData);
    if (!parseResult.success) {
      console.error(
        "[POST /api/orion/notion/OrionOpportunity/create] Invalid OpportunityNotionPayload:",
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

    const newOpportunity = await createOpportunityInNotion(opportunityData);

    if (newOpportunity) {
      return NextResponse.json({ success: true, OrionOpportunity: newOpportunity });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to create OrionOpportunity in Notion" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in Create OrionOpportunity API route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
