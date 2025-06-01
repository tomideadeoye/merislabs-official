import { NextRequest, NextResponse } from 'next/server';
import { PYTHON_API_URL } from '@/lib/orion_config';

/**
 * API route for suggesting CV components based on JD analysis
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jd_analysis, job_title, company_name } = body;
    
    if (!jd_analysis) {
      return NextResponse.json({ 
        success: false, 
        error: 'JD analysis is required' 
      }, { status: 400 });
    }
    
    // Forward the request to the Python API
    const response = await fetch(`${PYTHON_API_URL}/api/llm/cv/suggest-components`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jd_analysis,
        job_title: job_title || '',
        company_name: company_name || ''
      })
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in CV component suggestion:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}