"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/hooks/useSessionState';
import { JournalEntryForm } from '@/components/orion/JournalEntryForm';
import { JournalEntryDisplay } from '@/components/orion/JournalEntryDisplay';
import { AddTaskFromReflection } from '@/components/orion/AddTaskFromReflection';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, ListTodo } from 'lucide-react';
import { JournalList } from '@/components/orion/JournalList';
import type { ScoredMemoryPoint } from '@/types/orion';

export default function JournalPage() {
  const [journalText, setJournalText] = useSessionState(SessionStateKeys.JOURNAL_TEXT, "");
  const [isProcessing, setIsProcessing] = useSessionState(SessionStateKeys.JOURNAL_PROCESSING, false);
  const [reflection, setReflection] = useSessionState(SessionStateKeys.JOURNAL_REFLECTION, null);
  const [showSaveForm, setShowSaveForm] = useSessionState(SessionStateKeys.JOURNAL_SHOW_SAVE_FORM, false);
  const [activeTab, setActiveTab] = useState<string>("new");
  const [lastSavedEntry, setLastSavedEntry] = useState<ScoredMemoryPoint | null>(null);
  const [lastReflection, setLastReflection] = useState<string | null>(null);

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

  const handleReflectionGenerated = (reflectionData: any) => {
    setReflection(reflectionData);
  };

  const handleSaveComplete = () => {
    setJournalText("");
    setReflection(null);
    setShowSaveForm(false);
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
      /task: ([\w\s]+)/i
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

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
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
              <JournalEntryForm
                onEntrySaved={handleEntrySaved}
              />
            </div>
            <div className="space-y-6">
              {lastSavedEntry && (
                <>
                  <JournalEntryDisplay
                    entry={lastSavedEntry}
                    initialReflection={lastReflection || undefined}
                  />
                  {extractTaskSuggestion(lastReflection) && (
                    <AddTaskFromReflection
                      suggestedTask={extractTaskSuggestion(lastReflection)!}
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
