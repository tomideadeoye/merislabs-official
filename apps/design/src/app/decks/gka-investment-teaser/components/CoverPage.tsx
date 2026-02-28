'use client';

import React from 'react';

export const CoverPage = () => {
    return (
        <div className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl print:shadow-none print:m-0 overflow-hidden h-full relative flex flex-col shrink-0 font-sans">

            {/* Top accent bar */}
            <div className="h-2 w-full bg-gradient-to-r from-[#f06600] via-[#ff8533] to-[#f06600]"></div>

            {/* Header with logos */}
            <div className="h-[12%] w-full flex items-center justify-between px-12 py-4 border-b border-[#f06600]/10 relative z-20">
                <div className="flex items-center space-x-4">
                    <img
                        src="/gka/gka-logo.png"
                        alt="GK&A Logistics"
                        className="h-14 w-auto object-contain"
                    />
                </div>

                <div className="text-right">
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#f06600]/60">Confidential</div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-gradient-to-br from-white via-[#f0f7f2] to-white flex flex-col justify-center items-center p-12 relative overflow-hidden">
                {/* Floating geometric shapes - Background Layer */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    {/* Large orb - top right */}
                    <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-[#f06600]/5 via-[#ff8533]/5 to-transparent rounded-full blur-3xl"></div>
                    {/* Medium orb - bottom left */}
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-[#ff8533]/8 via-[#f06600]/3 to-transparent rounded-full blur-2xl"></div>
                    
                    {/* Decorative rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="relative w-[700px] h-[700px]">
                            <div className="absolute inset-0 border-[2px] border-[#f06600]/5 rounded-full"></div>
                            <div className="absolute inset-24 border border-[#ff8533]/10 rounded-full"></div>
                            <div className="absolute inset-48 border border-[#f06600]/5 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Subtle geometric pattern */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-32 left-16 w-24 h-24 border border-[#f06600]/5 rotate-45"></div>
                    <div className="absolute bottom-40 right-20 w-32 h-32 border border-[#ff8533]/5 rotate-12"></div>
                </div>

                <div className="relative z-10 text-center max-w-5xl space-y-10 px-8 flex flex-col items-center">
                    {/* Company name */}
                    <div className="space-y-6 flex flex-col items-center">
                        <div className="px-8 py-3 bg-[#f06600]/5 border border-[#f06600]/10 rounded-full">
                            <div className="text-[#f06600] text-xs font-black tracking-[0.3em] uppercase text-center">GK&A Logistics Services Ltd</div>
                        </div>

                        <h1 className="text-4xl font-serif font-black text-[#211B1B] text-center max-w-4xl mx-auto tracking-wide leading-tight">
                            IKORODU REGIONAL INLAND PORT &<br />
                            <span className="text-[#f06600]">CUSTOMS DIRECT SHIP CALL TERMINAL</span>
                        </h1>

                        <div className="w-48 h-1.5 bg-gradient-to-r from-transparent via-[#f06600] to-transparent mx-auto my-4" />

                        <div className="text-[#211B1B]/70 text-lg italic max-w-2xl mx-auto px-4 text-center leading-relaxed">
                            A transformative multimodal logistics facility on the Lagos Lagoon waterfront
                        </div>

                        <div className="px-6 py-3 bg-[#f06600] text-white rounded-full mt-6">
                            <div className="text-sm font-black tracking-[0.2em] uppercase text-center">GK & A — POWERING NIGERIA'S TRADE EVOLUTION</div>
                        </div>
                    </div>

                    {/* Key metrics preview */}
                    <div className="grid grid-cols-3 gap-8 mt-12 w-full max-w-3xl">
                        <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-[#f06600]/10 shadow-lg">
                            <div className="text-3xl font-black text-[#f06600]">20.3 Ha</div>
                            <div className="text-xs uppercase tracking-[0.1em] text-[#211B1B]/60 mt-2">Total Footprint</div>
                        </div>
                        <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-[#f06600]/10 shadow-lg">
                            <div className="text-3xl font-black text-[#f06600]">36,000</div>
                            <div className="text-xs uppercase tracking-[0.1em] text-[#211B1B]/60 mt-2">SQM Active Hub</div>
                        </div>
                        <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-[#f06600]/10 shadow-lg">
                            <div className="text-3xl font-black text-[#f06600]">540m</div>
                            <div className="text-xs uppercase tracking-[0.1em] text-[#211B1B]/60 mt-2">Marine Quay Wall</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="h-[18%] bg-[#211B1B] w-full flex items-center justify-between px-12 py-8 text-white relative overflow-hidden border-t-4 border-[#f06600]">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-[0.05]">
                    <div className="absolute top-[-50%] right-[-10%] w-[40%] aspect-square border border-white rounded-full" />
                    <div className="absolute bottom-[-20%] left-[-5%] w-[30%] aspect-square border border-[#f06600] rounded-full" />
                </div>

                <div className="relative z-10">
                    <img
                        src="/gka/gka-logo.png"
                        alt="GK&A Logistics"
                        className="h-12 w-auto object-contain opacity-90"
                    />
                </div>

                <div className="text-right relative z-10">
                    <div className="text-[9px] uppercase tracking-[0.25em] font-bold opacity-40 mb-1">CONTACT</div>
                    <div className="text-sm font-semibold">Omobola Abiru</div>
                    <div className="text-[10px] opacity-60">Managing Director, GK&A Logistics</div>
                    <div className="text-[10px] opacity-60 mt-1">info@gkaports.com | mobola.abiru@gkaports.com</div>
                    <div className="text-[10px] opacity-60">+234 703 834 1611</div>
                </div>

                <div className="text-right relative z-10 self-center">
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">FEBRUARY 2026</div>
                </div>
            </div>
        </div>
    );
};
