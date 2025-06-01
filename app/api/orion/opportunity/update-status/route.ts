import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { opportunityId, status } = body;

    if (!opportunityId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: opportunityId and status" },
        { status: 400 }
      );
    }

    // Update the opportunity status
    const response = await fetch(`${request.nextUrl.origin}/api/orion/opportunity/${opportunityId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '' // Forward cookies for authentication
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update opportunity status: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      opportunity: data.opportunity
    });
  } catch (error: any) {
    console.error("[UPDATE_STATUS_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update opportunity status",
      },
      { status: 500 }
    );
  }
}