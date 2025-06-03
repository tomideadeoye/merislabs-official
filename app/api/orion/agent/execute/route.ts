import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generateLLMResponse } from '@/lib/orion_llm';
import { AVAILABLE_ORION_TOOLS } from '@/lib/orion_tools';

// Helper to execute tool calls by calling internal API endpoints
async function executeToolCall(toolCall: any, req: NextRequest): Promise<any> {
  const toolName = toolCall.function.name;
  const toolArgs = JSON.parse(toolCall.function.arguments);
  const internalApiUrlBase = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  try {
    if (toolName === 'search_orion_memory') {
      const searchResponse = await fetch(`${internalApiUrlBase}/api/orion/memory/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': req.headers.get('Authorization') || '' },
        body: JSON.stringify({
          queryText: toolArgs.queryText,
          filter: {
            must: [
              ...(toolArgs.memorySourceTypes?.map((t: string) => ({ key: 'type', match: { value: t } })) || []),
              ...(toolArgs.memorySourceTags?.map((t: string) => ({ key: 'tags', match: { value: t.toLowerCase() } })) || [])
            ]
          },
          limit: toolArgs.limit || 5,
        }),
      });
      const searchData = await searchResponse.json();
      return searchData.success ? searchData.results : { error: searchData.error || 'Memory search failed' };
    } else if (toolName === 'create_habitica_todo') {
      // TODO: Securely fetch Habitica credentials for the user
      const todoResponse = await fetch(`${internalApiUrlBase}/api/orion/habitica/todo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': req.headers.get('Authorization') || '' },
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
  } catch (error: any) {
    return { error: `Execution failed for tool ${toolName}: ${error.message}` };
  }
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
    let messages: any[] = [
      {
        role: 'system',
        content: 'You are Orion, an AI assistant that can use tools to answer questions and perform actions. When a tool is needed, call it. Then use the tool\'s result to formulate your final answer to the user.'
      },
      {
        role: 'user',
        content: userQuery
      }
    ];

    const MAX_ITERATIONS = 5;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const llmParams = {
        requestType: 'AGENTIC_TASK_STEP',
        messages,
        tools: AVAILABLE_ORION_TOOLS,
        tool_choice: 'auto',
        modelOverride: 'gpt-4-turbo-preview',
        temperature: 0.5,
        maxTokens: 1500,
      };
      const llmResult = await generateLLMResponse(llmParams);
      if (!llmResult.success || !llmResult.rawLLMResponse) {
        throw new Error(llmResult.error || 'LLM call failed in agent loop');
      }
      const responseMessage = llmResult.rawLLMResponse.choices[0].message;
      messages.push(responseMessage);
      if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        for (const toolCall of responseMessage.tool_calls) {
          const toolResultContent = await executeToolCall(toolCall, request);
          messages.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            name: toolCall.function.name,
            content: JSON.stringify(toolResultContent),
          });
        }
        if (i === MAX_ITERATIONS - 1) {
          return NextResponse.json({ success: false, error: 'Max tool call iterations reached.', current_messages: messages });
        }
      } else {
        return NextResponse.json({ success: true, answer: responseMessage.content, history: messages });
      }
    }
    return NextResponse.json({ success: false, error: 'Agentic loop finished without a direct answer after tool calls.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Agent execution failed.', details: error.message }, { status: 500 });
  }
}
