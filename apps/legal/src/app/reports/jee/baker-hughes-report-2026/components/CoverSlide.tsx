import React from 'react';

export const CoverSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0A0A0A] font-sans">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/baker_hughes_industrial_abstract_1771855197762.png"
                    alt="Industrial"
                    className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
            </div>

            {/* Content Area */}
            <div className="relative z-10 h-full w-[60%] flex flex-col justify-center px-24">
                {/* Branding Block */}
                <div className="flex items-center space-x-6 mb-16">
                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-sm shadow-xl">
                        <img
                            src="/clients/jackson etti and edu logo (1).png"
                            alt="Jackson, Etti & Edu"
                            className="h-8 w-auto invert-0"
                        />
                    </div>
                    <div className="h-4 w-px bg-white/20" />
                    <span className="text-white/40 font-bold tracking-[0.5em] text-[10px] uppercase">Legal Council . Status Report</span>
                </div>

                {/* Primary Title */}
                <div className="relative">
                    <div className="absolute -left-8 top-0 bottom-0 w-1 bg-red-600 shadow-[0_0_20px_rgba(232,0,0,0.8)]" />
                    <h1 className="text-white text-[6.5rem] font-black uppercase leading-[0.8] tracking-tighter mb-6 flex flex-col">
                        <span className="opacity-40 italic skew-x-[-8deg] origin-left">Baker</span>
                        <span className="relative z-10">Hughes</span>
                        <span className="text-red-600 text-[4rem] tracking-normal -mt-4 font-black">2026 Strategy</span>
                    </h1>
                </div>

                <div className="max-w-md mt-8">
                    <div className="h-px w-full bg-gradient-to-r from-red-600 to-transparent mb-6" />
                    <p className="text-white/60 text-sm leading-relaxed tracking-wide font-light uppercase">
                        Comprehensive Litigation Intelligence & <br />
                        <span className="text-white font-bold">Execution Portfolio Update</span>
                    </p>
                </div>

                {/* Footer Details */}
                <div className="mt-20 flex items-center space-x-12">
                    <div className="flex flex-col">
                        <span className="text-white/30 text-[9px] font-bold tracking-widest uppercase mb-1">Issue Date</span>
                        <div className="text-white font-mono text-xs tracking-[0.2em]">23 . 02 . 2026</div>
                    </div>
                </div>
            </div>

            {/* Bottom Right Brand Mark */}
            <div className="absolute bottom-12 right-12 z-20 flex flex-col items-end group">
                <div className="mb-6 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                    <span className="text-white/20 text-[8px] font-mono tracking-[0.4em] uppercase">Portfolio Alignment Secured</span>
                </div>
                <div className="bg-white p-6 rounded-sm shadow-2xl transition-transform duration-700 group-hover:scale-105">
                    <img
                        src="/clients/baker-hughes-logo.png"
                        alt="Baker Hughes"
                        className="h-10 w-auto object-contain"
                    />
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-red-600/10 blur-[120px] rounded-full animate-float pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-600/5 blur-[150px] rounded-full animate-pulse-slow pointer-events-none" />
        </div>
    );
};
