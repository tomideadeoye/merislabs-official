// components/orion/opportunities/OpportunityAnalysisDisplay.tsx
// GOAL OF FILE|FEATURES|FUNCTIONS: Displays the results of an opportunity evaluation. Allows triggering a re-evaluation via a backend API call. Handles loading, errors, and displays structured evaluation data or raw LLM output if parsing fails.
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/components/ui/orion/opportunities/OpportunityAnalysisDisplay.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Consumed by `OpportunityDetailView` (`app/components/ui/orion/opportunities/OpportunityDetailView.tsx`).
//   - Calls backend API route `/api/orion/OrionOpportunity/[opportunityId]/evaluation` (POST) to fetch or trigger evaluation.
//   - Uses `@/lib/types` for `OpportunityNotionOutputlib` and `EvaluationOutput` types.
// Note if any: components to merge with, similar or redundant component
'use client';
import React, { useState, useEffect, useCallback } from 'react';

import { Loader2, AlertTriangle, RefreshCw, BarChartBig } from 'lucide-react';
import { z } from 'zod';
import {
  OrionOpportunity,
  EvaluationOutput,
  EvaluationGapDetail,
  OpportunityType,
  OpportunityStatus,
  OpportunityPriority,
} from '@/lib/types';

interface OpportunityAnalysisDisplayProps {
  OrionOpportunity: OrionOpportunity | null;
  initialEvaluation?: EvaluationOutput | { rawOutput?: string };
}

const OrionOpportunitySchema = z.object({
  id: z.string(),
  notionPageId: z.string().optional(),
  title: z.string(),
  company: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  type: z.union([z.nativeEnum(OpportunityType), z.null()]).optional(), // Use nativeEnum for enum types
  status: z.union([z.nativeEnum(OpportunityStatus), z.null()]).optional(),
  priority: z.union([z.nativeEnum(OpportunityPriority), z.null()]).optional(),
  url: z.string().nullable().optional(),
  dateIdentified: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  contactPerson: z.string().nullable().optional(),
  contactEmail: z.string().nullable().optional(),
  stage: z.string().nullable().optional(),
  attachments: z.array(z.string()).optional(),
  relatedEvaluationId: z.string().nullable().optional(),
  sourceUrl: z.string().nullable().optional(),
  nextActionDate: z.string().nullable().optional(),
  tailoredCv: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  salary: z.string().nullable().optional(),
  contact: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
  lastStatusUpdate: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  applicationMaterialIds: z.array(z.string()).optional(),
  evaluationOutput: z.any().nullable().optional(),
  webResearchContext: z.string().nullable().optional(),
  pros: z.array(z.string()).nullable().optional(),
  cons: z.array(z.string()).nullable().optional(),
  missingSkills: z.array(z.string()).nullable().optional(),
  contentType: z.string().nullable().optional(),
  lastEditedTime: z.union([z.string(), z.date(), z.null()]).optional(),
  tags: z.array(z.string()).optional(),
});

