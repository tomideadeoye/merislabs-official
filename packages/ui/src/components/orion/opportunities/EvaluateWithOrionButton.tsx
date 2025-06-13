"use client";

import React, { useState } from 'react';
import { Button } from '@repo/ui';
import { BarChart2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { OrionOpportunity } from '@repo/shared';

interface EvaluateWithOrionButtonProps {
  OrionOpportunity: OrionOpportunity;
  onEvaluationComplete?: (evaluationId: string) => void;
}

export const EvaluateWithOrionButton: React.FC<EvaluateWithOrionButtonProps> = ({
  OrionOpportunity,
  onEvaluationComplete
}) => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const router = useRouter();

  const handleEvaluate = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    setIsEvaluating(true);

    try {
      const response = await fetch('/api/orion/OrionOpportunity/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: OrionOpportunity.title,
          description: OrionOpportunity.content || '',
          type: OrionOpportunity.type,
          url: OrionOpportunity.sourceURL
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update OrionOpportunity with evaluation ID
        await fetch(`/api/orion/OrionOpportunity/${OrionOpportunity.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            relatedEvaluationId: data.evaluationId,
            status: 'evaluated_positive'
          })
        });

        if (onEvaluationComplete) {
          onEvaluationComplete(data.evaluationId);
        }

        // Navigate to the OrionOpportunity detail view
        router.push(`/admin/OrionOpportunity-pipeline/${OrionOpportunity.id}`);
      }
    } catch (error) {
      console.error("Error evaluating OrionOpportunity:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="bg-blue-900/20 hover:bg-blue-900/30 text-blue-300"
      onClick={handleEvaluate}
      disabled={isEvaluating}
    >
      {isEvaluating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <BarChart2 className="mr-2 h-4 w-4" />
      )}
      Evaluate with Orion
    </Button>
  );
};
