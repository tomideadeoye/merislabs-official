// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component

import { PageHeader } from '@/components/ui';
import { Brain } from 'lucide-react';
// import PatternAnalysisDisplay from '@/components/orion/insights/PatternAnalysisDisplay';

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Pattern Insights"
        icon={<Brain className="h-7 w-7" />}
        description="Discover recurring themes, patterns, and insights across your memories and journal entries."
      />

      {/* <PatternAnalysisDisplay /> */}
    </div>
  );
}
