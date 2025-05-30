"use client";

import { PageHeader } from "@/components/ui/page-header";
import { PageNames, SessionStateKeys } from "@/app_state";
import { useSessionState } from "@/hooks/useSessionState";
import { DraftCommunicationForm } from "@/components/orion/DraftCommunicationForm";
import { MessageSquareText } from "lucide-react";

export default function DraftCommunicationFeaturePage() {
  const [profileData] = useSessionState<string | undefined>(SessionStateKeys.TOMIDES_PROFILE_DATA, undefined);
  const [memoryAvailable] = useSessionState<boolean>(SessionStateKeys.MEMORY_INITIALIZED, false);

  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames["Draft Communication"]}
        icon={<MessageSquareText className="h-7 w-7" />}
        description="Craft messages, generate reply options, and ask communication-related questions."
      />
      <DraftCommunicationForm profileData={profileData} memoryAvailable={memoryAvailable} />
    </div>
  );
}
