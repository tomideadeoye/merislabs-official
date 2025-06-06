import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy endpoint for searching memory
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[Search-Proxy] Incoming request body:', JSON.stringify(body));

    // Forward the request to the Python API
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:5002';
    const pythonUrl = `${pythonApiUrl}/api/memory/search`;
    console.log('[Search-Proxy] Forwarding to Python backend:', pythonUrl);

    const response = await fetch(pythonUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error('[Search-Proxy] Failed to parse Python backend response:', text);
      throw parseErr;
    }
    console.log('[Search-Proxy] Python backend response:', JSON.stringify(data));
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Search-Proxy] Error in memory search proxy:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}
