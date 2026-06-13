import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import type { ProposalConfig } from './lib/types';

function getProposals(): { slug: string; config: ProposalConfig }[] {
  const dir = path.join(process.cwd(), 'src/app/proposals/data');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const blob = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as ProposalConfig;
      return { slug: f.replace('.json', ''), config: blob };
    });
}

export default function ProposalsPage() {
  const proposals = getProposals();

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Proposals</h1>
        <p className="text-sm mb-8" style={{ color: '#94a3b8' }}>Config-driven proposal system. Each proposal is defined in JSON with swappable templates and inline editing.</p>

        <div className="space-y-4">
          {proposals.map(({ slug, config }) => (
            <div key={slug} className="p-5 rounded-xl border"
              style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
              <h2 className="font-bold text-lg mb-2">{config.title}</h2>
              <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>
                Template: <span className="font-medium" style={{ color: '#818cf8' }}>{config.template}</span>
                {' · '}{config.pages.length} pages
              </p>
              <div className="flex gap-3 text-sm">
                <Link href={`/proposals/${slug}`}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium transition"
                  style={{ backgroundColor: '#4f46e5', color: '#fff' }}>
                  View Proposal
                </Link>
                <Link href={`/proposals/builder/${slug}`}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium transition"
                  style={{ backgroundColor: '#334155', color: '#94a3b8' }}>
                  Open Editor
                </Link>
              </div>
            </div>
          ))}
        </div>

        {proposals.length === 0 && (
          <p className="text-sm" style={{ color: '#64748b' }}>No proposals found. Add a JSON file to <code className="px-1 rounded" style={{ backgroundColor: '#1e293b', color: '#818cf8' }}>proposals/data/</code></p>
        )}
      </div>
    </div>
  );
}
