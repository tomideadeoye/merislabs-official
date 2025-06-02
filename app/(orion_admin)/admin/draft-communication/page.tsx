"use client";
import DraftCommunicationForm from "@/components/orion/DraftCommunicationForm";
import { PageHeader } from "@/components/ui/page-header";
import { useSessionState } from "@/hooks/useSessionState";
import { SessionStateKeys, PageNames } from "@/app_state";
import { MessageSquare } from "lucide-react";

export default function DraftCommunicationFeaturePage() {
  const [profileData] = useSessionState(SessionStateKeys.TOMIDES_PROFILE_DATA); // string | null
  const [memoryAvailable] = useSessionState(SessionStateKeys.MEMORY_INITIALIZED, false);

  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames.DRAFT_COMM}
        icon={<MessageSquare className="h-7 w-7" />}
        description="Craft messages, generate reply options, and ask communication-related questions."
      />
      <DraftCommunicationForm
        profileData={profileData}
        memoryAvailable={memoryAvailable}
      />
    </div>
  );
}
