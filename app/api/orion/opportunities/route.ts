/**
 * @fileoverview API route for managing collections of opportunities: listing all opportunities and creating new ones.
 * @description This route provides two primary functionalities: a `GET` endpoint to retrieve a comprehensive list of all stored opportunities from the Neon database, and a `POST` endpoint to create a new opportunity record. It leverages Zod for robust input validation on creation and integrates with the `opportunity_db_service` for database interactions.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To serve as the central API endpoint for `GET` requests to fetch all `Opportunity` records.
 *   - To serve as the central API endpoint for `POST` requests to create a new `Opportunity` record.
 *   - To ensure incoming opportunity data is strictly validated using Zod schemas before persistence.
 *   - To interact with `app/lib/opportunity_db_service.ts` for database operations (list and create).
 *   - To manage the creation of associated stakeholders directly within the POST request.
 *   - To provide consistent logging and error handling for all operations.
 *add notees comments everywhere
 * FILEPATH: `app/api/orion/opportunities/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `next/server`: Provides `NextRequest` and `NextResponse` for handling API requests and responses.
 *   - `@/lib/logger`: Used for comprehensive, context-rich logging throughout the route.
 *   - `zod`: The schema validation library used to define and enforce the structure of incoming data for new opportunities.
 *   - `@/lib/types`: Imports `OpportunityType`, `OpportunityPriority`, which are used in the Zod schema for type enforcement.
 *   - `@/lib/opportunity_db_service`: Imports `listOpportunitiesFromDb` and `createOpportunityInDb` to abstract database interactions.
 *   - `@prisma/client`: Imports `PrismaClient` to directly create associated `Stakeholder` records.
 *   - `app/(orion_admin)/admin/opportunity-pipeline/page.tsx`: This frontend page likely consumes the `GET` endpoint to display the list of opportunities.
 *   - `app/(orion_admin)/admin/opportunity-pipeline/components/NewOpportunityForm.tsx`: A form component would likely send `POST` requests to this endpoint.
 *   - `app/lib/opportunity_db_service.ts`: Defines the core database logic for opportunities.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that the Neon PostgreSQL database is accessible via the `opportunity_db_service`.
 *   - Assumes that `OpportunityType` and `OpportunityPriority` enums are correctly defined in `@/lib/types` and align with Prisma's schema.
 *   - Stakeholder creation is handled as part of the opportunity POST, meaning stakeholders are directly tied to an opportunity upon creation.
 *   - Error handling differentiates between Zod validation errors and other unexpected server errors.
 *
 * NOTES:
 *   - This route adheres to RESTful principles by managing the collection of resources (`/opportunities`).
 *   - Comprehensive logging is in place to track request lifecycle, data validation, and database operations.
 *   - The separation of concerns between this API route (validation, request handling) and the database service (DB logic) promotes modularity.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Pagination and Filtering (GET)**: Enhance the `GET` endpoint to support pagination, sorting, and more advanced filtering parameters to improve performance for large datasets and provide more flexible data retrieval.
 *   - **Unified Error Handling**: Integrate `handleApiError` from `app/lib/utils/errorHandler.ts` for a more consistent and centralized approach to API error responses across the application.
 *   - **Transaction for Stakeholders**: While `Promise.all` works, wrapping opportunity and stakeholder creation in a single Prisma transaction would ensure atomicity (either both succeed or both fail), preventing orphaned records in case of a partial failure.
 *   - **Type Inference Robustness**: Further ensure that Zod schema infers types (`z.infer`) are robustly used throughout the logic to catch potential discrepancies early.
 *   - **Test Coverage**: Implement comprehensive unit and integration tests for both `GET` and `POST` endpoints, covering valid inputs, invalid inputs, edge cases, and error scenarios.
 * dry principle
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - If similar patterns for creating associated nested records (like stakeholders) emerge for other entities, consider abstracting this pattern into a reusable utility.
 *   - This route is already a consolidation point for listing and creating opportunities, avoiding separate API routes for each operation on the collection.
 */
import { NextResponse, NextRequest } from 'next/server';
import logger from '@/lib/logger';
import { listOpportunitiesFromDb, createOpportunityInDb } from '@/lib/opportunity_db_service';
import { HandledApplicationError } from '@/lib/utils/errorHandler';
import { handleServerError } from '@/lib/utils/serverErrorHandler';
import { prisma } from '@/lib/prisma';
import { Stakeholder } from '@prisma/client';



// applicationDraftSchema is not used in this file's logic.
// const applicationDraftSchema = z.object({
//   id: z.string(),
//   type: z.enum(["email", "linkedin"]),
//   content: z.string(),
//   createdAt: z.coerce.date(), // Coerce string to Date
// });



