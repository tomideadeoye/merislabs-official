'use client';

import { JEE_WEBSITE_URL } from '../../constants';

const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] aspect-square rounded-full border-[60px] border-white" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[80%] aspect-square rounded-full border-[80px] border-[#E80000]" />
        <div className="absolute top-[20%] left-[-5%] w-[40%] aspect-square rounded-full border-[2px] border-white" />
    </div>
);

export const BackCover = () => {
    return (
        <div className="max-w-[210mm] w-full mx-auto bg-[#211B1B] shadow-2xl overflow-hidden h-[297mm] relative flex flex-col items-center justify-center shrink-0 font-sans">
            <BackgroundPattern />

            <div className="relative z-10 mb-12 text-center flex flex-col items-center">
                <img
                    src="/clients/jackson etti and edu logo (1).png"
                    alt="Jackson Etti & Edu"
                    className="h-28 w-auto brightness-0 invert relative z-10"
                />
            </div>

            <div className="w-24 h-1.5 bg-[#E80000] mb-12 relative z-10 shadow-[0_0_20px_rgba(232,0,0,0.3)]" />

            <div className="text-center space-y-6 relative z-10 px-16 max-w-2xl">
                <div className="space-y-3">
                    <h2 className="text-4xl font-serif font-black text-white uppercase">Jackson, Etti &amp; Edu</h2>
                    <p className="text-[#E80000] font-black text-xs uppercase tracking-[0.2em] opacity-80">The Full-Service Law Firm with Sector Expertise</p>
                </div>

                <div className="pt-10 space-y-10">
                    <div className="space-y-2 text-white/70 font-medium">
                        <p className="text-base">RCO Court, 3-5 Sinari Daranijo Street</p>
                        <p className="text-sm opacity-60">Off Ajose Adeogun, Victoria Island, Lagos, Nigeria</p>
                    </div>

                    <div className="grid grid-cols-2 gap-16 pt-10 border-t border-white/5 w-full max-w-sm mx-auto">
                        <div className="flex flex-col gap-2 text-left border-l border-[#E80000] pl-6">
                            <a href="tel:+23414626841" className="text-base font-black text-white hover:text-[#E80000] transition-colors tracking-tight whitespace-nowrap">
                                +234 (1) 462 6841/3
                            </a>
                            <a href="tel:+23412806989" className="text-[10px] font-black text-white/30 hover:text-white transition-all uppercase tracking-[0.4em]">
                                (1) 280 6989
                            </a>
                        </div>
                        <div className="flex flex-col gap-2 text-left border-l border-white/10 pl-6">
                            <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="text-base font-black text-white hover:text-[#E80000] transition-colors tracking-tight uppercase">
                                jee.africa
                            </a>
                            <a href="mailto:jee@jee.africa" className="text-[10px] font-black text-white/30 hover:text-white transition-all uppercase tracking-[0.4em]">
                                jee@jee.africa
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-12 w-full text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/20">© 2026 Jackson, Etti &amp; Edu. All Rights Reserved.</p>
            </div>
        </div>
    );
};
