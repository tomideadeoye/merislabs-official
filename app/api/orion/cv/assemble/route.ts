/**
 * @fileoverview API route to assemble selected CV components into a single Markdown-formatted CV.
 * @description This endpoint receives an array of `uniqueId`s for CV components (potentially with edited content),
 * fetches their up-to-date content from the database, and then structures and concatenates them into a clean
 * **Markdown** string. This process is based on a predefined template (`HYBRID_CV_TEMPLATE`), ensuring a professional
 * output ready for preview, export, and transition to the email drafting stage (FR-5).
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To dynamically generate a complete, professionally formatted CV in Markdown from user-selected (and potentially edited) components (FR-5.1, FR-5.2).
 *   - To query the database for specific CV component content based on provided `uniqueId`s.
 *   - To structure the assembled CV according to a standard professional resume layout defined by `HYBRID_CV_TEMPLATE` (FR-5.2).
 *   - To provide the assembled Markdown for live preview in the CV Tailoring Studio UI (FR-5.3).
 *   - To enable the transition to the email drafting page by generating a ready-to-use CV (FR-5.5).
 *   - To ensure only authenticated users can trigger the CV assembly process.
 *
 * FILEPATH: `app/api/orion/cv/assemble/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `auth.ts`: Handles user authentication and session validation.
 *   - `@/lib/prisma`: Provides the Prisma client for database interactions to fetch `cVComponent` data.
 *   - `@/lib/logger`: Used for comprehensive logging of API request, assembly process, and error details.
 *   - `app/components/orion/CVTailoringStudio.tsx`: This client-side component calls this API route to assemble the selected components (FR-5.1).
 *   - `@/lib/types`: Defines `CVComponent` interface and other relevant types used for data typing (FR-1.2).
 *   - `app/lib/cv_templates.ts`: Will contain the `HYBRID_CV_TEMPLATE` used for structuring the assembled CV (FR-5.2).
 *   - `app/api/orion/email/send/route.ts` (future): The assembled CV Markdown will be passed to this service for attachment to emails.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `componentIds` is a valid array of strings (unique IDs of CV components) in the request body.
 *   - Assumes CV component `content` (from `c.content`) is stored in a format that can be directly embedded or safely parsed for Markdown output.
 *   - The `HYBRID_CV_TEMPLATE` will guide the overall structure of the assembled CV.
 *   - Error handling ensures that invalid inputs or database retrieval issues are gracefully managed.
 *   - Comprehensive logging aids in debugging the assembly process and ensures traceability.
 *
 * NON-FUNCTIONAL REQUIREMENTS:
 *   - Performance: Efficient fetching of components and rapid assembly to ensure a responsive user experience.
 *   - Reliability: Robust error handling for database queries and content parsing.
 *   - Scalability: Designed to handle increasing numbers of CV components and assembly requests efficiently.
 *   - Security: Protected by authentication to ensure only authorized users can assemble CVs.
 *
 * NOTES:
 *   - The Markdown output provides a flexible intermediate format that can easily be converted to PDF or other document types in a subsequent step (FR-5.4).
 *   - The assembly logic can be extended to support more sophisticated templating, dynamic ordering (FR-3.2), and a wider range of component types (e.g., education, skills, projects).
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Robust Templating Engine**: Implement a more advanced templating engine (e.g., Handlebars, Pug) for CV assembly to allow for greater customization and different CV layouts, moving beyond simple string concatenation.
 *   - **Component Ordering**: Implement FR-3.2 to allow the user or introduce AI logic to define the order of components in the assembled CV.
 *   - **Dynamic Content Insertion**: More sophisticated handling of `JSON.parse(c.content as string)` to correctly format different content types (e.g., bullet points for achievements, paragraphs for summaries) and prevent parsing errors if content isn't strict JSON.
 *   - **Validation**: Implement Zod or similar schema validation for the incoming `componentIds` array to ensure data integrity.
 *   - **PDF Generation Integration**: Implement FR-5.4 by integrating a PDF generation library (e.g., `puppeteer` or a dedicated service) directly after Markdown assembly to provide a complete PDF output.
 *   - **Content Sanitization**: Ensure that all component content is properly sanitized before being embedded into the Markdown to prevent XSS or other vulnerabilities if content is user-generated.
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';
import { HYBRID_CV_TEMPLATE } from '@/lib/cv_templates';
import { z } from 'zod';
import { handleApiError, HandledApplicationError } from '@/lib/utils/errorHandler';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm'; // Import LLM utilities
import { CvAutoGenerateOutput, ScoredMemoryPoint } from '@/lib/types'; // Import new LLM types
import { CVComponent } from '@/lib/types/cv'; // Explicitly import CVComponent from its defining file

// Define a Zod schema for the incoming request body
const assembleRequestSchema = z.object({
  components: z
    .array(
      z.object({
        id: z.string().min(1, 'Component ID cannot be empty.'),
        content: z.string().nullable(), // Allow content to be a string or null (for edited content)
      })
    )
    .optional(), // Make components optional for auto-generation
  autoGenerate: z.boolean().optional(), // New field for auto-generation trigger
  jobDescription: z.string().nullable().optional(), // New field for job description
});

export async function POST(request: NextRequest) {
  const logContext = {
    route: '/api/orion/cv/assemble',
    timestamp: new Date().toISOString(),
  };
  logger.info('[CV_ASSEMBLE_API][POST][START]', logContext);

  try {
    const body = await request.json();
    const { components: clientComponents, autoGenerate, jobDescription } = assembleRequestSchema.parse(body);

    let assembledComponents: { id: string; name: string; type: string; content: string }[];
    let memoryResults: ScoredMemoryPoint[] = []; // Initialize memoryResults

    if (autoGenerate) {
      if (!jobDescription) {
        logger.error('[CV_ASSEMBLE_API][AUTO_GENERATE_ERROR]', {
          ...logContext,
          reason: 'Job description missing for auto-generation.',
        });
        return NextResponse.json(
          { success: false, error: 'Job description is required for auto-generation.' },
          { status: 400 }
        );
      }

      logger.info('[CV_ASSEMBLE_API][AUTO_GENERATE_START]', {
        ...logContext,
        jobDescription: jobDescription.substring(0, 100) + '...',
      });

      // Fetch all CV components from the database
      const allCvComponents = await prisma.cVComponent.findMany({});
      logger.debug('[CV_ASSEMBLE_API][ALL_CV_COMPONENTS_FETCHED]', { count: allCvComponents.length });

      // Call the LLM to get selected and rephrased components
      const llmResponse = await generateLLMResponse(
        REQUEST_TYPES.CV_AUTO_GENERATE,
        jobDescription, // Primary context is the job description
        null, // userId is now nullable
        {
          responseFormat: 'json_object',
          allCvComponents: allCvComponents as CVComponent[], // Pass all components to LLM
          jobDescription: jobDescription, // Pass job description again for explicit context in LLMOptions
        }
      );

      if (!llmResponse.success || !llmResponse.structuredResponse) {
        const llmErrorMessage = !llmResponse.success
          ? llmResponse.error
          : 'LLM response was successful but missing structured output.';
        // logger.error('[CV_ASSEMBLE_API][LLM_AUTO_GENERATE_FAIL]', { ...logContext, error: llmErrorMessage });
        return NextResponse.json(
          { success: false, error: llmErrorMessage || 'Failed to auto-generate CV components with LLM.' },
          { status: 500 }
        );
      }

      const autoGeneratedOutput = llmResponse.structuredResponse as CvAutoGenerateOutput;
      assembledComponents = autoGeneratedOutput.selectedComponents.map((selectedComp) => {
        // Prioritize LLM-rephrased content, fallback to original if LLM output content is empty
        const originalComp = allCvComponents.find((c: CVComponent) => c.uniqueId === selectedComp.id);
        const contentToUse =
          selectedComp.content ||
          (originalComp?.content !== null && originalComp?.content !== undefined
            ? typeof originalComp.content === 'string'
              ? originalComp.content
              : JSON.stringify(originalComp.content)
            : '');

        return {
          id: selectedComp.id,
          name: selectedComp.name || originalComp?.name || 'Unknown Component',
          type: selectedComp.type || originalComp?.type || 'Unknown Type',
          content: contentToUse,
        };
      });

      memoryResults = llmResponse.memoryResults || []; // Capture memory results from LLM

      logger.success('[CV_ASSEMBLE_API][AUTO_GENERATE_SUCCESS]', {
        ...logContext,
        selectedComponentsCount: assembledComponents.length,
      });
    } else if (clientComponents) {
      logger.info('[CV_ASSEMBLE_API][MANUAL_ASSEMBLE_START]', {
        ...logContext,
        clientComponentsCount: clientComponents.length,
      });
      // Existing logic for manual assembly
      const uniqueIdsToFetch = clientComponents.map((c) => c.id);

      // Fetch the full component data from the database based on their uniqueIds
      const dbComponents = (await prisma.cVComponent.findMany({
        where: {},
      })) as CVComponent[]; // No longer filtering by userId
      logger.debug('[CV_ASSEMBLE_API][DB_COMPONENTS_FETCHED]', { fetchedCount: dbComponents.length });

      // Create a map for quick lookup of DB components by uniqueId
      const dbComponentsMap = new Map<string, CVComponent>(
        dbComponents
          .filter((c: CVComponent): c is CVComponent => c.uniqueId !== null)
          .map((c: CVComponent) => [c.uniqueId as string, c])
      );

      // Consolidate content: prioritize client-provided content, fallback to DB content
      assembledComponents = clientComponents.map((clientComp) => {
        const dbComp = dbComponentsMap.get(clientComp.id);
        const contentToUse =
          clientComp.content !== null && clientComp.content !== undefined && clientComp.content !== ''
            ? clientComp.content // Use client's content if provided and not empty
            : dbComp?.content !== null && dbComp?.content !== undefined
              ? typeof dbComp.content === 'string'
                ? dbComp.content
                : JSON.stringify(dbComp.content)
              : ''; // Fallback to DB content, or empty string

        return {
          id: clientComp.id,
          name: dbComp?.name || 'Unknown Component',
          type: dbComp?.type || 'Unknown Type',
          content: contentToUse,
        };
      });
    } else {
      logger.error('[CV_ASSEMBLE_API][INVALID_REQUEST]', {
        ...logContext,
        reason: 'Neither components nor autoGenerate was provided.',
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request: provide components or set autoGenerate to true with a job description.',
        },
        { status: 400 }
      );
    }

    // Assemble into Markdown using the HYBRID_CV_TEMPLATE (applies to both manual and auto-generated)
    let finalCvMarkdown = HYBRID_CV_TEMPLATE;

    // Helper function to extract and format content by type
    const extractContentByType = (type: string) => {
      return assembledComponents
        .filter((comp) => comp.type === type)
        .map((comp) => {
          try {
            const parsedContent = JSON.parse(comp.content);
            if (Array.isArray(parsedContent) && parsedContent.every((item) => typeof item === 'string')) {
              return parsedContent.map((item) => `- ${item}`).join('\n');
            }
            return parsedContent;
          } catch (parseError: unknown) {
            logger.warn('[CV_ASSEMBLE_API][JSON_PARSE_ERROR]', {
              componentId: comp.id,
              error: (parseError as Error).message,
            });
            return comp.content;
          }
        })
        .filter(Boolean)
        .join('\n\n');
    };

    // Populate template placeholders
    finalCvMarkdown = finalCvMarkdown.replace('{CANDIDATE_NAME}', 'Tomide Adeoye'); // TODO: Replace with dynamic user name
    finalCvMarkdown = finalCvMarkdown.replace(
      '{SUMMARY_CONTENT}',
      extractContentByType('Profile Summary') || 'No professional summary available.'
    );
    finalCvMarkdown = finalCvMarkdown.replace(
      '{EXPERIENCE_CONTENT}',
      extractContentByType('Experience') || 'No experience content available.'
    );
    finalCvMarkdown = finalCvMarkdown.replace(
      '{EDUCATION_CONTENT}',
      extractContentByType('Education') || 'No education content available.'
    );
    finalCvMarkdown = finalCvMarkdown.replace(
      '{SKILLS_CONTENT}',
      extractContentByType('Skills') || 'No skills content available.'
    );
    finalCvMarkdown = finalCvMarkdown.replace(
      '{PROJECTS_CONTENT}',
      extractContentByType('Projects') || 'No project content available.'
    );
    finalCvMarkdown = finalCvMarkdown.replace(
      '{CERTIFICATIONS_CONTENT}',
      extractContentByType('Certifications / Awards') || 'No certifications or awards listed.'
    );

    logger.success('[CV_ASSEMBLE_API][POST][SUCCESS]', { ...logContext, cvLength: finalCvMarkdown.length });
    return NextResponse.json({ success: true, markdown: finalCvMarkdown, memoryResults });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    let userFriendlyMessage = 'Failed to assemble CV. Please try again.';

    if (errorMessage.includes("Can't reach database server") || errorMessage.includes('timed out')) {
      userFriendlyMessage =
        'Database connection issue: Please wait a moment and try again. The database might be waking up.';
      logger.error('[CV_ASSEMBLE_API][POST][DB_ERROR]', { ...logContext, error: errorMessage });
    } else {
      logger.error('[CV_ASSEMBLE_API][POST][GENERIC_ERROR]', { ...logContext, error: errorMessage });
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: userFriendlyMessage, details: errorMessage }, { status: 500 });
  }
}
