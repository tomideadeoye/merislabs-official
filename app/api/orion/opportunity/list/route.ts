import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { Opportunity } from '@/types/opportunity';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const tag = searchParams.get('tag');
    const priority = searchParams.get('priority');
    const sortBy = searchParams.get('sortBy') || 'lastStatusUpdate';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // This is a mock implementation - in a real app, this would fetch from a database
    // Mock data for demonstration purposes
    const mockOpportunities: Opportunity[] = [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'CloudScale Technologies',
        type: 'job',
        status: 'evaluating',
        dateIdentified: '2023-05-15',
        nextActionDate: '2023-05-22',
        priority: 'high',
        content: 'Backend systems role focused on Go and Python microservices. Building scalable cloud infrastructure.',
        sourceURL: 'https://cloudscale.tech/careers',
        tags: ['software', 'backend', 'cloud', 'go', 'python'],
        lastStatusUpdate: '2023-05-16T10:30:00Z'
      },
      {
        id: '2',
        title: 'Product Manager',
        company: 'InnovateTech',
        type: 'job',
        status: 'application_ready',
        dateIdentified: '2023-05-10',
        priority: 'medium',
        content: 'Leading product development for a SaaS platform. Focus on fintech solutions.',
        tags: ['product', 'management', 'fintech', 'saas'],
        lastStatusUpdate: '2023-05-14T15:45:00Z'
      },
      {
        id: '3',
        title: 'MBA Program',
        company: 'Stanford Graduate School of Business',
        type: 'education',
        status: 'researching',
        dateIdentified: '2023-04-20',
        nextActionDate: '2023-06-01',
        priority: 'high',
        content: 'Full-time MBA program with focus on entrepreneurship and technology management.',
        sourceURL: 'https://www.gsb.stanford.edu/programs/mba',
        tags: ['education', 'mba', 'business', 'entrepreneurship'],
        lastStatusUpdate: '2023-05-05T09:15:00Z'
      },
      {
        id: '4',
        title: 'Open Source Collaboration',
        company: 'TechForGood Foundation',
        type: 'project_collaboration',
        status: 'applied',
        dateIdentified: '2023-05-01',
        priority: 'low',
        content: 'Contributing to an open-source project focused on accessibility tools for education.',
        tags: ['open-source', 'accessibility', 'education', 'javascript'],
        lastStatusUpdate: '2023-05-12T11:20:00Z'
      },
      {
        id: '5',
        title: 'Tech Lead',
        company: 'FinanceFlow',
        type: 'job',
        status: 'interview_scheduled',
        dateIdentified: '2023-04-15',
        nextActionDate: '2023-05-25',
        priority: 'high',
        content: 'Leading a team of engineers building next-gen financial analytics tools.',
        sourceURL: 'https://financeflow.io/careers',
        tags: ['leadership', 'fintech', 'analytics', 'team-management'],
        lastStatusUpdate: '2023-05-18T14:10:00Z'
      }
    ];

    // Apply filters
    let filteredOpportunities = [...mockOpportunities];

    if (status) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.status === status);
    }

    if (type) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.type === type);
    }

    if (tag) {
      filteredOpportunities = filteredOpportunities.filter(opp =>
        opp.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))
      );
    }

    if (priority) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.priority === priority);
    }

    // Apply sorting
    filteredOpportunities.sort((a, b) => {
      const aValue = a[sortBy as keyof Opportunity];
      const bValue = b[sortBy as keyof Opportunity];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return NextResponse.json({
      success: true,
      opportunities: filteredOpportunities
    });

  } catch (error: any) {
    console.error('[OPPORTUNITY_LIST_API_ERROR]', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch opportunities.',
      details: error.message
    }, { status: 500 });
  }
}
