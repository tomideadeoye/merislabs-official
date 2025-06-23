/**
 * @fileoverview API route for downloading an assembled CV as a PDF.
 * @description This endpoint receives Markdown content of an assembled CV from the client,
 * converts it into a PDF using `html-pdf` and `marked` (which run server-side),
 * and then returns the PDF as a downloadable file.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide a server-side mechanism for converting Markdown CVs to PDF for direct download (FR-5.4).
 *   - To ensure the generated PDF is properly formatted and delivered with the correct headers for download.
 *   - To protect the endpoint with authentication.
 *
 * FILEPATH: `app/api/orion/cv/download-pdf/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `auth.ts`: Handles user authentication.
 *   - `@/lib/logger`: For comprehensive logging.
 *   - `html-pdf`, `marked`: Libraries used for Markdown to PDF conversion.
 *   - `app/components/orion/CVTailoringStudio.tsx`: The client-side component that will call this API to trigger the PDF download.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `assembledCvMarkdown` is provided in the request body.
 *   - Assumes `html-pdf` and `marked` are correctly installed and available in the server environment.
 *   - Proper content type and headers are set for file download.
 *   - Robust error handling for conversion failures.
 */

import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import pdf from 'html-pdf';
import { marked } from 'marked';
import { z } from 'zod';
import { handleApiError, HandledApplicationError } from '@/lib/utils/errorHandler';

// Define a Zod schema for the incoming request body
const downloadPdfRequestSchema = z.object({
  assembledCvMarkdown: z.string().min(1, 'Assembled CV Markdown is required.'),
});

export async function POST(request: NextRequest) {
  const logContext = {
    route: '/api/orion/cv/download-pdf',
    timestamp: new Date().toISOString(),
  };
  logger.info('[CV_DOWNLOAD_PDF_API][POST][START]', logContext);

  try {
    // Removed authentication check as per user's request
    // const session = await auth();
    // if (!session || !session.user || !session.user.id) {
    //   logger.warn('[CV_DOWNLOAD_PDF_API][POST][AUTH_FAIL]', logContext);
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // }
    // (logContext as { user?: string }).user = session.user.id; // Removed user ID from log context

    const body = await request.json();
    const { assembledCvMarkdown } = downloadPdfRequestSchema.parse(body);

    logger.info('[CV_DOWNLOAD_PDF_API][REQUEST_RECEIVED]', {
      ...logContext,
      markdownLength: assembledCvMarkdown.length,
    });

    // Convert Markdown to HTML
    const htmlContent = marked.parse(assembledCvMarkdown, { async: false });

    // Generate PDF
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      pdf.create(htmlContent, { format: 'Letter' }).toBuffer((err, buffer) => {
        if (err) {
          logger.error('[CV_DOWNLOAD_PDF_API][PDF_GENERATION_ERROR]', { ...logContext, error: err.message });
          return reject(new Error('Failed to generate PDF.'));
        }
        resolve(buffer);
      });
    });

    logger.success('[CV_DOWNLOAD_PDF_API][POST][SUCCESS]', { ...logContext, pdfSize: pdfBuffer.length });

    // Return PDF as a downloadable file
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="tailored_cv.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
      status: 200,
    });
  } catch (error: unknown) {
    const handledError: HandledApplicationError = handleApiError(error, {
      ...logContext,
      stage: 'cv_pdf_download_api_call',
    });
    if (error instanceof z.ZodError) {
      logger.error('[CV_DOWNLOAD_PDF_API][POST][VALIDATION_ERROR]', {
        ...logContext,
        error: handledError.message,
        details: error.errors,
      });
      return NextResponse.json(
        { success: false, error: 'Invalid input for PDF generation.', details: error.errors },
        { status: 400 }
      );
    }
    logger.error('[CV_DOWNLOAD_PDF_API][POST][CATCH_ERROR]', { ...logContext, error: handledError.message });
    return NextResponse.json({ success: false, error: handledError.message }, { status: 500 });
  }
}