export const OpportunityAnalysisDisplay: React.FC<OpportunityAnalysisDisplayProps> = ({
  OrionOpportunity,
  initialEvaluation,
}) => {
  const [evaluation, setEvaluation] = useState<EvaluationOutput | { rawOutput?: string } | null>(
    initialEvaluation || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (OrionOpportunity) {
    const parseResult = OrionOpportunitySchema.safeParse(OrionOpportunity);
    if (!parseResult.success) {
      console.error(
        '[OpportunityAnalysisDisplay] Invalid data in OrionOpportunity:',
        parseResult.error.format(),
        OrionOpportunity
      );
      throw new Error('Invalid OrionOpportunity: ' + JSON.stringify(parseResult.error.format()));
    }
  }

  // Fetch the latest evaluation for this OrionOpportunity
  const fetchEvaluation = useCallback(async (oppId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orion/OrionOpportunity/${oppId}/evaluation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error('Could not fetch evaluation.');
      const data = await res.json();
      if (data.success && data.evaluation) {
        setEvaluation(data.evaluation);
      } else {
        setEvaluation(null);
      }
    } catch (error: unknown) {
      let errorMessage = 'Could not load stored evaluation. You can try generating a new one.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      setEvaluation(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (OrionOpportunity && OrionOpportunity.id && !initialEvaluation) {
      fetchEvaluation(OrionOpportunity.id);
    } else if (initialEvaluation) {
      setEvaluation(initialEvaluation);
    }
  }, [OrionOpportunity, fetchEvaluation, initialEvaluation]);

  // Trigger a new evaluation
  const handleTriggerEvaluation = async () => {
    if (!OrionOpportunity) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orion/OrionOpportunity/${OrionOpportunity.id}/evaluation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // The backend can fetch the details it needs using the ID
          // No need to send the whole OrionOpportunity object
        }),
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        setEvaluation(data.evaluation);
      } else {
        throw new Error(data.error || 'Failed to evaluate OrionOpportunity.');
      }
    } catch (error: unknown) {
      let errorMessage = 'Failed to evaluate OrionOpportunity.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Render risk/reward analysis
  const renderRiskReward = (rr: EvaluationOutput['riskRewardAnalysis'] | undefined) => {
    if (!rr) return null;
    return (
      <div className="mb-2">
        <div className="font-semibold text-sm text-gray-300 mb-1">Risk/Reward Analysis:</div>
        <ul className="list-disc ml-6 text-gray-400 text-sm">
          {Object.entries(rr).map(([k, v]) => (
            <li key={k}>
              <span className="font-medium text-gray-200">{k}:</span> {String(v)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (!OrionOpportunity) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        <p className="ml-2 text-gray-400">Loading OrionOpportunity data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={handleTriggerEvaluation}
        disabled={isLoading}
        className="mb-4 px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white flex items-center"
      >
        {isLoading && evaluation === null ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="mr-2 h-4 w-4" />
        )}
        {evaluation === null && !isLoading ? 'Run Initial Evaluation' : 'Re-Evaluate OrionOpportunity'}
      </button>

      {isLoading && (
        <div className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {evaluation ? 'Re-evaluating...' : 'Evaluating...'}
        </div>
      )}
      {error && (
        <div className="text-red-400 p-3 bg-red-900/20 border border-red-700 rounded flex items-center">
          <AlertTriangle className="mr-2 h-4 w-4" />
          {error}
        </div>
      )}

      {evaluation &&
        !isLoading &&
        ('rawOutput' in evaluation && evaluation.rawOutput !== undefined ? (
          <div className="border border-yellow-500/50 bg-yellow-900/30 rounded p-4">
            <div className="flex items-center text-yellow-400 font-bold mb-2">
              <AlertTriangle className="mr-2" />
              Evaluation Output (Raw)
            </div>
            <div className="text-gray-400 text-sm mb-1">LLM output was not valid JSON. Showing raw text:</div>
            <pre className="whitespace-pre-wrap text-xs text-gray-300 mt-2 p-2 bg-gray-700 rounded">
              {evaluation.rawOutput}
            </pre>
          </div>
        ) : (
          (() => {
            const evalOut = evaluation as EvaluationOutput;
            return (
              <div className="bg-gray-800 border border-gray-700 rounded p-4">
                <div className="flex items-center mb-2">
                  <BarChartBig className="h-6 w-6 text-green-400 mr-2" />
                  <span className="text-xl text-green-400 font-bold">Orion&apos;s Evaluation Results</span>
                </div>
                <div className="text-gray-400 text-sm mb-2">
                  For: <span className="font-semibold text-gray-200">{OrionOpportunity.title}</span>
                  {OrionOpportunity.company && (
                    <>
                      {' '}
                      at <span className="font-semibold text-gray-200">{OrionOpportunity.company}</span>
                    </>
                  )}
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-sm text-gray-300">Fit Score:</span>{' '}
                  <span className="text-lg font-bold text-amber-400">{evalOut.fitScorePercentage ?? 'N/A'}%</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-sm text-gray-300">Recommendation:</span>{' '}
                  <span className="text-green-300 font-semibold">{evalOut.recommendation ?? 'N/A'}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-sm text-gray-300">Reasoning:</span>
                  <div className="text-gray-200 text-sm mt-1">{evalOut.reasoning ?? 'N/A'}</div>
                </div>
                {evalOut.alignmentHighlights && (
                  <div className="mb-2">
                    <span className="font-semibold text-sm text-gray-300">Alignment Highlights:</span>
                    <ul className="list-disc ml-6 text-gray-400 text-sm">
                      {evalOut.alignmentHighlights.map((h: { title: string; reasoning: string }, i: number) => (
                        <li key={i}>
                          <strong>{h.title}</strong>: {h.reasoning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {evalOut.gaps && (
                  <div className="mb-2">
                    <span className="font-semibold text-sm text-gray-300">Gaps:</span>
                    <ul className="list-disc ml-6 text-gray-400 text-sm">
                      {evalOut.gaps.map((g, i: number) => (
                        <li key={i}>{typeof g === 'string' ? g : `${g.gap}: ${g.solution}`}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {renderRiskReward(evalOut.riskRewardAnalysis)}
                {evalOut.suggestedNextSteps && (
                  <div className="mb-2">
                    <span className="font-semibold text-sm text-gray-300">Suggested Next Steps:</span>
                    <ul className="list-disc ml-6 text-gray-400 text-sm">
                      {evalOut.suggestedNextSteps.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {evalOut.overallAnalysis && (
                  <div className="mb-2">
                    <span className="font-semibold text-sm text-gray-300">Overall Analysis:</span>
                    <div className="text-gray-200 text-sm mt-1">{evalOut.overallAnalysis}</div>
                  </div>
                )}
                {evalOut.potentialRecommendations && (
                  <div className="mb-2">
                    <span className="font-semibold text-sm text-gray-300">Potential Recommendations:</span>
                    <ul className="list-disc ml-6 text-gray-400 text-sm">
                      {evalOut.potentialRecommendations.map((r: string, i: number) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {evalOut.fitScoreExplanation && (
                  <div className="mb-2">
                    <span className="font-semibold text-sm text-gray-300">Fit Score Explanation:</span>
                    <div className="text-gray-200 text-sm mt-1">{evalOut.fitScoreExplanation}</div>
                  </div>
                )}
                {evalOut.cvComponentSuggestions && (
                  <div className="mb-2">
                    <span className="font-semibold text-sm text-gray-300">CV Component Suggestions:</span>
                    <ul className="list-disc ml-6 text-gray-400 text-sm">
                      {evalOut.cvComponentSuggestions.map((s: { component: string; reasoning: string }, i: number) => (
                        <li key={i}>
                          <strong>{s.component}</strong>: {s.reasoning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()
        ))}

      {!evaluation && !isLoading && !error && (
        <div className="text-center py-10 text-gray-500">
          <p>No evaluation has been run for this OrionOpportunity yet, or it could not be loaded.</p>
          <p>Click the button above to generate an analysis.</p>
        </div>
      )}
    </div>
  );
};

export default OpportunityAnalysisDisplay;
