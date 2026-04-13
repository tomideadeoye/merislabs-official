import { JEE_WEBSITE_URL } from '../../constants';

const matters = [
    { matter: '2025 ComLit team revenue', outcome: 'USD 300,000+ departmental revenue' },
    { matter: 'OPay relationship', outcome: 'USD 60,000+ in 2025; USD 15,000 YTD 2026' },
    { matter: 'Project Compass – Ecobank', outcome: '₦25 million in fees' },
    { matter: 'AGTF / Sony advisory', outcome: 'USD 20,000 combined' },
    { matter: 'Multitan & Axa Mansard', outcome: '₦14 million in fees' },
    { matter: 'Baker Hughes – GH & First Bank', outcome: '₦20 million across both matters' },
    { matter: 'AMCON portfolio management', outcome: '₦75 million+ cumulative fees' },
    { matter: 'Emple arbitration', outcome: '₦80M fee; ₦20M above co-counsel' },
    { matter: 'UBA v Epe Resort', outcome: '₦2 billion+ in client savings' },
    { matter: 'Targeted proposals (OPay, TotalEnergies, Ecobank)', outcome: 'Instructions secured from all three' },
];

const PersonalCaseSlide = () => (
    <div id="personal-case" className="w-full h-full relative overflow-hidden bg-[#F9F7ED] font-sans text-[#211B1B]">
        <div className="absolute top-10 left-12 right-12 z-50 flex items-center space-x-4 border-b border-[#211B1B]/10 pb-5">
            <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                <img src="/clients/jackson etti and edu logo (1).png" alt="JEE" className="h-5 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
            </a>
            <div className="h-3 w-px bg-[#211B1B]/20" />
            <span className="text-[#211B1B]/30 text-[9px] font-bold tracking-[0.4em] uppercase">Personal Case & Commercial Impact</span>
        </div>

        <div className="absolute inset-0 top-28 left-12 right-12 bottom-10 z-20 grid grid-cols-12 gap-6">
            {/* Left */}
            <div className="col-span-4 flex flex-col justify-center gap-3">
                <div className="flex items-center space-x-3">
                    <div className="h-[1px] w-8 bg-red-600" />
                    <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">02</span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#211B1B] to-[#211B1B]/50">
                    Personal<br /><span className="text-red-600">Case</span>
                </h2>
                <p className="text-[9px] text-[#211B1B]/50 leading-relaxed border-l-2 border-red-600/20 pl-3">
                    Senior Associate, CLDR · Jackson, Etti &amp; Edu since February 2024. Leads the Firm&apos;s <strong>IR3 UK initiative</strong> — structured international referral strategy.
                </p>
                <div className="space-y-1.5 mt-1">
                    {[
                        { label: 'INSOL Future Leader of Nigeria', sub: '' },
                        { label: 'NICArb Award of Excellence', sub: 'Debt Recovery & Arbitration' },
                        { label: '₦170M Arbitral Tribunal', sub: 'Alongside Senior Advocates of Nigeria' },
                        { label: 'LIDW Active Participant', sub: 'Magic Circle & Silver Circle relationships' },
                    ].map(({ label, sub }) => (
                        <div key={label} className="flex gap-2 items-start">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></div>
                            <div>
                                <p className="text-[9px] font-black text-[#211B1B]">{label}</p>
                                {sub && <p className="text-[8px] text-[#211B1B]/35">{sub}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: revenue table */}
            <div className="col-span-8 flex flex-col justify-center">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#211B1B]/30 mb-2">Commercial Impact & Revenue Contributions</p>
                <div className="border border-[#211B1B]/10 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 bg-[#211B1B] text-white text-[7px] font-black uppercase tracking-widest">
                        <div className="col-span-7 px-3 py-2">Matter / Client</div>
                        <div className="col-span-5 px-3 py-2">Commercial Outcome</div>
                    </div>
                    {matters.map(({ matter, outcome }, i) => (
                        <div key={i} className={`grid grid-cols-12 border-t border-[#211B1B]/8 ${i % 2 === 0 ? 'bg-[#211B1B]/2' : ''}`}>
                            <div className="col-span-7 px-3 py-1.5 text-[9px] font-bold text-[#211B1B]">{matter}</div>
                            <div className="col-span-5 px-3 py-1.5 text-[9px] font-black text-red-600">{outcome}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(220,38,38,0.03)_0%,transparent_50%)] z-0" />
    </div>
);

export default PersonalCaseSlide;
