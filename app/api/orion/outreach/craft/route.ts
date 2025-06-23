import { generateLLMResponse } from '@/lib/orion_llm';
import { searchMemory } from '@/lib/orion_memory';
import { getPersonaById } from '@/lib/persona_service';
import { fetchUserProfile } from '@/lib/profile_service';
import { SearchMemoryResponse, ScoredMemoryPoint, UserProfileFetchResponse, CombinedLLMResponse } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
// Removed: import { auth } from '@/auth'; // Authentication removed as per user request

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component
/**
 * Define OutreachRequest and OutreachResponse interfaces directly in this file
 * as they are not exported from @repo/lib/types/strategic-outreach.
 */
interface OutreachRequest {
  personaId: string;
  opportunityDetails: string;
  goal: string;
  communicationType: string;
  tone?: string;
  additionalContext?: string;
}

interface OutreachResponse {
  success: boolean;
  outreachDraft?: string;
  error?: string;
  message?: string;
}

/**
 * API route for crafting strategic outreach content
 */
export async function POST(req: NextRequest) {
  let llmContent: string = '';

  // Removed authentication check as per user request
  // const session = await auth();
  // if (!session || !session.user || !session.user.id) {
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }
  // const userId = 'unauthenticated_user'; // No longer needed as userId is nullable

  try {
    const body = (await req.json()) as OutreachRequest;
    const { personaId, opportunityDetails, goal, communicationType, tone, additionalContext } = body;

    // Validate required fields
    if (!personaId || !opportunityDetails || !goal || !communicationType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Missing required fields',
        } as OutreachResponse,
        { status: 400 }
      );
    }

    // Get the persona
    const persona = await getPersonaById(personaId);
    if (!persona) {
      return NextResponse.json(
        {
          success: false,
          error: 'Persona not found',
          message: 'Persona not found',
        } as OutreachResponse,
        { status: 404 }
      );
    }

    // Get relevant memories
    const searchQuery = `${persona.name} ${persona.company || ''} ${opportunityDetails} ${goal}`;
    const searchOptions = {
      limit: 5,
      filter: {
        must: [{ key: 'payload.tags', match: { value: 'achievement' } }],
      },
    };

    let relevantMemories: ScoredMemoryPoint[] = [];
    try {
      const searchResponse: SearchMemoryResponse = await searchMemory(searchQuery, searchOptions);

      console.log('[OUTREACH_CRAFT] searchResponse details:', searchResponse);

      if (searchResponse.success && searchResponse.results) {
        relevantMemories = searchResponse.results;
      } else {
        console.warn(
          '[OUTREACH_CRAFT] Failed to fetch relevant memories:',
          searchResponse.error || 'No memories found.'
        );
      }
    } catch (error: unknown) {
      console.error('[OUTREACH_CRAFT] Error fetching relevant memories:', error);
    }

    // Get profile data
    let profileData = '';
    try {
      const profileResult: UserProfileFetchResponse = await fetchUserProfile();
      if (profileResult.success && profileResult.profileText) {
        profileData = profileResult.profileText;
      } else {
        console.warn(
          '[OUTREACH_CRAFT] Failed to fetch profile data or profileText is empty:',
          profileResult.error || 'No profile text found.'
        );
      }
    } catch (error: unknown) {
      console.error('[OUTREACH_CRAFT] Error fetching profile data:', error);
    }

    // Construct prompt for LLM
    const prompt = `
# Strategic Outreach Content Generation

## Persona Information
- Name: ${persona.name}
- Company: ${persona.company || 'N/A'}
- Role: ${persona.role || 'N/A'}
- Industry: ${persona.industry || 'N/A'}
- Values: ${persona.values?.join(', ') || 'N/A'}
- Challenges: ${persona.challenges?.join(', ') || 'N/A'}
- Interests: ${persona.interests?.join(', ') || 'N/A'}
- Value Proposition: ${persona.valueProposition || 'N/A'}
- Additional Notes: ${persona.notes || 'N/A'}

## OrionOpportunity Details
${opportunityDetails}

## Goal
${goal}

## Communication Type
${communicationType}

## Tone
${tone || 'professional'}

${additionalContext ? `## Additional Context\n${additionalContext}` : ''}

${
  relevantMemories.length > 0
    ? `## Relevant Achievements and Experiences\n${relevantMemories
        .map((m: ScoredMemoryPoint) => `- ${m.payload.text}`)
        .join('\n')}`
    : ''
}

## Task
Craft a personalized ${communicationType} to ${persona.name} that:
1. Addresses their specific challenges, values, and interests
2. Clearly communicates your value proposition in a way that resonates with them
3. Incorporates psychological principles for maximum impact and memorability
4. Uses a ${tone || 'professional'} tone throughout
5. Focuses on achieving the stated goal: ${goal}
6. Includes a clear call to action
7. Is concise and impactful

Write the complete ${communicationType} content, ready to send.
`;

    // Generate outreach content using LLM
    try {
      const llmResponse: CombinedLLMResponse = await generateLLMResponse('OUTREACH_CRAFT', prompt, null, {
        // userId is now nullable
        profileContext: profileData,
        systemContext: '',
        memoryResults: relevantMemories,
        temperature: 0.7,
        maxTokens: 1500,
      });

      if (!llmResponse.success) {
        throw new Error(llmResponse.error || 'LLM failed to generate outreach draft.');
      }

      llmContent = llmResponse.content;

      console.log('[OUTREACH_CRAFT] LLM content:', llmContent);
      return NextResponse.json({ success: true, outreachDraft: llmContent } as OutreachResponse);
    } catch (err: unknown) {
      console.error('[OUTREACH_CRAFT] LLM error:', err);
      return NextResponse.json(
        {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to generate outreach draft.',
          message: err instanceof Error ? err.message : 'Failed to generate outreach draft.',
        } as OutreachResponse,
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Error in outreach/craft route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      } as OutreachResponse,
      { status: 500 }
    );
  }
}
