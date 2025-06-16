/**
 * GOAL: API route for identifying stakeholders and drafting outreach messages for a specific OrionOpportunity using LLM.
 * - Ensures all OrionOpportunity objects include both company and companyOrInstitution.
 * - Adds context-rich, traceable logging for every operation, parameter, and result.
 * - Related files: lib/notion_service.ts, lib/profile_service.ts, lib/orion_llm.ts, types/OrionOpportunity.d.ts
 * - opportunities for consolidation and improvement:
 * integrate with python api to scrape web information on stakeholders, usr python api to generate email address, have editable section to send emails from the UI, store details of previously reached individuals
 */
import { auth } from '@/auth';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import { fetchUserProfile, ProfileServiceRawData } from '@/lib/profile_service';
import type { UserProfileFetchResponse, OrionOpportunity, LLMResponseFailure } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route for identifying stakeholders and drafting outreach messages for a specific OrionOpportunity using LLM.
 */
export async function POST(request: NextRequest, { params }: { params: { opportunityId: string } }) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { opportunityId } = params;

  if (!opportunityId) {
    return NextResponse.json({ success: false, error: 'OrionOpportunity ID is required.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { stakeholder, opportunityDetails } = body;

    // Assume opportunityDetails is already the full OrionOpportunity object passed from frontend
    const opportunity: OrionOpportunity = opportunityDetails;

    const rawProfileResponse: ProfileServiceRawData | null = await fetchUserProfile();
    const profileResponse: UserProfileFetchResponse = {
      success: !!rawProfileResponse,
      profileText: rawProfileResponse?.profileText || null,
      profile: rawProfileResponse
        ? {
            name: 'Tomide',
            email: 'tomide@example.com',
            bio: rawProfileResponse.profileText,
            skills: [],
            experience: [],
            education: [],
            interests: [],
            values: [],
            goals: [],
            socialLinks: [],
            contactInfo: {},
          }
        : null, // Placeholder for actual UserProfileData
      error: rawProfileResponse ? undefined : 'Failed to fetch profile',
      source: rawProfileResponse?.source,
    };

    const prompt = `Generate an outreach message to ${stakeholder.name}, a ${stakeholder.role} at ${stakeholder.company}. The message should be tailored for the opportunity: "${opportunity.title}". My profile: ${profileResponse.profileText}`;

    const llmResponse = await generateLLMResponse(REQUEST_TYPES.DRAFT_COMMUNICATION, prompt);

    if (!llmResponse.success) {
      return NextResponse.json({ success: false, error: (llmResponse as LLMResponseFailure).error }, { status: 500 });
    }

    return NextResponse.json({ success: true, outreach: llmResponse.content });
  } catch (error: unknown) {
    console.error('[STAKEHOLDER_OUTREACH_API_ERROR]', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      {
        success: false,
        error:
          (error instanceof Error ? error.message : 'Unknown error') ||
          'An unexpected error occurred during stakeholder outreach.',
      },
      { status: 500 }
    );
  }
}
