// GOAL OF FILE|FEATURES|FUNCTIONS:
// FILEPATH:
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunties to consolidate

import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
import logger from '@/lib/logger';
import { recordCVFeedback } from '@/lib/cv_components_db_service';
// import { authConfig } from '@/lib/auth';
import { z } from 'zod';

interface LogContextType {
  route: string;
  timestamp: string;
  userId?: string;
  operation?: string;
  [key: string]: unknown;
}

interface FeedbackPayload {
  componentId: string;
  opportunityId: string;
  tailoredContent: string;
  rating: 'positive' | 'negative';
  comments?: string;
}

// Zod schema for validating the request body for CV feedback
const CVFeedbackSchema = z.object({
  opportunityId: z.string().min(1, 'Opportunity ID is required.'),
  feedbackType: z.enum(['positive', 'negative', 'suggestion', 'bug']),
  feedbackDetails: z.string().min(1, 'Feedback details cannot be empty.'),
  componentId: z.string().optional(),
  originalContent: z.string().optional(),
  generatedContent: z.string().optional(),
});

export async function GET() {
  return NextResponse.json({ success: false, error: 'Method Not Allowed' }, { status: 405 });
}

export async function POST(request: NextRequest) {
  const logContext: LogContextType = {
    route: '/api/orion/cv/feedback',
    timestamp: new Date().toISOString(),
    operation: 'POST',
  };
  logger.info('[CV_FEEDBACK_API][POST][START] Received request to record CV feedback.', logContext);

  // Authentication check removed as per the authentication removal strategy
  // const session = await getServerSession(authConfig);
  // if (!session || !session.user || !session.user.id) {
  //   logger.warn('[CV_FEEDBACK_API][POST][AUTH_FAIL] Unauthorized access attempt.', logContext);
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  // Use a placeholder userId since authentication is removed
  const userId = 'unauthenticated_user';
  logContext.userId = userId;

  try {
    const body = await request.json();
    logger.debug('[CV_FEEDBACK_API][POST][REQUEST_BODY]', { ...logContext, body });

    // Validate the request body
    const validationResult = CVFeedbackSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message).join(', ');
      logger.warn('[CV_FEEDBACK_API][POST][VALIDATION_FAIL]', { ...logContext, errors });
      return NextResponse.json({ success: false, error: `Validation Error: ${errors}` }, { status: 400 });
    }

    const { opportunityId, feedbackType, feedbackDetails, componentId, originalContent, generatedContent } =
      validationResult.data;

    await recordCVFeedback(
      userId,
      opportunityId,
      feedbackType,
      feedbackDetails,
      componentId,
      originalContent,
      generatedContent
    );

    logger.success('[CV_FEEDBACK_API][POST][SUCCESS] CV feedback recorded successfully.', {
      ...logContext,
      opportunityId,
      feedbackType,
    });
    return NextResponse.json({ success: true, message: 'Feedback recorded successfully.' });
  } catch (error: unknown) {
    logger.error('[CV_FEEDBACK_API][POST][ERROR] Failed to record CV feedback.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to record CV feedback.' }, { status: 500 });
  }
}
