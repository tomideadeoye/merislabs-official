import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/database';
import type { Opportunity } from '@/types/opportunity';

interface RouteParams {
  params: {
    opportunityId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { opportunityId } = params;
    
    if (!opportunityId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Opportunity ID is required.' 
      }, { status: 400 });
    }
    
    const stmt = db.prepare("SELECT * FROM opportunities WHERE id = ?");
    const opportunityRaw = stmt.get(opportunityId) as any;
    
    if (!opportunityRaw) {
      return NextResponse.json({ 
        success: false, 
        error: 'Opportunity not found.' 
      }, { status: 404 });
    }
    
    // Deserialize JSON string fields
    const opportunity: Opportunity = {
      ...opportunityRaw,
      tags: opportunityRaw.tags ? JSON.parse(opportunityRaw.tags) : [],
      applicationMaterialIds: opportunityRaw.applicationMaterialIds ? JSON.parse(opportunityRaw.applicationMaterialIds) : [],
      stakeholderContactIds: opportunityRaw.stakeholderContactIds ? JSON.parse(opportunityRaw.stakeholderContactIds) : [],
      relatedHabiticaTaskIds: opportunityRaw.relatedHabiticaTaskIds ? JSON.parse(opportunityRaw.relatedHabiticaTaskIds) : [],
    };

    return NextResponse.json({ success: true, opportunity });
    
  } catch (error: any) {
    console.error('[OPP_TRACKER_API_GET_ERROR]', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch opportunity details.', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { opportunityId } = params;
    
    if (!opportunityId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Opportunity ID is required.' 
      }, { status: 400 });
    }
    
    // Check if opportunity exists
    const checkStmt = db.prepare("SELECT id FROM opportunities WHERE id = ?");
    const existingOpp = checkStmt.get(opportunityId);
    
    if (!existingOpp) {
      return NextResponse.json({ 
        success: false, 
        error: 'Opportunity not found.' 
      }, { status: 404 });
    }
    
    // Delete the opportunity
    const deleteStmt = db.prepare("DELETE FROM opportunities WHERE id = ?");
    deleteStmt.run(opportunityId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Opportunity deleted successfully.' 
    });
    
  } catch (error: any) {
    console.error('[OPP_TRACKER_API_DELETE_ERROR]', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete opportunity.', 
      details: error.message 
    }, { status: 500 });
  }
}