'use client';

const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

export const Conclusion = () => {
    const pillars = [
        { label: 'Structured Offerings', desc: 'Productised dispute services that articulate the Firm\'s capabilities and convert conversations into mandates.' },
        { label: 'Thought Leadership', desc: 'A sustained knowledge platform that positions JEE as the authority in debt recovery, insolvency, and arbitration.' },
        { label: 'Ecosystem Engagement', desc: 'Active participation in professional networks that generate referrals and cross-border opportunities.' },
        { label: 'Targeted Relationships', desc: 'A disciplined pipeline of institutional client relationships across Banking, Energy, and FMCG.' },
        { label: 'Cross-Practice Collaboration', desc: 'Internal referral capture that retains dispute mandates originating from the Firm\'s transactional work.' },
    ];

    return (
        <div id="conclusion" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
            <BackgroundPattern />

            <div className="flex items-center gap-4 mb-6 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
                <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">07</span>
                <div>
                    <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">Conclusion</h2>
                    <p className="text-xs text-[#211B1B]/40 uppercase tracking-widest mt-1">Commitment to Firm Growth</p>
                </div>
            </div>

            <div className="relative z-10 flex flex-col gap-5 text-xs leading-relaxed">
                <p className="text-[#211B1B]/80 text-justify text-sm leading-relaxed">
                    Project Fortify offers a clear, executable blueprint to strengthen JEE&apos;s CLDR practice, broaden its institutional client base, and build a sustainable mandate pipeline.
                </p>

                <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#211B1B]/40 mb-3">Five Integrated Pillars of Execution</p>
                    <div className="space-y-3">
                        {pillars.map(({ label, desc }, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="w-6 h-6 rounded-full bg-[#E80000]/10 border border-[#E80000]/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-[9px] font-black text-[#E80000]">{i + 1}</span>
                                </div>
                                <div>
                                    <p className="font-black text-[#211B1B] text-xs">{label}</p>
                                    <p className="text-[#211B1B]/60 text-justify mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#211B1B]/5 border-l-4 border-[#E80000] p-6 rounded-r-xl">
                    <p className="text-[#211B1B]/80 text-justify leading-relaxed">
                        This strategy aligns fully with the Firm&apos;s sector-driven vision and equips clients to navigate complex commercial, arbitration, and enforcement challenges. More importantly, it reflects a deep commitment to JEE&apos;s long-term success.
                    </p>
                </div>

                <p className="text-[#211B1B]/70 text-justify leading-relaxed">
                    Through the Partnership Selection Programme, I am eager to drive Project Fortify forward and contribute as a partner in building a leading commercial disputes platform within the Firm.
                </p>

                {/* Signature block */}
                <div className="mt-6 pt-6 border-t border-[#211B1B]/10 flex items-end justify-between">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#211B1B]/30 mb-1">Submitted by</p>
                        <p className="font-serif font-black text-base text-[#211B1B]">Senior Associate, CLDR</p>
                        <p className="text-xs text-[#211B1B]/50">Jackson, Etti &amp; Edu</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#211B1B]/30 mb-1">Date</p>
                        <p className="font-serif font-black text-base text-[#211B1B]">March 2026</p>
                        <p className="text-xs text-[#211B1B]/50">Partnership Selection Programme</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
