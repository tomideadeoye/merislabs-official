"use client";

import { useState, useCallback } from 'react';
import { OpportunityDraft, StakeholderOutreach } from '@/types/opportunity';

interface UseOpportunityMemoryProps {
  opportunityId: string;
}

export function useOpportunityMemory({ opportunityId }: UseOpportunityMemoryProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Save application draft to memory
  const saveDraftToMemory = useCallback(async (draft: string, style: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/orion/memory/add-memory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: draft,
          metadata: {
            type: 'application_draft',
            opportunityId,
            style,
            timestamp: new Date().toISOString()
          }
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to save draft to memory');
      }
      
      return true;
    } catch (err: any) {
      console.error('Error saving draft to memory:', err);
      setError(err.message || 'An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [opportunityId]);
  
  // Save outreach message to memory
  const saveOutreachToMemory = useCallback(async (message: string, stakeholderInfo: any): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/orion/memory/add-memory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: message,
          metadata: {
            type: 'stakeholder_outreach',
            opportunityId,
            stakeholderName: stakeholderInfo.name,
            stakeholderRole: stakeholderInfo.role,
            stakeholderCompany: stakeholderInfo.company,
            platform: stakeholderInfo.platform || 'email',
            timestamp: new Date().toISOString()
          }
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to save outreach to memory');
      }
      
      return true;
    } catch (err: any) {
      console.error('Error saving outreach to memory:', err);
      setError(err.message || 'An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [opportunityId]);
  
  return {
    isLoading,
    error,
    saveDraftToMemory,
    saveOutreachToMemory
  };
}