/**
 * @fileoverview The interactive client-side view for a single opportunity, serving as the central "Command Center" for managing and progressing through the Opportunity Super-Flow.
 * @description This component displays detailed information about a specific `OrionOpportunity` and provides interactive buttons to trigger key actions within the opportunity lifecycle, such as AI evaluation and transitioning to CV tailoring. It now features a tabbed interface to manage various aspects of an opportunity, including job description, AI evaluation, and future communication tools.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To display comprehensive details of a selected `OrionOpportunity` within a tabbed interface.
 *   - To initiate and manage the AI-driven evaluation process for the opportunity by calling the relevant backend API.
 *   - To store the AI evaluation results in local storage for persistence and quick access.
 *   - To provide clear visual feedback to the user on loading states, evaluation progress, and any errors.
 *   - To serve as the navigation hub for the subsequent stages of the Opportunity Super-Flow, which are accessible independently and non-sequentially, through distinct tabs.
 *
 * FULL OPPORTUNITY SUPER-FLOW WORKFLOW (Non-Sequential & Tab-Based Access):
 *   Orion's Opportunity Super-Flow is designed for flexibility. While a natural progression exists, each major step can be initiated independently or revisited as needed. Data dependencies are handled gracefully (e.g., if evaluation isn't complete, LLMs will prioritize available profile and web data).
 *   These steps are envisioned as distinct 'tabs' or action points from the Opportunity Detail 'Command Center':
 *   1. View Details (this component - now within "Job Description" tab)
 *   2. Generate AI Evaluation (triggered from within "AI Evaluation" tab, not a prerequisite for other steps)
 *   3. Enter CV Tailoring Studio (navigated from this component, can be accessed without prior evaluation)
 *   4. Get AI Component Suggestions (within CV Tailoring Studio)
 *   5. Assemble Tailored CV (within CV Tailoring Studio)
 *   6. Draft Personalized Email (future functionality, within a dedicated tab in this component)
 *   7. Send Email with CV Attached (future functionality, triggered from this component)
 *   8. Engage Stakeholders (merge outreach folder, python api 8000 /api/find_stakeholders, within a dedicated tab in this component)
 *
 * the opportunity type could be a propsal
 *
 * FILEPATH: `app/components/ui/orion/opportunities/OpportunityDetailView.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `next/navigation`: Uses `useRouter` for programmatic navigation between pages.
 *   - `@/hooks/useLocalStorage`: Persists evaluation results locally to improve user experience.
 *   - `@/lib/types`: Imports `OrionOpportunity` and `EvaluationOutput` for strict type-checking of data models.
 *   - `@/lib/apiClient`: Used to make HTTP requests to backend API routes (e.g., `/api/orion/profile`, `/api/orion/opportunity/[opportunityId]/evaluation`).
 *   - `@/lib/logger`: Provides comprehensive logging for actions and states within the component.
 *   - `react-hot-toast`: Used for displaying user-friendly success, loading, and error notifications.
 *   - `@/components/ui/button`, `@/components/ui/card`, `@/components/ui/tabs`: Imports Shadcn UI components for consistent styling and interaction, including the new tab system.
 *   - `lucide-react`: Provides icons (`Loader2`, `Sparkles`, `FileText`, `Send`, `BarChart2`, `AlertTriangle`) for visual feedback.
 *   - `@/lib/utils/errorHandler`: Centralized utility for consistent API error handling and message extraction.
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/page.tsx`: This is the parent page that renders this `OpportunityDetailView` component, passing the `opportunity` prop.
 *   - `app/api/orion/profile/route.ts`: API endpoint for fetching user profile data.
 *   - `app/api/orion/opportunity/[opportunityId]/evaluation/route.ts`: API endpoint for generating AI evaluation of an opportunity.
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/cv-tailoring/page.tsx`: The target page for navigating to the CV tailoring studio.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that the `opportunity` prop is provided and contains valid `OrionOpportunity` data.
 *   - Assumes backend API endpoints (`/api/orion/profile`, `/api/orion/opportunity/[opportunityId]/evaluation`) are operational and return data in the expected format.
 *   - Evaluation results are stored in the browser's local storage; this means they are client-specific and not persisted across devices or browsers.
 *   - The component actively manages its own loading and error states for user feedback.
 *   - Crucially, the workflow allows for non-linear progression: actions like 'Draft Personalized Email' or 'Engage Stakeholders' can proceed using available profile, opportunity, and web data, even if a formal AI evaluation hasn't been explicitly triggered or completed.
 *   - The new tabs enhance the modularity and user experience, allowing quick access to different opportunity-related functionalities.
 *
 * NOTES:
 *   - This component centralizes the user interaction flow for individual opportunities, streamlining the process of evaluation, application preparation, and communication management.
 *   - Comprehensive logging helps in debugging the client-side flow and API interactions.
 *   - The use of `react-hot-toast` provides a delightful and consistent user feedback experience.
 *   - The tabbed interface improves the organization of features related to an opportunity.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Server-Side Evaluation Persistence**: Instead of relying solely on local storage, persist the `evaluationOutput` directly to the `OrionOpportunity` record in the Neon database via the `opportunity_db_service` or a dedicated API endpoint after a successful evaluation.
 *   - **Progress Indicators**: For longer evaluation times, consider a more granular progress indicator (e.g., a progress bar or step-by-step messages).
 *   - **Debounce Evaluation Trigger**: If `handleGenerateEvaluation` can be called rapidly, consider debouncing the function to prevent multiple concurrent API calls.
 *   - **Refine Error Display**: While `toast.error` is present, consider displaying more specific error details in the UI for advanced debugging by the user, perhaps in an expandable alert.
 *   - **Offline Mode/Optimistic UI**: For a truly seamless experience, explore optimistic UI updates or basic offline capabilities if `useLocalStorage` is extended for more features.
 *   - **Test Coverage**: Implement comprehensive unit and integration tests for this component, focusing on user interaction flows, state changes, API call handling, and error display.
 *   - **Dynamic Tab Content Loading**: For performance, consider lazily loading tab content only when a tab is activated, especially for complex or data-intensive tabs.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - The `handleGenerateEvaluation` logic, especially the profile fetching and API calling, could potentially be extracted into a custom hook (`useOpportunityEvaluation`) to reduce component-level boilerplate and promote reusability if similar evaluation triggers appear elsewhere.
 *   - Error handling and toast notifications could be further centralized or wrapped in a custom hook for even greater consistency across the application's client-side.
 */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { OrionOpportunity, EvaluationOutput } from '@/lib/types';
