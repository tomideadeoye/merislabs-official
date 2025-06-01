import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy endpoint for upserting memory
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Forward the request to the Python API
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:5002';
    const response = await fetch(`${pythonApiUrl}/api/memory/upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in memory upsert proxy:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}