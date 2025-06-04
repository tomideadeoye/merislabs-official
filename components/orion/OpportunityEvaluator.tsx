"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Loader2,
  AlertTriangle,
  CheckCircle,
  BarChart2,
  AlertCircle,
  ArrowRightCircle,
  Info,
  ListTodo
} from 'lucide-react';
import type { OpportunityDetails, EvaluationOutput } from '@/types/opportunity';
import { CreateHabiticaTaskDialog } from './tasks/CreateHabiticaTaskDialog';

interface OpportunityEvaluatorProps {
  className?: string;
}

export const OpportunityEvaluator: React.FC<OpportunityEvaluatorProps> = ({ className }) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [type, setType] = useState<'job' | 'education' | 'project' | 'other'>('job');
  const [url, setUrl] = useState<string>("");

  const [evaluation, setEvaluation] = useState<EvaluationOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Habitica task dialog state
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState<boolean>(false);
  const [selectedStep, setSelectedStep] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Opportunity title and content are required.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEvaluation(null);

    try {
      const response = await fetch('/api/orion/opportunity/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          content,
          type,
          url: url || undefined
        } as OpportunityDetails)
      });

      const data = await response.json();

      if (data.success) {
        setEvaluation(data.evaluation as EvaluationOutput);
        setError(null);
        if (data.warning) {
          console.warn(data.warning);
        }
      } else {
        setEvaluation(null);
        setError(data.error || 'Failed to evaluate opportunity.');
      }
    } catch (err: any) {
      console.error('Error evaluating opportunity:', err);
      setEvaluation(null);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRiskReward = (rrAnalysis: EvaluationOutput['riskRewardAnalysis']) => {
    if (!rrAnalysis) {
      return null;
    }

    const entries = Object.entries(rrAnalysis).filter(([_, value]) => value);
    if (entries.length === 0) return <p className="text-sm text-gray-400">No risk/reward analysis available</p>;

    return (
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
        {entries.map(([key, value], index) => (
          <li key={index}>
            <strong className="text-gray-200 capitalize">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
            </strong>{' '}
            {typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)}
          </li>
        ))}
      </ul>
    );
  };

  const handleCreateTask = (step: string) => {
    setSelectedStep(step);
    setIsTaskDialogOpen(true);
  };

  // Type guard for successful evaluation
  const isEvaluationSuccess = (result: EvaluationOutput | null): result is EvaluationOutput => {
    return !!result && 'fitScorePercentage' in result;
  };

  // Determine raw output content if available
  const rawOutputContent = (evaluation && 'rawOutput' in evaluation && typeof evaluation.rawOutput === 'string')
    ? evaluation.rawOutput
    : null;

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <BarChart2 className="mr-2 h-5 w-5 text-amber-400" />
            Evaluate Opportunity
          </CardTitle>
          <CardDescription className="text-gray-400">
            Analyze job descriptions, academic programs, or project briefs against your profile and goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">Opportunity Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Senior Product Manager at Innovatech"
                className="bg-gray-700 border-gray-600 text-gray-200"
                required
              />
            </div>

            <div>
              <Label htmlFor="type" className="text-gray-300">Opportunity Type *</Label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectItem value="job">Job</SelectItem>
                  <SelectItem value="education">Education Program</SelectItem>
                  <SelectItem value="project">Project / Collaboration</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="url" className="text-gray-300">URL (Optional)</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/job-posting"
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-gray-300">Content / Details *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => { setContent(e.target.value); console.log('[OpportunityEvaluator] Content changed:', e.target.value); }}
                placeholder="Paste job content, program details, project brief, etc."
                className="min-h-[200px] bg-gray-700 border-gray-600 text-gray-200"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !title.trim() || !content.trim()}
              className="bg-amber-600 hover:bg-amber-700 w-full"
            >
              {isLoading ? (
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
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          <span className="ml-2 text-gray-400">Evaluating...</span>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      ) : isEvaluationSuccess(evaluation) ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-amber-400">Evaluation Results: {title}</CardTitle>
            <CardDescription className="text-gray-400">
              Analysis of how this opportunity aligns with your profile and goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300 font-medium">Overall Fit Score:</Label>
              <p className={`text-2xl font-bold ${
                evaluation.fitScorePercentage >= 75 ? 'text-green-400' :
                evaluation.fitScorePercentage >= 50 ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {evaluation.fitScorePercentage}%
              </p>
            </div>

            <div>
              <Label className="text-gray-300 font-medium">Recommendation:</Label>
              <p className="text-lg font-medium text-blue-400">{evaluation.recommendation}</p>
            </div>

            <div>
              <Label className="text-gray-300 font-medium">Reasoning:</Label>
              <p className="text-gray-300">{evaluation.reasoning}</p>
            </div>

            {evaluation.alignmentHighlights && evaluation.alignmentHighlights.length > 0 && (
              <div>
                <Label className="text-gray-300 font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                  Alignment Highlights:
                </Label>
                <ul className="list-disc list-inside pl-4 text-sm text-gray-300 space-y-1">
                  {evaluation.alignmentHighlights.map((highlight: string, index: number) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}

            {evaluation.gapAnalysis && evaluation.gapAnalysis.length > 0 && (
              <div>
                <Label className="text-gray-300 font-medium flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-yellow-400" />
                  Gap Analysis:
                </Label>
                <ul className="list-disc list-inside pl-4 text-sm text-gray-300 space-y-1">
                  {evaluation.gapAnalysis.map((gap: string, index: number) => (
                    <li key={index}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}

            {evaluation.riskRewardAnalysis && (
              <div>
                <Label className="text-gray-300 font-medium flex items-center">
                  <BarChart2 className="h-4 w-4 mr-2 text-purple-400" />
                  Risk/Reward Analysis:
                </Label>
                {renderRiskReward(evaluation.riskRewardAnalysis)}
              </div>
            )}

            {evaluation.suggestedNextSteps && evaluation.suggestedNextSteps.length > 0 && (
              <div>
                <Label className="text-gray-300 font-medium flex items-center">
                  <ArrowRightCircle className="h-4 w-4 mr-2 text-blue-400" />
                  Suggested Next Steps:
                </Label>
                <ul className="list-disc list-inside pl-4 text-sm text-gray-300 space-y-1">
                  {evaluation.suggestedNextSteps.map((step: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-1">{step}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateTask(step)}
                        className="ml-2 text-xs flex items-center bg-gray-700 hover:bg-gray-600 text-blue-300"
                      >
                        <ListTodo className="mr-1 h-3 w-3" />
                        Create Task
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {rawOutputContent && (
        <Card className="bg-yellow-900/30 border border-yellow-700">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center">
              <Info className="h-4 w-4 mr-2 text-blue-400" />
              Raw Output (for debugging)
            </CardTitle>
            <CardDescription className="text-gray-400">
              The evaluation output could not be parsed as structured data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono text-gray-400 bg-gray-700 p-3 rounded-md overflow-x-auto">
              {rawOutputContent}
            </div>
          </CardContent>
        </Card>
      )}

      <CreateHabiticaTaskDialog
        isOpen={isTaskDialogOpen}
        setIsOpen={setIsTaskDialogOpen}
        initialTaskText={selectedStep}
        initialTaskNotes={`Next step for opportunity: ${title}`}
        sourceModule="Opportunity Evaluator"
        sourceReferenceId={title}
      />
    </div>
  );
};
