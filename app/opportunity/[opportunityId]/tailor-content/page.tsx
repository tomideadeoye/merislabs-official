// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// FILE PATH

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Loader2 } from 'lucide-react';
import { useOpportunityMemory } from '@/lib/hooks/useOpportunityMemory';
import { useSessionState, SessionStateKeys, SessionState } from '@/lib/hooks/useSessionState';
import { CVComponent, OrionOpportunity } from '@/lib/types';
import logger from '@/lib/logger';

export default function TailorContentPage() {
  const params = useParams();
  const opportunityId = params?.id as string;

  const [opportunityData, setOpportunity] = useState<OrionOpportunity | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [cvComponents, setCvComponents] = useState<CVComponent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [autoGenLoading, setAutoGenLoading] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [llmOutput, setLlmOutput] = useState<string>('');

  const {
    opportunityMemories,
    isLoading: isMemoriesLoading,
    error: memoriesError,
  } = useOpportunityMemory(opportunityId);

  const profile = useSessionState((state: SessionState) => state.state[SessionStateKeys.TOMIDES_PROFILE_DATA]);

  useEffect(() => {
    async function fetchOpportunityAndCvComponents() {
      logger.info('Fetching opportunity details and CV components.', { opportunityId });
      setIsLoading(true);
      setError(null);
      try {
        // Fetch opportunity details
        const opportunityRes = await fetch(`/api/orion/opportunities/${opportunityId}`);
        const opportunityDataFetched: { success: boolean; opportunity?: OrionOpportunity; error?: string } =
          await opportunityRes.json();

        if (!opportunityDataFetched.success || !opportunityDataFetched.opportunity) {
          throw new Error(opportunityDataFetched.error || 'Failed to fetch opportunity details.');
        }
        setOpportunity(opportunityDataFetched.opportunity);
        setJobDescription(opportunityDataFetched.opportunity.content || '');

        // Fetch CV components
        const cvComponentsRes = await fetch(`/api/orion/cv-components?opportunityId=${opportunityId}`);
        const cvComponentsData: { success: boolean; cvComponents?: CVComponent[]; error?: string } =
          await cvComponentsRes.json();

        if (!cvComponentsData.success || !cvComponentsData.cvComponents) {
          throw new Error(cvComponentsData.error || 'Failed to fetch CV components.');
        }
        setCvComponents(cvComponentsData.cvComponents);

        logger.success('Opportunity details and CV components fetched successfully.', { opportunityId });
      } catch (err) {
        logger.error('Error fetching opportunity details or CV components:', { error: err, opportunityId });
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    }

    if (opportunityId) {
      fetchOpportunityAndCvComponents();
    }
  }, [opportunityId]);

  const handleGenerateContent = async () => {
    if (!profile) {
      logger.warn('Cannot generate content: User profile not loaded.');
      setError('User profile is not available. Please ensure you are logged in or profile data is loaded.');
      return;
    }

    if (!opportunityData) {
      logger.warn('Cannot generate content: Opportunity data not loaded.');
      setError('Opportunity data is not available.');
      return;
    }

    logger.info('Initiating content generation for CV tailoring.', { opportunityId });
    setAutoGenLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/orion/generate-tailored-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: jobDescription || '',
          cvComponents,
          opportunityMemories,
          profile,
          opportunityId,
          opportunityTitle: opportunityData.title,
          companyName: opportunityData.company,
          opportunityContent: opportunityData.content || '',
        }),
      });

      const data: { success: boolean; tailoredContent?: string; llmOutput?: string; error?: string } =
        await response.json();

      if (data.success && data.tailoredContent) {
        setGeneratedContent(data.tailoredContent);
        setLlmOutput(data.llmOutput || '');
        logger.success('Tailored content generated successfully.', { opportunityId });
      } else {
        throw new Error(data.error || 'Failed to generate tailored content.');
      }
    } catch (err) {
      logger.error('Error generating tailored content:', { error: err, opportunityId });
      setError(err instanceof Error ? err.message : 'An unknown error occurred during content generation.');
    } finally {
      setAutoGenLoading(false);
    }
  };

  if (isLoading || isMemoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2 text-gray-500">Loading opportunity and memories...</p>
      </div>
    );
  }

  if (error || memoriesError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error || memoriesError}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Tailor Content for {opportunityData?.title || 'Opportunity'} (ID: {opportunityId})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-500">Job Description:</p>
          <textarea
            className="w-full p-2 border rounded resize-y bg-gray-700 text-white"
            rows={10}
            value={jobDescription}
            readOnly
          />

          <p className="text-gray-500">Your CV Components:</p>
          {cvComponents.length > 0 ? (
            <ul className="list-disc list-inside text-gray-400">
              {cvComponents.map((component) => (
                <li key={component.id} className="mb-1">
                  <strong>{component.name}:</strong> {component.content}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No CV components found. Please ensure they are loaded.</p>
          )}

          <p className="text-gray-500">Relevant Memories:</p>
          {opportunityMemories.length > 0 ? (
            <ul className="list-disc list-inside text-gray-400">
              {opportunityMemories.map((memory) => (
                <li key={memory.id} className="mb-1 text-sm">
                  <strong>{memory.payload.title || 'Memory'}:</strong> {memory.payload.text.substring(0, 150)}...
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No relevant memories found for this opportunity.</p>
          )}

          <button
            onClick={handleGenerateContent}
            disabled={autoGenLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50"
          >
            {autoGenLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Generating Tailored Content...
              </span>
            ) : (
              'Generate Tailored Content'
            )}
          </button>
          {generatedContent && (
            <div className="mt-4">
              <p className="text-gray-500">Generated Tailored Content:</p>
              <textarea
                className="w-full p-2 border rounded resize-y bg-gray-700 text-white"
                rows={15}
                value={generatedContent}
                readOnly
              />
              <button
                onClick={() => navigator.clipboard.writeText(generatedContent)}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white"
              >
                Copy Generated Content
              </button>
            </div>
          )}
          {llmOutput && (
            <div className="mt-4">
              <p className="text-gray-500">Raw LLM Output (for debugging):</p>
              <textarea
                className="w-full p-2 border rounded resize-y bg-gray-700 text-white"
                rows={10}
                value={llmOutput}
                readOnly
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
