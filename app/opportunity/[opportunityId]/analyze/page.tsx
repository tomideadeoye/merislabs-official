/**
 * @fileoverview Displays a detailed analysis view for a specific opportunity, including its AI-driven evaluation and a toggle to view overall pipeline analytics.
 * @description This page component serves as a central hub for Tomide to deep-dive into a single opportunity. It fetches the opportunity's details and its associated AI evaluation (if available or generated), presenting key insights. Additionally, it offers a capability to switch to a broader view of the entire opportunity pipeline for high-level analytics.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To fetch and display comprehensive details of a single `OrionOpportunity` based on its ID.
 *   - To trigger and display the AI-driven evaluation results for the specific opportunity, leveraging `userProfileData` for context.
 *   - To provide a toggle mechanism for viewing either the single opportunity's analytics or a consolidated view of all pipeline opportunities.
 *   - To ensure robust loading, error handling, and data fetching for both opportunity details and evaluation.
 *
 * FILEPATH: `app/opportunity/[opportunityId]/analyze/page.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `next/navigation`: Uses `useParams` and `notFound` for route parameter extraction and routing control.
 *   - `@/lib/types`: Imports `EvaluationOutput`, `OrionOpportunity`, and `UserProfileData` for strict type definitions.
 *   - `@/lib/profile_service`: Uses `fetchUserProfile` to retrieve Tomide's profile data, which is crucial context for the AI evaluation.
 *   - `@/lib/logger`: Integrated for comprehensive, context-rich logging throughout the data fetching and evaluation process.
 *   - `app/components/ui`: Imports `CardContent` for UI structuring.
 *   - `app/(orion_admin)/admin/opportunity-pipeline/OpportunityPipelineCharts.tsx`: This component is consumed here to render visualizations for both single opportunity and overall pipeline analytics.
 *   - API Routes:
 *     - `/api/orion/opportunity/[id]`: Fetches individual opportunity details.
 *     - `/api/orion/opportunity/list`: Fetches all opportunities for the pipeline analytics view.
 *     - `/api/orion/opportunity/[opportunityId]/evaluation`: Triggers the AI evaluation of the opportunity, passing user profile context.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that the `opportunityId` will always be present in the URL parameters when this page is accessed.
 *   - Assumes the AI evaluation API (`/api/orion/opportunity/[opportunityId]/evaluation`) is operational and returns a consistent `EvaluationOutput` structure.
 *   - User profile data is critical for accurate evaluation; the component attempts to fetch it and logs a warning if unavailable.
 *   - The component handles initial loading states and displays an error if opportunity data cannot be fetched or processed.
 *
 * NOTES:
 *   - This page is distinct from direct opportunity interaction or creation forms; its primary role is analytical display.
 *   - Critical debug logs (using `console.error`) are explicitly included for tracing data flow and payload content during the evaluation request, especially for `userProfile` data. These should be removed after comprehensive debugging in a production environment.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Real-time Updates**: Implement client-side data revalidation or websockets to automatically update opportunity details or evaluation results if they change in the backend.
 *   - **User Feedback**: Integrate a more user-friendly toast notification system (e.g., Shadcn `useToast`) for loading, success, and error states, rather than just `console.error` for non-critical issues.
 *   - **Dynamic Evaluation**: Allow re-running evaluation from the UI on this page.
 *   - **Interactive Charts**: Enhance `OpportunityPipelineCharts` with more interactive features (e.g., drill-down, tooltips, filtering by criteria beyond status).
 *   - **Memory Integration**: Automatically search and display relevant memories about the company or role alongside the opportunity details and evaluation.
 *   - **Comparison View**: Introduce a feature to compare the current opportunity's evaluation against other selected opportunities in the pipeline.
 *   - **Actionable Advice Integration**: More prominently display and provide actionable tools based on `suggestedNextSteps` from the evaluation (e.g., directly create Habitica tasks, draft emails).
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - The logic for fetching and processing `userProfileData` is shared with `OpportunityDetailView.tsx`. This could potentially be further centralized in a `useUserProfile` hook or a dedicated utility that ensures consistent fetching and error handling.
 */
'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { EvaluationOutput, OrionOpportunity, UserProfileData } from '@/lib/types';
import { fetchUserProfile } from '@/lib/profile_service';
import logger from '@/lib/logger';

import { CardContent } from '@/components/ui';
import { OpportunityPipelineCharts } from '../../../(orion_admin)/admin/opportunity-pipeline/OpportunityPipelineCharts';

