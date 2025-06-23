/**
 * @fileoverview API route for managing collections of opportunities: listing all opportunities and creating new ones.
 * @description This route provides two primary functionalities: a `GET` endpoint to retrieve a comprehensive list of all stored opportunities from the Neon database, and a `POST` endpoint to create a new opportunity record. It leverages Zod for robust input validation on creation and integrates with the `opportunity_db_service` for database interactions.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To serve as the central API endpoint for `GET` requests to fetch all `OrionOpportunity` records.
 *   - To serve as the central API endpoint for `POST` requests to create a new `OrionOpportunity` record.
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
 *   - `@/lib/types`: Imports `OpportunityStatus`, `OpportunityType`, `OpportunityPriority`, which are used in the Zod schema for type enforcement.
 *   - `@/lib/opportunity_db_service`: Imports `listOpportunitiesFromDb` and `createOpportunityInDb` to abstract database interactions.
 *   - `@/generated/prisma`: Imports `PrismaClient` to directly create associated `Stakeholder` records.
 *   - `app/(orion_admin)/admin/opportunity-pipeline/page.tsx`: This frontend page likely consumes the `GET` endpoint to display the list of opportunities.
 *   - `app/(orion_admin)/admin/opportunity-pipeline/components/NewOpportunityForm.tsx`: A form component would likely send `POST` requests to this endpoint.
 *   - `app/lib/opportunity_db_service.ts`: Defines the core database logic for opportunities.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that the Neon PostgreSQL database is accessible via the `opportunity_db_service`.
 *   - Assumes that `OpportunityStatus`, `OpportunityType`, and `OpportunityPriority` enums are correctly defined in `@/lib/types` and align with Prisma's schema.
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
import { z } from 'zod';
import { OpportunityStatus, OpportunityType, OpportunityPriority } from '@/lib/types';
import { listOpportunitiesFromDb, createOpportunityInDb } from '@/lib/opportunity_db_service';
import { PrismaClient } from '@/generated/prisma';
import { HandledApplicationError } from '@/lib/utils/errorHandler';
import { handleServerError } from '@/lib/utils/serverErrorHandler';

const prisma = new PrismaClient();

const stakeholderSchema = z.object({
  name: z.string(),
  title: z.string(),
  email: z.string().optional(),
  linkedinUrl: z.string().optional(), // Changed to linkedinUrl to match Prisma schema
});

// applicationDraftSchema is not used in this file's logic.
// const applicationDraftSchema = z.object({
//   id: z.string(),
//   type: z.enum(["email", "linkedin"]),
//   content: z.string(),
//   createdAt: z.coerce.date(), // Coerce string to Date
// });

// Using a partial schema for creation, as many fields are generated by the DB
const createOpportunitySchema = z.object({
  title: z.string(),
  companyOrInstitution: z.string(), // Corresponds to 'company' in Prisma model
  type: z.nativeEnum(OpportunityType).optional(), // Use .optional() if undefined is the "empty" state
  status: z.nativeEnum(OpportunityStatus), // Use nativeEnum for TypeScript enums
  location: z.string().nullish(),
  salary: z.string().nullish(),
  content: z.string().nullish(), // Corresponds to 'description' in DB
  tags: z.array(z.string()).nullish(), // Corresponds to 'requirements' in DB
  url: z.string().url().nullish(), // Add missing URL field to schema
  dateIdentified: z.string().datetime().nullish(), // Add missing dateIdentified field to schema
  notes: z.string().nullish(),
  contactPerson: z.string().nullish(),
  contactEmail: z.string().nullish(),
  stage: z.string().nullish(),
  attachments: z.array(z.string()).nullish(),
  relatedEvaluationId: z.string().uuid().nullish(),
  sourceUrl: z.union([z.string().url(), z.literal(null)]).optional(),
  nextActionDate: z.string().datetime().nullish(),
  priority: z.nativeEnum(OpportunityPriority).nullish(), // Use nativeEnum
  tailoredCv: z.string().nullish(),
  deadline: z.string().datetime().nullish(),
  contact: z.string().nullish(),
  position: z.string().nullish(),
  lastStatusUpdate: z.string().datetime().nullish(),
  notionPageId: z.string().nullish(),
  // Stakeholders are handled separately after opportunity creation as nested creates are not in createOpportunityInDb
  stakeholders: z.array(stakeholderSchema).optional(),
});

// Infer the TypeScript type from the Zod schema for better type safety
type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>;

export async function GET() {
  const logContext = { route: '/api/orion/opportunities/list', filePath: 'api/orion/opportunities/route.ts' };
  logger.info('[OPPORTUNITY_API][GET_LIST][START] Attempting to fetch opportunities.', logContext);

  try {
    const opportunities = await listOpportunitiesFromDb();

    if (opportunities instanceof HandledApplicationError) {
      logger.error('[OPPORTUNITY_API][GET_LIST][ERROR] Received HandledApplicationError from DB service.', {
        ...logContext,
        error: opportunities.message,
        name: opportunities.type ?? 'UnknownHandledError', // Access name directly
        details: opportunities.data ?? opportunities.originalError ?? 'No specific details provided',
      });
      return NextResponse.json(
        { success: false, error: opportunities.message, details: opportunities.data ?? 'Unknown error' },
        { status: opportunities.status || 500 }
      );
    }

    logger.info('[OPPORTUNITY_API][GET_LIST][SUCCESS] Successfully fetched opportunities.', {
      ...logContext,
      count: opportunities.length, // Now 'opportunities' is guaranteed to be OrionOpportunity[]
    });
    return NextResponse.json(opportunities);
  } catch (error: unknown) {
    const handledError = handleServerError(error, logContext);
    logger.error('[OPPORTUNITY_API][GET_LIST][ERROR] Failed to fetch opportunities.', {
      ...logContext,
      error: handledError.message,
      stack: handledError.originalError instanceof Error ? handledError.originalError.stack : 'N/A',
    });
    return NextResponse.json(
      { success: false, error: 'Failed to fetch opportunities', details: handledError.message },
      { status: handledError.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const logContext = { route: '/api/orion/opportunities/create', filePath: 'api/orion/opportunities/route.ts' };
  logger.info('[OPPORTUNITY_API][POST_CREATE][START] Attempting to create new opportunity.', logContext);

  try {
    const body = await request.json();
    const validatedData: CreateOpportunityInput = createOpportunitySchema.parse(body);

    logger.info('[OPPORTUNITY_API][POST_CREATE][VALIDATED] Data validated successfully. Creating opportunity in DB.', {
      ...logContext,
      title: validatedData.title,
      company: validatedData.companyOrInstitution,
    });

    const newOpportunity = await createOpportunityInDb({
      title: validatedData.title,
      companyOrInstitution: validatedData.companyOrInstitution,
      type: validatedData.type,
      status: validatedData.status,
      location: validatedData.location,
      salary: validatedData.salary ?? null,
      content: validatedData.content ?? null,
      tags: validatedData.tags ?? null,
      url: validatedData.url ?? null,
      dateIdentified: validatedData.dateIdentified ?? null,
      notes: validatedData.notes ?? null,
      contactPerson: validatedData.contactPerson ?? null,
      contactEmail: validatedData.contactEmail ?? null,
      stage: validatedData.stage ?? null,
      attachments: validatedData.attachments ?? null,
      relatedEvaluationId: validatedData.relatedEvaluationId ?? null,
      sourceUrl: validatedData.sourceUrl ?? null,
      nextActionDate: validatedData.nextActionDate ?? null,
      priority: validatedData.priority ?? null,
      tailoredCv: validatedData.tailoredCv ?? null,
      deadline: validatedData.deadline ?? null,
      contact: validatedData.contact ?? null,
      position: validatedData.position,
      lastStatusUpdate: validatedData.lastStatusUpdate ?? null,
      notionPageId: validatedData.notionPageId ?? null,
    });

    // Insert stakeholders if provided and not handled by createOpportunityInDb (current setup)
    if (validatedData.stakeholders && validatedData.stakeholders.length > 0) {
      logger.info('[OPPORTUNITY_API][POST_CREATE][STAKEHOLDERS] Inserting associated stakeholders.', {
        ...logContext,
        opportunityId: newOpportunity.id,
        stakeholderCount: validatedData.stakeholders.length,
      });
      await Promise.all(
        validatedData.stakeholders.map((stakeholder) =>
          prisma.stakeholder.create({
            data: {
              opportunityId: newOpportunity.id,
              name: stakeholder.name,
              title: stakeholder.title,
              email: stakeholder.email,
              linkedinUrl: stakeholder.linkedinUrl,
            },
          })
        )
      );
      logger.info(
        '[OPPORTUNITY_API][POST_CREATE][STAKEHOLDERS_SUCCESS] Stakeholders inserted successfully.',
        logContext
      );
    }

    logger.info('[OPPORTUNITY_API][POST_CREATE][SUCCESS] New opportunity created successfully.', {
      ...logContext,
      opportunityId: newOpportunity.id,
    });
    return NextResponse.json(newOpportunity, { status: 201 });
  } catch (error: unknown) {
    const handledError = handleServerError(error, logContext);
    logger.error('[OPPORTUNITY_API][POST_CREATE][ERROR] Failed to create opportunity.', {
      ...logContext,
      error: handledError.message,
      stack: handledError.originalError instanceof Error ? handledError.originalError.stack : 'N/A',
    });
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid opportunity data', details: handledError.data },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create opportunity', details: handledError.message },
      { status: handledError.status || 500 }
    );
  }
}
