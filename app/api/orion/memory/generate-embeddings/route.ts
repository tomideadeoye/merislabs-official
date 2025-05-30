import { NextRequest, NextResponse } from "next/server";
import * as litellm from "litellm";
import { checkAuthorization } from "@/lib/orion_config";

/**
 * API route to generate embeddings for text using LiteLLM
 * This is a server-side operation to leverage API keys securely
 */
export async function POST(request: NextRequest) {
  try {
    // Validate authorization
    const authError = await checkAuthorization("user", request);
    if (authError) return authError;

    // Parse request body
    const body = await request.json();
    const { texts } = body;

    if (!texts || !Array.isArray(texts)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'texts' array in request body" },
        { status: 400 }
      );
    }

    // Get embedding model from environment or use default
    const embeddingModel = process.env.EMBEDDING_MODEL || "text-embedding-ada-002";
    
    // Generate embeddings for all texts in parallel
    const embeddings = await Promise.all(
      texts.map(async (text) => {
        try {
          const response = await litellm.embedding({
            model: embeddingModel,
            input: text
          });
          
          return response.data[0].embedding;
        } catch (error) {
          console.error(`Error generating embedding: ${error}`);
          throw error;
        }
      })
    );

    return NextResponse.json({
      success: true,
      embeddings,
      model: embeddingModel
    });
  } catch (error) {
    console.error("Embedding generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate embeddings" },
      { status: 500 }
    );
  }
}