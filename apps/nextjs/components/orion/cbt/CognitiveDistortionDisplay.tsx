"use client";

import React from 'react';
import { CognitiveDistortionAnalysisData } from '@repo/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Badge } from '@repo/ui';
import { BrainCircuit } from 'lucide-react';

interface CognitiveDistortionDisplayProps {
  data: CognitiveDistortionAnalysisData;
}

export const CognitiveDistortionDisplay: React.FC<CognitiveDistortionDisplayProps> = ({ data }) => {
  if (!data || !data.automaticThought) {
    return null;
  }

  return (
    <Card className="bg-gray-800 border-gray-700/70 mt-4">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-sm font-medium text-purple-300 flex items-center">
          <BrainCircuit className="h-4 w-4 mr-2" />
          Cognitive Distortion Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 space-y-3">
        <div>
          <h4 className="text-xs font-medium text-gray-400 mb-1">Automatic Thought:</h4>
          <p className="text-sm text-gray-300">{data.automaticThought}</p>
        </div>

        {data.identifiedDistortions && data.identifiedDistortions.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-400 mb-1">Identified Distortions:</h4>
            <div className="flex flex-wrap gap-1">
              {data.identifiedDistortions.map((distortion, index) => (
                <Badge key={index} variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-700/50 text-xs">
                  {distortion}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {data.challengeToThought && (
          <div>
            <h4 className="text-xs font-medium text-gray-400 mb-1">Challenge to Thought:</h4>
            <p className="text-sm text-gray-300">{data.challengeToThought}</p>
          </div>
        )}

        {data.alternativePerspective && (
          <div>
            <h4 className="text-xs font-medium text-gray-400 mb-1">Alternative Perspective:</h4>
            <p className="text-sm text-gray-300">{data.alternativePerspective}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
