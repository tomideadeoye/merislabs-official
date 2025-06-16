'use client';

import { WhatsAppChatAnalysis } from '@/components/orion/whatsapp/WhatsAppChatAnalysis';
import { WhatsAppChatUploader } from '@/components/orion/whatsapp/WhatsAppChatUploader';
import { useWhatsAppChatUploaderStore } from '@/components/orion/whatsapp/WhatsAppChatUploader';

export default function WhatsAppChatAnalysisTab() {
  const { analysisData, success } = useWhatsAppChatUploaderStore();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        <WhatsAppChatUploader />
        {success && analysisData && <WhatsAppChatAnalysis analysisData={analysisData} />}
      </div>
    </div>
  );
}
