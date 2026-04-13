'use client';

const BackgroundOrbs = () => (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[#E80000]/5 via-[#211B1B]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 w-72 h-72 bg-gradient-to-bl from-[#211B1B]/5 via-[#E80000]/3 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="relative w-[700px] h-[700px]">
                <div className="absolute inset-0 border-[2px] border-[#E80000]/5 rounded-full"></div>
                <div className="absolute inset-32 border border-[#211B1B]/5 rounded-full"></div>
                <div className="absolute inset-64 border border-[#E80000]/5 rounded-full"></div>
            </div>
        </div>
        <div className="absolute top-20 left-20 w-32 h-32 border border-[#E80000]/5 rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border border-[#211B1B]/5 rotate-12"></div>
    </div>
);

export const CoverPage = () => (
    <div className="max-w-[210mm] w-full mx-auto bg-[#F9F7ED] overflow-hidden h-full relative flex flex-col shrink-0 font-sans">
        <div className="absolute bottom-0 right-0 z-5 pointer-events-none">
            <div className="relative w-48 h-48">
                <div className="absolute bottom-0 right-0 w-32 h-1 bg-gradient-to-l from-[#211B1B] to-[#E80000]"></div>
                <div className="absolute bottom-0 right-0 w-1 h-32 bg-gradient-to-t from-[#211B1B] to-[#E80000]"></div>
                <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[#E80000]/30"></div>
            </div>
        </div>

        {/* Header */}
        <div className="h-[14%] w-full flex items-center justify-between px-16 py-4 border-b border-[#211B1B]/10 relative z-20">
            <div className="text-[#211B1B]/30 text-[10px] font-black uppercase tracking-[0.4em]">Partnership Selection Programme</div>
            <img src="/clients/jackson etti and edu logo (1).png" alt="Jackson Etti & Edu" className="h-9 w-auto object-contain" />
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col justify-center items-center p-16 relative overflow-hidden">
            <BackgroundOrbs />
            <div className="relative z-10 text-center max-w-4xl space-y-8 flex flex-col items-center">
                <div className="px-6 py-2 bg-[#E80000]/5 border border-[#E80000]/10 rounded-full">
                    <div className="text-[#211B1B] text-sm font-bold tracking-[0.3em] uppercase">Business Plan Submission · Partnership Selection Programme</div>
                </div>
                <h1 className="text-5xl font-serif font-black text-[#211B1B] text-center tracking-wide leading-tight">Project Fortify</h1>
                <p className="text-lg font-serif font-bold text-[#211B1B]/70 text-center tracking-widest uppercase">Commercial Disputes Practice Growth Plan</p>
                <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#E80000] to-transparent mx-auto" />
                <div className="text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#211B1B]/30 mb-1">Submitted to</p>
                    <p className="text-sm font-bold text-[#211B1B]/60 uppercase tracking-widest">The Partnership Selection Committee</p>
                </div>
                <div className="grid grid-cols-2 gap-5 w-full max-w-lg mt-4">
                    {[
                        { label: 'Candidate', value: 'Taiwo Ogbara' },
                        { label: 'Position', value: 'Senior Associate' },
                        { label: 'Practice', value: 'Commercial Litigation & DR' },
                        { label: 'Firm', value: 'Jackson, Etti & Edu' },
                        { label: 'Target Revenue', value: 'USD 500,000 p.a.' },
                        { label: 'Date', value: 'March 2026' },
                    ].map(({ label, value }) => (
                        <div key={label} className="text-left border-l-2 border-[#E80000]/20 pl-4">
                            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[#211B1B]/30 mb-1">{label}</div>
                            <div className="text-sm font-bold text-[#211B1B]">{value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="h-[16%] bg-[#211B1B] w-full flex items-center justify-between px-16 py-6 text-white relative overflow-hidden border-t-2 border-[#E80000]">
            <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute top-[-50%] right-[-10%] w-[40%] aspect-square border border-white rounded-full" />
            </div>
            <div className="relative z-10">
                <div className="text-[#E80000] text-[9px] font-black uppercase tracking-[0.5em] mb-1">Prepared by</div>
                <div className="text-xl font-serif font-bold">JACKSON, ETTI &amp; EDU</div>
            </div>
            <div className="relative z-10 text-right">
                <div className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30">STRICTLY CONFIDENTIAL</div>
                <div className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-20 mt-1">APRIL 2026</div>
            </div>
        </div>
    </div>
);
