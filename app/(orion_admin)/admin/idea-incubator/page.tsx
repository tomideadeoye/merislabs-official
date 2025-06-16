'use client';

import { useState } from 'react';
import { PageHeader } from '@/ui/components/ui';
import { IdeaCaptureForm } from '../../../../components/orion/ideas/IdeaCaptureForm';
import { IdeaList } from '../../../../components/orion/ideas/IdeaList';
import { Lightbulb } from 'lucide-react';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// next steps if any:
// components to merge with if any:

export default function IdeaIncubatorPage() {
  const [refreshKey, setRefreshKey] = useState<number>(Date.now());

  const handleIdeaCaptured = () => {
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
