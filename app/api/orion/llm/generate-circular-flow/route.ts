import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';

/**
 * @fileoverview API route for generating structured, circular workflow steps using an LLM.
 * @description This route takes a user prompt and leverages an LLM to generate a sequence of logical,
 *   actionable steps designed to form a continuous loop, suitable for process diagrams or flow visualizations.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Receive a text prompt from the frontend describing a desired workflow or process.
 *   - Utilize an LLM (e.g., GPT-4) to interpret the prompt and generate a list of sequential steps.
 *   - Ensure the generated steps are concise, clear, and logically interconnected to form a circular flow.
 *   - Return the steps as a JSON array to the client for visualization.
 *
 * FILEPATH: `app/api/orion/llm/generate-circular-flow/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/lib/orion_llm.ts`: Imports `generateLLMResponse` and `REQUEST_TYPES` for core LLM interaction.
 *   - `app/(orion_admin)/admin/narrative-clarity-studio/page.tsx`: This page consumes the output of this API to render narrative flow visualizations.
 *   - `app/components/orion/narrative-clarity-studio/NarrativeGenerationForm.tsx`: Sends the user's prompt to this API.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the LLM is capable of understanding and structuring complex prompts into sequential steps.
 *   - The generated steps are primarily text-based and require a frontend component to transform them into a visual graph structure.
 *
 * NOTES:
 *   - **COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE:** None immediately apparent, as this is a distinct LLM generation task.
 *   - **PERFORMANCE OPTIMIZATIONS:** LLM calls can be time-consuming; consider implementing client-side caching for frequently requested prompts or rate-limiting.
 *   - **ERROR HANDLING ROBUSTNESS:** Basic error handling is in place. Could add more specific error codes or messages for different LLM failure modes.
 *
 * OPPORTUNITIES FOR IMPROVEMENT & COMPREHENSIVE NEXT STEPS:
 *   **1. Advanced Prompt Engineering:**
 *     - **Goal:** Improve the LLM's ability to generate more sophisticated and contextually rich circular flows.
 *     - **How to Implement:** Experiment with few-shot prompting, providing examples of ideal circular flows. Refine the `systemContext` to be even more specific about the desired output format and step characteristics (e.g., active verbs, measurable outcomes).
 *   **2. Iterative Flow Refinement:**
 *     - **Goal:** Allow users to iteratively refine the generated circular flow.
 *     - **How to Implement:** Implement a mechanism for users to provide feedback on specific steps (e.g., "make this step more detailed," "split this step into two," "add a decision point"). The API could then take this feedback and the current steps to regenerate an improved flow.
 *   **3. Dynamic Flow Types:**
 *     - **Goal:** Enable the generation of different types of flows (e.g., decision trees, parallel processes, project timelines) based on user intent.
 *     - **How to Implement:** Introduce an input parameter (`flowType: 'circular' | 'decision-tree' | 'timeline'`) that modifies the LLM's system prompt and potentially the parsing logic for output.
 *   **4. Integration with other Modules:**
 *     - **Goal:** Connect generated flows directly to task management or project planning tools.
 *     - **How to Implement:** Once a flow is satisfactory, offer an option to convert it into a set of tasks or a project plan in the Business Management module.
 */

async function getStepsFromLLM(prompt: string, model = 'azure/gpt-4.1') {
  const result = await generateLLMResponse(REQUEST_TYPES.IDEA_BRAINSTORM, prompt, 'system_user_id', {
    model,
    temperature: 0.7,
    maxTokens: 1000,
    systemContext:
      'You are an AI assistant specialized in generating structured, circular workflow steps based on user prompts. Ensure the steps are logical, actionable, and form a continuous loop. Provide concise and clear steps suitable for a process diagram.',
  });

  if (result.success) {
    if (result.content) {
      const lines = result.content.split(/\n/g);
      const steps = lines
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && /^[\\d\\W]*[a-zA-Z]/.test(line))
        .map((line) => line.replace(/^[\\d\\W]+\\s*/, ''));

      return steps;
    }
  } else {
    console.error(`[GENERATE_CIRCULAR_FLOW_LLM_ERROR] LLM call failed: ${result.error}`);
    throw new Error(result.error || 'LLM generation failed.');
  }
  return [];
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, model } = await request.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required.' }, { status: 400 });
    }

    const steps = await getStepsFromLLM(prompt, model);

    return NextResponse.json({ success: true, steps });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('[API_ERROR] Failed to generate circular flow steps:', errorMessage);
    return NextResponse.json(
      { success: false, error: 'Failed to generate circular flow steps', details: errorMessage },
      { status: 500 }
    );
  }
}
