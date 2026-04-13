import { JEE_WEBSITE_URL } from '../../constants';

const drivers = [
  {
    title: 'Banking Sector Stress & NPLs',
    desc: 'CBN recapitalisation directive accelerating balance sheet clean-up. AMCON-linked portfolios and new NPL disposals generating fresh enforcement and recovery mandates.',
  },
  {
    title: 'Currency Volatility & Cross-Border Disputes',
    desc: "Since the Naira's managed float in June 2023, a significant pipeline of FX-linked commercial disputes — LC disputes, contractual performance failures, investment treaty grievances.",
  },
  {
    title: 'Corporate Governance & Shareholder Activism',
    desc: "CAMA 2020 implementation elevating derivative actions, minority shareholder relief and corporate governance disputes arising naturally from the Firm's transactional environment.",
  },
  {
    title: 'Fintech & Payments Sector Growth',
    desc: "Nigeria's digital payments market generating inter-operator disputes, regulatory enforcement actions and contractual claims — aligned with the Firm's existing OPay relationship.",
  },
  {
    title: 'Energy Sector Restructuring',
    desc: 'PIA 2021 transition generating disputes between operators, host communities and regulators across upstream, midstream and downstream segments — technically complex, premium-fee mandates.',
  },
];

const competitors = [
  {
    firm: 'Aluko & Oyebode',
    advantage:
      "JEE's IP-litigation anchored client base offers cross-sell into disputes; stronger international arbitration positioning via INSOL/LIDW network",
  },
  {
    firm: 'Banwo & Ighodalo',
    advantage:
      "JEE's INSOL Future Leader recognition and BRIPAN ecosystem differentiate in cross-border insolvency; stronger international referral architecture",
  },
  {
    firm: 'Aelex',
    advantage:
      "JEE's productised recovery solutions and portfolio management capability target a segment Aelex does not focus on",
  },
  {
    firm: 'Olaniwun Ajayi',
    advantage: "JEE's brand protection and IP anchor creates client loyalty across sectors not served by OA",
  },
  {
    firm: 'Templars',
    advantage: "JEE's INSOL and BRIPAN profile represent a credibility lever Templars does not hold in insolvency",
  },
];

const MarketAnalysisSlide = () => (
  <div id="market-analysis" className="w-full h-full relative overflow-hidden bg-[#F9F7ED] font-sans text-[#211B1B]">
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
        Market & Competitive Landscape
      </span>
    </div>

    <div className="absolute inset-0 top-28 left-12 right-12 bottom-10 z-20 grid grid-cols-12 gap-6">
      {/* Left: Market Drivers */}
      <div className="col-span-5 flex flex-col gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-[1px] w-8 bg-red-600" />
          <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">04</span>
        </div>
        <h2 className="text-xl font-black uppercase tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#211B1B] to-[#211B1B]/50">
          Market
          <br />
          <span className="text-red-600">Drivers</span>
        </h2>
        <div className="space-y-2 flex-1 overflow-y-auto">
          {drivers.map(({ title, desc }, i) => (
            <div key={i} className="flex gap-2 items-start border border-[#211B1B]/8 rounded-lg p-2.5">
              <div className="w-4 h-4 rounded-full bg-[#E80000]/10 border border-[#E80000]/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[7px] font-black text-[#E80000]">{i + 1}</span>
              </div>
              <div>
                <p className="font-black text-[#211B1B] text-[8px] mb-0.5">{title}</p>
                <p className="text-[#211B1B]/50 text-[7px] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Competitive Landscape */}
      <div className="col-span-7 flex flex-col gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-[1px] w-8 bg-red-600" />
          <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">04</span>
        </div>
        <h2 className="text-xl font-black uppercase tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#211B1B] to-[#211B1B]/50">
          Competitive
          <br />
          <span className="text-red-600">Positioning</span>
        </h2>
        <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden flex-1">
          <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[7px] font-black uppercase tracking-widest">
            <div className="col-span-4 px-3 py-2">Tier 1 Firm</div>
            <div className="col-span-8 px-3 py-2">JEE Competitive Advantage</div>
          </div>
          {competitors.map(({ firm, advantage }, i) => (
            <div
              key={i}
              className={`grid grid-cols-12 border-t border-[#211B1B]/8 ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}
            >
              <div className="col-span-4 px-3 py-2 font-black text-[#211B1B] text-[8px]">{firm}</div>
              <div className="col-span-8 px-3 py-2 text-[#211B1B]/55 text-[7px] leading-relaxed">{advantage}</div>
            </div>
          ))}
        </div>
        <div className="bg-[#E80000]/5 border border-[#E80000]/15 rounded-lg p-3">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#E80000] mb-1">
            JEE&apos;s Distinctive Position
          </p>
          <p className="text-[#211B1B]/60 text-justify text-[7px] leading-relaxed">
            JEE benefits from structural advantages: longstanding strength in Brand Protection and IP litigation;
            full-service sector teams; differentiated opportunity in fintech and payments-related disputes; and the IR3
            UK initiative providing an institutional framework for converting international relationships into mandates.
          </p>
        </div>
      </div>
    </div>

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(220,38,38,0.03)_0%,transparent_50%)] z-0" />
  </div>
);

export default MarketAnalysisSlide;
