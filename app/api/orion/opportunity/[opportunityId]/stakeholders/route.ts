import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { opportunityId: string } }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { opportunityId } = params;
    
    // Get the opportunity to find the stakeholder contact IDs
    const getOpportunityStmt = db.prepare(`
      SELECT stakeholderContactIds FROM opportunities WHERE id = ?
    `);
    
    const opportunity = getOpportunityStmt.get(opportunityId);
    
    if (!opportunity || !opportunity.stakeholderContactIds) {
      return NextResponse.json({ 
        success: false, 
        error: 'No stakeholders found for this opportunity.' 
      }, { status: 404 });
    }
    
    // For now, we'll return mock data
    // In a real implementation, you would fetch the stakeholders from your memory store
    // using the stakeholderContactIds
    
    const mockStakeholders = [
      {
        id: 'stakeholder1',
        name: 'Sarah Johnson',
        role: 'Engineering Manager',
        company: 'CloudScale Technologies',
        linkedInUrl: 'https://linkedin.com/in/sarahjohnson',
        outreachStatus: 'pending'
      },
      {
        id: 'stakeholder2',
        name: 'Michael Chen',
        role: 'Senior Software Engineer',
        company: 'CloudScale Technologies',
        linkedInUrl: 'https://linkedin.com/in/michaelchen',
        outreachStatus: 'pending'
      },
      {
        id: 'stakeholder3',
        name: 'Priya Patel',
        role: 'Technical Recruiter',
        company: 'CloudScale Technologies',
        linkedInUrl: 'https://linkedin.com/in/priyapatel',
        outreachStatus: 'pending'
      }
    ];
    
    return NextResponse.json({ 
      success: true, 
      stakeholders: mockStakeholders,
      stakeholderIds: JSON.parse(opportunity.stakeholderContactIds)
    });
    
  } catch (error: any) {
    console.error('[OPPORTUNITY_STAKEHOLDERS_GET_API_ERROR]', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch stakeholders.', 
      details: error.message 
    }, { status: 500 });
  }
}