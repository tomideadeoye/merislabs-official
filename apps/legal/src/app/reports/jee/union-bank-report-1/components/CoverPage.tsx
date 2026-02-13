'use client';

import React from 'react';

export const CoverPage = () => {
    return (
        <div className="max-w-[210mm] w-full mx-auto bg-[#F9F7ED] shadow-2xl print:shadow-none print:m-0 overflow-hidden h-full relative flex flex-col shrink-0 font-sans">
            {/* Top Accent Border (JEE Imperial) */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#211B1B] via-[#E80000] to-[#211B1B] z-50 shadow-[0_0_20px_rgba(232,0,0,0.2)]"></div>

            {/* Geometric Corner Accents */}
            <div className="absolute top-0 left-0 z-5 pointer-events-none">
                <div className="relative w-48 h-48">
                    <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-[#211B1B] to-[#E80000]"></div>
                    <div className="absolute top-0 left-0 w-1 h-32 bg-gradient-to-b from-[#211B1B] to-[#E80000]"></div>
                    <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-[#E80000]/30"></div>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 z-5 pointer-events-none">
                <div className="relative w-48 h-48 translate-y-[-20%]">
                    <div className="absolute bottom-0 right-0 w-32 h-1 bg-gradient-to-l from-[#211B1B] to-[#E80000]"></div>
                    <div className="absolute bottom-0 right-0 w-1 h-32 bg-gradient-to-t from-[#211B1B] to-[#E80000]"></div>
                    <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[#E80000]/30"></div>
                </div>
            </div>

            {/* Minimalist Header */}
            <div className="h-[15%] w-full flex items-center justify-between px-16 py-4 border-b border-[#211B1B]/10 relative z-20">
                <div className="flex items-center space-x-4">
                    <img
                        src="/union-bank/logo.png"
                        alt="Union Bank"
                        className="h-14 w-auto object-contain"
                    />
                </div>

                <div className="text-right">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="Jackson Etti & Edu"
                        className="h-9 w-auto object-contain mb-2"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-gradient-to-br from-[#F9F7ED] to-white flex flex-col justify-center items-center p-16 relative overflow-hidden">
                {/* Floating Orbs - Background Layer */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    {/* Large orb - top left */}
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[#E80000]/5 via-[#211B1B]/5 to-transparent rounded-full blur-3xl"></div>
                    {/* Medium orb - middle right */}
                    <div className="absolute top-1/3 -right-24 w-72 h-72 bg-gradient-to-bl from-[#211B1B]/5 via-[#E80000]/3 to-transparent rounded-full blur-2xl"></div>
                    {/* Small orb - bottom left */}
                    <div className="absolute bottom-32 left-16 w-48 h-48 bg-gradient-to-tr from-[#E80000]/5 to-transparent rounded-full blur-xl"></div>

                    {/* Premium Decorative Rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="relative w-[800px] h-[800px]">
                            <div className="absolute inset-0 border-[2px] border-[#E80000]/5 rounded-full animate-[pulse_4s_infinite]"></div>
                            <div className="absolute inset-32 border border-[#211B1B]/5 rounded-full"></div>
                            <div className="absolute inset-64 border border-[#E80000]/5 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Subtle geometric pattern */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-20 w-32 h-32 border border-[#E80000]/5 rotate-45"></div>
                    <div className="absolute bottom-20 right-20 w-40 h-40 border border-[#211B1B]/5 rotate-12"></div>
                </div>

                <div className="relative z-10 text-center max-w-4xl space-y-12 px-8 flex flex-col items-center">
                    <div className="space-y-8 flex flex-col items-center">
                        <div className="px-6 py-2 bg-[#E80000]/5 border border-[#E80000]/10 rounded-full">
                            <div className="text-[#211B1B] text-sm font-bold tracking-[0.3em] uppercase italic text-center">Legal Compliance Assessment</div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-serif font-black text-[#211B1B] leading-tight text-center max-w-5xl mx-auto">
                            Report on the Comprehensive Review and Standardisation of Union Bank Plc&apos;s Legal Documentation.
                        </h1>

                        <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#E80000] to-transparent mx-auto my-6" />

                        <div className="text-[#211B1B]/80 text-lg italic max-w-2xl mx-auto px-4 text-center leading-relaxed">
                            Legal frameworks, documentation standards, and compliance protocols for Union Bank Plc's operational efficiency.
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="h-[20%] bg-black w-full flex items-center justify-between px-16 py-8 text-white relative overflow-hidden border-t-2 border-[#E80000]">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="absolute top-[-50%] right-[-10%] w-[40%] aspect-square border border-white rounded-full" />
                    <div className="absolute bottom-[-20%] left-[-5%] w-[30%] aspect-square border border-[#E80000] rounded-full" />
                </div>

                <div className="relative z-10 flex flex-col justify-center">
                    <div className="text-[#E80000] text-[9px] font-black uppercase tracking-[0.5em] mb-2 leading-none">By</div>
                    <div className="text-2xl font-serif font-bold leading-none">JACKSON, ETTI & EDU</div>
                </div>

                <div className="text-right relative z-10 self-center mt-6">
                    <div className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30">FEBRUARY 2026</div>
                </div>
            </div>
        </div>
    );
};

