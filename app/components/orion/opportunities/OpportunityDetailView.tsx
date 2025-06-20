import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import logger from '@/lib/logger';
import { apiClient } from '@/lib/apiClient';
import { UserProfileData, ScoredMemoryPoint, OrionOpportunity, EvaluationOutput } from '@/lib/types';
import { fetchUserProfile } from '@/lib/profile_service';

interface OpportunityDetailViewProps {
  opportunity: OrionOpportunity;
}

const OpportunityDetailView: React.FC<OpportunityDetailViewProps> = ({ opportunity }) => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationOutput | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);

  // Fetch user profile on component mount
  React.useEffect(() => {
    const getUserProfile = async () => {
      try {
        const profileResult = await fetchUserProfile();
        if (profileResult && profileResult.profile) {
          setUserProfile(profileResult.profile);
          logger.info('[OpportunityDetailView] User profile successfully fetched.');
        } else {
          logger.warn('[OpportunityDetailView] Failed to fetch user profile.', { error: profileResult?.error });
        }
      } catch (err: unknown) {
        logger.error('[OpportunityDetailView] Error fetching user profile:', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    };
    getUserProfile();
  }, []);

  const handleEvaluation = async () => {
    setIsEvaluating(true);
    toast.loading('Generating Evaluation...');
    logger.info(`[OpportunityDetailView] Starting evaluation for opportunity: ${opportunity.id}`);

    if (!userProfile) {
      logger.error('[OpportunityDetailView] User profile data is missing. Cannot proceed with evaluation.', {
        opportunityId: opportunity.id,
      });
      toast.error('User profile data is missing. Cannot generate evaluation.');
      setIsEvaluating(false);
      toast.dismiss();
      return;
    }

    try {
      const evaluationRequestBody = {
        opportunityId: opportunity.id, // This comes from the prop
        userProfile: userProfile, // Use the fetched user profile data
        relevantMemories: [], // Keep this empty for now, or populate if relevant memories are available
      };
      logger.debug('[OpportunityDetailView] Evaluation request body:', evaluationRequestBody);

      const response = await apiClient.post(
        `/api/orion/opportunity/${opportunity.id}/evaluation`,
        evaluationRequestBody
      );

      if (response.data?.success && response.data.evaluation) {
        setEvaluationResult(response.data.evaluation);
        toast.success('Evaluation Complete! Results saved to local browser storage.');
        logger.info(`[OpportunityDetailView] Evaluation successful for opportunity: ${opportunity.id}`);
      }
    } catch (error: unknown) {
      logger.error('[OpportunityDetailView] Error during evaluation:', {
        error: error instanceof Error ? error.message : String(error),
      });
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsEvaluating(false);
      toast.dismiss();
    }
  };

  return <div>{/* Render your component content here */}</div>;
};

export default OpportunityDetailView;
