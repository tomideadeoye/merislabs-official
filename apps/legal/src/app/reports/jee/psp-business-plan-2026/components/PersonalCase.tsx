'use client';

const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

export const PersonalCase = () => {
    const achievements = [
        { label: 'High-Value Arbitration', value: 'Led a complex arbitration producing a US$9.7 million award and successful enforcement, demonstrating capability in managing high-stakes, cross-border disputes.' },
        { label: 'Institutional Recoveries', value: '₦5 billion in recoveries for Tier-1 financial institutions, providing a foundation for building strong creditor-side mandates at JEE.' },
        { label: 'Premium Fee Realisation', value: 'Negotiated and secured an ₦80 million professional fee in the Emple mandate, exceeding co-counsel\'s billing by approximately ₦20 million.' },
        { label: 'Strategic Client Transformation', value: 'Repositioned the Firm\'s relationship with OPay from routine garnishee proceedings to multi-party commercial disputes against Moniepoint and FairMoney.' },
    ];

    const positioning = [
        'Active membership: INSOL International, BRIPAN, NICArb, ICMC, Young ICCA, ITA, NBA-SBL.',
        'Recognised as an INSOL Future Leader of Nigeria and recipient of an Award of Excellence from NICArb for contributions to debt recovery, insolvency, and arbitration.',
        'Appointed Arbitrator on a ₦170 million three-member tribunal alongside Senior Advocates of Nigeria.',
        'Active participation in London International Disputes Week (LIDW) with relationships across Magic Circle and Silver Circle firms.',
    ];

    const institutional = [
        'Mentorship & Capacity Development: Technical and strategic training to CLDR associates on commercial arbitration and enforcement.',
        'Committee Service: Member of the Editorial Board; active in Graduate & Associate Recruitment and Human Resources Committees.',
        'Cross-Practice Engagement: Close collaboration with Corporate, Finance, and Energy teams to identify dispute risks from transactions.',
        'Thought Leadership: Contributions to Firm knowledge products and client alerts functioning as lead-generation tools.',
    ];

    return (
        <div id="personal-case" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
            <BackgroundPattern />

            <div className="flex items-center gap-4 mb-6 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
                <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">02</span>
                <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">Personal Case, Commercial Impact &amp; Contributions</h2>
            </div>

            <div className="relative z-10 flex flex-col gap-5 text-xs leading-relaxed">

                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">Leadership &amp; Role</p>
                    <p className="text-[#211B1B]/80 text-justify">
                        Since joining Jackson, Etti &amp; Edu in February 2024, I have assumed increasing leadership responsibility within CLDR, currently serving as <strong>Team Lead for CLDR</strong> and <strong>Deputy Sector Head – Energy &amp; Infrastructure</strong>, overseeing practice strategy, team coordination, mandate execution, and client development on high-value disputes.
                    </p>
                </div>

                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-3">Commercial Impact &amp; Revenue Delivery</p>
                    <div className="grid grid-cols-2 gap-3">
                        {achievements.map(({ label, value }) => (
                            <div key={label} className="bg-[#211B1B]/3 border border-[#211B1B]/8 rounded-lg p-4">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E80000] mb-1.5">{label}</p>
                                <p className="text-[#211B1B]/70 text-justify leading-relaxed">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-3">Market Visibility &amp; Professional Positioning</p>
                    <div className="space-y-2">
                        {positioning.map((p, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <div className="mt-1 w-2 h-2 rounded-full bg-[#E80000] shrink-0"></div>
                                <p className="text-[#211B1B]/70 text-justify">{p}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-3">Institutional Contribution &amp; Team Development</p>
                    <div className="space-y-2">
                        {institutional.map((p, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <div className="mt-1 w-2 h-2 rounded-full bg-[#211B1B]/30 shrink-0"></div>
                                <p className="text-[#211B1B]/70 text-justify">{p}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
