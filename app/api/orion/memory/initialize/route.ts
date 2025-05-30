import { QdrantClient } from "@qdrant/js-client-rest";
import { NextResponse } from "next/server";
import { checkAuthorization } from "@/lib/orion_config";
import { 
  ORION_MEMORY_COLLECTION_NAME, 
  FEEDBACK_COLLECTION_NAME,
  QDRANT_HOST,
  QDRANT_PORT,
  VECTOR_SIZE
} from "@/lib/orion_config";
import type { Schemas } from "@qdrant/js-client-rest";

export async function POST(request: Request) {
  try {
    // Validate admin privileges
    const authError = await checkAuthorization("admin", request);
    if (authError) return authError;

    // Initialize Qdrant client
    const qdrant = new QdrantClient({
      host: QDRANT_HOST,
      port: QDRANT_PORT,
    });

    // Create main memory collection configuration
    const memoryCollectionConfig: Schemas['CreateCollection'] = {
      vectors: {
        size: VECTOR_SIZE,
        distance: "Cosine",
      },
      optimizers_config: {
        memmap_threshold: 20000,
      },
      replication_factor: 1,
    };

    // Create feedback memory collection configuration
    const feedbackMemoryCollectionConfig: Schemas['CreateCollection'] = {
      ...memoryCollectionConfig,
      vectors: {
        size: VECTOR_SIZE,
        distance: "Cosine",
        on_disk: true,
      },
    };

    // Check if collections already exist
    let memoryExists = false;
    let feedbackExists = false;
    
    try {
      await qdrant.getCollection(ORION_MEMORY_COLLECTION_NAME);
      memoryExists = true;
    } catch (e) {
      console.log(`Collection ${ORION_MEMORY_COLLECTION_NAME} does not exist, will create it.`);
    }
    
    try {
      await qdrant.getCollection(FEEDBACK_COLLECTION_NAME);
      feedbackExists = true;
    } catch (e) {
      console.log(`Collection ${FEEDBACK_COLLECTION_NAME} does not exist, will create it.`);
    }

    // Create collections if they don't exist
    const results: {
      main: any;
      feedback: any;
    } = {
      main: "not created",
      feedback: "not created"
    };
    
    if (!memoryExists) {
      results.main = await qdrant.createCollection(
        ORION_MEMORY_COLLECTION_NAME, 
        memoryCollectionConfig
      );
    }
    
    if (!feedbackExists) {
      results.feedback = await qdrant.createCollection(
        FEEDBACK_COLLECTION_NAME, 
        feedbackMemoryCollectionConfig
      );
    }

    return NextResponse.json({
      success: true,
      message: "Memory system initialized",
      collections: {
        main: memoryExists ? "already exists" : results.main,
        feedback: feedbackExists ? "already exists" : results.feedback
      }
    });

  } catch (error) {
    console.error("Memory initialization error:", error);
    return NextResponse.json(
      { success: false, error: "Memory system initialization failed", details: String(error) },
      { status: 500 }
    );
  }
}