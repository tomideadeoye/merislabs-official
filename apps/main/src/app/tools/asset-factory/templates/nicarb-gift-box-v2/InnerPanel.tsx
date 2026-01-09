'use client';

import { NICARB_BRAND } from './constants';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { SovereignOrbit } from './SovereignOrbit';

// INNER LID PANEL - Exquisite Minimalist Style
export const InnerPanel = () => (
    <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center bg-white px-20">
        <style>{`
            .silk-overlay-inner {
                opacity: 0.08;
                background-image: url('https://www.transparenttextures.com/patterns/silk.png');
                mix-blend-mode: multiply;
            }
        `}</style>

        {/* Texture & Glow */}
        <div className="absolute inset-0 silk-overlay-inner z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-white via-[#a9ce46]/5 to-white blur-3xl opacity-40 z-0" />

        {/* Background Beams */}
        <div className="absolute inset-0 pointer-events-none z-0">
            <BackgroundBeams className="opacity-100 scale-[1.6] -translate-x-1/4 -translate-y-1/4 rotate-[15deg]" />
            <BackgroundBeams className="opacity-70 scale-[1.4] translate-x-1/3 translate-y-1/3 -rotate-[12deg]" />
        </div>

        {/* Sovereign Orbit Accent (Top Right) */}
        <SovereignOrbit className="-top-16 -right-16 opacity-60" />

        {/* Sovereign Gold Border (Inner Frame) */}
        <div className="absolute inset-6 border border-[#a9ce46]/30 pointer-events-none z-10">
            <div className="absolute inset-[2px] border border-[#064802]/10"></div>
            {/* Corner Bracket Details */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#a9ce46]/50"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#a9ce46]/50"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#a9ce46]/50"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#a9ce46]/50"></div>
        </div>

        {/* Quote Container */}
        <div className="relative z-20 text-center max-w-2xl flex flex-col items-center">

            <div className="w-48 h-[2px] relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a9ce46] to-transparent opacity-50"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#064802] via-[#a9ce46] to-[#064802] rounded-full shadow-[0_0_8px_rgba(169,206,70,0.3)]"></div>
                <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-1 h-1 bg-[#a9ce46] rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                <div className="absolute top-1/2 right-[20%] -translate-y-1/2 w-1 h-1 bg-[#064802] rounded-full"></div>
            </div>

            <blockquote className="space-y-8">
                <p
                    className="text-3xl leading-relaxed italic"
                    style={{
                        color: NICARB_BRAND.colors.primary,
                        fontFamily: "'Cormorant Garamond', serif",
                        letterSpacing: '0.02em'
                    }}
                >
                    "{NICARB_BRAND.quote}"
                </p>

                <footer className="flex flex-col items-center gap-4">
                    <div className="h-px w-24 bg-gray-100" />
                    <cite
                        className="not-italic uppercase tracking-[0.5em] font-bold text-xs"
                        style={{ color: NICARB_BRAND.colors.secondary, fontFamily: "'Cinzel', serif" }}
                    >
                        Foundation of Excellence
                    </cite>
                </footer>
            </blockquote>

            <div className="mt-16 flex items-center gap-4 opacity-20">
                <div className="w-2 h-2 rounded-full bg-[#064802]" />
                <div className="w-2 h-2 rounded-full bg-[#a9ce46]" />
                <div className="w-2 h-2 rounded-full bg-[#064802]" />
            </div>
        </div>

        {/* Corner Accents - Balanced */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l border-t opacity-10" style={{ borderColor: NICARB_BRAND.colors.primary }} />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b opacity-10" style={{ borderColor: NICARB_BRAND.colors.primary }} />
    </div>
);
