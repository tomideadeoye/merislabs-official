import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/sharedauth";
import { PYTHON_API_URL } from "@repo/shared/orion_config"; // Import Python API URL
import { logger } from "@repo/shared/logger";

/**
 * API route to proxy web research and scraping requests to the Python backend.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    logger.warn("[RESEARCH_PROXY][AUTH] Unauthorized request");
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { query, type = "web", count, url } = await request.json();

    let pythonBackendUrl: string;
    let requestBody: any = {};

    if (type === "scrape") {
      if (!url) {
        logger.warn("[RESEARCH_PROXY] URL is required for scrape type.", {
          type,
          url,
        });
        return NextResponse.json(
          { success: false, error: "URL is required for scrape type." },
          { status: 400 }
        );
      }
      pythonBackendUrl = `${PYTHON_API_URL}/scrape`;
      requestBody = { url };
      logger.info(
        "[RESEARCH_PROXY] Proxying scraping request to Python backend",
        { pythonBackendUrl, url }
      );
    } else {
      if (!query) {
        logger.warn(
          "[RESEARCH_PROXY] Search query is required for web/local search.",
          { type, query }
        );
        return NextResponse.json(
          {
            success: false,
            error: "Search query is required for web/local search.",
          },
          { status: 400 }
        );
      }
      pythonBackendUrl = `${PYTHON_API_URL}/search/${type}`;
      requestBody = { query, count };
      logger.info(
        "[RESEARCH_PROXY] Proxying search request to Python backend",
        { pythonBackendUrl, query, count }
      );
    }

    let pythonResponse;
    try {
      pythonResponse = await fetch(pythonBackendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
    } catch (fetchError: any) {
      let errorMsg = "Unknown error";
      if (
        fetchError?.code === "ECONNREFUSED" ||
        fetchError?.message?.includes("ECONNREFUSED")
      ) {
        errorMsg =
          "Python backend is not running or not reachable (ECONNREFUSED)";
      } else if (fetchError?.message?.includes("fetch failed")) {
        errorMsg = "Network error: Unable to reach Python backend";
      } else if (fetchError instanceof Error) {
        errorMsg = fetchError.message;
      }
      logger.error(
        "[RESEARCH_PROXY_ERROR] Failed to fetch from Python backend",
        { pythonBackendUrl, error: errorMsg, raw: fetchError }
      );
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 502 }
      );
    }

    if (!pythonResponse.ok) {
      logger.error("[RESEARCH_PROXY] Python backend failed", {
        status: pythonResponse.status,
        statusText: pythonResponse.statusText,
      });
      try {
        const errorBody = await pythonResponse.json();
        return NextResponse.json(
          {
            success: false,
            error:
              errorBody.detail ||
              `Python backend error: ${pythonResponse.statusText}`,
          },
          { status: pythonResponse.status }
        );
      } catch (jsonError) {
        return NextResponse.json(
          {
            success: false,
            error: `Python backend error: ${pythonResponse.statusText}`,
          },
          { status: pythonResponse.status }
        );
      }
    }

    const pythonData = await pythonResponse.json();
    logger.success("[RESEARCH_PROXY] Python backend response received", {
      pythonBackendUrl,
    });
    return NextResponse.json({ success: true, results: pythonData });
  } catch (error: any) {
    logger.error("[RESEARCH_PROXY_ERROR] Unexpected error in research proxy", {
      error: error?.message,
      raw: error,
    });
    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "An unexpected error occurred during web research/scraping proxy.",
      },
      { status: 500 }
    );
  }
}
