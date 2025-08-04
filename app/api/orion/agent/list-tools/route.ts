/**
 * @fileoverview API route for listing available tools for Orion's agentic workflow.
 * @description This endpoint provides the client-side AgenticWorkflowComponent with a dynamic list
 *   of tools that the Orion agent can utilize. It fetches the tool definitions from `app/lib/orion_tools.ts`,
 *   extracts relevant metadata (name, description, parameters), and returns them in a structured format.
 *   This allows the frontend to dynamically display and enable user selection of tools, influencing agent behavior.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To expose a `/api/orion/agent/list-tools` GET endpoint.
 *   - To retrieve and format the `AVAILABLE_ORION_TOOLS` defined in `app/lib/orion_tools.ts`.
 *   - To provide essential metadata for each tool (name, description, parameters) to the frontend.
 *   - To ensure only authenticated users can access the list of tools (though currently bypassed for development).
 *   - To provide robust logging for API requests and responses.
 *
 * FILEPATH: `app/api/orion/agent/list-tools/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/orion_tools.ts`: This file is the source of truth for all available tool definitions,
 *     which this API directly imports and processes.
 *   - `app/components/orion/admin/AgenticWorkflowComponent.tsx`: This client-side component will consume this API
 *     to display and manage tool selection for the agent.
 *   - `@/lib/logger.ts`: Used for comprehensive, context-rich logging of API operations.
 *   - `@/auth`: (Currently bypassed) Would handle user authentication and session validation.
 *   - `@/lib/types/index.ts`: Defines `LLMTool` and other relevant types for strict type consistency.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `AVAILABLE_ORION_TOOLS` is a valid array of tool objects with `function` and `description` properties.
 *   - Assumes that tool parameters are correctly formatted within the `function` object (e.g., `parameters.properties`).
 *   - For development, authentication is temporarily bypassed; proper session handling should be re-enabled in production.
 *
 * NOTES:
 *   - This API acts as a bridge, securely exposing server-side tool definitions to the client without exposing implementation details.
 *   - The transformation extracts only necessary information, keeping the payload lean for the frontend.
 *
 * OPPORTUNITIES FOR IMPROVEMENT & COMPREHENSIVE NEXT STEPS:
 *   - **Dynamic Tool Discovery**: Instead of a static import, consider a more dynamic mechanism for tool discovery
 *     if tools become pluggable or loaded from external sources.
 *   - **Tool Grouping/Categorization**: Add metadata to tools (e.g., `category`, `tags`) to allow for better
 *     organization and filtering on the frontend, especially as the number of tools grows.
 *   - **Parameter Schema for UI**: For complex tools, send a simplified JSON schema for parameters to the frontend
 *     so that UIs can dynamically generate input fields for tool arguments.
 *   - **Authorization per Tool**: Implement granular authorization checks for each tool, ensuring specific users
 *     or roles can only see/use certain tools.
 */

import { NextResponse } from 'next/server';
// import { auth } from '@/auth'; // Temporarily removed auth as requested by user
import logger from '@/lib/logger';
import { TOOL_MANIFEST, Tool } from '@/lib/orion_tools'; // Changed import and added Tool type
import { LLMTool } from '@/lib/types'; // Import LLMTool type if available

export async function GET() {
  const logContext = {
    route: '/api/orion/agent/list-tools',
    timestamp: new Date().toISOString(),
    operation: 'GET',
  };
  logger.info('[AGENT_TOOLS_API][GET][START] Received request to list available agent tools.', logContext);

  // Temporarily bypass authentication. Re-enable in production.
  // const session = await auth();
  // if (!session || !session.user || !session.user.id) {
  //   logger.warn('[AGENT_TOOLS_API][GET][AUTH_FAIL] Unauthorized access attempt.', logContext);
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    // Map the internal tool definitions to a client-friendly format
    const tools: LLMTool[] = Object.values(TOOL_MANIFEST).map((tool: Tool) => ({
      function: {
        name: tool.name,
        description: tool.description ?? '',
        // Ensure parameters is always an object
        parameters: tool.parameters ?? {},
      },
      description: tool.description ?? '', // Keeping this as it was in the original LLMTool structure
      type: 'function', // Tools are typically of type 'function' for LLM consumption
    }));

    logger.success('[AGENT_TOOLS_API][GET][SUCCESS] Successfully fetched available agent tools.', {
      ...logContext,
      toolCount: tools.length,
    });
    return NextResponse.json({ success: true, tools });
  } catch (error: unknown) {
    logger.error('[AGENT_TOOLS_API][GET][ERROR] Failed to fetch agent tools.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to fetch agent tools.' }, { status: 500 });
  }
}
