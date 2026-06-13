import React from 'react';
import type { BrandConfig, PageType, StatItem, OfferingItem, TierItem, ProcessStep, ContactBlock, CaseStudyItem } from '../types';
import { A4Page } from '../page-wrapper';
import { renderLine } from '../render-line';
import type { TemplateDefinition } from './registry';

function gradient(brand: BrandConfig) {
  return `linear-gradient(180deg, ${brand.primary} 0%, ${brand.highlight} 100%)`;
}

function SectionLabel({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-0.5" style={{ backgroundColor: color }} />
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color }}>{text}</span>
    </div>
  );
}

function CoverPage(page: Extract<PageType, { type: 'cover' }>, brand: BrandConfig) {
  return (
    <A4Page key="cover">
      <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ background: gradient(brand) }}>
        <div className="flex-1 flex flex-col justify-center px-16 relative z-10">
          <div className="w-16 h-0.5 mb-8" style={{ backgroundColor: `${brand.accent}cc` }} />
          <h1 className="text-6xl font-extralight text-white mb-4 leading-tight tracking-wide">{page.title}</h1>
          <p className="text-2xl font-light" style={{ color: `${brand.accent}cc` }}>{page.subtitle}</p>
          <div className="mt-16">
            <p className="text-xs uppercase tracking-widest" style={{ color: `${brand.background}60` }}>Prepared by</p>
            <div className="flex items-center gap-4 mt-3">
              <img src={page.logo} alt="" className="h-10 w-auto brightness-0 invert" />
              <span className="text-sm" style={{ color: `${brand.background}bb` }}>MerisLabs</span>
            </div>
          </div>
        </div>
        <div className="px-16 pb-12 relative z-10">
          <div className="pt-6 flex items-center justify-between border-t" style={{ borderColor: `${brand.background}20` }}>
            <span className="text-xs" style={{ color: `${brand.background}60` }}>confidential</span>
            <span className="text-xs" style={{ color: `${brand.background}60` }}>June 2026</span>
          </div>
        </div>
      </div>
    </A4Page>
  );
}

