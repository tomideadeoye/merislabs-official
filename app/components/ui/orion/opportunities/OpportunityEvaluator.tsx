'use client';

// GOAL OF FILE|FEATURES|FUNCTIONS: Provides a form to input opportunity details and trigger an AI-driven evaluation against the user's profile. Displays the evaluation results.
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/components/ui/orion/opportunities/OpportunityEvaluator.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Consumed by `OpportunityPipelinePage` (`app/(orion_admin)/admin/opportunity-pipeline/page.tsx`) in the "Evaluator" tab.
//   - Calls backend API route `/api/orion/OrionOpportunity/evaluate` (POST) to perform the evaluation.
//   - Uses `@/lib/types` for `OpportunityType` and `EvaluationOutput` types.
//   - Uses `@/components/ui` components (`Input`, `Textarea`, `Button`, `Label`, `Card`).
import { OpportunityType, EvaluationOutput, OpportunityEvaluationInput } from '@/lib/types';
import { Input, Textarea, Button, Label, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Loader2, BarChart2, AlertCircle, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';

interface OpportunityEvaluatorProps {
  className?: string;
}

export const OpportunityEvaluator: React.FC<OpportunityEvaluatorProps> = ({ className }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [type, setType] = useState<OpportunityType>(OpportunityType.JOB);
  const [url, setUrl] = useState<string>('');

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<EvaluationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !company.trim() || !content.trim()) {
      setError('Opportunity title, company, and content are required.');
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const opportunityDetails: OpportunityEvaluationInput = {
        title: title.trim(),
        description: content.trim(),
        type: type,
        url: url.trim(),
      };
      console.log('[OpportunityEvaluator] Constructed opportunityDetails:', opportunityDetails);

      const response = await fetch('/api/orion/OrionOpportunity/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(opportunityDetails),
      });

      const data = await response.json();

      if (data.success) {
        setEvaluation(data.evaluation);
      } else {
        throw new Error(data.error || 'Failed to evaluate Opportunity');
      }
    } catch (error: unknown) {
      console.error('Error evaluating Opportunity:', error);
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">
                Opportunity Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="e.g., Senior Software Engineer at CloudScale"
                className="bg-gray-700 border-gray-600 text-gray-200"
                required
              />
            </div>

            <div>
              <Label htmlFor="company" className="text-gray-300">
                Company *
              </Label>
              <Input
                id="company"
                value={company}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setCompany(e.target.value);
                  console.log('[OpportunityEvaluator] Company changed:', e.target.value);
                }}
                placeholder="Enter company name"
                className="bg-gray-700 border-gray-600 text-gray-200"
                required
              />
            </div>

            <div>
              <Label htmlFor="type" className="text-gray-300">
                Type
              </Label>
              <select
                id="type"
                value={type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value as OpportunityType)}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 p-2"
              >
                <option value={OpportunityType.JOB}>Job</option>
                <option value={OpportunityType.EDUCATION_PROGRAM}>Education Program</option>
                <option value={OpportunityType.PROJECT_COLLABORATION}>Project/Collaboration</option>
                <option value={OpportunityType.FUNDING}>Funding</option>
                <option value={OpportunityType.OTHER}>Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="url" className="text-gray-300">
                URL (Optional)
              </Label>
              <Input
                id="url"
                value={url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                placeholder="e.g., https://example.com/job-posting"
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-gray-300">
                Content *
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setContent(e.target.value);
                  console.log('[OpportunityEvaluator] Content changed:', e.target.value);
                }}
                placeholder="Paste the job content or Opportunity details here..."
                className="min-h-[200px] bg-gray-700 border-gray-600 text-gray-200"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isEvaluating || !title.trim() || !company.trim() || !content.trim()}
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Evaluate Opportunity
                </>
              )}
            </Button>

            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}
          </form>
        </div>

        <div>
          {evaluation ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-blue-400" />
                  Evaluation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Overall Fit Score</h3>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${
                          (evaluation.fitScorePercentage || 0) >= 75
                            ? 'bg-green-500'
                            : (evaluation.fitScorePercentage || 0) >= 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                        style={{
                          width: `${evaluation.fitScorePercentage || 0}%`,
                        }}
                      ></div>
                    </div>
                    <span className="ml-4 font-semibold text-lg">
                      {evaluation.fitScorePercentage?.toFixed(0) || 'N/A'}%
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Recommendation</h3>
                  <p
                    className={`text-lg font-semibold ${
                      evaluation.recommendation === 'Proceed'
                        ? 'text-green-400'
                        : evaluation.recommendation === 'Caution'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                    }`}
                  >
                    {evaluation.recommendation || 'Not Evaluated'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Reasoning</h3>
                  <p className="text-sm text-gray-400">{evaluation.reasoning || 'No reasoning provided.'}</p>
                </div>

                {evaluation.alignmentHighlights && evaluation.alignmentHighlights.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-1 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-400" />
                      Alignment Highlights
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {evaluation.alignmentHighlights.map(
                        (highlight: { title: string; reasoning: string }, index: number) => (
                          <li key={index} className="text-sm text-gray-300">
                            <strong>{highlight.title}</strong>: {highlight.reasoning}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {evaluation.gapAnalysis && evaluation.gapAnalysis.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1 text-yellow-400" />
                      Gap Analysis
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {evaluation.gapAnalysis.map((gap: { skill: string; reasoning: string }, index: number) => (
                        <li key={index} className="text-sm text-gray-300">
                          <strong>{gap.skill}</strong>: {gap.reasoning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {evaluation.suggestedNextSteps && evaluation.suggestedNextSteps.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-1">Suggested Next Steps</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {evaluation.suggestedNextSteps.map((step: string, index: number) => (
                        <li key={index} className="text-sm text-gray-300">
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <BarChart2 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Opportunity Evaluator</h3>
              <p className="text-gray-400">
                Enter Opportunity details on the left to evaluate how well it aligns with your profile and goals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
