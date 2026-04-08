import { useDeckNavigation } from './NavigationContext';
import { JEE_WEBSITE_URL } from '../../constants';

const sections = [
    { id: 'executive-summary', num: '01', title: 'Executive Summary', desc: 'Strategic rationale & financial target' },
    { id: 'personal-case', num: '02', title: 'Personal Case', desc: 'Commercial impact & contributions' },
    { id: 'platform-1', num: '03', title: 'Three Platforms', desc: 'Debt Recovery · Commercial Disputes · Arbitration' },
    { id: 'implementation', num: '04', title: 'Implementation Plan', desc: 'Five strategic workstreams' },
    { id: 'financial', num: '05', title: 'Financial Requirements', desc: '₦70M–₦92.5M investment framework' },
    { id: 'success-factors', num: '06', title: 'Success Factors & KPIs', desc: 'Measuring Project Fortify performance' },
    { id: 'conclusion', num: '07', title: 'Conclusion', desc: 'Commitment to firm growth' },
];

const TOCSlide = () => {
    const { goToSlideById } = useDeckNavigation();
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#F9F7ED] font-sans text-[#211B1B]">
            {/* Header */}
            <div className="absolute top-10 left-12 right-12 z-50 flex justify-between items-center border-b border-[#211B1B]/10 pb-5">
                <div className="flex items-center space-x-4">
                    <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                        <img src="/clients/jackson etti and edu logo (1).png" alt="JEE" className="h-5 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
                    </a>
                    <div className="h-3 w-px bg-[#211B1B]/20" />
                    <span className="text-[#211B1B]/30 text-[9px] font-bold tracking-[0.4em] uppercase">Project Fortify · 2026–2028</span>
                </div>
            </div>

            {/* Faded BG letter */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#211B1B]/[0.02] text-[40rem] font-black italic select-none z-0 leading-none">F</div>

            <div className="absolute inset-0 top-28 left-12 right-12 bottom-10 z-20 flex flex-col">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="h-[1px] w-8 bg-red-600" />
                    <span className="text-red-500 font-bold tracking-[0.5em] text-[10px] uppercase">Contents</span>
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#211B1B] to-[#211B1B]/40">
                    Plan <span className="text-red-600">Overview</span>
                </h2>

                <div className="grid grid-cols-2 gap-x-12 gap-y-2 flex-1">
                    {sections.map((s) => (
                        <div
                            key={s.id}
                            onClick={() => goToSlideById(s.id)}
                            className="group cursor-pointer flex items-center space-x-4 py-2.5 border-b border-[#211B1B]/5 hover:border-red-600/20 transition-all"
                        >
                            <span className="text-red-600/40 font-mono text-sm font-bold group-hover:text-red-600 transition-colors shrink-0">{s.num}</span>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[#211B1B] text-xs font-black uppercase tracking-wide group-hover:text-red-600 transition-colors truncate">{s.title}</span>
                                <span className="text-[#211B1B]/30 text-[9px] uppercase tracking-widest truncate">{s.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(220,38,38,0.03)_0%,transparent_60%)] z-0" />
        </div>
    );
};

export default TOCSlide;
