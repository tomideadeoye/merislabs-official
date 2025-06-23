/**
 * @fileoverview This component acts as a client-side wrapper for the Draft Communication module,
 *   managing and conditionally rendering different communication tools (general drafting, WhatsApp tools)
 *   based on the active tab selected by the user. It serves as the central orchestration point for all communication-related UI.
 * @description It orchestrates the display of `DraftCommunicationForm` and the consolidated WhatsApp functionalities,
 *   ensuring a seamless transition between various communication drafting and analysis features. This wrapper is
 *   critical for unifying the user experience and managing the data flow between chat analysis, reply drafting,
 *   and user profile integration for hyper-personalized communication.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To manage the state of the active tab within the Draft Communication page, ensuring only the relevant communication tool is displayed.
 *   - To conditionally render the appropriate communication tool component (`DraftCommunicationForm`, `WhatsAppChatUploader`, `WhatsAppChatAnalysis`, `WhatsAppReplyDrafter`) based on the `selectedTab` prop.
 *   - To integrate the WhatsApp Helper (Reply Drafter) and WhatsApp Chat Analysis functionalities under a unified 'WhatsApp Tools' tab.
 *   - To manage and pass the `analysisData` (parsed WhatsApp chat transcript) from `WhatsAppChatUploader` to both `WhatsAppChatAnalysis` and `WhatsAppReplyDrafter`,
 *     enabling context-rich analysis and drafting.
 *   - To provide essential context (user profile, memory availability) to its child components, supporting personalized and intelligent communication.
 *
 * FILEPATH: `app/(orion_admin)/admin/draft-communication/DraftCommunicationClientWrapper.tsx`.
 * cbt in communications
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/draft-communication/page.tsx` (parent): Passes the `selectedTab` prop, which dictates the content rendered by this wrapper, and orchestrates the overall module layout.
 *   - `useSessionState` (`@/hooks/useSessionState`): Fetches global session state, including user profile (`TOMIDES_PROFILE_DATA`) and memory initialization status (`MEMORY_INITIALIZED`), crucial for personalization and context.
 *   - `SessionStateKeys` (`@/lib/constants`): Defines keys for accessing session state values, maintaining consistency across the application.
 *   - `DraftCommunicationForm` (`@/components/ui/orion/DraftCommunicationForm`): The primary component for general message drafting, rendered when the 'draft' tab is active.
 *   - `WhatsAppChatUploader` (`@/components/orion/whatsapp/WhatsAppChatUploader`): Handles the uploading and initial parsing of WhatsApp chat exports. It provides the `onTranscriptUploaded` callback to this wrapper, which then updates `analysisData`.
 *   - `WhatsAppChatAnalysis` (`@/components/orion/whatsapp/WhatsAppChatAnalysis`): Displays analytical insights derived from the `analysisData` provided by this wrapper, offering a deeper understanding of the chat.
 *   - `WhatsAppReplyDrafter` (`@/components/ui/orion/whatsapp/WhatsAppReplyDrafter`): Receives `analysisData` from this wrapper to pre-fill the chat transcript and inform the generation of hyper-personalized WhatsApp replies, leveraging Orion's LLM and memory.
 *   - `UserProfileData` (`@/lib/types`): Defines the structure of the user profile data, ensuring type safety for `profileData`.
 *   - `/api/orion/whatsapp/analyze/route.ts` (backend API): Directly invoked by `WhatsAppChatUploader` to process uploaded chat files, with the results (`analysisData`) then passed back up to this wrapper via `onTranscriptUploaded`.
 *   - `http://localhost:8000/analyze-chat` (External Python API Endpoint): This is the *actual* backend service endpoint that `/api/orion/whatsapp/analyze/route.ts` proxies requests to for WhatsApp chat analysis. It contains the core logic previously handled by a local Python script.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - This component is client-side (`'use client'`) due to its reliance on React hooks (`useState`, `useEffect`, `useSessionState`) for dynamic UI and state management.
 *   - The `selectedTab` prop is reliably passed from the parent `page.tsx`, ensuring correct content rendering based on user navigation.
 *   - It assumes the `analysisData` structure provided by `WhatsAppChatUploader` and the `/api/orion/whatsapp/analyze` endpoint is consistent and valid for consumption by `WhatsAppChatAnalysis` and `WhatsAppReplyDrafter`.
 *   - The backend API for WhatsApp analysis and reply drafting is expected to be fully operational for the features to function as intended.
 *   - User profile and memory initialization status from `useSessionState` are crucial for the depth of personalization in generated replies.
 *
 * NOTES:
 *   - This wrapper is crucial for the modularity, maintainability, and user experience of the Draft Communication feature, unifying disparate tools into a coherent interface.
 *   - The consolidation of WhatsApp features into a single 'WhatsApp Tools' tab simplifies the user interface and streamlines the workflow from chat upload to analysis and reply drafting.
 *   - By managing `analysisData` at this level, it ensures that all WhatsApp-related child components (`WhatsAppChatAnalysis`, `WhatsAppReplyDrafter`) operate on the same, up-to-date parsed chat information.
 *   - This component directly supports the "Observe" and "Orient" phases of the OODA loop by integrating chat analysis and context provisioning for subsequent decision-making (reply drafting).
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Refined State Management**: Explore integrating `TanStack Query` or a similar solution for more robust, efficient, and centralized fetching and management of `analysisData`, reducing prop drilling.
 *   - **Enhanced Loading States**: Implement more granular and visually appealing loading indicators (e.g., progress bars, skeletons) when `analysisData` is being processed or fetched, especially within the WhatsApp tools section.
 *   - **Comprehensive Error Handling**: Introduce React Error Boundaries for resilient rendering of child components, preventing cascading failures and providing graceful degradation.
 *   - **Further Component Breakdown**: As the complexity of the WhatsApp Tools section potentially grows, consider further breaking down its internal logic into smaller, more focused, and reusable components to improve maintainability.
 *   - **Context API/Global Store**: Evaluate the use of React Context API or a global state management library (like Zustand, already in project) for `analysisData` and other shared states to avoid prop drilling and simplify component interactions.
 *   - **User Feedback on Data Flow**: Implement visual cues or logging to help users understand the flow of data from upload to analysis to drafting, enhancing transparency.
 */
