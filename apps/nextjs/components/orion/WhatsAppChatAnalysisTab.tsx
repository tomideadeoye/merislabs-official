"use client";

import React from "react";
import { WhatsAppChatUploader } from "./WhatsAppChatUploader";
import { WhatsAppChatAnalysis } from "./WhatsAppChatAnalysis";
import { useWhatsAppChatUploaderStore } from "./whatsapp/whatsAppChatUploaderStore";

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
