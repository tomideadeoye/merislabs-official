"use client";

import { PageHeader } from "@/components/ui/page-header";
import { PageNames, SessionStateKeys } from "@/app_state";
import { useSessionState } from "@/hooks/useSessionState";
import { AskQuestionForm } from "@/components/orion/AskQuestionForm";
import { HelpCircle } from "lucide-react";

export default function AskQuestionPage() {
  const [memoryInitialized] = useSessionState(SessionStateKeys.MEMORY_INITIALIZED, false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ask Orion"
        icon={<HelpCircle className="h-7 w-7" />}
        description="Ask questions and get personalized answers based on your memories and profile. Use filters to target specific memory types."
        showMemoryStatus={true}
        memoryInitialized={memoryInitialized}
      />
      
      <div className="max-w-3xl mx-auto">
        <AskQuestionForm />
      </div>
    </div>
  );
}