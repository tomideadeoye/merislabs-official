import React from 'react';
import IdeaDetailView from '@/components/orion/ideas/IdeaDetailView';

interface PageProps {
  params: {
    ideaId: string;
  };
}

// Server component: receives params, passes to client component
export default function Page({ params }: PageProps) {
  const { ideaId } = params;
  return (
    <div className="space-y-6">
      <IdeaDetailView ideaId={ideaId} />
    </div>
  );
}
