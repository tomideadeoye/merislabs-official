import { JEE_WEBSITE_URL } from '../../constants';

const platforms = [
  {
    platform: 'Platform 1 — Institutional Debt Recovery, Insolvency & Enforcement',
    color: '#E80000',
    rows: [
      {
        type: 'NPL portfolio recovery mandates / Receivership / insolvency appointments',
        matters: '3–4',
        fee: 'USD 15,000–25,000',
        revenue: 'USD 45,000–100,000',
      },
      {
        type: 'Enforcement & collateral realisation matters',
        matters: '2–3',
        fee: 'USD 10,000–15,000',
        revenue: 'USD 20,000–45,000',
      },
      {
        type: 'Creditor advisory / restructuring retainers',
        matters: '2–4',
        fee: 'USD 8,000–12,000',
        revenue: 'USD 16,000–36,000',
      },
    ],
    total: 'USD 81,000–193,000',
  },
  {
    platform: 'Platform 2 — Commercial, Transactional & Shareholder Disputes',
    color: '#211B1B',
    rows: [
      {
        type: 'Commercial contract disputes (corporate clients)',
        matters: '4–8',
        fee: 'USD 15,000–25,000',
        revenue: 'USD 60,000–200,000',
      },
      {
        type: 'Shareholder / corporate governance disputes',
        matters: '1–2',
        fee: 'USD 5,000–15,000',
        revenue: 'USD 5,000–30,000',
      },
      {
        type: 'Cross-practice referral mandates (internal)',
        matters: '2–3',
        fee: 'USD 10,000–15,000',
        revenue: 'USD 20,000–45,000',
      },
    ],
    total: 'USD 85,000–275,000',
  },
  {
    platform: 'Platform 3 — Domestic & International Arbitration & Cross-Border Enforcement',
    color: '#E80000',
    rows: [
      {
        type: 'International arbitration (co-counsel / referral)',
        matters: '1–2',
        fee: 'USD 15,000–50,000',
        revenue: 'USD 15,000–100,000',
      },
      {
        type: 'Domestic arbitration (NCIA / LCA panel matters)',
        matters: '2–4',
        fee: 'USD 10,000–30,000',
        revenue: 'USD 20,000–120,000',
      },
      {
        type: 'Cross-border award enforcement',
        matters: '1–2',
        fee: 'USD 10,000–25,000',
        revenue: 'USD 10,000–50,000',
      },
    ],
    total: 'USD 45,000–270,000',
  },
];

