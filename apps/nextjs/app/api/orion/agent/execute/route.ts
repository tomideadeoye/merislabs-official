import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@shared/auth';
import { generateLLMResponse } from '@shared/lib/orion_llm';
import { AVAILABLE_ORION_TOOLS } from '@shared/lib/orion_tools';

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

export async function GET() {
  return NextResponse.json({ success: false, error: 'Method Not Allowed' }, { status: 405 });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authConfig);
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
      let llmContent: string;
      try {
        const { requestType, messages, modelOverride, temperature, maxTokens } = llmParams;
        const primaryContext = messages && messages.length > 0 ? messages.map(m => m.content).join('\n') : '';
        const options: any = {};
        if (modelOverride) options.model = modelOverride;
        if (temperature) options.temperature = temperature;
        if (maxTokens) options.maxTokens = maxTokens;
        llmContent = await generateLLMResponse(requestType, primaryContext, options);
        console.log('[AGENT_EXECUTE] LLM content:', llmContent);
      } catch (err) {
        console.error('[AGENT_EXECUTE] LLM error:', err);
        throw new Error('LLM call failed in agent loop: ' + (err && typeof err === 'object' && 'message' in err ? (err as any).message : err));
      }
      const responseMessage = llmContent;
      messages.push(responseMessage);
      // Note: tool_calls are not present in string LLM response. If agentic support is needed, parse JSON here.
      if (i === MAX_ITERATIONS - 1) {
        return NextResponse.json({ success: false, error: 'Max tool call iterations reached.', current_messages: messages });
      }
    }
    return NextResponse.json({ success: false, error: 'Agentic loop finished without a direct answer after tool calls.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Agent execution failed.', details: error.message }, { status: 500 });
  }
}
