/**
 * @fileoverview Client-side component for the Proposal Drafting Studio within the Business Management module.
 * @description This component provides an interactive user interface for drafting business proposals, leveraging Orion's intelligence for content generation, and enabling users to review, edit, and manage their proposals. It aims to streamline the proposal creation process by offering AI-powered assistance.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To offer a user-friendly interface for generating, reviewing, and editing business proposal drafts.
 *   - To integrate with a backend API (e.g., `/api/orion/proposals/draft`) for AI-powered content suggestions and generation.
 *   - To allow users to manually edit and refine the drafted proposal content.
 *   - To manage various states, including loading, drafting, and potential errors, providing clear user feedback.
 *   - To enable the saving or export of finalized proposals (future functionality).
 *
 * FILEPATH: `app/components/orion/business-management/ProposalDraftingStudio.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/business-management/proposals/page.tsx`: The page that renders this client component.
 *   - `@/lib/apiClient`: Will be used to make HTTP requests to backend API routes (e.g., `/api/orion/proposals/draft`).
 *   - `@/lib/logger`: For comprehensive logging of client-side interactions and API calls.
 *   - `react-hot-toast`: Used for displaying user feedback (loading, success, error messages).
 *   - `@/components/ui`: Imports Shadcn UI components (Button, Card, Textarea, Input, Label, Tabs) for consistent styling and functionality.
 *   - `lucide-react`: Provides icons (`Loader2`, `Sparkles`, `FileText`, `Send`, `Copy`).
 *   - `@/lib/utils/clientErrorHandler`: Centralized utility for consistent API error handling.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes backend API for proposal drafting (`/api/orion/proposals/draft`) will be operational.
 *   - User authentication and authorization will be handled at the API route level.
 *   - The component actively manages its own loading and error states for a smooth user experience.
 *
 * NOTES:
 *   - This component will be a cornerstone of the Business Management module, automating a key aspect of business development.
 *   - Comprehensive logging is vital for debugging the client-server interactions and LLM outputs.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Rich Text Editor**: Integrate a rich text editor (e.g., TipTap) for more advanced proposal formatting capabilities.
 *   - **Dynamic Templates**: Allow users to select from various proposal templates or define their own.
 *   - **Version Control/Save Drafts**: Implement functionality to save proposal drafts to the database for later access and versioning.
 *   - **Attachment Management**: Allow users to attach relevant documents (e.g., case studies, client testimonials) to proposals.
 *   - **Stakeholder Collaboration**: Future integration for collaborative editing and review by multiple stakeholders.
 *   - **CRM Integration**: Integrate with a CRM system to pull client details and push finalized proposals.
 *   - **AI-powered Feedback**: Provide AI-driven suggestions for improving the persuasiveness or clarity of the proposal.
 */

'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import logger from '@/lib/logger';
import { toast } from 'react-hot-toast';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui'; // Changed to @/components/ui
import { Loader2, Sparkles, FileText, Copy } from 'lucide-react'; // Added Copy import
import { handleClientError } from '@/lib/utils/clientErrorHandler';

export function ProposalDraftingStudio() {
  // Removed props destructuring
  const [proposalTitle, setProposalTitle] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [keyObjectives, setKeyObjectives] = useState<string>('');
  const [generatedDrafts, setGeneratedDrafts] = useState<Array<{ title: string; content: string }>>([]);
  const [selectedDraftIndex, setSelectedDraftIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateProposal = async () => {
    logger.info('[ProposalDraftingStudio][handleGenerateProposal][START]', {
      proposalTitle,
      clientName,
      keyObjectives,
    });
    setIsGenerating(true);
    setError(null);
    toast.loading('Orion is drafting your proposal...');

    try {
      // Placeholder for API call to generate proposal drafts
      // This API will need to be created at /api/orion/proposals/draft
      const response = await apiClient.post('/api/orion/proposals/draft', {
        proposalTitle,
        clientName,
        keyObjectives,
        // Add more context as needed, e.g., relevant memories, opportunity data
      });

      if (response.data?.success && Array.isArray(response.data.drafts)) {
        setGeneratedDrafts(response.data.drafts);
        setSelectedDraftIndex(0); // Select the first draft by default
        toast.success(`${response.data.drafts.length} proposal drafts generated!`);
        logger.success('[ProposalDraftingStudio][handleGenerateProposal][SUCCESS]', {
          draftCount: response.data.drafts.length,
        });
      } else {
        throw new Error(
          response.data?.error || 'Failed to generate proposal drafts. Server did not provide specific error.'
        );
      }
    } catch (err: unknown) {
      const handledError = handleClientError(err, { stage: 'proposal_draft_api_call' });
      toast.error(`Drafting Failed: ${handledError.message}`);
      logger.error('[ProposalDraftingStudio][handleGenerateProposal][CATCH_ERROR]', {
        error: handledError.message,
        details: handledError.details,
      });
    } finally {
      setIsGenerating(false);
      toast.dismiss();
      logger.info('[ProposalDraftingStudio][handleGenerateProposal][END]');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>1. Input Proposal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proposalTitle">Proposal Title</Label>
            <Input
              id="proposalTitle"
              value={proposalTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProposalTitle(e.target.value)} // Explicitly typed e
              placeholder="e.g., &#39;Strategic Partnership for Q4 Growth&#39;" // Escaped single quote
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientName(e.target.value)} // Explicitly typed e
              placeholder="e.g., &#39;Acme Corp&#39;" // Escaped single quote
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keyObjectives">Key Objectives & Scope</Label>
            <Textarea
              id="keyObjectives"
              value={keyObjectives}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setKeyObjectives(e.target.value)} // Explicitly typed e
              placeholder="e.g., &#39;Increase market share by 15% in new region, streamline operations, reduce overheads.&#39;" // Escaped single quote
              rows={5}
            />
          </div>
          <Button
            onClick={handleGenerateProposal}
            disabled={isGenerating || !proposalTitle || !clientName || !keyObjectives}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Proposal Drafts
              </>
            )}
          </Button>
          {error && (
            <div className="bg-red-900/20 border border-red-700 text-red-300 p-3 rounded-lg flex items-center shadow-lg text-sm">
              <FileText className="h-5 w-5 mr-2" />
              Error: {error}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Review & Refine Drafts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {generatedDrafts.length > 0 ? (
            <Tabs
              value={String(selectedDraftIndex)}
              onValueChange={(value: string) => setSelectedDraftIndex(Number(value))}
            >
              {' '}
              {/* Explicitly typed value */}
              <TabsList className="grid w-full grid-cols-3">
                {generatedDrafts.map((draft, index) => (
                  <TabsTrigger key={index} value={String(index)}>
                    Draft {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              {generatedDrafts.map((draft, index) => (
                <TabsContent key={index} value={String(index)} className="mt-4">
                  <div className="space-y-2 mb-4">
                    <Label>Draft Title</Label>
                    <Input value={draft.title} readOnly className="font-semibold" />
                  </div>
                  <Label>Proposal Content</Label>
                  <Textarea value={draft.content} rows={20} className="min-h-[400px] bg-gray-900" />
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button onClick={() => navigator.clipboard.writeText(draft.content)} variant="outline">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </Button>
                    {/* Future: Add 'Save' or 'Export' buttons here */}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center text-gray-500 py-10">
              <FileText className="mx-auto h-12 w-12 text-gray-600 mb-4" />
              <p>Enter details and click &#39;Generate&#39; to see proposal drafts here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
