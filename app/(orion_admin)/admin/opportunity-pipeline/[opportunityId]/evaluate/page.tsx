'use client';

// GOAL OF FILE|FEATURES|FUNCTIONS: Displays a specific opportunity and allows the user to trigger an AI-driven evaluation of that opportunity against their profile. Shows the evaluation results.
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/evaluate/page.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Uses `useParams` (`next/navigation`) to get the `opportunityId` from the URL.
//   - Fetches opportunity details from `/api/orion/notion/opportunity/[opportunityId]`.
//   - Triggers evaluation by calling `/api/orion/opportunity/[opportunityId]/evaluation` (POST).
//   - Uses `@/components/ui` components (`PageHeader`, `Button`, `Card`, `Loader2`) for the UI.
//   - Uses `OrionOpportunity` and `EvaluationOutput` types (`@/lib/types`).
// next steps if any:

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Loader2, ArrowLeft, BarChart2 } from 'lucide-react';
// Corrected to direct relative import due to persistent alias resolution issues in deep paths
import Link from 'next/link';
import { OrionOpportunity, EvaluationOutput } from '@/lib/types';

export default function EvaluateOpportunityPage() {
  const params = useParams();
  const opportunityId = params?.opportunityId as string | undefined;

  // Renamed variable to avoid conflict with the imported type
  const [opportunityDetails, setOpportunityDetails] = useState<OrionOpportunity | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!opportunityId) {
        setError('Opportunity ID is missing.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`/api/orion/notion/opportunity/${opportunityId}`);
        const data = await response.json();
        if (data.success && data.opportunity) {
          setOpportunityDetails(data.opportunity);
        } else {
          setError(data.error || 'Failed to fetch Opportunity details.');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while fetching Opportunity.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (opportunityId) {
      fetchOpportunity();
    }
  }, [opportunityId]);

  const handleEvaluate = async () => {
    if (!opportunityDetails) return;
    setEvaluating(true);
    setError(null);
    try {
      // Call the Next.js API route for evaluation
      const response = await fetch(`/api/orion/opportunity/${opportunityId}/evaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          opportunityId: opportunityDetails.id, // Assuming the API needs the Opportunity ID
          // Include any other necessary data like JD, profile, etc.
          // For now, let's assume the API fetches JD/profile internally
        }),
      });

      const data = await response.json();

      if (data.success && data.evaluation) {
        setEvaluation(data.evaluation);
      } else {
        setError(data.error || 'Failed to perform evaluation.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during evaluation.');
      }
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-4" />
        <p className="text-gray-400">Loading Opportunity details for evaluation...</p>
      </div>
    );
  }

  if (!opportunityId) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Evaluation Error"
          icon={<BarChart2 className="h-7 w-7" />}
          description="Could not load Opportunity for evaluation."
        />
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md">
          Opportunity ID is missing from the URL.
        </div>
        <Button asChild>
          <Link href={`/admin/opportunity-pipeline`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Opportunity Pipeline
          </Link>
        </Button>
      </div>
    );
  }

  if (error || !opportunityDetails) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Evaluation Error"
          icon={<BarChart2 className="h-7 w-7" />}
          description="Could not load Opportunity for evaluation."
        />
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md">
          {error || 'Opportunity not found or failed to load.'}
        </div>
        <Button asChild>
          <Link href={`/admin/opportunity-pipeline/${opportunityId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Opportunity Details
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title={`Evaluate: ${opportunityDetails.title}`}
          icon={<BarChart2 className="h-7 w-7" />}
          description={`Evaluate the Opportunity at ${opportunityDetails.company} against your profile.`}
        />
        <Button variant="outline" size="sm" asChild className="border-gray-700">
          <Link href={`/admin/opportunity-pipeline/${opportunityId}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Details
          </Link>
        </Button>
      </div>

      {error && <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md mb-6">{error}</div>}

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-200">Opportunity Details</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-2">
          <p>
            <strong>Job Title:</strong> {opportunityDetails.title}
          </p>
          <p>
            <strong>Company:</strong> {opportunityDetails.company}
          </p>
          {opportunityDetails.content && (
            <p>
              <strong>Summary:</strong> {opportunityDetails.content.substring(0, 200)}...
            </p>
          )}
          {opportunityDetails.sourceUrl && (
            <p>
              <strong>Source:</strong>{' '}
              <a
                href={opportunityDetails.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {opportunityDetails.sourceUrl}
              </a>
            </p>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleEvaluate} disabled={evaluating || !opportunityDetails} className="w-full">
        {evaluating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart2 className="mr-2 h-4 w-4" />}
        {evaluation ? 'Re-run Evaluation' : 'Run Evaluation'}
      </Button>

      {evaluation && (
        <Card className="bg-gray-800 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-gray-200">Evaluation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Fit Score</h4>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${evaluation.fitScorePercentage || 0}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-gray-400 mt-1">{evaluation.fitScorePercentage || 0}%</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Strengths</h4>
              {evaluation.strengths && evaluation.strengths.length > 0 ? (
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {evaluation.strengths.map((item: { title: string; reasoning: string }) => (
                    <li key={item.title}>{item.title}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No specific strengths identified.</p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Areas for Improvement</h4>
              {evaluation.gaps && evaluation.gaps.length > 0 ? (
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {evaluation.gaps.map((item: { skill: string; reasoning: string }) => (
                    <li key={item.skill}>
                      {item.skill}: {item.reasoning}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No specific areas for improvement identified.</p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Next Steps</h4>
              {evaluation.suggestedNextSteps && evaluation.suggestedNextSteps.length > 0 ? (
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {evaluation.suggestedNextSteps.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No specific next steps identified.</p>
              )}
            </div>
            {evaluation.overallFitScore && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Confidence Score</h4>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${evaluation.overallFitScore || 0}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-400 mt-1">{evaluation.overallFitScore || 0}%</p>
              </div>
            )}
            {evaluation.cons && evaluation.cons.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Red Flags</h4>
                <ul className="list-disc list-inside text-red-300 space-y-1">
                  {evaluation.cons.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {evaluation.summary && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Overall Feedback</h4>
                <p className="text-gray-300 whitespace-pre-wrap">{evaluation.summary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
