'use client';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component, usage patterns, next steps if any

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Progress, Badge } from '@/components/ui';
import { Lightbulb, ThumbsUp, ThumbsDown, Star, FileText } from 'lucide-react';
import { EvaluationOutput } from '@/lib/types';

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

const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
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
          <p>Click &quot;Evaluate with Orion&quot; to generate a comprehensive analysis.</p>
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
        <CardTitle>Comprehensive OrionOpportunity Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ScoreDisplay score={overallFitScore} />

        <Section title="Key Takeaways" icon={<Lightbulb className="text-yellow-400" />}>
          <p className="text-muted-foreground">{summary}</p>
        </Section>

        <Section title="Alignment Analysis" icon={<Star className="text-blue-400" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold flex items-center mb-2">
                <ThumbsUp className="text-green-500 mr-2" />
                Strengths
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {strengths.map((item: { title: string; reasoning: string }, index: number) => (
                  <li key={index}>{item.title}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold flex items-center mb-2">
                <ThumbsDown className="text-red-500 mr-2" />
                Gaps
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {gaps.map((item: { skill: string; reasoning: string }, index: number) => (
                  <li key={index}>{item.skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section title="Suggested CV Components" icon={<FileText className="text-purple-400" />}>
          <div className="flex flex-wrap gap-2">
            {suggestedCvComponents.map((component: { component: string; reasoning: string }, index: number) => (
              <Badge key={index} variant="secondary">
                {component.component}
              </Badge>
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
