/**
 * FILEPATH: `app/api/orion/opportunity/draft-application/route.ts`
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides the API endpoint for generating tailored application drafts (cover letters or emails) for a given opportunity.
 *   - Integrates with an internal LLM service (`/api/orion/llm`) to generate persuasive and relevant content based on opportunity details, applicant profile, and memory snippets.
 *   - Dynamically adapts the tone and style of the generated drafts based on inferred company culture.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/drafts/page.tsx`: This frontend page likely consumes this API to trigger and display application draft generation.
 *   - `@/auth`: Used for `getServerSession` to authenticate the user before processing the request.
 *   - `@/lib/types`: Defines `DraftApplicationRequestBody`, `DraftApplicationResponseBody`, `OrionOpportunity`, `UserProfileData`, `EvaluationOutput`, and `ScoredMemoryPoint` for request/response payloads and data structures.
 *   - `@/lib/index` (implicitly `DRAFT_APPLICATION_REQUEST_TYPE`): Defines constants for LLM request types.
 *   - `/api/orion/llm`: The internal LLM API endpoint this route calls to perform the actual text generation.
 *   - `@/lib/logger.ts`: Although direct `console` calls are used, future integration with this centralized logger is intended for consistent and context-rich logging.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `process.env.NEXTAUTH_URL` is correctly configured for internal API calls.
 *   - The `SYSTEM_PROMPT_DRAFT_APPLICATION` is a critical part of the LLM's instruction set, providing the persona and guidelines for generating high-quality drafts.
 *   - Handles cases where `orionOpportunity.company` or `orionOpportunity.content` might be `null` or `undefined` gracefully.
 *   - Includes basic parsing logic (`parseDraftsFromLLMResponse`) to extract distinct drafts from the LLM's raw output.
 *
 * NOTES:
 *   - This API is a core component of Orion's automation and opportunity management features, significantly streamlining the application process.
 *   - The prompt construction is highly dynamic, incorporating various pieces of contextual information to produce personalized outputs.
 *   - Future improvements could involve more sophisticated LLM parsing, A/B testing of prompt variations, and integrating more advanced feedback loops for draft quality.
 *   - Consider integrating the lib `logger` utility for all console output for unified logging and enhanced observability.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth';
import { DRAFT_APPLICATION_REQUEST_TYPE } from '@/lib';
import { DraftApplicationRequestBody, DraftApplicationResponseBody } from '@/styles';
import { Session as NextAuthSession } from 'next-auth';

interface CustomSession extends NextAuthSession {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

// Enhanced system prompt for draft application generation
const SYSTEM_PROMPT_DRAFT_APPLICATION = `
You are a world-class career strategist and communication expert who specializes in crafting compelling, high-impact application materials that get results. Your expertise lies in translating a candidate's unique value proposition into persuasive narratives that resonate deeply with hiring managers and selection committees.

Your strengths include:
1. Adapting tone and style to match company culture (formal for traditional industries, dynamic for startups)
2. Highlighting strategic alignment between candidate strengths and organization needs
3. Addressing potential gaps or concerns with confident framing
4. Using subtle psychological principles of persuasion (scarcity, social proof, authority)
5. Creating distinctive variations that approach the OrionOpportunity from different angles

When addressing a potential skill gap (e.g., primary programming language), frame it positively by emphasizing rapid learnability, complementary skills, or the value of a diverse technical perspective. Reference past instances of quick learning or adaptability if available in the applicant's profile or memories.

Always include specific achievements with measurable outcomes when available in the profile data. Weave in the applicant's core values when they align with the company culture or role requirements.

You craft materials that are authentic, specific, achievement-oriented, and that demonstrate genuine enthusiasm without resorting to clichés or generic language.`;

function constructUserPrompt(data: DraftApplicationRequestBody): string {
  const { orionOpportunity, applicantProfile, evaluationSummary, memorySnippets } = data;
  const numberOfDrafts = data.numberOfDrafts || 2;

  // Determine company tone/culture based on available information
  let companyTone = 'professional';
  const companyLower = orionOpportunity.company?.toLowerCase() || '';
  const contentLower = orionOpportunity.content?.toLowerCase() || '';

  if (
    companyLower.includes('startup') ||
    contentLower.includes('startup') ||
    contentLower.includes('fast-paced') ||
    contentLower.includes('innovative') ||
    contentLower.includes('disrupt')
  ) {
    companyTone = 'dynamic and innovative';
  } else if (
    companyLower.includes('consult') ||
    companyLower.includes('bank') ||
    companyLower.includes('law') ||
    companyLower.includes('firm') ||
    contentLower.includes('established') ||
    contentLower.includes('leading')
  ) {
    companyTone = 'formal and established';
  }

  // Process memory snippets with better formatting
  let memoryContext = 'N/A';
  if (memorySnippets && memorySnippets.length > 0) {
    memoryContext = memorySnippets
      .map((m, i) => {
        const dateInfo = m.payload.timestamp ? `(${new Date(m.payload.timestamp).toLocaleDateString()})` : '';
        const tagInfo = m.payload.tags && m.payload.tags.length > 0 ? `[Tags: ${m.payload.tags.join(', ')}]` : '';
        return `- Relevant Experience ${i + 1} ${dateInfo} ${tagInfo}:\n  "${m.payload.text.substring(0, 200)}..."`;
      })
      .join('\n\n');
  }

  // Extract key requirements from job description
  const keyRequirements = orionOpportunity.content
    ?.split(/\n|\./)
    .filter(
      (line: string) =>
        line.toLowerCase().includes('require') ||
        line.toLowerCase().includes('qualif') ||
        line.toLowerCase().includes('skill') ||
        line.toLowerCase().includes('experience') ||
        line.toLowerCase().includes('looking for')
    )
    .slice(0, 5)
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 20)
    .join('\n- ');

  return `
I need you to craft ${numberOfDrafts} distinct, highly effective application materials (cover letter or application email) for the following OrionOpportunity. Each draft should take a fundamentally different approach while maintaining excellence in persuasion and relevance.

## Opportunity CONTEXT
- Position: ${orionOpportunity.title}
- Organization: ${orionOpportunity.company} (appears to have a ${companyTone} culture)
- Key Requirements:
- ${keyRequirements || orionOpportunity.content?.substring(0, 300) + '...'}
${
  orionOpportunity.tags && orionOpportunity.tags.length > 0
    ? `- Tags/Keywords: ${orionOpportunity.tags.join(', ')}`
    : ''
}

## APPLICANT PROFILE
- Name: ${applicantProfile.name}
- Professional Summary: ${applicantProfile.backgroundSummary}
- Core Strengths: ${(applicantProfile.keySkills || []).join(', ')}
- Career Objectives: ${applicantProfile.goals}
${applicantProfile.location ? `- Location: ${applicantProfile.location}` : ''}
${
  applicantProfile.values && applicantProfile.values.length > 0
    ? `- Values to Convey: ${applicantProfile.values.join(', ')}`
    : ''
}

## STRATEGIC INSIGHTS
${evaluationSummary?.fitScorePercentage ? `- OrionOpportunity Fit Score: ${evaluationSummary.fitScorePercentage}%` : ''}
${
  evaluationSummary?.strengths && evaluationSummary.strengths.length > 0
    ? `- Key Strengths Identified:
  * ${evaluationSummary.strengths.map((s) => (typeof s === 'string' ? s : `${s.title}: ${s.reasoning}`)).join('\n  * ')}`
    : ''
}
${
  evaluationSummary?.gaps && evaluationSummary.gaps.length > 0
    ? `- Potential Gaps to Address:
  * ${evaluationSummary.gaps.map((g) => (typeof g === 'string' ? g : `${g.gap}: ${g.solution}`)).join('\n  * ')}`
    : ''
}
${
  evaluationSummary?.suggestedNextSteps && evaluationSummary.suggestedNextSteps.length > 0
    ? `- Strategic Next Steps:
  * ${evaluationSummary.suggestedNextSteps.join('\n  * ')}`
    : ''
}
## APPLICANT BACKGROUND & MEMORIES
## RELEVANT EXPERIENCES
${memoryContext}

## COMPANY RESEARCH
Research the company to incorporate specific details about their products, recent news, or company values that demonstrate genuine interest and thorough preparation.

## DRAFTING INSTRUCTIONS
1. Create ${numberOfDrafts} distinct application drafts (300 words max each)
2. For Draft 1: Focus on direct alignment with requirements, emphasizing transferable skills and how existing experience directly meets the job's core needs. Include specific achievements with measurable outcomes when possible.
3. For Draft 2: Emphasize unique value, strategic thinking, and forward-looking impact. How can this applicant bring a unique perspective or contribute to the company's broader goals beyond the immediate tasks?
${
  numberOfDrafts > 2
    ? "4. For Draft 3: Highlight problem-solving abilities and concrete achievements. Use a STAR-like approach (Situation, Task, Action, Result) if memory snippets or profile data provide such examples related to the role's challenges."
    : ''
}

Each draft should:
- Begin with a compelling hook that shows specific knowledge of the organization
- Clearly state the position being applied for
- Demonstrate understanding of the organization's needs and how the applicant fulfills them
- Address any potential skill gaps with confident framing, emphasizing complementary skills, rapid learning ability, or the value of diverse perspectives
- Include specific achievements with measurable outcomes when available
- Incorporate the applicant's relevant values when they align with company culture
- Include a confident, forward-looking closing with clear next steps
- Maintain a ${companyTone} tone appropriate for the organization

Format each draft with "Draft 1:", "Draft 2:", etc. at the beginning. Return ONLY the drafts without any additional commentary.
`;
}

function parseDraftsFromLLMResponse(llmContent: string): string {
  if (!llmContent) return '';

  const drafts = llmContent.split(/^(?:Draft\s*#?\d+:?|\d+[.)])/im);

  return drafts
    .map((draft) => draft.trim())
    .filter((draft) => draft.length > 50)
    .join('\n\n');
}

export async function POST(request: NextRequest) {
  // Check authentication
  const session: CustomSession | null = await getServerSession(authConfig);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized', message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const requestBody: DraftApplicationRequestBody = await request.json();

    if (!requestBody.orionOpportunity || !requestBody.applicantProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'OrionOpportunity and applicantProfile are required.',
          message: 'OrionOpportunity and applicantProfile are required.',
        },
        { status: 400 }
      );
    }

    const userPrompt = constructUserPrompt(requestBody);

    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/orion/llm`, {
      method: 'POST', // Ensure method is POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestType: DRAFT_APPLICATION_REQUEST_TYPE,
        primaryContext: userPrompt,
        system_prompt_override: SYSTEM_PROMPT_DRAFT_APPLICATION,
        temperature: 0.7, // Use a reasonable temperature
        maxTokens: 1500,
      }),
    });

    const llmResponseData = await response.json();

    if (!llmResponseData.success || !llmResponseData.content) {
      throw new Error(llmResponseData.error || 'LLM failed to generate application drafts.');
    }

    const drafts = parseDraftsFromLLMResponse(llmResponseData.content);

    if (!drafts) {
      console.warn(
        '[DRAFT_APP_API] LLM output parsing yielded no distinct drafts. Raw output:',
        llmResponseData.content
      );

      return NextResponse.json({
        success: true,
        drafts: [llmResponseData.content],
        warning: 'Could not parse distinct drafts from LLM output. Raw output provided.',
        modelUsed: llmResponseData.model,
        message: 'Could not parse distinct drafts from LLM output. Raw output provided.',
      });
    }

    const responsePayload: DraftApplicationResponseBody = {
      success: true,
      drafts: [drafts], // Assuming drafts is a single string containing all parsed drafts
      modelUsed: llmResponseData.model,
      message: 'Application drafts generated successfully.',
    };

    return NextResponse.json(responsePayload);
  } catch (error: unknown) {
    console.error('[DRAFT_APP_API_ERROR]', error);

    const responsePayload: DraftApplicationResponseBody = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate application drafts.',
      details: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to generate application drafts.',
    };

    return NextResponse.json(responsePayload, { status: 500 });
  }
}
