import { NextRequest, NextResponse } from "next/server";
import { ORION_MEMORY_COLLECTION_NAME } from "@repo/shared/orion_config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query,
      collectionName = ORION_MEMORY_COLLECTION_NAME,
      limit = 5,
      filter = {},
      minScore = 0.7,
    } = body;

    if (!query || typeof query !== "string" || query.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Query cannot be empty." },
        { status: 400 }
      );
    }

    console.log(
      `[MEMORY_SEARCH_API] Searching for: "${query}" in collection: ${collectionName}`
    );
    console.log(`[MEMORY_SEARCH_API] Filter:`, JSON.stringify(filter));

    // 1. Generate embedding for the query
    console.log(`[MEMORY_SEARCH_API] Requesting embedding for query...`);
    const embeddingResponse = await fetch(
      `${request.nextUrl.origin}/api/orion/memory/generate-embeddings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: request.headers.get("Authorization") || "",
        },
        body: JSON.stringify({
          texts: [query],
        }),
      }
    );

    const embeddingData = await embeddingResponse.json();

    if (
      !embeddingData.success ||
      !embeddingData.embeddings ||
      embeddingData.embeddings.length === 0
    ) {
      console.error(
        "[MEMORY_SEARCH_API] Failed to generate embeddings:",
        embeddingData.error
      );
      throw new Error(embeddingData.error || "Failed to generate embeddings.");
    }

    const queryVector = embeddingData.embeddings[0];
    console.log(`[MEMORY_SEARCH_API] Embeddings generated successfully.`);

    // 2. Search Qdrant with the query vector
    const searchResponse = await fetch(
      `${request.nextUrl.origin}/api/orion/memory/vector-search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: request.headers.get("Authorization") || "",
        },
        body: JSON.stringify({
          vector: queryVector,
          collectionName,
          limit,
          filter,
          withPayload: true,
          withVector: false,
          scoreThreshold: minScore,
        }),
      }
    );

    const searchData = await searchResponse.json();

    if (!searchData.success) {
      console.error(
        "[MEMORY_SEARCH_API] Failed to search memory:",
        searchData.error
      );
      throw new Error(searchData.error || "Failed to search memory.");
    }

    console.log(
      `[MEMORY_SEARCH_API] Search successful. Found ${searchData.results.length} results.`
    );

    // 3. Return the search results
    return NextResponse.json({
      success: true,
      results: searchData.results,
      query,
    });
  } catch (error: any) {
    console.error("[MEMORY_SEARCH_API_ERROR]", error.message, error.stack);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search memory.",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
