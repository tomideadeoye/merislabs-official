import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/sharedauth";
import { ORION_MEMORY_COLLECTION_NAME } from "@repo/shared/orion_config";
import axios from "axios";

/**
 * API route to delete memory points from Qdrant
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { ids, collectionName = ORION_MEMORY_COLLECTION_NAME } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: ids" },
        { status: 400 }
      );
    }

    // Get Qdrant host and port from environment variables or use defaults
    const qdrantHost = process.env.QDRANT_HOST || "localhost";
    const qdrantPort = process.env.QDRANT_PORT || "6333";
    const qdrantUrl = `http://${qdrantHost}:${qdrantPort}`;

    // Delete points from Qdrant
    const deleteResponse = await axios.post(
      `${qdrantUrl}/collections/${collectionName}/points/delete`,
      {
        points: ids,
      }
    );

    if (deleteResponse.status !== 200) {
      throw new Error(`Failed to delete points: ${deleteResponse.statusText}`);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${ids.length} memory points`,
    });
  } catch (error: any) {
    console.error("[MEMORY_DELETE_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete memory points",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
