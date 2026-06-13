'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import type { ProposalConfig, BrandConfig, PageType } from '@/proposals/lib/types';
import { ProposalDocument } from '@/proposals/lib/proposal-document';
import { listTemplates } from '@/proposals/lib/templates/registry';
import { DownloadControls } from '@merislabs/ui';

type EditMode = 'color' | 'text' | 'template' | null;

const BRAND_KEYS: (keyof BrandConfig)[] = ['primary', 'accent', 'highlight', 'text', 'textLight', 'background', 'cardBg'];

function storageKey(slug: string) { return `proposal-edits:${slug}`; }

function loadFromStorage(slug: string): ProposalConfig | null {
  try {
    const raw = localStorage.getItem(storageKey(slug));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveToStorage(slug: string, config: ProposalConfig) {
  try { localStorage.setItem(storageKey(slug), JSON.stringify(config)); } catch { }
}

function clearStorage(slug: string) {
  try { localStorage.removeItem(storageKey(slug)); } catch { }
}

export default function BuilderPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [config, setConfig] = useState<ProposalConfig | null>(null);
  const [original, setOriginal] = useState<ProposalConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [templateId, setTemplateId] = useState<string>('indigo');
  const [editPageIdx, setEditPageIdx] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  // Load from localStorage first, fallback to JSON
  useEffect(() => {
    const stored = loadFromStorage(slug);
    import(`@/proposals/data/${slug}.json`)
      .then((mod) => {
        const fresh = mod.default as ProposalConfig;
        setOriginal(fresh);
        setConfig(stored || fresh);
        if (stored) setTemplateId(stored.template);
      })
      .catch(() => setError(`Proposal "${slug}" not found.`));
  }, [slug]);

  // Auto-save to localStorage on changes
  useEffect(() => {
    if (!config) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveToStorage(slug, config);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [config, slug]);

  const resetConfig = useCallback(() => {
    if (!original) return;
    clearStorage(slug);
    setConfig(JSON.parse(JSON.stringify(original)));
    setTemplateId(original.template);
    setEditMode(null);
    setEditPageIdx(null);
  }, [original, slug]);

  const updateBrand = useCallback((key: keyof BrandConfig, value: string) => {
    setConfig((prev) => prev ? { ...prev, brand: { ...prev.brand, [key]: value } } : prev);
  }, []);

  const updatePage = useCallback((idx: number, updater: (page: PageType) => PageType) => {
    setConfig((prev) => prev ? {
      ...prev,
      pages: prev.pages.map((p, i) => i === idx ? updater(p) : p),
    } : prev);
  }, []);

  const templates = listTemplates();

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
      <p>Loading editor...</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>
      {/* Toolbar */}
      <div className="no-print sticky top-0 z-50 px-6 py-3 flex items-center justify-between border-b text-sm"
        style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-white">{config.title}</span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#334155', color: '#94a3b8' }}>
            Edit Mode
          </span>
          {saved && (
            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#065f4620', color: '#34d399' }}>
              Saved
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={resetConfig}
            className="px-3 py-1.5 rounded text-xs font-medium transition"
            style={{ backgroundColor: '#7f1d1d', color: '#fca5a5' }}>
            Reset
          </button>
          <button onClick={() => setEditMode(editMode === 'template' ? null : 'template')}
            className="px-3 py-1.5 rounded text-xs font-medium transition"
            style={{ backgroundColor: editMode === 'template' ? '#4f46e5' : '#334155' }}>
            Template
          </button>
          <button onClick={() => setEditMode(editMode === 'color' ? null : 'color')}
            className="px-3 py-1.5 rounded text-xs font-medium transition"
            style={{ backgroundColor: editMode === 'color' ? '#4f46e5' : '#334155' }}>
            Colors
          </button>
          <button onClick={() => setEditMode(editMode === 'text' ? null : 'text')}
            className="px-3 py-1.5 rounded text-xs font-medium transition"
            style={{ backgroundColor: editMode === 'text' ? '#4f46e5' : '#334155' }}>
            Text
          </button>
        </div>
      </div>

      {/* Selection panels */}
      {editMode === 'template' && (
        <div className="no-print px-6 py-3 border-b flex gap-2"
          style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
          {templates.map((t) => (
            <button key={t.id} onClick={() => setTemplateId(t.id)}
              className="px-4 py-2 rounded text-xs font-medium transition"
              style={{
                backgroundColor: templateId === t.id ? '#4f46e5' : '#334155',
                color: templateId === t.id ? '#fff' : '#94a3b8',
              }}>
              {t.name}
            </button>
          ))}
        </div>
      )}

      {editMode === 'color' && (
        <div className="no-print px-6 py-3 border-b flex flex-wrap gap-3"
          style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
          {BRAND_KEYS.map((key) => (
            <label key={key} className="flex items-center gap-2 text-xs">
              <span style={{ color: '#94a3b8', minWidth: 70 }}>{key}</span>
              <input type="color" value={config.brand[key] as string}
                onChange={(e) => updateBrand(key, e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0" />
            </label>
          ))}
        </div>
      )}

      {editMode === 'text' && (
        <div className="no-print px-6 py-3 border-b flex items-center gap-3"
          style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
          <span className="text-xs" style={{ color: '#94a3b8' }}>Edit page:</span>
          {config.pages.map((p, i) => (
            <button key={i} onClick={() => setEditPageIdx(editPageIdx === i ? null : i)}
              className="px-3 py-1.5 rounded text-xs font-medium transition"
              style={{
                backgroundColor: editPageIdx === i ? '#4f46e5' : '#334155',
                color: editPageIdx === i ? '#fff' : '#94a3b8',
              }}>
              {p.type} #{i + 1}
            </button>
          ))}
        </div>
      )}

      {editMode === 'text' && editPageIdx !== null && config.pages[editPageIdx] && (
        <div className="no-print p-4 border-b space-y-2" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
          <PageEditor page={config.pages[editPageIdx]} idx={editPageIdx} onUpdate={updatePage} />
        </div>
      )}

      {/* Proposal preview + print control */}
      <div className="flex justify-center py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="no-print flex justify-center mb-2">
            <DownloadControls />
          </div>
          <ProposalDocument config={config} templateId={templateId} />
        </div>
      </div>
    </div>
  );
}

function PageEditor({ page, idx, onUpdate }: {
  page: PageType;
  idx: number;
  onUpdate: (idx: number, updater: (p: PageType) => PageType) => void;
}) {
  switch (page.type) {
    case 'cover':
      return (
        <div className="flex gap-4 text-xs">
          <LabelInput label="Title" value={page.title} onChange={(v) => onUpdate(idx, (p) => ({ ...p, title: v }))} />
          <LabelInput label="Subtitle" value={page.subtitle} onChange={(v) => onUpdate(idx, (p) => ({ ...p, subtitle: v }))} />
        </div>
      );
    case 'stats':
      return (
        <div className="space-y-2">
          <div className="flex gap-4 text-xs">
            <LabelInput label="Title" value={page.title} onChange={(v) => onUpdate(idx, (p) => ({ ...p, title: v }))} />
            <LabelInput label="Subtitle" value={page.subtitle} onChange={(v) => onUpdate(idx, (p) => ({ ...p, subtitle: v }))} />
            <LabelInput label="Highlight" value={page.highlight} onChange={(v) => onUpdate(idx, (p) => ({ ...p, highlight: v }))} />
          </div>
        </div>
      );
    case 'offerings':
      return (
        <div className="flex gap-4 text-xs">
          <LabelInput label="Title" value={page.title} onChange={(v) => onUpdate(idx, (p) => ({ ...p, title: v }))} />
          <LabelInput label="Subtitle" value={page.subtitle} onChange={(v) => onUpdate(idx, (p) => ({ ...p, subtitle: v }))} />
        </div>
      );
    case 'pricing':
      return (
        <div className="flex gap-4 text-xs">
          <LabelInput label="Title" value={page.title} onChange={(v) => onUpdate(idx, (p) => ({ ...p, title: v }))} />
          <LabelInput label="Subtitle" value={page.subtitle} onChange={(v) => onUpdate(idx, (p) => ({ ...p, subtitle: v }))} />
          <LabelInput label="Note" value={page.note} onChange={(v) => onUpdate(idx, (p) => ({ ...p, note: v }))} />
        </div>
      );
    case 'process':
      return (
        <div className="flex gap-4 text-xs">
          <LabelInput label="Title" value={page.title} onChange={(v) => onUpdate(idx, (p) => ({ ...p, title: v }))} />
          <LabelInput label="Subtitle" value={page.subtitle} onChange={(v) => onUpdate(idx, (p) => ({ ...p, subtitle: v }))} />
        </div>
      );
    case 'contact':
      return (
        <div className="flex gap-4 text-xs">
          <LabelInput label="Title" value={page.title} onChange={(v) => onUpdate(idx, (p) => ({ ...p, title: v }))} />
          <LabelInput label="Subtitle" value={page.subtitle} onChange={(v) => onUpdate(idx, (p) => ({ ...p, subtitle: v }))} />
          <LabelInput label="CTA" value={page.cta} onChange={(v) => onUpdate(idx, (p) => ({ ...p, cta: v }))} />
        </div>
      );
    case 'case_studies':
      return (
        <div className="flex gap-4 text-xs">
          <LabelInput label="Title" value={page.title} onChange={(v) => onUpdate(idx, (p) => ({ ...p, title: v }))} />
          <LabelInput label="Subtitle" value={page.subtitle} onChange={(v) => onUpdate(idx, (p) => ({ ...p, subtitle: v }))} />
        </div>
      );
    default:
      return <p className="text-xs" style={{ color: '#94a3b8' }}>No editable fields for this page type.</p>;
  }
}

function LabelInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 flex-1">
      <span style={{ color: '#64748b' }}>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-1.5 rounded border text-xs"
        style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
    </label>
  );
}
