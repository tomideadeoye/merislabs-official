/**
// GOAL OF FILE|FEATURES|FUNCTIONS:
//   - Orion Admin Journal page.
//   - Allows user to create new journal entries, view history, and receive AI-powered reflections.
//   - Features: JournalEntryForm, JournalEntryDisplay, AddTaskFromReflection, JournalList, tabbed UI for new/history.
//   - Extracts actionable tasks from AI reflections and enables adding them to Habitica.
// FILEPATH:
//   apps/nextjs/app/(orion_admin)/admin/journal/page.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Uses:
//       - useSessionState (from @repo/shared/hooks/useSessionState)
//       - JournalEntryForm, JournalEntryDisplay, AddTaskFromReflection, JournalList (from components/orion/)
//       - UI components from @/ui/components/ui
//       - SessionStateKeys, JournalEntryNotionInput (from @repo/shared/types/orion)
//   - Related to: Habitica integration, journal API endpoints, admin dashboard navigation.
// ASSUMPTIONS & CLEAR COMMENTS
//   - Assumes all imported hooks/components are implemented and stable.
//   - Assumes /api/orion/journal/entry/[entryId] endpoint exists and returns expected data.
//   - Assumes AI reflection text follows patterns for task extraction.
// NOTES:
//   - Consider consolidating journal-related components for maintainability.
//   - Add more robust error handling, logging, and loading/progress states.
//   - Opportunity: Merge similar journal logic across admin/user pages for unified UX.
//   - Could modularize task extraction logic for reusability across features.
*/

'use client';

import { BookOpen, Clock } from 'lucide-react';
// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// next steps if any:
// components to merge with if any:
import { useState } from 'react';
import { AddTaskFromReflection } from '../../../src/components/orion/AddTaskFromReflection';
import { JournalEntryForm } from '../../../src/components/orion/JournalEntryForm';
import { JournalList } from '../../../src/components/orion/JournalList';
import { useSessionState } from '../../../src/hooks/useSessionState';
import { JournalEntryNotionInput } from '../../../src/types';


export default function JournalPage() {
  const [activeTab, setActiveTab] = useState<string>('new');
  const [lastSavedEntry, setLastSavedEntry] = useState<JournalEntryNotionInput | null>(null);
  const [lastReflection, setLastReflection] = useState<string | null>(null);

  // Retrieve Habitica credentials from session state
  const userId = useSessionState((state) => state.state.habiticaUserId);
  const apiToken = useSessionState((state) => state.state.habiticaApiToken);

  const handleEntrySaved = async (entryId: string, reflectionText?: string) => {
    setLastReflection(reflectionText || null);
    // Fetch the entry by ID from the backend
    try {
      const res = await fetch(`/api/orion/journal/entry/${entryId}`);
      const data = await res.json();
      if (data.success && data.entry) {
        setLastSavedEntry(data.entry);
      }
    } catch (error) {
      console.error('Failed to fetch saved journal entry:', error);
    }
  };

  const handleTaskAdded = () => {
    // Optional: Add any additional logic after a task is added
  };

  // Utility to extract a suggested task from a reflection string
  const extractTaskSuggestion = (reflectionText: string | null): string | null => {
    if (!reflectionText) return null;
    const patterns = [
      /you could (try|consider) (to )?([\w\s]+)/i,
      /I suggest (that you )?([\w\s]+)/i,
      /you might want to ([\w\s]+)/i,
      /it would be helpful to ([\w\s]+)/i,
      /consider ([\w\s]+ing)/i,
      /action item: ([\w\s]+)/i,
      /task: ([\w\s]+)/i,
    ];
    for (const pattern of patterns) {
      const match = reflectionText.match(pattern);
      if (match) {
        const suggestion = match[match.length - 1].trim().replace(/[.!,;:]$/, '');
        return suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
      }
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Journal Entry"
        icon={<BookOpen className="h-7 w-7" />}
        description="Record your thoughts and receive AI-powered reflections."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="new" className="data-[state=active]:bg-gray-700">
            <BookOpen className="h-4 w-4 mr-2" />
            New Entry
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-gray-700">
            <Clock className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-6 space-y-6">
          {/* New Journal Entry Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <JournalEntryForm onEntrySaved={handleEntrySaved} />
            </div>
            <div className="space-y-6">
              {lastSavedEntry && (
                <>
                  <JournalEntryDisplay entry={lastSavedEntry} initialReflection={lastReflection || undefined} />
                  {extractTaskSuggestion(lastReflection) && (
                    <AddTaskFromReflection
                      suggestedTask={extractTaskSuggestion(lastReflection)!}
                      onTaskAdded={handleTaskAdded}
                      userId={userId ?? ''}
                      originalEntryId={lastSavedEntry?.notionPageId ?? ''}
                      apiToken={apiToken ?? ''}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {/* Journal History Tab Content */}
          <JournalList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
