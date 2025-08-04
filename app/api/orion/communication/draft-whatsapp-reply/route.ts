/**
 * GOAL: This API route functions as the strategic core for Orion's communication drafting. It integrates real-time conversation context with a deep memory system and user-defined strategic parameters to generate sophisticated, multi-faceted reply options. It must seamlessly handle dynamic inputs from the UI to architect responses that are not just reactive, but proactive and advantageous.
 *
 * @fileoverview API route for drafting hyper-personalized WhatsApp replies using Orion's LLM and memory system.
 * @description Receives chat history, user-defined reply goals, tone, requested response types, and other parameters.
 *   Performs semantic memory search via Qdrant, constructs a dynamic, strategic prompt for the LLM, and returns
 *   a structured markdown response containing deep analysis and categorized reply drafts.
 *
 * FEATURES:
 *   - Receives comprehensive chat context, strategic intent (goal, tone, user context), and response parameters (reply types, number of drafts).
 *   - Integrates memory search to retrieve relevant historical context.
 *   - Dynamically builds a sophisticated prompt based on all available data.
 *   - Returns a structured markdown response with analysis and categorized drafts.
 */

import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { generateLLMResponse } from '@/lib/orion_llm';
import { searchMemory } from '@/lib/memory';
import { ScoredMemoryPoint } from '@/lib/types/memory';

// --- NEW HELPER FUNCTION TO BUILD THE DYNAMIC PROMPT ---
function buildStrategicPrompt(params: {
  replyGoal: string;
  desiredTone?: string | null;
  decisionOptions: string[];
  userContext?: string;
  numberOfDrafts: number;
  relationshipType?: string;
}): string {
  const { replyGoal, desiredTone, decisionOptions, userContext, numberOfDrafts, relationshipType } = params;

  // Build the section for requested reply types
  const replyTypesString = decisionOptions.length > 0
    ? `Generate ${numberOfDrafts} draft(s) for EACH of the following strategic categories: ${decisionOptions.join(', ')}.`
    : 'No specific reply types requested. Generate a single, best-fit strategic response.';

  // Build the user context section only if provided
  const userContextString = userContext
    ? `*   Tomide's Current State/Context: "${userContext}"`
    : '';

  // Build the relationship type section only if provided
  const relationshipTypeString = relationshipType
    ? `*   Relationship Type: "${relationshipType}"`
    : '';

  // Build the tone/persona section only if provided
  const desiredToneString = desiredTone
    ? `*   **Desired Tone/Persona:** "${desiredTone}"`
    : '*   **Desired Tone/Persona:** Not specified. Consider multiple strategic personas and tones for reply options.';

  // --- MARKDOWN VISUAL INSTRUCTION ---
  const markdownInstruction = `
**//--- MARKDOWN FORMATTING INSTRUCTIONS ---//**
- Use clear, visually distinct markdown formatting for all output.
- Use headings (##, ###), bold, bullet points, and blockquotes for replies.
- Each reply draft should be in a blockquote (>) and rationale in bold or italics.
- The BEST REPLY (with justification) must be presented FIRST, clearly separated and visually distinct.
- All sections must be easy to scan and visually engaging.
`;

  // This is the new, comprehensive prompt structure we designed
  const systemPrompt = `
You are Orion, Tomide's AI strategist, drafting WhatsApp replies on his behalf. You are to reply AS TOMIDE, adopting the persona specified.

**//--- PRIMARY DIRECTIVE ---//**
Your ultimate goal is to architect a response that positions Tomide for the most advantageous outcome, aligned with his long-term objectives of power, stability, and peace.

**//--- INCOMING DATA ---//**
*   **Tomide's Profile Context:** You operate with the full knowledge of Tomide's values (Logic, Growth, Stability, etc.), goals (Financial Freedom, etc.), and challenges (Morality Cage, Conflict Avoidance, etc.).
*   **Tomide's Stated Reply Goal:** "${replyGoal}"
${desiredToneString}
${userContextString}
${relationshipTypeString}

${markdownInstruction}

**//--- TASK EXECUTION ---//**

**STEP 1: DEEP ANALYSIS - "WHAT IS UNSEEN?"**
Before drafting any replies, provide a concise, neutral analysis of the interaction. Answer these key questions:
*   **Subtext & Unstated Needs:** What is the other person *really* asking for or feeling, beyond their literal words?
*   **Pattern Recognition:** Does this interaction match any known positive or negative patterns from Tomide's memory (e.g., manipulation loops, genuine collaboration attempts)?
*   **Power Dynamics:** Who is controlling the frame of the conversation? What strategic position is the other person taking (e.g., aggressor, victim, collaborator)?
*   **Triggers & Vulnerabilities:** Is the other person's language potentially triggering Tomide's known sensitivities? Is there a strategic opportunity or threat hidden in the conversation?

**STEP 2: SUGGEST THE BEST REPLY (MOST IMPORTANT)**
- Based on your analysis and all context, suggest the single BEST REPLY for Tomide to send.
- Present this reply FIRST, clearly separated and visually distinct, with a strong justification for why it is optimal.
- Justification must be concise, strategic, and actionable.

**STEP 3: STRATEGIC RESPONSE GENERATION**
- Generate the requested reply drafts for each category (if any), considering multiple tones/personas if none is specified.
- For each individual draft, provide a brief "Strategic Rationale" explaining why it works and its likely outcome.
${replyTypesString}

**//--- OUTPUT FORMAT (Use Markdown) ---//**
### **BEST REPLY (Most Important)**
- **Justification:** [Why this reply is optimal]
> [Best reply draft here]

---
### **Option Category: [e.g., Deflect / Evade]**

**Draft 1**
*   *Rationale:* [Briefly explain the strategy, e.g., "This response buys time and avoids commitment without creating direct conflict, putting the onus on them to follow up."]
*   **Reply:**
    > [Your reply draft here]

**(Repeat for Draft 2, etc., if requested)**

---
### **Option Category: [e.g., Set a Boundary]**

**Draft 1**
*   *Rationale:* [e.g., "This firmly rejects the premise of their question and reframes the conversation around your own priorities, demonstrating control."]
*   **Reply:**
    > [Your reply draft here]

**(Repeat for all requested categories)**

---
### **Deep Analysis: What You Might Be Missing**
*   **Subtext:** [Your analysis of unstated needs]
*   **Pattern Match:** [Your analysis of pattern recognition]
*   **Power Dynamic:** [Your analysis of the interaction's power frame]
*   **Strategic Opportunity/Threat:** [Your analysis of potential openings or risks]
  `.trim();

  return systemPrompt;
}

