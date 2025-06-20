/**
 * @fileoverview Client-side page for initiating the CV Tailoring process for a specific opportunity.
 * @description This page serves as an entry point to the CV tailoring workflow. It fetches the relevant opportunity details
 * and provides an "Auto Generate CV" button to navigate to the more detailed `tailor-content` page,
 * where the actual content generation occurs.
 * View Details -> Generate AI Evaluation -> Enter CV Tailoring Studio -> Get AI Component Suggestions -> Assemble Tailored CV -> Draft Personalized Email -> Send Email with CV Attached
 * GOAL OF FILE|FEATURES|FUNCTIONS:i want these as tabs and i don't want one process to necessarily be complete before the other. they can be orchestrated in any other.... i may not need an evaluation for an application and would then solely use web data on company and my profile. or i may want to reach out to stakeholders without generating a cv
 *   - To display a brief overview of the selected opportunity.
 *   - To act as a navigational hub for the CV tailoring process, specifically linking to the content generation step.
 *   - To provide an "Auto Generate CV" action that directs the user to `tailor-content` for AI-assisted CV content creation.
 *   - To manage loading and error states during the initial opportunity data fetch.
 *
 * FILEPATH: `app/opportunity/[opportunityId]/cv-tailoring/page.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `next/navigation`: Used for `useParams` to extract the `opportunityId` from the URL.
 *   - `next/router`: Although `next/navigation` is preferred, `useRouter` is currently used here for programmatic navigation.
 *   - `app/components/ui`: Utilizes Shadcn UI components like `Card`, `CardHeader`, `CardTitle`, `CardContent` for consistent styling.
 *   - `lucide-react`: Provides the `Loader2` icon for visual feedback during loading states.
 *   - `app/lib/types.ts`: Defines the `OrionOpportunity` type for data consistency.
 *   - `app/api/orion/opportunities/[opportunityId]/route.ts`: API endpoint for fetching detailed opportunity information.
 *   - `app/api/orion/cv-components/route.ts`: This API is called (though its data is not directly used on this page currently) before navigating to `tailor-content`.
 *   - `app/opportunity/[opportunityId]/tailor-content/page.tsx`: The primary destination after clicking "Auto Generate CV", where the core AI tailoring logic resides.
 *   - `@/components/orion/CVTailoringStudio`: This component is rendered on this page, providing the core UI for CV component selection and assembly.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `opportunityId` is correctly passed via Next.js `useParams`.
 *   - Assumes the `/api/orion/OrionOpportunity/[opportunityId]` API is functional and returns valid opportunity data.
 *   - The navigation to `tailor-content` implies that the data fetched by `cv-components` on this page (currently `cvComponents={[]}`) might be re-fetched on the destination page, which could be optimized.
 *   - Error and loading states are handled in the UI.
 *
 * NOTES:
 *   - This page primarily acts as a gateway to the more detailed `tailor-content` functionality.
 *   - The `router.push` call within the `onClick` handler of the "Auto Generate CV" button directly navigates the user, bypassing explicit data passing to the next page, assuming the next page will handle its own data fetching.
 *   - The use of `useRouter` from `next/router` is an older pattern; `next/navigation`'s `useRouter` should be preferred for new development in the App Router.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Unified Data Fetching**: Consider fetching both opportunity data and CV components in a single, batched API call if possible, or using `react-query` to manage caching and prevent redundant fetches between this page and `tailor-content`.
 *   - **Direct Data Passing**: Instead of relying on the `tailor-content` page to re-fetch data, consider passing the fetched `opportunityData` and `cvComponents` directly via URL parameters (if small) or a shared state/context, if feasible, to optimize load times.
 *   - **Refactor `useRouter`**: Update `useRouter` import from `next/router` to `next/navigation` for consistency with App Router best practices.
 *   - **Consolidate `autoGenLoading`**: The `autoGenLoading` state could potentially be managed more globally or within a shared context if the auto-generation process involves multiple steps across pages.
 *   - **Enhanced UI Feedback**: Implement `react-hot-toast` for more immediate and visually appealing user feedback on success and error messages.
 *   - **Error Handling Consistency**: Utilize `handleApiError` from `app/lib/utils/errorHandler.ts` for consistent and centralized error handling.
 */
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { CVTailoringStudio } from '@/components/orion/CVTailoringStudio';
import { OrionOpportunity } from '@/lib/types';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:

export default function CVTailoringPage() {
  const params = useParams();
  const opportunityId = params?.id as string;

  const [opportunityData, setOpportunity] = useState<OrionOpportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [autoGenLoading, setAutoGenLoading] = useState(false);
  const [autoGenError, setAutoGenError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchOpportunity() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/orion/OrionOpportunity/${opportunityId}`);
        const data = await response.json();

        if (data.success) {
          setOpportunity(data.OrionOpportunity);
        } else {
          setError(data.error || 'Failed to fetch OrionOpportunity');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    if (opportunityId) {
      fetchOpportunity();
    }
  }, [opportunityId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!opportunityData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Opportunity Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested opportunity could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CV Tailoring for {opportunityData.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">
            Tailor your CV for this opportunity using AI assistance. The system will suggest relevant components, help
            you rephrase content to match the job requirements, and assemble a final CV.
          </p>
          {/* Auto Generate CV Button */}
          <div className="mb-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50"
              disabled={autoGenLoading}
              onClick={async () => {
                setAutoGenLoading(true);
                setAutoGenError(null);
                try {
                  // Fetch all CV components for this opportunity
                  const res = await fetch(`/api/orion/cv-components?opportunityId=${opportunityId}`);
                  const data = await res.json();
                  if (!data.success) {
                    throw new Error(data.error || 'Failed to fetch CV components');
                  }
                  // Navigate to tailor content page (data will be fetched again on that page)
                  router.push(`/opportunity/${opportunityId}/tailor-content`);
                } catch (err: unknown) {
                  setAutoGenError(err instanceof Error ? err.message : 'Failed to auto-generate CV');
                } finally {
                  setAutoGenLoading(false);
                }
              }}
            >
              {autoGenLoading ? (
                <span className="flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Generating CV...
                </span>
              ) : (
                'Auto Generate CV'
              )}
            </button>
            {autoGenError && <p className="text-red-500 mt-2">{autoGenError}</p>}
          </div>

          <CVTailoringStudio opportunity={opportunityData} cvComponents={[]} />
        </CardContent>
      </Card>
    </div>
  );
}
