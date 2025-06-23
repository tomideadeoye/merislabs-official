/**
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides an API endpoint (`/api/sequential-thinking`) for orchestrating sequential thought processes within Orion.
 *   - Integrates with a global MCP (Multi-Component Project) sequential thinking tool, primarily for development environments.
 *   - Facilitates a structured approach to problem-solving by breaking down complex tasks into a series of logical thoughts.
 *   - Designed to be a flexible interface for various AI-driven reasoning workflows.
 *
 * FILEPATH: `app/api/sequential-thinking.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `global.mcp_sequentialThinking`: Relies on a globally declared MCP tool for its core functionality, suggesting an external or dynamically loaded dependency.
 *   - `@/lib/logger.ts`: Used for comprehensive, context-rich logging of the sequential thinking process.
 *   - `@/lib/utils/errorHandler.ts`: Integrates `handleApiError` for standardized error handling and responses.
 *   - UI Components (e.g., in `app/(orion_admin)/admin/agentic-workflow/page.tsx` - hypothetical): Frontend components would call this API to initiate and manage a sequential thinking workflow.
 *   - Potentially other internal Orion AI services that require multi-step reasoning.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that the `global.mcp_sequentialThinking` function (if available) handles the actual sequential thinking logic.
 *   - Expects `thought`, `nextThoughtNeeded`, `thoughtNumber`, and `totalThoughts` in the request body to guide the sequential process.
 *   - The `logContext` is used to provide detailed debugging information throughout the request lifecycle.
 *   - Authentication/authorization for this endpoint should be handled at a higher level (e.g., middleware or in consuming routes) if not implicitly handled by the global MCP tool.
 *
 * NOTES:
 *   - This API route acts as a bridge between the Orion application and an external or internal sequential thinking engine.
 *   - The current implementation serves as a placeholder or a development-time interface for the MCP tool.
 *   - Extensive logging is crucial for understanding the flow and debugging complex AI reasoning processes.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Robust MCP Integration**: Formalize the integration with the MCP tool, potentially by defining a clear interface or dedicated service for interacting with it, rather than relying on a global variable.
 *   - **Asynchronous Execution & Status Tracking**: For long-running sequential thought processes, implement an asynchronous execution model (e.g., a job queue) and provide status tracking to the frontend (e.g., via WebSockets).
 *   - **Input Validation (Zod)**: Implement Zod schema validation for the request body to ensure all input parameters are valid and prevent malformed requests.
 *   - **Dynamic Workflow Configuration**: Allow the sequential thinking workflow to be dynamically configured (e.g., number of steps, types of thoughts, fallback mechanisms) via API parameters or a configuration service.
 *   - **Output Parsing & Structuring**: Enhance the handling of the `result` from the `mcp_sequentialThinking` tool to parse and structure its output into a more usable format for the frontend.
 *   - **Error Handling Granularity**: Introduce more specific error handling for different failure modes of the MCP tool.
 *   - **Progress Reporting**: Implement mechanisms to report intermediate thought steps and progress back to the client.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - If multiple MCP tool integrations emerge, consider creating a generic `McpIntegrationService` that handles common patterns like global variable access, logging, and error handling.
 *   - The logging and error handling patterns are consistent with other API routes, representing a good consolidation of these concerns.
 */
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { handleApiError } from '@/lib/utils/errorHandler';

declare global {
  var mcp_sequentialThinking: ((params: Record<string, unknown>) => Promise<unknown>) | undefined;
}

export async function POST(req: NextRequest) {
  const logContext = { route: '/api/sequential-thinking', timestamp: new Date().toISOString() };
  logger.info('[SEQUENTIAL_THINKING][START] Received request for sequential thinking.', logContext);

  try {
    const body = await req.json();
    const { thought, nextThoughtNeeded = true, thoughtNumber = 1, totalThoughts = 5 } = body;

    logger.debug('[SEQUENTIAL_THINKING][REQUEST_BODY]', {
      ...logContext,
      thought: thought ? thought.substring(0, 100) : 'N/A',
      nextThoughtNeeded,
      thoughtNumber,
      totalThoughts,
    });

    // Try to use a global MCP client if available (for dev environments)
    if (global.mcp_sequentialThinking) {
      logger.info('[SEQUENTIAL_THINKING] Using global MCP sequential thinking tool', logContext);
      const result = await global.mcp_sequentialThinking({
        thought,
        nextThoughtNeeded,
        thoughtNumber,
        totalThoughts,
      });
      logger.info('[SEQUENTIAL_THINKING] Result from MCP tool:', { ...logContext, result });
      return NextResponse.json(result);
    }
    // If you have a Node.js MCP client, require and use it here
    // Otherwise, return an error
    logger.error('[SEQUENTIAL_THINKING] MCP tool not available on server', logContext);
    return NextResponse.json(
      { success: false, error: 'Sequential Thinking MCP tool is not available on the server.' },
      { status: 500 }
    );
  } catch (error: unknown) {
    const handledError = handleApiError(error, logContext);
    return NextResponse.json(
      {
        success: false,
        error: handledError.message,
        details: handledError.details,
      },
      { status: handledError.statusCode || 500 }
    );
  }
}
