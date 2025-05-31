"use client";

import React, { useState } from 'react';
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

export default function JournalPage() {
  const [journalText, setJournalText] = useSessionState(SessionStateKeys.JOURNAL_TEXT, "");
  const [isProcessing, setIsProcessing] = useSessionState(SessionStateKeys.JOURNAL_PROCESSING, false);
  const [reflection, setReflection] = useSessionState(SessionStateKeys.JOURNAL_REFLECTION, null);
  const [showSaveForm, setShowSaveForm] = useSessionState(SessionStateKeys.JOURNAL_SHOW_SAVE_FORM, false);
  const [activeTab, setActiveTab] = useState<string>("new");

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
                onReflectionGenerated={handleReflectionGenerated}
              />
            </div>
            
            <div className="space-y-6">
              {reflection && (
                <>
                  <JournalEntryDisplay 
                    reflection={reflection}
                    onSaveComplete={handleSaveComplete}
                  />
                  
                  <AddTaskFromReflection 
                    reflectionText={reflection.content || ""}
                    onTaskAdded={handleTaskAdded}
                  />
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