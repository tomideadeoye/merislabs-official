'use client';

const BG = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

const platforms = [
    {
        platform: 'Platform 1 — Institutional Debt Recovery, Insolvency & Enforcement',
        color: '#E80000',
        rows: [
            { type: 'NPL portfolio recovery mandates / Receivership / insolvency appointments', matters: '3–4', fee: 'USD 15,000–25,000', revenue: 'USD 45,000–100,000' },
            { type: 'Enforcement & collateral realisation matters', matters: '2–3', fee: 'USD 10,000–15,000', revenue: 'USD 20,000–45,000' },
            { type: 'Creditor advisory / restructuring retainers', matters: '2–4', fee: 'USD 8,000–12,000', revenue: 'USD 16,000–36,000' },
        ],
        total: 'USD 81,000–193,000',
    },
    {
        platform: 'Platform 2 — Commercial, Transactional & Shareholder Disputes',
        color: '#211B1B',
        rows: [
            { type: 'Commercial contract disputes (corporate clients)', matters: '4–8', fee: 'USD 15,000–25,000', revenue: 'USD 60,000–200,000' },
            { type: 'Shareholder / corporate governance disputes', matters: '1–2', fee: 'USD 5,000–15,000', revenue: 'USD 5,000–30,000' },
            { type: 'Cross-practice referral mandates (internal)', matters: '2–3', fee: 'USD 10,000–15,000', revenue: 'USD 20,000–45,000' },
        ],
        total: 'USD 85,000–275,000',
    },
    {
        platform: 'Platform 3 — Domestic & International Arbitration & Cross-Border Enforcement',
        color: '#E80000',
        rows: [
            { type: 'International arbitration (co-counsel / referral)', matters: '1–2', fee: 'USD 15,000–50,000', revenue: 'USD 15,000–100,000' },
            { type: 'Domestic arbitration (NCIA / LCA panel matters)', matters: '2–4', fee: 'USD 10,000–30,000', revenue: 'USD 20,000–120,000' },
            { type: 'Cross-border award enforcement', matters: '1–2', fee: 'USD 10,000–25,000', revenue: 'USD 10,000–50,000' },
        ],
        total: 'USD 45,000–270,000',
    },
];

