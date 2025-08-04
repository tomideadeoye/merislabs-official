import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponseWithTools } from '@/lib/orion_llm';
import { getToolSchemas, executeTool } from '@/lib/orion_tools';
import type { CombinedLLMResponse, LLMToolCall, Message, LLMTool, ScoredMemoryPoint } from '@/lib/types';
import logger from '@/lib/logger';
import { searchMemory } from '@/lib/memory';

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
    const { userQuery, selectedTools, numOptions = 1, preDeterminedToolCall, includeMemory } = body; // Default numOptions to 1

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

    if (!userQuery) {
      return NextResponse.json({ success: false, error: 'userQuery is required.' }, { status: 400 });
    }

    // --- Qdrant Memory Integration ---
    let memoryResults: ScoredMemoryPoint[] = [];
    let memoryContextBlock = '';
    if (includeMemory) {
      try {
        const memorySearchResponse = await searchMemory(userQuery, { limit: 5 });
        if (memorySearchResponse.success && memorySearchResponse.results) {
          memoryResults = memorySearchResponse.results;
          memoryContextBlock = '\n\n---\nRelevant Memory Chunks (Qdrant):\n' +
            memoryResults.map((m, idx) => `#${idx + 1}: ${m.content || JSON.stringify(m)}`).join('\n');
          logger.info('[AGENT_EXECUTE][MEMORY] Injected Qdrant memory into agent context.', { count: memoryResults.length });
        } else {
          logger.warn('[AGENT_EXECUTE][MEMORY] No relevant memory found or search failed.', { error: memorySearchResponse.error });
        }
      } catch (memoryError) {
        logger.error('[AGENT_EXECUTE][MEMORY] Error during Qdrant memory search.', { error: memoryError instanceof Error ? memoryError.message : String(memoryError) });
      }
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

      // --- Inject memory context as a system message if present ---
      const systemPrompt =
        `You are Orion, an autonomous agentic AI assistant. Your job is to actually accomplish the user's task or goal using the tools provided to you, not just to plan or outline steps. You must use the available tools in sequence as needed to fully complete the user's request, only stopping when the task is truly done or no further actions are possible. The tools you have are sufficient to get the job done—do not defer work back to the user. When a tool is needed, call it, use its result, and then immediately take the next logical action until the user's goal is achieved. You may only call each tool with a unique set of arguments ONCE per session. If you have already called a tool with the same arguments, do NOT call it again. Instead, use the information already provided to answer the user as best as possible. After using a tool, always attempt to provide a final answer or take the next step. If you cannot answer, explain why based on the information you have. Never simply outline a plan—always execute the steps yourself using the tools provided.

EXAMPLE (Tool Use):
User: "Find the latest price of a .gov.ng domain and send me an email with the details."
Assistant: (calls search_web tool with query 'latest price of .gov.ng domain')
Tool Output: "The current price for a .gov.ng domain is 70,000 NGN per year."
Assistant: (calls send_email tool with subject 'Domain Price', body 'The current price for a .gov.ng domain is 70,000 NGN per year.')
Tool Output: "Email sent successfully."
Assistant: "I have found the latest price for a .gov.ng domain (70,000 NGN/year) and sent you an email with the details. Task complete."

` +
        (memoryContextBlock ? memoryContextBlock : '');

      const messages: Message[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userQuery,
        },
        {
          role: 'user',
          content: "You must begin by calling the most relevant tool to start accomplishing the user's goal. Do not outline a plan—take action immediately.",
        },
      ];

      const currentMessages: Message[] = [...messages]; // To keep track of conversation flow for this strategy
      const MAX_ITERATIONS = 5;
      let finalAnswer: string | undefined;
      // Track tool calls and arguments to prevent repeats
      const toolCallHistory: Set<string> = new Set();

      for (let i = 0; i < MAX_ITERATIONS; i++) {
        const llmParams = {
          requestType: 'agent_workflow',
          primaryContext: userQuery,
          tools: availableToolSchemas,
          tool_choice: (i === 0 ? 'auto' : 'none') as 'auto' | 'none' | object | undefined, // After first iteration, force LLM to answer
        };

        logger.debug('[AGENT_EXECUTE] Calling LLM with params.', { iteration: i, llmParams });
        let llmResponse: CombinedLLMResponse = await generateLLMResponseWithTools({
          requestType: llmParams.requestType,
          primaryContext: llmParams.primaryContext,
          userId: 'unauthenticated_user',
          tools: llmParams.tools,
          tool_choice: llmParams.tool_choice,
        });

        // If first iteration and LLM just outlines a plan (no tool_calls), re-prompt once to demand action
        if (i === 0 && llmResponse.success && (!llmResponse.tool_calls || llmResponse.tool_calls.length === 0)) {
          logger.warn('[AGENT_EXECUTE] LLM first response was just a plan. Re-prompting to demand action.');
          currentMessages.push({ role: 'user', content: "Do not outline a plan. Use the tools to actually begin the work now. Take action immediately." });
          llmResponse = await generateLLMResponseWithTools({
            requestType: llmParams.requestType,
            primaryContext: llmParams.primaryContext,
            userId: 'unauthenticated_user',
            tools: llmParams.tools,
            tool_choice: llmParams.tool_choice,
          });
        }

        if (llmResponse.success) {
          currentMessages.push({ role: 'assistant', content: llmResponse.content });

          if (llmResponse.tool_calls && llmResponse.tool_calls.length > 0) {
            logger.info('[AGENT_EXECUTE] LLM requested tool calls.', { toolCalls: llmResponse.tool_calls });

            for (const toolCall of llmResponse.tool_calls) {
              let argsObj: Record<string, any>;
              try { argsObj = JSON.parse(toolCall.function.arguments); } catch { argsObj = {}; }
              const toolCallKey = `${toolCall.function.name}:${JSON.stringify(argsObj, Object.keys(argsObj).sort())}`;
              if (toolCallHistory.has(toolCallKey)) {
                const repeatMsg = `You have already called the tool '${toolCall.function.name}' with these arguments. Please use the information already provided to answer the user as best as possible.`;
                currentMessages.push({ role: 'tool', tool_call_id: toolCall.id, content: repeatMsg });
                logger.warn('[AGENT_EXECUTE] Prevented repeated tool call.', { toolCallKey });
                continue;
              }
              toolCallHistory.add(toolCallKey);
              logger.info(`[AGENT_EXECUTE] Executing tool: ${toolCall.function.name}.`);
              let toolOutput = await executeTool(toolCall, selectedTools || []);
              // If search_web, format output for LLM
              if (toolCall.function.name === 'search_web' && toolOutput && typeof toolOutput === 'object') {
                const { snippets, scraped_content } = toolOutput;
                toolOutput = `\n---\nWeb Search Summary:\n${snippets}\n\nKey Facts (bullet points):\n${snippets.split(/\n|\r/).map((line: string) => line.trim()).filter(Boolean).map((line: string) => '- ' + line).join('\n')}\n\nScraped Content:\n${scraped_content}\n---\n`;
              }
              currentMessages.push({ role: 'tool', tool_call_id: toolCall.id, content: typeof toolOutput === 'string' ? toolOutput : JSON.stringify(toolOutput) });
              logger.success(`[AGENT_EXECUTE] Tool ${toolCall.function.name} executed.`, { output: toolOutput });
              // After tool call, append explicit user message to force LLM to answer
              currentMessages.push({ role: 'user', content: "You have now received the tool results. Please answer the user's question using this information. Do not call the same tool again." });
            }
          } else {
            logger.info('[AGENT_EXECUTE] LLM provided a final answer.', { answer: llmResponse.content });
            finalAnswer = llmResponse.content;
            break; // Exit loop if LLM provides a final answer
          }
        } else if (!llmResponse.success) {
          finalAnswer = `Error: ${llmResponse.error}`;
          currentMessages.push({ role: 'assistant', content: finalAnswer });
          logger.error('[AGENT_EXECUTE] LLM call failed.', { error: llmResponse.error });
          break; // Exit loop on LLM error
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
    // After generating all strategies, return the first one (for now)
    type AgentResult = { success: boolean; answer: string; current_messages: Message[]; memoryResults?: ScoredMemoryPoint[] };
    const result: AgentResult = {
      success: true,
      answer: generatedStrategies[0]?.answer,
      current_messages: generatedStrategies[0]?.messages,
    };
    // Fallback: if current_messages is empty but answer is present, create a single assistant message
    if ((!result.current_messages || result.current_messages.length === 0) && result.answer) {
      result.current_messages = [{ role: 'assistant', content: result.answer }];
    }
    if (includeMemory && memoryResults && memoryResults.length > 0) {
      result.memoryResults = memoryResults;
    }
    return NextResponse.json(result);
  } catch (error: unknown) {
    logger.error('[AGENT_EXECUTE] Uncaught error during agent execution.', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'N/A',
    });
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
