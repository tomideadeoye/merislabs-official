import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { OpportunityCreatePayload } from '@/types/opportunity';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: OpportunityCreatePayload = await request.json();
    
    // Basic validation
    if (!body.title || !body.companyOrInstitution) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title and Company/Institution are required.' 
      }, { status: 400 });
    }
    
    // This is a mock implementation - in a real app, this would save to a database
    // For now, we'll just return success with a mock ID
    const mockId = `opp_${Date.now()}`;
    const currentDate = new Date().toISOString();
    
    return NextResponse.json({ 
      success: true, 
      opportunity: {
        id: mockId,
        title: body.title,
        companyOrInstitution: body.companyOrInstitution,
        type: body.type,
        status: body.status,
        dateIdentified: currentDate,
        priority: body.priority,
        descriptionSummary: body.descriptionSummary,
        sourceURL: body.sourceURL,
        tags: body.tags,
        notes: body.notes,
        lastStatusUpdate: currentDate
      }
    });
    
  } catch (error: any) {
    console.error('[OPPORTUNITY_CREATE_API_ERROR]', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create opportunity.', 
      details: error.message 
    }, { status: 500 });
  }
}