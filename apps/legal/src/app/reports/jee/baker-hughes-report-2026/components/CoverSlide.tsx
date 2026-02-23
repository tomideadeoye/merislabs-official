import React from 'react';

const CoverSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#F9F7ED] to-white font-sans text-[#211B1B]">
            {/* Background Texture Overlays */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[60%] aspect-square rounded-full bg-red-600/5 blur-[150px] animate-pulse" />
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-red-600/5 via-[#211B1B]/5 to-transparent rounded-full blur-3xl" />
            </div>

            {/* Left Content Area */}
            <div className="relative z-10 h-full w-[70%] flex flex-col px-24 py-16">
                {/* Dual Branding Header */}
                <div className="flex items-center space-x-6 shrink-0 border-b border-[#211B1B]/10 pb-10">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="Jackson, Etti & Edu"
                        className="h-8 w-auto object-contain"
                    />
                    <div className="h-4 w-px bg-[#211B1B]/20" />
                    <img
                        src="/clients/baker-hughes-logo.png"
                        alt="Baker Hughes"
                        className="h-8 w-auto object-contain opacity-80"
                        style={{ filter: "brightness(0)" }}
                    />
                </div>

                {/* Main Centered Content */}
                <div className="flex-grow flex flex-col justify-center">

                    {/* Accent line */}
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="h-[1px] w-12 bg-red-600" />
                        <span className="text-red-500 font-bold tracking-[0.5em] text-[10px] uppercase">Legal Intelligence</span>
                    </div>

                    <h1 className="text-[#211B1B] text-[7rem] font-black uppercase leading-[0.85] tracking-tighter mb-8 italic skew-x-[-2deg]">
                        Baker Hughes<br />
                        <span className="text-red-600 not-italic skew-x-0">Status Update</span><br />
                        <span className="text-[#211B1B]/20">2026</span>
                    </h1>

                    <div className="mt-6 flex flex-col max-w-lg">
                        <p className="text-[#211B1B]/50 text-sm font-bold tracking-[0.6em] uppercase leading-loose">
                            Comprehensive Litigation & Advisory Portfolio
                        </p>
                    </div>

                    {/* Bottom Details */}
                    <div className="mt-20 flex items-center space-x-16">
                        <div className="flex flex-col">
                            <span className="text-[#211B1B]/40 text-[9px] font-bold tracking-[0.4em] uppercase mb-2">Released</span>
                            <div className="text-[#211B1B] font-mono text-sm tracking-widest font-bold">FEBRUARY 2026</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Geometric Accent & Premium Rings */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none translate-x-1/3">
                <div className="relative w-[800px] h-[800px] flex items-center justify-center">
                    <div className="absolute inset-0 border-[2px] border-red-600/5 rounded-full animate-[pulse_4s_infinite]"></div>
                    <div className="absolute inset-32 border border-[#211B1B]/5 rounded-full"></div>
                    <div className="absolute inset-64 border border-red-600/5 rounded-full"></div>
                </div>
            </div>

        </div>
    );
};

export default CoverSlide;
