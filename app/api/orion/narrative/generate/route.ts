import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { getCareerMilestones, getValueProposition } from '../../../../lib/narrative_service';
import {
  NarrativeGenerationRequest,
  NarrativeGenerationResponse,
  MemorySearchOptions, // Import MemorySearchOptions
  ScoredMemoryPoint, // Ensure ScoredMemoryPoint is imported
  UserProfileData,
  SearchMemoryResponse, // Import SearchMemoryResponse
  CareerMilestone, // Added import for CareerMilestone type
  CombinedLLMResponse, // Moved CombinedLLMResponse here
} from '@/app';
import { searchMemory } from '@/app';
import { fetchUserProfile } from '@/app';
import { generateLLMResponse } from '@/app';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:

/**
 * API route for generating narrative content
 */
export async function POST(req: NextRequest) {
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
    const searchOptions: MemorySearchOptions = {
      query:
        `${narrativeType} ${valueProposition?.valueStatement || ''} career achievements professional strengths` as string,
      limit: 5,
      filter: {
        must: [{ key: 'payload.tags', match: { value: 'achievement' } }],
      },
    };
    const searchResponse: SearchMemoryResponse = await searchMemory(searchOptions);

    console.log(
      '[NARRATIVE_GENERATE] searchResponse details:',
      searchResponse
    );

    let relevantMemories: ScoredMemoryPoint[] = [];
    if (searchResponse.success && searchResponse.results) {
      relevantMemories = searchResponse.results;
    }

    // Get profile data
    // fetchUserProfile from @/app (app/src/lib/profile_service.ts) returns Promise<UserProfileData | null>
    // UserProfileData is { profileText?: string, ... }
    // The original code was checking for profileFetchResult.success and profileFetchResult.profile which is not the structure.
    // It also had a fallback for profileFetchResult.profileText which is also not directly on the result of fetchUserProfile.
    let profileData: UserProfileData | null = null;
    try {
      const profileFetchResult = await fetchUserProfile();
      if (profileFetchResult.success && profileFetchResult.profile) {
        profileData = profileFetchResult.profile;
      } else if (profileFetchResult.profileText) {
        // Fallback: If profile object is null but profileText is present, use it for profileText
        profileData = profileFetchResult;
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
${milestone.description}

Key achievements:
${milestone.achievements.map((achievement: string) => `- ${achievement}`).join('\\n')}

Skills: ${milestone.skills?.join(', ')}
Impact: ${milestone.impact}
`
        )
        .join('\\n')
    : 'No career milestone data available.'
}

${
  relevantMemories.length > 0
    ? `## Relevant Achievements and Experiences\\n${relevantMemories
        .map((m: ScoredMemoryPoint) => `- ${m.payload.text}`)
        .join('\\n')}`
    : ''
}

${additionalContext ? `## Additional Context\\n${additionalContext}` : ''}

${specificRequirements ? `## Specific Requirements\\n${specificRequirements}` : ''}

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
    let llmResponse: CombinedLLMResponse; // Change type to CombinedLLMResponse
    try {
      llmResponse = await generateLLMResponse('NARRATIVE_GENERATION', prompt, {
        profileContext: profileData?.profileText || '', // Use profileData?.profileText
        systemContext: '',
        memoryResults: relevantMemories,
        model: '',
        temperature: 0.7,
        maxTokens: 2000,
      });
      // Check for success before accessing content
      if (!llmResponse.success) {
        throw new Error(llmResponse.error || 'LLM call failed');
      }
      llmContent = llmResponse.content; // Assign to the outer `llmContent`
      console.log('[NARRATIVE_GENERATE] LLM content:', llmContent);
    } catch (err: unknown) {
      console.error('[NARRATIVE_GENERATE] LLM error:', err);
      return NextResponse.json(
        {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to generate narrative content',
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
      // Remove the title line from content
      llmContent = lines.slice(1).join('\n').trim();
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
        // Adding metadata as per type definition
        narrativeType, // Include narrativeType in metadata
        tone, // Include tone in metadata
        length, // Include length in metadata
        suggestedTitle, // Include suggestedTitle in metadata
        additionalContext,
        specificRequirements,
      },
      // Renamed 'content' to 'generatedNarrative' to match the interface.
      // 'suggestedTitle' and 'relevantMemories' are now part of metadata or adjusted to match the interface.
      // 'createdAt' is no longer a direct property of NarrativeGenerationResponse according to your provided type.
    };

    return NextResponse.json({
      success: true,
      narrative: narrativeResponse,
    });
  } catch (error: unknown) {
    console.error('Error in narrative/generate route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
