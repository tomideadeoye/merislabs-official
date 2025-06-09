import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@shared/auth';
import { generateLLMResponse } from '@shared/lib/orion_llm';
import { ORION_MEMORY_COLLECTION_NAME } from '@shared/lib/orion_config';

// Define the type inline:
type DraftCommunicationRequestBody = {
  messageToReplyTo: string;
  messageHistory?: string;
  topicOrGoal: string;
  relationshipContext: string;
  userProfileContext?: string;
  additionalInstructions?: string;
  numberOfDrafts?: number;
};

// Define a minimal type for ScoredMemoryPoint inline
// (only the payload.text field is used)
type ScoredMemoryPoint = {
  payload: { text: string };
};

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    console.log(`[API /draft-whatsapp-reply] [INFO] Received request at ${new Date().toISOString()}`);
    const session = await auth();
    if (!session || !session.user) {
        console.error(`[API /draft-whatsapp-reply] [ERROR] Unauthorized access attempt.`);
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body: DraftCommunicationRequestBody = await request.json();
        console.log(`[API /draft-whatsapp-reply] [INFO] Request body received`, { topicOrGoal: body.topicOrGoal, relationshipContext: body.relationshipContext });

        const {
            messageToReplyTo,
            messageHistory,
            topicOrGoal,
            relationshipContext,
            userProfileContext, // Make sure frontend sends this
            additionalInstructions,
            numberOfDrafts = 3 // Default to 3 drafts
        } = body;

        if (!messageToReplyTo || !topicOrGoal) {
            console.error('[API /draft-whatsapp-reply] [ERROR] Validation failed: Missing messageToReplyTo or topicOrGoal.');
            return NextResponse.json({ success: false, error: "Message to reply to and your reply goal are required." }, { status: 400 });
        }

        // --- Workflow Step 1: Consult Memory (Qdrant) ---
        console.log('[API /draft-whatsapp-reply] [INFO] Consulting memory for similar contexts...');
        let relevantMemories: string[] = [];
        try {
            const internalApiUrlBase = process.env.NEXTAUTH_URL || 'http://localhost:3000';
            const memorySearchResponse = await fetch(`${internalApiUrlBase}/api/orion/memory/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    queryText: `Context for replying to a WhatsApp message about: ${topicOrGoal}\n\nMessage: ${messageToReplyTo}`,
                    limit: 5,
                    collectionName: ORION_MEMORY_COLLECTION_NAME,
                    filter: { must: [{ key: "payload.type", match: { any: ["whatsapp_reply_sample", "journal_entry", "general_note"] } }] }
                })
            });

            const memoryData = await memorySearchResponse.json();
            if (memoryData.success && memoryData.results && memoryData.results.length > 0) {
                relevantMemories = memoryData.results.map((point: ScoredMemoryPoint) => point.payload.text);
                console.log(`[API /draft-whatsapp-reply] [INFO] Found ${relevantMemories.length} relevant memories.`);
            } else {
                 console.log('[API /draft-whatsapp-reply] [INFO] No relevant memories found.');
            }
        } catch (memError) {
            console.warn('[API /draft-whatsapp-reply] [WARN] Could not consult memory, proceeding without it.', memError);
        }

        // --- Workflow Step 2: Construct Rich LLM Prompt ---
        console.log('[API /draft-whatsapp-reply] [INFO] Constructing rich LLM prompt...');
        // The detailed instructions for the LLM on how to behave as you.
        const systemPrompt = `You are Tomide Adeoye. Your task is to draft replies for WhatsApp as if you are him.
        Your general persona: Friendly, enthusiastic, intelligent, ambitious, dedicated, and caring. You use conversational, informal language with contractions. Your tone is generally simple, avoiding buzzwords. Use emojis sparingly and appropriately. When humor is used, it should be thoughtful.
        Your core life goals involve achieving financial freedom and a top-tier career via a postgraduate degree and relocation. Your values are Freedom, Logic, Growth, Stability, and Creation.

        Adapt your tone based on the specified relationship context:
        - timi_girlfriend: The recipient is Timi, your girlfriend. The tone MUST be warm, loving, deeply affectionate, and reflect your shared history. Use terms of endearment naturally.
        - close_friend: The recipient is a close friend. Maintain a casual, warm, and personal tone, using humor where appropriate.
        - family_member: The recipient is a family member. The tone should be respectful, caring, and supportive.
        - professional_colleague or new_professional_contact: Maintain a warm yet professional tone. Ensure clarity and respect.
        - formal_correspondence: Adopt a more formal and authoritative tone.
        - default: Use a generally friendly and approachable tone.

        Analyze the provided context, memory snippets, and instructions to generate high-quality, authentic replies.

        User's full profile context for deeper personality understanding:
        ${userProfileContext}
        `;

        const userObjectivePrompt = `
        **Task:** Generate ${numberOfDrafts} distinct reply options for a WhatsApp message.

        **Relationship Context:** ${relationshipContext}

        **My Goal for this Reply:** "${topicOrGoal}"

        **Message I am Replying To:**
        """
        ${messageToReplyTo}
        """

        ${messageHistory ? `**Additional Chat History for Context:**\n"""\n${messageHistory}\n"""` : ""}

        **Relevant Past Interactions/Notes from My Memory (Use these for style and context):**
        ${relevantMemories.length > 0 ? relevantMemories.map(m => `- "${m}"`).join('\n') : "No specific memories retrieved."}

        ${additionalInstructions ? `**My Specific Instructions for This Draft:** ${additionalInstructions}` : ""}

        **Your Output:**
        Output a JSON array of objects, each with these fields:
        - text: the draft reply (string)
        - explanation: a one-sentence explanation of the strategy/tone for this draft (string)
        - rank: integer, 1 for the top pick (most effective), 2 for the next, etc. (rank all drafts, do not tie)

        Example:
        [
          { "text": "Hey! Thanks for reaching out...", "explanation": "Direct and friendly, sets a clear boundary.", "rank": 1 },
          { "text": "Hi, appreciate your message...", "explanation": "Gentle and seeks to understand their perspective.", "rank": 2 }
        ]

        Do not add any extra explanations, apologies, or introductions. Only output the JSON array.
        `;

        const messages = [{ role: 'system', content: systemPrompt }, { role: 'user', content: userObjectivePrompt }];

        // --- Workflow Step 3: Call LLM ---
        const llmStartTime = Date.now();
        console.log('[API /draft-whatsapp-reply] [INFO] Calling LLM service...');
        const llmContent = await generateLLMResponse(
            'DRAFT_COMMUNICATION',
            userObjectivePrompt,
            {
                systemContext: systemPrompt,
                temperature: 0.85,
                maxTokens: 1500,
            }
        );
        const llmDuration = Date.now() - llmStartTime;
        console.log(`[API /draft-whatsapp-reply] [INFO] LLM call completed in ${llmDuration}ms.`);

        // --- Workflow Step 4: Parse & Respond ---
        let drafts: { text: string; explanation: string; rank: number }[] = [];
        try {
            // Try to parse the LLM's JSON output
            drafts = JSON.parse(llmContent);
            // Sort by rank ascending (1 = top pick)
            drafts.sort((a, b) => a.rank - b.rank);
        } catch (parseErr) {
            console.error('[API /draft-whatsapp-reply] [ERROR] Failed to parse LLM JSON output:', parseErr, llmContent);
            return NextResponse.json({ success: false, error: 'Failed to parse LLM output as JSON.', raw: llmContent }, { status: 500 });
        }
        const duration = Date.now() - startTime;
        console.log(`[API /draft-whatsapp-reply] [INFO] Request completed successfully in ${duration}ms.`);
        return NextResponse.json({ success: true, drafts, relevantMemories });

    } catch (error: any) {
        const duration = Date.now() - startTime;
        console.error(`[API /draft-whatsapp-reply] [ERROR] An unexpected error occurred after ${duration}ms:`, error);
        return NextResponse.json({ success: false, error: 'An unexpected error occurred.', details: error.message }, { status: 500 });
    }
}
