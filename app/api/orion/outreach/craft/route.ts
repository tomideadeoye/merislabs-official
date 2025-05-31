import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getPersonaById } from '@/lib/persona_service';
import { TOMIDES_PROFILE_DATA } from '@/lib/constants';
import { searchMemory } from '@/lib/orion_memory';
import { generateLLMResponse } from '@/lib/orion_llm';
import { OutreachRequest, OutreachResponse } from '@/types/strategic-outreach';

/**
 * API route for crafting strategic outreach content
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as OutreachRequest;
    const { personaId, opportunityDetails, goal, communicationType, tone, additionalContext } = body;
    
    // Validate required fields
    if (!personaId || !opportunityDetails || !goal || !communicationType) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Get the persona
    const persona = await getPersonaById(personaId);
    if (!persona) {
      return NextResponse.json({ 
        success: false, 
        error: 'Persona not found' 
      }, { status: 404 });
    }
    
    // Get relevant memories
    const relevantMemories = await searchMemory({
      query: `${persona.name} ${persona.company || ''} ${opportunityDetails} ${goal}`,
      limit: 5,
      filter: {
        must: [
          { key: 'payload.tags', match: { value: 'achievement' } }
        ]
      }
    });
    
    // Get profile data
    let profileData = '';
    try {
      const profileResponse = await fetch(TOMIDES_PROFILE_DATA);
      profileData = await profileResponse.text();
    } catch (error) {
      console.error('Error fetching profile data:', error);
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

## Opportunity Details
${opportunityDetails}

## Goal
${goal}

## Communication Type
${communicationType}

## Tone
${tone || 'professional'}

${additionalContext ? `## Additional Context\n${additionalContext}` : ''}

${relevantMemories.length > 0 ? `## Relevant Achievements and Experiences\n${relevantMemories.map(m => `- ${m.payload.text}`).join('\n')}` : ''}

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
    const llmResponse = await generateLLMResponse({
      requestType: 'strategic_outreach',
      primaryContext: prompt,
      profileContext: profileData,
      temperature: 0.7,
      maxTokens: 1500
    });
    
    if (!llmResponse.success || !llmResponse.content) {
      return NextResponse.json({ 
        success: false, 
        error: llmResponse.error || 'Failed to generate outreach content' 
      }, { status: 500 });
    }
    
    // Create outreach response
    const outreach: OutreachResponse = {
      id: uuidv4(),
      personaId,
      draft: llmResponse.content,
      relevantMemories: relevantMemories.map(m => ({ id: m.id, text: m.payload.text })),
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json({ 
      success: true, 
      outreach 
    });
    
  } catch (error: any) {
    console.error('Error in outreach/craft route:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}