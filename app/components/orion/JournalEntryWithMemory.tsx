import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
// GOAL OF FILE|FEATURES|FUNCTIONS: Provides a form for users to write and save new journal entries. Includes a placeholder for integration with the memory system backend API.
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/components/orion/JournalEntryWithMemory.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Consumed by `JournalPage` (`app/journal/page.tsx`).
//   - Uses `@/components/ui` components (`Card`, `Textarea`, `Button`).
import { Button } from '@/components/ui/button';
import logger from '@/lib/logger';
// GOAL OF FILE: Provide a form for new journal entries and integrate with memory features.
// RELATION TO OTHER FILES: This component is used in `app/journal/page.tsx`.
// It will allow users to input journal text, which will then be processed and added to Orion's memory.

export const JournalEntryWithMemory: React.FC = () => {
  const [journalText, setJournalText] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSaveJournal = async () => {
    if (!journalText.trim()) {
      setFeedback({ type: 'error', message: 'Journal entry cannot be empty.' });
      return;
    }

    setIsProcessing(true);
    setFeedback(null);
    logger.info('[JournalEntryWithMemory] Saving journal entry to memory.', { operation: 'save_journal' });

    try {
      // This would typically call an API endpoint to process and save the journal entry,
      // which in turn would interact with the Qdrant memory.
      // Example: const response = await fetch('/api/orion/memory/journal', { method: 'POST', body: JSON.stringify({ text: journalText }) });
      // For now, it's a simulated success.
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      setFeedback({ type: 'success', message: 'Journal entry saved to Orion Memory successfully!' });
      setJournalText(''); // Clear form
      logger.success('[JournalEntryWithMemory] Journal entry saved successfully.');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setFeedback({ type: 'error', message: `Failed to save entry: ${errorMessage}` });
      logger.error('[JournalEntryWithMemory] Failed to save journal entry.', { error: errorMessage });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl">New Journal Entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Write your thoughts, reflections, or insights here..."
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          rows={8}
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          disabled={isProcessing}
        />
        <Button
          onClick={handleSaveJournal}
          disabled={isProcessing}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isProcessing ? 'Saving to Memory...' : 'Save to Orion Memory'}
        </Button>
        {feedback && (
          <p className={feedback.type === 'success' ? 'text-green-500' : 'text-red-500'}>{feedback.message}</p>
        )}
      </CardContent>
    </Card>
  );
};
