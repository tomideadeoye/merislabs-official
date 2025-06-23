/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * @fileoverview [This API route is responsible for generating actionable next steps for a given task using LLM intelligence and Orion's memory.]
 * @description [It takes a user's prompt (note), retrieves the associated task and its history, queries Orion's memory for relevant context, and then leverages a multi-tool LLM to propose distinct, justified next actions. The generated options are then saved as a new step in the task's decision history.]
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - [To serve as the primary backend endpoint for the "Generate Next Decisions" functionality in the Agentic Workflow.]
 *   - [To integrate LLM capabilities with task management and memory retrieval.]
 *   - [To create a structured, sequential decision history for each task.]
 *   - [To enable the LLM to propose actions with justifications and potentially call tools.]
 *
 * FILEPATH: `app/api/orion/tasks/[taskId]/generate-steps/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `auth.ts`: Used for user authentication and session management.
 *   - `app/lib/task_db_service.ts`: Consumes `getTaskWithSteps` and `addStepToTask` for database interactions.
 *   - `app/lib/pythonApiService.ts`: Assumed to exist for `searchMemory` (to retrieve context from Qdrant/Python backend).
 *   - `app/lib/orion_llm.ts`: Provides `generateLLMResponseWithTools` and `REQUEST_TYPES` for LLM interaction and tool calling.
 *   - `app/lib/logger.ts`: Used for comprehensive, context-rich logging of API operations, parameters, and results.
 *   - `@prisma/client`: Provides the `Task` and `TaskStep` types for strong type safety.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - [Assumes the user is authenticated and `session.user.id` is available for authorization.]
 *   - [Assumes `app/lib/pythonApiService.ts` exists and has a `searchMemory` function that returns relevant memories from Qdrant/Python backend.]
 *   - [Assumes `generateLLMResponseWithTools` in `app/lib/orion_llm.ts` can handle tool definitions and return structured JSON content.]
 *   - [The LLM's response for generated options is expected to be a parseable JSON array of objects, each with 'action' and 'justification'.]
 *   - [The `REQUEST_TYPES` enum in `app/lib/orion_llm.ts` must include 'AGENTIC_WORKFLOW'.]
 *   - [Tool definitions will need to be explicitly passed to `generateLLMResponseWithTools` based on available functionalities.]
 *
 * NOTES:
 *   - [This route is a POST endpoint to handle the generation of new steps, reflecting a state-changing operation.]
 *   - [Comprehensive logging is integrated at each critical stage for traceability and debugging.]
 *   - [The `memoryContext` step is crucial for making the LLM's responses personalized and informed by past data.]
 *   - [The `systemPrompt` meticulously guides the LLM to generate desired output format (JSON array of action/justification).]n *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - [Implement a more sophisticated error handling mechanism for LLM responses, including retries or more specific fallbacks.]
 *   - [Dynamically load tools based on user permissions or task context, rather than a static list.]
 *   - [Add schema validation for the incoming request body (e.g., using Zod) to ensure `prompt` and `numOptions` are valid.]
 *   - [Consider streaming LLM responses for a more responsive user experience, especially for longer generations.]
 *   - [Refine the prompt engineering for `systemPrompt` and `userPrompt` based on iterative testing to achieve optimal LLM output quality.]
 *   - [Add metrics logging (e.g., LLM token usage, response time) for performance monitoring.]
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth'; // For authentication
import { taskDbService } from '@/lib/task_db_service'; // For database operations on tasks
import { pythonApiService } from '@/lib/pythonApiService'; // Assumed to exist for memory search
import { generateLLMResponseWithTools, REQUEST_TYPES } from '@/lib/orion_llm'; // For LLM interaction and tool calling
import logger from '@/lib/logger'; // For logging
import { Prisma, TaskStep } from '@/generated/prisma'; // For Prisma types, specifically TaskStep and the Prisma namespace
import { LLMTool } from '@/lib/types'; // Import LLMTool type

export async function POST(request: NextRequest, { params }: { params: { taskId: string } }) {
  // Step 1: Authenticate the user.
  // Goal: Ensure only authorized users can access this endpoint.
  // Logic: Use `auth()` to get the session and extract the `userId`. Return 401 if unauthorized.
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    logger.warn('Unauthorized attempt to generate task steps.', {
      operation: 'POST /api/orion/tasks/[taskId]/generate-steps',
      validation: 'Unauthorized',
      sessionId: request.headers.get('x-session-id'),
    });
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  logger.info('Received request to generate task steps.', {
    operation: 'POST /api/orion/tasks/[taskId]/generate-steps',
    parameters: { taskId: params.taskId },
    userId,
    sessionId: request.headers.get('x-session-id'),
  });

  try {
    // Step 2: Parse request body and retrieve task details.
    // Goal: Get the user's note (prompt) and desired number of options. Fetch the task from the database.
    // Logic: Destructure `prompt` and `numOptions` from JSON. Use `taskDbService.getTaskWithSteps`.
    const { prompt, numOptions = 3, relatedLinks = [], relatedPhoneNumbers = [] } = await request.json();
    logger.debug('Parsed request body and retrieving task.', {
      operation: 'POST /api/orion/tasks/[taskId]/generate-steps',
      parameters: { prompt, numOptions, relatedLinks, relatedPhoneNumbers },
      taskId: params.taskId,
      userId,
    });

    const task = await taskDbService.getTaskWithSteps(params.taskId);
    if (!task) {
      logger.warn('Task not found for step generation.', {
        operation: 'POST /api/orion/tasks/[taskId]/generate-steps',
        validation: 'Task not found',
        taskId: params.taskId,
        userId,
      });
      throw new Error('Task not found.');
    }
    logger.info('Task retrieved successfully.', {
      operation: 'POST /api/orion/tasks/[taskId]/generate-steps',
      taskId: task.id,
      taskTitle: task.title,
      userId,
    });

    // Step 3: Search Orion's memory for relevant context.
    // Goal: Personalize LLM responses by injecting relevant past information.
    // Logic: Use `pythonApiService.searchMemory` with a query based on task title and current prompt.
    // NOTE: `pythonApiService.searchMemory` returns a string, not an object with a `results` array.
    logger.info('Searching Orion Memory for task context.', {
      operation: 'POST /api/orion/tasks/[taskId]/generate-steps',
      taskId: task.id,
      query: `Context for task: ${task.title}. ${prompt}`,
      userId,
    });
    const memoryContext = await pythonApiService.searchMemory(`Context for task: ${task.title}. ${prompt}`);
    logger.info('Orion Memory search completed.', {
      operation: 'POST /api/orion/tasks/[taskId]/generate-steps',
      taskId: task.id,
      memoryResultsLength: memoryContext.length,
      userId,
    });

    // Step 4: Prepare prompts and tools for the LLM.
    // Goal: Instruct the LLM on its role and provide all necessary context for generating next steps.
    // Logic: Define `systemPrompt` (LLM's role, output format) and `userPrompt` (task details, memory, history). Define available `tools`.
    const systemPrompt = `You are Orion, a strategic project manager. Analyze the task and generate ${numOptions} distinct, actionable next steps. For each, provide a clear 'action' and 'justification'. Your entire output MUST be a single, valid JSON array of objects.`;

    const userPrompt = `
      Task: "${task.title}".
      Description: "${task.description || 'No description provided.'}".
      My latest note/thinking: "${prompt}".
      Relevant Memories: ${memoryContext}
      History of steps taken on this task so far: ${task.steps.map((s: TaskStep) => `Step ${s.stepNumber}: ${s.chosenAction || s.prompt}`).join(' -> ') || 'No previous steps.'}
      Please provide your response as a JSON array, like this:
      [
        { "action": "First action item", "justification": "Why this action is logical" },
        { "action": "Second action item", "justification": "Why this action is logical" }
      ]
    `;

    // Define your tools here. These tools correspond to functions the LLM can decide to "call".
    // Example: A tool to search the web, create a Habitica todo, etc.
    // This array needs to align with the schema expected by `generateLLMResponseWithTools`.
    const tools: LLMTool[] = [
      // Example tool structure. You will need to fill this out based on your actual available tools.
      // Refer to app/lib/types/llm.ts for LLMTool interface.
      {
        type: 'function',
        function: {
          name: 'search_web',
          description: 'Performs a web search to find information.',
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'The search query.' },
            },
            required: ['query'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'create_habitica_todo',
          description: "Creates a new To-Do task in Tomide's Habitica account.",
          parameters: {
            type: 'object',
            properties: {
              text: { type: 'string', description: 'The text of the todo item.' },
              notes: { type: 'string', description: 'Additional notes for the todo item.' },
            },
            required: ['text'],
          },
        },
      },
    ];
    logger.debug('Prepared LLM prompts and tools.', {
      operation: 'POST /api/orion/tasks/[taskId]/generate-steps',
      taskId: task.id,
      userId,
      systemPromptLength: systemPrompt.length,
      userPromptLength: userPrompt.length,
      toolsCount: tools.length,
    });

    // Step 5: Call the LLM to generate next steps.
    // Goal: Get the LLM's proposed options and any tool calls.
    // Logic: Use `generateLLMResponseWithTools`. Ensure 'AGENTIC_WORKFLOW' is added to `REQUEST_TYPES`.
    logger.info('Calling LLM to generate next steps.', {
      operation: 'POST /api/orion/tasks/[taskId]/generate-steps',
      taskId: task.id,
      userId,
    });
    const llmResponse = await generateLLMResponseWithTools({
      requestType: REQUEST_TYPES.AGENTIC_WORKFLOW,
      primaryContext: userPrompt,
      systemContext: systemPrompt,
      tools,
      tool_choice: 'auto', // Allow LLM to decide whether to call a tool or respond directly
      userId, // Pass userId for logging/context within LLM service
      taskId: task.id, // Pass taskId for context
    });
    logger.info('LLM response received.', {
      operation: 'POST /api/orion/tasks/[taskId]/generate-steps',
      taskId: task.id,
      success: llmResponse.success,
      userId,
    });

    // Step 6: Validate LLM response and parse generated options.
    // Goal: Ensure the LLM returned a valid response and parse the JSON content.
    // Logic: Check `llmResponse.success` and `llmResponse.content`. Attempt JSON parsing.
    if (!llmResponse.success) {
      logger.error('LLM failed to generate content for task steps.', {
        operation: 'POST /api/orion/tasks/[taskId]/generate-steps',
        error: llmResponse.error || 'No content from LLM.',
        taskId: task.id,
        userId,
      });
      throw new Error(llmResponse.error || 'LLM failed to generate options.');
    }

    let generatedOptions: Prisma.JsonValue[] = [];
    try {
      generatedOptions = JSON.parse(llmResponse.content);
      if (
        !Array.isArray(generatedOptions) ||
        generatedOptions.some(
          (opt) => typeof opt !== 'object' || opt === null || !('action' in opt) || !('justification' in opt)
        )
      ) {
        throw new Error('LLM response is not a valid array of action/justification objects.');
      }
      logger.debug('Successfully parsed LLM generated options.', {
        operation: 'POST /api/orion/tasks/[taskId]/generate-steps',
        taskId: task.id,
        optionsCount: generatedOptions.length,
        userId,
      });
    } catch (parseError: unknown) {
      const parseErrorMessage = parseError instanceof Error ? parseError.message : 'Unknown JSON parsing error.';
      logger.error('Failed to parse LLM generated options JSON.', {
        operation: 'POST /api/orion/tasks/[taskId]/generate-steps',
        error: parseErrorMessage,
        rawContent: llmResponse.content,
        taskId: task.id,
        userId,
      });
      throw new Error(
        `Invalid LLM response format: ${parseErrorMessage}. Raw: ${llmResponse.content.substring(0, 200)}...`
      );
    }

    // Step 7: Add the new step (prompt, generated options, tool calls) to the task's history.
    // Goal: Persist the LLM's output as part of the task's decision history.
    // Logic: Use `taskDbService.addStepToTask`.
    const stepData: Omit<Prisma.TaskStepCreateInput, 'task' | 'stepNumber'> = {
      prompt,
      generatedOptions,
      toolCalls: (llmResponse.tool_calls || undefined) as Prisma.JsonArray | undefined,
      relatedLinks,
      relatedPhoneNumbers,
      // memoryReferences: (memoryContext?.results || []).map((m: any) => m.id), // Assuming memories have an ID
      // finalLog: will be updated later when an action is chosen
    };
    logger.info('Adding new step to task history.', {
      operation: 'POST /api/orion/tasks/[taskId]/generate-steps',
      taskId: task.id,
      userId,
      stepDataSummary: {
        prompt: stepData.prompt?.substring(0, 50),
        linksCount: relatedLinks.length,
        phonesCount: relatedPhoneNumbers.length,
      },
    });
    await taskDbService.addStepToTask(params.taskId, stepData);
    logger.success('New step added to task history successfully.', {
      operation: 'POST /api/orion/tasks/[taskId]/generate-steps',
      taskId: task.id,
      userId,
    });

    // Step 8: Return the generated options to the frontend.
    // Goal: Provide the UI with the next steps to display.
    return NextResponse.json({ success: true, options: generatedOptions }, { status: 200 });
  } catch (error: unknown) {
    // Step 9: Handle errors gracefully.
    // Goal: Catch any errors during the process and return a standardized error response.
    // Logic: Log the error and return a 500 status with an error message.
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during step generation.';
    logger.error('Failed to generate task steps.', {
      operation: 'POST /api/orion/tasks/[taskId]/generate-steps',
      error: errorMessage,
      parameters: { taskId: params.taskId, prompt }, // Using the already defined prompt variable
      userId,
      validation: 'Backend logic or external service error.',
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
