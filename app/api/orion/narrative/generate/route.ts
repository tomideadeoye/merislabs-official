import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { getCareerMilestones, getValueProposition } from '@/lib/narrative_service';
import {
  NarrativeGenerationRequest,
  NarrativeGenerationResponse,
  ScoredMemoryPoint,
  UserProfileData,
  SearchMemoryResponse,
  CareerMilestone,
  CombinedLLMResponse,
  UserProfileFetchResponse,
} from '@/lib/types';
import { searchMemory } from '@/lib/orion_memory';
import { fetchUserProfile } from '@/lib/profile_service';
import { generateLLMResponse } from '@/lib/orion_llm';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:

/**
 * API route for generating narrative content
 */
export async function POST(req: NextRequest): Promise<NextResponse<NarrativeGenerationResponse>> {
  let llmContent: string = ''; // Initialize to prevent "used before assigned"
  try {
    const body = (await req.json()) as NarrativeGenerationRequest;
    const {
      narrativeType,
      valueProposition: valuePropositionInput,
      careerMilestones: careerMilestonesInput,
      tone = 'professional',
      length = 'standard',
      additionalContext,
      specificRequirements,
    } = body;

    // Validate required fields
    if (!narrativeType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Narrative type is required',
          message: 'Narrative type is required',
          generatedNarrative: '', // Ensure all properties are present for the return type
        },
        { status: 400 }
      );
    }

    // Get value proposition and career milestones if not provided
    let valueProposition = valuePropositionInput;
    let careerMilestones = careerMilestonesInput;

    if (!valueProposition) {
      try {
        const storedValueProp = await getValueProposition();
        if (storedValueProp) {
          valueProposition = storedValueProp;
        }
      } catch (error: unknown) {
        console.error('[NARRATIVE_GENERATE] Error fetching value proposition:', error);
        // Continue without value proposition if there's an error
      }
    }

    if (!careerMilestones || careerMilestones.length === 0) {
      try {
        careerMilestones = await getCareerMilestones();
      } catch (error: unknown) {
        console.error('[NARRATIVE_GENERATE] Error fetching career milestones:', error);
        // Continue without career milestones if there's an error
      }
    }

    // Get relevant memories
    const queryText = `${narrativeType} ${valueProposition?.valueStatement || ''} career achievements professional strengths`;
    const searchOptions = {
      limit: 5,
      filter: {
        must: [{ key: 'payload.tags', match: { value: 'achievement' } }],
      },
    };

    let relevantMemories: ScoredMemoryPoint[] = [];
    try {
      const searchResponse: SearchMemoryResponse = await searchMemory(queryText, searchOptions);

      console.log('[NARRATIVE_GENERATE] searchResponse details:', searchResponse);

      if (searchResponse.success && searchResponse.results) {
        relevantMemories = searchResponse.results;
      }
    } catch (error: unknown) {
      console.error('[NARRATIVE_GENERATE] Error searching memories:', error);
      // Continue without relevant memories if there's an error
    }

    // Get profile data
    let profileData: UserProfileData | null = null;
    try {
      const rawProfileFetchResult: UserProfileFetchResponse = await fetchUserProfile();
      if (rawProfileFetchResult.success && rawProfileFetchResult.profile) {
        profileData = rawProfileFetchResult.profile;
      }
    } catch (error: unknown) {
      console.error('Error fetching profile data:', error);
    }

    // Construct prompt for LLM
    const prompt = `
# Narrative Clarity Studio: Generate ${narrativeType.replace(/_/g, ' ')}

## Value Proposition
${
  valueProposition
    ? `
- Core Strengths: ${valueProposition.coreStrengths?.join(', ') || 'N/A'}
- Unique Skills: ${valueProposition.uniqueSkills?.join(', ') || 'N/A'}
- Passions: ${valueProposition.passions?.join(', ') || 'N/A'}
- Vision: ${valueProposition.vision || 'N/A'}
- Target Audience: ${valueProposition.targetAudience || 'N/A'}
- Value Statement: ${valueProposition.valueStatement || 'N/A'}
`
    : 'No value proposition data available.'
}

## Career Milestones
${
  careerMilestones && careerMilestones.length > 0
    ? careerMilestones
        .sort((a: CareerMilestone, b: CareerMilestone) => (a.order ?? 0) - (b.order ?? 0))
        .map(
          (milestone: CareerMilestone) => `
### ${milestone.title} ${milestone.organization ? `at ${milestone.organization}` : ''}
${milestone.startDate ? `${milestone.startDate} - ${milestone.endDate || 'Present'}` : ''}
${milestone.description || ''}

Key achievements:
${milestone.achievements.map((achievement: string) => `- ${achievement}`).join('\n')}

Skills: ${milestone.skills?.join(', ') || 'N/A'}
Impact: ${milestone.impact || 'N/A'}
`
        )
        .join('\n')
    : 'No career milestone data available.'
}

${
  relevantMemories.length > 0
    ? `## Relevant Achievements and Experiences\n${relevantMemories
        .map((m: ScoredMemoryPoint) => `- ${m.payload.text}`)
        .join('\n')}`
    : ''
}

${additionalContext ? `## Additional Context\n${additionalContext}` : ''}

${specificRequirements ? `## Specific Requirements\n${specificRequirements}` : ''}

## Task
Create a compelling ${narrativeType.replace(/_/g, ' ')} with the following characteristics:
1. Tone: ${tone}
2. Length: ${length}
3. Highlight core strengths, unique skills, and key achievements
4. Articulate a clear and compelling narrative that showcases professional identity and value
5. Include a suggested title for this narrative document

Write the complete ${narrativeType.replace(/_/g, ' ')} content, ready to use.
`;

    // Generate narrative content using LLM
    let llmResponse: CombinedLLMResponse;
    try {
      llmResponse = await generateLLMResponse('NARRATIVE_GENERATION', prompt, null, {
        profileContext: profileData?.profileText || '',
        systemContext: '',
        memoryResults: relevantMemories,
        model: '',
        temperature: 0.7,
        maxTokens: 2000,
      });

      if (!llmResponse.success) {
        throw new Error(llmResponse.error || 'LLM call failed');
      }
      llmContent = llmResponse.content;
      console.log('[NARRATIVE_GENERATE] LLM content:', llmContent);
    } catch (err: unknown) {
      console.error('[NARRATIVE_GENERATE] LLM error:', err);
      return NextResponse.json(
        {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to generate narrative content',
          message: 'Failed to generate narrative content',
          generatedNarrative: '', // Ensure all properties are present
        },
        { status: 500 }
      );
    }

    // Extract title from content (assuming the LLM includes a title at the beginning)
    let suggestedTitle = '';

    // Try to extract title from the first line if it looks like a title
    const lines = llmContent.split('\n');
    if (lines[0] && (lines[0].startsWith('# ') || lines[0].startsWith('Title: '))) {
      suggestedTitle = lines[0].replace(/^# |^Title: /, '').trim();
    } else {
      // Default title based on narrative type
      suggestedTitle = narrativeType
        .replace(/_/g, ' ')
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    // Create narrative response
    const narrativeResponse: NarrativeGenerationResponse = {
      id: uuidv4(),
      generatedNarrative: llmContent,
      metadata: {
        narrativeType,
        tone,
        length,
        suggestedTitle,
        additionalContext,
        specificRequirements,
      },
      success: true, // Mark as success if reached here
      message: 'Narrative generated successfully',
    };

    return NextResponse.json(narrativeResponse);
  } catch (error: unknown) {
    console.error('Error in narrative/generate route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        generatedNarrative: '', // Ensure all properties are present
      },
      { status: 500 }
    );
  }
}
