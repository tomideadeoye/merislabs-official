import React from 'react';

const CoverSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-white font-sans">
            {/* Background Image Setup - Right Aligned with light gradient overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-[65%] z-0">
                <div className="w-full h-full bg-[url('/union-bank/marina-skyline.jpg')] bg-cover bg-left grayscale opacity-10 shadow-[inset_100px_0_100px_rgba(255,255,255,1)]"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/80 to-white"></div>
            </div>

            {/* Left Content Area */}
            <div className="relative z-10 h-full w-[55%] flex flex-col px-24 py-16">
                {/* Dual Branding Header */}
                <div className="flex items-center space-x-6 shrink-0">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="Jackson, Etti & Edu"
                        className="h-10 w-auto"
                    />
                    <div className="h-6 w-px bg-gray-300" />
                    <img
                        src="/clients/baker-hughes-logo.png"
                        alt="Baker Hughes"
                        className="h-10 w-auto object-contain"
                    />
                </div>

                {/* Main Centered Content */}
                <div className="flex-grow flex flex-col justify-center">

                    {/* Accent line */}
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="h-[2px] w-12 bg-[#E80000]" />
                        <span className="text-red-500 font-bold tracking-[0.4em] text-xs uppercase opacity-80">Legal Excellence</span>
                    </div>

                    <h1 className="text-gray-900 text-[5.5rem] font-black uppercase leading-[0.85] tracking-tighter mb-4 italic skew-x-[-4deg]">
                        Baker Hughes<br />
                        <span className="text-red-600 not-italic skew-x-0">Status Report</span><br />
                        <span className="text-gray-300">2026</span>
                    </h1>

                    <div className="mt-12 space-y-2">
                        <p className="text-gray-500 text-sm font-bold tracking-[0.5em] uppercase">
                            Litigation Portfolio Update
                        </p>
                        <div className="h-[1px] w-full bg-gradient-to-r from-gray-200 to-transparent" />
                    </div>

                    {/* Bottom Details */}
                    <div className="mt-16 flex items-center space-x-12">
                        <div className="flex flex-col">
                            <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-1">Presented on</span>
                            <div className="text-gray-900 font-mono text-sm tracking-widest">23.02.2026</div>
                        </div>
                        <div className="w-px h-8 bg-gray-200" />
                        <div className="flex flex-col">
                            <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-1">Confidentiality</span>
                            <div className="text-red-600 font-bold text-sm tracking-widest uppercase">Privileged</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Grid Pattern Overlay */}
            <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            {/* Signature Red Pulse */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
        </div>
    );
};

export default CoverSlide;
