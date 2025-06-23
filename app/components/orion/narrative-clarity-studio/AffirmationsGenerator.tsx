/**
 * @fileoverview React component for generating and displaying personalized words of affirmation.
 * @description This component provides a user interface to optionally input a context prompt, trigger
 *   an API call to retrieve affirmations based on user history from Qdrant, and display them in an engaging manner.
 *   It is designed to be integrated directly into the Narrative Clarity Studio page.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Allow users to generate affirmations based on their Qdrant memory history.
 *   - Provide an optional text input for a specific context or focus for the affirmations.
 *   - Display a list of generated affirmations, potentially with a dynamic, engaging presentation.
 *   - Indicate loading states and handle errors gracefully.
 *
 * FILEPATH: `app/components/orion/narrative-clarity-studio/AffirmationsGenerator.tsx`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/narrative-clarity-studio/page.tsx`: This component will be embedded directly into this page.
 *   - `app/api/orion/narrative/affirmations/route.ts`: This component serves as the frontend client, sending requests to this API and receiving affirmations.
 *   - `@/lib/apiClient.ts`: Used for making the API call to the backend.
 *   - `@/lib/logger.ts`: Integrates logging for tracing user interactions and debugging.
 *   - `@/components/ui`: Utilizes Shadcn UI components (Button, Textarea, Label, Card, CardContent) for consistent styling.
 *   - `lucide-react`: Imports icons (`Loader2`, `Sparkles`) for visual feedback.
 *   - `react-hot-toast`: Provides transient notifications for user feedback.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the backend API at `/api/orion/narrative/affirmations` is operational and returns an array of strings.
 *   - The component relies on the user being authenticated for personalized memory retrieval.
 *   - Affirmations are displayed as a simple list; future enhancements could involve more dynamic presentations.
 *
 * NOTES:
 *   - OPPORTUNITIES FOR IMPROVEMENT:
 *     - Implement subtle **animations** (e.g., using `framer-motion`) for affirmations as they appear, making the generation process feel even more magical and impactful.
 *     - Consider a "carousel" or "deck" view for affirmations, allowing users to swipe through them.
 *     - Add a "Save to Journal" or "Favorite" button next to each affirmation, allowing users to store resonant affirmations in a dedicated section within their Notion journal or a new database.
 *     - Implement an "Affirmation History" view to revisit past generated affirmations.
 *     - Introduce pre-defined "themes" or "categories" (e.g., "Career Resilience," "Emotional Well-being," "Creative Flow," "Overcoming Procrastination") as selectable options to influence the LLM prompt.
 *     - Explore creating a small, persistent dashboard widget or a daily push notification system (if applicable in Electron) that presents a new affirmation.
 *     - Integrate a text-to-speech API to allow users to hear their affirmations spoken aloud.
 *   - PERFORMANCE OPTIMIZATIONS: The API call is asynchronous, preventing UI blocking. Consider debouncing the input if it triggers frequent re-generations.
 *   - ERROR HANDLING ROBUSTNESS: Basic error display is implemented. Further granular error messages based on API responses could be beneficial.
 * are the af
 * OPPORTUNITIES TO CONSOLIDATE: None immediately apparent, this is a distinct feature within the Narrative Clarity Studio.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'react-hot-toast';
import logger from '@/lib/logger';

export function AffirmationsGenerator() {
  const [contextPrompt, setContextPrompt] = useState('');
  const [affirmations, setAffirmations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAffirmations = async () => {
    setIsLoading(true);
    setAffirmations([]);
    setError(null);
    toast.loading('Generating personalized affirmations...');
    logger.info('[AffirmationsGenerator] Initiating affirmation generation.', {
      contextPromptLength: contextPrompt.length,
    });

    try {
      const response = await apiClient.post('/api/orion/narrative/affirmations', {
        contextPrompt,
      });

      if (response.data.success) {
        setAffirmations(response.data.affirmations);
        toast.success('Affirmations generated! Feeling empowered yet?');
        logger.success('[AffirmationsGenerator] Affirmations successfully generated.', {
          count: response.data.affirmations.length,
        });
      } else {
        setError(response.data.error || 'Failed to generate affirmations.');
        toast.error(response.data.error || 'Failed to generate affirmations.');
        logger.error('[AffirmationsGenerator] Affirmation generation failed.', { error: response.data.error });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast.error(errorMessage);
      logger.error('[AffirmationsGenerator] Unexpected error during affirmation generation.', { error: err });
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  return (
    <Card className="p-6 space-y-6 shadow-lg">
      <div className="space-y-2">
        <Label htmlFor="contextPrompt" className="text-lg font-semibold text-primary">
          Focus for Affirmations (Optional)
        </Label>
        <Textarea
          id="contextPrompt"
          value={contextPrompt}
          onChange={(e) => setContextPrompt(e.target.value)}
          placeholder="e.g., 'my career growth', 'overcoming challenges', 'my intrinsic worth'"
          rows={3}
          className="text-base"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Provide a focus to make affirmations more relevant to your current needs.
        </p>
      </div>

      <Button
        onClick={handleGenerateAffirmations}
        disabled={isLoading}
        className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md transition-all duration-300 transform hover:scale-105"
      >
        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />} Generate
        Affirmations
      </Button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {affirmations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center text-green-500">Your Personalized Affirmations:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {affirmations.map((affirmation, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-600/20 dark:border-blue-500/20 rounded-xl p-4 transition-transform duration-200 hover:scale-[1.02] transform backdrop-blur-sm"
              >
                <CardContent className="p-0 text-center">
                  <p className="text-lg italic text-gray-800 dark:text-gray-200">&quot;{affirmation}&quot;</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Remember these powerful words. You are amazing!
          </p>
        </div>
      )}
    </Card>
  );
}
