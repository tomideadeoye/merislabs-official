import { NextResponse } from 'next/server';
import { NOTION_CV_DATABASE_ID } from '@/lib/orion_config';
import { Client } from '@notionhq/client';
import type {
    QueryDatabaseResponse,
    PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { parseNotionPageProperties } from '@/lib/notion_service'; // Assuming parseNotionPageProperties is in notion_service
import type { CVComponentShared } from '@/types/orion'; // Assuming CVComponentShared is in types/orion

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function GET() {
    if (!notion || !NOTION_CV_DATABASE_ID) {
        console.error("Notion client or CV Database ID not configured.");
        return NextResponse.json({ success: false, error: "Notion client or CV Database ID not configured." }, { status: 500 });
    }
    try {
        console.log('Fetching CV components directly from Notion...');

        const response: QueryDatabaseResponse = await notion.databases.query({
            database_id: NOTION_CV_DATABASE_ID,
             // Add sorts if needed, e.g., by a "Order" number property or "Last Edited"
            // sorts: [{ property: "ComponentOrder", direction: "ascending" }]
        });

        const components: CVComponentShared[] = response.results.map((page): CVComponentShared => {
            if (!('properties' in page)) { // Type guard for PartialPageObjectResponse
                console.warn(`Page ${page.id} is missing properties.`);
                // Return a minimal valid object to avoid breaking the map
                return { notionPageId: page.id, unique_id: page.id, component_name: 'Error: Missing Properties', component_type: 'Unknown', content_primary: '' };
            }
            const props = parseNotionPageProperties(page.properties);

            // Defensive access for date properties, similar to Python fix
            const startDateProp = props['Start Date']; // Use bracket notation for property names with spaces
            const endDateProp = props['End Date'];

            return {
                // Map your Notion property names to your CVComponentShared type fields
                // Ensure your Notion DB has properties like "UniqueID", "ComponentName", "ComponentType", etc.
                notionPageId: page.id, // Store Notion page ID
                unique_id: props['UniqueID'] || page.id, // Use UniqueID property or page.id as fallback
                component_name: props['ComponentName'] || 'Untitled Component', // Use ComponentName property
                component_type: props['ComponentType'] || 'Uncategorized', // Use ComponentType property
                content_primary: props['ContentPrimary'] || '', // Use ContentPrimary property
                keywords: props['Keywords'] || [], // Use Keywords property (assuming multi-select/text) - ensure parseNotionPageProperties handles this
                associated_company_institution: props['AssociatedCompany'], // Use AssociatedCompany property
                start_date: startDateProp ? startDateProp : undefined, // Use parsed date or undefined
                end_date: endDateProp ? endDateProp : undefined, // Use parsed date or undefined
                // ... map other CV component fields
            } as CVComponentShared; // Cast needed if types aren't perfectly aligned yet
        });

         return NextResponse.json({ success: true, components });

    } catch (error: any) {
        console.error('Error in GET /api/orion/cv/components:', error.body || error.message);
         // Check for Notion API specific errors
        if (error.code === 'object_not_found') {
             console.error(`Ensure database ID '${NOTION_CV_DATABASE_ID}' is correct and shared with the integration.`);
        } else if (error.code === 'unauthorized') {
             console.error('Notion API key is invalid or missing permissions.');
        }
        return NextResponse.json(
            { success: false, error: error.message || 'An unexpected error occurred while fetching CV components.' },
            { status: error.status || 500 }
        );
    }
}