function StatsPage(page: Extract<PageType, { type: 'stats' }>, brand: BrandConfig) {
  return (
    <A4Page key="stats">
      <div className="flex flex-col h-full bg-white p-10">
        <SectionLabel text={page.title} color={brand.primary} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: brand.text }}>{page.subtitle}</h2>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: brand.textLight }}>{page.highlight}</p>
        <div className="grid grid-cols-3 gap-5">
          {page.stats.map((s: StatItem) => (
            <div key={s.label}>
              <div className="text-3xl font-bold mb-1" style={{ color: brand.primary }}>{s.value}</div>
              <div className="text-sm font-medium mb-0.5" style={{ color: brand.text }}>{s.label}</div>
              <div className="text-xs" style={{ color: brand.textLight }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </A4Page>
  );
}

function OfferingsPage(page: Extract<PageType, { type: 'offerings' }>, brand: BrandConfig) {
  return (
    <A4Page key="offerings">
      <div className="flex flex-col h-full bg-white p-10">
        <SectionLabel text="Offerings" color={brand.primary} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: brand.text }}>{page.title}</h2>
        <p className="text-sm mb-8" style={{ color: brand.textLight }}>{page.subtitle}</p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          {page.items.map((item: OfferingItem) => (
            <div key={item.title}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{item.icon}</span>
                <h3 className="font-semibold text-sm" style={{ color: brand.text }}>{item.title}</h3>
              </div>
              <p className="text-xs leading-relaxed ml-9" style={{ color: brand.textLight }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </A4Page>
  );
}

function PricingPage(page: Extract<PageType, { type: 'pricing' }>, brand: BrandConfig) {
  return (
    <A4Page key="pricing">
      <div className="flex flex-col h-full bg-white p-10">
        <SectionLabel text="Investment" color={brand.primary} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: brand.text }}>{page.title}</h2>
        <p className="text-sm mb-8" style={{ color: brand.textLight }}>{page.subtitle}</p>
        <div className="space-y-3 mb-6">
          {page.tiers.map((tier: TierItem) => (
            <div key={tier.name} className="flex border-b pb-3" style={{ borderColor: `${brand.primary}15` }}>
              <div className="w-48 flex-shrink-0">
                <span className="font-semibold text-sm" style={{ color: brand.primary }}>{tier.name}</span>
              </div>
              <div className="space-y-2 text-sm" style={{ color: brand.text }}>
                {tier.items.map(([s, p]: [string, string]) => (
                  <div key={s} className="flex items-center justify-between gap-8">
                    <span>{s}</span>
                    {p && <span className="font-semibold text-xs" style={{ color: brand.textLight }}>{p}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs" style={{ color: brand.textLight }}><em>{page.note}</em></p>
      </div>
    </A4Page>
  );
}

function ProcessPage(page: Extract<PageType, { type: 'process' }>, brand: BrandConfig) {
  return (
    <A4Page key="process">
      <div className="flex flex-col h-full bg-white p-10">
        <SectionLabel text="Process" color={brand.primary} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: brand.text }}>{page.title}</h2>
        <p className="text-sm mb-8" style={{ color: brand.textLight }}>{page.subtitle}</p>
        <div className="space-y-8">
          {page.steps.map((s: ProcessStep) => (
            <div key={s.step} className="flex gap-5">
              <div className="w-12 text-center flex-shrink-0 pt-0.5">
                <span className="text-xs font-bold tracking-wider" style={{ color: brand.primary }}>{s.step}</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: brand.text }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: brand.textLight }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </A4Page>
  );
}

function CaseStudiesPage(page: Extract<PageType, { type: 'case_studies' }>, brand: BrandConfig) {
  return (
    <A4Page key="case_studies">
      <div className="flex flex-col h-full bg-white p-10">
        <SectionLabel text="Case Studies" color={brand.primary} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: brand.text }}>{page.title}</h2>
        <p className="text-sm mb-6" style={{ color: brand.textLight }}>{page.subtitle}</p>
        <div className="grid grid-cols-2 gap-4">
          {page.items.map((item: CaseStudyItem) => (
            <div key={item.title} className="border-t pt-4 flex flex-col"
              style={{ borderColor: `${brand.primary}15` }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: item.gradient }}>
                  {item.initial}
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: brand.text }}>{item.title}</h3>
                  <p className="text-[11px]" style={{ color: brand.textLight }}>{item.subtitle}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {item.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded"
                    style={{ backgroundColor: brand.cardBg, color: brand.textLight }}>{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 mb-2">
                {item.metrics.map((m) => (
                  <div key={m.label} className="text-center flex-1">
                    <div className="text-xs font-bold" style={{ color: brand.primary }}>{m.value}</div>
                    <div className="text-[10px]" style={{ color: brand.textLight }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <a href={item.link} target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium mt-auto"
                style={{ color: brand.primary }}>
                View case study ↗
              </a>
            </div>
          ))}
        </div>
      </div>
    </A4Page>
  );
}

function ContactPage(page: Extract<PageType, { type: 'contact' }>, brand: BrandConfig) {
  return (
    <A4Page key="contact">
      <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ background: gradient(brand) }}>
        <div className="flex-1 flex flex-col justify-center px-16 relative z-10">
          <div className="w-16 h-0.5 mb-8" style={{ backgroundColor: `${brand.accent}cc` }} />
          <h1 className="text-4xl font-extralight text-white mb-4">{page.title}</h1>
          <p className="text-base max-w-lg mb-10 leading-relaxed" style={{ color: `${brand.accent}cc` }}>{page.subtitle}</p>
          <div className="grid grid-cols-2 gap-12 max-w-lg">
            {page.blocks.map((b: ContactBlock) => (
              <div key={b.heading}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: `${brand.accent}aa` }}>{b.heading}</p>
                <div className="text-sm space-y-1" style={{ color: `${brand.background}cc` }}>
                  {b.lines.map((l: string) => <p key={l}>{renderLine(l, `${brand.background}cc`)}</p>)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-16 pb-12 relative z-10">
          <div className="pt-6 flex items-center justify-between border-t" style={{ borderColor: `${brand.background}20` }}>
            <span className="text-xs" style={{ color: `${brand.background}50` }}>{page.cta}</span>
          </div>
        </div>
      </div>
    </A4Page>
  );
}

export const professional: TemplateDefinition = {
  name: 'Professional',
  renderPage(page: PageType, brand: BrandConfig): React.ReactNode {
    switch (page.type) {
      case 'cover': return CoverPage(page, brand);
      case 'stats': return StatsPage(page, brand);
      case 'offerings': return OfferingsPage(page, brand);
      case 'pricing': return PricingPage(page, brand);
      case 'process': return ProcessPage(page, brand);
      case 'case_studies': return CaseStudiesPage(page, brand);
      case 'contact': return ContactPage(page, brand);
    }
  },
};
