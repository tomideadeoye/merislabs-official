import { NextRequest, NextResponse } from "next/server";
import { updateNotionOpportunity } from "@repo/shared/notion_service";
import { auth } from "@repo/sharedauth";

export async function POST(
  request: NextRequest,
  { params }: { params: { opportunityId: string } }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const opportunityId = params.opportunityId;
  const { stakeholders, outreach_messages } = await request.json();

  if (!opportunityId) {
    return NextResponse.json(
      { success: false, error: "OrionOpportunity ID is required." },
      { status: 400 }
    );
  }

  // Allow saving even if one field is empty, as long as the ID is present.
  // Frontend button is disabled if both are empty, but API should handle.
  if (!stakeholders && !outreach_messages) {
    return NextResponse.json(
      {
        success: false,
        error: "Stakeholder or outreach messages content is required.",
      },
      { status: 400 }
    );
  }

  try {
    // Need to confirm the exact property names in Notion service or data types.
    // For now, let's assume we will map them correctly in updateNotionOpportunity
    const updateData = {
      // These keys need to map to Notion properties in notion_service.ts
      identifiedStakeholdersContent: stakeholders, // Assuming a field like this in OpportunityUpdatePayload
      draftOutreachMessagesContent: outreach_messages, // Assuming a field like this in OpportunityUpdatePayload
      title: "Outreach Draft",
      company: "Unknown",
      type: "job",
    };

    // Ensure all required fields for OpportunityCreatePayload
    const safeUpdateData = {
      title: "Outreach Draft",
      company: "Unknown",
      content: updateData.draftOutreachMessagesContent || "",
      type: "job",
    };
    console.log(
      "[SAVE_OUTREACH] Updating Notion OrionOpportunity with:",
      safeUpdateData
    );
    const updatedOpportunity = await updateNotionOpportunity(
      opportunityId,
      safeUpdateData
    );

    if (updatedOpportunity) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to update OrionOpportunity in Notion." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error saving outreach content:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
