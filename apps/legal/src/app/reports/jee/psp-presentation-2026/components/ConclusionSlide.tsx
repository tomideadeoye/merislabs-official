import { JEE_WEBSITE_URL } from '../../constants';

const pillars = [
    { n: '01', label: 'Structured Offerings', desc: 'Productised dispute services that convert conversations into mandates.' },
    { n: '02', label: 'Thought Leadership', desc: 'A sustained knowledge platform positioning JEE as the authority.' },
    { n: '03', label: 'Ecosystem Engagement', desc: 'Professional networks generating referrals and cross-border opportunities.' },
    { n: '04', label: 'Targeted Relationships', desc: 'Disciplined pipeline across Banking, Energy, and FMCG.' },
    { n: '05', label: 'Cross-Practice Collaboration', desc: 'Internal referral capture retaining dispute mandates from transactional work.' },
];

const ConclusionSlide = () => (
    <div id="conclusion" className="w-full h-full relative overflow-hidden bg-[#F9F7ED] font-sans text-[#211B1B]">
        <div className="absolute top-10 left-12 right-12 z-50 flex items-center space-x-4 border-b border-[#211B1B]/10 pb-5">
            <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                <img src="/clients/jackson etti and edu logo (1).png" alt="JEE" className="h-5 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
            </a>
            <div className="h-3 w-px bg-[#211B1B]/20" />
            <span className="text-[#211B1B]/30 text-[9px] font-bold tracking-[0.4em] uppercase">Conclusion · Commitment to Firm Growth</span>
        </div>

        <div className="absolute inset-0 top-28 left-12 right-12 bottom-10 z-20 grid grid-cols-12 gap-8">
            {/* Left */}
            <div className="col-span-5 flex flex-col justify-center gap-5">
                <div className="flex items-center space-x-3">
                    <div className="h-[1px] w-8 bg-red-600" />
                    <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">07</span>
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#211B1B] to-[#211B1B]/40">
                    Project<br /><span className="text-red-600">Fortify</span>
                </h2>
                <div className="bg-[#211B1B]/5 border-l-4 border-red-600 p-4 rounded-r-lg">
                    <p className="text-[10px] text-[#211B1B]/70 leading-relaxed italic">
                        A clear, executable blueprint to strengthen JEE&apos;s CLDR practice, broaden its institutional client base, and build a sustainable mandate pipeline — fully aligned with the Firm&apos;s sector-driven vision.
                    </p>
                </div>
                <div className="pt-4 border-t border-[#211B1B]/10">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#211B1B]/30 mb-1">Submitted by</p>
                    <p className="font-serif font-black text-sm text-[#211B1B]">Senior Associate, CLDR</p>
                    <p className="text-[9px] text-[#211B1B]/40">Jackson, Etti &amp; Edu · March 2026</p>
                </div>
            </div>

            {/* Right: pillars */}
            <div className="col-span-7 flex flex-col justify-center gap-2">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#211B1B]/30 mb-2">Five Integrated Pillars of Execution</p>
                {pillars.map(({ n, label, desc }) => (
                    <div key={n} className="flex gap-4 items-center border border-[#211B1B]/8 rounded-lg px-4 py-3 hover:border-red-600/20 transition-colors">
                        <span className="text-red-600/30 font-mono text-xs font-bold shrink-0">{n}</span>
                        <div className="w-px h-6 bg-[#211B1B]/10 shrink-0"></div>
                        <div>
                            <p className="text-[10px] font-black text-[#211B1B]">{label}</p>
                            <p className="text-[9px] text-[#211B1B]/50">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(220,38,38,0.04)_0%,transparent_50%)] z-0" />
    </div>
);

export default ConclusionSlide;
