/**
 * @fileoverview The interactive client-side component for the CV Tailoring Studio.
 * @description This component serves as the intelligent, semi-automated command center within the Opportunity Super-Flow, transforming CV creation into a rapid, strategic exercise in narrative construction. It allows users to select, tailor, and assemble CV components based on AI suggestions for a specific job opportunity. It interacts with backend APIs for component suggestion, rephrasing, and final CV assembly.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - **Vision & Strategic Goal:**
 *     - Automate Component Selection: Use AI to intelligently suggest the most impactful CV components (experiences, skills, projects) for any given opportunity.
 *     - Enable Hyper-Personalization: Allow for AI-powered rephrasing and editing of each component to perfectly align with the target role's language and requirements.
 *     - Ensure Professional Output: Assemble the selected components into a perfectly formatted, 1-2 page professional CV, ready for automatic attachment to an application email.
 *     - Integrate Seamlessly: Function as a core, modular tool within the Opportunity Detail Page, leveraging context from other modules (like AI Evaluation and Memory) to enhance its output.
 *
 *   - **Core User Flow & Experience:**
 *     1. Initiation: From the Opportunity Detail Page, the user clicks "Tailor CV," launching the Studio.
 *     2. AI Suggestion (Proactive Assistance): Upon loading, the Studio automatically analyzes the job description and suggests the most relevant CV components, highlighting them for the user.
 *     3. Interactive Selection & Curation: The user reviews the suggestions and has full authority to select, de-select, add, and re-order components via a simple, intuitive interface.
 *     4. In-Place Tailoring (Optional): For any selected component, the user can trigger an "AI Rephrase" action to tailor its wording for maximum impact.
 *     5. Assembly & Preview: The user clicks "Assemble CV," and the system generates a live preview of the final document in clean Markdown.
 *     6. Transition to Application: Once satisfied, the user clicks "Proceed to Draft Email," which saves the assembled CV and navigates them to the next stage of the Super-Flow.
 *
 *   - **Functional Requirements (The "What"):**
 *     - FR-1: CV Component Data Source:
 *       - FR-1.1: The Studio MUST fetch all available CV components from the Neon PostgreSQL database via the `fetchAllCvComponents` service.
 *       - FR-1.2: Each component in the database must conform to the `CVComponent` Prisma model, containing `uniqueId`, `name`, `type`, `content` (JSON), and `tags`.
 *     - FR-2: AI-Powered Component Suggestion:
 *       - FR-2.1: The Studio UI MUST automatically trigger a `POST` request to the `/api/orion/cv/suggest-components` endpoint upon loading.
 *       - FR-2.2: This API endpoint will take the `opportunityId` and use an LLM to analyze the job description against the full list of CV components.
 *       - FR-2.3: The API MUST return a JSON object containing an array of the top 5-7 most relevant `uniqueId`s.
 *       - FR-2.4: The UI MUST visually distinguish the suggested components (e.g., by highlighting them or placing them in a separate "Recommended" list).
 *     - FR-3: Interactive Component Management UI:
 *       - FR-3.1 (Selection): The UI MUST display all CV components, allowing the user to select/deselect them using checkboxes. The AI-suggested components should be pre-selected by default.
 *       - FR-3.2 (Reordering): The UI SHOULD provide a drag-and-drop mechanism to re-order the selected components within their respective sections (e.g., re-ordering jobs under "Experience").
 *       - FR-3.3 (Editing - In-Place): The user MUST be able to click on the text of a selected component to edit it directly in the UI before assembly.
 *     - FR-4: AI-Powered Rephrasing:
 *       - FR-4.1: Each selected component in the UI MUST have a "Rephrase with AI" button.
 *       - FR-4.2: Clicking this will trigger a `POST` request to a **new API endpoint:** `/api/orion/cv/rephrase-component`.
 *       - FR-4.3 (API Logic): This API will receive the `componentContent` and the `jobDescription`. It will send a prompt to the LLM to "rephrase the following text to better align with the tone and keywords of the job description."
 *       - FR-4.4 (UI Update): The rephrased text will be returned and displayed in the UI, with an option for the user to "Accept" the change or "Revert" to the original.
 *     - FR-5: CV Assembly & Output:
 *       - FR-5.1: A button labeled "Assemble CV" MUST trigger a `POST` request to the `/api/orion/cv/assemble` endpoint.
 *       - FR-5.2 (API Logic): The API will receive the final list of selected `componentIds` and their (potentially edited) content. It will use a fixed template (`HYBRID_CV_TEMPLATE`) to structure the components into a clean **Markdown** string.
 *       - FR-5.3 (Preview): The returned Markdown MUST be displayed in a live preview panel within the Studio UI.
 *       - FR-5.4 (Export Options): The UI must provide buttons to **"Download as PDF"** and **"Copy Markdown"**. The PDF generation will be handled by our enhanced email service logic.
 *       - FR-5.5 (Transition): A "Proceed to Draft Email" button MUST become active after a CV is successfully assembled. Clicking it will save the `tailoredCvMarkdown` to `localStorage` and navigate the user to the email drafting page.
 *
 * FILEPATH: `app/components/orion/CVTailoringStudio.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/cv-tailoring/page.tsx`: The server component that renders this client component and passes initial `opportunity` and `cvComponents` data.
 *   - `@/lib/types`: Imports `CVComponent` and `OrionOpportunity` for strict type-checking.
 *   - `@/lib/apiClient`: Used to make HTTP requests to `/api/orion/cv/suggest-components`, `/api/orion/cv/rephrase-component` (NEW), and `/api/orion/cv/assemble`.
 *   - `@/lib/logger`: Provides comprehensive logging for client-side interactions and API calls.
 *   - `next/navigation`: Uses `useRouter` for programmatic navigation.
 *   - `react-hot-toast`: Used for displaying user feedback (loading, success, error messages).
 *   - `@/components/ui`: Imports Shadcn UI components (Button, Card, Checkbox, Textarea, Label) for consistent styling and functionality.
 *   - `lucide-react`: Provides icons (`Loader2`, `Sparkles`, `Wand2`, `Send`, `Copy`, `FileText`) for visual elements.
 *   - `app/api/orion/cv/rephrase-component/route.ts`: **NEW** API endpoint for AI-powered rephrasing of CV components.
 *   - `app/lib/cv_templates.ts`: Will contain the `HYBRID_CV_TEMPLATE` for CV assembly.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `opportunity` and `cvComponents` props are provided and contain valid data.
 *   - Assumes backend APIs (`/api/orion/cv/suggest-components`, `/api/orion/cv/rephrase-component`, `/api/orion/cv/assemble`) are operational and return data in expected formats.
 *   - Assembled CV Markdown is temporarily stored in local storage before proceeding to email drafting.
 *   - User authentication is handled at the API route level; this component focuses on UI interaction.
 *   - The `useEffect` hook ensures AI suggestions are loaded automatically upon component mount.
 *   - The `useCallback` hook is used for `handleSuggestComponents` to prevent unnecessary re-renders.
 *   - This component manages its own loading and assembly states for a smooth user experience.
 *
 * NON-FUNCTIONAL REQUIREMENTS:
 *   - Performance: The UI must remain responsive. All AI-powered actions (suggestion, rephrasing) must display clear loading indicators.
 *   - Usability: The interface must be intuitive, minimizing clicks and clearly separating the stages of selection, tailoring, and assembly.
 *   - Extensibility: The architecture must allow for new CV templates to be easily added to `app/lib/cv_templates.ts` in the future.
 *
 * NOTES:
 *   - This component centralizes the user interaction flow for CV tailoring, streamlining the process of preparing a job application.
 *   - Comprehensive logging helps in debugging the client-side flow and API interactions.
 *   - The use of `react-hot-toast` provides a delightful and consistent user feedback experience.
 *   - The tabbed interface improves the organization of features related to an opportunity.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Real-time Preview**: Implement a real-time Markdown preview pane for `assembledCvMarkdown` to give immediate visual feedback (part of FR-5.3, but can be enhanced).
 *   - **Drag-and-Drop Ordering**: Implement FR-3.2 to allow users to reorder selected CV components via drag-and-drop for more control over the final layout.
 *   - **Advanced Component Editing**: Implement FR-3.3 to provide in-line editing capabilities for selected components before assembly, potentially using a rich text editor.
 *   - **Version Control/Save Draft**: Implement functionality to save tailored CV drafts (and selected component sets) to the database for future access.
 *   - **Dynamic Templates**: Allow users to select different CV templates beyond the fixed Markdown one.
 *   - **More Sophisticated Suggestions**: Enhance AI suggestion logic to consider more factors (e.g., user's past performance, specific keywords in JD).
 *   - **PDF Generation on Client**: Integrate a client-side Markdown-to-PDF conversion for immediate download/preview (part of FR-5.4, can be client-side).
 *
 * TECHNICAL IMPLEMENTATION DETAILS:
 *   - Primary UI Component: `app/components/orion/CVTailoringStudio.tsx`
 *   - Supporting UI Components: `app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/cv-tailoring/page.tsx`
 *   - Core Backend APIs:
 *     - `GET /api/orion/cv-components` (existing)
 *     - `POST /api/orion/cv/suggest-components` (existing)
 *     - `POST /api/orion/cv/rephrase-component` (**New**)
 *     - `POST /api/orion/cv/assemble` (existing)
 *   - Core Services:
 *     - `app/lib/cv_components_db_service.ts`
 *     - `app/lib/orion_llm.ts`
 *   - Data Models:
 *     - `Prisma.CVComponent`
 *     - `lib/types/index.ts` (`RawCvComponentJsonData`)
 *     - `lib/cv_templates.ts`
 */
