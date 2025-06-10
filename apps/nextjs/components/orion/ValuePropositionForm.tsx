"use client";

import React, { useState } from 'react';
import { Button, Input, Textarea, Label, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Loader2, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';
import type { ValueProposition } from '@shared/types/narrative-clarity';

import { useValueProposition } from "./ValuePropositionContext";

/**
 * ValuePropositionForm
 * GOAL: UI for defining and submitting value proposition, using context for all submission events.
 * All submissions are logged via context for traceability and future analytics.
 * Connects to: ValuePropositionContext, admin dashboards, engagement features.
 */

interface ValuePropositionFormProps {
  initialData?: Partial<ValueProposition>;
}

export const ValuePropositionForm: React.FC<ValuePropositionFormProps> = ({
  initialData = {},
}) => {
  const { submitValueProposition } = useValueProposition();
  const [coreStrengths, setCoreStrengths] = useState(initialData.coreStrengths?.join(', ') || '');
  const [uniqueSkills, setUniqueSkills] = useState(initialData.uniqueSkills?.join(', ') || '');
  const [passions, setPassions] = useState(initialData.passions?.join(', ') || '');
  const [vision, setVision] = useState(initialData.vision || '');
  const [targetAudience, setTargetAudience] = useState(initialData.targetAudience || '');
  const [valueStatement, setValueStatement] = useState(initialData.valueStatement || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!valueStatement.trim()) {
      setFeedback({ type: 'error', message: 'Value statement is required.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      // Convert comma-separated strings to arrays
      const valuePropositionData: Partial<ValueProposition> = {
        ...initialData,
        coreStrengths: coreStrengths ? coreStrengths.split(',').map(s => s.trim()).filter(Boolean) : [],
        uniqueSkills: uniqueSkills ? uniqueSkills.split(',').map(s => s.trim()).filter(Boolean) : [],
        passions: passions ? passions.split(',').map(p => p.trim()).filter(Boolean) : [],
        vision: vision || undefined,
        targetAudience: targetAudience || undefined,
        valueStatement: valueStatement
      };

      await submitValueProposition(valuePropositionData);
      setFeedback({ type: 'success', message: 'Value proposition saved successfully!' });
    } catch (err: any) {
      console.error('Error saving value proposition:', err);
      setFeedback({ type: 'error', message: err.message || 'Failed to save value proposition.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
          Define Your Value Proposition
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="coreStrengths" className="text-gray-300">Core Strengths (comma-separated)</Label>
            <Input
              id="coreStrengths"
              value={coreStrengths}
              onChange={(e) => setCoreStrengths(e.target.value)}
              placeholder="e.g., leadership, strategic thinking, problem-solving"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="uniqueSkills" className="text-gray-300">Unique Skills (comma-separated)</Label>
            <Input
              id="uniqueSkills"
              value={uniqueSkills}
              onChange={(e) => setUniqueSkills(e.target.value)}
              placeholder="e.g., AI development, cross-functional collaboration, data visualization"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="passions" className="text-gray-300">Passions (comma-separated)</Label>
            <Input
              id="passions"
              value={passions}
              onChange={(e) => setPassions(e.target.value)}
              placeholder="e.g., innovation, mentoring, sustainable technology"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="vision" className="text-gray-300">Vision</Label>
            <Textarea
              id="vision"
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder="Your long-term vision or goal"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="targetAudience" className="text-gray-300">Target Audience</Label>
            <Input
              id="targetAudience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Who you aim to serve or impact"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="valueStatement" className="text-gray-300">Value Statement *</Label>
            <Textarea
              id="valueStatement"
              value={valueStatement}
              onChange={(e) => setValueStatement(e.target.value)}
              placeholder="A concise statement of the unique value you bring"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
              required
            />
          </div>

          {feedback && (
            <div className={`p-3 rounded-md flex items-center ${
              feedback.type === 'success' ? 'bg-green-900/30 border border-green-700 text-green-300'
                                       : 'bg-red-900/30 border border-red-700 text-red-300'
            }`}>
              {feedback.type === 'success' ?
                <CheckCircle2 className="h-5 w-5 mr-2" /> :
                <AlertTriangle className="h-5 w-5 mr-2" />
              }
              {feedback.message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !valueStatement.trim()}
            className="bg-blue-600 hover:bg-blue-700 w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save Value Proposition'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
