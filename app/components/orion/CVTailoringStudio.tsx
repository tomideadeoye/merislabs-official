/**
 * @fileoverview The interactive client-side component for the CV Tailoring Studio.
 * @description This component allows users to select and assemble CV components based on AI suggestions
 * for a specific job opportunity. It interacts with backend APIs for component suggestion and final CV assembly.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide an interactive user interface for tailoring a CV.
 *   - To fetch AI-generated suggestions for relevant CV components.
 *   - To allow users to manually select/deselect CV components.
 *   - To trigger the backend API to assemble the selected components into a Markdown CV.
 *   - To display the assembled CV for preview.
 *   - To provide a clear path to proceed to the email drafting stage.
 *
 * FILEPATH: `app/components/orion/CVTailoringStudio.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/cv-tailoring/page.tsx`: The server component that renders this client component and passes initial `opportunity` and `cvComponents` data.
 *   - `@/lib/types`: Imports `CVComponent` and `OrionOpportunity` for strict type-checking.
 *   - `@/lib/apiClient`: Used to make HTTP requests to `/api/orion/cv/suggest-components` and `/api/orion/cv/assemble`.
 *   - `@/lib/logger`: Provides comprehensive logging for client-side interactions and API calls.
 *   - `next/navigation`: Uses `useRouter` for programmatic navigation.
 *   - `react-hot-toast`: Used for displaying user feedback (loading, success, error messages).
 *   - `@/components/ui`: Imports Shadcn UI components (Button, Card, Checkbox, Textarea, Label) for consistent styling and functionality.
 *   - `lucide-react`: Provides icons (`Loader2`, `Sparkles`, `Wand2`, `Send`) for visual elements.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `opportunity` and `cvComponents` props are provided and contain valid data.
 *   - Assumes backend APIs (`/api/orion/cv/suggest-components`, `/api/orion/cv/assemble`) are operational and return data in expected formats.
 *   - Assembled CV Markdown is temporarily stored in local storage before proceeding to email drafting.
 *   - User authentication is handled at the API route level; this component focuses on UI interaction.
 *
 * NOTES:
 *   - The `useEffect` hook ensures AI suggestions are loaded automatically upon component mount.
 *   - The `useCallback` hook is used for `handleSuggestComponents` to prevent unnecessary re-renders.
 *   - This component manages its own loading and assembly states for a smooth user experience.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Real-time Preview**: Implement a real-time Markdown preview pane for `assembledCvMarkdown` to give immediate visual feedback.
 *   - **Drag-and-Drop Ordering**: Allow users to reorder selected CV components via drag-and-drop for more control over the final layout.
 *   - **Advanced Component Editing**: Provide in-line editing capabilities for selected components before assembly, potentially using a rich text editor.
 *   - **Version Control/Save Draft**: Implement functionality to save tailored CV drafts (and selected component sets) to the database for future access.
 *   - **Dynamic Templates**: Allow users to select different CV templates beyond the fixed Markdown one.
 *   - **More Sophisticated Suggestions**: Enhance AI suggestion logic to consider more factors (e.g., user's past performance, specific keywords in JD).
 *   - **PDF Generation on Client**: Integrate a client-side Markdown-to-PDF conversion for immediate download/preview.
 */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CVComponent, OrionOpportunity } from '@/lib/types';
