"use client";

import React, { useState, useEffect } from 'react';
import type { CognitiveDistortionAnalysisData, CognitiveDistortion } from '@/types/orion';
import { COGNITIVE_DISTORTIONS_LIST, CognitiveDistortionId, DISTORTION_DESCRIPTIONS } from '@/lib/cbt_constants';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

interface CognitiveDistortionAnalysisFormProps {
  initialData?: Partial<CognitiveDistortionAnalysisData>;
  onAnalysisChange: (data: CognitiveDistortionAnalysisData) => void;
}

const distortionOptions: CognitiveDistortion[] = Object.entries(COGNITIVE_DISTORTIONS_LIST).map(([id, name]) => ({
  id: id as CognitiveDistortionId,
  name,
  selected: false,
}));

export const CognitiveDistortionAnalysisForm: React.FC<CognitiveDistortionAnalysisFormProps> = ({ 
  initialData, 
  onAnalysisChange 
}) => {
  const [automaticThought, setAutomaticThought] = useState(initialData?.automaticThought || "");
  const [distortions, setDistortions] = useState<CognitiveDistortion[]>(() => 
    distortionOptions.map(opt => ({
      ...opt,
      selected: initialData?.identifiedDistortions?.includes(opt.name) || false
    }))
  );
  const [challengeToThought, setChallengeToThought] = useState(initialData?.challengeToThought || "");
  const [alternativePerspective, setAlternativePerspective] = useState(initialData?.alternativePerspective || "");

  useEffect(() => {
    if (initialData?.automaticThought) {
      setAutomaticThought(initialData.automaticThought);
    }
    if (initialData?.challengeToThought) {
      setChallengeToThought(initialData.challengeToThought);
    }
    if (initialData?.alternativePerspective) {
      setAlternativePerspective(initialData.alternativePerspective);
    }
    if (initialData?.identifiedDistortions && initialData.identifiedDistortions.length > 0) {
      setDistortions(distortionOptions.map(opt => ({
        ...opt,
        selected: initialData.identifiedDistortions?.includes(opt.name) || false
      })));
    }
  }, [initialData]);

  const handleDistortionChange = (id: CognitiveDistortionId) => {
    const newDistortions = distortions.map(d => d.id === id ? { ...d, selected: !d.selected } : d);
    setDistortions(newDistortions);
    triggerChange(automaticThought, newDistortions, challengeToThought, alternativePerspective);
  };
  
  const triggerChange = (
    currentAutomaticThought: string, 
    currentDistortions: CognitiveDistortion[], 
    currentChallenge: string, 
    currentAlternative: string
  ) => {
    onAnalysisChange({
      automaticThought: currentAutomaticThought,
      identifiedDistortions: currentDistortions.filter(d => d.selected).map(d => d.name),
      challengeToThought: currentChallenge || undefined,
      alternativePerspective: currentAlternative || undefined,
    });
  };

  return (
    <Card className="bg-gray-800 border-gray-700/70 p-0">
      <CardHeader className="pb-3 pt-4 px-4 md:px-5">
        <CardTitle className="text-md font-semibold text-purple-300">Cognitive Distortion Analysis</CardTitle>
        <CardDescription className="text-xs text-gray-400">Identify and reframe unhelpful thought patterns.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4 md:px-5 pb-4">
        <div>
          <Label htmlFor="automaticThought" className="text-sm text-gray-300">Automatic Thought (What went through your mind?)</Label>
          <Textarea
            id="automaticThought"
            value={automaticThought}
            onChange={e => { 
              setAutomaticThought(e.target.value); 
              triggerChange(e.target.value, distortions, challengeToThought, alternativePerspective); 
            }}
            placeholder="e.g., I'm going to fail this presentation."
            rows={2} 
            className="bg-gray-700"
          />
        </div>
        <div>
          <Label className="text-sm text-gray-300">Identify Cognitive Distortions (Check all that apply):</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 mt-1">
            {distortions.map(distortion => (
              <div key={distortion.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`dist-${distortion.id}`}
                  checked={distortion.selected}
                  onCheckedChange={() => handleDistortionChange(distortion.id as CognitiveDistortionId)}
                />
                <div className="flex items-center">
                  <Label htmlFor={`dist-${distortion.id}`} className="text-xs font-normal text-gray-300 cursor-pointer">
                    {distortion.name}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3 w-3 ml-1 text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-gray-200 border-gray-700 max-w-xs">
                        <p className="text-xs">{DISTORTION_DESCRIPTIONS[distortion.id]}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="challengeToThought" className="text-sm text-gray-300">Challenge the Thought (What evidence contradicts it?)</Label>
          <Textarea
            id="challengeToThought"
            value={challengeToThought}
            onChange={e => { 
              setChallengeToThought(e.target.value); 
              triggerChange(automaticThought, distortions, e.target.value, alternativePerspective); 
            }}
            placeholder="e.g., I've given good presentations before; I'm well prepared."
            rows={3} 
            className="bg-gray-700"
          />
        </div>
        <div>
          <Label htmlFor="alternativePerspective" className="text-sm text-gray-300">Alternative, More Balanced Perspective:</Label>
          <Textarea
            id="alternativePerspective"
            value={alternativePerspective}
            onChange={e => { 
              setAlternativePerspective(e.target.value); 
              triggerChange(automaticThought, distortions, challengeToThought, e.target.value); 
            }}
            placeholder="e.g., It's normal to be nervous, but I have the skills to do well. Even if it's not perfect, it's a learning opportunity."
            rows={3} 
            className="bg-gray-700"
          />
        </div>
      </CardContent>
    </Card>
  );
};