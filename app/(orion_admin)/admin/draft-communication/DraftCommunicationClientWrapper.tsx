'use client';
// GOAL OF FILE|FEATURES|FUNCTIONS:
// This component acts as a client-side wrapper for the Draft Communication feature, managing and conditionally rendering
// different communication tools (general drafting, WhatsApp helper, WhatsApp chat analysis) based on the active tab selected by the user.
//
// FILEPATH: `app/(orion_admin)/admin/draft-communication/DraftCommunicationClientWrapper.tsx`
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// - `page.tsx` (parent): Passes the `selectedTab` prop to control which content is displayed.
// - `useSessionState` (`@/hooks/useSessionState`): Manages global session state, including user profile and memory initialization status.
// - `SessionStateKeys` (`@/lib/constants`): Defines keys for accessing session state values.
// - `WhatsAppChatAnalysis` (`@/components/orion/whatsapp/WhatsAppChatAnalysis`): Component for displaying WhatsApp chat analysis results.
// - `DraftCommunicationForm` (`@/components/ui/orion/DraftCommunicationForm`): Main component for general communication drafting.
// - `WhatsAppReplyDrafter` (`@/components/ui/orion/whatsapp/WhatsAppReplyDrafter`): Component for drafting WhatsApp replies.
// - `PageHeader` (`@/components/ui`): Reused from `whatsapp-helper/page.tsx` for consistent UI.
// - `PageNames` (`@/lib/constants`): Used for consistent page titles.
// - `Users` (lucide-react): Icon for WhatsApp Helper section.
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: This component handles the conditional rendering logic that was previously spread across multiple separate pages.
// OPPORTUNITIES FOR IMPROVEMENT: Further integration of state management (e.g., using TanStack Query for data fetching within tabs).
// OPPORTUNITIES TO CONSOLIDATE: This component itself is a result of consolidating WhatsApp Analysis and WhatsApp Helper under Draft Communication.

import React, { useState } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys, PageNames } from '@/lib/constants'; // Import PageNames
import WhatsAppChatAnalysis from '@/components/orion/whatsapp/WhatsAppChatAnalysis';
import DraftCommunicationForm from '@/components/ui/orion/DraftCommunicationForm';
import WhatsAppReplyDrafter from '@/components/ui/orion/whatsapp/WhatsAppReplyDrafter';
import { UserProfileData } from '@/lib/types';
import { PageHeader } from '@/components/ui'; // Import PageHeader
import { Users } from 'lucide-react'; // Import Users icon
import { TabsContent } from '@/components/ui'; // Import TabsContent

interface DraftCommunicationClientWrapperProps {
  selectedTab: string;
}

export default function DraftCommunicationClientWrapper({ selectedTab }: DraftCommunicationClientWrapperProps) {
  const { selectSessionValue } = useSessionState();
  const profileData = selectSessionValue<UserProfileData | null>(SessionStateKeys.TOMIDES_PROFILE_DATA);
  const memoryAvailable = selectSessionValue<boolean>(SessionStateKeys.MEMORY_INITIALIZED);
  const [yourAnalysisData] = useState<{ suggested_replies: string[] } | null>(null); // Placeholder for actual analysis data

  return (
    <>
      {selectedTab === 'draft' && (
        <TabsContent value="draft">
          <DraftCommunicationForm profileData={profileData?.profileText || null} memoryAvailable={memoryAvailable} />
        </TabsContent>
      )}

      {selectedTab === 'whatsapp' && (
        <TabsContent value="whatsapp">
          <div className="space-y-6">
            <PageHeader
              title={PageNames.WHATSAPP_HELPER}
              icon={<Users className="h-7 w-7" />}
              description="Assist with WhatsApp messaging and automation."
            />
            <div>
              <p className="text-gray-400">WhatsApp Helper feature component will go here.</p>
              <WhatsAppReplyDrafter />
            </div>
          </div>
        </TabsContent>
      )}

      {selectedTab === 'whatsapp-analysis' && (
        <TabsContent value="whatsapp-analysis">
          <WhatsAppChatAnalysis analysisData={yourAnalysisData} />
        </TabsContent>
      )}
    </>
  );
}
