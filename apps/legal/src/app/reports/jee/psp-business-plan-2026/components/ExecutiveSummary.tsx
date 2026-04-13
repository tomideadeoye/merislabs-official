'use client';

const BG = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

export const ExecutiveSummary = () => (
    <div id="executive-summary" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BG />
        <div className="flex items-center gap-4 mb-6 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
            <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">01</span>
            <h2 className="text-3xl font-serif font-black text-[#211B1B] uppercase">Executive Summary</h2>
        </div>
        <div className="relative z-10 flex flex-col gap-4 text-xs leading-relaxed">
            <p className="text-[#211B1B]/80 text-justify">
                <strong>Project Fortify</strong> is a 24-month growth plan for building Jackson, Etti &amp; Edu&apos;s Commercial Litigation &amp; Dispute Resolution (CLDR) practice into a more structured, visible and consistently revenue-generating platform. It is grounded in the conviction that the next phase of growth must be driven more deliberately and more commercially — moving from waiting for briefs to creating the conditions that make those briefs more likely to come to us, stay with us and grow with us.
            </p>

            <div className="bg-[#211B1B]/5 border-l-4 border-[#E80000] p-5 rounded-r-xl">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E80000] mb-1">Financial Target</p>
                <p className="text-[#211B1B] font-bold text-sm">USD 500,000 in annual attributable incremental revenue by end of the 24-month PSP cycle.</p>
                <p className="text-[#211B1B]/50 text-[10px] mt-1">Grounded in identifiable market drivers: banking sector stress, credit recovery, energy restructuring, fintech growth, and cross-border enforcement demand.</p>
            </div>

            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-3">Three Integrated Business Platforms</p>
                <div className="space-y-2">
                    {[
                        { n: '1', title: 'Institutional Debt Recovery, Insolvency & Enforcement', desc: 'Recurring mandates from financial institutions and corporates through structured recovery and enforcement solutions.' },
                        { n: '2', title: 'Commercial, Transactional & Shareholder Disputes', desc: 'Deepen wallet share from corporate clients by positioning CLDR as the first point of call when commercial tensions mature into disputes.' },
                        { n: '3', title: 'Domestic & International Arbitration & Cross-Border Enforcement', desc: 'Higher-value and foreign currency-denominated mandates through arbitral visibility, international relationships and cross-border enforcement capability.' },
                    ].map(({ n, title, desc }) => (
                        <div key={n} className="flex gap-3 items-start">
                            <div className="w-5 h-5 rounded-full bg-[#E80000]/10 border border-[#E80000]/30 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-[9px] font-black text-[#E80000]">{n}</span>
                            </div>
                            <div>
                                <p className="font-black text-[#211B1B] text-xs">{title}</p>
                                <p className="text-[#211B1B]/60 text-justify mt-0.5">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">Execution Workstreams</p>
                <div className="grid grid-cols-2 gap-2">
                    {['Productisation of dispute offerings', 'Targeted institutional engagement', 'Strategic thought leadership', 'Ecosystem & panel positioning', 'International referral development', 'Internal referral capture'].map((w) => (
                        <div key={w} className="flex gap-2 items-start">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#E80000] shrink-0"></div>
                            <p className="text-[#211B1B]/60 text-[10px]">{w}</p>
                        </div>
                    ))}
                </div>
            </div>

            <p className="italic text-[#211B1B]/50 text-[10px] border-t border-[#211B1B]/10 pt-4 text-justify">
                Project Fortify is more than a practice growth proposal. It is a structured commercial plan for building a stronger disputes platform within JEE — one that delivers more predictable revenue, enhances the Firm&apos;s standing in priority sectors, deepens institutional client relationships and positions JEE more competitively within the Nigerian and cross-border disputes market.
            </p>
        </div>
    </div>
);
