import { NextResponse } from "next/server";
import { getCVComponentsFromNotion } from "@repo/shared/notion_service";

/**
 * @fileoverview Fetches CV components from Notion.
 * @description This API route serves as the endpoint for retrieving all items from the Notion
 * database that are marked with the 'Component Type' of 'CV'. It relies on the
 * centralized `getCVComponentsFromNotion` function in the Notion service layer,
 * promoting code reuse and maintainability.
 */
export async function GET() {
  console.log("[GET /api/orion/cv/components] Received request.");
  try {
    const components = await getCVComponentsFromNotion();
    console.log(
      `[GET /api/orion/cv/components] Successfully fetched ${components.length} components.`
    );
    return NextResponse.json({ success: true, components });
  } catch (error: any) {
    console.error(
      "[GET /api/orion/cv/components] Error fetching components:",
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
