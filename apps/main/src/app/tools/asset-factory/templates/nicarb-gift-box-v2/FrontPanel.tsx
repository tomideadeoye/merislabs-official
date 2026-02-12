'use client';

import { NICARB_BRAND } from './constants';
import { cn } from "@/lib/utils";
import { BackgroundBeams } from '@/components/ui/background-beams';
import { SovereignOrbit } from './SovereignOrbit';

// FRONT PANEL - With Lagos Skyline Image
interface PanelProps {
    rotation?: number;
}

// FRONT PANEL - With Lagos Skyline Image
export const FrontPanel = ({ rotation = 0 }: PanelProps) => {
    const isPortrait = Math.round(rotation / 90) % 2 !== 0;

    return (
        <div className={cn(
            "w-full h-full relative overflow-hidden flex bg-white transition-all duration-500",
            isPortrait ? "flex-row items-center justify-center p-4" : "flex-col"
        )}>
            <style>{`
                .silk-overlay-front {
                    opacity: 0.4;
                    background-image: radial-gradient(circle at center, #00000000 0%, #00000005 100%);
                    mix-blend-mode: multiply;
                }
            `}</style>

            {/* Texture Overlay */}
            <div className="absolute inset-0 silk-overlay-front pointer-events-none z-0" />

            {/* Background Beams */}
            <div className="absolute inset-0 pointer-events-none z-0 print:hidden">
                <BackgroundBeams className="opacity-100 scale-[1.6] -translate-x-1/4 -translate-y-1/4 rotate-[15deg]" />
                <BackgroundBeams className="opacity-70 scale-[1.4] translate-x-1/3 translate-y-1/3 -rotate-[12deg]" />
            </div>

            {/* Geometric Corner Accents */}
            {!isPortrait && (
                <>
                    <div className="absolute top-0 left-0 z-5 pointer-events-none opacity-40">
                        <div className="relative w-32 h-32">
                            <div className="absolute top-0 left-0 w-24 h-[1.5px] bg-gradient-to-r from-[#064802] to-[#a9ce46]"></div>
                            <div className="absolute top-0 left-0 w-[1.5px] h-24 bg-gradient-to-b from-[#064802] to-[#a9ce46]"></div>
                        </div>
                    </div>

                    <div className="absolute bottom-12 right-0 z-5 pointer-events-none opacity-40">
                        <div className="relative w-32 h-32">
                            <div className="absolute bottom-0 right-0 w-24 h-[1.5px] bg-gradient-to-l from-[#064802] to-[#a9ce46]"></div>
                            <div className="absolute bottom-0 right-0 w-[1.5px] h-24 bg-gradient-to-t from-[#064802] to-[#a9ce46]"></div>
                        </div>
                    </div>
                </>
            )}

            {/* Sovereign Orbit Accent */}
            <SovereignOrbit className={cn("-top-16 -right-16 rotate-180 transition-all", isPortrait && "opacity-0")} />

            {/* Main Content */}
            <div className={cn(
                "flex flex-col items-center z-20 text-center transition-all",
                isPortrait ? "space-y-4 px-2" : "flex-1 pt-12 px-8"
            )}>

                {/* Minimal Logo Display */}
                <div className={cn("transition-all", isPortrait ? "mb-2" : "mb-6")}>
                    <img src={NICARB_BRAND.logo} alt="NICArb Logo" className={cn("object-contain transition-all", isPortrait ? "w-24" : "w-40")} />
                </div>

                {/* Premium 3-Dot Accent Bar */}
                <div className={cn("relative transition-all", isPortrait ? "w-[2px] h-32" : "w-80 h-[2px] mb-8")}>
                    <div className={cn(
                        "absolute inset-0 rounded-full shadow-[0_0_10px_rgba(169,206,70,0.3)]",
                        isPortrait
                            ? "bg-gradient-to-b from-[#064802] via-[#a9ce46] to-[#064802]"
                            : "bg-gradient-to-r from-[#064802] via-[#a9ce46] to-[#064802]"
                    )}></div>
                    <div className={cn("absolute bg-[#a9ce46] rounded-full", isPortrait ? "left-1/2 top-1/4 -translate-x-1/2 w-1.5 h-1.5" : "top-1/2 left-1/4 -translate-y-1/2 w-1.5 h-1.5")}></div>
                    <div className={cn("absolute bg-white rounded-full shadow-sm", isPortrait ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2" : "top-1/2 left-1/2 -translate-y-1/2 w-2 h-2")}></div>
                    <div className={cn("absolute bg-[#064802] rounded-full", isPortrait ? "left-1/2 bottom-1/4 -translate-x-1/2 w-1.5 h-1.5" : "top-1/2 left-3/4 -translate-y-1/2 w-1.5 h-1.5")}></div>
                </div>

                {/* Title Section */}
                <div className={cn("flex flex-col items-center", isPortrait && "scale-75")}>
                    <h1
                        className="uppercase tracking-[0.2em] font-black leading-tight mb-1"
                        style={{ color: NICARB_BRAND.colors.primary, fontSize: isPortrait ? '0.6rem' : '0.8rem', fontFamily: "'Cinzel', serif" }}
                    >
                        Nigerian Institute of<br />
                        <span className="tracking-[0.08em]">Chartered Arbitrators</span>
                    </h1>

                    {/* Motto / Tagline */}
                    <div className={cn("flex items-center justify-center transition-all", isPortrait ? "flex-col gap-2 mt-4" : "gap-3 mt-2")}>
                        <div className={cn("bg-[#6b9b2d] transition-all", isPortrait ? "w-4 h-0.5" : "w-0.5 h-4")}></div>
                        <p
                            className="italic font-medium text-[#064802]"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: isPortrait ? '0.7rem' : '0.9rem',
                                letterSpacing: '0.03em'
                            }}
                        >
                            {NICARB_BRAND.tagline}
                        </p>
                    </div>
                </div>
            </div>

            {/* Lagos Skyline Image */}
            {!isPortrait && (
                <div className="absolute bottom-12 left-0 right-0 w-full h-[20%] z-10 flex items-end justify-center pointer-events-none">
                    <img
                        src={NICARB_BRAND.skylineImage}
                        alt="Lagos Skyline"
                        className="w-[70%] object-bottom opacity-[0.25] saturate-0 contrast-125"
                    />
                </div>
            )}

            {/* Bottom Accent - Thicker Gradient Line */}
            <div className={cn(
                "relative z-30 transition-all shadow-[0_0_15px_rgba(169,206,70,0.3)]",
                isPortrait
                    ? "w-1.5 h-full bg-gradient-to-b from-[#064802] via-[#a9ce46] to-[#064802] order-first mr-4"
                    : "h-1.5 w-full bg-gradient-to-r from-[#064802] via-[#a9ce46] to-[#064802]"
            )} />

            {/* Enhanced Sovereign Footer */}
            <div className={cn(
                "bg-[#064802] flex flex-col items-center justify-center z-30 overflow-hidden relative transition-all",
                isPortrait ? "w-12 h-full py-12" : "h-14 w-full px-12"
            )}>
                {/* Security Micro-Text Strip */}
                <div className={cn("absolute opacity-30 select-none overflow-hidden", isPortrait ? "inset-y-0 left-1 h-full" : "inset-x-0 top-1 w-full")}>
                    <div className={cn("whitespace-nowrap flex gap-4 transition-all", isPortrait ? "flex-col items-center h-full justify-center" : "w-full justify-center")}>
                        {Array(8).fill("NIGERIAN INSTITUTE OF CHARTERED ARBITRATORS • LEADERSHIP • INTEGRITY • ").map((text, i) => (
                            <span key={i} className={cn("text-[4px] tracking-[0.2em] font-mono text-[#a9ce46]", isPortrait && "rotate-90 origin-center whitespace-nowrap")}>
                                {text}
                            </span>
                        ))}
                    </div>
                </div>

                <span className={cn(
                    "text-[#a9ce46] font-bold uppercase tracking-[0.4em] opacity-90 transition-all",
                    isPortrait ? "text-[6px] rotate-90 origin-center whitespace-nowrap mt-4" : "text-[9px] mt-2"
                )}>
                    Leadership & Integrity in Arbitration
                </span>
            </div>
        </div>
    );
};
