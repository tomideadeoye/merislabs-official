'use client';

import { useMemo, useState } from 'react';

type Variant = 'seal' | 'ribbon' | 'crest';
type SizePreset = '24' | '48' | '96' | '256';

const BRAND = {
  firm: 'Jackson, Etti & Edu',
  mark: 'JEE',
  years: '1996 - 2026',
  line: '30 Years Anniversary',
};

function HeritageSeal({ primary, accent, mono }: { primary: string; accent: string; mono: boolean }) {
  const base = mono ? '#000000' : primary;
  const signal = mono ? '#000000' : accent;

  return (
    <svg width="760" height="360" viewBox="0 0 760 360" role="img" aria-label="JEE 30 Heritage Seal">
      <circle cx="380" cy="164" r="122" fill="none" stroke={base} strokeOpacity="0.2" strokeWidth="1.4" strokeDasharray="3 12" />
      <circle cx="380" cy="164" r="98" fill="none" stroke={signal} strokeWidth="16" />
      <circle cx="380" cy="164" r="72" fill="none" stroke={base} strokeWidth="1.8" strokeOpacity="0.45" strokeDasharray="4 10" />

      <text x="328" y="194" fill={base} style={{ fontFamily: 'Georgia, Times New Roman, serif', fontSize: 130, fontWeight: 700 }}>
        3
      </text>
      <text x="390" y="194" fill={base} style={{ fontFamily: 'Georgia, Times New Roman, serif', fontSize: 130, fontWeight: 700 }}>
        0
      </text>

      <text x="380" y="166" textAnchor="middle" fill={base} style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>
        {BRAND.years}
      </text>

      <text x="380" y="305" textAnchor="middle" fill={base} style={{ fontFamily: 'Georgia, Times New Roman, serif', fontSize: 36, fontWeight: 600, letterSpacing: 1.6 }}>
        {BRAND.firm.toUpperCase()}
      </text>
    </svg>
  );
}

function RibbonThirty({ primary, accent, mono }: { primary: string; accent: string; mono: boolean }) {
  const base = mono ? '#000000' : primary;
  const signal = mono ? '#000000' : accent;

  return (
    <svg width="780" height="340" viewBox="0 0 780 340" role="img" aria-label="JEE 30 Ribbon Anniversary">
      <path d="M180 62 C288 62, 300 126, 236 152 C300 178, 288 242, 180 242" fill="none" stroke={base} strokeWidth="34" strokeLinecap="round" />
      <path d="M194 74 C282 74, 288 126, 232 152 C288 178, 282 230, 194 230" fill="none" stroke={signal} strokeWidth="5" strokeLinecap="round" />

      <circle cx="520" cy="152" r="86" fill="none" stroke={signal} strokeWidth="18" />
      <circle cx="520" cy="152" r="58" fill="none" stroke={base} strokeWidth="1.6" strokeOpacity="0.4" strokeDasharray="3 8" />
      <text x="520" y="157" textAnchor="middle" fill={base} style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>
        30 YEARS
      </text>

      <line x1="126" y1="276" x2="648" y2="276" stroke={base} strokeOpacity="0.25" strokeWidth="1" />
      <text x="390" y="320" textAnchor="middle" fill={base} style={{ fontFamily: 'Georgia, Times New Roman, serif', fontSize: 34, fontWeight: 600, letterSpacing: 2 }}>
        {BRAND.firm.toUpperCase()}
      </text>
    </svg>
  );
}

function CrestThirty({ primary, accent, mono }: { primary: string; accent: string; mono: boolean }) {
  const base = mono ? '#000000' : primary;
  const signal = mono ? '#000000' : accent;

  return (
    <svg width="720" height="380" viewBox="0 0 720 380" role="img" aria-label="JEE 30 Crest Anniversary">
      <path d="M360 46 L518 102 V188 C518 258 456 314 360 338 C264 314 202 258 202 188 V102 Z" fill="none" stroke={base} strokeWidth="2" strokeOpacity="0.28" />
      <path d="M360 66 L498 112 V188 C498 248 445 296 360 320 C275 296 222 248 222 188 V112 Z" fill="none" stroke={signal} strokeWidth="10" />

      <text x="360" y="188" textAnchor="middle" fill={base} style={{ fontFamily: 'Georgia, Times New Roman, serif', fontSize: 118, fontWeight: 700 }}>
        30
      </text>
      <text x="360" y="216" textAnchor="middle" fill={base} style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 11, fontWeight: 700, letterSpacing: 2.2 }}>
        ANNIVERSARY EDITION
      </text>

      <line x1="238" y1="244" x2="482" y2="244" stroke={base} strokeOpacity="0.28" strokeWidth="1" />

      <text x="360" y="360" textAnchor="middle" fill={base} style={{ fontFamily: 'Georgia, Times New Roman, serif', fontSize: 30, fontWeight: 600, letterSpacing: 2 }}>
        {BRAND.mark}  {BRAND.years}
      </text>
    </svg>
  );
}

