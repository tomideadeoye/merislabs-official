'use client';

const BG = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

const items = [
    { n: '1', item: 'Professional memberships & credentials', detail: 'INSOL, CIArb, NICArb, BRIPAN, CIBN, Young ICCA, ITA – membership subscriptions and annual dues', budget: '₦18–24M', owner: 'CPD / Professional Development' },
    { n: '2', item: 'Arbitral & insolvency panel registrations', detail: 'LCA, NICArb, NCIA, ICC Nigeria, BRIPAN insolvency panel – application fees and annual maintenance', budget: '₦4–7M', owner: 'CPD / Professional Development' },
    { n: '3', item: 'Commercial chamber memberships', detail: 'NACCIMA, LCCI, bilateral chambers – BNLF, NBCC, NBBC – annual subscriptions', budget: '₦10–14M', owner: 'Marketing / BD' },
    { n: '4', item: 'International conferences & travel', detail: 'LIDW ×2, London Arbitration Week, INSOL Global, ICC/CIArb forums – 4–5 trips over 24 months', budget: '₦28–45M', owner: 'Professional Development / BD' },
    { n: '5', item: 'Domestic conferences & events', detail: 'BRIPAN, NICArb, NBA-SBL, local forums – 8–10 engagements over 24 months', budget: '₦6–10M', owner: 'Professional Development / BD' },
    { n: '6', item: 'Thought leadership production & dissemination', detail: 'Design, Mondaq/platform fees, digital amplification, event materials, PR support', budget: '₦12–18M', owner: 'Marketing / BD' },
    { n: '7', item: 'Client-facing events & event sponsorship', detail: '2 major roundtables, webinar series, seminar materials, venue, AV, catering', budget: '₦15–22M', owner: 'Firm Events / Marketing' },
    { n: '8', item: 'Institutional client entertainment & relationship management', detail: 'Regular engagement across 15 target relationships — ₦300K–500K per month', budget: '₦10–15M', owner: 'Marketing / BD' },
    { n: '9', item: 'Team capability development', detail: 'CIArb Fellowship pathway ×1–2 members, BRIPAN programme, INSOL short courses, NICArb certification, internal training', budget: '₦12–18M', owner: 'CPD / Training' },
    { n: '10', item: 'Branded materials & capacity statement design', detail: '6 productised offerings, firm profile materials, event collateral, pitch materials', budget: '₦4–6M', owner: 'Marketing / BD' },
    { n: '11', item: 'BD pipeline tools & infrastructure', detail: 'CRM adaptation, pipeline tracking tool, opportunity management system', budget: '₦2–4M', owner: 'IT / Operations' },
    { n: '12', item: 'Digital presence & content amplification', detail: 'LinkedIn Premium, Mondaq subscription, platform distribution, digital outreach', budget: '₦3–6M', owner: 'Marketing / BD' },
    { n: '13', item: 'International travel documentation', detail: 'UK/Other country visa applications, biometrics, travel insurance across 24-month cycle', budget: '₦2–3M', owner: 'Professional Development' },
    { n: '14', item: 'Contingency (10% of base)', detail: 'FX volatility, event cost inflation, unplanned professional opportunities', budget: '₦13–19M', owner: 'Firm Reserve' },
];

const roiRows = [
    { item: 'Total proposed investment (24-month cycle)', figure: '₦139M – ₦211M' },
    { item: 'USD equivalent at ₦1,600/USD (conservative rate)', figure: 'USD 87,000 – USD 132,000' },
    { item: 'Year 2 target revenue', figure: 'USD 500,000 (≈ ₦800M+)' },
    { item: 'Revenue-to-investment ratio (mid-point)', figure: '~4.4x to ~6.0x' },
    { item: 'Net profit contribution at 20% margin', figure: 'USD 100,000 per annum at target' },
    { item: 'Payback period at Year 2 run rate', figure: '< 12 months' },
];

