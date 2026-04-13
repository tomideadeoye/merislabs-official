import { JEE_WEBSITE_URL } from '../../constants';

const items = [
  {
    n: '1',
    item: 'Professional memberships & credentials',
    detail: 'INSOL, CIArb, NICArb, BRIPAN, CIBN, Young ICCA, ITA',
    budget: '₦18–24M',
  },
  {
    n: '2',
    item: 'Arbitral & insolvency panel registrations',
    detail: 'LCA, NICArb, NCIA, ICC Nigeria, BRIPAN insolvency panel',
    budget: '₦4–7M',
  },
  {
    n: '3',
    item: 'Commercial chamber memberships',
    detail: 'NACCIMA, LCCI, bilateral chambers – BNLF, NBCC, NBBC',
    budget: '₦10–14M',
  },
  {
    n: '4',
    item: 'International conferences & travel',
    detail: 'LIDW ×2, London Arbitration Week, INSOL Global, ICC/CIArb forums',
    budget: '₦28–45M',
  },
  {
    n: '5',
    item: 'Domestic conferences & events',
    detail: 'BRIPAN, NICArb, NBA-SBL, local forums – 8–10 engagements',
    budget: '₦6–10M',
  },
  {
    n: '6',
    item: 'Thought leadership production & dissemination',
    detail: 'Design, Mondaq/platform fees, digital amplification, event materials',
    budget: '₦12–18M',
  },
  {
    n: '7',
    item: 'Client-facing events & event sponsorship',
    detail: '2 major roundtables, webinar series, seminar materials, venue, AV',
    budget: '₦15–22M',
  },
  {
    n: '8',
    item: 'Institutional client entertainment',
    detail: 'Regular engagement across 15 target relationships — ₦300K–500K/month',
    budget: '₦10–15M',
  },
  {
    n: '9',
    item: 'Team capability development',
    detail: 'CIArb Fellowship pathway, BRIPAN programme, INSOL short courses',
    budget: '₦12–18M',
  },
  {
    n: '10',
    item: 'Branded materials & capacity statement design',
    detail: '6 productised offerings, firm profile materials, event collateral',
    budget: '₦4–6M',
  },
  {
    n: '11',
    item: 'BD pipeline tools & infrastructure',
    detail: 'CRM adaptation, pipeline tracking tool, opportunity management system',
    budget: '₦2–4M',
  },
  {
    n: '12',
    item: 'Digital presence & content amplification',
    detail: 'LinkedIn Premium, Mondaq subscription, platform distribution',
    budget: '₦3–6M',
  },
  {
    n: '13',
    item: 'International travel documentation',
    detail: 'UK/Other country visa applications, biometrics, travel insurance',
    budget: '₦2–3M',
  },
  {
    n: '14',
    item: 'Contingency (10% of base)',
    detail: 'FX volatility, event cost inflation, unplanned opportunities',
    budget: '₦13–19M',
  },
];

const roiRows = [
  { item: 'Total proposed investment (24-month cycle)', figure: '₦139M – ₦211M' },
  { item: 'USD equivalent at ₦1,600/USD (conservative)', figure: 'USD 87,000 – USD 132,000' },
  { item: 'Year 2 target revenue', figure: 'USD 500,000 (≈ ₦800M+)' },
  { item: 'Revenue-to-investment ratio (mid-point)', figure: '~4.4x to ~6.0x' },
  { item: 'Net profit contribution at 20% margin', figure: 'USD 100,000 per annum at target' },
  { item: 'Payback period at Year 2 run rate', figure: '< 12 months' },
];

