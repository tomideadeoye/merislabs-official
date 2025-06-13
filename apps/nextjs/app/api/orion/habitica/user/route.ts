import { NextRequest, NextResponse } from "next/server";
import { getUserData } from "@repo/shared/habitica_client";
import { cookies } from "next/headers";

/**
 * GET handler for Habitica user stats
 */
export async function GET(req: NextRequest) {
  try {
    // Defensive: always await cookies() and type as any
    console.warn(
      "[HabiticaUserAPI][GET] Awaiting cookies() as workaround for type mismatch."
    );
    const cookieStore: any = await cookies();
    const userId = cookieStore.get("HABITICA_USER_ID")?.value;
    const apiToken = cookieStore.get("HABITICA_API_TOKEN")?.value;
    console.info("[HabiticaUserAPI][GET] Read cookies", { userId, apiToken });

    if (!userId || !apiToken) {
      console.warn("[HabiticaUserAPI][GET] Missing credentials in cookies");
      return NextResponse.json(
        {
          success: false,
          error: "Habitica credentials not found",
        },
        { status: 401 }
      );
    }

    // Get user stats using the shared client
    const userStats = await getUserData();

    if (!userStats) {
      console.error("[HabiticaUserAPI][GET] Failed to fetch user stats");
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch Habitica user stats",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, userStats });
  } catch (error: any) {
    console.error("Error in GET /api/orion/habitica/user:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler to save Habitica credentials
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, apiToken } = body;
    console.info("[HabiticaUserAPI][POST] Received credentials", {
      userId,
      apiToken,
    });

    // Validate required fields
    if (!userId || !apiToken) {
      console.warn("[HabiticaUserAPI][POST] Missing userId or apiToken");
      return NextResponse.json(
        {
          success: false,
          error: "User ID and API Token are required",
        },
        { status: 400 }
      );
    }

    // Test the credentials by fetching user stats using the shared client
    const userStats = await getUserData();

    if (!userStats) {
      console.warn("[HabiticaUserAPI][POST] Invalid Habitica credentials");
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Habitica credentials",
        },
        { status: 401 }
      );
    }

    // Store credentials in cookies (secure in production)
    const response = NextResponse.json({
      success: true,
      message: "Habitica credentials saved successfully",
      userStats,
    });
    response.cookies.set("HABITICA_USER_ID", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    response.cookies.set("HABITICA_API_TOKEN", apiToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    console.info("[HabiticaUserAPI][POST] Set cookies for credentials", {
      userId,
      apiToken,
    });
    return response;
  } catch (error: any) {
    console.error("Error in POST /api/orion/habitica/user:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