// Page 1 — rows 1–8
export const FinancialRequirements = () => (
    <div id="financial" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BG />
        <div className="flex items-center gap-4 mb-5 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
            <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">09</span>
            <div>
                <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">Financial Requirements</h2>
                <p className="text-xs text-[#211B1B]/40 uppercase tracking-widest mt-1">24-Month Investment Framework · ₦139M – ₦211M</p>
            </div>
        </div>
        <div className="relative z-10 flex flex-col gap-3">
            <p className="text-xs text-[#211B1B]/70 text-justify leading-relaxed">
                Project Fortify requires targeted and disciplined investment — not capital expenditure in the traditional sense, but investment in market visibility, specialist positioning, relationship development, capability-building and operational support.
            </p>
            <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[8px] font-black uppercase tracking-widest">
                    <div className="col-span-1 px-3 py-2">#</div>
                    <div className="col-span-4 px-3 py-2">Investment Line</div>
                    <div className="col-span-2 px-3 py-2 text-right">Budget (₦M)</div>
                    <div className="col-span-5 px-3 py-2">Budget Owner</div>
                </div>
                {items.slice(0, 8).map(({ n, item, detail, budget, owner }, i) => (
                    <div key={i} className={`grid grid-cols-12 border-t border-[#211B1B]/8 text-[9px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}>
                        <div className="col-span-1 px-3 py-2 font-black text-[#E80000]">{n}</div>
                        <div className="col-span-4 px-3 py-2">
                            <p className="font-bold text-[#211B1B]">{item}</p>
                            <p className="text-[#211B1B]/35 text-[8px] mt-0.5">{detail}</p>
                        </div>
                        <div className="col-span-2 px-3 py-2 text-right font-black text-[#E80000] flex items-center justify-end">{budget}</div>
                        <div className="col-span-5 px-3 py-2 text-[#211B1B]/50 flex items-center">{owner}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Page 2 — rows 9–14 + total
export const FinancialRequirementsContinued = () => (
    <div className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BG />
        <div className="flex items-center gap-3 mb-5 relative z-10">
            <div className="w-1 h-10 bg-[#E80000]"></div>
            <div>
                <p className="text-[9px] text-[#211B1B]/40 uppercase tracking-widest mb-0.5">Section 9 – Continued</p>
                <h2 className="text-xl font-serif font-black text-[#211B1B] uppercase">Financial Requirements</h2>
            </div>
        </div>
        <div className="relative z-10 flex flex-col gap-4">
            <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[8px] font-black uppercase tracking-widest">
                    <div className="col-span-1 px-3 py-2">#</div>
                    <div className="col-span-4 px-3 py-2">Investment Line</div>
                    <div className="col-span-2 px-3 py-2 text-right">Budget (₦M)</div>
                    <div className="col-span-5 px-3 py-2">Budget Owner</div>
                </div>
                {items.slice(8).map(({ n, item, detail, budget, owner }, i) => (
                    <div key={i} className={`grid grid-cols-12 border-t border-[#211B1B]/8 text-[9px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}>
                        <div className="col-span-1 px-3 py-2 font-black text-[#E80000]">{n}</div>
                        <div className="col-span-4 px-3 py-2">
                            <p className="font-bold text-[#211B1B]">{item}</p>
                            <p className="text-[#211B1B]/35 text-[8px] mt-0.5">{detail}</p>
                        </div>
                        <div className="col-span-2 px-3 py-2 text-right font-black text-[#E80000] flex items-center justify-end">{budget}</div>
                        <div className="col-span-5 px-3 py-2 text-[#211B1B]/50 flex items-center">{owner}</div>
                    </div>
                ))}
                <div className="grid grid-cols-12 bg-[#211B1B] border-t-2 border-[#E80000]">
                    <div className="col-span-5 px-3 py-3 text-white font-black text-[10px] uppercase tracking-widest">Total (24-Month Cycle)</div>
                    <div className="col-span-2 px-3 py-3 text-right text-[#E80000] font-black text-sm">₦139–211M</div>
                    <div className="col-span-5 px-3 py-3 text-white/30 text-[9px] flex items-center">~4–6x ROI at Year 2 target revenue of ₦800M+</div>
                </div>
            </div>
        </div>
    </div>
);

export const FinancialROI = () => (
    <div className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BG />
        <div className="flex items-center gap-3 mb-5 relative z-10">
            <div className="w-1 h-10 bg-[#E80000]"></div>
            <div>
                <p className="text-[9px] text-[#211B1B]/40 uppercase tracking-widest mb-0.5">Section 9 – Continued</p>
                <h2 className="text-xl font-serif font-black text-[#211B1B] uppercase">Investment Logic &amp; Return on Investment</h2>
            </div>
        </div>
        <div className="relative z-10 flex flex-col gap-5">
            <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 bg-[#211B1B]/5 text-[#211B1B]/40 text-[8px] font-black uppercase tracking-widest border-b border-[#211B1B]/8">
                    <div className="px-4 py-2.5">Item</div>
                    <div className="px-4 py-2.5 text-right">Figure</div>
                </div>
                {roiRows.map(({ item, figure }, i) => (
                    <div key={i} className={`grid grid-cols-2 border-t border-[#211B1B]/8 text-xs ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}>
                        <div className="px-4 py-3 text-[#211B1B]/65">{item}</div>
                        <div className="px-4 py-3 text-right font-black text-[#211B1B]">{figure}</div>
                    </div>
                ))}
            </div>

            <div className="bg-[#E80000]/5 border border-[#E80000]/15 rounded-lg p-5">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E80000] mb-2">Phasing Logic</p>
                <p className="text-[#211B1B]/70 text-justify leading-relaxed text-xs">
                    The investment must be phased and purposeful. Foundational items — capability materials, credentialing, thought leadership launch and early relationship development — should be prioritised in Phase 1 (Months 1–6). Broader market amplification, international engagement and expanded capability-building may be sequenced in line with pipeline traction and platform development through Phases 2 and 3.
                </p>
            </div>
        </div>
    </div>
);
