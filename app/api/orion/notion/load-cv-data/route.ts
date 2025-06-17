import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import { Client, APIResponseError, CreatePageParameters } from '@notionhq/client';
import { CVComponent } from '@/lib/types';

// Ensure Notion client is configured directly from process.env
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const notion = NOTION_API_KEY ? new Client({ auth: NOTION_API_KEY }) : null;

interface LoadCvDataRequestBody {
  components: CVComponent[];
}

interface CVComponentErrorDetail {
  component: string;
  error: string;
}

interface LoadCvDataApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  createdCount?: number;
  details?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<LoadCvDataApiResponse>> {
  const session = await getServerSession(authConfig);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!notion || !NOTION_DATABASE_ID) {
    return NextResponse.json(
      { success: false, error: 'Notion client or Database ID not configured.' },
      { status: 500 }
    );
  }

  try {
    const { components }: LoadCvDataRequestBody = await request.json();

    if (!components || !Array.isArray(components) || components.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or empty components array in request.',
        },
        { status: 400 }
      );
    }

    let createdCount = 0;
    const errors: CVComponentErrorDetail[] = [];

    for (const componentData of components) {
      try {
        const properties: NonNullable<CreatePageParameters['properties']> = {}; // Use Notion's specific properties type
        if (componentData.name)
          properties['Component Name'] = {
            title: [{ text: { content: componentData.name } }],
          };
        if (componentData.type)
          properties['Component Type'] = {
            rich_text: [{ text: { content: componentData.type } }],
          };
        if (componentData.content)
          properties['Content (Primary)'] = {
            rich_text: [{ text: { content: componentData.content } }],
          };
        if (componentData.associatedCompanyInstitution)
          properties['Associated Company/Institution'] = {
            rich_text: [
              {
                text: { content: componentData.associatedCompanyInstitution },
              },
            ],
          };
        if (componentData.startDate)
          properties['Start Date'] = {
            date: { start: componentData.startDate },
          };
        if (componentData.endDate) properties['End Date'] = { date: { start: componentData.endDate } };
        if (componentData.keywords && componentData.keywords.length > 0)
          // Ensure keywords array is not empty
          properties['Keywords'] = {
            multi_select: componentData.keywords.map((k: string) => ({ name: k })),
          };

        // Only attempt to create if required properties are present (Title and Content)
        if (!properties['Component Name'] || !properties['Content (Primary)']) {
          // Use Notion property names for check
          console.warn(`Skipping CV component due to missing required fields: ${componentData.name || 'Untitled'}`);
          const errorDetail: CVComponentErrorDetail = {
            component: componentData.name || 'Untitled',
            error: 'Missing required fields (Component Name or Content).',
          };
          errors.push(errorDetail); // Use Notion property names in error
          continue; // Skip this component
        }

        await notion.pages.create({
          parent: { database_id: NOTION_DATABASE_ID! },
          properties: properties,
        });
        createdCount++;
      } catch (error: unknown) {
        let errorMessage: string = 'Unknown error';
        let errorBodyContent: string | object | null = null;

        if (error instanceof APIResponseError) {
          errorMessage = error.message;
          errorBodyContent = error.body as string | object | null;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'body' in error) {
          errorBodyContent = (error as { body: unknown }).body as string | object | null; // Cast to unknown to remove any, then cast to compatible type
          errorMessage = JSON.stringify(errorBodyContent);
        } else if (typeof error === 'string') {
          errorMessage = error;
        }

        console.error(
          `Error creating Notion page for CV component: ${componentData.name || 'Untitled'}`,
          errorBodyContent || errorMessage
        );
        const errorDetail: CVComponentErrorDetail = {
          component: componentData.name || 'Untitled',
          error: errorBodyContent ? JSON.stringify(errorBodyContent) : errorMessage,
        };
        errors.push(errorDetail);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Successfully created ${createdCount} CV components, but encountered errors for ${errors.length}.`,
          createdCount,
          errors,
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json({
        success: true,
        message: `Successfully loaded ${createdCount} CV components into Notion.`,
        createdCount,
      });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('[LOAD_CV_DATA_API_ERROR]', errorMessage, errorStack);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process CV data load.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
