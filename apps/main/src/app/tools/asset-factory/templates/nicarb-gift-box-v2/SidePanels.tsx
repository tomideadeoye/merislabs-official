'use client';

import { NICARB_BRAND } from './constants';
import { cn } from "@/lib/utils";
import { BackgroundBeams } from '@/components/ui/background-beams';
import { SovereignOrbit } from './SovereignOrbit';

interface PanelProps {
    rotation?: number;
}

const SidePanelBase = ({ title, isPortrait }: { title: string; isPortrait?: boolean }) => (
    <div className={cn(
        "w-full h-full relative overflow-hidden flex flex-col items-center justify-center bg-white transition-all duration-500",
        isPortrait ? "p-8" : "p-4"
    )}>
        <style>{`
            .silk-overlay-side {
                opacity: 0.1;
                background-image: url('https://www.transparenttextures.com/patterns/silk.png');
                mix-blend-mode: multiply;
            }
        `}</style>

        {/* Texture Overlay */}
        <div className="absolute inset-0 silk-overlay-side z-0" />

        {/* Background Beams */}
        <div className="absolute inset-0 pointer-events-none z-0">
            <BackgroundBeams className="opacity-100 scale-[1.6] -translate-x-1/4 -translate-y-1/4 rotate-[15deg]" />
            <BackgroundBeams className="opacity-70 scale-[1.4] translate-x-1/3 translate-y-1/3 -rotate-[12deg]" />
        </div>

        {/* Sovereign Orbit Accent */}
        <SovereignOrbit className={cn("-top-12 -right-12 opacity-50 scale-75 transition-all", isPortrait && "rotate-90")} />

        {/* Structural Design */}
        <div className={cn("relative z-10 flex flex-col items-center transition-all", isPortrait ? "space-y-12" : "space-y-4")}>
            {/* Top Sovereign Divider */}
            {!isPortrait && (
                <div className="w-48 h-[2px] relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a9ce46] to-transparent opacity-50"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#064802] via-[#a9ce46] to-[#064802] rounded-full shadow-[0_0_8px_rgba(169,206,70,0.3)]"></div>
                    <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-1 h-1 bg-[#a9ce46] rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                    <div className="absolute top-1/2 right-[20%] -translate-y-1/2 w-1 h-1 bg-[#064802] rounded-full"></div>
                </div>
            )}

            <div className={cn("transition-all", isPortrait ? "rotate-90 origin-center whitespace-nowrap py-12" : "")}>
                <span
                    className={cn("uppercase font-bold transition-all", isPortrait ? "tracking-[0.6em] text-xs" : "tracking-[0.4em] text-[10px] opacity-80")}
                    style={{ color: NICARB_BRAND.colors.primary, fontFamily: "'Cinzel', serif" }}
                >
                    {title}
                </span>

                {/* Archival Data */}
                <div className={cn("flex flex-col items-center mt-4 space-y-1 opacity-50 transition-all", isPortrait ? "hidden" : "")}>
                    <div className="w-8 h-px bg-[#a9ce46] mb-1" />
                    <span className="text-[5px] tracking-[0.2em] font-mono text-[#064802]">EST. 1979</span>
                    <span className="text-[5px] tracking-[0.2em] font-mono text-[#064802]">2026</span>
                </div>
            </div>

            {/* Bottom Sovereign Divider */}
            {!isPortrait && (
                <div className="w-48 h-[2px] relative mt-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a9ce46] to-transparent opacity-50"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#064802] via-[#a9ce46] to-[#064802] rounded-full shadow-[0_0_8px_rgba(169,206,70,0.3)]"></div>
                    <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-1 h-1 bg-[#a9ce46] rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                    <div className="absolute top-1/2 right-[20%] -translate-y-1/2 w-1 h-1 bg-[#064802] rounded-full"></div>
                </div>
            )}
        </div>

        {/* Accent Bars */}
        <div className={cn(
            "absolute transition-all",
            isPortrait
                ? "left-0 top-0 w-1.5 h-full bg-gradient-to-b from-transparent via-[#a9ce46]/40 to-transparent"
                : "bottom-0 left-0 h-1.5 w-full bg-gradient-to-r from-transparent via-[#a9ce46]/40 to-transparent"
        )} />
    </div>
);

export const LeftPanel = ({ rotation = 0 }: PanelProps) => {
    const isPortrait = Math.round(rotation / 90) % 2 !== 0;
    return <SidePanelBase title="Arbitration Excellence" isPortrait={isPortrait} />;
};

export const RightPanel = ({ rotation = 0 }: PanelProps) => {
    const isPortrait = Math.round(rotation / 90) % 2 !== 0;
    return <SidePanelBase title="Integrity in Practice" isPortrait={isPortrait} />;
};
