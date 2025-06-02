import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Client } from '@notionhq/client';
import { NOTION_API_KEY, NOTION_DATABASE_ID } from '@/lib/orion_config';
import type { CVComponentShared, NotionContentType } from '@/types/orion';

// Ensure Notion client is configured
const notion = NOTION_API_KEY ? new Client({ auth: NOTION_API_KEY }) : null;

interface LoadCvDataRequestBody {
  cvComponents: any[]; // Define a more specific type if preferred
}

interface LoadCvDataApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  createdCount?: number;
  details?: any;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<LoadCvDataApiResponse>> {
  // TEMPORARILY BYPASS AUTHENTICATION FOR LOCAL TESTING - REVERT FOR PRODUCTION!
  // const session = await getServerSession(authOptions);
  // if (!session || !session.user) {
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  if (!notion || !NOTION_DATABASE_ID) {
    return NextResponse.json({ success: false, error: 'Notion client or Database ID not configured.' }, { status: 500 });
  }

  try {
    const { cvComponents }: LoadCvDataRequestBody = await request.json();

    if (!cvComponents || !Array.isArray(cvComponents) || cvComponents.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid or empty cvComponents array in request body.' }, { status: 400 });
    }

    let createdCount = 0;
    const errors: any[] = [];

    for (const componentData of cvComponents) {
      try {
        const properties: any = {};

        // Map properties from JSON to Notion schema names
        if (componentData['Component Name']) properties['Title'] = { title: [{ text: { content: componentData['Component Name'] } }] }; // Mapped to Title
        if (componentData['Component Type']) properties['Component Type'] = { select: { name: componentData['Component Type'] } };
        if (componentData['Content (Primary)']) properties['Content'] = { rich_text: [{ text: { content: componentData['Content (Primary)'] } }] }; // Mapped to Content
        properties['Content Type'] = { select: { name: 'CV Component' as NotionContentType } }; // Content Type is always CV Component

        // Map optional array properties
        if (Array.isArray(componentData['Keywords']) && componentData['Keywords'].length > 0) {
          properties['Keywords'] = { multi_select: componentData['Keywords'].map((tag: string) => ({ name: tag })) };
        }
        if (Array.isArray(componentData['Target Role Tags']) && componentData['Target Role Tags'].length > 0) {
           properties['Tags'] = { multi_select: componentData['Target Role Tags'].map((tag: string) => ({ name: tag })) }; // Mapped to Tags
        }

        // Map other optional properties
        if (componentData['Associated Company/Institution']) properties['Company'] = { rich_text: [{ text: { content: componentData['Associated Company/Institution'] } }] }; // Mapped to Company
        if (componentData['Start Date']) properties['Start Date'] = { date: { start: componentData['Start Date'] } };
        if (componentData['End Date']) properties['End Date'] = { date: { start: componentData['End Date'] } };
        if (componentData['UniqueID']) properties['Unique ID'] = { rich_text: [{ text: { content: componentData['UniqueID'] } }] }; // Mapped to Unique ID
        if (componentData['Quantifiable Result/Metric']) { /* Optional: Map to a new field if needed, skipping for now */ }
        if (componentData['Last Updated']) properties['Date'] = { date: { start: componentData['Last Updated'] } }; // Mapped to Date


        // Only attempt to create if required properties are present (Title and Content)
        if (!properties['Title'] || !properties['Content']) { // Use Notion property names for check
             console.warn(`Skipping CV component due to missing required fields: ${componentData['Component Name'] || 'Untitled'}`);
             errors.push({ component: componentData['Component Name'] || 'Untitled', error: 'Missing required fields (Title or Content).' }); // Use Notion property names in error
             continue; // Skip this component
        }

        const response = await notion.pages.create({
          parent: { database_id: NOTION_DATABASE_ID },
          properties: properties,
        });
        createdCount++;
      } catch (error: any) {
        console.error(`Error creating Notion page for CV component: ${componentData['Component Name'] || 'Untitled'}`, error.body || error.message);
        errors.push({ component: componentData['Component Name'] || 'Untitled', error: error.body || error.message });
      }
    }

    if (errors.length > 0) {
        return NextResponse.json({ success: false, message: `Successfully created ${createdCount} CV components, but encountered errors for ${errors.length}.`, createdCount, errors }, { status: 500 });
    } else {
        return NextResponse.json({ success: true, message: `Successfully loaded ${createdCount} CV components into Notion.`, createdCount });
    }

  } catch (error: any) {
    console.error('[LOAD_CV_DATA_API_ERROR]', error.message, error.stack);
    return NextResponse.json(
      { success: false, error: 'Failed to process CV data load.', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
