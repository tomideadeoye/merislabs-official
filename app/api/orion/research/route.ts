import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { PYTHON_API_URL } from '@/lib/orion_config'; // Import Python API URL

/**
 * API route to proxy web research and scraping requests to the Python backend.
 */
export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { query, type = 'web', count, url } = await request.json(); // Accept query, type, count, and url

    let pythonBackendUrl: string;
    let requestBody: any = {};

    if (type === 'scrape') {
      if (!url) {
        return NextResponse.json({ success: false, error: 'URL is required for scrape type.' }, { status: 400 });
      }
      // Assuming the Python backend has a /scrape endpoint that accepts a URL
      pythonBackendUrl = `${PYTHON_API_URL}/scrape`;
      requestBody = { url };
      console.log(`[RESEARCH_PROXY] Proxying scraping request to Python backend: ${pythonBackendUrl}`);

    } else { // Default to web/local search
      if (!query) {
        return NextResponse.json({ success: false, error: 'Search query is required for web/local search.' }, { status: 400 });
      }
      // Construct the URL for the Python backend's search endpoint
      pythonBackendUrl = `${PYTHON_API_URL}/search/${type}`;
      requestBody = { query, count };
      console.log(`[RESEARCH_PROXY] Proxying search request to Python backend: ${pythonBackendUrl}`);
    }

    // Forward the request to the Python backend
    const pythonResponse = await fetch(pythonBackendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary headers for the Python backend, e.g., API key
        // 'X-API-Key': process.env.PYTHON_BACKEND_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!pythonResponse.ok) {
      console.error('[RESEARCH_PROXY] Python backend failed:', pythonResponse.status, pythonResponse.statusText);
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
    return NextResponse.json({ success: false, error: error.message || 'An unexpected error occurred during web research/scraping proxy.' }, { status: 500 });
  }
}
