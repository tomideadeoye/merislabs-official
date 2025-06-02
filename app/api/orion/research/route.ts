import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { PYTHON_API_URL } from '@/lib/orion_config'; // Import Python API URL

/**
 * API route to proxy web research requests to the Python backend.
 */
export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { query, type = 'web', count } = await request.json(); // Accept query, type (web/local), and count

    if (!query) {
      return NextResponse.json({ success: false, error: 'Search query is required.' }, { status: 400 });
    }

    // Construct the URL for the Python backend's search endpoint
    // Assuming the Python backend has an endpoint like /search/web or /search/local
    const pythonSearchUrl = `${PYTHON_API_URL}/search/${type}`;

    console.log(`[RESEARCH_PROXY] Proxying search request to Python backend: ${pythonSearchUrl}`);

    // Forward the request to the Python backend
    const pythonResponse = await fetch(pythonSearchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary headers for the Python backend, e.g., API key
        // 'X-API-Key': process.env.PYTHON_BACKEND_API_KEY,
      },
      body: JSON.stringify({ query, count }),
    });

    if (!pythonResponse.ok) {
      console.error('[RESEARCH_PROXY] Python backend search failed:', pythonResponse.status, pythonResponse.statusText);
      try {
        const errorBody = await pythonResponse.json();
        return NextResponse.json({ success: false, error: errorBody.detail || `Python backend error: ${pythonResponse.statusText}` }, { status: pythonResponse.status });
      } catch (jsonError) {
         return NextResponse.json({ success: false, error: `Python backend error: ${pythonResponse.statusText}` }, { status: pythonResponse.status });
      }
    }

    const pythonData = await pythonResponse.json();

    // Return the response from the Python backend
    return NextResponse.json({ success: true, results: pythonData });

  } catch (error: any) {
    console.error('[RESEARCH_PROXY_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'An unexpected error occurred during web research proxy.' }, { status: 500 });
  }
}
