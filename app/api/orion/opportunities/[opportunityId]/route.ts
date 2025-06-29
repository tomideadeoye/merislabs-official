/**
 * @fileoverview API route for fetching a single opportunity by its ID.
 * @description This endpoint provides a secure and efficient way to retrieve detailed information
 * about a specific `OrionOpportunity` from the database using its unique identifier.
 * It integrates with the `opportunity_db_service` and ensures robust error handling
 * for cases where the opportunity is not found or a database error occurs.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To serve as the API endpoint for `GET` requests to fetch a single `OrionOpportunity` record by ID.
 *   - To ensure retrieved opportunity data is accurate and complete.
 *   - To handle cases where a requested opportunity does not exist, returning a 404.
 *   - To provide consistent logging and error handling for all operations.
 *
 * FILEPATH: `app/api/orion/opportunity/[opportunityId]/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `next/server`: Provides `NextRequest` and `NextResponse` for handling API requests and responses.
 *   - `@/lib/logger`: Used for comprehensive, context-rich logging throughout the route.
 *   - `@/lib/opportunity_db_service`: Imports `getOpportunityByIdFromDb` to abstract database interactions.
 *   - `@/lib/types`: Imports `HandledApplicationError` and `OrionOpportunity` for type consistency and error handling.
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/page.tsx`: This frontend page (and similar detail views)
 *     likely consumes this `GET` endpoint to display specific opportunity details.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that the Neon PostgreSQL database is accessible via the `opportunity_db_service`.
 *   - Assumes `params.opportunityId` is a valid ID string.
 *   - Error handling differentiates between an opportunity not found (404) and other server errors (500).
 *
 * NOTES:
 *   - This route adheres to RESTful principles for retrieving a single resource.
 *   - Comprehensive logging is in place to track request lifecycle and database operations.
 *   - The error handling leverages `HandledApplicationError` for standardized error responses.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Authentication/Authorization**: Implement more explicit user authentication and authorization checks
 *     to ensure only permitted users can view specific opportunity details.
 *   - **Caching**: Implement server-side caching for frequently accessed opportunity details to reduce database load.
 *   - **Field Selection**: Allow clients to request specific fields to be returned (e.g., via query parameters)
 *     to optimize response payload size.
 *   - **Performance Monitoring**: Integrate more granular performance monitoring for database queries and API response times.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getOpportunityByIdFromDb } from '@/lib/opportunity_db_service';
import logger from '@/lib/logger';
import { OrionOpportunity } from '@/lib/types';
import { handleServerError } from '@/lib/utils/serverErrorHandler';
import { HandledApplicationError } from '@/lib/utils/errorHandler';

export async function GET(
  request: NextRequest, // Marked as unused, but kept for route signature consistency
  { params }: { params: { opportunityId: string } }
) {
  const logContext = { route: '/api/orion/opportunity/[opportunityId]', opportunityId: params.opportunityId };
  logger.info('[OPPORTUNITY_DETAIL_API][GET_START] Attempting to fetch opportunity details.', logContext);

  try {
    const { opportunityId } = params;
    const opportunity = await getOpportunityByIdFromDb(opportunityId);

    if (opportunity instanceof HandledApplicationError) {
      logger.error('[OPPORTUNITY_DETAIL_API][ERROR] Received HandledApplicationError from DB service.', {
        ...logContext,
        error: opportunity.message,
        name: opportunity.errorCode ?? 'UnknownErrorType',
        details: opportunity.details ?? opportunity.originalError ?? 'No specific details provided',
      });
      return NextResponse.json(
        { success: false, error: opportunity.message, details: opportunity.details ?? 'Unknown error' },
        { status: opportunity.statusCode || 500 }
      );
    }

    if (opportunity) {
      const fetchedOpportunity: OrionOpportunity = opportunity;
      logger.info('[OPPORTUNITY_DETAIL_API][GET_SUCCESS] Opportunity details fetched.', {
        ...logContext,
        opportunityTitle: fetchedOpportunity.title,
      });
      return NextResponse.json({ success: true, opportunity: fetchedOpportunity });
    } else {
      logger.warn('[OPPORTUNITY_DETAIL_API][NOT_FOUND] Opportunity not found.', logContext);
      return NextResponse.json({ success: false, error: 'Opportunity not found' }, { status: 404 });
    }
  } catch (error: unknown) {
    const handledError = handleServerError(error, logContext);
    logger.error('[OPPORTUNITY_DETAIL_API][GET_ERROR] Failed to fetch opportunity details.', {
      ...logContext,
      error: handledError.message,
      stack: handledError.originalError instanceof Error ? handledError.originalError.stack : 'N/A',
    });
    return NextResponse.json(
      { success: false, error: handledError.message },
      { status: handledError.statusCode || 500 }
    );
  }
}
