/**
 * GOAL: Provide API endpoints for managing CV components, including creating/updating and listing them.
 * This allows the frontend to interact with the CV component data stored in the database.
 *
 * RELATION TO OTHER FILES, FUNCTIONS, COMPONENTS, AND FEATURES:
 * - `@/lib/cv_components_db_service.ts`: Consumes functions like `saveOrUpdateCvComponent` and `fetchAllCvComponents` to perform database operations.
 * - `@/lib/types/index.ts`: Uses types like `RawCvComponentJsonData` and `CVComponentPayload` for request/response validation and typing.
 * - `@/lib/logger`: Used for logging API request handling, successes, and errors.
 * - `@/lib/auth`: Used for authenticating requests to these endpoints.
 * - Frontend components (e.g., a CV component management UI) would call these endpoints.
 * - Zod: Used for request body validation.
 *
 * FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/api/orion/cv-components/route.ts
 * NOTES:
 * - Handles POST requests to create or update CV components.
 * - Handles GET requests to list all CV components.
 * - Includes authentication to protect the endpoints.
 * - Validates incoming request data using Zod schemas.
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveOrUpdateCvComponent, fetchAllCvComponents } from '@/lib/cv_components_db_service';
import { RawCvComponentJsonData } from '@/lib/types';
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

    logger.info('[CV_COMP_API][GET_LIST][SUCCESS]', { ...logContext, count: components.length });
    return NextResponse.json({ success: true, components });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[CV_COMP_API][GET_LIST][ERROR]', { ...logContext, error: errorMessage });
    return NextResponse.json(
      { success: false, error: 'Failed to fetch CV components', details: errorMessage },
      { status: 500 }
    );
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
