'use client';

const BG = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

const kpis = [
    { category: 'Revenue', color: '#E80000', items: ['USD 300,000+ attributable revenue – Year 1', 'USD 500,000 attributable revenue – Year 2', 'Net profit margin ≥ 15% (Y1) → ≥ 20% (Y2)', 'Bad debt provision < 8% (Y1) → < 5% (Y2)', 'FX-denominated revenue USD 50,000+ (Y1) → USD 120,000+ (Y2)'] },
    { category: 'Mandates', color: '#211B1B', items: ['Platform 1: 4–6 new instructions (Y1) → 8–12 (Y2)', 'Platform 2: 3–5 new instructions (Y1) → 6–10 (Y2)', 'Platform 3: 1–2 new instructions (Y1) → 3–5 (Y2)'] },
    { category: 'Relationships', color: '#E80000', items: ['10+ active institutional relationships (Y1) → 15+ (Y2)', '1 MOU signed with international firm (Y1) → 2+ (Y2)', '2+ cross-practice referrals (Y1) → 4+ (Y2)'] },
    { category: 'Visibility', color: '#211B1B', items: ['4+ thought leadership pieces published (Y1) → 6+ (Y2)', '5+ conference/forum appearances (Y1) → 8+ (Y2)', '1+ speaking roles secured (Y1) → 2+ (Y2)'] },
    { category: 'Practice', color: '#E80000', items: ['All 4 productised offerings live by Month 3', '80%+ key associate retention rate', '1–2 associates with specialist credential pathway commenced (Y1) → 2–3 (Y2)'] },
];

export const SuccessFactors = () => (
    <div id="success-factors" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BG />
        <div className="flex items-center gap-4 mb-5 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
            <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">12</span>
            <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">Success Factors, KPIs &amp; Risk Register</h2>
        </div>
        <div className="relative z-10 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3">
                {kpis.map(({ category, color, items }) => (
                    <div key={category} className="flex gap-0 border border-[#211B1B]/10 rounded-lg overflow-hidden">
                        <div className="w-2 shrink-0" style={{ backgroundColor: color }} />
                        <div className="flex-1 p-3">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-2" style={{ color }}>{category}</p>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                                {items.map((kpi, j) => (
                                    <div key={j} className="flex gap-2 items-start">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color + '60' }}></div>
                                        <p className="text-[#211B1B]/65 text-[10px] leading-relaxed">{kpi}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const RiskRegister = () => {
    const risks = [
        { risk: 'Fee collection failure', likelihood: 'Medium', impact: 'High', level: 'HIGH', mitigation: 'Collection protocols in Section 11. Retainer structures for institutional clients. Monthly debtor review. Client creditworthiness screening at intake.' },
        { risk: 'Market competition intensifies', likelihood: 'Medium', impact: 'Medium', level: 'MEDIUM', mitigation: 'Differentiate through productised offerings, INSOL/BRIPAN credentialing. Target mid-tier banks and FMCG corporates underserved by larger firms.' },
        { risk: 'Court inefficiency impedes milestone billing', likelihood: 'High', impact: 'Medium', level: 'MEDIUM', mitigation: 'Prioritise arbitration and out-of-court settlement tracks. Milestone billing minimises dependency on court timetables.' },
        { risk: 'Talent attrition', likelihood: 'Medium', impact: 'Medium', level: 'MEDIUM', mitigation: 'Structured mentorship and development path. Team members named on key mandates. Engage HR committee on competitive compensation benchmarking.' },
        { risk: 'Slower international referral conversion', likelihood: 'Medium', impact: 'Medium', level: 'MEDIUM', mitigation: 'Formalise referral MOUs with at least 2 international firms by end of Year 1. Target smaller instructions first to build track record.' },
        { risk: 'Macroeconomic deterioration', likelihood: 'Low', impact: 'Medium', level: 'LOW-MED', mitigation: 'USD-denominated revenue provides partial hedge. Economic stress typically increases litigation and recovery volumes — CLDR is a counter-cyclical practice area.' },
    ];

    const levelColor = (level: string) => {
        if (level === 'HIGH') return '#E80000';
        if (level === 'MEDIUM') return '#211B1B';
        return '#211B1B';
    };

    return (
        <div id="risk-register" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
            <BG />
            <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="w-1 h-10 bg-[#E80000]"></div>
                <div>
                    <p className="text-[9px] text-[#211B1B]/40 uppercase tracking-widest mb-0.5">Section 12 – Continued</p>
                    <h2 className="text-xl font-serif font-black text-[#211B1B] uppercase">Risk Register</h2>
                </div>
            </div>
            <div className="relative z-10 flex flex-col gap-3">
                <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[8px] font-black uppercase tracking-widest">
                        <div className="col-span-3 px-3 py-2.5">Risk</div>
                        <div className="col-span-1 px-3 py-2.5">Likelihood</div>
                        <div className="col-span-1 px-3 py-2.5">Impact</div>
                        <div className="col-span-1 px-3 py-2.5">Level</div>
                        <div className="col-span-6 px-3 py-2.5">Mitigation Strategy</div>
                    </div>
                    {risks.map(({ risk, likelihood, impact, level, mitigation }, i) => (
                        <div key={i} className={`grid grid-cols-12 border-t border-[#211B1B]/8 text-[9px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}>
                            <div className="col-span-3 px-3 py-3 font-black text-[#211B1B]">{risk}</div>
                            <div className="col-span-1 px-3 py-3 text-[#211B1B]/50">{likelihood}</div>
                            <div className="col-span-1 px-3 py-3 text-[#211B1B]/50">{impact}</div>
                            <div className="col-span-1 px-3 py-3 font-black text-[10px]" style={{ color: levelColor(level) }}>{level}</div>
                            <div className="col-span-6 px-3 py-3 text-[#211B1B]/60 leading-relaxed">{mitigation}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