import { apiClient } from '@/lib/apiClient';
import logger from '@/lib/logger';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Checkbox,
  Textarea,
  Label,
} from '@/components/ui';
import { Loader2, Sparkles, Wand2, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Props {
  opportunity: OrionOpportunity;
  cvComponents: CVComponent[];
}

export function CVTailoringStudio({ opportunity, cvComponents }: Props) {
  const router = useRouter();
  const [suggestedIds, setSuggestedIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [assembledCvMarkdown, setAssembledCvMarkdown] = useState<string>('');
  const [isAssembling, setIsAssembling] = useState(false);

  const handleSuggestComponents = useCallback(async () => {
    logger.info('[CVTailoringStudio][handleSuggestComponents][START]', { opportunityId: opportunity.id });
    setIsLoading(true);
    toast.loading('Orion is analyzing the opportunity...');
    try {
      const response = await apiClient.post(`/api/orion/cv/suggest-components`, { opportunityId: opportunity.id });
      if (response.data.success) {
        const ids = response.data.suggestedComponentIds || [];
        setSuggestedIds(ids);
        setSelectedIds(new Set(ids));
        toast.success(`${ids.length} relevant components suggested!`);
        logger.success('[CVTailoringStudio][handleSuggestComponents][SUCCESS]', {
          opportunityId: opportunity.id,
          suggestedCount: ids.length,
        });
      } else {
        logger.error('[CVTailoringStudio][handleSuggestComponents][API_ERROR]', {
          opportunityId: opportunity.id,
          error: response.data.error,
        });
        throw new Error(response.data.error);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Could not get AI suggestions.';
      logger.error('[CVTailoringStudio][handleSuggestComponents][CATCH_ERROR]', {
        opportunityId: opportunity.id,
        error: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      toast.dismiss();
      logger.info('[CVTailoringStudio][handleSuggestComponents][END]', { opportunityId: opportunity.id });
    }
  }, [opportunity.id]);

  useEffect(() => {
    handleSuggestComponents();
  }, [handleSuggestComponents]);

  const handleToggle = (id: string) => {
    logger.debug('[CVTailoringStudio][handleToggle]', { componentId: id, currentSelection: Array.from(selectedIds) });
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      logger.debug('[CVTailoringStudio][handleToggle][NEW_SELECTION]', { newSelection: Array.from(newSet) });
      return newSet;
    });
  };

  const handleAssemble = async () => {
    logger.info('[CVTailoringStudio][handleAssemble][START]', { selectedComponentsCount: selectedIds.size });
    setIsAssembling(true);
    toast.loading('Assembling your tailored CV...');
    try {
      const componentIdsArray = Array.from(selectedIds);
      const response = await apiClient.post('/api/orion/cv/assemble', { componentIds: componentIdsArray });
      if (response.data.success) {
        setAssembledCvMarkdown(response.data.tailoredCvMarkdown);
        toast.success('CV draft assembled!');
        logger.success('[CVTailoringStudio][handleAssemble][SUCCESS]', {
          assembledCvLength: response.data.tailoredCvMarkdown.length,
        });
      } else {
        logger.error('[CVTailoringStudio][handleAssemble][API_ERROR]', { error: response.data.error });
        throw new Error(response.data.error);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'CV assembly failed.';
      logger.error('[CVTailoringStudio][handleAssemble][CATCH_ERROR]', { error: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsAssembling(false);
      toast.dismiss();
      logger.info('[CVTailoringStudio][handleAssemble][END]');
    }
  };

  const handleProceedToEmail = () => {
    logger.info('[CVTailoringStudio][handleProceedToEmail]', { opportunityId: opportunity.id });
    localStorage.setItem(`orion_assembled_cv_${opportunity.id}`, assembledCvMarkdown);
    router.push(`/admin/opportunity-pipeline/${opportunity.id}/draft-email`);
  };

  const renderComponent = (component: CVComponent) => (
    <div key={component.id} className="flex items-start space-x-3 rounded-lg border p-4 bg-gray-800 border-gray-700">
      <Checkbox
        id={component.uniqueId!}
        checked={selectedIds.has(component.uniqueId!)}
        onCheckedChange={() => handleToggle(component.uniqueId!)}
      />
      <div className="grid gap-1.5 leading-none">
        <label htmlFor={component.uniqueId!} className="font-medium">
          {component.name}
          {suggestedIds.includes(component.uniqueId!) && (
            <Sparkles className="h-4 w-4 inline-block ml-2 text-purple-400" />
          )}
        </label>
        <p className="text-xs text-gray-400">
          {typeof component.content === 'string' ? component.content : JSON.stringify(component.content)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>1. Select CV Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <>
              <h3 className="font-semibold text-purple-300">Suggested by Orion</h3>
              {cvComponents.filter((c) => c.uniqueId && suggestedIds.includes(c.uniqueId)).map(renderComponent)}
              <h3 className="font-semibold text-gray-400 pt-4 border-t mt-4">Other Components</h3>
              {cvComponents.filter((c) => c.uniqueId && !suggestedIds.includes(c.uniqueId)).map(renderComponent)}
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>2. Assemble & Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleAssemble} disabled={isAssembling || selectedIds.size === 0} className="w-full">
            <Wand2 className="mr-2 h-4 w-4" />
            Assemble CV
          </Button>
          <Textarea
            readOnly
            value={assembledCvMarkdown || 'Your tailored CV will appear here...'}
            className="min-h-[400px] bg-gray-900"
          />
          {assembledCvMarkdown && !isAssembling && (
            <Button onClick={handleProceedToEmail} className="w-full bg-green-600 hover:bg-green-700">
              <Send className="mr-2 h-4 w-4" />
              Proceed to Draft Email
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
