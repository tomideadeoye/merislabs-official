"use client";

import React from 'react';
import { EvaluationOutput } from '@shared/types/opportunity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ThumbsUp, ThumbsDown, Star, FileText } from 'lucide-react';

interface ComprehensiveAnalysisProps {
  evaluation: EvaluationOutput | null;
}

const ScoreDisplay: React.FC<{ score: number }> = ({ score }) => (
  <div className="flex items-center space-x-4">
    <div className="w-24 text-lg font-bold">Fit Score</div>
    <Progress value={score} className="w-full" />
    <div className="text-lg font-bold">{score}/100</div>
  </div>
);

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div>
    <h3 className="text-xl font-semibold flex items-center mb-2">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <div className="pl-8">{children}</div>
  </div>
);

export const ComprehensiveAnalysis: React.FC<ComprehensiveAnalysisProps> = ({ evaluation }) => {
  if (!evaluation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Awaiting Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Click "Evaluate with Orion" to generate a comprehensive analysis.</p>
        </CardContent>
      </Card>
    );
  }

  const {
    overallFitScore = 0,
    summary = 'No summary available.',
    strengths = [],
    gaps = [],
    suggestedCvComponents = [],
  } = evaluation;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Comprehensive Opportunity Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ScoreDisplay score={overallFitScore} />

        <Section title="Key Takeaways" icon={<Lightbulb className="text-yellow-400" />}>
          <p className="text-muted-foreground">{summary}</p>
        </Section>

        <Section title="Alignment Analysis" icon={<Star className="text-blue-400" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold flex items-center mb-2"><ThumbsUp className="text-green-500 mr-2" />Strengths</h4>
              <ul className="list-disc list-inside space-y-1">
                {strengths.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold flex items-center mb-2"><ThumbsDown className="text-red-500 mr-2" />Gaps</h4>
              <ul className="list-disc list-inside space-y-1">
                {gaps.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          </div>
        </Section>

        <Section title="Suggested CV Components" icon={<FileText className="text-purple-400" />}>
          <div className="flex flex-wrap gap-2">
            {suggestedCvComponents.map((component, index) => (
              <Badge key={index} variant="secondary">{component}</Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Use these components on the next page to tailor your CV for this role.
          </p>
        </Section>
      </CardContent>
    </Card>
  );
};
