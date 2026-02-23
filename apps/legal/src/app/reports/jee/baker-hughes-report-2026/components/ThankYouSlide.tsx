import React from 'react';

const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-5%] w-[40%] aspect-square rounded-full border-[40px] border-white" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[50%] aspect-square rounded-full border-[60px] border-[#E80000]" />
        <div className="absolute top-[10%] left-[5%] w-[20%] aspect-square rounded-full border-[2px] border-white" />
    </div>
);

export const ThankYouSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#211B1B] p-12 flex flex-col items-center justify-center border-4 border-[#211B1B] font-sans">
            <BackgroundPattern />

            {/* Header / Brand Connection */}
            <div className="absolute top-8 right-12 z-20 flex space-x-3 items-center">
                <div className="font-bold text-xl text-white tracking-tight">Baker Hughes</div>
                <div className="w-4 h-4 bg-teal-600 rounded-sm"></div>
            </div>

            {/* Centered Top Content */}
            <div className="relative z-10 w-full flex flex-col items-center">
                <h1 className="text-white text-5xl font-black uppercase tracking-[0.2em] text-center drop-shadow-md mb-8">
                    Thank You For<br />
                    <span className="text-red-500">Your Attention</span>
                </h1>

                {/* Signature JEE Red Divider */}
                <div className="w-24 h-1.5 bg-[#E80000] mb-8 relative z-10 shadow-[0_0_20px_rgba(232,0,0,0.3)]" />

                {/* Logo Section */}
                <div className="text-center flex flex-col items-center group mb-6">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="Jackson Etti & Edu"
                        className="h-20 w-auto brightness-0 invert relative z-10"
                    />
                </div>
            </div>

            {/* Agency Info Split Grid */}
            <div className="relative z-10 px-8 max-w-4xl w-full mt-6">
                <div className="grid grid-cols-2 gap-16 pt-8 border-t border-white/10 w-full">
                    <div className="flex flex-col gap-4 text-left border-l border-[#E80000] pl-6">
                        <div className="space-y-1 text-white/70 font-medium">
                            <p className="text-md font-bold text-white">RCO Court, 3-5 Sinari Daranijo Street</p>
                            <p className="text-sm opacity-60">Off Ajose Adeogun, Victoria Island, Lagos</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 text-left border-l border-white/10 pl-6 justify-center">
                        <div className="flex flex-row justify-between w-full pr-8">
                            <a href="tel:+23414626841" className="text-base font-black text-white hover:text-[#E80000] transition-colors tracking-tight whitespace-nowrap">
                                +234 (1) 462 6841
                            </a>
                            <a href="https://jee.africa" target="_blank" className="text-base font-black text-white hover:text-[#E80000] transition-colors tracking-tight uppercase">
                                jee.africa
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Copyright */}
            <div className="absolute bottom-6 w-full text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/20">© 2026 Jackson, Etti & Edu. All Rights Reserved.</p>
            </div>
        </div>
    );
};
