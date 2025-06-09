import { NextRequest, NextResponse } from 'next/server';
import { 
  getCareerMilestones, 
  saveCareerMilestone, 
  updateCareerMilestone, 
  deleteCareerMilestone 
} from '@shared/lib/narrative_service';
import { CareerMilestone } from '@shared/types/narrative-clarity';

/**
 * GET handler for career milestones
 */
export async function GET() {
  try {
    const milestones = await getCareerMilestones();
    return NextResponse.json({ success: true, milestones });
  } catch (error: any) {
    console.error('Error in GET /api/orion/narrative/milestones:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}

/**
 * POST handler to create a new career milestone
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Omit<CareerMilestone, 'id'>;
    
    // Validate required fields
    if (!body.title || !body.description || !body.achievements || body.achievements.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title, description, and at least one achievement are required' 
      }, { status: 400 });
    }
    
    const milestone = await saveCareerMilestone(body);
    return NextResponse.json({ success: true, milestone });
  } catch (error: any) {
    console.error('Error in POST /api/orion/narrative/milestones:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}

/**
 * PUT handler to update an existing career milestone
 */
export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Milestone ID is required' 
      }, { status: 400 });
    }
    
    const body = await req.json() as Partial<CareerMilestone>;
    const updatedMilestone = await updateCareerMilestone(id, body);
    
    if (!updatedMilestone) {
      return NextResponse.json({ 
        success: false, 
        error: 'Milestone not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, milestone: updatedMilestone });
  } catch (error: any) {
    console.error('Error in PUT /api/orion/narrative/milestones:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}

/**
 * DELETE handler to remove a career milestone
 */
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Milestone ID is required' 
      }, { status: 400 });
    }
    
    const success = await deleteCareerMilestone(id);
    
    if (!success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Milestone not found or could not be deleted' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/orion/narrative/milestones:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}