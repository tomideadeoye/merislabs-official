/**
 * @fileoverview API route for generating personalized outreach messages using Large Language Models (LLMs).
 * @description This file handles the API request for generating outreach messages for sales, networking, or general communication based on provided opportunity details, stakeholder information, and the user's profile. It leverages LLMs to draft messages with specific tones and goals, and interacts with the server-side profile fetcher to personalize the output. It ensures input validation using Zod and comprehensive logging for traceability.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide an endpoint for clients to request LLM-generated outreach messages.
 *   - To validate incoming request data using Zod schemas, ensuring data integrity.
 *   - To fetch the user's profile data from a server-side service for personalization.
 *   - To call the core LLM utility (`generateOutreachMessage`) with all necessary context to produce message drafts.
 *   - To return generated drafts to the client in a structured format.
 *
 * FILEPATH: `app/api/orion/networking/generate-outreach/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/lib/logger.ts`: Used for all logging operations, providing detailed context for debugging and monitoring.
 *   - `@/lib/orion_llm.ts`: Contains the `generateOutreachMessage` function, which is the core LLM interaction logic.
 *   - `@/lib/server_profile_fetcher.ts`: Provides `fetchServerUserProfile` to securely retrieve the user's profile data.
 *   - `@/lib/types/index.ts`: Defines critical interfaces such as `OutreachRequest`, `UserProfileFetchResponse`, `UserProfileData`, and `OutreachResponse`, ensuring type consistency.
 *   - `zod`: Used for robust runtime schema validation of incoming API request bodies.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `fetchServerUserProfile` successfully retrieves user profile text or an error indicates a complete failure.
 *   - The `userId` is currently a placeholder (`'unauthenticated_user'`) as per the authentication removal strategy. This should be replaced with actual user authentication in production.
 *   - The `OutreachRequestSchema` now comprehensively reflects all required fields for `OutreachRequest`, implying the client must provide these.
 *   - The `userProfileForLLM` object is constructed with placeholder values for `UserProfileData` fields not directly provided by `fetchServerUserProfile`, as `generateOutreachMessage` primarily uses `profileText` and `source`.
 *
 * NOTES:
 *   - This API route acts as a crucial intermediary between the client-side UI and the LLM generation logic, orchestrating data flow and validation.
 *   - The integration of Zod ensures that API consumers provide correctly structured data, leading to fewer runtime errors.
 *   - **COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE**: Consider if `OutreachRequestSchema` could be generated from the `OutreachRequest` TypeScript interface using a library like `ts-to-zod` to avoid manual synchronization issues.
 *   - **PERFORMANCE OPTIMIZATIONS**: For very high traffic, consider adding caching for `fetchServerUserProfile` results beyond the in-memory cache, perhaps a distributed cache if not already present.
 *   - **ERROR HANDLING ROBUSTNESS**: Enhance error messages to provide more specific guidance to the client on what went wrong (e.g., specific missing fields).
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Refine the `UserProfileData` object passed to `generateOutreachMessage` if more detailed profile attributes are needed by the LLM in the future.
 *   - Add more specific error logging for the `generateOutreachMessage` call, including details about its input and the LLM response.
 *   - Explore using the `numberOfDrafts` from the schema to request multiple drafts from the LLM, if `generateOutreachMessage` can support it, and return them to the client.
 */

import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { generateOutreachMessage } from '@/lib/orion_llm';
import { fetchServerUserProfile } from '@/lib/server_profile_fetcher';
import { UserProfileFetchResponse, OutreachRequest, UserProfileData, OutreachResponse } from '@/lib/types';
import { z } from 'zod';

interface LogContextType {
  route: string;
  timestamp: string;
  userId?: string;
  operation?: string;
  [key: string]: unknown;
}

const OutreachRequestSchema = z.object({
  id: z.string().min(1, 'Opportunity ID is required.').optional(),
  stakeholderName: z.string().min(1, 'Stakeholder name is required.'),
  stakeholderRole: z.string().optional(),
  persona: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    traits: z.array(z.string()),
    goals: z.array(z.string()),
    email: z.string().optional(),
    role: z.string().optional(),
    company: z.string().optional(),
    industry: z.string().optional(),
    interests: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    values: z.array(z.string()).optional(),
    challenges: z.array(z.string()).optional(),
    valueProposition: z.string().optional(),
  }),
  outreachGoal: z.string().min(1, 'Outreach goal is required.'),
  messageType: z.enum(['email', 'linkedin', 'whatsapp']),
  tone: z.enum(['professional', 'friendly', 'formal', 'casual', 'persuasive', 'curious']),
  length: z.enum(['short', 'standard', 'detailed']),
  personalizationContext: z.string().optional(),
  specificContext: z.string().optional(),
  callToAction: z.string().optional(),
  numberOfDrafts: z.number().int().min(1).max(5).optional(),
});

