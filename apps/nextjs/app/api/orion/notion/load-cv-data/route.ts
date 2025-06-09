import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@shared/auth';
import { Client } from '@notionhq/client';
import { NOTION_API_KEY, NOTION_DATABASE_ID } from '@shared/lib/orion_server_config';
import type { CVComponentShared } from '@shared/types/orion';

// Ensure Notion client is configured
const notion = NOTION_API_KEY ? new Client({ auth: NOTION_API_KEY }) : null;

interface LoadCvDataRequestBody {
  components: CVComponentShared[];
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
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!notion || !NOTION_DATABASE_ID) {
    return NextResponse.json({ success: false, error: 'Notion client or Database ID not configured.' }, { status: 500 });
  }

  try {
    const { components }: LoadCvDataRequestBody = await request.json();

    if (!components || !Array.isArray(components) || components.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid or empty components array in request body.' }, { status: 400 });
    }

    let createdCount = 0;
    const errors: any[] = [];

    for (const componentData of components) {
      try {
        const properties: any = {};
        if (componentData.component_name) properties['Component Name'] = { title: [{ text: { content: componentData.component_name } }] };
        if (componentData.component_type) properties['Component Type'] = { rich_text: [{ text: { content: componentData.component_type } }] };
        if (componentData.content_primary) properties['Content (Primary)'] = { rich_text: [{ text: { content: componentData.content_primary } }] };
        if (componentData.associated_company_institution) properties['Associated Company/Institution'] = { rich_text: [{ text: { content: componentData.associated_company_institution } }] };
        if (componentData.start_date) properties['Start Date'] = { date: { start: componentData.start_date } };
        if (componentData.end_date) properties['End Date'] = { date: { start: componentData.end_date } };
        if (componentData.keywords) properties['Keywords'] = { multi_select: componentData.keywords.map(k => ({ name: k })) };

        // Only attempt to create if required properties are present (Title and Content)
        if (!properties['Component Name'] || !properties['Content (Primary)']) { // Use Notion property names for check
            console.warn(`Skipping CV component due to missing required fields: ${componentData.component_name || 'Untitled'}`);
            errors.push({ component: componentData.component_name || 'Untitled', error: 'Missing required fields (Component Name or Content).' }); // Use Notion property names in error
            continue; // Skip this component
        }

        const response = await notion.pages.create({
          parent: { database_id: NOTION_DATABASE_ID! },
          properties: properties,
        });
        createdCount++;
      } catch (error: any) {
        console.error(`Error creating Notion page for CV component: ${componentData.component_name || 'Untitled'}`, error.body || error.message);
        errors.push({ component: componentData.component_name || 'Untitled', error: error.body || error.message });
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
