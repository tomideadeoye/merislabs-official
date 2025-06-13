/**
 * GOAL: API route for fetching and updating a Notion-based OrionOpportunity.
 * - Ensures all returned OrionOpportunity objects include both company and companyOrInstitution.
 * - Adds context-rich, traceable logging for every operation, parameter, and result.
 * - Related files: lib/notion_service.ts, lib/notion_next_service.ts, types/OrionOpportunity.d.ts
 */
import { NextResponse } from "next/server";
import { updateNotionOpportunity } from "@repo/shared/notion_service";
import { fetchOpportunityByIdFromNotion } from "@repo/shared/notion_service";
import { OpportunityNotionPayloadSchema } from "@repo/shared/notion_next_service";

export async function PATCH(
  request: Request,
  { params }: { params: { opportunityId: string } }
) {
  const { opportunityId } = params;
  console.log(
    "[PATCH /api/orion/notion/OrionOpportunity/[opportunityId]] Received opportunityId:",
    opportunityId
  );

  if (!opportunityId) {
    return NextResponse.json(
      { success: false, error: "OrionOpportunity ID is required" },
      { status: 400 }
    );
  }

  const updateData = await request.json();
  // Validate updateData against Partial<OpportunityNotionInput> if necessary
  const parseResult =
    OpportunityNotionPayloadSchema.partial().safeParse(updateData);
  if (!parseResult.success) {
    console.error(
      "[PATCH /api/orion/notion/OrionOpportunity/[opportunityId]] Invalid OpportunityNotionPayload:",
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

  const updatedOpportunity = await updateNotionOpportunity(
    opportunityId,
    updateData
  );

  console.log(
    "[PATCH /api/orion/notion/OrionOpportunity/[opportunityId]] Result of updateNotionOpportunity:",
    updatedOpportunity
  );

  if (updatedOpportunity) {
    const successResponse = NextResponse.json({
      success: true,
      OrionOpportunity: updatedOpportunity,
    });
    console.log(
      "[PATCH /api/orion/notion/OrionOpportunity/[opportunityId]] Sending success response:",
      successResponse
    );
    return successResponse;
  } else {
    const errorResponse = NextResponse.json(
      { success: false, error: "Failed to update OrionOpportunity in Notion" },
      { status: 500 }
    );
    console.log(
      "[PATCH /api/orion/notion/OrionOpportunity/[opportunityId]] Sending error response:",
      errorResponse
    );
    return errorResponse;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { opportunityId: string } }
) {
  const { opportunityId } = params;
  console.log(
    `[GET /api/orion/notion/OrionOpportunity/${opportunityId}] Received request for OrionOpportunity ID:`,
    opportunityId
  );

  if (!opportunityId) {
    console.error(
      `[GET /api/orion/notion/OrionOpportunity/${opportunityId}] OrionOpportunity ID is missing.`
    );
    return NextResponse.json(
      { success: false, error: "OrionOpportunity ID is required." },
      { status: 400 }
    );
  }

  try {
    console.log(
      `[GET /api/orion/notion/OrionOpportunity/${opportunityId}] Calling fetchOpportunityByIdFromNotion...`
    );
    const fetchResult = await fetchOpportunityByIdFromNotion(opportunityId);
    console.log(
      `[GET /api/orion/notion/OrionOpportunity/${opportunityId}] Raw Notion API response:`,
      JSON.stringify(fetchResult, null, 2)
    );

    if (fetchResult.success) {
      if (!fetchResult.OrionOpportunity) {
        console.error(
          `[GET /api/orion/notion/OrionOpportunity/${opportunityId}] Success but OrionOpportunity is undefined!`
        );
        return NextResponse.json(
          { success: false, error: "OrionOpportunity not found." },
          { status: 404 }
        );
      }
      // Normalize company/companyOrInstitution
      const company =
        (fetchResult.OrionOpportunity.company ??
          (fetchResult.OrionOpportunity as any).companyOrInstitution ??
          "") ||
        "";
      const companyOrInstitution =
        ((fetchResult.OrionOpportunity as any).companyOrInstitution ??
          fetchResult.OrionOpportunity.company ??
          "") ||
        "";
      const normalizedOpportunity = {
        ...fetchResult.OrionOpportunity,
        company,
        companyOrInstitution,
      };
      console.info(
        `[GET /api/orion/notion/OrionOpportunity/${opportunityId}] Normalized company fields:`,
        { company, companyOrInstitution }
      );
      console.log(
        `[GET /api/orion/notion/OrionOpportunity/${opportunityId}] Successfully fetched OrionOpportunity.`,
        normalizedOpportunity.id
      );
      return NextResponse.json({
        success: true,
        OrionOpportunity: normalizedOpportunity,
      });
    } else {
      console.warn(
        `[GET /api/orion/notion/OrionOpportunity/${opportunityId}] fetchOpportunityByIdFromNotion returned success: false. Error:`,
        fetchResult.error
      );
      const errorStr =
        typeof fetchResult.error === "string" ? fetchResult.error : "";
      const status = errorStr.includes("not found") ? 404 : 500;
      return NextResponse.json(
        { success: false, error: fetchResult.error },
        { status }
      );
    }
  } catch (error: any) {
    console.error(
      `[GET /api/orion/notion/OrionOpportunity/${opportunityId}] Uncaught error during fetch:`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}

// Add other handlers (DELETE) later if needed
