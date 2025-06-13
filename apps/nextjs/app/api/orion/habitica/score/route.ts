import { NextRequest, NextResponse } from "next/server";
import { scoreTask } from "@repo/shared/habitica_client";
import { auth } from "@repo/sharedauth";

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
    const { taskId, direction, userId, apiToken } = body;

    if (!taskId || !direction) {
      return NextResponse.json(
        { success: false, error: "Task ID and direction are required." },
        { status: 400 }
      );
    }

    if (direction !== "up" && direction !== "down") {
      return NextResponse.json(
        { success: false, error: 'Direction must be "up" or "down".' },
        { status: 400 }
      );
    }

    // Score task using the shared client
    // Note: This uses the client configured with environment variables, not the provided userId/apiToken
    const result = await scoreTask(taskId, direction);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("[HABITICA_SCORE_API_ERROR]", error.message);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to score Habitica task.",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
