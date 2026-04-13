'use client';

const BG = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

export const InternationalReferral = () => (
    <div id="international-referral" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BG />
        <div className="flex items-center gap-4 mb-6 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
            <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">07</span>
            <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">International Referral Architecture</h2>
        </div>
        <div className="relative z-10 flex flex-col gap-4 text-xs leading-relaxed">
            <p className="text-[#211B1B]/80 text-justify">
                A central component of Project Fortify is the development of a more deliberate international referral architecture aimed at increasing the CLDR practice&apos;s capacity to attract foreign currency-denominated work. A significant proportion of higher-value arbitration and cross-border disputes involving Nigerian parties originates through international law firms that require trusted Nigerian co-counsel. Project Fortify is intended to position JEE more deliberately within that referral chain.
            </p>

            <div className="bg-[#211B1B]/5 border-l-4 border-[#E80000] p-4 rounded-r-xl">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E80000] mb-1">IR3 UK Initiative</p>
                <p className="text-[#211B1B]/70 text-justify">
                    Led by the candidate, the IR3 UK initiative is a structured international referrals strategy focused on deepening relationships with selected UK and international law firms and converting those relationships into Nigerian mandates and sustained engagements. It provides the institutional framework for converting international relationships into mandates.
                </p>
            </div>

            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-3">Three Foundations of the Referral Architecture</p>
                <div className="space-y-3">
                    {[
                        { n: '1', title: 'Existing & Developing International Relationships', desc: 'Contacts cultivated through LIDW, London Arbitration Week, INSOL International Conference and related engagements. Reinforced by the IR3 UK initiative through structured relationship development, opportunity identification, follow-up and conversion.' },
                        { n: '2', title: 'Specialist Arbitration Visibility & Credibility', desc: 'Strengthening through targeted professional participation, credentials (CIArb Fellowship, NICArb, LCA panel appointments) and thought leadership published on international platforms (Kluwer, CIArb journals).' },
                        { n: '3', title: 'Clear Capability Materials & Referral Structures', desc: 'Dedicated international disputes capability note for the CLDR practice, targeted circulation in relevant forums, and development of referral understandings with selected international firms where there is sufficient alignment in trust, market focus and opportunity.' },
                    ].map(({ n, title, desc }) => (
                        <div key={n} className="flex gap-4 items-start border border-[#211B1B]/8 rounded-lg p-4">
                            <div className="w-6 h-6 rounded-full bg-[#E80000]/10 border border-[#E80000]/20 flex items-center justify-center shrink-0">
                                <span className="text-[9px] font-black text-[#E80000]">{n}</span>
                            </div>
                            <div>
                                <p className="font-black text-[#211B1B] text-xs mb-1">{title}</p>
                                <p className="text-[#211B1B]/60 text-justify">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-1">
                {[
                    { label: 'Target Firms', value: 'Magic Circle & Silver Circle; INSOL network; LIDW contacts' },
                    { label: 'Year 1 Target', value: '1 MOU signed with UK disputes firm' },
                    { label: 'Year 2 Target', value: '2+ MOUs; first FX-denominated referral instruction' },
                ].map(({ label, value }) => (
                    <div key={label} className="border border-[#211B1B]/10 rounded-lg p-3">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#211B1B]/30 mb-1">{label}</p>
                        <p className="text-[10px] font-bold text-[#211B1B]">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
