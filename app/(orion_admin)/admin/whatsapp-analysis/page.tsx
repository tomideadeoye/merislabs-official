"use client";

import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { WhatsAppChatUploader } from '@/components/orion/WhatsAppChatUploader';
import { WhatsAppChatAnalysis } from '@/components/orion/WhatsAppChatAnalysis';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppAnalysisPage() {
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="WhatsApp Chat Analysis"
        icon={<MessageSquare className="h-7 w-7" />}
        description="Analyze WhatsApp chat exports to gain insights into communication patterns and relationship dynamics."
      />

      <div className="grid grid-cols-1 gap-8">
        <WhatsAppChatUploader onAnalysisComplete={handleAnalysisComplete} />
        
        {analysisData && (
          <WhatsAppChatAnalysis analysisData={analysisData} />
        )}
      </div>
    </div>
  );
}