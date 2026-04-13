'use client';

const BG = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full border-[40px] border-[#E80000]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-[#211B1B]" />
    </div>
);

const matters = [
    { matter: '2025 ComLit team revenue', desc: 'Supported Head of Department in leading Commercial Litigation revenue performance', outcome: 'USD 300,000+ in departmental revenue in 2025' },
    { matter: 'OPay relationship', desc: 'Grew from narrow garnishee-focused instructions into a broader strategic client account', outcome: 'USD 60,000+ revenue in 2025; USD 15,000 in 2026 YTD' },
    { matter: 'Project Compass – Ecobank Litigation Portfolio Audit', desc: 'Led the Ecobank portfolio audit mandate from origination to delivery', outcome: '₦25 million in fees generated' },
    { matter: 'AGTF / Sony advisory', desc: 'Legal advisory and support services', outcome: 'USD 10,000 per client; USD 20,000 combined' },
    { matter: 'Multitan advisory', desc: 'Legal support and advisory services', outcome: '₦8 million in fees' },
    { matter: 'Axa Mansard advisory', desc: 'Led Commercial Litigation team on advisory mandate', outcome: '₦6 million in fees' },
    { matter: 'Baker Hughes – General Hydrocarbons & First Bank', desc: 'Led the Baker Hughes team on two major instructions', outcome: '₦20 million in fees across both matters' },
    { matter: 'AMCON portfolio management', desc: 'Managed AMCON portfolio across multiple recovery matters since 2024', outcome: '₦75 million+ in cumulative recovery professional fees' },
    { matter: 'Emple arbitration', desc: 'Lead team; negotiated and secured professional fee exceeding co-counsel billing', outcome: '₦80 million professional fee; ₦20 million above co-counsel billing' },
    { matter: 'UBA v Epe Resort', desc: 'Led team to a major reduction in client obligations and amicable settlement', outcome: '₦2 billion+ in client savings preserved' },
    { matter: 'Receivables clean-up (2023–2024)', desc: 'Led clean-up of aged receivables previously unbilled or unsupported', outcome: 'Improved practice financial position; material cash recovery' },
    { matter: 'Targeted proposals', desc: 'Led proposals to OPay, TotalEnergies CPFA and Ecobank', outcome: 'Instructions secured from all three clients' },
];

export const PersonalCase = () => (
    <div id="personal-case" className="max-w-[210mm] w-full mx-auto bg-transparent px-16 pt-12 pb-20 relative text-[#211B1B] overflow-hidden flex-grow flex flex-col font-sans">
        <BG />
        <div className="flex items-center gap-4 mb-5 border-b-2 border-[#E80000]/20 pb-4 relative z-10">
            <span className="text-4xl font-serif font-black text-[#E80000] opacity-20">02</span>
            <h2 className="text-2xl font-serif font-black text-[#211B1B] uppercase">Personal Case, Commercial Impact &amp; Contributions</h2>
        </div>
        <div className="relative z-10 flex flex-col gap-4 text-xs leading-relaxed">
            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">Leadership &amp; Role</p>
                <p className="text-[#211B1B]/80 text-justify">
                    Since joining Jackson, Etti &amp; Edu in February 2024, I have assumed increasing leadership responsibility within CLDR, playing a central role in strategic direction, mandate execution, client relationship development and practice positioning. I also lead the Firm&apos;s <strong>IR3 UK initiative</strong> — a structured international referrals strategy focused on deepening relationships with UK and international law firms and converting those relationships into Nigerian mandates.
                </p>
            </div>

            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">Commercial Impact &amp; Revenue Contributions</p>
                <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[8px] font-black uppercase tracking-widest">
                        <div className="col-span-3 px-3 py-2">Matter / Client</div>
                        <div className="col-span-5 px-3 py-2">Description</div>
                        <div className="col-span-4 px-3 py-2">Commercial Outcome</div>
                    </div>
                    {matters.map(({ matter, desc, outcome }, i) => (
                        <div key={i} className={`grid grid-cols-12 border-t border-[#211B1B]/8 text-[9px] ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}>
                            <div className="col-span-3 px-3 py-2 font-bold text-[#211B1B]">{matter}</div>
                            <div className="col-span-5 px-3 py-2 text-[#211B1B]/60">{desc}</div>
                            <div className="col-span-4 px-3 py-2 font-black text-[#E80000]">{outcome}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">Market Visibility &amp; Positioning</p>
                    <div className="space-y-1.5">
                        {['INSOL Future Leader of Nigeria', 'NICArb Award of Excellence – debt recovery & arbitration', 'Appointed Arbitrator on ₦170M three-member tribunal alongside SANs', 'Active at LIDW; relationships with Magic Circle & Silver Circle firms', 'Active: INSOL, BRIPAN, NICArb, ICMC, Young ICCA, ITA, NBA-SBL'].map((p, i) => (
                            <div key={i} className="flex gap-2 items-start">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#E80000] shrink-0"></div>
                                <p className="text-[#211B1B]/60 text-[10px]">{p}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#211B1B]/40 mb-2">Institutional Contribution</p>
                    <div className="space-y-1.5">
                        {['Technical & strategic training to CLDR associates on arbitration & enforcement', 'Editorial Board member; Graduate & Associate Recruitment and HR Committees', 'Cross-practice engagement with Corporate, Finance & Energy on dispute risk identification', 'Thought leadership and client knowledge products as BD tools', 'IR3 UK initiative — structured international referral pipeline development'].map((p, i) => (
                            <div key={i} className="flex gap-2 items-start">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#211B1B]/30 shrink-0"></div>
                                <p className="text-[#211B1B]/60 text-[10px]">{p}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);
