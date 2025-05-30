import { QdrantClient } from "@qdrant/js-client-rest";
import { NextResponse } from "next/server";
import { checkAuthorization } from "@/lib/orion_config";
import type { Schemas } from "@qdrant/js-client-rest";

export async function POST(request: Request) {
  try {
    // Validate admin privileges
    const authError = await checkAuthorization("admin", request);
    if (authError) return authError;

    // Initialize Qdrant client
    const qdrant = new QdrantClient({
      host: process.env.QDRANT_HOST,
      port: Number(process.env.QDRANT_PORT),
    });

    // Create main memory collection configuration
    const memoryCollectionConfig: Schemas['CreateCollection'] = {
      vectors: {
        size: Number(process.env.VECTOR_SIZE),
        distance: "Cosine",
      },
      optimizers_config: {
        memmap_threshold: 20000,
      },
      replication_factor: 2,
    };

    // Create feedback memory collection configuration
    const feedbackMemoryCollectionConfig: Schemas['CreateCollection'] = {
      ...memoryCollectionConfig,
      vectors: {
        size: Number(process.env.VECTOR_SIZE),
        distance: "Cosine",
        on_disk: true,
      },
    };

    // Create collections in parallel
    const [memoryResult, feedbackResult] = await Promise.all([
      qdrant.createCollection("orion_memory", memoryCollectionConfig),
      qdrant.createCollection("orion_feedback_memory", feedbackMemoryCollectionConfig),
    ]);

    return NextResponse.json({
      success: true,
      message: "Memory system initialized",
      collections: {
        main: memoryResult,
        feedback: feedbackResult
      }
    });

  } catch (error) {
    console.error("Memory initialization error:", error);
    return NextResponse.json(
      { success: false, error: "Memory system initialization failed" },
      { status: 500 }
    );
  }
}
