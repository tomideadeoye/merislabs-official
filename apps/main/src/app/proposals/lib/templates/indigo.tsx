import React from 'react';
import type { BrandConfig, PageType, StatItem, OfferingItem, TierItem, ProcessStep, ContactBlock, CaseStudyItem } from '../types';
import { A4Page, PageHeader, PageFooter } from '../page-wrapper';
import { renderLine } from '../render-line';
import type { TemplateDefinition } from './registry';

function SectionLabel({ text, color }: { text: string; color: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full mb-4"
      style={{ backgroundColor: `${color}15`, color }}>{text}</div>
  );
}

function gradient(brand: BrandConfig) {
  return `linear-gradient(135deg, ${brand.primary}, ${brand.primary}dd, ${brand.highlight})`;
}

function PageContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col h-full bg-white p-12">{children}</div>;
}

function CoverPage(page: Extract<PageType, { type: 'cover' }>, brand: BrandConfig) {
  return (
    <A4Page key="cover">
      <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ background: gradient(brand) }}>
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl" style={{ background: brand.accent, opacity: 0.15 }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl" style={{ background: brand.primary, opacity: 0.15 }} />
        <div className="flex-1 flex flex-col items-center justify-center px-16 text-center relative z-10">
          <img src={page.logo} alt="" className="h-24 w-auto mb-12 drop-shadow-2xl brightness-0 invert" />
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight tracking-tight">{page.title}</h1>
          <p className="text-2xl font-light mb-4" style={{ color: `${brand.accent}bb` }}>{page.subtitle}</p>
          <div className="w-32 h-0.5 my-8" style={{ background: `linear-gradient(to right, transparent, ${brand.accent}, transparent)` }} />
        </div>
        <div className="px-16 pb-12 relative z-10">
          <div className="pt-6 flex items-center justify-between border-t" style={{ borderColor: `${brand.background}20` }}>
            <span className="text-sm" style={{ color: `${brand.background}60` }}>MerisLabs — Proposal</span>
            <span className="text-sm" style={{ color: `${brand.background}60` }}>June 2026</span>
          </div>
        </div>
      </div>
    </A4Page>
  );
}

