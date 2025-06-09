"use client";

import React from 'react';
import { IdeaDetailView } from '@/components/orion/ideas/IdeaDetailView';

export default function IdeaDetailPage({ params }: { params: { ideaId: string } }) {
  // params is already resolved synchronously in client components
  const { ideaId } = params;

  return (
    <div className="space-y-6">
      <IdeaDetailView ideaId={ideaId} />
    </div>
  );
}
