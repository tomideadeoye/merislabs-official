import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getPersonaById } from "@repo/shared/persona_service";
import { TOMIDES_PROFILE_DATA } from "@repo/shared";
import { searchMemory } from "@repo/shared";
import { generateLLMResponse } from "@repo/shared";
import {
  OutreachRequest,
  OutreachResponse,
} from "@repo/shared/types/strategic-outreach";
import type {
  ScoredMemoryPoint,
  GenerateLLMResponse,
} from "@repo/shared";

/**
 * API route for crafting strategic outreach content
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OutreachRequest;
    const {
      personaId,
      opportunityDetails,
      goal,
      communicationType,
      tone,
      additionalContext,
    } = body;

    // Validate required fields
    if (!personaId || !opportunityDetails || !goal || !communicationType) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Get the persona
    const persona = await getPersonaById(personaId);
    if (!persona) {
      return NextResponse.json(
        {
          success: false,
          error: "Persona not found",
        },
        { status: 404 }
      );
    }

    // Get relevant memories
    const relevantMemoriesResponse: any = await searchMemory({
      query: `${persona.name} ${
        persona.company || ""
      } ${opportunityDetails} ${goal}`,
      limit: 5,
      filter: {
        must: [{ key: "payload.tags", match: { value: "achievement" } }],
      },
    });

    console.log(
      "[OUTREACH_CRAFT] relevantMemoriesResponse type:",
      typeof relevantMemoriesResponse,
      Array.isArray(relevantMemoriesResponse) ? "array" : "object",
      relevantMemoriesResponse
    );

    const relevantMemories = relevantMemoriesResponse.results || [];

    // Get profile data
    let profileData = "";
    try {
      const profileResponse = await fetch(TOMIDES_PROFILE_DATA);
      profileData = await profileResponse.text();
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }

    // Construct prompt for LLM
    const prompt = `
# Strategic Outreach Content Generation

## Persona Information
- Name: ${persona.name}
- Company: ${persona.company || "N/A"}
- Role: ${persona.role || "N/A"}
- Industry: ${persona.industry || "N/A"}
- Values: ${persona.values?.join(", ") || "N/A"}
- Challenges: ${persona.challenges?.join(", ") || "N/A"}
- Interests: ${persona.interests?.join(", ") || "N/A"}
- Value Proposition: ${persona.valueProposition || "N/A"}
- Additional Notes: ${persona.notes || "N/A"}

## OrionOpportunity Details
${opportunityDetails}

## Goal
${goal}

## Communication Type
${communicationType}

## Tone
${tone || "professional"}

${additionalContext ? `## Additional Context\n${additionalContext}` : ""}

${
  relevantMemories.length > 0
    ? `## Relevant Achievements and Experiences\n${relevantMemories
        .map((m: ScoredMemoryPoint) => `- ${m.payload.text}`)
        .join("\n")}`
    : ""
}

## Task
Craft a personalized ${communicationType} to ${persona.name} that:
1. Addresses their specific challenges, values, and interests
2. Clearly communicates your value proposition in a way that resonates with them
3. Incorporates psychological principles for maximum impact and memorability
4. Uses a ${tone || "professional"} tone throughout
5. Focuses on achieving the stated goal: ${goal}
6. Includes a clear call to action
7. Is concise and impactful

Write the complete ${communicationType} content, ready to send.
`;

    // Generate outreach content using LLM
    let llmContent: string;
    try {
      llmContent = await generateLLMResponse("OUTREACH_CRAFT", prompt, {
        profileContext: profileData,
        systemContext: "",
        memoryResults: relevantMemories.map((m: ScoredMemoryPoint) => ({
          id: m.id,
          text: m.payload.text,
        })),
        model: "",
        temperature: 0.7,
        maxTokens: 1500,
      });
      console.log("[OUTREACH_CRAFT] LLM content:", llmContent);
      return NextResponse.json({ success: true, outreachDraft: llmContent });
    } catch (err) {
      console.error("[OUTREACH_CRAFT] LLM error:", err);
      return NextResponse.json(
        {
          success: false,
          error:
            err && typeof err === "object" && "message" in err
              ? (err as any).message
              : "Failed to generate outreach draft.",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in outreach/craft route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
