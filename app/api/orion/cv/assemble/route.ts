import { NextRequest, NextResponse } from 'next/server';
import { fetchCVComponentsFromNotion } from '@/lib/notion_service';
import { CVComponentShared } from '@/types/orion';

/**
 * API route for assembling a CV from selected components
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { selected_component_ids, template_name, header_info, tailored_content_map } = body;

    if (!selected_component_ids || !Array.isArray(selected_component_ids) || selected_component_ids.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Selected component IDs are required'
      }, { status: 400 });
    }

    if (!template_name) {
      return NextResponse.json({
        success: false,
        error: 'Template name is required'
      }, { status: 400 });
    }

    // Fetch all available CV components
    const componentsResult = await fetchCVComponentsFromNotion();
    if (!componentsResult.success || !componentsResult.components) {
      return NextResponse.json({ success: false, error: componentsResult.error || 'Failed to fetch CV components' }, { status: 500 });
    }
    const allComponents = componentsResult.components;

    // Filter and process selected components
    const assembledContent: string[] = [];

    if (header_info) {
      assembledContent.push(header_info);
      assembledContent.push('---'); // Separator
    }

    selected_component_ids.forEach((componentId: string) => {
      const component = allComponents.find((comp: CVComponentShared) => comp.unique_id === componentId);
      if (component) {
        // Use tailored content if available, otherwise use original content
        const contentToUse = tailored_content_map?.[componentId] || component.content_primary;
        if (contentToUse) {
          assembledContent.push(`**${component.component_name}**`); // Add component name as a heading
          assembledContent.push(contentToUse);
          assembledContent.push(''); // Add a blank line after each component content
        }
      }
    });

    // Join the assembled content into a single string
    const finalCV = assembledContent.join('\n');

    return NextResponse.json({ success: true, assembled_cv: finalCV });
  } catch (error: any) {
    console.error('Error in CV assembly:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred in CV assembly'
    }, { status: 500 });
  }
}
