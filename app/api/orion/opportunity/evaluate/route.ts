import { NextRequest, NextResponse } from 'next/server';
import { 
  ORION_MEMORY_COLLECTION_NAME, 
  OPPORTUNITY_EVALUATION_REQUEST_TYPE 
} from '@/lib/orion_config';
import { OpportunityDetails } from '@/types/opportunity';

/**
 * API route for evaluating opportunities
 */
export async function POST(req: NextRequest) {
  try {
    const opportunityDetails: OpportunityDetails = await req.json();
    
    // Validate required fields
    if (!opportunityDetails.title || !opportunityDetails.description || !opportunityDetails.type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required opportunity details: title, description, and type.' 
      }, { status: 400 });
    }
    
    // Fetch Tomide's profile context
    let profileContext = '';
    try {
      const profileResponse = await fetch('/api/orion/profile');
      profileContext = await profileResponse.text();
    } catch (error) {
      console.error('Error fetching profile data:', error);
      profileContext = "Tomide is an analytical systems thinker with a background in law and a strong interest in product management, process improvement, and technology (especially FinTech/LegalTech). Key skills include: Python, TypeScript, Next.js, systems design, LLM integration, data analysis. He aims for roles with growth, stability, low direct coding, and relocation potential to US/CA/UK/EU+. Core values: Freedom, Logic, Growth, Stability, Creation.";
    }
    
    // Fetch relevant past experiences from memory
    let pastExperiencesContext = "No specific past experiences retrieved from memory for this evaluation.";
    try {
      const memorySearchResponse = await fetch('/api/orion/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `Experiences, decisions, or outcomes related to ${opportunityDetails.type} like "${opportunityDetails.title}" or involving skills relevant to this opportunity.`,
          collectionName: ORION_MEMORY_COLLECTION_NAME,
          limit: 5
        })
      });
      
      const memoryData = await memorySearchResponse.json();
      
      if (memoryData.success && memoryData.results && memoryData.results.length > 0) {
        pastExperiencesContext = "Relevant Past Experiences/Reflections from Memory:\n" + 
          memoryData.results.map((item: any, i: number) => 
            `${i+1}. (Source: ${item.payload.source_id}, Type: ${item.payload.type}): "${item.payload.text.substring(0, 200)}..."`
          ).join("\n");
      }
    } catch (error) {
      console.error('Error fetching relevant memories:', error);
    }
    
    // Construct prompt for LLM
    const evaluationPrompt = `
# Opportunity Evaluation Task

You are Orion, an AI Life-Architecture System. Your task is to evaluate the following opportunity against Tomide's profile, goals, and past experiences.

## Tomide's Profile & Goals:
${profileContext}

## Relevant Past Experiences:
${pastExperiencesContext}

## Opportunity Details:
Title: ${opportunityDetails.title}
Type: ${opportunityDetails.type}
${opportunityDetails.url ? `URL: ${opportunityDetails.url}` : ''}
Description:
"""
${opportunityDetails.description}
"""

## Evaluation Instructions:
Please provide a structured evaluation in JSON format with the following fields:

1. "fitScorePercentage": An estimated percentage (0-100) of how well Tomide's profile, skills, and goals align with this opportunity.
2. "alignmentHighlights": An array of strings listing key points of strong alignment.
3. "gapAnalysis": An array of strings identifying potential gaps, missing qualifications, or areas of concern.
4. "riskRewardAnalysis": An object with optional keys ("highRiskHighReward", "lowRiskHighReward", "highRiskLowReward", "lowRiskLowReward"), each containing a string explaining aspects of the opportunity falling into that category.
5. "recommendation": Your overall recommendation string ('Pursue', 'Delay & Prepare', 'Reject', 'Consider Further').
6. "reasoning": A concise paragraph explaining the rationale behind your recommendation and fit score.
7. "suggestedNextSteps": An array of 2-3 concrete, actionable next steps Tomide could take based on the recommendation.

Analyze thoroughly, referencing Tomide's desire for growth, stability, low-direct-coding (for job roles), relocation potential, and ROI (for education/career). Be realistic and strategic.

## Output Format:
Provide your evaluation as a valid JSON object with the structure described above. Do not include any additional text or explanations outside the JSON object.
`;
    
    // Call LLM for evaluation
    const llmResponse = await fetch('/api/orion/llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requestType: OPPORTUNITY_EVALUATION_REQUEST_TYPE,
        primaryContext: evaluationPrompt,
        temperature: 0.3,
        maxTokens: 2000
      })
    });
    
    const llmData = await llmResponse.json();
    
    if (!llmData.success || !llmData.content) {
      throw new Error(llmData.error || 'Failed to generate opportunity evaluation');
    }
    
    try {
      // Try to parse the LLM response as JSON
      let jsonString = llmData.content;
      
      // Handle cases where the LLM might wrap the JSON in markdown code blocks
      if (jsonString.includes('```json')) {
        jsonString = jsonString.substring(
          jsonString.indexOf('```json') + 7, 
          jsonString.lastIndexOf('```')
        ).trim();
      } else if (jsonString.includes('```')) {
        jsonString = jsonString.substring(
          jsonString.indexOf('```') + 3, 
          jsonString.lastIndexOf('```')
        ).trim();
      }
      
      const evaluation = JSON.parse(jsonString);
      return NextResponse.json({ success: true, evaluation });
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON:', llmData.content);
      // Return the raw output if parsing fails
      return NextResponse.json({ 
        success: true, 
        evaluation: { rawOutput: llmData.content }, 
        warning: "LLM output was not valid JSON, returning raw text." 
      });
    }
    
  } catch (error: any) {
    console.error('Error in POST /api/orion/opportunity/evaluate:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}