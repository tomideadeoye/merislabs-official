'use client';

const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

export const ExecutiveSummary = () => {
    const platforms = [
        'Institutional Debt Recovery, Insolvency & Enforcement Platform – drive recurring mandates from financial institutions and corporates by developing productised recovery solutions.',
        'Commercial, Transactional & Shareholder Disputes Platform – expand wallet share from corporate clients by positioning CLDR as the "first call" for commercial conflicts.',
        'Domestic and International Arbitration & Cross-Border Enforcement Platform – capture foreign currency mandates by deepening alliances with international law firms and securing arbitral panel appointments.',
    ];

    const workstreams = [
        'Productization of Services – fixed-fee dispute products (Bank Litigation Portfolio Audit, NPL Portfolio Audits, Garnishee Management Toolkits, Cross-Border Recovery Advisory).',
        'Targeted Client Engagement – pursue and convert at least 15 institutional relationships across Banking, Energy, and FMCG.',
        'Authority Positioning – launch the Strategic Debt Recovery & Governance Series and an Arbitration Series.',
        'Ecosystem Development – secure appointments to arbitral and insolvency panels and forge co-counsel alliances.',
        'Internal Revenue Capture – structured cross-selling with Corporate, Energy, and Finance teams.',
    ];

    return (
        <div id="executive-summary" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
            <BackgroundPattern />

            <div className="flex items-center gap-4 mb-6 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
                <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">01</span>
                <h2 className="text-3xl font-serif font-black text-[#211B1B] uppercase">EXECUTIVE SUMMARY</h2>
            </div>

            <div className="relative z-10 flex flex-col gap-4 text-sm leading-relaxed">
                <p className="text-[#211B1B]/80 text-justify">
                    <strong className="text-[#211B1B]">Project Fortify</strong> defines a commercially disciplined growth plan to establish Jackson, Etti &amp; Edu&apos;s Commercial Litigation &amp; Dispute Resolution (CLDR) practice as a standalone, revenue-producing business platform and a core contributor to the Firm&apos;s sector-focused strategy.
                </p>

                <div className="bg-[#211B1B]/5 border-l-4 border-[#E80000] p-5 rounded-r-xl">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E80000] mb-1">Financial Target</p>
                    <p className="text-[#211B1B] font-bold text-base">USD 500,000 in annual attributable revenue by end of the 24-month PSP cycle.</p>
                </div>

                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-3">Three Core Business Platforms</p>
                    <div className="space-y-2">
                        {platforms.map((p, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <div className="mt-1.5 w-5 h-5 rounded-full bg-[#E80000]/10 border border-[#E80000]/30 flex items-center justify-center shrink-0">
                                    <span className="text-[9px] font-black text-[#E80000]">{i + 1}</span>
                                </div>
                                <p className="text-[#211B1B]/80 text-justify text-xs leading-relaxed">{p}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-3">Execution Framework – Five Workstreams</p>
                    <div className="space-y-2">
                        {workstreams.map((w, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <div className="mt-1 w-2 h-2 rounded-full bg-[#E80000] shrink-0 mt-1.5"></div>
                                <p className="text-[#211B1B]/70 text-justify text-xs leading-relaxed">{w}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="italic text-[#211B1B]/50 text-xs border-t border-[#211B1B]/10 pt-4 text-justify">
                    At full deployment, Project Fortify will convert CLDR from a practice group into a repeatable business model — one that originates its own work, delivers predictable revenues, and cements JEE&apos;s position as a market leader in commercial litigation, arbitration, and enforcement.
                </p>
            </div>
        </div>
    );
};
