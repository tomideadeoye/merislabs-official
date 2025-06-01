import { NextRequest, NextResponse } from 'next/server';
import { PYTHON_API_URL } from '@/lib/orion_config';

/**
 * API route for assembling a CV from selected components
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { selected_component_ids, template_name, header_info, tailored_content_map } = body;
    
    if (!selected_component_ids || !Array.isArray(selected_component_ids) || selected_component_ids.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Selected component IDs are required' 
      }, { status: 400 });
    }
    
    if (!template_name) {
      return NextResponse.json({ 
        success: false, 
        error: 'Template name is required' 
      }, { status: 400 });
    }
    
    // Forward the request to the Python API
    const response = await fetch(`${PYTHON_API_URL}/api/llm/cv/assemble`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        selected_component_ids,
        template_name,
        header_info: header_info || '',
        tailored_content_map: tailored_content_map || {}
      })
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in CV assembly:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}