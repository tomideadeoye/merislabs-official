"use client";

import React, { useState } from "react";
import { WhatsAppChatUploader } from "./WhatsAppChatUploader";
import { WhatsAppChatAnalysis } from "./WhatsAppChatAnalysis";

export default function WhatsAppChatAnalysisTab() {
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        <WhatsAppChatUploader onAnalysisComplete={handleAnalysisComplete} />
        {analysisData && <WhatsAppChatAnalysis analysisData={analysisData} />}
      </div>
    </div>
  );
}
