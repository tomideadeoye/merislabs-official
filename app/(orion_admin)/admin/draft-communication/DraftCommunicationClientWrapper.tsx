'use client';
// GOAL OF FILE|FEATURES|FUNCTIONS:
// FILEPATH:
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunties to consolidate
// TODOS:
// SUGGESTIONS:

import React, { useState } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/lib/app_constants';
import { WhatsAppChatAnalysis } from '../../../src/components/orion/whatsapp/WhatsAppChatAnalysis';
import WhatsAppReplyDrafter from '../../../src/components/orion/WhatsAppReplyDrafter';
import DraftCommunicationForm from '@/src/components/orion/DraftCommunicationForm';


export default function DraftCommunicationClientWrapper() {
  // Assuming useSessionState returns just the value if only one variable is destructured.
  const [profileData] = useSessionState(SessionStateKeys.TOMIDES_PROFILE_DATA); // UserProfileData | null | undefined
  const [memoryAvailable] = useSessionState(SessionStateKeys.MEMORY_INITIALIZED, false);
  const [yourAnalysisData] = useState<{ suggested_replies: string[] } | null>(null);

  return (
    <>
      <DraftCommunicationForm profileData={profileData?.profileText || null} memoryAvailable={memoryAvailable} />
      <WhatsAppReplyDrafter />
      <WhatsAppChatAnalysis analysisData={yourAnalysisData} />
    </>
  );
}
