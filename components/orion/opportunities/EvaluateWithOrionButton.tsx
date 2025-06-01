"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Opportunity } from '@/types/opportunity';

interface EvaluateWithOrionButtonProps {
  opportunity: Opportunity;
  onEvaluationComplete?: (evaluationId: string) => void;
}

export const EvaluateWithOrionButton: React.FC<EvaluateWithOrionButtonProps> = ({ 
  opportunity, 
  onEvaluationComplete 
}) => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const router = useRouter();

  const handleEvaluate = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    setIsEvaluating(true);
    
    try {
      const response = await fetch('/api/orion/opportunity/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: opportunity.title,
          description: opportunity.descriptionSummary || '',
          type: opportunity.type,
          url: opportunity.sourceURL
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update opportunity with evaluation ID
        await fetch(`/api/orion/opportunity/${opportunity.id}`, {
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
        
        // Navigate to the opportunity detail view
        router.push(`/admin/opportunity-pipeline/${opportunity.id}`);
      }
    } catch (error) {
      console.error("Error evaluating opportunity:", error);
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