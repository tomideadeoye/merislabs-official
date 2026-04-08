import { JEE_WEBSITE_URL } from '../../constants';

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
            <div className="col-span-4 flex flex-col justify-center gap-4">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="h-[1px] w-8 bg-red-600" />
                    <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">02</span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#211B1B] to-[#211B1B]/50">
                    Personal<br /><span className="text-red-600">Case</span>
                </h2>
                <p className="text-[10px] text-[#211B1B]/50 leading-relaxed border-l-2 border-red-600/20 pl-3">
                    Team Lead, CLDR &amp; Deputy Sector Head – Energy &amp; Infrastructure at Jackson, Etti &amp; Edu since February 2024.
                </p>
                <div className="space-y-2 mt-2">
                    {[
                        { label: 'INSOL Future Leader', sub: 'Nigeria' },
                        { label: 'NICArb Award of Excellence', sub: 'Debt Recovery & Arbitration' },
                        { label: '₦170M Arbitral Tribunal', sub: 'Appointed alongside SANs' },
                    ].map(({ label, sub }) => (
                        <div key={label} className="flex gap-2 items-start">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></div>
                            <div>
                                <p className="text-[10px] font-black text-[#211B1B]">{label}</p>
                                <p className="text-[9px] text-[#211B1B]/40">{sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: achievements grid */}
            <div className="col-span-8 grid grid-cols-2 gap-3 content-center">
                {[
                    { label: 'High-Value Arbitration', value: 'US$9.7M award and successful enforcement — cross-border dispute leadership.', color: '#E80000' },
                    { label: 'Institutional Recoveries', value: '₦5 billion in recoveries for Tier-1 financial institutions.', color: '#211B1B' },
                    { label: 'Premium Fee Realisation', value: '₦80M professional fee in the Emple mandate — ₦20M above co-counsel.', color: '#E80000' },
                    { label: 'Strategic Client Transformation', value: 'Repositioned OPay from routine garnishee work to multi-party commercial disputes vs. Moniepoint & FairMoney.', color: '#211B1B' },
                    { label: 'Global Networking', value: 'Active at LIDW with relationships across Magic Circle and Silver Circle firms.', color: '#E80000' },
                    { label: 'Cross-Practice Collaboration', value: 'Embedded early-stage dispute advisory into deal structuring with Corporate, Finance & Energy teams.', color: '#211B1B' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="border border-[#211B1B]/8 rounded-lg p-4 hover:border-red-600/20 transition-colors flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }}></div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color }}>{label}</p>
                        </div>
                        <p className="text-[10px] text-[#211B1B]/60 leading-relaxed">{value}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(220,38,38,0.03)_0%,transparent_50%)] z-0" />
    </div>
);

export default PersonalCaseSlide;
