import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/sharedauth";
import {
  OrionOpportunity,
  OpportunityUpdatePayload,
} from "@repo/shared";

// Mock database for demonstration purposes
const mockOpportunities: Record<string, OrionOpportunity> = {
  "1": {
    id: "1",
    title: "Senior Software Engineer",
    company: "CloudScale Technologies",
    companyOrInstitution: "CloudScale Technologies",
    type: "job",
    status: "evaluating",
    dateIdentified: "2023-05-15",
    nextActionDate: "2023-05-22",
    priority: "high",
    content:
      "Backend systems role focused on Go and Python microservices. Building scalable cloud infrastructure.",
    sourceURL: "https://cloudscale.tech/careers",
    tags: ["software", "backend", "cloud", "go", "python"],
    lastStatusUpdate: "2023-05-16T10:30:00Z",
  },
  "2": {
    id: "2",
    title: "Product Manager",
    company: "InnovateTech",
    companyOrInstitution: "InnovateTech",
    type: "job",
    status: "application_ready",
    dateIdentified: "2023-05-10",
    priority: "medium",
    content:
      "Leading product development for a SaaS platform. Focus on fintech solutions.",
    tags: ["product", "management", "fintech", "saas"],
    lastStatusUpdate: "2023-05-14T15:45:00Z",
  },
  "3": {
    id: "3",
    title: "MBA Program",
    company: "Stanford Graduate School of Business",
    companyOrInstitution: "Stanford Graduate School of Business",
    type: "education_program",
    status: "researching",
    dateIdentified: "2023-04-20",
    nextActionDate: "2023-06-01",
    priority: "high",
    content:
      "Full-time MBA program with focus on entrepreneurship and technology management.",
    sourceURL: "https://www.gsb.stanford.edu/programs/mba",
    tags: ["education", "mba", "business", "entrepreneurship"],
    lastStatusUpdate: "2023-05-05T09:15:00Z",
  },
  "4": {
    id: "4",
    title: "Open Source Collaboration",
    company: "TechForGood Foundation",
    companyOrInstitution: "TechForGood Foundation",
    type: "project_collaboration",
    status: "applied",
    dateIdentified: "2023-05-01",
    priority: "low",
    content:
      "Contributing to an open-source project focused on accessibility tools for education.",
    tags: ["open-source", "accessibility", "education", "javascript"],
    lastStatusUpdate: "2023-05-12T11:20:00Z",
  },
  "5": {
    id: "5",
    title: "Tech Lead",
    company: "FinanceFlow",
    companyOrInstitution: "FinanceFlow",
    type: "job",
    status: "interview_scheduled",
    dateIdentified: "2023-04-15",
    nextActionDate: "2023-05-25",
    priority: "high",
    content:
      "Leading a team of engineers building next-gen financial analytics tools.",
    sourceURL: "https://financeflow.io/careers",
    tags: ["leadership", "fintech", "analytics", "team-management"],
    lastStatusUpdate: "2023-05-18T14:10:00Z",
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = params;

    // In a real app, fetch from database
    const OrionOpportunity = mockOpportunities[id];

    if (!OrionOpportunity) {
      return NextResponse.json(
        {
          success: false,
          error: "OrionOpportunity not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      OrionOpportunity,
    });
  } catch (error: any) {
    console.error("[OPPORTUNITY_GET_API_ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch OrionOpportunity.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const body: OpportunityUpdatePayload = await request.json();

    // In a real app, update in database
    const OrionOpportunity = mockOpportunities[id];

    if (!OrionOpportunity) {
      return NextResponse.json(
        {
          success: false,
          error: "OrionOpportunity not found.",
        },
        { status: 404 }
      );
    }

    // Update fields
    const updatedOpportunity = {
      ...OrionOpportunity,
      ...body,
      companyOrInstitution:
        body.companyOrInstitution ?? body.company ?? OrionOpportunity.company ?? "",
      lastStatusUpdate: new Date().toISOString(),
    };

    // In a real app, save to database
    mockOpportunities[id] = updatedOpportunity;

    return NextResponse.json({
      success: true,
      OrionOpportunity: updatedOpportunity,
    });
  } catch (error: any) {
    console.error("[OPPORTUNITY_UPDATE_API_ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update OrionOpportunity.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = params;

    // In a real app, delete from database
    const OrionOpportunity = mockOpportunities[id];

    if (!OrionOpportunity) {
      return NextResponse.json(
        {
          success: false,
          error: "OrionOpportunity not found.",
        },
        { status: 404 }
      );
    }

    // In a real app, delete from database
    delete mockOpportunities[id];

    return NextResponse.json({
      success: true,
      message: "OrionOpportunity deleted successfully.",
    });
  } catch (error: any) {
    console.error("[OPPORTUNITY_DELETE_API_ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete OrionOpportunity.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
