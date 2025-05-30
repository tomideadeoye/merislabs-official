"use client";

import { PageHeader } from "@/components/ui/page-header";
import { PageNames, SessionStateKeys } from "@/app_state";
import { useSessionState } from "@/hooks/useSessionState";
import { JournalEntryForm } from "@/components/orion/JournalEntryForm";
import { JournalList } from "@/components/orion/JournalList";
import { BookOpenText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function JournalFeaturePage() {
  const [memoryInitialized] = useSessionState(SessionStateKeys.MEMORY_INITIALIZED, false);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <PageHeader
        title={PageNames.JOURNAL}
        icon={<BookOpenText className="h-7 w-7" />}
        description="Record your thoughts, reflections, and insights. Orion will help you remember and learn."
        showMemoryStatus={true}
        memoryInitialized={memoryInitialized}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-grow min-h-0">
        <div className="lg:col-span-1">
          <JournalEntryForm />
        </div>
        
        <ScrollArea className="lg:col-span-1 lg:max-h-[calc(100vh-12rem)] pr-2">
          <JournalList initialLimit={5} />
        </ScrollArea>
      </div>
    </div>
  );
}