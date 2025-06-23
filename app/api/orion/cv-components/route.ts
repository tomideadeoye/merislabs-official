/**
 * @fileoverview API endpoints for managing and retrieving CV components.
 * @description This file provides the necessary API routes for both creating/updating CV components (via POST)
 * and fetching all available CV components (via GET). The GET endpoint is crucial for populating the
 * CV Tailoring Studio with the raw material needed for tailoring, aligning directly with FR-1 of the PRD.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To expose endpoints for the full lifecycle management of CV components in the database.
 *   - **GET /api/orion/cv-components:** To fetch all available CV components for display and selection
 *     in the CV Tailoring Studio (FR-1.1: "The Studio MUST fetch all available CV components from the Neon
 *     PostgreSQL database via the `fetchAllCvComponents` service.").
 *   - **POST /api/orion/cv-components:** To allow for the creation and updating of individual CV components,
 *     ensuring the underlying data source for the CV Tailoring Studio is robust and up-to-date.
 *
 * FILEPATH: `app/api/orion/cv-components/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 * - `@/lib/cv_components_db_service.ts`: Consumes functions like `saveOrUpdateCvComponent` and `fetchAllCvComponents` to perform database operations, directly fulfilling FR-1.1.
 * - `@/lib/types/index.ts`: Uses types like `RawCvComponentJsonData` and `CVComponentPayload` for request/response validation and typing, ensuring data conforms to `CVComponent` Prisma model (FR-1.2).
 * - `@/lib/logger`: Used for comprehensive logging of API request handling, successes, and errors.
 * - `@/lib/auth`: Used for authenticating requests to these endpoints, ensuring secure access to CV component data.
 * - `app/components/orion/CVTailoringStudio.tsx`: The primary client component that calls the GET endpoint to retrieve components.
 * - `app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/cv-tailoring/page.tsx`: The server page that pre-fetches components and passes them to the client-side studio.
 * - Zod: Used for robust request body validation for POST requests.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes authenticated user sessions for all requests.
 *   - Assumes `fetchAllCvComponents` returns data conforming to the `CVComponent` Prisma model.
 *   - The `uniqueId` is either provided by the client or generated automatically for new components.
 *
 * NON-FUNCTIONAL REQUIREMENTS:
 *   - Performance: Efficient database queries for fetching components to ensure fast UI loading.
 *   - Security: Robust authentication and authorization to protect sensitive CV component data.
 *   - Data Integrity: Strict validation (Zod) for incoming POST data to maintain data quality.
 *
 * NOTES:
 *   - This API is a cornerstone for the CV Tailoring Studio, providing both the read (GET) and write (POST) capabilities for CV components.
 *   - The `content` field for CV components is `z.any()` in the schema, indicating it can store various JSON structures depending on the component type.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Implement more specific Zod schemas for `content` based on `type` for stricter validation and type safety if different component types have distinct content structures.
 *   - Add pagination or filtering to the GET endpoint for very large numbers of CV components to improve performance and scalability.
 *   - Introduce rate limiting to protect the API from abuse.
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveOrUpdateCvComponent, fetchAllCvComponents } from '@/lib/cv_components_db_service';
import { RawCvComponentJsonData } from '@/lib/types';
import { CVComponent } from '@/lib/types/cv';
import { HandledApplicationError } from '@/lib/utils/errorHandler';
import { auth } from '@/auth';
import logger from '@/lib/logger';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const createCvComponentSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  content: z.any(),
  tags: z.array(z.string()).optional(),
  uniqueId: z.string().optional(),
});

type ValidatedCvComponentData = z.infer<typeof createCvComponentSchema>;

export async function GET() {
  const logContext = {
    route: '/api/orion/cv-components',
    timestamp: new Date().toISOString(),
  };
  logger.info('[CV_COMP_API][GET_LIST][START]', logContext);

  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      logger.warn('[CV_COMP_API][GET_LIST][AUTH_FAIL]', logContext);
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    (logContext as { user?: string }).user = session.user.id;

    const components = await fetchAllCvComponents();

    if (Array.isArray(components)) {
      logger.info('[CV_COMP_API][GET_LIST][SUCCESS]', { ...logContext, count: components.length });
      return NextResponse.json({ success: true, components });
    } else if (components instanceof HandledApplicationError) {
      logger.error('[CV_COMP_API][GET_LIST][FAILED_FETCH_RETURNED_ERROR]', {
        ...logContext,
        error: components.message,
        status: components.status,
      });
      return NextResponse.json(
        { success: false, error: components.message, details: components.message },
        { status: components.status || 500 }
      );
    } else {
      logger.error('[CV_COMP_API][GET_LIST][UNEXPECTED_RETURN_TYPE]', { ...logContext, returnedValue: components });
      return NextResponse.json(
        { success: false, error: 'An unexpected error occurred while fetching CV components.' },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    let userFriendlyMessage = 'Failed to fetch CV components. Please try again.';

    if (errorMessage.includes("Can't reach database server") || errorMessage.includes('timed out')) {
      userFriendlyMessage =
        'Database connection issue: Please wait a moment and try again. The database might be waking up.';
      logger.error('[CV_COMP_API][GET_LIST][DB_ERROR]', { ...logContext, error: errorMessage });
    } else {
      logger.error('[CV_COMP_API][GET_LIST][GENERIC_ERROR]', { ...logContext, error: errorMessage });
    }

    return NextResponse.json({ success: false, error: userFriendlyMessage, details: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const logContext = {
    route: '/api/orion/cv-components',
    timestamp: new Date().toISOString(),
  };
  logger.info('[CV_COMP_API][CREATE][START]', logContext);

  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      logger.warn('[CV_COMP_API][CREATE][AUTH_FAIL]', logContext);
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    (logContext as { user?: string }).user = session.user.id;

    const body = await request.json();
    const validatedData: ValidatedCvComponentData = createCvComponentSchema.parse(body);

    const uniqueId = validatedData.uniqueId || uuidv4();

    const rawCvData: RawCvComponentJsonData = {
      UniqueID: uniqueId,
      'Component Name': validatedData.name,
      'Component Type': validatedData.type,
      'Content (Primary)': validatedData.content,
      Keywords: validatedData.tags || undefined,
      'Target Role Tags': undefined,
      'Associated Company/Institution': undefined,
      'Start Date': undefined,
      'End Date': undefined,
    };

    const dataToSendToService = {
      ...rawCvData,
      userId: session.user.id!,
    } as RawCvComponentJsonData & { userId: string };

    const newComponent = await saveOrUpdateCvComponent(dataToSendToService);

    logger.info('[CV_COMP_API][CREATE][SUCCESS]', { ...logContext, componentId: newComponent.id });
    return NextResponse.json({ success: true, message: 'CV component created successfully!', component: newComponent });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[CV_COMP_API][CREATE][ERROR]', {
      ...logContext,
      error: errorMessage,
      requestBody: await request.text().catch(() => 'Could not read body'),
    });
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create CV component', details: errorMessage },
      { status: 500 }
    );
  }
}
