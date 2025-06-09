"use client";

import React, { useState } from 'react';
import { useSessionState } from '@shared/hooks/useSessionState';
import { SessionStateKeys } from '@shared/hooks/useSessionState';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertTriangle, FileText } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { NarrativeType } from '@shared/types/narrative-clarity';

import { useNarrativeGenerationStore } from './narrativeGenerationStore';

export const NarrativeGenerationForm: React.FC = () => {
  const [narrativeType, setNarrativeType] = useSessionState<
    SessionStateKeys.NARRATIVE_TYPE
  >(
    SessionStateKeys.NARRATIVE_TYPE,
    'personal_bio'
  );
  const [tone, setTone] = useSessionState(SessionStateKeys.NARRATIVE_TONE, 'professional');
  const [length, setLength] = useSessionState(SessionStateKeys.NARRATIVE_LENGTH, 'standard');
  const [additionalContext, setAdditionalContext] = useSessionState(SessionStateKeys.NARRATIVE_CONTEXT, '');
  const [specificRequirements, setSpecificRequirements] = useSessionState(SessionStateKeys.NARRATIVE_REQUIREMENTS, '');

  const [isGenerating, setIsGenerating] = useSessionState(SessionStateKeys.NARRATIVE_GENERATING, false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!narrativeType) {
      setError("Narrative type is required.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/orion/narrative/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          narrativeType,
          tone,
          length,
          additionalContext: additionalContext || undefined,
          specificRequirements: specificRequirements || undefined
        })
      });

      const data = await response.json();

      if (data.success && data.narrative) {
        useNarrativeGenerationStore.getState().setNarrative(data.narrative.content, data.narrative.suggestedTitle);
      } else {
        throw new Error(data.error || 'Failed to generate narrative content.');
      }
    } catch (err: any) {
      console.error('Error generating narrative content:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  const narrativeTypeOptions: { value: NarrativeType; label: string }[] = [
    { value: 'personal_bio', label: 'Personal Bio' },
    { value: 'linkedin_summary', label: 'LinkedIn Summary' },
    { value: 'vision_statement', label: 'Vision Statement' },
    { value: 'elevator_pitch', label: 'Elevator Pitch' },
    { value: 'cover_letter', label: 'Cover Letter' },
    { value: 'personal_statement', label: 'Personal Statement' },
    { value: 'custom', label: 'Custom' }
  ];

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'visionary', label: 'Visionary' },
    { value: 'academic', label: 'Academic' }
  ];

  const lengthOptions = [
    { value: 'brief', label: 'Brief' },
    { value: 'standard', label: 'Standard' },
    { value: 'detailed', label: 'Detailed' }
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
            <Label htmlFor="narrativeType" className="text-gray-300">Narrative Type *</Label>
            <Select
              value={narrativeType}
              onValueChange={(value) => setNarrativeType(value as NarrativeType)}
              disabled={isGenerating}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                {narrativeTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tone" className="text-gray-300">Tone</Label>
              <Select
                value={tone}
                onValueChange={setTone}
                disabled={isGenerating}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                  {toneOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="length" className="text-gray-300">Length</Label>
              <Select
                value={length}
                onValueChange={setLength}
                disabled={isGenerating}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                  {lengthOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="additionalContext" className="text-gray-300">Additional Context (Optional)</Label>
            <Textarea
              id="additionalContext"
              value={additionalContext || ""}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Any additional information that might be helpful"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isGenerating}
            />
          </div>

          <div>
            <Label htmlFor="specificRequirements" className="text-gray-300">Specific Requirements (Optional)</Label>
            <Textarea
              id="specificRequirements"
              value={specificRequirements || ""}
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
