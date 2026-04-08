import { JEE_WEBSITE_URL } from '../../constants';

const workstreams = [
    {
        n: '01', title: 'Structured Dispute Offerings',
        measure: '3+ offerings annually',
        desc: 'Bank Litigation Portfolio Audit, NPL Audits, Garnishee Toolkits, Cross-Border Recovery Advisory, Shareholder Dispute Advisory.',
    },
    {
        n: '02', title: 'Thought Leadership & Knowledge Platform',
        measure: '5+ articles · 2 client sessions',
        desc: 'Strategic Debt Recovery & Insolvency Series + Arbitration/Cross-Border Series. Leverage for client meetings, conferences, and media.',
    },
    {
        n: '03', title: 'Ecosystem Engagement & Market Positioning',
        measure: '10+ professional engagements',
        desc: 'Active roles in INSOL, BRIPAN, NICArb, ICMC, NBA-SBL, LIDW. Panel appointments: Lagos Court of Arbitration, NICArb, CIArb, ICC Nigeria.',
    },
    {
        n: '04', title: 'Relationship Development & Client Engagement',
        measure: '15+ strategic relationships',
        desc: 'Target GCs, Heads of Recovery/Risk in banks and priority-sector corporates. Track via pipeline tool with capability notes.',
    },
    {
        n: '05', title: 'Internal Referral Capture & Cross-Practice',
        measure: '3+ cross-practice referrals p.a.',
        desc: 'Engagement with Corporate/M&A, Energy & Projects, Regulatory, and Real Estate teams. Early-stage dispute risk assessments.',
    },
];

const ImplementationSlide = () => (
    <div id="implementation" className="w-full h-full relative overflow-hidden bg-[#F9F7ED] font-sans text-[#211B1B]">
        <div className="absolute top-10 left-12 right-12 z-50 flex items-center space-x-4 border-b border-[#211B1B]/10 pb-5">
            <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                <img src="/clients/jackson etti and edu logo (1).png" alt="JEE" className="h-5 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
            </a>
            <div className="h-3 w-px bg-[#211B1B]/20" />
            <span className="text-[#211B1B]/30 text-[9px] font-bold tracking-[0.4em] uppercase">Implementation Plan · Five Workstreams</span>
        </div>

        <div className="absolute inset-0 top-28 left-12 right-12 bottom-10 z-20 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-3">
                    <div className="h-[1px] w-8 bg-red-600" />
                    <span className="text-red-500 font-bold tracking-[0.5em] text-[9px] uppercase">04 · 24-Month Execution Framework</span>
                </div>
                <span className="text-[#211B1B]/20 text-[9px] font-mono uppercase tracking-widest">PSP Cycle 2026–2028</span>
            </div>

            <div className="flex flex-col gap-2 flex-1">
                {workstreams.map(({ n, title, measure, desc }) => (
                    <div key={n} className="flex gap-4 items-stretch border border-[#211B1B]/8 rounded-lg overflow-hidden hover:border-red-600/20 transition-colors flex-1">
                        <div className="w-10 bg-[#211B1B] flex items-center justify-center shrink-0">
                            <span className="text-white/30 font-mono text-[10px] font-bold -rotate-90 whitespace-nowrap">{n}</span>
                        </div>
                        <div className="flex-1 py-3 pr-4 flex flex-col justify-center gap-1">
                            <div className="flex items-center gap-3">
                                <p className="text-[10px] font-black text-[#211B1B] uppercase tracking-wide">{title}</p>
                                <span className="text-[8px] font-black uppercase tracking-widest text-red-600/60 border border-red-600/20 px-2 py-0.5 rounded-full shrink-0">{measure}</span>
                            </div>
                            <p className="text-[9px] text-[#211B1B]/50 leading-relaxed">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(220,38,38,0.03)_0%,transparent_50%)] z-0" />
    </div>
);

export default ImplementationSlide;
