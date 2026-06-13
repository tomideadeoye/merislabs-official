'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ProposalConfig } from '@/proposals/lib/types';
import { ProposalDocument } from '@/proposals/lib/proposal-document';
import { DownloadControls } from '@merislabs/ui';

export default function ProposalPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [config, setConfig] = useState<ProposalConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    import(`@/proposals/data/${slug}.json`)
      .then((mod) => setConfig(mod.default as ProposalConfig))
      .catch(() => setError(`Proposal "${slug}" not found.`));
  }, [slug]);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">404</h1>
        <p style={{ color: '#94a3b8' }}>{error}</p>
      </div>
    </div>
  );

  if (!config) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>
      <p>Loading proposal...</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      <div className="no-print flex justify-end p-4" style={{ backgroundColor: '#1e293b' }}>
        <DownloadControls />
      </div>
      <div className="flex justify-center py-8">
        <ProposalDocument config={config} />
      </div>
    </div>
  );
}
