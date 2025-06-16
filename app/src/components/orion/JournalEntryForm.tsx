'use client';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component, usage patterns, next steps if any
import React, { useState, useCallback, useEffect } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/lib/app_constants';
import {
  Button,
  Textarea,
  Input,
  Label,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Checkbox,
} from '@/ui/components/ui';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '../../../src/components/ui/lib/utils';
import { Loader2 } from 'lucide-react';

interface JournalEntryFormProps {
  onEntrySaved?: (entryId: string, reflection?: string) => void;
}

// Predefined mood options
const moodOptions = [
  'Happy',
  'Excited',
  'Grateful',
  'Calm',
  'Content',
  'Neutral',
  'Tired',
  'Anxious',
  'Stressed',
  'Sad',
  'Frustrated',
  'Angry',
  'Reflective',
  'Motivated',
  'Inspired',
];

// Predefined tag options
const tagOptions = [
  'work',
  'personal',
  'health',
  'relationships',
  'career',
  'learning',
  'goals',
  'challenges',
  'achievements',
  'ideas',
  'project_alpha',
  'project_beta',
  'finance',
  'travel',
  'family',
];

export const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ onEntrySaved }) => {
  const { selectSessionValue, setSessionValue } = useSessionState();
  const [journalText, setLocalJournalText] = useState<string>('');

  // Initialize local state from session state on mount
  useEffect(() => {
    const storedText = selectSessionValue<string>(SessionStateKeys.JOURNAL_TEXT) || '';
    setLocalJournalText(storedText);
  }, [selectSessionValue]);

  // Update session state whenever local journal text changes
  useEffect(() => {
    setSessionValue(SessionStateKeys.JOURNAL_TEXT, journalText);
  }, [journalText, setSessionValue]);

  const [mood, setMood] = useState<string>('');
  const [moodOpen, setMoodOpen] = useState(false);
  const [tags, setTags] = useState<string>('');
  const [tagsOpen, setTagsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  // State for save options - default to saving to Notion and Qdrant (via backend API)
  const [saveToNotion, setSaveToNotion] = useState<boolean>(true); // Default to true
  const [saveToQdrant, setSaveToQdrant] = useState<boolean>(true); // Default to true
  const [saveToClipboard, setSaveToClipboard] = useState<boolean>(false); // Default to false
  const [saveToSQLite, setSaveToSQLite] = useState<boolean>(false); // Default to false (not yet implemented)

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!journalText || !journalText.trim()) {
        setFeedbackMessage('Journal entry cannot be empty.');
        setIsError(true);
        return;
      }

      // Check if at least one save option is selected
      if (!saveToNotion && !saveToQdrant && !saveToClipboard && !saveToSQLite) {
        setFeedbackMessage('Please select at least one save option.');
        setIsError(true);
        return;
      }

      setIsSaving(true);
      setFeedbackMessage(null);
      setIsError(false);

      let notionSaved = false;
      let qdrantSaved = false;
      let clipboardCopied = false;
      let sourceId: string | undefined = undefined;
      let reflectionText: string | undefined = undefined;

      try {
        const tagsArray = tags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter(Boolean);
        const payload = {
          text: journalText,
          mood: mood || undefined,
          tags: tagsArray,
          entryTimestamp: new Date().toISOString(),
          saveToNotion: saveToNotion, // Include save options in payload
          saveToQdrant: saveToQdrant,
          // SQLite is handled separately for now
        };

        // Call the backend API if saving to Notion or Qdrant is selected
        if (saveToNotion || saveToQdrant) {
          const response = await fetch('/api/orion/journal/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (data.success) {
            notionSaved = data.notionSaved || false; // Backend will indicate what was saved
            qdrantSaved = data.qdrantSaved || false;
            sourceId = data.sourceId; // This will be the Notion page ID if Notion was saved
            reflectionText = data.reflection;
          } else {
            // If backend API call fails, it's an error for Notion/Qdrant save
            throw new Error(data.error || 'Failed to save journal entry via backend.');
          }
        }

        // Handle Clipboard save on the frontend
        if (saveToClipboard && journalText) {
          try {
            await navigator.clipboard.writeText(journalText);
            clipboardCopied = true;
          } catch (clipError: unknown) {
            console.error('Failed to copy to clipboard:', clipError);
            // Decide if clipboard failure should stop the whole process
            // For now, log and continue.
          }
        }

        // Construct feedback message based on what was saved
        const messages: string[] = [];
        if (notionSaved) messages.push('Saved to Notion.');
        if (qdrantSaved) messages.push('Saved to Qdrant (Memory Search).');
        if (clipboardCopied) messages.push('Copied to clipboard.');
        if (saveToSQLite) messages.push('SQLite save not yet implemented.'); // Indicate unimplemented

        if (messages.length > 0) {
          setFeedbackMessage(`Journal entry: ${messages.join(' ')}`);
          setIsError(false);

          // Only clear the form and notify parent if Notion or Qdrant was successfully saved
          if (notionSaved || qdrantSaved) {
            setLocalJournalText('');
            setMood('');
            setTags('');
            // Notify parent component about the new entry if relevant destination was saved
            if (onEntrySaved && sourceId) {
              // Pass sourceId (Notion ID) and reflection
              onEntrySaved(sourceId, reflectionText);
            }
          }
        } else if (!saveToNotion && !saveToQdrant) {
          // Case where only clipboard/sqlite were selected, and clipboard might have failed
          if (clipboardCopied) {
            setFeedbackMessage('Journal entry copied to clipboard.');
            setIsError(false);
            setLocalJournalText(''); // Clear if only clipboard was selected and succeeded
            setMood('');
            setTags('');
          } else if (saveToSQLite) {
            setFeedbackMessage('SQLite save not yet implemented.');
            setIsError(false);
          } else {
            // Should not happen based on initial check, but for safety
            setFeedbackMessage('No save actions were successful.');
            setIsError(true);
          }
        } else {
          // Should not happen if backend call was successful
          setFeedbackMessage('Unknown save outcome.');
          setIsError(true);
        }
      } catch (error: unknown) {
        console.error('Error saving journal entry:', error);
        setFeedbackMessage((error as Error).message || 'An unexpected error occurred while saving.');
        setIsError(true);
      } finally {
        setIsSaving(false);
      }
    },
    [
      journalText,
      mood,
      tags,
      saveToNotion,
      saveToQdrant,
      saveToClipboard,
      saveToSQLite,
      setLocalJournalText,
      setMood,
      setTags,
      onEntrySaved,
      setSessionValue,
    ]
  ); // Add save options to dependencies

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-6 bg-gray-800 rounded-lg shadow-xl">
      <div>
        <Label htmlFor="journalText" className="block text-sm font-medium text-gray-300 mb-1">
          Your Thoughts:
        </Label>
        <Textarea
          id="journalText"
          value={journalText || ''}
          onChange={(e) => setLocalJournalText(e.target.value)}
          placeholder="Pour out your thoughts, reflections, and observations here..."
          className="w-full min-h-[200px] md:min-h-[300px] bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-md p-3"
          rows={10}
          disabled={isSaving}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Label htmlFor="mood" className="block text-sm font-medium text-gray-300 mb-1">
            Current Mood (Optional):
          </Label>
          <div className="relative">
            <Input
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="How are you feeling? (e.g., Happy, Calm)"
              className="w-full bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-md p-3 pr-10"
              disabled={isSaving}
            />
            {moodOpen && (
              <Command className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg mt-1">
                <CommandInput
                  placeholder="Select mood..."
                  className="w-full bg-gray-700 text-gray-200 border-none focus:ring-0"
                  onFocus={() => setMoodOpen(true)}
                  onBlur={() => setTimeout(() => setMoodOpen(false), 100)}
                  value={mood}
                  onValueChange={setMood}
                />
                <CommandList>
                  <CommandEmpty>No mood found.</CommandEmpty>
                  <CommandGroup>
                    {moodOptions.map((option) => (
                      <CommandItem
                        key={option}
                        onSelect={() => {
                          setMood(option);
                          setMoodOpen(false);
                        }}
                        className="text-gray-300 hover:bg-gray-700 data-[selected]:bg-blue-600 data-[selected]:text-white"
                      >
                        {option}
                        <Check className={cn('ml-auto h-4 w-4', mood === option ? 'opacity-100' : 'opacity-0')} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            )}
          </div>
        </div>

        <div className="relative">
          <Label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
            Tags (Comma-separated, Optional):
          </Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags (e.g., work, personal, health)"
            className="w-full bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-md p-3"
            disabled={isSaving}
          />
          {tagsOpen && (
            <Command className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg mt-1">
              <CommandInput
                placeholder="Add tags..."
                className="w-full bg-gray-700 text-gray-200 border-none focus:ring-0"
                onFocus={() => setTagsOpen(true)}
                onBlur={() => setTimeout(() => setTagsOpen(false), 100)}
                value={tags}
                onValueChange={setTags}
              />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup>
                  {tagOptions.map((option: string) => (
                    <CommandItem
                      key={option}
                      onSelect={() => {
                        const currentTags = tags
                          .split(',')
                          .map((tag: string) => tag.trim())
                          .filter(Boolean);
                        if (!currentTags.includes(option)) {
                          setTags(currentTags.length > 0 ? `${currentTags.join(', ')}, ${option}` : option);
                        } else {
                          setTags(currentTags.filter((tag: string) => tag !== option).join(', '));
                        }
                        setTagsOpen(false);
                      }}
                      className="text-gray-300 hover:bg-gray-700 data-[selected]:bg-blue-600 data-[selected]:text-white"
                    >
                      {option}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          tags
                            .split(',')
                            .map((tag: string) => tag.trim())
                            .includes(option)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-2 text-gray-400">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="saveToNotion"
            checked={saveToNotion}
            onCheckedChange={(checked: boolean) => setSaveToNotion(checked)}
            className="border-gray-600 data-[state=checked]:bg-blue-600"
            disabled={isSaving}
          />
          <Label
            htmlFor="saveToNotion"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Save to Notion
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="saveToQdrant"
            checked={saveToQdrant}
            onCheckedChange={(checked: boolean) => setSaveToQdrant(checked)}
            className="border-gray-600 data-[state=checked]:bg-blue-600"
            disabled={isSaving}
          />
          <Label
            htmlFor="saveToQdrant"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Save to Qdrant (Memory Search)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="saveToClipboard"
            checked={saveToClipboard}
            onCheckedChange={(checked: boolean) => setSaveToClipboard(checked)}
            className="border-gray-600 data-[state=checked]:bg-blue-600"
            disabled={isSaving}
          />
          <Label
            htmlFor="saveToClipboard"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Copy to Clipboard
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="saveToSQLite"
            checked={saveToSQLite}
            onCheckedChange={(checked: boolean) => setSaveToSQLite(checked)}
            className="border-gray-600 data-[state=checked]:bg-blue-600"
            disabled={isSaving}
          />
          <Label
            htmlFor="saveToSQLite"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Save to SQLite (Local Database - Not yet implemented)
          </Label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
          </>
        ) : (
          'Save Journal Entry'
        )}
      </Button>

      {feedbackMessage && (
        <div
          className={cn(
            'p-3 rounded-md text-sm',
            isError ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
          )}
        >
          {feedbackMessage}
        </div>
      )}
    </form>
  );
};
