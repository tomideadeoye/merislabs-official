'use client';

const BG = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

const objectives = [
    { n: '1', obj: 'Transform the CLDR practice into a more structured, proactive and client-originating disputes platform.' },
    { n: '2', obj: 'Build three commercially coherent and mutually reinforcing disputes platforms within the practice.' },
    { n: '3', obj: 'Strengthen the Firm\'s visibility, credibility and competitive positioning through clearer offerings, thought leadership, ecosystem engagement and specialist credentialing.' },
    { n: '4', obj: 'Deepen institutional client relationships and expand the Firm\'s capture of disputes mandates from existing and prospective clients.' },
    { n: '5', obj: 'Improve internal alignment between CLDR and the Firm\'s sector teams so that dispute risks are identified earlier and mandates are retained more consistently.' },
    { n: '6', obj: 'Develop a more visible and credible platform for higher-value arbitration and cross-border work, including foreign currency-denominated mandates.' },
    { n: '7', obj: 'Generate USD 500,000 in annual attributable incremental revenue by the end of the 24-month Partnership Selection Programme cycle.' },
];

export const StrategicObjectives = () => (
    <div id="strategic-objectives" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BG />
        <div className="flex items-center gap-4 mb-6 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
            <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">05</span>
            <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">Strategic Objectives</h2>
        </div>
        <div className="relative z-10 flex flex-col gap-3 text-xs leading-relaxed">
            <p className="text-[#211B1B]/70 text-justify mb-2">
                Project Fortify is designed to achieve a set of interrelated strategic objectives that strengthen the CLDR practice as both a revenue-generating business platform and a core component of the Firm&apos;s wider sector-focused strategy.
            </p>
            <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[8px] font-black uppercase tracking-widest">
                    <div className="col-span-1 px-4 py-2.5">#</div>
                    <div className="col-span-11 px-4 py-2.5">Objective</div>
                </div>
                {objectives.map(({ n, obj }, i) => (
                    <div key={i} className={`grid grid-cols-12 border-t border-[#211B1B]/8 ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}>
                        <div className="col-span-1 px-4 py-4 font-black text-[#E80000] text-sm">{n}</div>
                        <div className="col-span-11 px-4 py-4 text-[#211B1B]/75 text-xs leading-relaxed">{obj}</div>
                    </div>
                ))}
            </div>
            <div className="bg-[#211B1B] rounded-lg p-5 mt-2">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E80000] mb-2">Strategic Outcome</p>
                <p className="text-white/70 text-justify leading-relaxed">
                    At full deployment, Project Fortify will convert CLDR from a practice group into a repeatable business model — one that originates its own work, delivers predictable revenues, and cements JEE&apos;s position as a market leader in commercial litigation, arbitration, and enforcement across Nigeria and beyond.
                </p>
            </div>
        </div>
    </div>
);
