import { NextRequest, NextResponse } from 'next/server';
import { getValueProposition, saveValueProposition } from '@/lib/narrative_service';
import { ValueProposition } from '@/types/narrative-clarity';

/**
 * GET handler for value proposition
 */
export async function GET() {
  try {
    const valueProposition = await getValueProposition();
    
    if (!valueProposition) {
      return NextResponse.json({ 
        success: false, 
        error: 'Value proposition not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, valueProposition });
  } catch (error: any) {
    console.error('Error in GET /api/orion/narrative/value-proposition:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}

/**
 * POST handler to create or update value proposition
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<ValueProposition>;
    
    // Validate required fields
    if (!body.valueStatement) {
      return NextResponse.json({ 
        success: false, 
        error: 'Value statement is required' 
      }, { status: 400 });
    }
    
    const valueProposition = await saveValueProposition({
      coreStrengths: body.coreStrengths || [],
      uniqueSkills: body.uniqueSkills || [],
      passions: body.passions || [],
      vision: body.vision || '',
      targetAudience: body.targetAudience || '',
      valueStatement: body.valueStatement
    });
    
    return NextResponse.json({ success: true, valueProposition });
  } catch (error: any) {
    console.error('Error in POST /api/orion/narrative/value-proposition:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}