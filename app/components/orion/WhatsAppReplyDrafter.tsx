/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * @fileoverview React component for drafting WhatsApp replies using AI assistance.
 * @description This component provides a user interface to input chat context and a specific user prompt, which are then sent to a backend API to generate a strategic WhatsApp reply. It aims to streamline communication by leveraging LLMs to craft context-aware responses.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Capture essential chat context and user intent through intuitive input fields.
 *   - Invoke the `/api/orion/communication/draft-whatsapp-reply` API endpoint to request an AI-generated reply.
 *   - Display the generated reply to the user, facilitating efficient and strategic communication.
 *   - Provide clear loading states and error feedback to enhance user experience.
 *
 * FILEPATH: `app/components/orion/WhatsAppReplyDrafter.tsx`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/api/orion/communication/draft-whatsapp-reply/route.ts`: This component serves as the frontend client for this API, sending user inputs and receiving the drafted reply.
 *   - `@/components/ui`: Utilizes various Shadcn UI components (Button, Textarea, Input, Label, Select, Card, CardContent) for a consistent and modern UI.
 *   - `lucide-react`: Imports icons (`Loader2`, `Wand2`) for visual feedback during loading and action.
 *   - `@/lib/apiClient.ts`: Used for making the API call to the backend.
 *   - `react-hot-toast`: Provides transient notifications for user feedback (loading, success, error).
 *   - `@/lib/logger.ts`: Integrates logging for tracing user interactions and debugging within the component.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the backend API at `/api/orion/communication/draft-whatsapp-reply` is operational and correctly processes `chatContext` and `userPrompt`.
 *   - The generated reply is expected to be a single string. If the backend later supports multiple drafts, this component would need adjustment.
 *   - The UI is designed to be straightforward for quick reply generation based on provided context.
 *
 * NOTES:
 *   - COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE: This component could potentially be generalized into a `GenericCommunicationDrafter` if other platforms (e.g., Email, LinkedIn) require similar drafting capabilities with varying context inputs.
 *   - PERFORMANCE OPTIMIZATIONS: The API call is asynchronous, preventing UI freeze during LLM generation. Consider adding debouncing to input fields if frequent changes cause excessive API calls.
 *   - ERROR HANDLING ROBUSTNESS: Basic error messages are displayed. More specific error handling for different API response codes could be implemented.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Implement character limits or word count displays for input fields to guide users.
 *   - Add a history feature to store and revisit previously drafted replies.
 *   - Integrate sentiment analysis on the generated reply before displaying it to the user.
 *   - Allow users to provide additional constraints or parameters (e.g., tone sliders, length preferences) for the AI generation.
 *   - Explore incorporating context from other parts of the Orion system (e.g., memory, user profile) directly within this component, reducing manual input.
 */
'use client';

import React, { useState } from 'react';
import {
  Button,
  Textarea,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Card,
  CardContent,
} from '@/components/ui';
import { Loader2, Wand2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'react-hot-toast';
import logger from '@/lib/logger';

export function WhatsAppReplyDrafter() {
  const [chatContext, setChatContext] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [draftedReply, setDraftedReply] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDraftReply = async () => {
    setIsLoading(true);
    setError(null);
    setDraftedReply(null);
    toast.loading('Generating reply...');
    logger.info('[WhatsAppReplyDrafter] Initiating reply drafting.', {
      chatContextLength: chatContext.length,
      userPrompt,
    });

    try {
      const response = await apiClient.post<{ success: boolean; reply?: string; error?: string }>(
        '/api/orion/communication/draft-whatsapp-reply',
        {
          chatContext,
          userPrompt,
        }
      );

      if (response.data.success) {
        setDraftedReply(response.data.reply || null);
        toast.success('Reply generated!');
        logger.success('[WhatsAppReplyDrafter] Reply successfully generated.', {
          replyLength: response.data.reply?.length,
        });
      } else {
        setError(response.data.error || 'Failed to generate reply.');
        toast.error(response.data.error || 'Failed to generate reply.');
        logger.error('[WhatsAppReplyDrafter] Reply generation failed.', { error: response.data.error });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during reply generation.';
      setError(errorMessage);
      toast.error(errorMessage);
      logger.error('[WhatsAppReplyDrafter] Unexpected error during reply generation.', { error: err });
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="chatContext">Chat History / Context</Label>
        <Textarea
          id="chatContext"
          value={chatContext}
          onChange={(e) => setChatContext(e.target.value)}
          placeholder="Paste the relevant chat history or context here..."
          rows={8}
        />
      </div>
      <div>
        <Label htmlFor="userPrompt">Your Prompt / Goal for Reply (Optional)</Label>
        <Textarea
          id="userPrompt"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="E.g., 'Draft a polite decline,' 'Suggest a meeting time,' 'Emphasize urgency.'"
          rows={4}
        />
      </div>

      <Button onClick={handleDraftReply} disabled={isLoading || !chatContext} className="w-full">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />} Generate
        Reply
      </Button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {draftedReply && (
        <Card className="mt-6 shadow-md">
          <CardContent className="pt-6">
            <h3 className="text-md font-semibold text-primary mb-2">Generated Reply:</h3>
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{draftedReply}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