'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { OrionOpportunity, ScoredMemoryPoint } from '@/lib/types';
import { CVComponent } from '@/lib/types/cv';
import { apiClient } from '@/lib/apiClient';
import logger from '@/lib/logger';
import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Textarea } from '@/components/ui';
import { Loader2, Sparkles, Wand2, Send, Copy, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { handleClientError } from '@/lib/utils/clientErrorHandler';
import { QuadrantMemoryChunksVisualizer } from '@/components/orion/QuadrantMemoryChunksVisualizer';
import { useCVTailoringStore } from '@/lib/stores/cvTailoringStore';

interface Props {
  opportunity: OrionOpportunity;
  cvComponents: CVComponent[];
  initialError?: string | null;
}

export function CVTailoringStudio({ opportunity, cvComponents, initialError }: Props) {
  const router = useRouter();
  const {
    suggestedIds,
    setSuggestedIds,
    selectedIds,
    setSelectedIds,
    editedContents,
    setEditedContents,
    isLoading,
    setIsLoading,
    assembledCvMarkdown,
    setAssembledCvMarkdown,
    isAssembling,
    setIsAssembling,
    isRephrasing,
    setIsRephrasing,
    isDownloadingPdf,
    setIsDownloadingPdf,
    isAutoGeneratingCv,
    setIsAutoGeneratingCv,
    autoGenerateMemoryResults,
    setAutoGenerateMemoryResults,
    reset,
  } = useCVTailoringStore();

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
        const initialEditedContents = new Map<string, string>();
        cvComponents.forEach((comp) => {
          if (comp.uniqueId) {
            initialEditedContents.set(
              comp.uniqueId,
              typeof comp.content === 'string' ? comp.content : JSON.stringify(comp.content || '')
            );
          }
        });
        setEditedContents(initialEditedContents);
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
    } catch (err: unknown) {
      const handledError = handleClientError(err, {
        opportunityId: opportunity.id,
        stage: 'suggest_components_fetch',
      });
      toast.error(handledError.message);
    } finally {
      setIsLoading(false);
      toast.dismiss();
      logger.info('[CVTailoringStudio][handleSuggestComponents][END]', { opportunityId: opportunity.id });
    }
  }, [opportunity.id, cvComponents]);

  useEffect(() => {
    if (initialError) {
      toast.error(initialError);
      logger.error('[CVTailoringStudio][InitialLoadError]', { error: initialError });
    }
    handleSuggestComponents();
  }, [handleSuggestComponents, initialError]);

  const handleToggle = (id: string) => {
    logger.debug('[CVTailoringStudio][handleToggle]', { componentId: id, currentSelection: Array.from(selectedIds) });
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    logger.debug('[CVTailoringStudio][handleToggle][NEW_SELECTION]', { newSelection: Array.from(newSet) });
    setSelectedIds(newSet);
  };

  const handleContentChange = (id: string, newContent: string) => {
    const newMap = new Map(editedContents);
    newMap.set(id, newContent);
    setEditedContents(newMap);
  };

  const handleRephrase = async (componentId: string, currentContent: string) => {
    logger.info('[CVTailoringStudio][handleRephrase][START]', { componentId, opportunityId: opportunity.id });
    const newSet = new Set(isRephrasing);
    newSet.add(componentId);
    setIsRephrasing(newSet);
    toast.loading('Orion is rephrasing your content...', { id: `rephrase-${componentId}` });

    try {
      if (!opportunity.content) {
        throw new Error('Opportunity job description is missing, cannot rephrase.');
      }

      const response = await apiClient.post('/api/orion/cv/rephrase-component', {
        componentContent: currentContent,
        jobDescription: opportunity.content,
      });

      if (response.data.success && response.data.rephrasedContent) {
        handleContentChange(componentId, response.data.rephrasedContent);
        toast.success('Content rephrased successfully!', { id: `rephrase-${componentId}` });
        logger.success('[CVTailoringStudio][handleRephrase][SUCCESS]', {
          componentId,
          rephrasedLength: response.data.rephrasedContent.length,
        });
      } else {
        throw new Error(response.data.error || 'Failed to rephrase content.');
      }
    } catch (err: unknown) {
      const handledError = handleClientError(err, {
        componentId,
        opportunityId: opportunity.id,
        stage: 'rephrase_component_api_call',
      });
      logger.error('[CVTailoringStudio][handleRephrase][CATCH_ERROR]', {
        componentId,
        error: handledError.message,
      });
      toast.error(`Rephrasing failed: ${handledError.message}`, { id: `rephrase-${componentId}` });
    } finally {
      const newSet = new Set(isRephrasing);
      newSet.delete(componentId);
      setIsRephrasing(newSet);
      toast.dismiss(`rephrase-${componentId}`);
      logger.info('[CVTailoringStudio][handleRephrase][END]', { componentId });
    }
  };

  const handleAssemble = async () => {
    logger.info('[CVTailoringStudio][handleAssemble][START]', { opportunityId: opportunity.id });
    setIsAssembling(true);
    toast.loading('Assembling your CV...');
    setAssembledCvMarkdown('');
    try {
      const componentsToSend = Array.from(selectedIds).map((id) => ({
        id,
        content: editedContents.get(id) || '',
      }));

      const response = await apiClient.post(`/api/orion/cv/assemble`, { components: componentsToSend });

      if (response.data.success && response.data.markdown) {
        setAssembledCvMarkdown(response.data.markdown);
        toast.success('CV assembled successfully!');
        logger.success('[CVTailoringStudio][handleAssemble][SUCCESS]', { cvLength: response.data.markdown.length });
      } else {
        logger.error('[CVTailoringStudio][handleAssemble][API_ERROR]', {
          opportunityId: opportunity.id,
          error: response.data.error,
        });
        throw new Error(response.data.error);
      }
    } catch (err: unknown) {
      const handledError = handleClientError(err, {
        opportunityId: opportunity.id,
        stage: 'assemble_cv_api_call',
      });
      logger.error('[CVTailoringStudio][handleAssemble][CATCH_ERROR]', {
        opportunityId: opportunity.id,
        error: handledError.message,
      });
      toast.error(`CV Assembly failed: ${handledError.message}`);
    } finally {
      setIsAssembling(false);
      toast.dismiss();
      logger.info('[CVTailoringStudio][handleAssemble][END]', { opportunityId: opportunity.id });
    }
  };

  const handleAutoGenerateCv = async () => {
    logger.info('[CVTailoringStudio][handleAutoGenerateCv][START]', { opportunityId: opportunity.id });
    setIsAutoGeneratingCv(true);
    setAutoGenerateMemoryResults([]);
    setAssembledCvMarkdown('');
    toast.loading('Orion is intelligently generating your CV...');

    try {
      if (!opportunity.content) {
        throw new Error('Opportunity job description is missing, cannot auto-generate CV.');
      }

      const response = await apiClient.post(`/api/orion/cv/assemble`, {
        autoGenerate: true,
        jobDescription: opportunity.content,
      });

      if (response.data.success && response.data.tailoredCvMarkdown) {
        setAssembledCvMarkdown(response.data.tailoredCvMarkdown);
        if (response.data.memoryResults) {
          setAutoGenerateMemoryResults(response.data.memoryResults);
        }
        toast.success('CV auto-generated successfully!');
        logger.success('[CVTailoringStudio][handleAutoGenerateCv][SUCCESS]', {
          assembledLength: response.data.tailoredCvMarkdown.length,
          memoryResultsCount: response.data.memoryResults?.length || 0,
        });
      } else {
        throw new Error(response.data.error || 'Failed to auto-generate CV.');
      }
    } catch (err: unknown) {
      const handledError = handleClientError(err, {
        opportunityId: opportunity.id,
        stage: 'auto_generate_cv_api_call',
      });
      toast.error(`Auto-generation failed: ${handledError.message}`);
    } finally {
      setIsAutoGeneratingCv(false);
      toast.dismiss();
      logger.info('[CVTailoringStudio][handleAutoGenerateCv][END]');
    }
  };

  const handleProceedToEmail = () => {
    logger.info('[CVTailoringStudio][handleProceedToEmail]', { opportunityId: opportunity.id });
    if (assembledCvMarkdown) {
      localStorage.setItem('tailoredCvMarkdown', assembledCvMarkdown);
      router.push(`/admin/opportunity-pipeline/${opportunity.id}/draft-email`);
    } else {
      toast.error('Please assemble a CV first.');
    }
  };

  const handleCopyMarkdown = () => {
    if (assembledCvMarkdown) {
      navigator.clipboard.writeText(assembledCvMarkdown);
      toast.success('CV Markdown copied to clipboard!');
      logger.info('[CVTailoringStudio][handleCopyMarkdown][SUCCESS]', { cvLength: assembledCvMarkdown.length });
    } else {
      toast.error('No CV to copy. Please assemble the CV first.');
      logger.warn('[CVTailoringStudio][handleCopyMarkdown][NO_CV]');
    }
  };

  const handleDownloadPdf = async () => {
    if (!assembledCvMarkdown) {
      toast.error('No CV to download. Please assemble the CV first.');
      logger.warn('[CVTailoringStudio][handleDownloadPdf][NO_CV]');
      return;
    }

    logger.info('[CVTailoringStudio][handleDownloadPdf][START]', { cvLength: assembledCvMarkdown.length });
    setIsDownloadingPdf(true);
    toast.loading('Preparing PDF for download...');

    try {
      const response = await apiClient.post(
        '/api/orion/cv/download-pdf',
        {
          markdown: assembledCvMarkdown,
          opportunityId: opportunity.id, // Pass opportunityId for context
        },
        {
          responseType: 'blob', // Crucial for handling file downloads
        }
      );

      if (response.status === 200 && response.data) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `CV-${opportunity.title || 'tailored'}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success('PDF downloaded successfully!');
        logger.success('[CVTailoringStudio][handleDownloadPdf][SUCCESS]', {
          fileName: `CV-${opportunity.title || 'tailored'}.pdf`,
        });
      } else {
        throw new Error(response.data?.error || 'Failed to download PDF.');
      }
    } catch (err: unknown) {
      const handledError = handleClientError(err, {
        opportunityId: opportunity.id,
        stage: 'download_pdf_api_call',
      });
      toast.error(`PDF Download failed: ${handledError.message}`);
    } finally {
      setIsDownloadingPdf(false);
      toast.dismiss();
      logger.info('[CVTailoringStudio][handleDownloadPdf][END]');
    }
  };

  const filterAndSortComponents = (components: CVComponent[]) => {
    const selectedComponentsList = components.filter((comp) => comp.uniqueId && selectedIds.has(comp.uniqueId));

    const typeOrder = [
      'Profile Summary',
      'Work Experience',
      'Education',
      'Skills',
      'Projects',
      'Certifications / Awards',
      'Interests',
      'Publications',
      'Volunteer Experience',
    ];

    selectedComponentsList.sort((a, b) => {
      const typeA = typeOrder.indexOf(a.type);
      const typeB = typeOrder.indexOf(b.type);

      if (typeA !== typeB) {
        return typeA - typeB;
      }
      return a.name.localeCompare(b.name);
    });
    return selectedComponentsList;
  };

  const renderComponent = (component: CVComponent) => {
    const isSelected = selectedIds.has(component.uniqueId || '');
    const isRephrasingThis = isRephrasing.has(component.uniqueId || '');
    const currentContent = editedContents.get(component.uniqueId || '') || '';
    return (
      <Card key={component.id} className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={component.uniqueId || component.id}
                checked={isSelected}
                onCheckedChange={() => handleToggle(component.uniqueId || '')}
                className="mt-1 border-gray-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
              />
              <CardTitle>{component.name}</CardTitle>
            </div>
            {suggestedIds.includes(component.uniqueId || '') && (
              <span className="text-sm text-green-500">AI Suggested</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={currentContent}
            onChange={(e) => handleContentChange(component.uniqueId || '', e.target.value)}
            className="mb-2"
            rows={4}
            disabled={!isSelected || isRephrasingThis}
          />
          <Button
            onClick={() => handleRephrase(component.uniqueId || '', currentContent)}
            variant="outline"
            size="sm"
            disabled={!isSelected || isRephrasingThis}
            className="w-full"
          >
            {isRephrasingThis ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            {isRephrasingThis ? 'Rephrasing...' : 'Rephrase with AI'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full">
      <div className="flex-1 p-4 overflow-y-auto space-y-6 lg:border-r lg:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">CV Tailoring Studio</h2>

        <Card className="bg-gray-800 border-gray-700 text-gray-100">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Suggested Components</span>
              <Button
                onClick={handleSuggestComponents}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isLoading ? 'Analyzing...' : 'Re-suggest Components'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filterAndSortComponents(cvComponents).map((component) => renderComponent(component))}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-gray-100">
          <CardHeader>
            <CardTitle>CV Assembly & Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Button
              onClick={handleAssemble}
              disabled={isAssembling || selectedIds.size === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isAssembling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {isAssembling ? 'Assembling...' : 'Assemble CV'}
            </Button>
            <Button
              onClick={handleAutoGenerateCv}
              disabled={isAutoGeneratingCv || !opportunity.content}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isAutoGeneratingCv ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isAutoGeneratingCv ? 'Auto-generating...' : 'Auto-Generate CV from JD'}
            </Button>

            {assembledCvMarkdown && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-100">Assembled CV Preview:</h3>
                <Textarea
                  value={assembledCvMarkdown || ''} // Ensure it's a string for the value prop
                  rows={20}
                  readOnly
                  className="bg-gray-700 border-gray-600 text-gray-200 font-mono"
                />
                <div className="flex space-x-2">
                  <Button onClick={handleCopyMarkdown} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white">
                    <Copy className="mr-2 h-4 w-4" /> Copy Markdown
                  </Button>
                  <Button
                    onClick={handleDownloadPdf}
                    disabled={isDownloadingPdf}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    {isDownloadingPdf ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="mr-2 h-4 w-4" />
                    )}
                    Download PDF
                  </Button>
                </div>
                <Button onClick={handleProceedToEmail} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Proceed to Draft Email
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {autoGenerateMemoryResults.length > 0 && (
        <div className="flex-1 p-4 overflow-y-auto lg:border-l lg:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Memory Insights</h2>
          <QuadrantMemoryChunksVisualizer memoryResults={autoGenerateMemoryResults} />
        </div>
      )}
    </div>
  );
}
