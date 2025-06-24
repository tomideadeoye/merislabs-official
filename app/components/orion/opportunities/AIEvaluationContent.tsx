/**
 * @fileoverview Client-side component for AI-driven opportunity evaluation.
 * @description This component allows users to trigger an AI evaluation of a given opportunity against their profile and displays the detailed evaluation results. It handles its own loading, error states, and integrates with the backend AI evaluation API.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide an interface for initiating AI evaluation of an `OrionOpportunity`.
 *   - To display the results of the AI evaluation, including fit score, strengths, areas for improvement, and next steps.
 *   - To manage client-side state for loading, evaluation progress, and errors.
 *   - To fetch the user's profile data to be used in the AI evaluation process.
 *   - To ensure a robust and user-friendly experience during the evaluation process.
 *
 * FILEPATH: `app/components/orion/opportunities/AIEvaluationContent.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/lib/types`: Imports `OrionOpportunity`, `EvaluationOutput`, and `UserProfileData` for type definitions.
 *   - `@/lib/profile_service`: Used to fetch the user's profile data (`fetchUserProfile`).
 *   - `@/lib/apiClient`: Used to make HTTP POST requests to `/api/orion/opportunity/[opportunityId]/evaluation` for triggering the AI evaluation.
 *   - `@/lib/logger`: For comprehensive logging of component actions and states.
 *   - `react-hot-toast`: Used for displaying user-friendly notifications (loading, success, error).
 *   - `@/hooks/useLocalStorage`: Persists evaluation results locally to avoid re-running evaluation unnecessarily.
 *   - `@/components/ui/button`, `@/components/ui/card`: Imports Shadcn UI components for consistent styling.
 *   - `lucide-react`: Provides icons (`Loader2`, `Sparkles`, `BarChart2`, `AlertTriangle`) for visual feedback.
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/page.tsx`: This is the parent page that will render this component, passing the `opportunity` prop.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the `opportunity` prop is provided and contains valid `OrionOpportunity` data.
 *   - Assumes `/api/orion/profile` and `/api/orion/opportunity/[opportunityId]/evaluation` API endpoints are operational.
 *   - Evaluation results are stored in local storage, providing persistence for the current user/browser.
 *
 * NOTES:
 *   - This component centralizes the AI evaluation feature, making it reusable and easier to maintain.
 *   - It provides clear visual feedback to the user throughout the evaluation process.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Server-Side Evaluation Persistence**: Consider persisting `evaluationOutput` to the database after successful evaluation for cross-device persistence.
 *   - **Real-time Progress**: For longer AI processing, explore streaming updates or a WebSocket connection for more granular progress feedback.
 *   - **Error Handling Details**: Enhance error display with more actionable insights for the user.
 *   - **Debounce API Calls**: Implement debouncing if there's a risk of rapid, redundant API calls.
 */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, BarChart2, AlertTriangle } from 'lucide-react';
import { OrionOpportunity, EvaluationOutput, UserProfileData } from '@/lib/types';
import { fetchUserProfile } from '@/lib/profile_service';
import { apiClient } from '@/lib/apiClient';
import logger from '@/lib/logger';
import { toast } from 'react-hot-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { handleClientError } from '@/lib/utils/clientErrorHandler';

interface AIEvaluationContentProps {
  opportunity: OrionOpportunity;
}

