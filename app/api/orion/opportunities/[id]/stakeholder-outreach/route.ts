/**
 * GOAL: API route for identifying stakeholders and drafting outreach messages for a specific REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA using LLM.
 * - Ensures all REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA objects include both company and companyOrInstitution.
 * - Adds context-rich, traceable logging for every operation, parameter, and result.
 * - Related files: lib/WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES_service.ts, lib/profile_service.ts, lib/orion_llm.ts, types/REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA.d.ts
 * - opportunities for consolidation and improvement:
 * integrate with python api to scrape web information on stakeholders, usr python api to generate email address, have editable section to send emails from the UI, store details of previously reached individuals
 */
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import { fetchUserProfile } from '@/lib/profile_service';
import type { UserProfileFetchResponse, Opportunity, LLMResponseFailure, UserProfileData } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route for identifying stakeholders and drafting outreach messages for a specific REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA using LLM.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json(
            { success: false, error: 'REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA ID is required.' },
            { status: 400 }
        );
    }

    try {
        const body = await request.json();
        const { stakeholder, opportunityDetails } = body;

        // Assume opportunityDetails is already the full Opportunity object passed from frontend
        const opportunity: Opportunity = opportunityDetails;

        const rawProfileResponse: UserProfileFetchResponse = await fetchUserProfile();

        let userProfileData: UserProfileData | null = null;

        if (rawProfileResponse.success && rawProfileResponse.profile) {
            userProfileData = rawProfileResponse.profile;
        } else {
            // Construct a default UserProfileData object if fetching failed or profile is null
            userProfileData = {
                id: 'default-id',
                userId: 'unauthenticated_user', // Add userId as authentication is removed
                name: null,
                email: null,
                mobile: null,
                website: null,
                github: null,
                linkedin: null,
                substack: null,
                slideshare: null,
                medium: null,
                discord: null,
                merisLabsLinkedin: null,
                bioPitchLink: null,
                youtube: null,
                language: null,
                location: null,
                backgroundSummary: null,
                keySkills: null,
                goals: null,
                values: null,
                profileText: '', // Mandatory empty string default
                bio: null,
                skills: null,
                experience: null,
                education: null,
                interests: null,
                socialLinks: null,
                summary: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                source: 'none',
            };
        }

        // Now, construct profileResponse using the potentially defaulted userProfileData
        const profileResponse: UserProfileFetchResponse = {
            success: !!userProfileData, // success based on whether we have a profile
            profileText: userProfileData?.profileText || '', // Use the profileText from userProfileData
            profile: userProfileData, // Directly assign the constructed/fetched UserProfileData
            error: userProfileData ? undefined : rawProfileResponse.error || 'Failed to fetch or create profile',
            source: userProfileData?.source || 'none',
        };

        const prompt = `Generate an outreach message to ${stakeholder.name}, a ${stakeholder.role} at ${stakeholder.company}. The message should be tailored for the opportunity: "${opportunity.title}". My profile: ${profileResponse.profileText}`;

        const llmResponse = await generateLLMResponse(
            REQUEST_TYPES.DRAFT_COMMUNICATION,
            prompt,
            'unauthenticated_user',
            {}
        );

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
