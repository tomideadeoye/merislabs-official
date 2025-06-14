import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { TOMIDES_PROFILE_DATA } from "@repo/shared/constants";
import { searchMemory } from "@repo/shared/orion_memory";
import { generateLLMResponse, REQUEST_TYPES } from "@repo/shared/orion_llm";
import {
  getCareerMilestones,
  getValueProposition,
} from "@repo/shared/narrative_service";
import {
  NarrativeGenerationRequest,
  NarrativeGenerationResponse,
} from "@repo/shared/types/narrative-clarity";
import type { ScoredMemoryPoint } from "@repo/shared";

/**
 * API route for generating narrative content
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as NarrativeGenerationRequest;
    const {
      narrativeType,
      valueProposition: valuePropositionInput,
      careerMilestones: careerMilestonesInput,
      tone = "professional",
      length = "standard",
      additionalContext,
      specificRequirements,
    } = body;

    // Validate required fields
    if (!narrativeType) {
      return NextResponse.json(
        {
          success: false,
          error: "Narrative type is required",
        },
        { status: 400 }
      );
    }

    // Get value proposition and career milestones if not provided
    let valueProposition = valuePropositionInput;
    let careerMilestones = careerMilestonesInput;

    if (!valueProposition) {
      const storedValueProp = await getValueProposition();
      if (storedValueProp) {
        valueProposition = storedValueProp;
      }
    }

    if (!careerMilestones || careerMilestones.length === 0) {
      careerMilestones = await getCareerMilestones();
    }

    // Get relevant memories
    const searchResults: any = await searchMemory({
      query: `${narrativeType} ${
        valueProposition?.valueStatement || ""
      } career achievements professional strengths`,
      limit: 5,
      filter: {
        must: [{ key: "payload.tags", match: { value: "achievement" } }],
      },
    });

    console.log(
      "[NARRATIVE_GENERATE] searchResults type:",
      typeof searchResults,
      Array.isArray(searchResults) ? "array" : "object",
      searchResults
    );

    let relevantMemories: ScoredMemoryPoint[] = [];
    if (Array.isArray(searchResults)) {
      relevantMemories = searchResults;
    } else if (searchResults && Array.isArray(searchResults.results)) {
      relevantMemories = searchResults.results;
    }

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
# Narrative Clarity Studio: Generate ${narrativeType.replace(/_/g, " ")}

## Value Proposition
${
  valueProposition
    ? `
- Core Strengths: ${valueProposition.coreStrengths?.join(", ") || "N/A"}
- Unique Skills: ${valueProposition.uniqueSkills?.join(", ") || "N/A"}
- Passions: ${valueProposition.passions?.join(", ") || "N/A"}
- Vision: ${valueProposition.vision || "N/A"}
- Target Audience: ${valueProposition.targetAudience || "N/A"}
- Value Statement: ${valueProposition.valueStatement || "N/A"}
`
    : "No value proposition data available."
}

## Career Milestones
${
  careerMilestones && careerMilestones.length > 0
    ? careerMilestones
        .sort((a, b) => a.order - b.order)
        .map(
          (milestone) => `
### ${milestone.title} ${
            milestone.organization ? `at ${milestone.organization}` : ""
          }
${
  milestone.startDate
    ? `${milestone.startDate} - ${milestone.endDate || "Present"}`
    : ""
}
${milestone.description}

Key achievements:
${milestone.achievements.map((a) => `- ${a}`).join("\\n")}

Skills: ${milestone.skills.join(", ")}
Impact: ${milestone.impact}
`
        )
        .join("\\n")
    : "No career milestone data available."
}

${
  relevantMemories.length > 0
    ? `## Relevant Achievements and Experiences\n${relevantMemories
        .map((m: ScoredMemoryPoint) => `- ${m.payload.text}`)
        .join("\n")}`
    : ""
}

${additionalContext ? `## Additional Context\n${additionalContext}` : ""}

${
  specificRequirements
    ? `## Specific Requirements\n${specificRequirements}`
    : ""
}

## Task
Create a compelling ${narrativeType.replace(
      /_/g,
      " "
    )} with the following characteristics:
1. Tone: ${tone}
2. Length: ${length}
3. Highlight core strengths, unique skills, and key achievements
4. Articulate a clear and compelling narrative that showcases professional identity and value
5. Include a suggested title for this narrative document

Write the complete ${narrativeType.replace(/_/g, " ")} content, ready to use.
`;

    // Generate narrative content using LLM
    let llmContent: string;
    try {
      llmContent = await generateLLMResponse("NARRATIVE_GENERATION", prompt, {
        profileContext: profileData,
        systemContext: "",
        memoryResults: relevantMemories,
        model: "",
        temperature: 0.7,
        maxTokens: 2000,
      });
      console.log("[NARRATIVE_GENERATE] LLM content:", llmContent);
    } catch (err) {
      console.error("[NARRATIVE_GENERATE] LLM error:", err);
      return NextResponse.json(
        {
          success: false,
          error:
            err && typeof err === "object" && "message" in err
              ? (err as any).message
              : "Failed to generate narrative content",
        },
        { status: 500 }
      );
    }
    let content = llmContent;

    // Extract title from content (assuming the LLM includes a title at the beginning)
    let suggestedTitle = "";

    // Try to extract title from the first line if it looks like a title
    const lines = content.split("\n");
    if (
      lines[0] &&
      (lines[0].startsWith("# ") || lines[0].startsWith("Title: "))
    ) {
      suggestedTitle = lines[0].replace(/^# |^Title: /, "").trim();
      // Remove the title line from content
      content = lines.slice(1).join("\n").trim();
    } else {
      // Default title based on narrative type
      suggestedTitle = narrativeType
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    // Create narrative response
    const narrativeResponse: NarrativeGenerationResponse = {
      id: uuidv4(),
      narrativeType,
      content,
      suggestedTitle,
      relevantMemories: relevantMemories.map((m: ScoredMemoryPoint) => ({
        id: m.id,
        text: m.payload.text,
      })),
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      narrative: narrativeResponse,
    });
  } catch (error: any) {
    console.error("Error in narrative/generate route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