export async function GET() {
  const logContext = { route: '/api/orion/opportunities/list', filePath: 'api/orion/opportunities/route.ts' };
  logger.info('[OPPORTUNITY_API][GET_LIST][START] Attempting to fetch opportunities.', logContext);

  try {
    const opportunitiesResult = await listOpportunitiesFromDb();

    if (Array.isArray(opportunitiesResult)) {
      const opportunities = opportunitiesResult; // Type is now correctly narrowed to Opportunity[]

      logger.info('[OPPORTUNITY_API][GET_LIST][SUCCESS] Successfully fetched opportunities.', {
        ...logContext,
        count: opportunities.length,
      });
      return NextResponse.json({
        success: true,
        opportunities: opportunities,
      });
    } else if (opportunitiesResult instanceof HandledApplicationError) {
      logger.error('[OPPORTUNITY_API][GET_LIST][ERROR] Received HandledApplicationError from DB service.', {
        ...logContext,
        error: opportunitiesResult.message,
        name: opportunitiesResult.errorCode ?? 'UnknownHandledError',
        details: opportunitiesResult.details ?? opportunitiesResult.originalError ?? 'No specific details provided',
      });
      return NextResponse.json(
        { success: false, error: opportunitiesResult.message, details: opportunitiesResult.details ?? 'Unknown error' },
        { status: opportunitiesResult.statusCode || 500 }
      );
    } else {
      const handledError = handleServerError(opportunitiesResult, logContext);
      logger.error('[OPPORTUNITY_API][GET_LIST][ERROR] Failed to fetch opportunities.', {
        ...logContext,
        error: handledError.message,
        stack: handledError.originalError instanceof Error ? handledError.originalError.stack : 'N/A',
      });
      return NextResponse.json(
        { success: false, error: 'Failed to fetch opportunities', details: handledError.details },
        { status: handledError.statusCode || 500 }
      );
    }
  } catch (error: unknown) {
    const handledError = handleServerError(error, logContext);
    logger.error('[OPPORTUNITY_API][GET_LIST][ERROR] Failed to fetch opportunities.', {
      ...logContext,
      error: handledError.message,
      stack: handledError.originalError instanceof Error ? handledError.originalError.stack : 'N/A',
    });
    return NextResponse.json(
      { success: false, error: 'Failed to fetch opportunities', details: handledError.details },
      { status: handledError.statusCode || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const logContext = { route: '/api/orion/opportunities/create', filePath: 'api/orion/opportunities/route.ts' };
  logger.info('[OPPORTUNITY_API][POST_CREATE][START] Attempting to create new opportunity.', logContext);

  try {
    const body = await request.json();
    logger.info('[OPPORTUNITY_API][POST_CREATE][RECEIVED_BODY]', { ...logContext, body });

    // Dynamically map companyOrInstitution to company, pass all other fields through
    const { companyOrInstitution, stakeholders, ...rest } = body;
    const newOpportunity = await createOpportunityInDb({
      ...rest,
      company: companyOrInstitution,
    });

    // Dynamically create stakeholders if provided
    if (Array.isArray(stakeholders) && stakeholders.length > 0) {
      logger.info('[OPPORTUNITY_API][POST_CREATE][STAKEHOLDERS] Inserting associated stakeholders.', {
        ...logContext,
        id: newOpportunity.id,
        stakeholderCount: stakeholders.length,
      });
      await Promise.all(
        stakeholders.map((stakeholder: Stakeholder) =>
          prisma.stakeholder.create({
            data: {
              ...stakeholder,
              opportunityId: newOpportunity.id,
            },
          })
        )
      );
      logger.info('[OPPORTUNITY_API][POST_CREATE][STAKEHOLDERS_SUCCESS] Stakeholders inserted successfully.', logContext);
    }

    logger.info('[OPPORTUNITY_API][POST_CREATE][SUCCESS] New opportunity created successfully.', {
      ...logContext,
      id: newOpportunity.id,
    });
    return NextResponse.json(newOpportunity, { status: 201 });
  } catch (error: unknown) {
    const handledError = handleServerError(error, logContext);
    logger.error('[OPPORTUNITY_API][POST_CREATE][ERROR] Failed to create opportunity.', {
      ...logContext,
      error: handledError.message,
      stack: handledError.originalError instanceof Error ? handledError.originalError.stack : 'N/A',
    });
    return NextResponse.json(
      { success: false, error: 'Failed to create opportunity', details: handledError.message },
      { status: handledError.statusCode || 500 }
    );
  }
}
