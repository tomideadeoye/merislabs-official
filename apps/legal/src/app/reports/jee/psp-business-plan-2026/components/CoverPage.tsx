'use client';

const BackgroundOrbs = () => (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[#E80000]/5 via-[#211B1B]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 w-72 h-72 bg-gradient-to-bl from-[#211B1B]/5 via-[#E80000]/3 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-16 w-48 h-48 bg-gradient-to-tr from-[#E80000]/5 to-transparent rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="relative w-[800px] h-[800px]">
                <div className="absolute inset-0 border-[2px] border-[#E80000]/5 rounded-full"></div>
                <div className="absolute inset-32 border border-[#211B1B]/5 rounded-full"></div>
                <div className="absolute inset-64 border border-[#E80000]/5 rounded-full"></div>
            </div>
        </div>
        <div className="absolute top-20 left-20 w-32 h-32 border border-[#E80000]/5 rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border border-[#211B1B]/5 rotate-12"></div>
    </div>
);

export const CoverPage = () => {
    return (
        <div className="max-w-[210mm] w-full mx-auto bg-[#F9F7ED] shadow-2xl print:shadow-none print:m-0 overflow-hidden h-full relative flex flex-col shrink-0 font-sans">

            {/* Corner accent */}
            <div className="absolute bottom-0 right-0 z-5 pointer-events-none">
                <div className="relative w-48 h-48 translate-y-[-20%]">
                    <div className="absolute bottom-0 right-0 w-32 h-1 bg-gradient-to-l from-[#211B1B] to-[#E80000]"></div>
                    <div className="absolute bottom-0 right-0 w-1 h-32 bg-gradient-to-t from-[#211B1B] to-[#E80000]"></div>
                    <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[#E80000]/30"></div>
                </div>
            </div>

            {/* Header */}
            <div className="h-[15%] w-full flex items-center justify-between px-16 py-4 border-b border-[#211B1B]/10 relative z-20">
                <div className="flex items-center space-x-4">
                    <div className="text-[#211B1B]/40 text-[10px] font-black uppercase tracking-[0.4em]">Partnership Selection Programme</div>
                </div>
                <div className="text-right">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="Jackson Etti & Edu"
                        className="h-9 w-auto object-contain"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gradient-to-br from-[#F9F7ED] to-white flex flex-col justify-center items-center p-16 relative overflow-hidden">
                <BackgroundOrbs />

                <div className="relative z-10 text-center max-w-4xl space-y-12 px-8 flex flex-col items-center">
                    <div className="space-y-8 flex flex-col items-center">
                        <div className="px-6 py-2 bg-[#E80000]/5 border border-[#E80000]/10 rounded-full">
                            <div className="text-[#211B1B] text-sm font-bold tracking-[0.3em] uppercase text-center">Business Plan Submission</div>
                        </div>

                        <h1 className="text-5xl font-serif font-black text-[#211B1B] text-center max-w-4xl mx-auto tracking-wide leading-tight">
                            Project Fortify
                        </h1>

                        <p className="text-xl font-serif text-[#211B1B]/60 text-center tracking-wide">
                            CLDR Practice Growth Plan
                        </p>

                        <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#E80000] to-transparent mx-auto my-2" />

                        <div className="text-[#211B1B]/70 text-base italic max-w-2xl mx-auto px-4 text-center leading-relaxed">
                            A commercially disciplined growth plan to establish JEE&apos;s Commercial Litigation &amp; Dispute Resolution practice as a standalone, revenue-producing business platform.
                        </div>
                    </div>

                    {/* Candidate Details */}
                    <div className="grid grid-cols-2 gap-6 w-full max-w-xl mt-8">
                        {[
                            { label: 'Practice', value: 'Commercial Litigation & Dispute Resolution' },
                            { label: 'Programme', value: 'Partnership Selection Programme' },
                            { label: 'Firm', value: 'Jackson, Etti & Edu' },
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
            <div className="h-[18%] bg-[#211B1B] w-full flex items-center justify-between px-16 py-8 text-white relative overflow-hidden border-t-2 border-[#E80000]">
                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="absolute top-[-50%] right-[-10%] w-[40%] aspect-square border border-white rounded-full" />
                    <div className="absolute bottom-[-20%] left-[-5%] w-[30%] aspect-square border border-[#E80000] rounded-full" />
                </div>
                <div className="relative z-10 flex flex-col justify-center">
                    <div className="text-[#E80000] text-[9px] font-black uppercase tracking-[0.5em] mb-2 leading-none">Prepared by</div>
                    <div className="text-2xl font-serif font-bold leading-none">JACKSON, ETTI &amp; EDU</div>
                </div>
                <div className="text-right relative z-10 self-center">
                    <div className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30">MARCH 2026</div>
                </div>
            </div>
        </div>
    );
};
