import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/sharedauth";

export async function POST(
  request: NextRequest,
  { params }: { params: { opportunityId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const opportunityId = params.opportunityId;
    const { cv } = await request.json();

    if (!cv) {
      return NextResponse.json(
        { success: false, error: "CV content is required" },
        { status: 400 }
      );
    }

    // Here you would typically store the CV in your database
    // For now, we'll just return success

    // Example database operation:
    // await db.OrionOpportunity.update({
    //   where: { id: opportunityId },
    //   data: { tailoredCV: cv }
    // });

    return NextResponse.json({
      success: true,
      message: "CV saved successfully",
    });
  } catch (error: any) {
    console.error("Error saving CV:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save CV" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { opportunityId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const opportunityId = params.opportunityId;

    // Here you would typically fetch the CV from your database
    // For now, we'll just return a placeholder

    // Example database operation:
    // const OrionOpportunity = await db.OrionOpportunity.findUnique({
    //   where: { id: opportunityId },
    //   select: { tailoredCV: true }
    // });

    // if (!OrionOpportunity || !OrionOpportunity.tailoredCV) {
    //   return NextResponse.json(
    //     { success: false, error: 'No CV found for this OrionOpportunity' },
    //     { status: 404 }
    //   );
    // }

    return NextResponse.json({
      success: true,
      cv: "Placeholder CV content", // Replace with actual CV from database
    });
  } catch (error: any) {
    console.error("Error fetching CV:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch CV" },
      { status: 500 }
    );
  }
}
