import { NextRequest, NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { 
  QDRANT_HOST, 
  QDRANT_PORT, 
  ORION_MEMORY_COLLECTION_NAME 
} from "@/lib/orion_config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      points, 
      collectionName = ORION_MEMORY_COLLECTION_NAME
    } = body;

    if (!points || !Array.isArray(points) || points.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid 'points' parameter. Expected a non-empty array of points." },
        { status: 400 }
      );
    }

    console.log(`Upserting ${points.length} points to collection '${collectionName}'`);
    
    // Initialize the Qdrant client
    const client = new QdrantClient({
      url: `http://${QDRANT_HOST}:${QDRANT_PORT}`
    });

    // Format points for Qdrant
    const qdrantPoints = points.map(p => ({
      id: p.id,
      vector: p.vector,
      payload: p.payload
    }));

    // Perform the upsert operation
    const result = await client.upsert(collectionName, {
      wait: true,
      points: qdrantPoints
    });

    console.log(`Successfully upserted ${points.length} points to collection '${collectionName}'.`);
    return NextResponse.json({ 
      success: true, 
      message: `Successfully upserted ${points.length} points.`,
      result
    });

  } catch (error: any) {
    console.error("Upsert error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to upsert points to memory.", 
        details: error.message || String(error)
      },
      { status: 500 }
    );
  }
}