const PlatformTable = ({ platform, color, rows, total }: typeof platforms[0]) => (
    <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 text-white text-[9px] font-black uppercase tracking-wide" style={{ backgroundColor: color }}>{platform}</div>
        <div className="grid grid-cols-12 bg-[#211B1B]/5 text-[#211B1B]/40 text-[8px] font-black uppercase tracking-widest border-b border-[#211B1B]/8">
            <div className="col-span-5 px-4 py-2">Mandate Type</div>
            <div className="col-span-2 px-4 py-2">Est. Matters</div>
            <div className="col-span-2 px-4 py-2">Avg. Fee</div>
            <div className="col-span-3 px-4 py-2 text-right">Platform Revenue</div>
        </div>
        {rows.map(({ type, matters, fee, revenue }, i) => (
            <div key={i} className={`grid grid-cols-12 border-t border-[#211B1B]/8 text-[9px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}>
                <div className="col-span-5 px-4 py-2 text-[#211B1B]/70">{type}</div>
                <div className="col-span-2 px-4 py-2 text-[#211B1B]/50">{matters}</div>
                <div className="col-span-2 px-4 py-2 text-[#211B1B]/50">{fee}</div>
                <div className="col-span-3 px-4 py-2 text-right font-black text-[#211B1B]">{revenue}</div>
            </div>
        ))}
        <div className="grid grid-cols-12 border-t border-[#211B1B]/20 bg-[#211B1B]/5">
            <div className="col-span-9 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-[#211B1B]/40">Platform Total</div>
            <div className="col-span-3 px-4 py-2 text-right font-black text-xs" style={{ color }}>{total}</div>
        </div>
    </div>
);

// Page 1 — Platform breakdowns
export const RevenueModel = () => (
    <div id="revenue-model" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BG />
        <div className="flex items-center gap-4 mb-5 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
            <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">10</span>
            <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">Bottom-Up Revenue Model &amp; Financial Projections</h2>
        </div>
        <div className="relative z-10 flex flex-col gap-3 text-xs leading-relaxed">
            <p className="text-[#211B1B]/70 text-justify">
                The revenue ambition is anchored in the practice&apos;s existing active mandate base — including the ongoing AMCON debt recovery portfolio, three high-value USD-denominated enforcement matters, and arbitration matters positioned to progress to award and enforcement stage.
            </p>
            {platforms.map((p) => <PlatformTable key={p.platform} {...p} />)}
        </div>
    </div>
);

// Page 2 — Consolidated projection + fee structure
export const RevenueModelContinued = () => (
    <div className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BG />
        <div className="flex items-center gap-3 mb-5 relative z-10">
            <div className="w-1 h-10 bg-[#E80000]"></div>
            <div>
                <p className="text-[9px] text-[#211B1B]/40 uppercase tracking-widest mb-0.5">Section 10 – Continued</p>
                <h2 className="text-xl font-serif font-black text-[#211B1B] uppercase">Consolidated Revenue Projection &amp; Fee Structure</h2>
            </div>
        </div>
        <div className="relative z-10 flex flex-col gap-5 text-xs">
            {/* Consolidated */}
            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">Consolidated Revenue Projection</p>
                <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[8px] font-black uppercase tracking-widest">
                        <div className="col-span-4 px-4 py-2.5">Platform</div>
                        <div className="col-span-3 px-4 py-2.5">Year 1 Conservative</div>
                        <div className="col-span-3 px-4 py-2.5">Year 2 Target</div>
                        <div className="col-span-2 px-4 py-2.5">Year 2 Stretch</div>
                    </div>
                    {[
                        { p: 'Platform 1 — Recovery & Enforcement', y1: 'USD 100,000', y2: 'USD 220,000', stretch: 'USD 300,000' },
                        { p: 'Platform 2 — Commercial & Shareholder', y1: 'USD 80,000', y2: 'USD 160,000', stretch: 'USD 220,000' },
                        { p: 'Platform 3 — Arbitration & Cross-Border', y1: 'USD 50,000', y2: 'USD 120,000', stretch: 'USD 200,000' },
                    ].map(({ p, y1, y2, stretch }, i) => (
                        <div key={i} className={`grid grid-cols-12 border-t border-[#211B1B]/8 text-[9px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}>
                            <div className="col-span-4 px-4 py-2.5 font-bold text-[#211B1B]">{p}</div>
                            <div className="col-span-3 px-4 py-2.5 text-[#211B1B]/60">{y1}</div>
                            <div className="col-span-3 px-4 py-2.5 font-black text-[#E80000]">{y2}</div>
                            <div className="col-span-2 px-4 py-2.5 text-[#211B1B]/50">{stretch}</div>
                        </div>
                    ))}
                    <div className="grid grid-cols-12 border-t-2 border-[#E80000] bg-[#211B1B]">
                        <div className="col-span-4 px-4 py-3 text-white font-black text-[10px] uppercase tracking-widest">TOTAL</div>
                        <div className="col-span-3 px-4 py-3 text-white/60 font-black text-[10px]">USD 230,000</div>
                        <div className="col-span-3 px-4 py-3 text-[#E80000] font-black text-[10px]">USD 500,000</div>
                        <div className="col-span-2 px-4 py-3 text-white/40 font-black text-[10px]">USD 720,000</div>
                    </div>
                </div>
            </div>

            {/* Fee Structure */}
            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">Fee Structure by Platform</p>
                <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[8px] font-black uppercase tracking-widest">
                        <div className="col-span-2 px-4 py-2.5">Platform</div>
                        <div className="col-span-3 px-4 py-2.5">Primary Fee Structure</div>
                        <div className="col-span-4 px-4 py-2.5">Secondary / Supplementary</div>
                        <div className="col-span-3 px-4 py-2.5">Rationale</div>
                    </div>
                    {[
                        { p: 'Platform 1', primary: 'Fixed fee per portfolio tier (productised)', secondary: 'Success fee (5–15% of recovery) for key mandates', rationale: 'Predictable revenue flow; aligns incentives with banks\' recovery outcomes' },
                        { p: 'Platform 2', primary: 'Hourly / blended rate for litigation', secondary: 'Retainer for ongoing advisory relationships', rationale: 'Matches complexity billing; retainers provide pipeline visibility' },
                        { p: 'Platform 3', primary: 'USD-denominated hourly / lump sum', secondary: 'Co-counsel fee-split arrangements', rationale: 'FX protection and international rate parity; referral arrangements formalise pipeline' },
                    ].map(({ p, primary, secondary, rationale }, i) => (
                        <div key={i} className={`grid grid-cols-12 border-t border-[#211B1B]/8 text-[9px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}>
                            <div className="col-span-2 px-4 py-3 font-black text-[#E80000]">{p}</div>
                            <div className="col-span-3 px-4 py-3 text-[#211B1B]/70 leading-relaxed">{primary}</div>
                            <div className="col-span-4 px-4 py-3 text-[#211B1B]/60 leading-relaxed">{secondary}</div>
                            <div className="col-span-3 px-4 py-3 text-[#211B1B]/55 leading-relaxed">{rationale}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
