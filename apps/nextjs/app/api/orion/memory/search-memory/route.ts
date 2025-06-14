import { NextRequest, NextResponse } from "next/server";
import { searchMemory } from "@repo/shared/orion_memory";
import { ORION_MEMORY_COLLECTION_NAME } from "@repo/shared/orion_config";
import type { QdrantFilter } from "@repo/shared";

/**
 * API route to search the memory system
 * Performs semantic search using embeddings
 */
export async function POST(request: NextRequest) {
  try {
    // Authorization check removed as checkAuthorization is not available

    // Parse request body
    const body = await request.json();
    const { query, limit = 5, filter, collectionName } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'query' in request body" },
        { status: 400 }
      );
    }

    // Validate filter if provided
    let parsedFilter: QdrantFilter | undefined = undefined;
    if (filter) {
      try {
        parsedFilter = filter as QdrantFilter;
      } catch (e) {
        return NextResponse.json(
          { success: false, error: "Invalid filter format" },
          { status: 400 }
        );
      }
    }

    // Search memory
    const results = await searchMemory({
      query,
      limit,
      filter: parsedFilter,
      collectionName: collectionName || ORION_MEMORY_COLLECTION_NAME,
    });

    return NextResponse.json({
      success: true,
      results,
      count: results.length,
    });
  } catch (error) {
    console.error("Memory search error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search memory",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
