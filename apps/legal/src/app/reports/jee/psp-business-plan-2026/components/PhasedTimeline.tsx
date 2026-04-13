'use client';

const BG = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

export const PhasedTimeline = () => (
    <div id="phased-timeline" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BG />
        <div className="flex items-center gap-4 mb-5 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
            <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">13</span>
            <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">Phased Implementation Timeline</h2>
        </div>
        <div className="relative z-10 flex flex-col gap-4 text-xs leading-relaxed">
            {[
                {
                    phase: 'Phase 1 – Foundation', period: 'Months 1–6 · April–September 2026', color: '#E80000',
                    objective: 'Build the infrastructure. Establish products, launch thought leadership, commence institutional engagement, formalise co-counsel relationships.',
                    milestones: [
                        { when: 'Apr–May', what: 'Draft and finalise all 4 capacity statements for productised offerings', outcome: 'Print versions ready for institutional meetings' },
                        { when: 'Apr–May', what: 'Commission first Strategic Debt Recovery & Insolvency/Arbitration Series article', outcome: 'Mondaq/Relevant Blog submission by end of May 2026' },
                        { when: 'May', what: 'Confirm LIDW attendance; prepare JEE CLDR capability note for international distribution', outcome: 'Capability note circulated to minimum 15 international contacts at LIDW' },
                        { when: 'May–Jun', what: 'Identify and prioritise 15 target institutional relationships; schedule first 3 introductory meetings', outcome: '3 institutional meetings held by end of June 2026' },
                        { when: 'Jun–Jul', what: 'Formalise referral MOU with at least 1 UK disputes firm', outcome: 'Signed MOU or referral letter of intent by July 2026' },
                        { when: 'Sep', what: 'Phase 1 Review: ≥3 institutional meetings; 1 mandate instruction; 2 TL pieces published; 1 MOU signed', outcome: 'If below targets, rebalance WS4 and WS1 activity before Phase 2' },
                    ],
                },
                {
                    phase: 'Phase 2 – Acceleration', period: 'Months 7–18 · October 2026–September 2027', color: '#211B1B',
                    objective: 'Convert pipeline to mandates. Deepen institutional relationships. Build arbitration profile. Achieve Year 1 revenue milestone (USD 230,000+).',
                    milestones: [
                        { when: 'Q4 2026', what: 'Secure 2nd institutional recovery mandate; commence NPL portfolio audit for first bank client', outcome: '₦20M+ in fees billed or in instruction' },
                        { when: 'Q4 2026', what: 'Attend London Arbitration Week / INSOL Global; apply for LCA / NICArb panel appointment', outcome: 'Panel application submitted; 1 referral conversation active' },
                        { when: 'Q1 2027', what: 'Mid-programme revenue review: USD 100,000+ billed or in advanced mandate stage', outcome: 'If tracking below, accelerate Platform 1 institutional outreach' },
                        { when: 'Q3 2027', what: 'Receive first referral instruction from international co-counsel partner', outcome: 'FX-denominated mandate instruction or term sheet in progress' },
                    ],
                },
                {
                    phase: 'Phase 3 – Consolidation', period: 'Months 19–24 · October 2027–March 2028', color: '#E80000',
                    objective: 'Achieve USD 500,000 annual run rate. Institutionalise the platform. Demonstrate scalability beyond the candidate.',
                    milestones: [
                        { when: 'Q4 2027', what: '3 simultaneous active mandates across at least 2 platforms; first success-fee recovery generated (Platform 1)', outcome: 'USD 350,000+ cumulative revenue achieved' },
                        { when: 'Q1 2028', what: 'Annual review meetings with all 5+ active bank relationships; present annual CLDR capability update', outcome: 'At least 1 expanded mandate instruction from existing institutional client' },
                        { when: 'Q2 2028', what: 'Final PSP review: USD 500,000 annual attributable revenue achieved; CLDR functioning as self-sustaining origination platform', outcome: 'Platform operating on a recurring pipeline rather than one-off mandates' },
                    ],
                },
            ].map(({ phase, period, color, objective, milestones }) => (
                <div key={phase} className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: color }}>
                        <p className="text-white font-black text-xs uppercase tracking-wide">{phase}</p>
                        <p className="text-white/50 text-[9px] font-bold uppercase tracking-widest">{period}</p>
                    </div>
                    <div className="px-4 py-2 bg-[#211B1B]/3 border-b border-[#211B1B]/8">
                        <p className="text-[9px] text-[#211B1B]/60 italic">{objective}</p>
                    </div>
                    <div className="divide-y divide-[#211B1B]/5">
                        {milestones.map(({ when, what, outcome }, i) => (
                            <div key={i} className="grid grid-cols-12 text-[9px]">
                                <div className="col-span-1 px-3 py-2 font-black text-[#211B1B]/30 shrink-0">{when}</div>
                                <div className="col-span-7 px-3 py-2 text-[#211B1B]/65 leading-relaxed">{what}</div>
                                <div className="col-span-4 px-3 py-2 text-[#211B1B]/45 leading-relaxed italic">{outcome}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);
