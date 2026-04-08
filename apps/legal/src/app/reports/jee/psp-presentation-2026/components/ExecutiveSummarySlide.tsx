import { JEE_WEBSITE_URL } from '../../constants';

const ExecutiveSummarySlide = () => (
    <div id="executive-summary" className="w-full h-full relative overflow-hidden bg-[#F9F7ED] font-sans text-[#211B1B]">
        <div className="absolute top-10 left-12 right-12 z-50 flex justify-between items-center border-b border-[#211B1B]/10 pb-5">
            <div className="flex items-center space-x-4">
                <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                    <img src="/clients/jackson etti and edu logo (1).png" alt="JEE" className="h-5 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
                </a>
                <div className="h-3 w-px bg-[#211B1B]/20" />
                <span className="text-[#211B1B]/30 text-[9px] font-bold tracking-[0.4em] uppercase">Executive Summary</span>
            </div>
        </div>

        <div className="absolute inset-0 top-28 left-12 right-12 bottom-10 z-20 grid grid-cols-12 gap-8">
            {/* Left: Title + target */}
            <div className="col-span-4 flex flex-col justify-center">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="h-[1px] w-8 bg-red-600" />
                    <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">01</span>
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-b from-[#211B1B] to-[#211B1B]/50">
                    Executive<br /><span className="text-red-600">Summary</span>
                </h2>
                <div className="bg-[#211B1B] rounded-lg p-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500 mb-1">Financial Target</p>
                    <p className="text-white font-black text-lg leading-tight">USD 500,000</p>
                    <p className="text-white/40 text-[9px] uppercase tracking-widest mt-1">Annual attributable revenue · 24-month cycle</p>
                </div>
                <div className="mt-4 border border-[#211B1B]/10 rounded-lg p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#211B1B]/40 mb-1">Investment Required</p>
                    <p className="text-[#211B1B] font-black text-base">₦70M – ₦92.5M</p>
                    <p className="text-[#211B1B]/30 text-[9px] uppercase tracking-widest mt-0.5">Over 24 months</p>
                </div>
            </div>

            {/* Right: 3 platforms + strategic outcome */}
            <div className="col-span-8 flex flex-col justify-center gap-3">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#211B1B]/30 mb-1">Three Core Business Platforms</p>
                {[
                    { n: '1', title: 'Institutional Debt Recovery, Insolvency & Enforcement', desc: 'Drive recurring mandates from financial institutions through productised recovery solutions.' },
                    { n: '2', title: 'Commercial, Transactional & Shareholder Disputes', desc: 'Position CLDR as the "first call" for commercial conflicts across the Firm\'s priority sectors.' },
                    { n: '3', title: 'Domestic & International Arbitration & Cross-Border Enforcement', desc: 'Capture foreign currency mandates through international alliances and arbitral panel appointments.' },
                ].map(({ n, title, desc }) => (
                    <div key={n} className="flex gap-4 items-start border border-[#211B1B]/8 rounded-lg p-4 hover:border-red-600/20 transition-colors">
                        <div className="w-7 h-7 rounded-full bg-red-600/10 border border-red-600/20 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-black text-red-600">{n}</span>
                        </div>
                        <div>
                            <p className="text-xs font-black text-[#211B1B] mb-0.5">{title}</p>
                            <p className="text-[10px] text-[#211B1B]/50 leading-relaxed">{desc}</p>
                        </div>
                    </div>
                ))}
                <div className="bg-red-600/5 border border-red-600/15 rounded-lg p-4 mt-1">
                    <p className="text-[10px] text-[#211B1B]/70 leading-relaxed italic">
                        Project Fortify will convert CLDR from a practice group into a repeatable business model — one that originates its own work, delivers predictable revenues, and cements JEE&apos;s position as a market leader.
                    </p>
                </div>
            </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_80%,rgba(220,38,38,0.03)_0%,transparent_50%)] z-0" />
    </div>
);

export default ExecutiveSummarySlide;
