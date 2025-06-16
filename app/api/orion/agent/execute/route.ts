import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateLLMResponse, ORION_TOOLS } from '@/app/shared';
import type { CombinedLLMResponse } from '@/app/shared/types/orion';

// Define the structure of a tool call received from the LLM
interface LLMToolCall {
  id?: string; // Optional ID provided by the LLM
  function: {
    name: string;
    arguments: string; // Arguments are a JSON string from the LLM
  };
  type: 'function';
}

// Type guard for LLM function call structure
function isLLMFunctionCall(func: unknown): func is { name: string; arguments: string } {
  return (
    typeof func === 'object' &&
    func !== null &&
    'name' in func &&
    typeof (func as { name: string }).name === 'string' &&
    'arguments' in func &&
    typeof (func as { arguments: string }).arguments === 'string'
  );
}

// Helper to validate and parse tool calls from LLM response
function parseAndValidateToolCalls(responseContent: string): LLMToolCall[] {
  try {
    const parsedResponse: unknown = JSON.parse(responseContent);
    const toolCalls: LLMToolCall[] = [];

    if (typeof parsedResponse === 'object' && parsedResponse !== null) {
      if ('tool_calls' in parsedResponse && Array.isArray(parsedResponse.tool_calls)) {
        for (const tc of parsedResponse.tool_calls) {
          // Check if tc is an object and not null
          if (!(typeof tc === 'object' && tc !== null)) {
            continue; // Skip invalid tool call
          }

          // Check if 'function' property exists and is an object
          if (
            !(
              'function' in tc &&
              typeof (tc as { function: unknown }).function === 'object' &&
              (tc as { function: unknown }).function !== null
            )
          ) {
            continue; // Skip invalid tool call
          }

          // Now, safely cast and check the 'function' details using the type guard
          const func = (tc as { function: unknown }).function;
          if (!isLLMFunctionCall(func)) {
            continue; // Skip invalid tool call
          }

          // Check if 'type' property exists and is 'function'
          if (!('type' in tc && (tc as { type: string }).type === 'function')) {
            continue; // Skip invalid tool call
          }

          toolCalls.push({
            id: (tc as { id?: string }).id, // Cast to allow accessing optional 'id'
            function: {
              name: func.name,
              arguments: func.arguments,
            },
            type: 'function',
          });
        }
      } else if (
        'function_call' in parsedResponse &&
        typeof parsedResponse.function_call === 'object' &&
        parsedResponse.function_call !== null
      ) {
        const fc: unknown = parsedResponse.function_call;
        if (isLLMFunctionCall(fc)) {
          toolCalls.push({
            id: (fc as { id?: string }).id, // May not exist for older function_call, now correctly optional
            function: {
              name: fc.name,
              arguments: fc.arguments,
            },
            type: 'function',
          });
        }
      }
    }
    return toolCalls;
  } catch (error: unknown) {
    console.error('[AGENT_EXECUTE] Error parsing LLM response for tool calls:', error);
    return [];
  }
}

// Helper to execute tool calls by calling internal API endpoints
async function executeToolCall(toolCall: LLMToolCall, req: NextRequest): Promise<unknown> {
  const toolName = toolCall.function.name;
  const toolArgs: Record<string, unknown> = JSON.parse(toolCall.function.arguments);
  const internalApiUrlBase = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  try {
    if (toolName === 'search_orion_memory') {
      const searchResponse = await fetch(`${internalApiUrlBase}/api/orion/memory/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.get('Authorization') || '',
        },
        body: JSON.stringify({
          queryText: toolArgs.queryText,
          filter: {
            must: [
              ...(Array.isArray(toolArgs.memorySourceTypes)
                ? (toolArgs.memorySourceTypes as string[]).map((t: string) => ({
                    key: 'type',
                    match: { value: t },
                  }))
                : []),
              ...(Array.isArray(toolArgs.memorySourceTags)
                ? (toolArgs.memorySourceTags as string[]).map((t: string) => ({
                    key: 'tags',
                    match: { value: t.toLowerCase() },
                  }))
                : []),
            ],
          },
          limit: (toolArgs.limit as number) || 5,
        }),
      });
      const searchData = await searchResponse.json();
      return searchData.success ? searchData.results : { error: searchData.error || 'Memory search failed' };
    } else if (toolName === 'create_habitica_todo') {
      // TODO: Securely fetch Habitica credentials for the user
      const todoResponse = await fetch(`${internalApiUrlBase}/api/orion/habitica/todo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.get('Authorization') || '',
        },
        body: JSON.stringify({
          // userId and apiToken should be securely retrieved per user/session
          taskData: {
            text: toolArgs.taskText,
            notes: toolArgs.taskNotes,
            priority: toolArgs.priority,
          },
          orionSourceModule: toolArgs.orionSourceModule,
          orionSourceReferenceId: toolArgs.orionSourceReferenceId,
        }),
      });
      const todoData = await todoResponse.json();
      return todoData.success ? todoData.todo : { error: todoData.error || 'Failed to create Habitica task' };
    } else {
      return { error: `Tool ${toolName} not implemented.` };
    }
  } catch (error: unknown) {
    return {
      error: `Execution failed for tool ${toolName}: ` + (error instanceof Error ? error.message : 'Unknown error'),
    };
  }
}

