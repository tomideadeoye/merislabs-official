import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import type {
  DraftApplicationRequestBody,
  DraftApplicationResponseBody
} from '@/types/opportunity';
import { DRAFT_APPLICATION_REQUEST_TYPE } from '@/lib/orion_config';

// Enhanced system prompt for draft application generation
const SYSTEM_PROMPT_DRAFT_APPLICATION = `
You are a world-class career strategist and communication expert who specializes in crafting compelling, high-impact application materials that get results. Your expertise lies in translating a candidate's unique value proposition into persuasive narratives that resonate deeply with hiring managers and selection committees.

Your strengths include:
1. Adapting tone and style to match company culture (formal for traditional industries, dynamic for startups)
2. Highlighting strategic alignment between candidate strengths and organization needs
3. Addressing potential gaps or concerns with confident framing
4. Using subtle psychological principles of persuasion (scarcity, social proof, authority)
5. Creating distinctive variations that approach the opportunity from different angles

You craft materials that are authentic, specific, achievement-oriented, and that demonstrate genuine enthusiasm without resorting to clichés or generic language.`;

/**
 * Construct the enhanced user prompt for the LLM
 */
function constructUserPrompt(data: DraftApplicationRequestBody): string {
  const { opportunity, applicantProfile, evaluationSummary, memorySnippets } = data;
  const numberOfDrafts = data.numberOfDrafts || 2;

  // Determine company tone/culture based on available information
  let companyTone = "professional";
  const companyLower = opportunity.company.toLowerCase();
  const descriptionLower = opportunity.description.toLowerCase();
  
  if (
    companyLower.includes("startup") || 
    descriptionLower.includes("startup") ||
    descriptionLower.includes("fast-paced") ||
    descriptionLower.includes("innovative") ||
    descriptionLower.includes("disrupt")
  ) {
    companyTone = "dynamic and innovative";
  } else if (
    companyLower.includes("consult") ||
    companyLower.includes("bank") ||
    companyLower.includes("law") ||
    companyLower.includes("firm") ||
    descriptionLower.includes("established") ||
    descriptionLower.includes("leading")
  ) {
    companyTone = "formal and established";
  }

  // Process memory snippets with better formatting
  let memoryContext = "N/A";
  if (memorySnippets && memorySnippets.length > 0) {
    memoryContext = memorySnippets
      .map((m, i) => {
        const dateInfo = m.date ? `(${m.date})` : "";
        const tagInfo = m.tags && m.tags.length > 0 ? `[Tags: ${m.tags.join(', ')}]` : "";
        return `- Relevant Experience ${i+1} ${dateInfo} ${tagInfo}:\n  "${m.content.substring(0, 200)}..."`;
      })
      .join("\n\n");
  }

  // Extract key requirements from job description
  const keyRequirements = opportunity.description
    .split(/\n|\./)
    .filter(line => 
      line.toLowerCase().includes("require") || 
      line.toLowerCase().includes("qualif") ||
      line.toLowerCase().includes("skill") ||
      line.toLowerCase().includes("experience") ||
      line.toLowerCase().includes("looking for")
    )
    .slice(0, 5)
    .map(line => line.trim())
    .filter(line => line.length > 20)
    .join("\n- ");

  return `
I need you to craft ${numberOfDrafts} distinct, highly effective application materials (cover letter or application email) for the following opportunity. Each draft should be unique in approach while maintaining excellence in persuasion and relevance.

## OPPORTUNITY CONTEXT
- Position: ${opportunity.title}
- Organization: ${opportunity.company} (appears to have a ${companyTone} culture)
- Key Requirements:
- ${keyRequirements || opportunity.description.substring(0, 300) + "..."}
${opportunity.tags && opportunity.tags.length > 0 ? `- Tags/Keywords: ${opportunity.tags.join(", ")}` : ""}

## APPLICANT PROFILE
- Name: ${applicantProfile.name}
- Professional Summary: ${applicantProfile.backgroundSummary}
- Core Strengths: ${applicantProfile.keySkills.join(", ")}
- Career Objectives: ${applicantProfile.goals}
${applicantProfile.location ? `- Location: ${applicantProfile.location}` : ""}
${applicantProfile.values && applicantProfile.values.length > 0 ? `- Values to Convey: ${applicantProfile.values.join(", ")}` : ""}

## STRATEGIC INSIGHTS
${evaluationSummary?.fitScorePercentage ? `- Opportunity Fit Score: ${evaluationSummary.fitScorePercentage}%` : ""}
${evaluationSummary?.alignmentHighlights && evaluationSummary.alignmentHighlights.length > 0 ? 
`- Key Alignment Points to Emphasize:
  * ${evaluationSummary.alignmentHighlights.join("\n  * ")}` : ""}
${evaluationSummary?.gapAnalysis && evaluationSummary.gapAnalysis.length > 0 ? 
`- Potential Gaps to Address:
  * ${evaluationSummary.gapAnalysis.join("\n  * ")}` : ""}
${evaluationSummary?.suggestedNextSteps && evaluationSummary.suggestedNextSteps.length > 0 ? 
`- Strategic Next Steps:
  * ${evaluationSummary.suggestedNextSteps.join("\n  * ")}` : ""}

## RELEVANT EXPERIENCES
${memoryContext}

## DRAFTING INSTRUCTIONS
1. Create ${numberOfDrafts} distinct application drafts (300 words max each)
2. For Draft 1: Focus on direct alignment between experience and requirements
3. For Draft 2: Emphasize unique value and forward-looking impact
${numberOfDrafts > 2 ? "4. For Draft 3: Highlight problem-solving abilities and specific achievements" : ""}

Each draft should:
- Begin with a compelling hook that shows specific knowledge of the organization
- Clearly state the position being applied for
- Demonstrate understanding of the organization's needs and how the applicant fulfills them
- Address any potential concerns identified in the gap analysis (if provided)
- Include a confident, forward-looking closing with clear next steps
- Maintain a ${companyTone} tone appropriate for the organization

Format each draft with "Draft 1:", "Draft 2:", etc. at the beginning. Return ONLY the drafts without any additional commentary.
`;
}

