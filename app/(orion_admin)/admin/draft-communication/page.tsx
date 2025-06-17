'use client';
import { PageHeader, Tabs, TabsList, TabsTrigger } from '@/components/ui';
import { BarChart2, MessageSquare, Smartphone } from 'lucide-react';
import DraftCommunicationClientWrapper from './DraftCommunicationClientWrapper';
import { PageNames } from '@/lib/constants';
import React, { useState } from 'react';
// GOAL OF FILE|FEATURES|FUNCTIONS:
// This page serves as the entry point for the Draft Communication feature, providing a tabbed interface to switch between different communication tools (general drafting, WhatsApp helper, WhatsApp chat analysis).
// FILEPATH:
// /Users/mac/Documents/GitHub/merislabs-official/app/(orion_admin)/admin/draft-communication/page.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// - Renders `PageHeader` (`@/components/ui`) for the page title and description.
// - Uses `Tabs`, `TabsList`, `TabsTrigger` (`@/components/ui`) to create the tabbed interface.
// - Renders `DraftCommunicationClientWrapper` (`./DraftCommunicationClientWrapper`) to handle the content displayed within the selected tab.
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: components to merge with, similar or redundant component

export default function DraftCommunicationFeaturePage() {
  const [selectedTab, setSelectedTab] = useState('draft');

  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames.DRAFT_COMM}
        icon={<MessageSquare className="h-7 w-7" />}
        description="Craft messages, generate reply options, and ask communication-related questions."
      />
      <Tabs defaultValue="draft" onValueChange={setSelectedTab} className="w-full">
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

        <DraftCommunicationClientWrapper selectedTab={selectedTab} />
      </Tabs>
    </div>
  );
}
