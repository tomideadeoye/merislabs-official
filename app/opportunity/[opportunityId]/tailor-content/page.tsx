/**
 * @fileoverview Page for generating tailored CV content based on job descriptions, user profile, and relevant memories.
 * @description This client-side page orchestrates the fetching of opportunity details and CV components,
 * and then triggers an AI content generation process to create a tailored CV section.
 * It integrates various data sources to provide a highly personalized output.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide a user interface where Tomide can review the job description, his CV components, and relevant memories
 *     before triggering the AI to generate a tailored content piece (e.g., a custom summary, experience bullet points).
 *   - To streamline the process of adapting CVs for specific job opportunities by leveraging Orion's memory and LLM capabilities.
 *   - To display the generated tailored content and raw LLM output for review and further action (e.g., copying).
 *
 * FILEPATH: `app/opportunity/[opportunityId]/tailor-content/page.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/components/ui`: Utilizes Shadcn UI components like `Card`, `CardContent`, `CardHeader`, `CardTitle` for consistent styling.
 *   - `app/lib/hooks/useOpportunityMemory.ts`: Custom hook to fetch and provide relevant memories associated with the current opportunity, enriching the context for LLM generation.
 *   - `app/lib/hooks/useSessionState.ts`: Custom hook to access `TOMIDES_PROFILE_DATA` from session state, ensuring the LLM has access to Tomide's personal and professional context.
 *   - `app/lib/types.ts`: Defines core types like `CVComponent` and `OrionOpportunity` for data consistency.
 *   - `app/lib/logger.ts`: Used for comprehensive, context-rich logging throughout the component's lifecycle, aiding in debugging and traceability.
 *   - `app/api/orion/opportunities/[opportunityId]/route.ts`: API endpoint for fetching detailed opportunity information.
 *   - `app/api/orion/cv-components/route.ts`: API endpoint for fetching available CV components.
 *   - `app/api/orion/generate-tailored-content/route.ts`: The backend API endpoint responsible for calling the LLM to generate the tailored content. This is the core intelligence integration point.
 *   - `app/opportunity/[opportunityId]/cv-tailoring/page.tsx`: This page is typically navigated to from the `CV Tailoring Studio` where the auto-generate button is present.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `opportunityId` is correctly passed via Next.js `useParams`.
 *   - Assumes user profile data (`TOMIDES_PROFILE_DATA`) is pre-loaded into session state.
 *   - Assumes relevant API endpoints (`/api/orion/opportunities/[opportunityId]`, `/api/orion/cv-components`, `/api/orion/generate-tailored-content`) are fully functional and return data in the expected format.
 *   - Error and loading states are handled gracefully in the UI.
 *
 * NOTES:
 *   - This component relies heavily on client-side fetching due to its interactive nature and the need to access session state and trigger dynamic content generation.
 *   - Extensive logging is in place to track the flow of data and potential issues during content generation.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Input Validation**: Implement client-side validation for the presence of `profile` and `opportunityData` before attempting content generation to provide immediate user feedback.
 *   - **Content Editing**: Add an rich text editor (e.g., TipTap) for the `generatedContent` field to allow Tomide to directly edit and refine the AI-generated output.
 *   - **Version History**: Implement a mechanism to save and retrieve different versions of generated content, allowing comparison and iteration.
 *   - **Contextual Prompts**: Allow dynamic adjustment of prompts sent to `generate-tailored-content` based on user preferences or specific tailoring goals (e.g., "make it more concise," "focus on leadership").
 *   - **Streamlined Feedback**: Integrate `react-hot-toast` for more immediate and visually appealing user feedback on loading, success, and error states, consistent with other parts of the application.
 *   - **API Client Integration**: Utilize `apiClient` and `handleApiError` for more consistent and centralized API calls and error handling, reducing boilerplate in `useEffect` and `handleGenerateContent`.
 *   - **Progress Visualization**: For long-running LLM calls, consider adding a progress bar or more detailed status messages to enhance the user experience.
 *   - **Memory Interaction**: Allow Tomide to manually select which specific `opportunityMemories` to include in the content generation context for finer control.
 *   - **Cache Generated Content**: Implement caching of generated content (e.g., in local storage or a dedicated state management solution) to prevent re-generation on reloads or re-visits.
 */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Loader2 } from 'lucide-react';
import { useOpportunityMemory } from '@/lib/hooks/useOpportunityMemory';
import { useSessionState, SessionStateKeys, SessionState } from '@/lib/hooks/useSessionState';
import { OrionOpportunity } from '@/lib/types';
import { CVComponent } from '@/lib/types/cv';
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
            placeholder="Job description content..."
          />

          <p className="text-gray-500">Your CV Components:</p>
          {cvComponents.length > 0 ? (
            <ul className="list-disc list-inside text-gray-400">
              {cvComponents.map((component) => (
                <li key={component.id} className="mb-1">
                  <strong>{component.name}:</strong> {JSON.stringify(component.content)}
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
                placeholder="AI-generated tailored content..."
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
                placeholder="Raw LLM output for debugging..."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