export async function POST(request: NextRequest) {
  const logContext: LogContextType = {
    route: '/api/orion/networking/generate-outreach',
    timestamp: new Date().toISOString(),
    operation: 'POST',
  };
  logger.info('[GENERATE_OUTREACH_API][POST][START] Received request to generate outreach message.', logContext);

  // Use a placeholder userId since authentication is removed
  const userId = 'unauthenticated_user';
  logContext.userId = userId;

  try {
    const body = await request.json();
    logger.debug('[GENERATE_OUTREACH_API][POST][REQUEST_BODY]', { ...logContext, body });

    const validationResult = OutreachRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message).join(', ');
      logger.warn('[GENERATE_OUTREACH_API][POST][VALIDATION_FAIL]', { ...logContext, errors });
      return NextResponse.json({ success: false, error: `Validation Error: ${errors}` }, { status: 400 });
    }

    const {
      id,
      stakeholderName,
      stakeholderRole,
      persona,
      outreachGoal,
      messageType,
      tone,
      length,
      personalizationContext,
      specificContext,
      callToAction,
    } = validationResult.data;
    const numberOfDrafts = validationResult.data.numberOfDrafts;

    // Fetch user profile data
    const profileData: UserProfileFetchResponse | null = await fetchServerUserProfile();

    if (!profileData || !profileData.success || !profileData.profileText) {
      logger.error(
        '[GENERATE_OUTREACH_API][POST][PROFILE_FETCH_FAIL] Failed to fetch user profile for outreach generation.',
        logContext
      );
      return NextResponse.json({ success: false, error: 'Failed to fetch user profile.' }, { status: 500 });
    }

    const userProfileForLLM: UserProfileData = {
      id: profileData.profile?.id || userId,
      userId: profileData.profile?.userId || userId,
      name: profileData.profile?.name || null,
      email: profileData.profile?.email || null,
      mobile: profileData.profile?.mobile || null,
      website: profileData.profile?.website || null,
      github: profileData.profile?.github || null,
      linkedin: profileData.profile?.linkedin || null,
      substack: profileData.profile?.substack || null,
      slideshare: profileData.profile?.slideshare || null,
      medium: profileData.profile?.medium || null,
      discord: profileData.profile?.discord || null,
      merisLabsLinkedin: profileData.profile?.merisLabsLinkedin || null,
      bioPitchLink: profileData.profile?.bioPitchLink || null,
      youtube: profileData.profile?.youtube || null,
      language: profileData.profile?.language || null,
      location: profileData.profile?.location || null,
      backgroundSummary: profileData.profile?.backgroundSummary || null,
      keySkills: profileData.profile?.keySkills || null,
      goals: profileData.profile?.goals || null,
      values: profileData.profile?.values || null,
      profileText: profileData.profile?.profileText || '',
      bio: profileData.profile?.bio || null,
      skills: profileData.profile?.skills || null,
      experience: profileData.profile?.experience || null,
      education: profileData.profile?.education || null,
      interests: profileData.profile?.interests || null,
      socialLinks: profileData.profile?.socialLinks || null,
      summary: profileData.profile?.summary || null,
      createdAt: profileData.profile?.createdAt || new Date().toISOString(),
      updatedAt: profileData.profile?.updatedAt || new Date().toISOString(),
      source: profileData.profile?.source || 'none',
    };

    const outreachRequestForLLM: OutreachRequest = {
      id,
      stakeholder: stakeholderName,
      outreachType: messageType === 'whatsapp' ? undefined : messageType, // 'whatsapp' is not a valid outreachType, map to undefined
      personalizationContext,
      persona,
      outreachGoal,
      messageType,
      tone,
      length,
      specificContext,
      callToAction,
      userProfile: userProfileForLLM,
    };

    logger.debug('[GENERATE_OUTREACH_API][POST][PROCESSING] Generating outreach message.', {
      ...logContext,
      outreachRequest: outreachRequestForLLM,
    });

    const response: OutreachResponse = await generateOutreachMessage({
      outreachRequest: outreachRequestForLLM,
      userProfileData: userProfileForLLM,
    });

    if (response.success) {
      logger.success('[GENERATE_OUTREACH_API][POST][SUCCESS] Outreach message generated successfully.', logContext);
      return NextResponse.json({ success: true, message: response.message, draft: response.draft });
    } else {
      throw new Error(response.message || 'Failed to generate outreach message.');
    }
  } catch (error: unknown) {
    logger.error('[GENERATE_OUTREACH_API][POST][ERROR] Failed to generate outreach message.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to generate outreach message.' }, { status: 500 });
  }
}
