import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { OpportunityStatus } from '@/types/opportunity';

export async function POST(req: NextRequest) {
  try {
    const { opportunityId, status } = await req.json();
    
    if (!opportunityId || !status) {
      return NextResponse.json({ 
        success: false, 
        error: 'Opportunity ID and status are required' 
      }, { status: 400 });
    }
    
    // Validate status
    const validStatuses: OpportunityStatus[] = [
      'identified', 'researching', 'evaluating', 'evaluated_positive', 
      'evaluated_negative', 'application_drafting', 'application_ready', 
      'applied', 'outreach_planned', 'outreach_sent', 'follow_up_needed', 
      'follow_up_sent', 'interview_scheduled', 'interview_completed', 
      'offer_received', 'negotiating', 'accepted', 'rejected_by_them', 
      'declined_by_me', 'on_hold', 'archived'
    ];
    
    if (!validStatuses.includes(status as OpportunityStatus)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid status value' 
      }, { status: 400 });
    }
    
    // Update opportunity status
    const result = db.prepare(`
      UPDATE opportunities 
      SET status = ?, last_status_update = ? 
      WHERE id = ?
    `).run(status, new Date().toISOString(), opportunityId);
    
    if (result.changes === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Opportunity not found' 
      }, { status: 404 });
    }
    
    // Get the updated opportunity
    const opportunity = db.prepare(`
      SELECT * FROM opportunities WHERE id = ?
    `).get(opportunityId);
    
    // Add entry to status history
    db.prepare(`
      INSERT INTO opportunity_status_history (
        opportunity_id, status, timestamp
      ) VALUES (?, ?, ?)
    `).run(opportunityId, status, new Date().toISOString());
    
    return NextResponse.json({ 
      success: true, 
      message: 'Status updated successfully',
      opportunity
    });
  } catch (error: any) {
    console.error('Error in POST /api/orion/opportunity/update-status:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}