function StatsPage(page: Extract<PageType, { type: 'stats' }>, brand: BrandConfig) {
  return (
    <A4Page key="stats">
      <PageContent>
        <PageHeader logo="/MERISLABS-LOGO.png" label="Proposal" brand={brand} />
        <SectionLabel text={page.title} color={brand.primary} />
        <h2 className="text-3xl font-bold mb-1" style={{ color: brand.text }}>{page.subtitle}</h2>
        <p className="text-sm mb-6" style={{ color: brand.textLight }}>{page.highlight}</p>
        <div className="grid grid-cols-3 gap-4">
          {page.stats.map((s: StatItem) => (
            <div key={s.label} className="rounded-xl p-5 border text-center"
              style={{ backgroundColor: brand.cardBg, borderColor: `${brand.primary}15` }}>
              <div className="text-2xl font-bold mb-1" style={{ color: brand.primary }}>{s.value}</div>
              <div className="text-sm font-medium mb-1" style={{ color: brand.text }}>{s.label}</div>
              <div className="text-xs" style={{ color: brand.textLight }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <PageFooter left="MerisLabs" right="AI Workflow Implementation" brand={brand} />
      </PageContent>
    </A4Page>
  );
}

function OfferingsPage(page: Extract<PageType, { type: 'offerings' }>, brand: BrandConfig) {
  return (
    <A4Page key="offerings">
      <PageContent>
        <PageHeader logo="/MERISLABS-LOGO.png" label="Proposal" brand={brand} />
        <SectionLabel text="AI Workflow Offerings" color={brand.primary} />
        <h2 className="text-3xl font-bold mb-1" style={{ color: brand.text }}>{page.title}</h2>
        <p className="text-sm mb-6" style={{ color: brand.textLight }}>{page.subtitle}</p>
        <div className="grid grid-cols-2 gap-4">
          {page.items.map((item: OfferingItem) => (
            <div key={item.title} className="rounded-xl p-5 border"
              style={{ backgroundColor: brand.cardBg, borderColor: `${brand.primary}15` }}>
              <span className="text-2xl mb-3 block">{item.icon}</span>
              <h3 className="font-bold text-sm mb-1.5" style={{ color: brand.text }}>{item.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: brand.textLight }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <PageFooter left="MerisLabs" right="Page 2" brand={brand} />
      </PageContent>
    </A4Page>
  );
}

function PricingPage(page: Extract<PageType, { type: 'pricing' }>, brand: BrandConfig) {
  const tierColors = [
    { bg: '#f8fafc', border: '#e2e8f0' },
    { bg: `${brand.primary}08`, border: `${brand.primary}30` },
    { bg: '#faf5ff', border: '#e9d5ff' },
    { bg: '#ecfdf5', border: '#a7f3d0' },
  ];
  return (
    <A4Page key="pricing">
      <PageContent>
        <PageHeader logo="/MERISLABS-LOGO.png" label="Proposal" brand={brand} />
        <SectionLabel text="Service Tiers" color={brand.primary} />
        <h2 className="text-3xl font-bold mb-1" style={{ color: brand.text }}>{page.title}</h2>
        <p className="text-sm mb-6" style={{ color: brand.textLight }}>{page.subtitle}</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {page.tiers.map((tier: TierItem, i: number) => (
            <div key={tier.name} className="rounded-xl border p-5"
              style={{ backgroundColor: tierColors[i].bg, borderColor: tierColors[i].border }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: brand.text }}>{tier.name}</h3>
              <ul className="space-y-2.5">
                {tier.items.map(([s, p]: [string, string]) => (
                  <li key={s} className="flex items-center justify-between text-sm">
                    <span style={{ color: brand.text }}>{s}</span>
                    {p && <span className="font-semibold text-xs ml-2" style={{ color: brand.primary }}>{p}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-4 border text-xs" style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a', color: '#92400e' }}>
          <strong>Note:</strong> {page.note}
        </div>
        <PageFooter left="MerisLabs" right="Page 3" brand={brand} />
      </PageContent>
    </A4Page>
  );
}

function ProcessPage(page: Extract<PageType, { type: 'process' }>, brand: BrandConfig) {
  return (
    <A4Page key="process">
      <PageContent>
        <PageHeader logo="/MERISLABS-LOGO.png" label="Proposal" brand={brand} />
        <SectionLabel text="How We Work" color={brand.primary} />
        <h2 className="text-3xl font-bold mb-1" style={{ color: brand.text }}>{page.title}</h2>
        <p className="text-sm mb-8" style={{ color: brand.textLight }}>{page.subtitle}</p>
        <div className="space-y-4">
          {page.steps.map((s: ProcessStep, i: number) => (
            <div key={s.step} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: brand.primary }}>{s.step}</div>
                {i < page.steps.length - 1 && <div className="w-0.5 flex-1 mt-2" style={{ backgroundColor: `${brand.primary}40` }} />}
              </div>
              <div className="pb-4">
                <h3 className="font-bold text-base mb-1" style={{ color: brand.text }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: brand.textLight }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <PageFooter left="MerisLabs" right="Page 4" brand={brand} />
      </PageContent>
    </A4Page>
  );
}

function CaseStudiesPage(page: Extract<PageType, { type: 'case_studies' }>, brand: BrandConfig) {
  return (
    <A4Page key="case_studies">
      <PageContent>
        <PageHeader logo="/MERISLABS-LOGO.png" label="Proposal" brand={brand} />
        <SectionLabel text="Past Projects" color={brand.primary} />
        <h2 className="text-3xl font-bold mb-1" style={{ color: brand.text }}>{page.title}</h2>
        <p className="text-sm mb-5" style={{ color: brand.textLight }}>{page.subtitle}</p>
        <div className="grid grid-cols-2 gap-4">
          {page.items.map((item: CaseStudyItem) => (
            <div key={item.title} className="rounded-xl border overflow-hidden flex flex-col"
              style={{ borderColor: `${brand.primary}15` }}>
              <div className="h-24 flex items-center justify-center relative"
                style={{ background: item.gradient }}>
                <div className="flex items-center gap-1.5 absolute top-3 left-3">
                  {item.tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>{t}</span>
                  ))}
                </div>
                <span className="text-3xl font-bold text-white opacity-30 tracking-widest">{item.initial}</span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-sm mb-0.5" style={{ color: brand.text }}>{item.title}</h3>
                <p className="text-xs mb-3" style={{ color: brand.textLight }}>{item.subtitle}</p>
                <div className="flex items-center gap-3 mb-2 mt-auto">
                  {item.metrics.map((m) => (
                    <div key={m.label} className="text-center flex-1">
                      <div className="text-xs font-bold" style={{ color: brand.primary }}>{m.value}</div>
                      <div className="text-[10px]" style={{ color: brand.textLight }}>{m.label}</div>
                    </div>
                  ))}
                </div>
                <a href={item.link} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium text-center py-1.5 rounded-lg mt-2 transition"
                  style={{ backgroundColor: `${brand.primary}10`, color: brand.primary }}>
                  View case study →
                </a>
              </div>
            </div>
          ))}
        </div>
        <PageFooter left="MerisLabs" right="Page 2" brand={brand} />
      </PageContent>
    </A4Page>
  );
}

function ContactPage(page: Extract<PageType, { type: 'contact' }>, brand: BrandConfig) {
  return (
    <A4Page key="contact">
      <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ background: gradient(brand) }}>
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl" style={{ background: brand.accent, opacity: 0.15 }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl" style={{ background: brand.primary, opacity: 0.15 }} />
        <div className="flex-1 flex flex-col items-center justify-center px-16 text-center relative z-10">
          <img src={page.logo} alt="" className="h-20 w-auto mb-10 drop-shadow-2xl brightness-0 invert" />
          <h1 className="text-4xl font-bold text-white mb-4">{page.title}</h1>
          <p className="text-lg max-w-xl mb-10 leading-relaxed" style={{ color: `${brand.accent}bb` }}>{page.subtitle}</p>
          <div className="w-32 h-0.5 mb-10" style={{ background: `linear-gradient(to right, transparent, ${brand.accent}, transparent)` }} />
          <div className="grid grid-cols-2 gap-16 text-left max-w-xl">
            {page.blocks.map((b: ContactBlock) => (
              <div key={b.heading}>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: `${brand.accent}cc` }}>
                  <span className="w-4 h-0.5 inline-block mr-2" style={{ backgroundColor: brand.accent }} />
                  {b.heading}
                </h3>
                <div className="text-sm space-y-1" style={{ color: `${brand.background}bb` }}>
                  {b.lines.map((l: string) => <p key={l}>{renderLine(l, `${brand.background}bb`)}</p>)}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-10" style={{ color: `${brand.background}50` }}>{page.cta}</p>
        </div>
        <div className="px-16 pb-12 relative z-10">
          <div className="pt-6 flex items-center justify-between border-t" style={{ borderColor: `${brand.background}20` }}>
            <span className="text-sm" style={{ color: `${brand.background}60` }}>MerisLabs — Proposal</span>
            <span className="text-sm" style={{ color: `${brand.background}60` }}>June 2026</span>
          </div>
        </div>
      </div>
    </A4Page>
  );
}

export const indigo: TemplateDefinition = {
  name: 'Indigo',
  renderPage(page: PageType, brand: BrandConfig): React.ReactNode {
    switch (page.type) {
      case 'cover': return CoverPage(page, brand);
      case 'stats': return StatsPage(page, brand);
      case 'case_studies': return CaseStudiesPage(page, brand);
      case 'offerings': return OfferingsPage(page, brand);
      case 'pricing': return PricingPage(page, brand);
      case 'process': return ProcessPage(page, brand);
      case 'contact': return ContactPage(page, brand);
    }
  },
};