const FinancialSlide = () => (
  <div id="financial" className="w-full h-full relative overflow-hidden bg-[#F9F7ED] font-sans text-[#211B1B]">
    <div className="absolute top-10 left-12 right-12 z-50 flex items-center space-x-4 border-b border-[#211B1B]/10 pb-5">
      <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
        <img
          src="/clients/jackson etti and edu logo (1).png"
          alt="JEE"
          className="h-5 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
        />
      </a>
      <div className="h-3 w-px bg-[#211B1B]/20" />
      <span className="text-[#211B1B]/30 text-[9px] font-bold tracking-[0.4em] uppercase">Financial Requirements</span>
    </div>

    <div className="absolute inset-0 top-28 left-12 right-12 bottom-10 z-20 grid grid-cols-12 gap-6">
      {/* Left: Investment table */}
      <div className="col-span-7 flex flex-col gap-3">
        <div className="flex items-center space-x-3 mb-1">
          <div className="h-[1px] w-8 bg-red-600" />
          <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">
            09 · Investment Framework
          </span>
        </div>

        <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden flex-1">
          <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[7px] font-black uppercase tracking-widest">
            <div className="col-span-1 px-2 py-2">#</div>
            <div className="col-span-5 px-2 py-2">Investment Line</div>
            <div className="col-span-2 px-2 py-2 text-right">Budget (₦M)</div>
            <div className="col-span-4 px-2 py-2">Budget Owner</div>
          </div>
          {items.map(({ n, item, detail, budget }, i) => (
            <div
              key={i}
              className={`grid grid-cols-12 border-t border-[#211B1B]/8 text-[8px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}
            >
              <div className="col-span-1 px-2 py-2 font-black text-[#E80000]">{n}</div>
              <div className="col-span-5 px-2 py-2">
                <p className="font-bold text-[#211B1B]">{item}</p>
                <p className="text-[#211B1B]/35 text-[7px] mt-0.5">{detail}</p>
              </div>
              <div className="col-span-2 px-2 py-2 text-right font-black text-[#E80000] flex items-center justify-end">
                {budget}
              </div>
              <div className="col-span-4 px-2 py-2 text-[#211B1B]/50 flex items-center text-[7px]">
                {i === 0 && 'CPD / Professional Development'}
                {i === 1 && 'CPD / Professional Development'}
                {i === 2 && 'Marketing / BD'}
                {i === 3 && 'Professional Development / BD'}
                {i === 4 && 'Professional Development / BD'}
                {i === 5 && 'Marketing / BD'}
                {i === 6 && 'Firm Events / Marketing'}
                {i === 7 && 'Marketing / BD'}
                {i === 8 && 'CPD / Training'}
                {i === 9 && 'Marketing / BD'}
                {i === 10 && 'IT / Operations'}
                {i === 11 && 'Marketing / BD'}
                {i === 12 && 'Professional Development'}
                {i === 13 && 'Firm Reserve'}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-12 bg-[#211B1B] border-t-2 border-[#E80000]">
            <div className="col-span-5 px-2 py-2.5 text-white font-black text-[9px] uppercase tracking-widest">
              Total (24-Month Cycle)
            </div>
            <div className="col-span-2 px-2 py-2.5 text-right text-[#E80000] font-black text-xs">₦139–211M</div>
            <div className="col-span-5 px-2 py-2.5 text-white/30 text-[8px] flex items-center">
              ~4–6x ROI at Year 2 target
            </div>
          </div>
        </div>
      </div>

      {/* Right: ROI */}
      <div className="col-span-5 flex flex-col gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-[1px] w-8 bg-red-600" />
          <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">09 · ROI Analysis</span>
        </div>

        <div className="bg-[#211B1B] rounded-lg p-4 flex flex-col gap-2">
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-red-500">Revenue Target</p>
          <p className="text-white font-black text-2xl leading-tight">
            USD
            <br />
            500,000
          </p>
          <p className="text-white/30 text-[8px] uppercase tracking-widest">Annual · End of PSP cycle</p>
        </div>

        <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden flex-1">
          <div className="grid grid-cols-2 bg-[#211B1B]/5 text-[#211B1B]/40 text-[7px] font-black uppercase tracking-widest border-b border-[#211B1B]/8">
            <div className="px-3 py-2">Item</div>
            <div className="px-3 py-2 text-right">Figure</div>
          </div>
          {roiRows.map(({ item, figure }, i) => (
            <div
              key={i}
              className={`grid grid-cols-2 border-t border-[#211B1B]/8 text-[8px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}
            >
              <div className="px-3 py-2 text-[#211B1B]/65">{item}</div>
              <div className="px-3 py-2 text-right font-black text-[#211B1B]">{figure}</div>
            </div>
          ))}
        </div>

        <div className="border border-red-600/15 bg-red-600/5 rounded-lg p-3">
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-red-600 mb-1">ROI Rationale</p>
          <p className="text-[#211B1B]/60 text-justify text-[7px] leading-relaxed">
            A single institutional enforcement mandate or arbitration instruction routinely exceeds the total annual
            investment — making this a high-leverage, low-risk commercial proposition.
          </p>
        </div>
      </div>
    </div>

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(220,38,38,0.03)_0%,transparent_50%)] z-0" />
  </div>
);

export default FinancialSlide;
