import { NextRequest, NextResponse } from "next/server";
import { checkAuthorization } from "@/lib/orion_config";
import { processTextForIndexing } from "@/lib/orion_memory";
import { ORION_MEMORY_COLLECTION_NAME } from "@/lib/orion_config";

/**
 * API route to add text to the memory system
 * This handles the full process of chunking, embedding, and storing
 */
export async function POST(request: NextRequest) {
  try {
    // Validate authorization
    const authError = await checkAuthorization("user", request);
    if (authError) return authError;

    // Parse request body
    const body = await request.json();
    const { text, sourceId, tags, collectionName } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'text' in request body" },
        { status: 400 }
      );
    }

    if (!sourceId || typeof sourceId !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'sourceId' in request body" },
        { status: 400 }
      );
    }

    // Process and index the text
    const result = await processTextForIndexing(
      text,
      sourceId,
      tags || [],
      collectionName || ORION_MEMORY_COLLECTION_NAME
    );

    return NextResponse.json({
      success: true,
      message: `Successfully added ${result.count} chunks to memory`,
      count: result.count
    });
  } catch (error) {
    console.error("Memory addition error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add text to memory", details: String(error) },
      { status: 500 }
    );
  }
}