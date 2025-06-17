import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// GOAL OF FILE|FEATURES|FUNCTIONS: Provides a UI component for evaluating a specific opportunity. Currently a placeholder with simulated functionality.
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/components/orion/opportunity-pipeline/OpportunityEvaluator.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Consumed by a component displaying opportunity details (e.g., `OpportunityDetailView` - implied).
//   - Uses `@/components/ui` components (`Card`, `Textarea`, `Button`).
// NOTES: This component appears to be a duplicate of `/Users/mac/Documents/GitHub/merislabs-official/app/components/ui/orion/opportunities/OpportunityEvaluator.tsx`. It should be consolidated into a single component in the `components/ui` directory. The version in `components/ui` seems more complete with form inputs and displaying evaluation results.
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface OpportunityEvaluatorProps {
  opportunityId: string | null;
}

export const OpportunityEvaluator: React.FC<OpportunityEvaluatorProps> = ({ opportunityId }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [evaluationResult, setEvaluationResult] = React.useState<string | null>(null);
  const [evaluationInput, setEvaluationInput] = React.useState<string>('');

  const handleEvaluate = async () => {
    setIsLoading(true);
    setEvaluationResult(null);
    // Placeholder for API call to evaluate opportunity
    console.log(`Evaluating opportunity ${opportunityId} with input: ${evaluationInput}`);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setEvaluationResult('Placeholder evaluation result for ' + opportunityId + ': ' + evaluationInput);
    setIsLoading(false);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle>Opportunity Evaluator</CardTitle>
        <CardDescription>Get an AI-driven evaluation of this opportunity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter specific aspects you want the AI to evaluate, e.g., 'What are the key skills required?' or 'How does this align with my career goals?'"
          value={evaluationInput}
          onChange={(e) => setEvaluationInput(e.target.value)}
          rows={5}
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          disabled={isLoading}
        />
        <Button onClick={handleEvaluate} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Run AI Evaluation'}
        </Button>
        {evaluationResult && (
          <div className="mt-4 p-3 bg-gray-700 rounded whitespace-pre-wrap text-gray-200">
            <h4 className="font-semibold mb-2">Evaluation Result:</h4>
            <p>{evaluationResult}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
