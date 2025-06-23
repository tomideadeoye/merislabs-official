/**
 * @fileoverview Client-side component for the 'My Prompts' Management Studio.
 * @description This component provides the interactive UI for users to view, create, edit, and delete their personalized AI prompts. It interacts with the backend Prompt API endpoints to manage prompt data, offering a seamless and intuitive experience for organizing linguistic masterpieces.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To display a list of all user-defined prompts.
 *   - To provide a form for creating new prompts.
 *   - To enable in-place editing of existing prompt names, content, and categories.
 *   - To allow users to delete prompts.
 *   - To implement search and filtering capabilities for easy prompt retrieval.
 *   - To provide a copy-to-clipboard functionality for prompt content.
 *   - To manage UI states (loading, editing, error) and provide user feedback.
 *
 * FILEPATH: `app/components/orion/MyPromptsStudio.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/my-prompts/page.tsx`: The server component that renders this client component and passes `initialPrompts` data.
 *   - `@/lib/apiClient`: Used to make HTTP requests to `/api/orion/prompts/list`, `/api/orion/prompts/create`, `/api/orion/prompts/update`, and `/api/orion/prompts/delete`.
 *   - `@/lib/logger`: For comprehensive logging of client-side interactions and API calls.
 *   - `react-hot-toast`: Used for displaying user feedback (loading, success, error messages).
 *   - `@/components/ui`: Imports Shadcn UI components (Card, Button, Input, Textarea, Label, Dialog, Checkbox) for consistent styling and functionality.
 *   - `lucide-react`: Provides icons (`Loader2`, `Plus`, `Edit`, `Trash2`, `Copy`, `Search`, `Sparkles`).
 *   - `@/lib/utils/clientErrorHandler`: Centralized utility for consistent API error handling.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `initialPrompts` prop contains valid prompt data on component mount.
 *   - Assumes backend API endpoints (`/api/orion/prompts/*`) are operational and return data in expected formats.
 *   - User authentication and authorization are handled at the API route level; this component focuses on UI interaction.
 *   - The component manages its own loading and error states for a smooth user experience.
 *
 * NOTES:
 *   - This component is the central interactive hub for the 'My Prompts' feature, providing full CRUD capabilities.
 *   - Logging is crucial for debugging the intricate client-server interactions.
 *   - The use of `react-hot-toast` provides a delightful and consistent user feedback experience.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Rich Text Editor**: Integrate a rich text editor (e.g., TipTap) for `prompt.content` to allow for more flexible formatting.
 *   - **Drag-and-Drop Reordering**: If a specific order is desired, implement drag-and-drop for prompts.
 *   - **Category Management**: Allow users to create, edit, and delete prompt categories directly from the UI.
 *   - **Public/Private Prompts**: Add functionality to mark prompts as public or private, potentially sharing public ones with a community.
 *   - **Usage Tracking**: Implement a system to track how often each prompt is used.
 *   - **Advanced Search/Filtering**: Implement more sophisticated search (e.g., fuzzy search) and filtering (e.g., by multiple categories, last used date).
 *   - **Pagination for Large Lists**: For very large prompt libraries, implement client-side pagination to improve performance.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { type Prompt } from '@/lib/types'; // Import the Prisma Prompt type from our centralized types file
import { apiClient } from '@/lib/apiClient';
import logger from '@/lib/logger';
import { toast } from 'react-hot-toast';
import { handleClientError } from '@/lib/utils/clientErrorHandler';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui';
import { Loader2, Plus, Edit, Trash2, Copy, Search } from 'lucide-react';

interface MyPromptsStudioProps {
  initialPrompts: Prompt[];
}

export function MyPromptsStudio({ initialPrompts }: MyPromptsStudioProps) {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [newPromptName, setNewPromptName] = useState<string>('');
  const [newPromptContent, setNewPromptContent] = useState<string>('');
  const [newPromptCategory, setNewPromptCategory] = useState<string>('');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [editingContent, setEditingContent] = useState<string>('');
  const [editingCategory, setEditingCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Refetch prompts when component mounts or relevant data changes (e.g., after C/U/D)
  const fetchPrompts = useCallback(async () => {
    logger.info('[MyPromptsStudio][fetchPrompts][START]');
    setIsLoading(true);
    try {
      const response = await apiClient.get('/api/orion/prompts/list');
      if (response.data.success) {
        setPrompts(response.data.prompts);
        logger.success('[MyPromptsStudio][fetchPrompts][SUCCESS]', { count: response.data.prompts.length });
      } else {
        throw new Error(response.data.error || 'Failed to fetch prompts.');
      }
    } catch (err: unknown) {
      const handledError = handleClientError(err, { stage: 'fetch_prompts' });
      toast.error(`Error loading prompts: ${handledError.message}`);
      logger.error('[MyPromptsStudio][fetchPrompts][CATCH_ERROR]', {
        error: handledError.message,
        details: handledError.details,
      });
    } finally {
      setIsLoading(false);
      logger.info('[MyPromptsStudio][fetchPrompts][END]');
    }
  }, []);

  useEffect(() => {
    if (initialPrompts.length > 0) {
      setPrompts(initialPrompts);
      setIsLoading(false); // If initial data is provided, no need to fetch immediately
    } else {
      fetchPrompts(); // Otherwise, fetch on mount
    }
  }, [initialPrompts, fetchPrompts]);

  const handleCreatePrompt = async () => {
    logger.info('[MyPromptsStudio][handleCreatePrompt][START]', { newPromptName });
    if (!newPromptName || !newPromptContent) {
      toast.error('Prompt name and content cannot be empty.');
      return;
    }
    setIsCreating(true);
    toast.loading('Creating new prompt...');

    try {
      const response = await apiClient.post('/api/orion/prompts/create', {
        name: newPromptName,
        content: newPromptContent,
        category: newPromptCategory || undefined,
      });

      if (response.data.success) {
        setNewPromptName('');
        setNewPromptContent('');
        setNewPromptCategory('');
        fetchPrompts(); // Re-fetch to include the new prompt
        toast.success('Prompt created successfully!');
        logger.success('[MyPromptsStudio][handleCreatePrompt][SUCCESS]', { promptId: response.data.prompt.id });
      } else {
        throw new Error(response.data.error || 'Failed to create prompt.');
      }
    } catch (err: unknown) {
      const handledError = handleClientError(err, { stage: 'create_prompt' });
      toast.error(`Error saving prompt: ${handledError.message}`);
      logger.error('[MyPromptsStudio][handleSavePrompt][CATCH_ERROR]', {
        error: handledError.message,
        details: handledError.details,
      });
    } finally {
      setIsCreating(false);
      toast.dismiss();
      logger.info('[MyPromptsStudio][handleCreatePrompt][END]');
    }
  };

  const handleEditPrompt = (prompt: Prompt) => {
    logger.debug('[MyPromptsStudio][handleEditPrompt]', { promptId: prompt.id });
    setEditingPrompt(prompt);
    setEditingName(prompt.name);
    setEditingContent(prompt.content);
    setEditingCategory(prompt.category || '');
  };

  const handleUpdatePrompt = async () => {
    logger.info('[MyPromptsStudio][handleUpdatePrompt][START]', { promptId: editingPrompt?.id });
    if (!editingPrompt || !editingName || !editingContent) {
      toast.error('Prompt details cannot be empty.');
      return;
    }
    setIsUpdating(true);
    toast.loading('Updating prompt...');

    try {
      const response = await apiClient.put('/api/orion/prompts/update', {
        uniqueId: editingPrompt.uniqueId,
        name: editingName,
        content: editingContent,
        category: editingCategory || undefined,
      });

      if (response.data.success) {
        fetchPrompts(); // Re-fetch to get updated prompts
        setEditingPrompt(null); // Close dialog
        toast.success('Prompt updated successfully!');
        logger.success('[MyPromptsStudio][handleUpdatePrompt][SUCCESS]', { promptId: response.data.prompt.id });
      } else {
        throw new Error(response.data.error || 'Failed to update prompt.');
      }
    } catch (err: unknown) {
      const handledError = handleClientError(err, { stage: 'update_prompt' });
      toast.error(`Error saving prompt: ${handledError.message}`);
      logger.error('[MyPromptsStudio][handleSavePrompt][CATCH_ERROR]', {
        error: handledError.message,
        details: handledError.details,
      });
    } finally {
      setIsUpdating(false);
      toast.dismiss();
      logger.info('[MyPromptsStudio][handleUpdatePrompt][END]');
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    logger.info('[MyPromptsStudio][handleDeletePrompt][START]', { promptId });
    if (!confirm('Are you sure you want to delete this prompt?')) {
      logger.debug('[MyPromptsStudio][handleDeletePrompt][CANCELLED]', { promptId });
      return;
    }

    setIsLoading(true); // Using general isLoading for delete operation now
    toast.loading('Deleting prompt...');

    try {
      const response = await apiClient.delete('/api/orion/prompts/delete', { data: { uniqueId: promptId } });

      if (response.data.success) {
        setPrompts((prev) => prev.filter((p) => p.uniqueId !== promptId)); // Optimistically update UI
        toast.success('Prompt deleted successfully!');
        logger.success('[MyPromptsStudio][handleDeletePrompt][SUCCESS]', { promptId });
      } else {
        throw new Error(response.data.error || 'Failed to delete prompt.');
      }
    } catch (err: unknown) {
      const handledError = handleClientError(err, { stage: 'delete_prompt' });
      toast.error(`Error deleting prompt: ${handledError.message}`);
      logger.error('[MyPromptsStudio][handleDeletePrompt][CATCH_ERROR]', {
        error: handledError.message,
        details: handledError.details,
      });
    } finally {
      setIsLoading(false); // Using general isLoading for delete operation now
      toast.dismiss();
      logger.info('[MyPromptsStudio][handleDeletePrompt][END]');
    }
  };

  const handleCopyPrompt = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        toast.success('Prompt copied to clipboard!');
        logger.info('[MyPromptsStudio][handleCopyPrompt][SUCCESS]');
      })
      .catch((err) => {
        logger.error('[MyPromptsStudio][handleCopyPrompt][ERROR]', { error: err.message });
        toast.error('Failed to copy prompt.');
      });
  };

  const filterPrompts = (category: string) => {
    if (category === 'all') {
      return prompts;
    } else {
      return prompts.filter((prompt) => prompt.category === category);
    }
  };

  const displayedPrompts = filterPrompts('all').filter(
    (prompt) =>
      prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Create New Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPromptName">Prompt Name</Label>
            <Input
              id="newPromptName"
              value={newPromptName}
              onChange={(e) => setNewPromptName(e.target.value)}
              placeholder="e.g., Cold Email Intro"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPromptContent">Prompt Content</Label>
            <Textarea
              id="newPromptContent"
              value={newPromptContent}
              onChange={(e) => setNewPromptContent(e.target.value)}
              placeholder="Your detailed prompt text here..."
              rows={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPromptCategory">Category (Optional)</Label>
            <Input
              id="newPromptCategory"
              value={newPromptCategory}
              onChange={(e) => setNewPromptCategory(e.target.value)}
              placeholder="e.g., Sales, Marketing, Personal"
            />
          </div>
          <Button onClick={handleCreatePrompt} className="w-full" disabled={isCreating}>
            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Create Prompt
          </Button>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>My Prompts</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search prompts..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {displayedPrompts.length === 0 ? (
                <p className="text-center text-gray-500">No prompts found. Create one!</p>
              ) : (
                displayedPrompts.map((prompt) => (
                  <Card key={prompt.uniqueId} className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg">{prompt.name}</CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleCopyPrompt(prompt.content)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditPrompt(prompt)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePrompt(prompt.uniqueId!)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <p className="text-sm text-gray-400 whitespace-pre-wrap">{prompt.content}</p>
                      {prompt.category && (
                        <span className="inline-block bg-blue-900/30 text-blue-300 text-xs px-2 py-1 rounded-full mt-2">
                          {prompt.category}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Prompt Dialog */}
      {editingPrompt && (
        <Dialog open={!!editingPrompt} onOpenChange={() => setEditingPrompt(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Prompt</DialogTitle>
              <DialogDescription>Make changes to your prompt here. Click save when you&apos;re done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="promptName">Prompt Name</Label>
                <Input id="promptName" value={editingName} onChange={(e) => setEditingName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promptContent">Prompt Content</Label>
                <Textarea
                  id="promptContent"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  rows={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promptCategory">Category</Label>
                <Input
                  id="promptCategory"
                  value={editingCategory}
                  onChange={(e) => setEditingCategory(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdatePrompt} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