export function AIEvaluationContent({ opportunity }: AIEvaluationContentProps) {
  const localStorageKey = `orion_evaluation_${opportunity.id}`;
  const [evaluationResult, setEvaluationResult] = useLocalStorage<EvaluationOutput | null>(localStorageKey, null);
  const [userProfileData, setUserProfileData] = useState<UserProfileData | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileResult = await fetchUserProfile();
        if (profileResult && profileResult.profile) {
          setUserProfileData(profileResult.profile);
          logger.info('[AIEvaluationContent][loadUserProfile][SUCCESS]', { opportunityId: opportunity.id });
        } else {
          logger.warn('[AIEvaluationContent][loadUserProfile][FAIL]', {
            opportunityId: opportunity.id,
            error: profileResult?.error || 'Unknown profile fetch error',
          });
          // Do not set an error here, as the evaluation API route handles fetching if not provided.
        }
      } catch (err: unknown) {
        const handledProfileError = handleClientError(err, {
          opportunityId: opportunity.id,
          stage: 'profile_fetch_initial_load',
        });
        logger.error('[AIEvaluationContent][loadUserProfile][ERROR]', {
          opportunityId: opportunity.id,
          error: handledProfileError.message,
        });
        setError(`Error loading user profile: ${handledProfileError.message}. Evaluation might be incomplete.`);
      }
    };

    loadUserProfile();
  }, [opportunity.id]); // Dependency on opportunity.id to refetch profile if opportunity changes

  const handleGenerateEvaluation = async () => {
    logger.info('[AIEvaluationContent][handleGenerateEvaluation][START]', { opportunityId: opportunity.id });
    setIsEvaluating(true);
    setError(null);
    toast.loading('Orion is analyzing the opportunity...');

    const requestBody = {
      opportunityId: opportunity.id,
      userProfile: userProfileData, // Use the pre-fetched or existing user profile data
    };

    logger.debug('[AIEvaluationContent][handleGenerateEvaluation][REQUEST_BODY]', {
      opportunityId: opportunity.id,
      requestBody: requestBody,
    });

    try {
      logger.info('[AIEvaluationContent][handleGenerateEvaluation][API_CALL_START]', {
        opportunityId: opportunity.id,
        url: `/api/orion/opportunity/${opportunity.id}/evaluation`,
        method: 'POST',
      });
      const response = await apiClient.post(`/api/orion/opportunity/${opportunity.id}/evaluation`, requestBody);

      logger.info('[AIEvaluationContent][handleGenerateEvaluation][API_CALL_RESPONSE]', {
        opportunityId: opportunity.id,
        responseStatus: response.status,
        responseData: response.data,
      });

      if (response.data?.success && response.data.evaluation) {
        setEvaluationResult(response.data.evaluation);
        toast.success('Evaluation Complete! Results saved to local browser storage.');
        logger.info(`[AIEvaluationContent] Evaluation successful for opportunity: ${opportunity.id}`);
      } else {
        throw new Error(
          response.data?.error || 'Failed to generate evaluation. The server did not provide a specific error message.'
        );
      }
    } catch (err: unknown) {
      const handledError = handleClientError(err, { opportunityId: opportunity.id, stage: 'evaluation_api_call' });
      setError(handledError.message);
      toast.error(`Evaluation Failed: ${handledError.message}`);
      logger.error('[AIEvaluationContent][handleGenerateEvaluation][ERROR]', {
        opportunityId: opportunity.id,
        error: handledError.message,
      });
    } finally {
      setIsEvaluating(false);
      toast.dismiss();
      logger.info('[AIEvaluationContent][handleGenerateEvaluation][END]', { opportunityId: opportunity.id });
    }
  };

  return (
    <div className="space-y-6 p-4 rounded-lg bg-gray-800 text-gray-300 shadow-glow">
      <h3 className="text-xl font-semibold mb-4 text-purple-300">AI Evaluation</h3>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md mb-6 flex items-center space-x-3">
          <AlertTriangle className="h-6 w-6" />
          <span>{error}</span>
        </div>
      )}

      {isEvaluating && (
        <div className="flex flex-col items-center justify-center text-lg p-8">
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-blue-400 mb-4" />
          <p className="font-semibold text-blue-300">Orion is crafting your evaluation...</p>
          <p className="text-sm italic text-gray-400 mt-2">This may take a moment.</p>
        </div>
      )}

      {!isEvaluating && evaluationResult && (
        <Card className="bg-gray-700 border-gray-600 text-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-300">
              <Sparkles className="mr-2 h-5 w-5" /> Evaluation Results for {opportunity.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {evaluationResult.fitScorePercentage !== undefined && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Fit Score</h4>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div className={`bg-blue-500 h-2.5 rounded-full w-[${evaluationResult.fitScorePercentage}%]`}></div>
                </div>
                <p className="text-right text-sm text-gray-400 mt-1">{evaluationResult.fitScorePercentage}%</p>
              </div>
            )}
            {evaluationResult.strengths && evaluationResult.strengths.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Strengths</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {evaluationResult.strengths.map((item) => (
                    <li key={item.title}>{item.title}</li>
                  ))}
                </ul>
              </div>
            )}
            {evaluationResult.gaps && evaluationResult.gaps.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Areas for Improvement</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {evaluationResult.gaps.map((item, index) => (
                    <li key={index}>{typeof item === 'string' ? item : `${item.gap}: ${item.solution}`}</li>
                  ))}
                </ul>
              </div>
            )}
            {evaluationResult.suggestedNextSteps && evaluationResult.suggestedNextSteps.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Next Steps</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {evaluationResult.suggestedNextSteps.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {evaluationResult.overallFitScore !== undefined && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Confidence Score</h4>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div className={`bg-purple-500 h-2.5 rounded-full w-[${evaluationResult.overallFitScore}%]`}></div>
                </div>
                <p className="text-right text-sm text-gray-400 mt-1">{evaluationResult.overallFitScore}%</p>
              </div>
            )}
            {evaluationResult.cons && evaluationResult.cons.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Red Flags</h4>
                <ul className="list-disc list-inside text-red-300 space-y-1">
                  {evaluationResult.cons.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {evaluationResult.summary && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Overall Feedback</h4>
                <p className="text-gray-300 whitespace-pre-wrap">{evaluationResult.summary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isEvaluating && (
        <Button
          onClick={handleGenerateEvaluation}
          disabled={isEvaluating}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
        >
          {evaluationResult ? (
            <>
              <Sparkles className="mr-2 h-4 w-4" /> Re-run AI Evaluation
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" /> Generate AI Evaluation
            </>
          )}
        </Button>
      )}
    </div>
  );
}
