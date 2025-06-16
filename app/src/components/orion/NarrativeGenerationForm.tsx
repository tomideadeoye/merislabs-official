'use client';
// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component, usage patterns, next steps if any

import React, { useState } from 'react';
import {
  Button,
  Textarea,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components/ui';
import { Loader2, AlertTriangle, FileText } from 'lucide-react';
import type { NarrativeType, NarrativeTone, NarrativeLength } from '@/types/orion';

import { useNarrativeGenerationStore } from './narrativeGenerationStore';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/lib/app_constants';

export const NarrativeGenerationForm: React.FC = () => {
  const { selectSessionValue, setSessionValue } = useSessionState();
  const [narrativeType, setNarrativeType] = useState<NarrativeType>(
    selectSessionValue(SessionStateKeys.NARRATIVE_TYPE) || 'personalBio'
  );
  const [tone, setTone] = useState<NarrativeTone>(
    selectSessionValue(SessionStateKeys.NARRATIVE_TONE) || 'professional'
  );
  const [length, setLength] = useState<NarrativeLength>(
    selectSessionValue(SessionStateKeys.NARRATIVE_LENGTH) || 'standard'
  );
  const [additionalContext, setAdditionalContext] = useState<string>(
    selectSessionValue(SessionStateKeys.NARRATIVE_CONTEXT) || ''
  );
  const [specificRequirements, setSpecificRequirements] = useState<string>(
    selectSessionValue(SessionStateKeys.NARRATIVE_REQUIREMENTS) || ''
  );

  const [isGenerating, setIsGenerating] = useState<boolean>(
    selectSessionValue(SessionStateKeys.NARRATIVE_GENERATING) || false
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!narrativeType) {
      setError('Narrative type is required.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/orion/narrative/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          narrativeType,
          tone,
          length,
          additionalContext: additionalContext || undefined,
          specificRequirements: specificRequirements || undefined,
        }),
      });

      const data = await response.json();

      if (data.success && data.narrative) {
        useNarrativeGenerationStore.getState().setNarrative(data.narrative.content, data.narrative.suggestedTitle);
      } else {
        throw new Error(data.error || 'Failed to generate narrative content.');
      }
    } catch (err: unknown) {
      console.error('Error generating narrative content:', err);
      setError((err as Error).message || 'An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  const narrativeTypeOptions: { value: NarrativeType; label: string }[] = [
    { value: 'personalBio', label: 'Personal Bio' },
    { value: 'journalReflection', label: 'Journal Reflection' },
    { value: 'opportunitySummary', label: 'OrionOpportunity Summary' },
    { value: 'emotionalAnalysis', label: 'Emotional Analysis' },
    { value: 'valueProposition', label: 'Value Proposition' },
    { value: 'careerMilestones', label: 'Career Milestones' },
    { value: 'reflection', label: 'Reflection' },
    { value: 'custom', label: 'Custom' },
  ];

  const toneOptions: { value: NarrativeTone; label: string }[] = [
    { value: 'professional', label: 'Professional' },
    { value: 'formal', label: 'Formal' },
    { value: 'informal', label: 'Informal' },
    { value: 'empathetic', label: 'Empathetic' },
    { value: 'analytical', label: 'Analytical' },
    { value: 'persuasive', label: 'Persuasive' },
  ];

  const lengthOptions: { value: NarrativeLength; label: string }[] = [
    { value: 'standard', label: 'Standard' },
    { value: 'short', label: 'Short' },
    { value: 'medium', label: 'Medium' },
    { value: 'long', label: 'Long' },
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <FileText className="mr-2 h-5 w-5 text-blue-400" />
          Generate Narrative Content
        </CardTitle>
        <CardDescription className="text-gray-400">
          Create compelling narrative content based on your value proposition and career milestones.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="narrativeType" className="text-gray-300">
              Narrative Type *
            </Label>
            <Select
              value={narrativeType}
              onValueChange={(value) => setNarrativeType(value as NarrativeType)}
              disabled={isGenerating}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                {narrativeTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tone" className="text-gray-300">
                Tone
              </Label>
              <Select value={tone} onValueChange={(value) => setTone(value as NarrativeTone)} disabled={isGenerating}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                  {toneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="length" className="text-gray-300">
                Length
              </Label>
              <Select
                value={length}
                onValueChange={(value) => setLength(value as NarrativeLength)}
                disabled={isGenerating}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                  {lengthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="additionalContext" className="text-gray-300">
              Additional Context (Optional)
            </Label>
            <Textarea
              id="additionalContext"
              value={additionalContext || ''}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Any additional information that might be helpful"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isGenerating}
            />
          </div>

          <div>
            <Label htmlFor="specificRequirements" className="text-gray-300">
              Specific Requirements (Optional)
            </Label>
            <Textarea
              id="specificRequirements"
              value={specificRequirements || ''}
              onChange={(e) => setSpecificRequirements(e.target.value)}
              placeholder="Any specific elements you want included in the narrative"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isGenerating}
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isGenerating || !narrativeType}
            className="bg-blue-600 hover:bg-blue-700 w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Narrative...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Narrative
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