const RevenueModelSlide = () => (
  <div id="revenue-model" className="w-full h-full relative overflow-hidden bg-[#F9F7ED] font-sans text-[#211B1B]">
    <div className="absolute top-10 left-12 right-12 z-50 flex items-center space-x-4 border-b border-[#211B1B]/10 pb-5">
      <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
        <img
          src="/clients/jackson etti and edu logo (1).png"
          alt="JEE"
          className="h-5 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
        />
      </a>
      <div className="h-3 w-px bg-[#211B1B]/20" />
      <span className="text-[#211B1B]/30 text-[9px] font-bold tracking-[0.4em] uppercase">
        Revenue Model & Projections
      </span>
    </div>

    <div className="absolute inset-0 top-28 left-12 right-12 bottom-10 z-20 grid grid-cols-12 gap-6">
      {/* Left: Platform breakdowns */}
      <div className="col-span-7 flex flex-col gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-[1px] w-8 bg-red-600" />
          <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">10</span>
        </div>
        <h2 className="text-xl font-black uppercase tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#211B1B] to-[#211B1B]/50">
          Platform
          <br />
          <span className="text-red-600">Breakdown</span>
        </h2>
        <div className="space-y-2.5 flex-1 overflow-y-auto">
          {platforms.map((p) => (
            <div key={p.platform} className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
              <div
                className="px-3 py-2 text-white text-[8px] font-black uppercase tracking-wide"
                style={{ backgroundColor: p.color }}
              >
                {p.platform}
              </div>
              <div className="grid grid-cols-12 bg-[#211B1B]/5 text-[#211B1B]/40 text-[7px] font-black uppercase tracking-widest border-b border-[#211B1B]/8">
                <div className="col-span-5 px-2 py-1.5">Mandate Type</div>
                <div className="col-span-2 px-2 py-1.5">Est. Matters</div>
                <div className="col-span-2 px-2 py-1.5">Avg. Fee</div>
                <div className="col-span-3 px-2 py-1.5 text-right">Revenue</div>
              </div>
              {p.rows.map(({ type, matters, fee, revenue }, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-12 border-t border-[#211B1B]/8 text-[8px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}
                >
                  <div className="col-span-5 px-2 py-1.5 text-[#211B1B]/70">{type}</div>
                  <div className="col-span-2 px-2 py-1.5 text-[#211B1B]/50">{matters}</div>
                  <div className="col-span-2 px-2 py-1.5 text-[#211B1B]/50">{fee}</div>
                  <div className="col-span-3 px-2 py-1.5 text-right font-black text-[#211B1B]">{revenue}</div>
                </div>
              ))}
              <div className="grid grid-cols-12 border-t border-[#211B1B]/20 bg-[#211B1B]/5">
                <div className="col-span-9 px-2 py-1.5 text-[8px] font-black uppercase tracking-widest text-[#211B1B]/40">
                  Platform Total
                </div>
                <div className="col-span-3 px-2 py-1.5 text-right font-black text-[9px]" style={{ color: p.color }}>
                  {p.total}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Consolidated projection */}
      <div className="col-span-5 flex flex-col gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-[1px] w-8 bg-red-600" />
          <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">10</span>
        </div>
        <h2 className="text-xl font-black uppercase tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#211B1B] to-[#211B1B]/50">
          Consolidated
          <br />
          <span className="text-red-600">Projection</span>
        </h2>
        <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[7px] font-black uppercase tracking-widest">
            <div className="col-span-4 px-2 py-2">Platform</div>
            <div className="col-span-3 px-2 py-2">Year 1</div>
            <div className="col-span-3 px-2 py-2">Year 2</div>
            <div className="col-span-2 px-2 py-2">Stretch</div>
          </div>
          {[
            { p: 'Platform 1', y1: 'USD 100,000', y2: 'USD 220,000', stretch: 'USD 300,000' },
            { p: 'Platform 2', y1: 'USD 80,000', y2: 'USD 160,000', stretch: 'USD 220,000' },
            { p: 'Platform 3', y1: 'USD 50,000', y2: 'USD 120,000', stretch: 'USD 200,000' },
          ].map(({ p, y1, y2, stretch }, i) => (
            <div
              key={i}
              className={`grid grid-cols-12 border-t border-[#211B1B]/8 text-[8px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}
            >
              <div className="col-span-4 px-2 py-2 font-bold text-[#211B1B]">{p}</div>
              <div className="col-span-3 px-2 py-2 text-[#211B1B]/60">{y1}</div>
              <div className="col-span-3 px-2 py-2 font-black text-[#E80000]">{y2}</div>
              <div className="col-span-2 px-2 py-2 text-[#211B1B]/50">{stretch}</div>
            </div>
          ))}
          <div className="grid grid-cols-12 border-t-2 border-[#E80000] bg-[#211B1B]">
            <div className="col-span-4 px-2 py-2.5 text-white font-black text-[9px] uppercase tracking-widest">
              TOTAL
            </div>
            <div className="col-span-3 px-2 py-2.5 text-white/60 font-black text-[9px]">USD 230,000</div>
            <div className="col-span-3 px-2 py-2.5 text-[#E80000] font-black text-[9px]">USD 500,000</div>
            <div className="col-span-2 px-2 py-2.5 text-white/40 font-black text-[9px]">USD 720,000</div>
          </div>
        </div>
        <div className="bg-[#E80000]/5 border border-[#E80000]/15 rounded-lg p-3">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#E80000] mb-1">Revenue Target</p>
          <p className="text-[#211B1B]/70 text-justify text-[7px] leading-relaxed">
            The revenue ambition is anchored in the practice&apos;s existing active mandate base — including the ongoing
            AMCON debt recovery portfolio, three high-value USD-denominated enforcement matters, and arbitration matters
            positioned to progress to award and enforcement stage.
          </p>
        </div>
      </div>
    </div>

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(220,38,38,0.03)_0%,transparent_50%)] z-0" />
  </div>
);

export default RevenueModelSlide;
