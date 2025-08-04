import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy endpoint for searching memory (Python backend)
 * Updated to match Python API: /api/v1/memory/search with correct payload keys.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[Search-Proxy] Incoming request body:', JSON.stringify(body));

    // Map Orion/Next.js keys to Python backend keys
    const pythonPayload = {
      query_text: body.query,
      num_results: body.limit || 5,
      // Add more mappings if needed
    };

    // Forward the request to the Python API (corrected endpoint)
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000';
    const pythonUrl = `${pythonApiUrl}/api/v1/memory/search`;
    console.log('[Search-Proxy] Forwarding to Python backend:', pythonUrl);
    console.log('[Search-Proxy] Outgoing payload:', JSON.stringify(pythonPayload));

    const response = await fetch(pythonUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pythonPayload),
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
  } catch (error: unknown) {
    console.error('[Search-Proxy] Error in memory search proxy:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
