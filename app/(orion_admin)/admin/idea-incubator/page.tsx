"use client";

import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { IdeaCaptureForm } from '@/components/orion/ideas/IdeaCaptureForm';
import { IdeaList } from '@/components/orion/ideas/IdeaList';
import { Lightbulb } from 'lucide-react';
import type { Idea } from '@/types/ideas';

export default function IdeaIncubatorPage() {
  const [refreshKey, setRefreshKey] = useState<number>(Date.now());
  
  const handleIdeaCaptured = (idea: Idea) => {
    setRefreshKey(Date.now());
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Idea Incubator"
        icon={<Lightbulb className="h-7 w-7" />}
        description="Capture, develop, and nurture your creative ideas with Orion's assistance."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <IdeaCaptureForm onIdeaCaptured={handleIdeaCaptured} />
        </div>
        
        <div className="lg:col-span-2">
          <IdeaList key={`ideas-${refreshKey}`} />
        </div>
      </div>
    </div>
  );
}