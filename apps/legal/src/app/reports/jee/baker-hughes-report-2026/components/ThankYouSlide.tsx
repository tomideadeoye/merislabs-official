import React from 'react';

const ThankYouSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#F9F7ED] flex flex-col items-center justify-center font-sans text-[#211B1B]">
            {/* Background Graphic - Refracted light / Grain */}
            <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />

            {/* Massive Faded Logo Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#211B1B]/[0.02] text-[40rem] font-black italic select-none z-0">
                JEE
            </div>

            {/* Glowing Focal Point */}
            <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[60%] aspect-square rounded-full bg-red-600/5 blur-[150px] z-0 animate-pulse" />

            <div className="relative z-10 flex flex-col items-center text-center">
                {/* JEE Logo */}
                <div className="mb-20 scale-150 opacity-90">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="Jackson, Etti & Edu"
                        className="h-10 w-auto object-contain"
                    />
                </div>

                <div className="h-px w-24 bg-red-600 mb-12 shadow-[0_0_20px_rgba(232,0,0,0.5)]" />

                <h2 className="text-[#211B1B] text-9xl font-black uppercase tracking-tighter leading-none mb-12 italic skew-x-[-2deg]">
                    Thank <span className="text-red-600">You.</span>
                </h2>

                <div className="space-y-4">
                    <p className="text-[#211B1B]/40 text-xl font-bold tracking-[0.5em] uppercase">
                        Legal Excellence in Partnership
                    </p>
                    <div className="flex justify-center items-center space-x-6">
                        <span className="text-[#211B1B]/30 text-xs font-mono tracking-widest whitespace-nowrap uppercase">JEE . Baker Hughes</span>
                        <div className="w-1 h-1 rounded-full bg-red-600" />
                        <span className="text-[#211B1B]/30 text-xs font-mono tracking-widest whitespace-nowrap uppercase">2026 Status Update</span>
                    </div>
                </div>
            </div>

            {/* Contact Details Bottom */}
            <div className="absolute bottom-16 w-full flex justify-center space-x-24 z-20">
                <div className="flex flex-col items-center">
                    <span className="text-[#211B1B]/20 text-[10px] font-bold tracking-[0.4em] uppercase mb-2">Location</span>
                    <span className="text-[#211B1B]/80 text-xs font-bold tracking-widest">LAGOS, NIGERIA</span>
                </div>
                <div className="flex flex-col items-center border-x border-[#211B1B]/5 px-12">
                    <span className="text-[#211B1B]/20 text-[10px] font-bold tracking-[0.4em] uppercase mb-2">Digital</span>
                    <span className="text-[#211B1B]/80 text-xs font-bold tracking-widest uppercase">www.JEE.africa</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[#211B1B]/20 text-[10px] font-bold tracking-[0.4em] uppercase mb-2">Security</span>
                    <span className="text-[#211B1B]/80 text-xs font-bold tracking-widest uppercase">Encrypted Deck</span>
                </div>
            </div>

            {/* Scanning Line Animation Effect */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent shadow-[0_0_15px_rgba(232,0,0,0.5)]" />
        </div>
    );
};

export default ThankYouSlide;
