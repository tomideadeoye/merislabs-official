/**
 * @fileoverview API route to assemble selected CV components into a single Markdown-formatted CV.
 * @description This endpoint receives an array of `uniqueId`s for CV components, fetches their content from the database,
 * and then concatenates them into a structured Markdown string based on a predefined template (e.g., for summary and experience sections).
 * This is a critical step for generating the final CV document.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To dynamically generate a complete CV in Markdown format from user-selected components.
 *   - To query the database for specific CV component content based on provided IDs.
 *   - To structure the assembled CV according to a standard professional resume layout.
 *   - To ensure only authenticated users can trigger the CV assembly process.
 *
 * FILEPATH: `app/api/orion/cv/assemble/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `auth.ts`: Handles user authentication and session validation.
 *   - `@/lib/prisma`: Provides the Prisma client for database interactions to fetch `cVComponent` data.
 *   - `@/lib/logger`: Used for comprehensive logging of API request, assembly process, and error details.
 *   - `app/components/orion/CVTailoringStudio.tsx`: This client-side component calls this API route to assemble the selected components.
 *   - `@/lib/types`: Defines `CVComponent` interface and other relevant types used for data typing.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `componentIds` is a valid array of strings (unique IDs of CV components) in the request body.
 *   - Assumes CV component content (`c.content`) is stored in a format that can be directly embedded or JSON-parsed if necessary for the Markdown output.
 *   - The assembly logic is currently simplified for summary and experience; future enhancements might involve more types (education, skills) and dynamic ordering.
 *   - Error handling ensures that invalid inputs or database retrieval issues are gracefully managed.
 *   - Comprehensive logging aids in debugging the assembly process.
 *
 * NOTES:
 *   - The Markdown output provides a flexible intermediate format that can easily be converted to PDF or other document types in a subsequent step.
 *   - The assembly logic can be extended to support more sophisticated templating and component types.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Robust Templating Engine**: Implement a more advanced templating engine (e.g., Handlebars, Pug) for CV assembly to allow for greater customization and different CV layouts.
 *   - **Component Ordering**: Allow the user or introduce AI logic to define the order of components in the assembled CV.
 *   - **Dynamic Content Insertion**: More sophisticated handling of `JSON.parse(c.content as string)` to correctly format different content types (e.g., bullet points for achievements, paragraphs for summaries).
 *   - **Error Handling for Content Parsing**: Add specific error handling for `JSON.parse` if `c.content` is not always valid JSON.
 *   - **Validation**: Implement Zod or similar schema validation for the incoming `componentIds` array.
 *   - **PDF Generation Integration**: Integrate a PDF generation library (e.g., `puppeteer`, `html-pdf`, or a dedicated service) directly after Markdown assembly to provide a complete PDF output.
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { componentIds } = await request.json();
    logger.info('[CV_ASSEMBLE_API][REQUEST_RECEIVED]', { componentIds });
    if (!componentIds || !Array.isArray(componentIds)) {
      logger.error('[CV_ASSEMBLE_API] Invalid component IDs array provided.', { componentIds });
      return NextResponse.json({ success: false, error: 'Component IDs array is required.' }, { status: 400 });
    }

    const components = await prisma.cVComponent.findMany({ where: { uniqueId: { in: componentIds } } });
    logger.debug('[CV_ASSEMBLE_API][COMPONENTS_FETCHED]', { fetchedCount: components.length });

    // Assemble into Markdown
    let finalCvMarkdown = `# Tomide Adeoye\n\n[Your Contact Info]\n\n`;

    const summary = components.find((c) => c.type === 'Profile Summary');
    if (summary) {
      try {
        finalCvMarkdown += `## Professional Summary\n${JSON.parse(summary.content as string)}\n\n`;
        logger.debug('[CV_ASSEMBLE_API] Added Profile Summary.');
      } catch (parseError) {
        logger.warn('[CV_ASSEMBLE_API] Failed to parse Profile Summary content.', {
          componentId: summary.id,
          error: parseError,
        });
        finalCvMarkdown += `## Professional Summary\n${summary.content || '[Content not parsable]'}\n\n`;
      }
    }

    finalCvMarkdown += '## Experience\n';
    components
      .filter((c) => c.type.includes('Work Experience'))
      .forEach((exp) => {
        try {
          finalCvMarkdown += `### ${exp.name}\n${JSON.parse(exp.content as string)}\n\n`;
          logger.debug('[CV_ASSEMBLE_API] Added Work Experience.', { componentName: exp.name });
        } catch (parseError) {
          logger.warn('[CV_ASSEMBLE_API] Failed to parse Work Experience content.', {
            componentId: exp.id,
            error: parseError,
          });
          finalCvMarkdown += `### ${exp.name}\n${exp.content || '[Content not parsable]'}\n\n`;
        }
      });

    logger.success('[CV_ASSEMBLE_API] CV assembled successfully into Markdown.');
    return NextResponse.json({ success: true, tailoredCvMarkdown: finalCvMarkdown });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error.';
    logger.error('[CV_ASSEMBLE_API] Error during CV assembly.', { error: msg });
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
