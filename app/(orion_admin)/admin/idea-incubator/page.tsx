'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui';
import { IdeaCaptureForm } from '@/components/orion/ideas/IdeaCaptureForm';
import { IdeaList } from '@/components/orion/ideas/IdeaList';
import { Lightbulb } from 'lucide-react';

// GOAL:
// The Idea Incubator page is designed to provide a centralized interface for users to capture, develop, and manage their creative ideas. It integrates idea capture forms and a list display for nurturing ideas.

// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// - `IdeaCaptureForm.tsx`: Provides the UI and logic for users to input and submit new ideas.
// - `IdeaList.tsx`: Displays a list of captured ideas, allowing users to view and interact with them.
// - `app/api/orion/ideas/create/route.ts` and `app/api/orion/ideas/route.ts`: Backend API routes for creating and fetching ideas, which `IdeaCaptureForm` and `IdeaList` will interact with.
// - `app/lib/types/ideas.ts`: Defines the TypeScript interfaces for Idea and IdeaLog, ensuring type safety across the application.
// - `PageHeader` (from `@/components/ui`): Provides a consistent header for the page.
// - State Management (`useState`): Used to manage the refresh key for the IdeaList component, ensuring it updates when a new idea is captured.

// next steps if any:
// - Implement the actual functionality within `IdeaCaptureForm.tsx` to handle idea submission (e.g., API calls to create new ideas).
// - Implement data fetching and rendering logic within `IdeaList.tsx` to display ideas from the backend (e.g., TanStack Query for data fetching).
// - Add more detailed logging throughout the page component for better traceability and debugging.
// - Implement advanced features for idea management (e.g., editing, deleting, categorizing, search/filter).
// - Ensure robust error handling for all data operations.

// components to merge with if any:
// - Consider integrating with a global state management solution (e.g., Zustand) for idea-related data, if the application's complexity grows.

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
          <IdeaList key={`ideas-${refreshKey}`} refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}
