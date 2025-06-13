"use client";
import { DraftCommunicationForm, WhatsAppReplyDrafter } from '@repo/ui';
import { PageHeader } from "@repo/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui";
import { useSessionState, SessionStateKeys } from "@repo/shared/hooks/useSessionState";
import { PageNames } from "@repo/shared/types/appState";
import { MessageSquare, Smartphone } from "lucide-react";
import { BarChart2 } from "lucide-react";
import { WhatsAppChatAnalysis } from "@repo/analytics/components/whatsapp-analysis";

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
      <Tabs defaultValue="draft" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="draft">
            <MessageSquare className="inline-block mr-1 w-4 h-4" /> Draft Communication
          </TabsTrigger>
          <TabsTrigger value="whatsapp">
            <Smartphone className="inline-block mr-1 w-4 h-4" /> WhatsApp Helper
          </TabsTrigger>
          <TabsTrigger value="whatsapp-analysis">
            <BarChart2 className="inline-block mr-1 w-4 h-4" /> WhatsApp Chat Analysis
          </TabsTrigger>
        </TabsList>
        <TabsContent value="draft">
          <DraftCommunicationForm
            profileData={profileData}
            memoryAvailable={memoryAvailable}
          />
        </TabsContent>
        <TabsContent value="whatsapp">
          <WhatsAppReplyDrafter />
        </TabsContent>
        <TabsContent value="whatsapp-analysis">
          <WhatsAppChatAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
}
