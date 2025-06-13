'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader, Button, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Loader2, ArrowLeft, BarChart2 } from 'lucide-react';
import { OrionOpportunity } from '@repo/shared';
import Link from 'next/link';

export default function EvaluateOpportunityPage() {
  const params = useParams();
  const opportunityId = params?.opportunityId as string | undefined;

  const router = useRouter();

  const [OrionOpportunity, setOpportunity] = useState<OrionOpportunity | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!opportunityId) {
        setError("OrionOpportunity ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`/api/orion/notion/OrionOpportunity/${opportunityId}`);
        const data = await response.json();
        if (data.success && data.OrionOpportunity) {
          setOpportunity(data.OrionOpportunity);
        } else {
          setError(data.error || 'Failed to fetch OrionOpportunity details.');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while fetching OrionOpportunity.');
      } finally {
        setLoading(false);
      }
    };

    if (opportunityId) {
      fetchOpportunity();
    }
  }, [opportunityId]);

  const handleEvaluate = async () => {
    if (!OrionOpportunity) return;
    setEvaluating(true);
    setError(null);
    try {
      // Call the Next.js API route for evaluation
      const response = await fetch(`/api/orion/OrionOpportunity/${opportunityId}/evaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          opportunityId: OrionOpportunity.id, // Assuming the API needs the OrionOpportunity ID
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
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during evaluation.');
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-4" />
        <p className="text-gray-400">Loading OrionOpportunity details for evaluation...</p>
      </div>
    );
  }

  if (!opportunityId) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Evaluation Error"
          icon={<BarChart2 className="h-7 w-7" />}
          description="Could not load OrionOpportunity for evaluation."
        />
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md">
          OrionOpportunity ID is missing from the URL.
        </div>
        <Button asChild>
          <Link href={`/admin/OrionOpportunity-pipeline`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to OrionOpportunity Pipeline
          </Link>
        </Button>
      </div>
    );
  }

  if (error || !OrionOpportunity) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Evaluation Error"
          icon={<BarChart2 className="h-7 w-7" />}
          description="Could not load OrionOpportunity for evaluation."
        />
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md">
          {error || 'OrionOpportunity not found or failed to load.'}
        </div>
        <Button asChild>
          <Link href={`/admin/OrionOpportunity-pipeline/${opportunityId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to OrionOpportunity Details
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title={`Evaluate: ${OrionOpportunity.title}`}
          icon={<BarChart2 className="h-7 w-7" />}
          description={`Evaluate the OrionOpportunity at ${OrionOpportunity.company} against your profile.`}
        />
        <Button variant="outline" size="sm" asChild className="border-gray-700">
          <Link href={`/admin/OrionOpportunity-pipeline/${opportunityId}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Details
          </Link>
        </Button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-200">OrionOpportunity Details</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-2">
          <p><strong>Job Title:</strong> {OrionOpportunity.title}</p>
          <p><strong>Company:</strong> {OrionOpportunity.company}</p>
          {OrionOpportunity.content && (
            <p><strong>Summary:</strong> {OrionOpportunity.content.substring(0, 200)}...</p>
          )}
          {OrionOpportunity.sourceURL && (
            <p><strong>Source:</strong> <a href={OrionOpportunity.sourceURL} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{OrionOpportunity.sourceURL}</a></p>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={handleEvaluate}
        disabled={evaluating || !OrionOpportunity}
        className="w-full"
      >
        {evaluating ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <BarChart2 className="mr-2 h-4 w-4" />
        )}
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
              <h4 className="text-sm font-medium text-gray-400 mb-1">Recommendation</h4>
              <p className="text-gray-300 whitespace-pre-wrap">{evaluation.recommendation}</p>
            </div>
            {/* Display other relevant evaluation details */}
            {/* Explicitly check for each optional property */}
            {evaluation.pros && evaluation.pros.length > 0 && evaluation.pros.map((item, index) => (
              <div key={`pros-${index}`}>
                {index === 0 && <h4 className="text-sm font-medium text-gray-400 mb-1">Pros</h4>}
                <ul className="list-disc list-inside text-gray-300">
                  {/* Add type annotations */}
                  <li key={index}>{item}</li>
                </ul>
              </div>
            ))}
            {evaluation.cons && evaluation.cons.length > 0 && evaluation.cons.map((item, index) => (
              <div key={`cons-${index}`}>
                {index === 0 && <h4 className="text-sm font-medium text-gray-400 mb-1">Cons</h4>}
                <ul className="list-disc list-inside text-gray-300">
                  {/* Add type annotations */}
                  <li key={index}>{item}</li>
                </ul>
              </div>
            ))}
            {evaluation.missingSkills && evaluation.missingSkills.length > 0 && evaluation.missingSkills.map((item, index) => (
              <div key={`missingSkills-${index}`}>
                {index === 0 && <h4 className="text-sm font-medium text-gray-400 mb-1">Missing Skills/Experience</h4>}
                <ul className="list-disc list-inside text-gray-300">
                  {/* Add type annotations */}
                  <li key={index}>{item}</li>
                </ul>
              </div>
            ))}
            {evaluation.scoreExplanation && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Score Explanation</h4>
                <p className="text-gray-300 whitespace-pre-wrap">{evaluation.scoreExplanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
