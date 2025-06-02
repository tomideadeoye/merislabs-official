import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import { fetchOpportunityByIdFromNotion } from '@/lib/notion_service';
// Assuming profile data and web context are accessible server-side, maybe from a service or context
// import { getUserProfile } from '@/lib/user_service'; // Placeholder
// import { getWebResearchContext } from '@/lib/opportunity_service'; // Placeholder
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { EvaluationOutput } from '@/types/opportunity';

export async function POST(
  request: NextRequest,
  { params }: { params: { opportunityId: string } }
) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const opportunityId = params.opportunityId;

  if (!opportunityId) {
    return NextResponse.json({ success: false, error: 'Opportunity ID is required.' }, { status: 400 });
  }

  try {
    // Fetch opportunity details
    const opportunityResult = await fetchOpportunityByIdFromNotion(opportunityId);

    // Refined check for successful opportunity fetch
    if (!opportunityResult || !opportunityResult.success) {
      // Safely access error message when success is false
      const errorMsg = opportunityResult && opportunityResult.success === false ? opportunityResult.error : 'Failed to fetch opportunity details from Notion.';
      return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
    }

    const opportunity = opportunityResult.opportunity; // Now TypeScript should know opportunity exists

    // TODO: Fetch user profile data server-side
    const profileData = "User profile data placeholder"; // Replace with actual fetch

    // Integrate web research by calling the new proxy API route
    let webResearchContext = "";
    try {
        const searchResponse = await fetch(`${request.nextUrl.origin}/api/orion/research`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include necessary headers, e.g., Authorization if the internal API is protected
                 // 'Authorization': request.headers.get('Authorization'), // Pass down user's auth
            },
            // Construct the query for the Python backend based on the opportunity
            body: JSON.stringify({
                query: `${opportunity.title} ${opportunity.company} company overview, mission, values, recent news`,
                type: 'web', // Specify web search
                count: 5, // Request top 5 results
            }),
        });

        if (!searchResponse.ok) {
             console.error('[EVAL_API] Failed to call internal research proxy:', searchResponse.status, searchResponse.statusText);
             // Decide how to handle this error: either stop or continue without web context
             // For now, we'll log and continue with empty context
        } else {
            const searchData = await searchResponse.json();
            if (searchData.success && searchData.results) {
                 // Format the search results into a string context for the LLM
                 webResearchContext = searchData.results.map((result: any, index: number) =>
                    `Source ${index + 1}: ${result.url || 'N/A'}\nTitle: ${result.title || 'N/A'}\nSnippet: ${result.snippet || 'No snippet'}`
                 ).join('\n\n---\n\n');
                 console.log('[EVAL_API] Successfully fetched web research context.');
            } else {
                console.warn('[EVAL_API] Research proxy returned success: false or no results.', searchData);
            }
        }

    } catch (researchError: any) {
        console.error('[EVAL_API] Error calling internal research proxy:', researchError);
        // Continue with empty context
    }

    // Construct the prompt for LLM evaluation
    const evaluationPrompt = `
Evaluate the following job opportunity against the provided user profile.\n\nJob Title: ${opportunity.title}\nCompany: ${opportunity.company}\n\nJob Description:\n${opportunity.description || 'No description provided.'}\n\nUser Profile:\n${profileData}\n\nWeb Research Context (if available and relevant):\n${webResearchContext || 'No relevant web research context found.'}\n\nProvide a detailed evaluation, including:\n1. A Fit Score (0-100%).\n2. A concise Recommendation (e.g., Strong Fit, Moderate Fit, Limited Fit).\n3. Key Pros: What makes this a good fit based on the profile and JD?\n4. Key Cons: What are the potential challenges or gaps?\n5. Missing Skills/Experience: Specific areas where the profile may be lacking based on the JD.\n6. A brief explanation for the overall score.\n\nFormat the output as a JSON object with the following keys: fitScorePercentage (number), recommendation (string), pros (string[]), cons (string[]), missingSkills (string[]), scoreExplanation (string).\n`;

    const llmResponse = await generateLLMResponse(
      REQUEST_TYPES.OPPORTUNITY_EVALUATION,
      evaluationPrompt,
      // Consider passing profileContext and system_prompt_override if needed
      // { profileContext: profileData, system_prompt_override: "You are an expert career evaluator..." }
    );

    if (!llmResponse.success || !llmResponse.content) {
      return NextResponse.json({ success: false, error: llmResponse.error || 'LLM failed to generate evaluation.' }, { status: 500 });
    }

    // Attempt to parse the LLM response as JSON
    let evaluation: EvaluationOutput;
    try {
      evaluation = JSON.parse(llmResponse.content) as EvaluationOutput;
      // Basic validation to ensure parsed object matches expected structure
      if (typeof evaluation.fitScorePercentage !== 'number' || typeof evaluation.recommendation !== 'string') {
           throw new Error('Parsed evaluation data has incorrect structure.');
      }

    } catch (parseError: any) {
      console.error('Failed to parse LLM evaluation response:', llmResponse.content, parseError);
      // Return the raw content if parsing fails, or a specific error
      return NextResponse.json({
        success: false,
        error: 'Failed to parse LLM evaluation response.',
        rawContent: llmResponse.content // Provide raw content for debugging
      }, { status: 500 });
    }

    // TODO: Optionally save the evaluation results, e.g., to Notion or memory

    return NextResponse.json({ success: true, evaluation });
  } catch (error: any) {
    console.error('Error in POST /api/orion/opportunity/[opportunityId]/evaluation:', error);
    return NextResponse.json({ success: false, error: error.message || 'An unexpected error occurred during evaluation.' }, { status: 500 });
  }
}
