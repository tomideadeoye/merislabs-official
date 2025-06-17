import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface NarrativeGenerationFormProps {
  description: string;
  setDescription: (description: string) => void;
  handleLLMGenerate: () => void;
  loading: boolean;
  llmError: string | null;
}

export const NarrativeGenerationForm: React.FC<NarrativeGenerationFormProps> = ({
  description,
  setDescription,
  handleLLMGenerate,
  loading,
  llmError,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="description" className="text-gray-300">
          Describe what you want to generate a narrative for:
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Generate a compelling personal narrative highlighting my career achievements and skills."
          className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 min-h-[100px]"
        />
      </div>
      <Button onClick={handleLLMGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Narrative'}
      </Button>
      {llmError && <p className="text-red-500 text-sm mt-2">Error: {llmError}</p>}
    </div>
  );
};
