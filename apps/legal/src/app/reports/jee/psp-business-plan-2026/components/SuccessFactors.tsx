'use client';

const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

export const SuccessFactors = () => {
    const categories = [
        {
            title: 'Financial Outcome',
            color: '#E80000',
            kpis: [
                'Progressive growth toward USD 500,000 annual attributable revenue by end of 24-month PSP cycle.',
                'Consistent increase in CLDR-originated fee income year-on-year.',
            ],
        },
        {
            title: 'Client Development',
            color: '#211B1B',
            kpis: [
                'Active relationships with ≥5 financial institutions.',
                '≥10 active dispute relationships across target segments.',
                'Expanded CLDR client base across Banking, Energy, and FMCG.',
            ],
        },
        {
            title: 'Mandate Generation',
            color: '#E80000',
            kpis: [
                '1–2 institutional enforcement/recovery mandates annually.',
                '1–2 commercial dispute mandates annually.',
                '1–2 arbitration/cross-border mandates annually.',
            ],
        },
        {
            title: 'Market Positioning',
            color: '#211B1B',
            kpis: [
                'Active ecosystem participation across INSOL, NICArb, BRIPAN, LIDW.',
                'Structured thought leadership series launched and sustained.',
                'Increased CLDR visibility in priority sectors.',
            ],
        },
        {
            title: 'Practice Development',
            color: '#E80000',
            kpis: [
                'Productised dispute offerings developed and promoted.',
                '≥2 cross-practice referrals annually.',
                'CLDR established as a recognised internal platform for dispute origination.',
            ],
        },
    ];

    return (
        <div id="success-factors" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
            <BackgroundPattern />

            <div className="flex items-center gap-4 mb-6 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
                <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">06</span>
                <div>
                    <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">Success Factors &amp; KPIs</h2>
                    <p className="text-xs text-[#211B1B]/40 uppercase tracking-widest mt-1">Measuring Project Fortify Performance</p>
                </div>
            </div>

            <div className="relative z-10 flex flex-col gap-4">
                <p className="text-xs text-[#211B1B]/70 text-justify leading-relaxed">
                    Achievement of the following metrics will validate a scalable disputes business model and demonstrate the commercial case for partnership. Each category reflects a distinct dimension of Project Fortify&apos;s success.
                </p>

                <div className="grid grid-cols-1 gap-4">
                    {categories.map(({ title, color, kpis }, i) => (
                        <div key={i} className="flex gap-0 border border-[#211B1B]/10 rounded-lg overflow-hidden">
                            <div
                                className="w-2 shrink-0"
                                style={{ backgroundColor: color }}
                            />
                            <div className="flex-1 p-4">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-2" style={{ color }}>
                                    {title}
                                </p>
                                <div className="grid grid-cols-1 gap-1.5">
                                    {kpis.map((kpi, j) => (
                                        <div key={j} className="flex gap-2.5 items-start">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color + '60' }}></div>
                                            <p className="text-[#211B1B]/70 text-xs leading-relaxed">{kpi}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-[#211B1B] rounded-lg p-5 mt-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#E80000] mb-2">Summary Outcome</p>
                    <p className="text-white/70 text-xs text-justify leading-relaxed">
                        Achievement of these metrics will validate a scalable disputes business model — one that originates its own work, delivers predictable revenues, and cements JEE&apos;s position as a market leader in commercial litigation, arbitration, and enforcement across Nigeria and beyond.
                    </p>
                </div>
            </div>
        </div>
    );
};