/**
 * Parse LLM output into an array of drafts
 */
function parseDraftsFromLLMResponse(llmContent: string): string[] {
  if (!llmContent) return [];
  
  // This regex looks for "Draft X:" or "Draft #X" or just "X." or "X)" at the start of a line
  const drafts = llmContent.split(/^(?:Draft\s*#?\d+:?|\d+[.)])/im);
  
  return drafts
    .map(draft => draft.trim())
    .filter(draft => draft.length > 50); // Filter out empty/very short splits
}

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const requestBody: DraftApplicationRequestBody = await request.json();

    // Basic validation
    if (!requestBody.opportunity || !requestBody.applicantProfile) {
      return NextResponse.json({ 
        success: false, 
        error: "Opportunity and applicantProfile are required." 
      }, { status: 400 });
    }

    const userPrompt = constructUserPrompt(requestBody);

    // Call the LLM API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/orion/llm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: DRAFT_APPLICATION_REQUEST_TYPE,
        primaryContext: userPrompt,
        system_prompt_override: SYSTEM_PROMPT_DRAFT_APPLICATION,
        temperature: 0.7, // Slightly increased for more creative variations
        maxTokens: 1500
      })
    });

    const llmResponseData = await response.json();

    if (!llmResponseData.success || !llmResponseData.content) {
      throw new Error(llmResponseData.error || "LLM failed to generate application drafts.");
    }

    const drafts = parseDraftsFromLLMResponse(llmResponseData.content);

    if (drafts.length === 0) {
      console.warn("[DRAFT_APP_API] LLM output parsing yielded no drafts. Raw output:", llmResponseData.content);
      
      // Return the raw content if parsing fails
      return NextResponse.json({ 
        success: true,
        drafts: [llmResponseData.content],
        warning: "Could not parse distinct drafts from LLM output. Raw output provided.",
        modelUsed: llmResponseData.model
      });
    }
    
    const responsePayload: DraftApplicationResponseBody = {
      success: true,
      drafts: drafts,
      modelUsed: llmResponseData.model
    };
    
    return NextResponse.json(responsePayload);

  } catch (error: any) {
    console.error('[DRAFT_APP_API_ERROR]', error);
    
    const responsePayload: DraftApplicationResponseBody = {
      success: false,
      error: 'Failed to generate application drafts.',
      details: error.message
    };
    
    return NextResponse.json(responsePayload, { status: 500 });
  }
}