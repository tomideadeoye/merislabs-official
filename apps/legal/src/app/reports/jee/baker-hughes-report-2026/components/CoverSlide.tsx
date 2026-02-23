import React from 'react';

export const CoverSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0A0A0A] font-sans">
            {/* Background Image Setup - Right Aligned with dark gradient overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-[65%] z-0">
                <div className="w-full h-full bg-[url('/union-bank/marina-skyline.jpg')] bg-cover bg-left grayscale opacity-30 shadow-[inset_100px_0_100px_rgba(10,10,10,1)]"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0A0A0A]/40 to-[#0A0A0A]"></div>
            </div>

            {/* Left Content Area */}
            <div className="relative z-10 h-full w-[55%] flex flex-col justify-center px-24">
                {/* JEE Logo */}
                <div className="mb-14">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="Jackson, Etti & Edu"
                        className="h-10 w-auto brightness-0 invert"
                    />
                </div>

                {/* Accent line */}
                <div className="flex items-center space-x-4 mb-8">
                    <div className="h-[2px] w-12 bg-[#E80000]" />
                    <span className="text-red-500 font-bold tracking-[0.4em] text-xs uppercase opacity-80">Legal Excellence</span>
                </div>

                <h1 className="text-white text-[5.5rem] font-black uppercase leading-[0.85] tracking-tighter mb-4 italic skew-x-[-4deg]">
                    Baker Hughes<br />
                    <span className="text-red-600 not-italic skew-x-0">Status Report</span><br />
                    <span className="text-white/20">2026</span>
                </h1>

                <div className="mt-12 space-y-2">
                    <p className="text-gray-400 text-sm font-bold tracking-[0.5em] uppercase">
                        Litigation Portfolio Update
                    </p>
                    <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                {/* Bottom Details */}
                <div className="mt-16 flex items-center space-x-12">
                    <div className="flex flex-col">
                        <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-1">Presented on</span>
                        <div className="text-white font-mono text-sm tracking-widest">23.02.2026</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col">
                        <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-1">Confidentiality</span>
                        <div className="text-red-600 font-bold text-sm tracking-widest uppercase">Privileged</div>
                    </div>
                    <div className="flex flex-col border-l border-white/10 pl-12">
                        <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-1">Infrastructure</span>
                        <div className="text-white/60 font-mono text-[10px] tracking-widest uppercase">Powered by Meris Labs</div>
                    </div>
                </div>
            </div>

            {/* Baker Hughes Logo - Bottom Right */}
            <div className="absolute bottom-12 right-12 z-20 flex flex-col items-end">
                <span className="text-white/20 text-[10px] font-bold tracking-widest uppercase mb-4">Client Representative</span>
                <img
                    src="/clients/Baker-Hughes-Logo.png"
                    alt="Baker Hughes"
                    className="h-14 w-auto brightness-0 invert opacity-40 hover:opacity-100 transition-opacity duration-700"
                />
            </div>

            {/* Decorative Grid Pattern Overlay */}
            <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            {/* Signature Red Pulse */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
        </div>
    );
};
