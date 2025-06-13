// components/orion/opportunities/OpportunityAnalysisDisplay.tsx

"use client";
import React, { useState, useEffect, useCallback } from "react";
import type { EvaluationOutput, OrionOpportunityNotionOutputShared } from '@repo/shared';
import { Loader2, AlertTriangle, RefreshCw, BarChartBig, CheckCircle, Lightbulb } from "lucide-react";
import { z } from 'zod';

interface OpportunityAnalysisDisplayProps {
  OrionOpportunity: OrionOpportunityNotionOutputShared | null;
  initialEvaluation?: EvaluationOutput | { rawOutput?: string };
}

const OpportunityNotionOutputSharedSchema = z.object({
  id: z.string(),
  notion_page_id: z.string().optional(),
  title: z.string(),
  company: z.string(),
  content: z.string().nullable().optional(),
  descriptionSummary: z.string().nullable().optional(),
  type: z.union([z.string(), z.null()]).optional(),
  status: z.union([z.string(), z.null()]).optional(),
  priority: z.union([z.string(), z.null()]).optional(),
  url: z.string().nullable().optional(),
  jobUrl: z.string().nullable().optional(),
  sourceURL: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  salary: z.string().nullable().optional(),
  contact: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  dateIdentified: z.string().nullable().optional(),
  nextActionDate: z.string().nullable().optional(),
  evaluationOutput: z.any().nullable().optional(),
  tailoredCV: z.string().nullable().optional(),
  webResearchContext: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  pros: z.array(z.string()).nullable().optional(),
  cons: z.array(z.string()).nullable().optional(),
  missingSkills: z.array(z.string()).nullable().optional(),
  contentType: z.string().nullable().optional(),
  relatedEvaluationId: z.string().nullable().optional(),
  lastStatusUpdate: z.string().nullable().optional(),
  last_edited_time: z.union([z.string(), z.date(), z.null()]).optional(),
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
    const parseResult = OpportunityNotionOutputSharedSchema.safeParse(OrionOpportunity);
    if (!parseResult.success) {
      console.error('[OpportunityNotionOutputShared] Invalid data in OpportunityAnalysisDisplay:', parseResult.error.format(), OrionOpportunity);
      throw new Error('Invalid OpportunityNotionOutputShared: ' + JSON.stringify(parseResult.error.format()));
    }
  }

  // Fetch the latest evaluation for this OrionOpportunity
  const fetchEvaluation = useCallback(async (oppId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orion/OrionOpportunity/${oppId}/evaluation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Could not fetch evaluation.");
      const data = await res.json();
      if (data.success && data.evaluation) {
        setEvaluation(data.evaluation);
      } else {
        setEvaluation(null);
      }
    } catch (err: any) {
      setError("Could not load stored evaluation. You can try generating a new one.");
      setEvaluation(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (OrionOpportunity && !initialEvaluation) {
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // The backend can fetch the details it needs using the ID
          // No need to send the whole OrionOpportunity object
        }),
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        setEvaluation(data.evaluation);
      } else {
        throw new Error(data.error || "Failed to evaluate OrionOpportunity.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to evaluate OrionOpportunity.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render risk/reward analysis
  const renderRiskReward = (rr: EvaluationOutput["riskRewardAnalysis"] | undefined) => {
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
        {evaluation === null && !isLoading ? "Run Initial Evaluation" : "Re-Evaluate OrionOpportunity"}
      </button>

      {isLoading && (
        <div className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {evaluation ? "Re-evaluating..." : "Evaluating..."}
        </div>
      )}
      {error && (
        <div className="text-red-400 p-3 bg-red-900/20 border border-red-700 rounded flex items-center">
          <AlertTriangle className="mr-2 h-4 w-4" />
          {error}
        </div>
      )}

      {evaluation && !isLoading && (
        ("rawOutput" in evaluation && evaluation.rawOutput !== undefined) ? (
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
                  <span className="text-xl text-green-400 font-bold">Orion's Evaluation Results</span>
                </div>
                <div className="text-gray-400 text-sm mb-2">
                  For: <span className="font-semibold text-gray-200">{OrionOpportunity.title}</span>
                  {OrionOpportunity.company && (
                    <> at <span className="font-semibold text-gray-200">{OrionOpportunity.company}</span></>
                  )}
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-sm text-gray-300">Fit Score:</span>{" "}
                  <span className="text-lg font-bold text-amber-400">{evalOut.fitScorePercentage ?? "N/A"}%</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-sm text-gray-300">Recommendation:</span>{" "}
                  <span className="text-green-300 font-semibold">{evalOut.recommendation ?? "N/A"}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-sm text-gray-300">Reasoning:</span>
                  <div className="text-gray-200 text-sm mt-1">{evalOut.reasoning ?? "N/A"}</div>
                </div>
                {evalOut.alignmentHighlights && (
                  <div className="mb-2">
                    <span className="font-semibold text-sm text-gray-300">Alignment Highlights:</span>
                    <ul className="list-disc ml-6 text-gray-400 text-sm">
                      {evalOut.alignmentHighlights.map((h: string, i: number) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {evalOut.gapAnalysis && (
                  <div className="mb-2">
                    <span className="font-semibold text-sm text-gray-300">Gap Analysis:</span>
                    <ul className="list-disc ml-6 text-gray-400 text-sm">
                      {evalOut.gapAnalysis.map((g: string, i: number) => (
                        <li key={i}>{g}</li>
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
                {evalOut.supportingContext && (
                  <div className="mb-2">
                    <span className="font-semibold text-sm text-gray-300">Supporting Context:</span>
                    <ul className="list-disc ml-6 text-gray-400 text-sm">
                      {evalOut.supportingContext.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-4 flex items-center text-green-400">
                  <CheckCircle className="mr-2" />
                  <span>Analysis complete. Review the results above or re-evaluate as needed.</span>
                </div>
              </div>
            );
          })()
        )
      )}

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