export async function GET() {
  return NextResponse.json({ success: false, error: 'Method Not Allowed' }, { status: 405 });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userQuery } = body;
    if (!userQuery) {
      return NextResponse.json({ success: false, error: 'userQuery is required.' }, { status: 400 });
    }

    // Initial LLM message history
    const messages: { role: string; content?: string; tool_calls?: LLMToolCall[]; tool_call_id?: string }[] = [
      {
        role: 'system',
        content:
          "You are Orion, an AI assistant that can use tools to answer questions and perform actions. When a tool is needed, call it. Then use the tool's result to formulate your final answer to the user.",
      },
      {
        role: 'user',
        content: userQuery,
      },
    ];

    const MAX_ITERATIONS = 5;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const llmParams = {
        requestType: 'AGENTIC_TASK_STEP',
        messages,
        tools: ORION_TOOLS,
        tool_choice: 'auto',
        modelOverride: 'gpt-4-turbo-preview',
        temperature: 0.5,
        maxTokens: 1500,
      };

      let llmResponse: CombinedLLMResponse;
      try {
        const primaryContext =
          messages && messages.length > 0 ? messages.map((m: { content?: string }) => m.content).join('\n') : '';
        const options: Record<string, unknown> = {};
        if (llmParams.modelOverride) options.model = llmParams.modelOverride;
        if (llmParams.temperature) options.temperature = llmParams.temperature;
        if (llmParams.maxTokens) options.maxTokens = llmParams.maxTokens;

        llmResponse = await generateLLMResponse(llmParams.requestType, primaryContext, options);

        if (!llmResponse.success) {
          throw new Error(llmResponse.error || 'LLM call failed');
        }
      } catch (err: unknown) {
        console.error('[AGENT_EXECUTE] LLM error:', err);
        return NextResponse.json(
          {
            success: false,
            error: 'LLM call failed in agent loop.',
            details: err instanceof Error ? err.message : 'Unknown LLM error',
          },
          { status: 500 }
        );
      }

      const responseContent = llmResponse.content;

      // Attempt to parse tool calls from the LLM's response
      const toolCalls: LLMToolCall[] = parseAndValidateToolCalls(responseContent);

      if (toolCalls.length > 0) {
        const toolOutputs: unknown[] = [];
        for (const toolCall of toolCalls) {
          const toolOutput = await executeToolCall(toolCall, request);
          toolOutputs.push(toolOutput);
        }

        // Add tool message and tool output to history
        messages.push({ role: 'assistant', tool_calls: toolCalls });
        for (let j = 0; j < toolCalls.length; j++) {
          messages.push({
            role: 'tool',
            tool_call_id: toolCalls[j].id || toolCalls[j].function.name,
            content: JSON.stringify(toolOutputs[j]),
          });
        }
      } else {
        // If no tool calls, it's a final answer.
        messages.push({ role: 'assistant', content: responseContent });
        return NextResponse.json({ success: true, answer: responseContent });
      }

      if (i === MAX_ITERATIONS - 1) {
        return NextResponse.json({
          success: false,
          error: 'Max tool call iterations reached. No final answer provided.',
          current_messages: messages,
        });
      }
    }
    return NextResponse.json({
      success: false,
      error: 'Agentic loop finished without a direct answer after tool calls.',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: 'Agent execution failed.',
        details: error instanceof Error ? error.message : 'Unknown agent execution error',
      },
      { status: 500 }
    );
  }
}