export async function POST(request: NextRequest) {
  try {
    // --- UPDATED: Destructure the new payload from the UI ---
    const {
      chatContext,
      replyGoal,
      desiredTone,
      decisionOptions,
      userContext,
      numberOfDrafts,
      relationshipType
    } = await request.json();

    logger.info('[draft-whatsapp-reply][POST] Received strategic request.', {
      chatContextLength: chatContext ? chatContext.length : 0,
      replyGoal,
      desiredTone,
      decisionOptions,
      userContext,
      numberOfDrafts,
      relationshipType
    });

    if (!chatContext) {
      logger.warn('[draft-whatsapp-reply][POST] Missing chatContext in request.');
      return NextResponse.json({ success: false, error: 'Chat context is required.' }, { status: 400 });
    }

    // Search for relevant memories based on the chat context
    let memoryResults: ScoredMemoryPoint[] = [];
    try {
      const memorySearchResponse = await searchMemory(chatContext, { limit: 5 });
      if (memorySearchResponse.success && memorySearchResponse.results) {
        memoryResults = memorySearchResponse.results;
        logger.info('[draft-whatsapp-reply][POST] Found relevant memories.', { memoryCount: memoryResults.length });
      } else {
        logger.warn('[draft-whatsapp-reply][POST] No relevant memories found or search failed.', { error: memorySearchResponse.error });
      }
    } catch (memoryError: unknown) {
      logger.error('[draft-whatsapp-reply][POST] Error during memory search.', {
        error: memoryError instanceof Error ? memoryError.message : String(memoryError),
      });
    }

    // --- UPDATED: Build the dynamic prompt using the new helper function ---
    const systemPrompt = buildStrategicPrompt({
      replyGoal: replyGoal || 'Achieve the most advantageous outcome for me.',
      desiredTone: desiredTone,
      decisionOptions: decisionOptions || [],
      userContext: userContext,
      numberOfDrafts: numberOfDrafts || 1,
      relationshipType
    });

    // Call the LLM to generate the reply
    const llmResponse = await generateLLMResponse(
      'whatsapp_reply_draft',
      chatContext,
      null, // userId is nullable
      {
        memoryResults: memoryResults,
        systemContext: systemPrompt, // Pass the fully constructed prompt
        // The individual params are now part of the system prompt itself
        // but can be passed here if the LLM function needs them for other logic.
        replyGoal,
        tone: desiredTone,
        numberOfDrafts
      }
    );

    if (!llmResponse.success || !llmResponse.content) {
      logger.error('[draft-whatsapp-reply][POST] LLM response error or empty content.', {
        error: 'LLM generated an empty or failed response.'
      });
      return NextResponse.json(
        { success: false, error: 'LLM generated an empty or failed response.' },
        { status: 500 }
      );
    }

    logger.success('[draft-whatsapp-reply][POST] Successfully drafted WhatsApp reply.', {
      hasReply: !!llmResponse.content,
    });

    // The LLM is now instructed to return markdown directly
    return NextResponse.json({
      success: true,
      markdown: llmResponse.content, // Changed key to markdown for clarity
      memoryResults: llmResponse.memoryResults, // Pass back the memories used
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    logger.error('[draft-whatsapp-reply][POST] Uncaught error during reply drafting.', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : 'N/A',
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