// Fetch a single OrionOpportunity from the API
async function fetchOpportunity(id: string): Promise<OrionOpportunity | null> {
  try {
    const res = await fetch(`/api/orion/opportunity/${id}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      logger.error('Opportunity API returned error status:', { opportunityId: id, status: res.status });
      return null;
    }
    const data = await res.json();
    return data.opportunity as OrionOpportunity;
  } catch (error) {
    logger.error('Error fetching opportunity:', { opportunityId: id, error: error });
    return null;
  }
}

// Fetch all opportunities for pipeline analytics
async function fetchAllOpportunities(): Promise<OrionOpportunity[]> {
  try {
    const res = await fetch('/api/orion/opportunity/list', {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      logger.error('Opportunities list API returned error status:', { status: res.status });
      return [];
    }
    const data = await res.json();
    return data.opportunities as OrionOpportunity[];
  } catch (error) {
    logger.error('Error fetching all opportunities:', { error: error });
    return [];
  }
}

export default function AnalyzePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id || '';
  const [OrionOpportunity, setOpportunity] = useState<OrionOpportunity | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationOutput | null>(null);
  const [allOpportunities, setAllOpportunities] = useState<OrionOpportunity[]>([]);
  const [viewMode, setViewMode] = useState<'single' | 'pipeline'>('single');
  const [loading, setLoading] = useState(true);
  const [userProfileData, setUserProfileData] = useState<UserProfileData | null>(null);

  // Fetch evaluation with profile source and error
  async function fetchEvaluationWithSource(
    opportunityId: string,
    userProfile: UserProfileData | null
  ): Promise<EvaluationOutput | null> {
    try {
      if (!userProfile) {
        console.error('[AnalyzePage] User profile is missing. Cannot perform evaluation. (CRITICAL DEBUG)', {
          opportunityId: opportunityId,
          source: 'fetchEvaluationWithSource',
          details: 'userProfile is null or undefined',
        });
        return null;
      }

      // Force console.error for critical debug logs
      console.error('[AnalyzePage] UserProfile object before JSON.stringify: (CRITICAL DEBUG)', {
        userProfileData: userProfile,
      });
      try {
        console.error('[AnalyzePage] UserProfile object structure (keys): (CRITICAL DEBUG)', {
          keys: Object.keys(userProfile),
        });
        console.error('[AnalyzePage] UserProfile.summary (sample): (CRITICAL DEBUG)', {
          summarySample: String(userProfile.summary).substring(0, 200),
        });
      } catch (logError: unknown) {
        console.error('[AnalyzePage] Could not log detailed userProfile structure: (CRITICAL DEBUG)', {
          logErrorMessage: logError instanceof Error ? logError.message : String(logError),
        });
      }

      console.error('[AnalyzePage] Preparing evaluation request with UserProfile. (CRITICAL DEBUG)', {
        opportunityId: opportunityId,
        userProfileExists: !!userProfile,
        userProfileKeys: userProfile ? Object.keys(userProfile) : [],
        userProfileContent: userProfile ? JSON.stringify(userProfile).substring(0, 500) : 'N/A',
      });

      const requestBody = JSON.stringify({
        opportunityId: opportunityId,
        userProfile: userProfile,
      });

      // Direct dump of the stringified requestBody before sending
      console.error('[AnalyzePage] RAW REQUEST BODY TO BE SENT: (CRITICAL DEBUG)', requestBody);

      console.error('[AnalyzePage] Sending evaluation request with body: (CRITICAL DEBUG)', {
        opportunityId: opportunityId,
        requestBodySample: requestBody.substring(0, 500),
        requestBodyLength: requestBody.length,
      });

      const res = await fetch(`/api/orion/opportunity/${opportunityId}/evaluation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
        cache: 'no-store',
      });
      if (!res.ok) {
        logger.error('Evaluation API returned error status:', {
          opportunityId: opportunityId,
          status: res.status,
          statusText: res.statusText,
        });
        return null;
      }
      const data = await res.json();
      return data.evaluation as EvaluationOutput | null;
    } catch (error) {
      logger.error('Error fetching evaluation with source:', {
        opportunityId: opportunityId,
        errorMessage: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      return null;
    }
  }

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // First, fetch the user profile data
        let currentProfileData: UserProfileData | null = userProfileData;
        if (!currentProfileData) {
          const profileResult = await fetchUserProfile();
          if (profileResult && profileResult.profile) {
            currentProfileData = profileResult.profile;
            setUserProfileData(currentProfileData);
            logger.info('[AnalyzePage] User profile fetched for evaluation.', {
              userProfileExists: !!currentProfileData,
            });
          } else {
            logger.warn('[AnalyzePage] Failed to fetch user profile for evaluation.', { error: profileResult?.error });
            setLoading(false); // Stop loading as we cannot fetch evaluation
            return; // Exit early from fetchData
          }
        }

        logger.info('[AnalyzePage] User profile data before evaluation API call.', {
          currentProfileDataExists: !!currentProfileData,
          currentProfileDataKeys: currentProfileData ? Object.keys(currentProfileData) : [],
        });

        let evalResult: EvaluationOutput | null = null;
        if (currentProfileData) {
          evalResult = await fetchEvaluationWithSource(id, currentProfileData);
        } else {
          logger.error('[AnalyzePage] Cannot perform evaluation: User profile data is missing after fetch attempt.', {
            opportunityId: id,
          });
          // We can optionally show a toast notification here as well.
        }

        const [opp, allOpps] = await Promise.all([fetchOpportunity(id), fetchAllOpportunities()]);

        if (!mounted) return;
        setOpportunity(opp);
        setEvaluation(evalResult);
        setAllOpportunities(allOpps);
      } catch (error) {
        logger.error('Error fetching data:', {
          errorMessage: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [id, userProfileData]); // Add userProfileData to dependency array

  if (loading) {
    return <div className="p-8">Loading analytics...</div>;
  }

  if (!OrionOpportunity) {
    notFound();
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">OrionOpportunity Analysis</h1>
      <div className="mb-4">
        <button
          onClick={() => setViewMode('single')}
          className={`mr-2 px-4 py-2 rounded cursor-pointer ${viewMode === 'single' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-white'}`}
        >
          This OrionOpportunity
        </button>
        <button
          onClick={() => setViewMode('pipeline')}
          className={`px-4 py-2 rounded cursor-pointer ${viewMode === 'pipeline' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-white'}`}
        >
          Pipeline Analytics
        </button>
      </div>

      {viewMode === 'single' && (
        <>
          <p className="mb-2">
            <strong>OrionOpportunity ID:</strong> {OrionOpportunity.id}
          </p>
          <p className="mb-2">
            <strong>Title:</strong> {OrionOpportunity.title}
          </p>
          <p className="mb-2">
            <strong>Organization:</strong> {OrionOpportunity.companyOrInstitution || 'N/A'}
          </p>
          <p className="mb-2">
            <strong>Status:</strong> {OrionOpportunity.status}
          </p>
          <p className="mb-2">
            <strong>Type:</strong> {OrionOpportunity.type}
          </p>
          <p className="mb-2">
            <strong>Priority:</strong> {OrionOpportunity.priority}
          </p>
          <p className="mb-2">
            <strong>Description:</strong> {OrionOpportunity.content || 'No description'}
          </p>
          <div className="my-8">
            <OpportunityPipelineCharts opportunities={[OrionOpportunity]} isLoading={loading} />
          </div>
          {evaluation && (
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">Evaluation Summary</h3>
                  <p className="text-gray-300">{evaluation.summary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-purple-300 mb-2">Missing Skills / Gaps</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {evaluation.gaps?.map((item, i: number) => (
                        <li key={i}>{typeof item === 'string' ? item : `${item.gap}: ${item.solution}`}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-purple-300 mb-2">Matching Highlights</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {evaluation.alignmentHighlights?.map((item, i: number) => (
                        <li key={i}>{typeof item === 'string' ? item : `${item.title}: ${item.reasoning}`}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-purple-300 mb-2">Strengths</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {evaluation.strengths?.map((item, i: number) => (
                      <li key={i}>{typeof item === 'string' ? item : `${item.title}: ${item.reasoning}`}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-purple-300 mb-2">Suggested Next Steps</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {evaluation.suggestedNextSteps?.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          )}
        </>
      )}

      {viewMode === 'pipeline' && (
        <div className="my-8">
          <OpportunityPipelineCharts opportunities={allOpportunities} isLoading={loading} />
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Suggestions for Enhanced Analytics</h2>
        <ul className="list-disc list-inside ml-5">
          <li>Show OrionOpportunity status and priority trends over time (timeline chart).</li>
          <li>Compare this OrionOpportunity to others in the pipeline (fit score, type, etc.).</li>
          <li>Visualize stakeholder alignment and risk as charts.</li>
          <li>Enable filtering and drill-down for related opportunities.</li>
          <li>Display a timeline of key events and status changes for this OrionOpportunity.</li>
          <li>Integrate evaluation/analysis results directly into the analytics view.</li>
        </ul>
      </div>
    </div>
  );
}
