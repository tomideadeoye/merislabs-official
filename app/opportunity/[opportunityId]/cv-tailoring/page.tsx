/**
 * @fileoverview CV Tailoring Page for a specific opportunity.
 * @description This file renders the main CV tailoring studio page, allowing users to select, rephrase, and assemble CV components tailored to a specific job opportunity. It fetches opportunity details and available CV components, passing them to the `CVTailoringStudio` component.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To display a dedicated interface for users to tailor their CV for a specific job opportunity.
 *   - To fetch and present details of the selected opportunity, including its job description.
 *   - To load the user's available CV components from the database.
 *   - To handle various loading and error states during data fetching.
 *   - To pass necessary data (`opportunityData`, `cvComponents`, authentication status) to the `CVTailoringStudio` child component.
 *
 * FILEPATH: `app/opportunity/[opportunityId]/cv-tailoring/page.tsx`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/components/orion/CVTailoringStudio.tsx`: The primary UI component rendered by this page, responsible for the interactive CV tailoring logic.
 *   - `@/lib/opportunity_db_service.ts`: Used to `getOpportunityByIdFromDb` to fetch the specific opportunity details.
 *   - `@/lib/cv.ts`: Used to `fetchCVComponents` to retrieve all available CV components for the user.
 *   - `@/auth.ts`: Utilized for server-side authentication (`auth()`) to determine user session and ID.
 *   - `@/lib/logger.ts`: For comprehensive logging of page load events, data fetching, and errors.
 *   - `@/lib/types.ts` & `@/lib/types/cv.ts`: Define the `OrionOpportunity` and `CVComponent` types used throughout this page and its children.
 *   - `@/lib/utils/errorHandler.ts`: Provides `HandledApplicationError` for robust error handling during data fetching.
 *   - `app/api/orion/cv/assemble/route.ts`: This page sets up the data for the API calls made by `CVTailoringStudio` (e.g., auto-generation).
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes a valid `opportunityId` is provided in the URL parameters.
 *   - Assumes the `auth()` function correctly retrieves the user session.
 *   - Assumes `getOpportunityByIdFromDb` and `fetchCVComponents` are robust and return data in expected formats or `HandledApplicationError`.
 *   - Error handling ensures a graceful user experience even if data fetching fails or an opportunity is not found.
 *
 * NOTES:
 *   - This is a server component responsible for initial data fetching and setting up the client-side `CVTailoringStudio`.
 *   - It consolidates data loading for both opportunity details and CV components into a single entry point for this feature.
 *   - The `initialError` state is crucial for displaying user-friendly messages for various failure scenarios (e.g., opportunity not found, authentication).
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Loading Skeletons**: Implement loading skeletons for better UX while `opportunityData` and `cvComponents` are being fetched.
 *   - **Caching Strategy**: Introduce a more explicit caching strategy for `fetchCVComponents` if components are static or change infrequently, to reduce database load.
 *   - **Streaming UI**: Consider using Next.js Suspense for data fetching to progressively stream UI and improve perceived performance.
 *   - **Centralized Error Display**: Integrate with a global toast or error notification system to display `initialError` more prominently across the application.
 */

import { CVTailoringStudio } from '@/components/orion/CVTailoringStudio';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getOpportunityByIdFromDb } from '@/lib/opportunity_db_service';
import logger from '@/lib/logger';
import { fetchCVComponents } from '@/lib/cv';
import { CVComponent } from '@/lib/types/cv';
import { OrionOpportunity } from '@/lib/types';
import { HandledApplicationError } from '@/lib/utils/errorHandler';

interface CVTailoringPageProps {
  params: {
    opportunityId: string;
  };
}

export default async function CVTailoringPage({ params }: CVTailoringPageProps) {
  const { opportunityId } = params;

  const logContext = {
    route: `/opportunity/${opportunityId}/cv-tailoring`,
    operation: 'page_load',
    timestamp: new Date().toISOString(),
    opportunityId,
  };

  logger.info('[CV_TAILORING_PAGE][LOAD][START]', logContext);

  let opportunityData: OrionOpportunity | null = null;
  let cvComponents: CVComponent[] = [];
  let initialError: string | null = null;

  try {
    const opportunityResult = await getOpportunityByIdFromDb(opportunityId);

    if (opportunityResult === null) {
      initialError = 'Opportunity not found.';
      logger.warn('[CV_TAILORING_PAGE][OPPORTUNITY_NOT_FOUND]', logContext);
    } else if (opportunityResult instanceof HandledApplicationError) {
      // It's a HandledApplicationError
      initialError = opportunityResult.message;
      logger.error('[CV_TAILORING_PAGE][OPPORTUNITY_FETCH_ERROR_HANDLED]', {
        ...logContext,
        error: initialError,
        details: opportunityResult,
      });
    } else {
      // It's a valid OrionOpportunity
      opportunityData = opportunityResult;
      logger.debug('[CV_TAILORING_PAGE][OPPORTUNITY_FETCHED]', { opportunityFound: !!opportunityData, ...logContext });

      // No authentication: always fetch CV components
      const fetchedComponents = await fetchCVComponents();
      cvComponents = fetchedComponents; // Assign fetched components
      logger.info('[CV_TAILORING_PAGE][CV_COMPONENTS_FETCHED]', {
        count: fetchedComponents.length,
        ...logContext,
      });
    }
  } catch (error: unknown) {
    initialError = error instanceof Error ? error.message : String(error);
    logger.error('[CV_TAILORING_PAGE][LOAD_ERROR]', {
      ...logContext,
      error: initialError,
      details: error,
    });
  }

  logger.info('[CV_TAILORING_PAGE][LOAD][END]', logContext);

  if (initialError || !opportunityData) {
    // If there's an initial error or no opportunity data after processing
    return (
      <Card className="bg-gray-800 border-gray-700 text-gray-200">
        <CardHeader>
          <CardTitle>{initialError ? 'Error Loading Page' : 'Opportunity Not Found'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">
            {initialError || 'The requested opportunity could not be found or you do not have access.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  // At this point, opportunityData is guaranteed to be OrionOpportunity
  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700 text-gray-200">
        <CardHeader>
          <CardTitle>CV Tailoring for {opportunityData.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            Tailor your CV for this opportunity using AI assistance. The system will suggest relevant components, help
            you rephrase content to match the job requirements, and assemble a final CV.
          </p>
          <CVTailoringStudio opportunity={opportunityData} cvComponents={cvComponents} />
        </CardContent>
      </Card>
    </div>
  );
}
