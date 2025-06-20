/**
 * @fileoverview A reusable button component to trigger AI-driven evaluation for an Opportunity.
 * @description This component provides a click-action button that, when pressed, initiates an asynchronous API call
 * to evaluate a specific opportunity against Tomide's profile using Orion's AI capabilities. It handles loading states
 * and navigates to the opportunity's detailed view upon successful evaluation.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide a clear and accessible UI element for users to start an opportunity evaluation.
 *   - To encapsulate the logic for calling the evaluation API and handling its success/error states.
 *   - To facilitate navigation to the detailed opportunity view, potentially with a new evaluation ID.
 *
 * FILEPATH: `app/components/EvaluateWithOrionButton.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `OrionOpportunity` type from `@/lib/types`: Defines the structure of the opportunity data passed to the button.
 *   - `@/components/ui/button.tsx`: Utilizes the shared UI Button component for consistent styling and behavior.
 *   - `lucide-react`: Provides visual icons for loading states (`Loader2`) and the evaluation action (`BarChart2`).
 *   - `next/navigation`: Uses `useRouter` for client-side navigation after evaluation.
 *   - `/api/orion/opportunity/evaluate`: The backend API route (POST) that this button triggers for the evaluation process.
 *   - `/api/orion/opportunity/[opportunityId]`: The backend API route (PATCH) used to update the opportunity with the `relatedEvaluationId` and status.
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/page.tsx`: The target page for navigation after evaluation.
 *   - `@/lib/logger`: Used for structured logging of evaluation errors.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the `opportunityId` is available and valid for the API calls.
 *   - Assumes the user has the necessary permissions to trigger evaluations and update opportunities.
 *   - Error handling is present but could be enhanced with user-friendly toast notifications.
 *
 * NOTES:
 *   - This component promotes reusability for triggering evaluations from various parts of the application where an `OrionOpportunity` context is available.
 *   - **COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE**: This component is quite specific; however, if other "action" buttons emerge that trigger similar API calls and navigation, a more generic "ActionButtonWithApi" pattern could be considered.
 *   - **PERFORMANCE OPTIMIZATIONS**: For very frequent evaluations, consider debouncing or caching API responses if the opportunity data doesn't change rapidly.
 *   - **ERROR HANDLING ROBUSTNESS**: While errors are logged, a more visual user feedback mechanism (e.g., a toast message for success/failure) would improve UX.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **User Feedback**: Integrate a toast notification system (`useToast` from shadcn/ui) to provide clear success or error messages to the user.
 *   - **Progress Indication**: For long-running evaluations, consider adding a more granular progress indicator (e.g., a percentage or status updates) if the backend provides such information.
 *   - **Pre-Evaluation Check**: Add client-side validation or a pre-check before calling the API to ensure all necessary `OrionOpportunity` fields are populated.
 *   - **Dynamic Status Update**: Instead of a hardcoded `evaluated_positive` status, allow the API to return a suggested status based on the evaluation outcome.
 */
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { BarChart2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { OrionOpportunity } from '@/lib/types';
import logger from '@/lib/logger'; // Import logger

interface EvaluateWithOrionButtonProps {
  OrionOpportunity: OrionOpportunity;
  onEvaluationComplete?: (evaluationId: string) => void;
}

export const EvaluateWithOrionButton: React.FC<EvaluateWithOrionButtonProps> = ({
  OrionOpportunity,
  onEvaluationComplete,
}) => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const router = useRouter();

  const handleEvaluate = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    setIsEvaluating(true);

    try {
      const response = await fetch('/api/orion/opportunity/evaluate', {
        // Corrected API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: OrionOpportunity.title,
          description: OrionOpportunity.content || '',
          type: OrionOpportunity.type,
          url: OrionOpportunity.sourceUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update OrionOpportunity with evaluation ID
        await fetch(`/api/orion/opportunity/${OrionOpportunity.id}`, {
          // Corrected API route
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            relatedEvaluationId: data.evaluationId,
            status: 'evaluated_positive', // Consider making this dynamic based on evaluation outcome
          }),
        });

        if (onEvaluationComplete) {
          onEvaluationComplete(data.evaluationId);
        }

        // Navigate to the OrionOpportunity detail view
        router.push(`/admin/opportunity-pipeline/${OrionOpportunity.id}`); // Corrected navigation route
      } else {
        logger.error('[EvaluateWithOrionButton][EVALUATION_FAILED]', {
          opportunityId: OrionOpportunity.id,
          error: data.error,
        });
        // Optionally, set a user-facing error message here
      }
    } catch (error: unknown) {
      logger.error('[EvaluateWithOrionButton][FETCH_ERROR]', {
        opportunityId: OrionOpportunity.id,
        error: error instanceof Error ? error.message : String(error),
      });
      // Optionally, set a user-facing error message here
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
      {isEvaluating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart2 className="mr-2 h-4 w-4" />}
      Evaluate with Orion
    </Button>
  );
};
