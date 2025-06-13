import { NextRequest, NextResponse } from "next/server";
import { getUserData } from "@repo/shared/habitica_client";

/**
 * API route for fetching Habitica user stats
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, apiToken } = await req.json();

    if (!userId || !apiToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Habitica User ID and API Token are required",
        },
        { status: 400 }
      );
    }

    // Fetch user data (including stats) using the shared client
    // Note: This uses the client configured with environment variables, not the provided userId/apiToken
    const stats = await getUserData();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error("Error in POST /api/orion/habitica/stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
