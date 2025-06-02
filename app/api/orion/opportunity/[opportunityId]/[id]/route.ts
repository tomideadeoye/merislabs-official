import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Opportunity, OpportunityUpdatePayload } from '@/types/opportunity';

// Mock database for demonstration purposes
const mockOpportunities: Record<string, Opportunity> = {
  '1': {
    id: '1',
    title: 'Senior Software Engineer',
    companyOrInstitution: 'CloudScale Technologies',
    type: 'job',
    status: 'evaluating',
    dateIdentified: '2023-05-15',
    nextActionDate: '2023-05-22',
    priority: 'high',
    descriptionSummary: 'Backend systems role focused on Go and Python microservices. Building scalable cloud infrastructure.',
    description: 'Backend systems role focused on Go and Python microservices. Building scalable cloud infrastructure.',
    sourceURL: 'https://cloudscale.tech/careers',
    tags: ['software', 'backend', 'cloud', 'go', 'python'],
    lastStatusUpdate: '2023-05-16T10:30:00Z'
  },
  '2': {
    id: '2',
    title: 'Product Manager',
    companyOrInstitution: 'InnovateTech',
    type: 'job',
    status: 'application_ready',
    dateIdentified: '2023-05-10',
    priority: 'medium',
    descriptionSummary: 'Leading product development for a SaaS platform. Focus on fintech solutions.',
    description: 'Leading product development for a SaaS platform. Focus on fintech solutions.',
    tags: ['product', 'management', 'fintech', 'saas'],
    lastStatusUpdate: '2023-05-14T15:45:00Z'
  },
  '3': {
    id: '3',
    title: 'MBA Program',
    companyOrInstitution: 'Stanford Graduate School of Business',
    type: 'education_program',
    status: 'researching',
    dateIdentified: '2023-04-20',
    nextActionDate: '2023-06-01',
    priority: 'high',
    descriptionSummary: 'Full-time MBA program with focus on entrepreneurship and technology management.',
    description: 'Full-time MBA program with focus on entrepreneurship and technology management.',
    sourceURL: 'https://www.gsb.stanford.edu/programs/mba',
    tags: ['education', 'mba', 'business', 'entrepreneurship'],
    lastStatusUpdate: '2023-05-05T09:15:00Z'
  },
  '4': {
    id: '4',
    title: 'Open Source Collaboration',
    companyOrInstitution: 'TechForGood Foundation',
    type: 'project_collaboration',
    status: 'applied',
    dateIdentified: '2023-05-01',
    priority: 'low',
    descriptionSummary: 'Contributing to an open-source project focused on accessibility tools for education.',
    description: 'Contributing to an open-source project focused on accessibility tools for education.',
    tags: ['open-source', 'accessibility', 'education', 'javascript'],
    lastStatusUpdate: '2023-05-12T11:20:00Z'
  },
  '5': {
    id: '5',
    title: 'Tech Lead',
    companyOrInstitution: 'FinanceFlow',
    type: 'job',
    status: 'interview_scheduled',
    dateIdentified: '2023-04-15',
    nextActionDate: '2023-05-25',
    priority: 'high',
    descriptionSummary: 'Leading a team of engineers building next-gen financial analytics tools.',
    description: 'Leading a team of engineers building next-gen financial analytics tools.',
    sourceURL: 'https://financeflow.io/careers',
    tags: ['leadership', 'fintech', 'analytics', 'team-management'],
    lastStatusUpdate: '2023-05-18T14:10:00Z'
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;

    // In a real app, fetch from database
    const opportunity = mockOpportunities[id];

    if (!opportunity) {
      return NextResponse.json({
        success: false,
        error: 'Opportunity not found.'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      opportunity
    });

  } catch (error: any) {
    console.error('[OPPORTUNITY_GET_API_ERROR]', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch opportunity.',
      details: error.message
    }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const body: OpportunityUpdatePayload = await request.json();

    // In a real app, update in database
    const opportunity = mockOpportunities[id];

    if (!opportunity) {
      return NextResponse.json({
        success: false,
        error: 'Opportunity not found.'
      }, { status: 404 });
    }

    // Update fields
    const updatedOpportunity = {
      ...opportunity,
      ...body,
      lastStatusUpdate: new Date().toISOString()
    };

    // In a real app, save to database
    mockOpportunities[id] = updatedOpportunity;

    return NextResponse.json({
      success: true,
      opportunity: updatedOpportunity
    });

  } catch (error: any) {
    console.error('[OPPORTUNITY_UPDATE_API_ERROR]', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to update opportunity.',
      details: error.message
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;

    // In a real app, delete from database
    const opportunity = mockOpportunities[id];

    if (!opportunity) {
      return NextResponse.json({
        success: false,
        error: 'Opportunity not found.'
      }, { status: 404 });
    }

    // In a real app, delete from database
    delete mockOpportunities[id];

    return NextResponse.json({
      success: true,
      message: 'Opportunity deleted successfully.'
    });

  } catch (error: any) {
    console.error('[OPPORTUNITY_DELETE_API_ERROR]', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to delete opportunity.',
      details: error.message
    }, { status: 500 });
  }
}
