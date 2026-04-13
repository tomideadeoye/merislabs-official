'use client';

const BackgroundPattern = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
    <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
  </div>
);

const PlatformTable = ({ rows }: { rows: { label: string; value: string }[] }) => (
  <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
    {rows.map(({ label, value }, i) => (
      <div key={i} className={`flex text-xs ${i % 2 === 0 ? 'bg-[#211B1B]/3' : 'bg-transparent'}`}>
        <div className="w-36 shrink-0 px-4 py-2.5 font-black text-[#211B1B]/50 uppercase tracking-wide text-[9px] border-r border-[#211B1B]/8 flex items-start pt-3">
          {label}
        </div>
        <div className="flex-1 px-4 py-2.5 text-[#211B1B]/70 leading-relaxed">{value}</div>
      </div>
    ))}
  </div>
);

export const Platform1 = () => {
  const rows = [
    {
      label: 'Market Opportunity',
      value:
        'Rising default rates, NPL volumes, CBN-driven credit tightening, growing need for restructuring and insolvency, limited pool of specialised practitioners in Nigeria.',
    },
    {
      label: 'Commercial Focus',
      value:
        'Tier 1 banks and financial institutions, commercial lenders and asset managers, corporates with significant receivables exposure.',
    },
    {
      label: 'Core Offerings',
      value:
        'Loan recovery litigation and enforcement proceedings, receivership, insolvency and business rescue mandates, enforcement of security interests and collateral realisation, creditor advisory and restructuring strategies.',
    },
    {
      label: 'Revenue Model',
      value: 'Ongoing credit cycles, non-performing loan portfolios, recurring enforcement needs.',
    },
  ];

  return (
    <div
      id="platform-1"
      className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans"
    >
      <BackgroundPattern />

      <div className="flex items-center gap-4 mb-6 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
        <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">03</span>
        <div>
          <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">
            Proposed Business – Project Fortify
          </h2>
          <p className="text-xs text-[#211B1B]/40 uppercase tracking-widest mt-1">CLDR Practice Growth Plan</p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-5 text-xs leading-relaxed">
        <p className="text-[#211B1B]/80 text-justify">
          Project Fortify represents the establishment of a structured, revenue-generating disputes business within the
          Firm, designed to transform CLDR from a reactive support function into a proactive, client-originating
          commercial platform built on three integrated dispute platforms.
        </p>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#E80000] flex items-center justify-center shrink-0">
              <span className="text-white font-black text-xs">1</span>
            </div>
            <div>
              <p className="font-black text-sm text-[#211B1B] uppercase tracking-wide">
                Institutional Debt Recovery, Insolvency &amp; Enforcement
              </p>
              <p className="text-[9px] text-[#211B1B]/40 uppercase tracking-widest">Platform 1 of 3</p>
            </div>
          </div>
          <PlatformTable rows={rows} />
        </div>

        <div className="bg-[#E80000]/5 border border-[#E80000]/15 rounded-lg p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E80000] mb-2">Strategic Rationale</p>
          <p className="text-[#211B1B]/70 text-justify">
            By developing productised recovery solutions and institutional relationships, the Firm is positioned to
            secure consistent mandates and predictable revenue flows from Nigeria&apos;s expanding credit and
            enforcement market.
          </p>
        </div>
      </div>
    </div>
  );
};

export const Platform2 = () => {
  const rows = [
    {
      label: 'Market Opportunity',
      value:
        "Increasing complexity of commercial and transactional arrangements, growth in joint ventures and multi-party contracts, rising shareholder and governance disputes, pipeline of disputes from the Firm's transactional work.",
    },
    {
      label: 'Commercial Focus',
      value:
        'Corporate clients across Energy, FMCG, Financial Services and Technology, joint venture participants and investors, shareholders and corporate stakeholders.',
    },
    {
      label: 'Core Offerings',
      value:
        'Contractual and commercial disputes, shareholder and partnership conflicts, corporate governance and control disputes, joint venture and investment-related disputes.',
    },
    {
      label: 'Revenue Model',
      value:
        'Cross-practice collaboration, early-stage dispute identification, positioning CLDR as the "first call" disputes advisor.',
    },
  ];

  return (
    <div
      id="platform-2"
      className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans"
    >
      <BackgroundPattern />

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-1 h-12 bg-[#E80000]"></div>
        <div>
          <p className="text-[9px] text-[#211B1B]/40 uppercase tracking-widest mb-1">Section 3 – Continued</p>
          <h2 className="text-xl font-serif font-black text-[#211B1B] uppercase">
            Proposed Business – Project Fortify
          </h2>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-5 text-xs leading-relaxed">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#211B1B] flex items-center justify-center shrink-0">
              <span className="text-white font-black text-xs">2</span>
            </div>
            <div>
              <p className="font-black text-sm text-[#211B1B] uppercase tracking-wide">
                Commercial, Transactional &amp; Shareholder Disputes
              </p>
              <p className="text-[9px] text-[#211B1B]/40 uppercase tracking-widest">Platform 2 of 3</p>
            </div>
          </div>
          <PlatformTable rows={rows} />
        </div>

        <div className="bg-[#211B1B]/5 border border-[#211B1B]/10 rounded-lg p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#211B1B]/50 mb-2">Strategic Rationale</p>
          <p className="text-[#211B1B]/70 text-justify">
            The objective of this platform is therefore twofold. First, it seeks to expand wallet share from existing
            and prospective corporate clients by positioning the CLDR practice as the natural first point of call when
            commercial relationships begin to deteriorate or when disputes become imminent. Secondly, it aims to improve
            internal retention of disputes work by ensuring that matters arising from the Firm's transactional, sectoral
            and advisory engagements are identified early and channelled into the practice rather than externalised to
            competing firms.
          </p>
        </div>

        <div className="mt-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#E80000]/80 flex items-center justify-center shrink-0">
              <span className="text-white font-black text-xs">3</span>
            </div>
            <div>
              <p className="font-black text-sm text-[#211B1B] uppercase tracking-wide">
                Domestic &amp; International Arbitration &amp; Cross-Border Enforcement
              </p>
              <p className="text-[9px] text-[#211B1B]/40 uppercase tracking-widest">Platform 3 of 3</p>
            </div>
          </div>
          <PlatformTable
            rows={[
              {
                label: 'Market Opportunity',
                value:
                  'Growth in cross-border investment, increased adoption of arbitration in commercial contracts, currency volatility driving cross-border payment disputes, rising enforcement of foreign arbitral awards, limited local capacity for complex cross-border execution.',
              },
              {
                label: 'Commercial Focus',
                value:
                  'Corporate clients across Energy, FMCG, Financial Services and Technology, foreign investors and international counterparties, multinational corporations and project participants.',
              },
              {
                label: 'Core Offerings',
                value:
                  'Representation in domestic and international arbitration, enforcement of arbitral awards and foreign judgments, cross-border dispute strategy and coordination, advisory on dispute resolution frameworks and arbitration clauses.',
              },
              {
                label: 'Revenue Model',
                value:
                  'International referrals and co-counsel relationships, participation in global dispute networks, enforcement of foreign awards in Nigeria and related jurisdictions.',
              },
            ]}
          />
        </div>
        <div className="bg-[#E80000]/5 border border-[#E80000]/15 rounded-lg p-5 mt-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E80000] mb-2">Strategic Rationale</p>
          <p className="text-[#211B1B]/70 text-justify">
            This platform therefore serves a dual purpose. It creates access to premium disputes work, while also
            strengthening the Firm's international profile and its ability to serve as trusted Nigerian counsel in
            cross-border matters.
          </p>
        </div>
      </div>
    </div>
  );
};
