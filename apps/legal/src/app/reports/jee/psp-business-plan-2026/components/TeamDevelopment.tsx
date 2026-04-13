'use client';

const BG = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

const team = [
    { level: 'Partner Candidate', current: '1 (pending PSP)', target: '1', contribution: 'Origination, supervision, strategic mandates', priority: 'Candidate attains partnership through PSP.' },
    { level: 'Senior Associate', current: '2', target: '2', contribution: 'Primary billing layer; complex mandates; client-facing execution', priority: 'Identify 1–2 high-potential associates for SA elevation within 24 months.' },
    { level: 'Associate', current: '1', target: '4', contribution: 'Volume billing; portfolio management, enforcement, research', priority: 'Target: 2 new associates with insolvency/restructuring focus (Platform 1) and 1 with arbitration background (Platform 3).' },
    { level: 'Trainee Associate', current: '1', target: '2', contribution: 'Volume billing; portfolio management, enforcement, research', priority: 'Deliberate talent acquisition.' },
    { level: 'Arbitration Specialist', current: 'Developing', target: '1–2 experts', contribution: 'Higher-value arbitration and cross-border matters', priority: 'Build capacity through CIArb and NICArb programmes. Fund CIArb Fellowship application.' },
    { level: 'Litigation Officer / Paralegal', current: 'Existing', target: '1', contribution: 'Process work, enforcement execution, court filings; highest utilisation ratio', priority: 'Standardise functions through precedent bank. Reduce partner/SA time on process work.' },
];

export const TeamDevelopment = () => (
    <div id="team-development" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BG />
        <div className="flex items-center gap-4 mb-5 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
            <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">08</span>
            <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">Team Development &amp; Practice Capacity Plan</h2>
        </div>
        <div className="relative z-10 flex flex-col gap-4 text-xs leading-relaxed">
            <p className="text-[#211B1B]/70 text-justify">
                Project Fortify is designed not only to originate more disputes work, but to ensure the CLDR practice has the capacity, structure and internal depth required to deliver that work at a consistently high standard and to scale sustainably. The plan is designed not only to win work, but to build a more resilient institutional platform.
            </p>

            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">Team Architecture</p>
                <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[8px] font-black uppercase tracking-widest">
                        <div className="col-span-2 px-3 py-2">Level</div>
                        <div className="col-span-1 px-3 py-2">Now</div>
                        <div className="col-span-1 px-3 py-2">2028</div>
                        <div className="col-span-4 px-3 py-2">Revenue Contribution</div>
                        <div className="col-span-4 px-3 py-2">Development Priority</div>
                    </div>
                    {team.map(({ level, current, target, contribution, priority }, i) => (
                        <div key={i} className={`grid grid-cols-12 border-t border-[#211B1B]/8 text-[9px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}>
                            <div className="col-span-2 px-3 py-2.5 font-black text-[#211B1B]">{level}</div>
                            <div className="col-span-1 px-3 py-2.5 text-[#211B1B]/50">{current}</div>
                            <div className="col-span-1 px-3 py-2.5 font-black text-[#E80000]">{target}</div>
                            <div className="col-span-4 px-3 py-2.5 text-[#211B1B]/60 leading-relaxed">{contribution}</div>
                            <div className="col-span-4 px-3 py-2.5 text-[#211B1B]/60 leading-relaxed">{priority}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="border border-[#211B1B]/10 rounded-lg p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E80000] mb-2">Insolvency &amp; Restructuring Pathway</p>
                    <p className="text-[#211B1B]/60 leading-relaxed">Progression toward INSOL Fellowship via INSOL Global Insolvency Practice Course; BRIPAN Fellowship Programme; active participation in AMCON and NPL portfolio work to build creditor-side specialist recognition.</p>
                </div>
                <div className="border border-[#211B1B]/10 rounded-lg p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E80000] mb-2">Arbitration Pathway</p>
                    <p className="text-[#211B1B]/60 leading-relaxed">Progression toward CIArb Fellowship; continued participation in Young ICCA and ITA; pursuit of LCA and NICArb panel appointments; publication in international arbitration platforms to build inbound referral visibility.</p>
                </div>
            </div>

            <div className="bg-[#211B1B]/5 border border-[#211B1B]/10 rounded-lg p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-1">Team Leverage Target</p>
                <p className="text-[#211B1B]/70 leading-relaxed">At full staffing, the practice is expected to operate at an approximate associate-to-partner leverage ratio of 4:1 at current team size, moving toward 6:1 as the practice scales toward its 2028 target. Partner time concentrated on origination, client management and complex advocacy.</p>
            </div>
        </div>
    </div>
);
