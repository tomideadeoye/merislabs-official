'use client';

import { MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

import { WhatsAppChatAnalysis } from '../../../src/components/orion/whatsapp/WhatsAppChatAnalysis';
import { WhatsAppChatUploader } from '@/src/components/orion/whatsapp/WhatsAppChatUploader';
import { useWhatsAppChatUploaderStore } from '@/src/components/orion/whatsapp/whatsAppChatUploaderStore';

// GOAL:
// RELATION TO OTHER FILES, FUNCTIONS AND FEATURES:

export default function WhatsAppAnalysisPage() {
  const { analysisData, success } = useWhatsAppChatUploaderStore();

  const handleTranscriptUploaded = () => {
    // This function can be used if any action needs to be taken when transcript is uploaded.
    // The analysisData is already available via the store.
    console.log('WhatsApp chat transcript uploaded and processed.');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="WhatsApp Chat Analysis"
        icon={<MessageSquare className="h-7 w-7" />}
        description="Analyze WhatsApp chat exports to gain insights into communication patterns and relationship dynamics."
      />

      <div className="grid grid-cols-1 gap-8">
        <WhatsAppChatUploader onTranscriptUploaded={handleTranscriptUploaded} />

        {success && analysisData && <WhatsAppChatAnalysis analysisData={analysisData} />}
      </div>
    </div>
  );
}

// todo: migrate to full nextjs
