"use client";
import DraftCommunicationForm from "@/components/orion/DraftCommunicationForm";
import WhatsAppReplyDrafter from "@/components/orion/WhatsAppReplyDrafter";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSessionState } from "@/hooks/useSessionState";
import { SessionStateKeys, PageNames } from "@/app_state";
import { MessageSquare, Smartphone } from "lucide-react";
import { BarChart2 } from "lucide-react";
import WhatsAppChatAnalysisTab from "@/components/orion/WhatsAppChatAnalysisTab";

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
          <WhatsAppChatAnalysisTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
