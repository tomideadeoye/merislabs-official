import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import * as z from 'zod'; // Import Zod for schema validation

// Define the schema for the request body using Zod
const CompanySearchRequestSchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty'),
});

interface CompanySearchResponse {
  success: boolean;
  results?: {
    companyName: string;
    overview: string;
    website: string | null;
    linkedinUrl: string | null;
    industry: string | null;
    headquarters: string | null;
    employeeCount: string | null;
    // Add more fields as needed
  }[];
  error?: string;
  details?: any; // For debugging, should be removed in production
}

export async function POST(request: NextRequest): Promise<NextResponse<CompanySearchResponse>> {
  const logContext = {
    operation: 'POST /api/orion/research/company',
    timestamp: new Date().toISOString(),
  };
  logger.info('[COMPANY_SEARCH_API][START] Initiating company research POST request.', logContext);

  let requestBody;
  try {
    requestBody = await request.json();
    logger.debug('[COMPANY_SEARCH_API][BODY_PARSE][SUCCESS] Request body parsed.', {
      ...logContext,
      body: requestBody,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[COMPANY_SEARCH_API][BODY_PARSE][ERROR] Failed to parse request body as JSON.', {
      ...logContext,
      errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ success: false, error: 'Invalid JSON in request body.' }, { status: 400 });
  }

  // Validate the request body against the schema
  const validationResult = CompanySearchRequestSchema.safeParse(requestBody);

  if (!validationResult.success) {
    logger.warn('[COMPANY_SEARCH_API][VALIDATION_FAIL] Request body validation failed.', {
      ...logContext,
      errors: validationResult.error.errors,
    });
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request parameters.',
        details: validationResult.error.errors,
      },
      { status: 400 }
    );
  }

  const { query } = validationResult.data;

  try {
    logger.info('[COMPANY_SEARCH_API][SEARCH] Starting company search for query.', { ...logContext, query });

    // TODO: Implement actual company search logic here.
    // This could involve calling an external API, scraping, or looking up in a database.
    // For now, return a mock response.

    const mockCompanyResults = [
      {
        companyName: query,
        overview: `This is a mock overview for ${query}. It is a leading company in the fintech sector.`, // Mock overview
        website: `https://www.${query.toLowerCase().replace(/\s/g, '')}.com`,
        linkedinUrl: `https://www.linkedin.com/company/${query.toLowerCase().replace(/\s/g, '')}`,
        industry: 'Fintech',
        headquarters: 'San Francisco, CA',
        employeeCount: '500-1000',
      },
    ];

    logger.success('[COMPANY_SEARCH_API][SUCCESS] Company search completed successfully.', {
      ...logContext,
      query,
      resultsCount: mockCompanyResults.length,
    });
    return NextResponse.json({ success: true, results: mockCompanyResults }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during company search.';
    logger.error('[COMPANY_SEARCH_API][ERROR] Failed during company search.', {
      ...logContext,
      errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