import { apiClient } from '@/lib/apiClient';
import logger from '@/lib/logger';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles, FileText, Send, BarChart2 } from 'lucide-react';
import { handleApiError, HandledError } from '@/lib/utils/errorHandler';
import { AlertTriangle } from 'lucide-react';

interface Props {
  opportunity: OrionOpportunity;
}

export function OpportunityDetailView({ opportunity }: Props) {
  logger.info('[OpportunityDetailView][RENDER]', { opportunityId: opportunity.id, function: 'OpportunityDetailView' });
  const router = useRouter();
  const localStorageKey = `orion_evaluation_${opportunity.id}`;
  const [evaluationResult, setEvaluationResult] = useLocalStorage<EvaluationOutput | null>(localStorageKey, null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateEvaluation = async () => {
    logger.info('[OpportunityDetailView][handleGenerateEvaluation][START]', { opportunityId: opportunity.id });
    setIsEvaluating(true);
    setError(null);
    toast.loading('Orion is analyzing the opportunity...');

    let userProfile;
    try {
      const profileResponse = await apiClient.get('/api/orion/profile');
      if (profileResponse.data?.success && profileResponse.data?.profile) {
        userProfile = profileResponse.data.profile;
        logger.info('[OpportunityDetailView][handleGenerateEvaluation][PROFILE_FETCH_SUCCESS]', {
          opportunityId: opportunity.id,
          profileSource: profileResponse.data.source,
        });
      } else {
        logger.warn('[OpportunityDetailView][handleGenerateEvaluation][PROFILE_FETCH_FAIL]', {
          opportunityId: opportunity.id,
          error: profileResponse.data?.error || 'Unknown profile fetch error',
        });
        toast.error('Could not load user profile. Evaluation might be incomplete.');
      }
    } catch (profileError: unknown) {
      const handledProfileError = handleApiError(profileError, {
        opportunityId: opportunity.id,
        stage: 'profile_fetch',
      });
      setError(handledProfileError.message);
      toast.error(`Error fetching user profile: ${handledProfileError.message}. Evaluation might be incomplete.`);
    }

    const requestBody = {
      opportunityId: opportunity.id,
      userProfile: userProfile,
    };

    logger.debug('[OpportunityDetailView][handleGenerateEvaluation][REQUEST_BODY]', {
      opportunityId: opportunity.id,
      requestBody: requestBody,
    });

    try {
      logger.info('[OpportunityDetailView][handleGenerateEvaluation][API_CALL_START]', {
        opportunityId: opportunity.id,
        url: `/api/orion/opportunity/${opportunity.id}/evaluation`,
        method: 'POST',
      });
      const response = await apiClient.post(`/api/orion/opportunity/${opportunity.id}/evaluation`, requestBody);

      logger.info('[OpportunityDetailView][handleGenerateEvaluation][API_CALL_RESPONSE]', {
        opportunityId: opportunity.id,
        responseStatus: response.status,
        responseData: response.data,
      });

      if (response.data?.success && response.data.evaluation) {
        setEvaluationResult(response.data.evaluation);
        toast.success('Evaluation Complete! Results saved to local browser storage.');
        logger.info(`[OpportunityDetailView] Evaluation successful for opportunity: ${opportunity.id}`);
      } else {
        throw new Error(
          response.data?.error || 'Failed to generate evaluation. The server did not provide a specific error message.'
        );
      }
    } catch (err: unknown) {
      const handledError = handleApiError(err, { opportunityId: opportunity.id, stage: 'evaluation_api_call' });
      setError(handledError.message);
      toast.error(`Evaluation Failed: ${handledError.message}`);
    } finally {
      setIsEvaluating(false);
      toast.dismiss();
      logger.info('[OpportunityDetailView][handleGenerateEvaluation][END]', { opportunityId: opportunity.id });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Tabs defaultValue="job-description" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="job-description">Job Description</TabsTrigger>
            <TabsTrigger value="ai-evaluation">AI Evaluation</TabsTrigger>
            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
            <TabsTrigger value="email-linkedin-draft">Email & LinkedIn Drafts</TabsTrigger>
          </TabsList>
          <TabsContent value="job-description" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{opportunity.content || 'No description available.'}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-evaluation" className="space-y-6">
            {isEvaluating && (
              <div className="flex items-center justify-center text-lg p-4">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Evaluation...
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-lg flex items-center shadow-lg">
                <AlertTriangle className="h-6 w-6 mr-3" />
                <div>
                  <h3 className="font-bold mb-1">Error</h3>
                  <div>{error}</div>
                </div>
              </div>
            )}

            {evaluationResult && !isEvaluating && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Evaluation Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-lg mb-2">Key Strengths:</h4>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    {evaluationResult.strengths?.map(
                      (strength: { title: string; reasoning: string }, index: number) => (
                        <li key={index}>{strength.title}</li>
                      )
                    )}
                  </ul>

                  <h4 className="font-semibold text-lg mb-2">Areas for Improvement:</h4>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    {evaluationResult.gaps?.map((gap: string | { gap: string; solution: string }, index: number) => (
                      <li key={index}>{typeof gap === 'string' ? gap : gap.gap}</li>
                    ))}
                  </ul>

                  <h4 className="font-semibold text-lg mb-2">Actionable Advice:</h4>
                  <p className="whitespace-pre-wrap">{evaluationResult.actionableAdvice?.join('\n')}</p>
                </CardContent>
              </Card>
            )}

            {/* Buttons for AI Evaluation and CV Tailoring */}
            <div className="flex space-x-4 mt-6">
              <Button onClick={handleGenerateEvaluation} disabled={isEvaluating} className="flex items-center">
                {isEvaluating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate AI Evaluation
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  logger.info('[OpportunityDetailView][NAVIGATE_TO_CV_TAILORING]', { opportunityId: opportunity.id });
                  router.push(`/admin/opportunity-pipeline/${opportunity.id}/cv-tailoring`);
                }}
                className="flex items-center"
              >
                <FileText className="mr-2 h-5 w-5" />
                Go to CV Tailoring Studio
              </Button>
            </div>
          </TabsContent>

          {/* Placeholder for future tabs */}
          <TabsContent value="stakeholders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stakeholder Engagement (Future)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">This section will allow you to identify and engage key stakeholders.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email-linkedin-draft" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email & LinkedIn Drafts (Future)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  This section will enable drafting personalized emails and LinkedIn messages.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="md:col-span-1 space-y-6">
        {/* Opportunity Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Opportunity Details</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>
              <strong>Company:</strong> {opportunity.company}
            </p>
            <p>
              <strong>Status:</strong> {opportunity.status}
            </p>
            {opportunity.type && (
              <p>
                <strong>Type:</strong> {opportunity.type}
              </p>
            )}
            {opportunity.sourceUrl && (
              <p>
                <strong>Source:</strong> {opportunity.sourceUrl}
              </p>
            )}
            {opportunity.url && (
              <p>
                <strong>Link:</strong>{' '}
                <a
                  href={opportunity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {opportunity.url}
                </a>
              </p>
            )}
            {opportunity.notes && (
              <>
                <h4 className="font-semibold mt-4 mb-2">Notes:</h4>
                <p className="whitespace-pre-wrap">{opportunity.notes}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