export default function JEELogoLab2Page() {
  const [variant, setVariant] = useState<Variant>('seal');
  const [sizePreset, setSizePreset] = useState<SizePreset>('96');
  const [primary, setPrimary] = useState('#121212');
  const [accent, setAccent] = useState('#b81f38');
  const [background, setBackground] = useState('#f6f3ee');
  const [mono, setMono] = useState(false);
  const [blurTest, setBlurTest] = useState(false);

  const previewScale = useMemo(() => {
    if (sizePreset === '24') return 0.24;
    if (sizePreset === '48') return 0.48;
    if (sizePreset === '96') return 1;
    return 2.2;
  }, [sizePreset]);

  const title = useMemo(() => {
    if (variant === 'seal') return 'Heritage Seal 30';
    if (variant === 'ribbon') return 'Ribbon 30 Lockup';
    return 'Crest 30 Emblem';
  }, [variant]);

  return (
    <div className="min-h-screen bg-[#f9f8f6] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f9f8f6]/95 backdrop-blur px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-end justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">JEE Anniversary Logo Lab</h1>
            <p className="text-sm text-slate-600">All options are 30th-anniversary marks. No generic logo routes.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Primary</span>
              <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} />
            </label>
            <label className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Accent</span>
              <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} />
            </label>
            <label className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">BG</span>
              <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} />
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 space-y-6 h-fit shadow-sm">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Anniversary Direction</h2>
            <div className="grid grid-cols-1 gap-2">
              {([
                ['seal', 'Heritage Seal 30'],
                ['ribbon', 'Ribbon 30 Lockup'],
                ['crest', 'Crest 30 Emblem'],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setVariant(id)}
                  className={`text-left rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    variant === id ? 'bg-black text-white border-black' : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Stress Tests</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Size preset</label>
                <select
                  value={sizePreset}
                  onChange={(e) => setSizePreset(e.target.value as SizePreset)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
                >
                  <option value="24">24px</option>
                  <option value="48">48px</option>
                  <option value="96">96px</option>
                  <option value="256">256px</option>
                </select>
              </div>

              <label className="flex items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2">
                <span className="font-medium text-slate-700">Monochrome</span>
                <input type="checkbox" checked={mono} onChange={(e) => setMono(e.target.checked)} />
              </label>

              <label className="flex items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2">
                <span className="font-medium text-slate-700">Blur test</span>
                <input type="checkbox" checked={blurTest} onChange={(e) => setBlurTest(e.target.checked)} />
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Selection Rule</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>1. "30" must read instantly.</li>
              <li>2. Anniversary message must survive at small size.</li>
              <li>3. Must feel institutional and commemorative.</li>
            </ul>
          </section>
        </aside>

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 mb-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Current Anniversary Candidate</h2>
                <p className="text-lg font-semibold text-slate-900">{title}</p>
              </div>
              <button
                onClick={() => {
                  setVariant('seal');
                  setSizePreset('96');
                  setPrimary('#121212');
                  setAccent('#b81f38');
                  setBackground('#f6f3ee');
                  setMono(false);
                  setBlurTest(false);
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Reset to Anniversary Base
              </button>
            </div>

            <div
              className="rounded-xl border border-slate-200 min-h-[540px] flex items-center justify-center overflow-hidden p-6"
              style={{
                backgroundColor: background,
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)',
                backgroundSize: '30px 30px',
              }}
            >
              <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'center center', filter: blurTest ? 'blur(1.1px)' : 'none' }}>
                {variant === 'seal' && <HeritageSeal primary={primary} accent={accent} mono={mono} />}
                {variant === 'ribbon' && <RibbonThirty primary={primary} accent={accent} mono={mono} />}
                {variant === 'crest' && <CrestThirty primary={primary} accent={accent} mono={mono} />}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
