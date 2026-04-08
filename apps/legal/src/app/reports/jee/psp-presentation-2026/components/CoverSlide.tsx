import { JEE_WEBSITE_URL } from '../../constants';

const CoverSlide = () => (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#F9F7ED] to-white font-sans text-[#211B1B]">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[60%] aspect-square rounded-full bg-red-600/5 blur-[150px] animate-pulse" />
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-red-600/5 via-[#211B1B]/5 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Left Content */}
        <div className="relative z-10 h-full w-[65%] flex flex-col px-20 py-12">
            <div className="flex items-center space-x-4 shrink-0 border-b border-[#211B1B]/10 pb-8">
                <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                    <img src="/clients/jackson etti and edu logo (1).png" alt="Jackson, Etti & Edu" className="h-7 w-auto object-contain" />
                </a>
                <div className="h-4 w-px bg-[#211B1B]/20" />
                <span className="text-[#211B1B]/30 text-[10px] font-bold tracking-[0.4em] uppercase">Partnership Selection Programme</span>
            </div>

            <div className="flex-grow flex flex-col justify-center">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="h-[1px] w-10 bg-red-600" />
                    <span className="text-red-500 font-bold tracking-[0.5em] text-[10px] uppercase">Business Plan Submission</span>
                </div>

                <h1 className="text-[#211B1B] text-[5.5rem] font-black uppercase leading-[0.85] tracking-tighter mb-4 italic skew-x-[-2deg]">
                    Project<br />
                    <span className="text-red-600 not-italic skew-x-0">Fortify</span>
                </h1>

                <p className="text-[#211B1B]/40 text-sm font-bold tracking-[0.4em] uppercase mt-4 mb-8">
                    CLDR Practice Growth Plan · 2026–2028
                </p>

                <div className="grid grid-cols-2 gap-x-10 gap-y-3 max-w-sm mt-4">
                    {[
                        { label: 'Practice', value: 'Commercial Litigation & DR' },
                        { label: 'Firm', value: 'Jackson, Etti & Edu' },
                        { label: 'Target', value: 'USD 500,000 p.a.' },
                        { label: 'Date', value: 'March 2026' },
                    ].map(({ label, value }) => (
                        <div key={label} className="border-l-2 border-[#E80000]/20 pl-3">
                            <div className="text-[8px] font-black uppercase tracking-[0.3em] text-[#211B1B]/25 mb-0.5">{label}</div>
                            <div className="text-xs font-bold text-[#211B1B]/70">{value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right geometric rings */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 pointer-events-none">
            <div className="relative w-[600px] h-[600px] flex items-center justify-center">
                <div className="absolute inset-0 border-[2px] border-red-600/5 rounded-full"></div>
                <div className="absolute inset-24 border border-[#211B1B]/5 rounded-full"></div>
                <div className="absolute inset-48 border border-red-600/8 rounded-full"></div>
                <div className="w-32 h-32 rounded-full bg-red-600/5 blur-xl"></div>
            </div>
        </div>
    </div>
);

export default CoverSlide;
