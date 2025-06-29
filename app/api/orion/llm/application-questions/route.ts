/**
 * GOAL: API route for answering user questions about a specific job REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA using all available context.
 * - Connects to WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES (fetchOpportunityByIdFromWE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES), user profile (fetchUserProfile), and memory search.
 * - Normalizes REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA data to always include both company and companyOrInstitution.
 * - Provides context-rich, traceable logging for every operation, parameter, and result.
 * - Used by admin and user-facing UIs for Q&A about opportunities.
 * - Related files: lib/WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES_service.ts, lib/profile_service.ts, lib/orion_llm.ts, types/REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA.d.ts
 */
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { generateLLMResponse } from '@/lib/orion_llm';
import { JD_ANALYSIS_REQUEST_TYPE } from '@/lib/orion_config';
import { z } from 'zod';

interface LogContextType {
  route: string;
  timestamp: string;
  userId?: string;
  operation?: string;
  [key: string]: unknown;
}

// Zod schema for validating the request body
const ApplicationQuestionsSchema = z.object({
  jobDescription: z.string().min(1, 'Job description is required.'),
  candidateProfile: z.string().min(1, 'Candidate profile is required.'),
  model: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const logContext: LogContextType = {
    route: '/api/orion/llm/application-questions',
    timestamp: new Date().toISOString(),
    operation: 'POST',
  };
  logger.info(
    '[APPLICATION_QUESTIONS_API][POST][START] Received request to generate application questions.',
    logContext
  );

  // Use a placeholder userId since authentication is removed
  const userId = 'unauthenticated_user';
  logContext.userId = userId;

  try {
    const body = await request.json();
    logger.debug('[APPLICATION_QUESTIONS_API][POST][REQUEST_BODY]', { ...logContext, body });

    // Validate the request body
    const validationResult = ApplicationQuestionsSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message).join(', ');
      logger.warn('[APPLICATION_QUESTIONS_API][POST][VALIDATION_FAIL]', { ...logContext, errors });
      return NextResponse.json({ success: false, error: `Validation Error: ${errors}` }, { status: 400 });
    }

    const { jobDescription, candidateProfile, model } = validationResult.data;

    // Use generateLLMResponse with JD_ANALYSIS_REQUEST_TYPE
    const llmResponse = await generateLLMResponse(
      JD_ANALYSIS_REQUEST_TYPE,
      jobDescription, // primaryContext
      userId,
      {
        model,
        profileContext: candidateProfile, // Pass candidateProfile as profileContext
        // You might want to add a systemContext here for specific instructions
      }
    );

    if (llmResponse.success) {
      logger.success('[APPLICATION_QUESTIONS_API][POST][SUCCESS] Application questions generated successfully.', {
        ...logContext,
        model: llmResponse.model,
      });
      return NextResponse.json({ success: true, questions: llmResponse.content });
    } else {
      throw new Error(llmResponse.error || 'Failed to generate application questions.');
    }
  } catch (error: unknown) {
    logger.error('[APPLICATION_QUESTIONS_API][POST][ERROR] Failed to generate application questions.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to generate application questions.' }, { status: 500 });
  }
}
