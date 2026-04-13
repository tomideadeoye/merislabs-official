'use client';

const BG = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

const protocols = [
    { protocol: 'Client creditworthiness screening', detail: 'Financial and reputational due diligence on all new clients before engagement', outcome: 'Reduce write-off risk at intake' },
    { protocol: 'Engagement letter clarity', detail: 'All engagement letters to specify billing milestones, payment terms (30 days), interest on late payments and right to suspend services on non-payment', outcome: 'Contractual collection basis' },
    { protocol: 'Milestone billing for litigation', detail: 'Bill at defined procedural stages (pleadings complete, hearing concluded, award/judgment, enforcement) rather than accumulating open WIP', outcome: 'Reduce lock-up; eliminate silent write-offs' },
    { protocol: 'Retainer structures', detail: 'Negotiate annual or quarterly retainers with Tier-1 bank clients for recovery advisory services', outcome: 'Predictable inflows; < 5% bad debt target' },
    { protocol: 'Monthly WIP review', detail: 'HOD/Team Lead to review aged WIP and debtors monthly; escalate matters > 90 days unpaid', outcome: 'Active management; no silent write-offs' },
    { protocol: 'FX invoicing', detail: 'All international arbitration and cross-border mandates invoiced in USD; engagement letters to specify FX billing basis', outcome: 'Protects margin; reduces Naira erosion' },
];

export const Profitability = () => (
    <div id="profitability" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BG />
        <div className="flex items-center gap-4 mb-5 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
            <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">11</span>
            <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">Profitability, Leverage &amp; Fee Collection</h2>
        </div>
        <div className="relative z-10 flex flex-col gap-4 text-xs leading-relaxed">

            {/* Metrics table */}
            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">Profitability Context</p>
                <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-5 bg-[#211B1B] text-white text-[8px] font-black uppercase tracking-widest">
                        <div className="px-3 py-2.5">Metric</div>
                        <div className="px-3 py-2.5">2023</div>
                        <div className="px-3 py-2.5">2024</div>
                        <div className="px-3 py-2.5">2025 (10 mo.)</div>
                        <div className="px-3 py-2.5">Fortify Target</div>
                    </div>
                    {[
                        { metric: 'Revenue', v1: '₦695M', v2: '₦1,134M', v3: '₦934M (ann. ~₦1.12B)', target: '₦800M+ (CLDR-attributed)' },
                        { metric: 'Bad Debt Provision', v1: '4%', v2: '8%', v3: '17%', target: 'Target: < 5%' },
                        { metric: 'Personnel Cost', v1: '58%', v2: '52%', v3: '64%', target: 'Target: < 55%' },
                        { metric: 'Marketing / BD Spend', v1: '9%', v2: '12%', v3: '12%', target: 'Structured (see Section 9)' },
                        { metric: 'Net Profit Margin', v1: '-9%', v2: '7%', v3: '-14%', target: 'Target: ≥ 20%' },
                    ].map(({ metric, v1, v2, v3, target }, i) => (
                        <div key={i} className={`grid grid-cols-5 border-t border-[#211B1B]/8 text-[9px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}>
                            <div className="px-3 py-2.5 font-black text-[#211B1B]">{metric}</div>
                            <div className="px-3 py-2.5 text-[#211B1B]/50">{v1}</div>
                            <div className="px-3 py-2.5 text-[#211B1B]/50">{v2}</div>
                            <div className="px-3 py-2.5 text-[#211B1B]/50">{v3}</div>
                            <div className="px-3 py-2.5 font-black text-[#E80000]">{target}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Protocols */}
            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">Billing Discipline &amp; Fee Collection Protocols</p>
                <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[8px] font-black uppercase tracking-widest">
                        <div className="col-span-3 px-3 py-2">Protocol</div>
                        <div className="col-span-6 px-3 py-2">Detail</div>
                        <div className="col-span-3 px-3 py-2">Target Outcome</div>
                    </div>
                    {protocols.map(({ protocol, detail, outcome }, i) => (
                        <div key={i} className={`grid grid-cols-12 border-t border-[#211B1B]/8 text-[9px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}>
                            <div className="col-span-3 px-3 py-2.5 font-black text-[#211B1B]">{protocol}</div>
                            <div className="col-span-6 px-3 py-2.5 text-[#211B1B]/60 leading-relaxed">{detail}</div>
                            <div className="col-span-3 px-3 py-2.5 text-[#211B1B]/60 leading-relaxed">{outcome}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
