import { NextRequest, NextResponse } from 'next/server';
import { PYTHON_API_URL } from '@/lib/orion_config';

/**
 * API route for tailoring a CV summary based on JD analysis
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { component_id, jd_analysis, web_research_context } = body;
    
    if (!component_id || !jd_analysis) {
      return NextResponse.json({ 
        success: false, 
        error: 'Component ID and JD analysis are required' 
      }, { status: 400 });
    }
    
    // Forward the request to the Python API
    const response = await fetch(`${PYTHON_API_URL}/api/llm/cv/tailor-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        component_id,
        jd_analysis,
        web_research_context
      })
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in CV summary tailoring:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}