'use client';

import { useState } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/lib/constants'; // Import PageNames
import WhatsAppChatAnalysis from '@/components/orion/whatsapp/WhatsAppChatAnalysis';
import DraftCommunicationForm from '@/components/ui/orion/DraftCommunicationForm';
import WhatsAppReplyDrafter from '@/components/ui/orion/whatsapp/WhatsAppReplyDrafter';
import CommunicationPatternsAnalyzer from '@/components/orion/whatsapp/CommunicationPatternsAnalyzer'; // New import
import { UserProfileData } from '@/lib/types';
import { TabsContent } from '@/components/ui'; // Import TabsContent
import WhatsAppChatUploader from '@/components/orion/whatsapp/WhatsAppChatUploader';
import { WhatsAppChatAnalysisData } from '@/components/orion/whatsapp/WhatsAppChatAnalysis'; // Import the interface

interface DraftCommunicationClientWrapperProps {
  selectedTab: string;
}

export default function DraftCommunicationClientWrapper({ selectedTab }: DraftCommunicationClientWrapperProps) {
  const { selectSessionValue } = useSessionState();
  const profileData = selectSessionValue<UserProfileData | null>(SessionStateKeys.TOMIDES_PROFILE_DATA);
  const memoryAvailable = selectSessionValue<boolean>(SessionStateKeys.MEMORY_INITIALIZED);
  const [analysisData, setAnalysisData] = useState<WhatsAppChatAnalysisData | null>(null); // Explicitly type analysisData

  const handleTranscriptUploaded = (data: WhatsAppChatAnalysisData) => {
    setAnalysisData(data);
  };

  return (
    <>
      {selectedTab === 'draft' && (
        <TabsContent value="draft">
          <DraftCommunicationForm profileData={profileData?.profileText || null} memoryAvailable={memoryAvailable} />
        </TabsContent>
      )}

      {selectedTab === 'whatsapp-tools' && (
        <TabsContent value="whatsapp-tools">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">WhatsApp Helper Tools</h2>
              <p className="text-gray-400">
                This section will contain tools to assist with WhatsApp messaging, such as message drafting, quick
                replies, and automation.
              </p>
              <p className="text-gray-400 mt-2">Specific helper components will go here.</p>
              <WhatsAppReplyDrafter analyzedChatData={analysisData} />
            </div>
          </div>
        </TabsContent>
      )}

      {selectedTab === 'whatsapp-analysis' && (
        <TabsContent value="whatsapp-analysis">
          <div className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-2">WhatsApp Chat Analysis</h2>
            <WhatsAppChatUploader onTranscriptUploaded={handleTranscriptUploaded} />
            <WhatsAppChatAnalysis analysisData={analysisData} />
          </div>
        </TabsContent>
      )}

      {selectedTab === 'communication-patterns' && (
        <TabsContent value="communication-patterns">
          <CommunicationPatternsAnalyzer />
        </TabsContent>
      )}
    </>
  );
}
