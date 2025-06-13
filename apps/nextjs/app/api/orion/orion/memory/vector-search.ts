import { NextApiRequest, NextApiResponse } from "next";
import { QdrantClient } from "@qdrant/js-client-rest";
import { ORION_MEMORY_COLLECTION_NAME } from "@repo/shared/orion_config";

// Initialize Qdrant client
const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL || "http://localhost:6333",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const {
      vector,
      collectionName = ORION_MEMORY_COLLECTION_NAME,
      limit = 5,
      filter = {},
      withPayload = true,
      withVector = false,
      scoreThreshold = 0.7,
    } = req.body;

    if (!vector || !Array.isArray(vector)) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Vector is required and must be an array.",
        });
    }

    console.log(
      `[VECTOR_SEARCH_API] Searching in collection: ${collectionName}`
    );
    console.log(`[VECTOR_SEARCH_API] Filter:`, JSON.stringify(filter));

    // Perform the search
    const searchResults = await qdrantClient.search(collectionName, {
      vector,
      limit,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      with_payload: withPayload,
      with_vector: withVector,
      score_threshold: scoreThreshold,
    });

    console.log(
      `[VECTOR_SEARCH_API] Search successful. Found ${searchResults.length} results.`
    );

    return res.status(200).json({
      success: true,
      results: searchResults,
      count: searchResults.length,
    });
  } catch (error: any) {
    console.error("[VECTOR_SEARCH_API_ERROR]", error.message, error.stack);
    return res
      .status(500)
      .json({
        success: false,
        error: "Failed to search vectors.",
        details: error.message || "Unknown error",
      });
  }
}
