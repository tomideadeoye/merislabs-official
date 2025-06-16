'use client';

import { MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

// NOTE: The following components were not found in the codebase and have been commented out
// to allow the application to compile. This feature will be non-functional until these
// components are restored or recreated.
// import { WhatsAppChatAnalysis } from '@/components/orion/whatsapp/WhatsAppChatAnalysis';
// import { WhatsAppChatUploader } from '@/components/orion/whatsapp/WhatsAppChatUploader';
// import { useWhatsAppChatUploaderStore } from '@/components/orion/whatsapp/whatsAppChatUploaderStore';

// GOAL:
// RELATION TO OTHER FILES, FUNCTIONS AND FEATURES:

export default function WhatsAppAnalysisPage() {
  // const { analysisData, success } = useWhatsAppChatUploaderStore();

  // const handleTranscriptUploaded = () => {
  //   console.log('[WhatsAppAnalysisPage] Transcript upload handler called (feature disabled).');
  // };

  return (
    <div className="space-y-8">
      <PageHeader
        title="WhatsApp Chat Analysis"
        icon={<MessageSquare className="h-7 w-7" />}
        description="Analyze WhatsApp chat exports to gain insights into communication patterns and relationship dynamics."
      />

      <div className="grid grid-cols-1 gap-8 text-center p-8 bg-gray-800 rounded-md border border-dashed border-gray-700">
        <p className="text-gray-400">
          The WhatsApp analysis feature is currently disabled because its core components are missing.
        </p>
        {/*
        <WhatsAppChatUploader onTranscriptUploaded={handleTranscriptUploaded} />
        {success && analysisData && <WhatsAppChatAnalysis analysisData={analysisData} />}
        */}
      </div>
    </div>
  );
}

// todo: migrate to full nextjs
