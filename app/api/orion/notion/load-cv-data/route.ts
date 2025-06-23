/**
 * FILEPATH: `app/api/orion/notion/load-cv-data/route.ts`
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides an API endpoint for loading and saving CV components into Notion, acting as a bridge between the Orion application and the Notion database.
 *   - Authenticates user sessions to ensure only authorized users can upload CV data.
 *   - Validates incoming CV component data and transforms it into the appropriate format for Notion page creation.
 *   - Dynamically creates new pages in a specified Notion database for each CV component, mapping component properties to Notion database properties.
 *   - Includes robust error handling for Notion API interactions and data validation, providing detailed error messages.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/cv-components/page.tsx` (Implied): This frontend page would likely be responsible for initiating the `load-cv-data` process, allowing users to upload or import CV components.
 *   - `@notionhq/client`: The official Notion API client library used to interact with Notion databases and pages.
 *   - `@/lib/types`: Defines `CVComponent`, `LoadCvDataRequestBody`, `CVComponentErrorDetail`, and `LoadCvDataApiResponse` interfaces, ensuring type safety for data structures.
 *   - `process.env.NOTION_API_KEY` and `process.env.NOTION_DATABASE_ID`: Environment variables crucial for configuring the Notion client and targeting the correct database.
 *   - `prisma/schema.prisma` (Indirectly): While this route directly interacts with Notion, the CV data stored in Notion might be synchronized or used in conjunction with a Prisma-managed database for other Orion features.
 *   - `lib/logger.ts`: Although direct `console` calls are used, future integration with this centralized logger is intended for consistent and context-rich logging.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `NOTION_API_KEY` and `NOTION_DATABASE_ID` environment variables are correctly configured and accessible on the server-side.
 *   - Expects `components` in the request body to be an array of `CVComponent` objects, each with a `name` and `content`.
 *   - Handles the conversion of various data types (e.g., `component.content` which can be `Prisma.JsonValue`) to strings as required by Notion's `rich_text` property type.
 *   - Skips components that are missing required fields (`Component Name` or `Content (Primary)`) and logs these omissions as errors.
 *   - Provides detailed error reporting, differentiating between Notion API errors and internal validation issues.
 *
 * NOTES:
 *   - This API is fundamental for populating Orion's CV component library, enabling the CV Tailoring Studio and other features that leverage user's professional history.
 *   - The direct dependency on Notion API client and environment variables highlights the importance of proper credential management and network connectivity.
 *   - For enhanced monitoring, consider replacing `console.warn` and `console.error` with calls to the centralized logger utility.
 *   - Further improvements could include batch processing for larger volumes of CV components and more granular access control.
 */
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { getCVComponentsFromNotion } from '@/lib/notion_service';

interface LogContextType {
  route: string;
  timestamp: string;
  userId?: string;
  operation?: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  const logContext: LogContextType = {
    route: '/api/orion/notion/load-cv-data',
    timestamp: new Date().toISOString(),
    operation: 'POST',
  };
  logger.info('[NOTION_LOAD_CV_DATA_API][POST][START] Received request to load CV data from Notion.', logContext);

  // Use a placeholder userId since authentication is removed
  const userId = 'unauthenticated_user';
  logContext.userId = userId;

  try {
    const { notionDatabaseId } = await request.json();

    if (!notionDatabaseId) {
      logger.warn(
        '[NOTION_LOAD_CV_DATA_API][POST][VALIDATION_FAIL] Missing notionDatabaseId in request body.',
        logContext
      );
      return NextResponse.json({ success: false, error: 'Notion database ID is required.' }, { status: 400 });
    }

    logger.debug('[NOTION_LOAD_CV_DATA_API][POST][PROCESSING] Fetching CV data from Notion.', {
      ...logContext,
      notionDatabaseId,
    });

    const cvComponents = await getCVComponentsFromNotion();

    logger.success('[NOTION_LOAD_CV_DATA_API][POST][SUCCESS] CV components loaded successfully.', {
      ...logContext,
      count: cvComponents.length,
    });
    return NextResponse.json({ success: true, cvComponents });
  } catch (error: unknown) {
    logger.error('[NOTION_LOAD_CV_DATA_API][POST][ERROR] Failed to load CV data from Notion.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to load CV data from Notion.' }, { status: 500 });
  }
}
