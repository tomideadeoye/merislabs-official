import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse, generateLLMResponseWithTools } from '@/lib/orion_llm';
import { getToolSchemas, executeTool } from '@/lib/orion_tools';
import type { CombinedLLMResponse, LLMToolCall, Message, LLMResponseSuccess, LLMTool } from '@/lib/types';
import logger from '@/lib/logger';

// Define the structure of a tool call received from the LLM
// interface LLMToolCall {
//   id?: string; // Optional ID provided by the LLM
//   function: {
//     name: string;
//     arguments: string; // Arguments are a JSON string from the LLM
//   };
//   type: 'function';
// }

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
// This function now directly uses the executeTool from orion_tools.ts
async function executeProposedToolCall(toolCall: LLMToolCall, allowedToolNames: string[]): Promise<unknown> {
  logger.info(`[AGENT_EXECUTE] Executing proposed tool call: ${toolCall.function.name}`);
  try {
    const toolOutput = await executeTool(toolCall, allowedToolNames);
    return toolOutput;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`[AGENT_EXECUTE] Failed to execute proposed tool call ${toolCall.function.name}:`, {
      error: errorMessage,
    });
    return { error: `Execution failed for proposed tool ${toolCall.function.name}: ${errorMessage}` };
  }
}

export async function GET() {
  return NextResponse.json({ success: false, error: 'Method Not Allowed' }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userQuery, selectedTools, numOptions = 1, preDeterminedToolCall } = body; // Default numOptions to 1

    // If a pre-determined tool call is provided, execute it directly.
    if (preDeterminedToolCall) {
      if (!isLLMFunctionCall(preDeterminedToolCall.function)) {
        return NextResponse.json(
          { success: false, error: 'Invalid pre-determined tool call format.' },
          { status: 400 }
        );
      }
      const toolOutput = await executeProposedToolCall(preDeterminedToolCall as LLMToolCall, selectedTools || []);
      const assistantMessage: Message = { role: 'assistant', content: 'Executing pre-determined action.' };
      const toolMessage: Message = {
        role: 'tool',
        content: JSON.stringify(toolOutput, null, 2),
        tool_call_id: preDeterminedToolCall.id || 'pre-determined-call',
      };
      return NextResponse.json({
        success: true,
        answer: 'Pre-determined action executed.',
        current_messages: [assistantMessage, toolMessage],
      });
    }

    // Proceed with normal LLM generation if no pre-determined tool call
    if (!userQuery) {
      return NextResponse.json({ success: false, error: 'userQuery is required.' }, { status: 400 });
    }

    // Pass ALL available tool schemas to the LLM for it to consider, regardless of user selection initially.
    // The security check for allowed tools will happen during executeTool.
    const availableToolSchemas = getToolSchemas() as object[]; // No filter here, let LLM see all
    logger.info('[AGENT_EXECUTE] All available tool schemas provided to LLM.', {
      schemas: availableToolSchemas.map((s) => (s as LLMTool).function.name),
    });

    const generatedStrategies: { answer: string; messages: Message[] }[] = [];

    // Outer loop for generating multiple strategies
    for (let strategyIndex = 0; strategyIndex < numOptions; strategyIndex++) {
      logger.info(`[AGENT_EXECUTE] Generating Strategy ${strategyIndex + 1}/${numOptions}.`, { userQuery });

      const messages: Message[] = [
        {
          role: 'system',
          content:
            "You are Orion, an AI assistant that can use tools to answer questions and perform actions. When a tool is needed, call it. Then use the tool's result to formulate your final answer to the user. Generate a distinct strategy or approach for the user's query.", // Added prompt for distinct strategy
        },
        {
          role: 'user',
          content: userQuery,
        },
      ];

      const currentMessages: Message[] = [...messages]; // To keep track of conversation flow for this strategy
      const MAX_ITERATIONS = 5;
      let finalAnswer: string | undefined;

      for (let i = 0; i < MAX_ITERATIONS; i++) {
        const llmParams = {
          requestType: 'agent_workflow',
          primaryContext: userQuery,
          tools: availableToolSchemas,
          tool_choice: 'auto' as 'auto' | 'none' | object,
          // numOptions is not passed here directly as it's handled by the outer loop
        };

        logger.debug('[AGENT_EXECUTE] Calling LLM with params.', { iteration: i, llmParams });
        const llmResponse: CombinedLLMResponse = await generateLLMResponseWithTools({
          requestType: llmParams.requestType,
          primaryContext: llmParams.primaryContext,
          userId: 'unauthenticated_user',
          tools: llmParams.tools,
          tool_choice: llmParams.tool_choice,
        });

        if (llmResponse.success) {
          currentMessages.push({ role: 'assistant', content: llmResponse.content });

          if (llmResponse.tool_calls && llmResponse.tool_calls.length > 0) {
            logger.info('[AGENT_EXECUTE] LLM requested tool calls.', { toolCalls: llmResponse.tool_calls });

            for (const toolCall of llmResponse.tool_calls) {
              logger.info(`[AGENT_EXECUTE] Executing tool: ${toolCall.function.name}.`);
              // Pass selectedTools to executeTool for permission check
              const toolOutput = await executeTool(toolCall, selectedTools || []);
              currentMessages.push({ role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(toolOutput) });
              logger.success(`[AGENT_EXECUTE] Tool ${toolCall.function.name} executed.`, { output: toolOutput });
            }
          } else {
            logger.info('[AGENT_EXECUTE] LLM provided a final answer.', { answer: llmResponse.content });
            finalAnswer = llmResponse.content;
            break; // Exit loop if LLM provides a final answer
          }
        } else {
          logger.error('[AGENT_EXECUTE] LLM generation failed.', {
            error: llmResponse.error,
            details: llmResponse.details,
          });
          // If one strategy fails, we might still want to try other strategies,
          // but for now, we'll propagate the error for this specific strategy.
          finalAnswer = `Error generating strategy: ${llmResponse.error}. Details: ${llmResponse.details || 'N/A'}`;
          break; // Break from inner loop if LLM generation fails for this strategy
        }
      }

      if (!finalAnswer) {
        finalAnswer =
          "I've completed my analysis and tool executions for this strategy. Please review the conversation history for details.";
        logger.warn('[AGENT_EXECUTE] Max iterations reached without a final answer for this strategy.');
      }
      generatedStrategies.push({ answer: finalAnswer, messages: currentMessages });
    } // End of outer loop for strategies

    logger.success('[AGENT_EXECUTE] Agent execution complete. Generated multiple strategies.', {
      numStrategies: generatedStrategies.length,
    });
    return NextResponse.json({
      success: true,
      strategies: generatedStrategies, // Return an array of strategies
    });
  } catch (error: unknown) {
    logger.error('[AGENT_EXECUTE] Uncaught error during agent execution.', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'N/A',
    });
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
