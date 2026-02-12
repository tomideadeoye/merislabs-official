'use client';
import { NICARB_BRAND } from './constants';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { SovereignOrbit } from './SovereignOrbit';

/**
 * TOP PANEL - RESTORED ORIGINAL DESIGN (VARIANT A)
 * This file contains the exact original logic and visual design for the Top Panel
 * as requested.
 */
export const TopPanel = ({ rotation = 0 }: { rotation?: number }) => {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,400;1,600&display=swap');

                .nicarb-panel-base {
                    background-color: white;
                    background-image: radial-gradient(circle at center, #ffffff 0%, #f8f8f8 100%);
                    box-shadow: inset 0 0 100px rgba(6, 72, 2, 0.03); /* Sovereign Vignette */
                }
                .from-the-label {
                    font-family: 'Cormorant Garamond', serif;
                    font-style: italic;
                    color: #064802;
                    opacity: 0.9;
                    font-size: 1.1rem;
                    margin-bottom: 0px;
                    letter-spacing: 0.05em;
                }
                .silk-overlay-inner {
                    opacity: 0.4;
                    background-image: radial-gradient(circle at center, #00000000 0%, #00000005 100%);
                    mix-blend-mode: multiply;
                }
            `}</style>

            <div className="w-full h-full relative nicarb-panel-base flex flex-row items-center justify-between px-20 py-12 overflow-hidden antialiased">
                {/* 0. Background Beams (Aggressive Corner Spread & High Opacity) */}
                <div className="absolute inset-0 pointer-events-none z-0 print:hidden">
                    <BackgroundBeams className="opacity-100 scale-[1.6] -translate-x-1/4 -translate-y-1/4 rotate-[15deg]" />
                    <BackgroundBeams className="opacity-70 scale-[1.4] translate-x-1/3 translate-y-1/3 -rotate-[12deg]" />
                </div>

                {/* Decorative Top-Right Sovereign Orbit */}
                <SovereignOrbit className="-top-16 -right-16" />

                {/* 1. LEFT PILLAR: Spine & Logo Block */}
                <div className="flex items-center gap-8 relative z-20 h-full">
                    {/* The Spine Line */}
                    <div className="flex flex-col items-center h-full justify-center">
                        <div
                            className="w-[2px] relative"
                            style={{
                                background: `linear-gradient(to bottom, #064802, #a9ce46, #064802)`,
                                height: '240px',
                                boxShadow: '0 0 15px rgba(169, 206, 70, 0.4)'
                            }}
                        >
                            <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#a9ce46] rounded-full shadow-[0_0_8px_rgba(169,206,70,0.8)]"></div>
                            <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(169,206,70,0.6)]"></div>
                            <div className="absolute top-[75%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#064802] rounded-full shadow-[0_0_8px_rgba(169,206,70,0.8)]"></div>
                        </div>
                        {/* Integrated Spine Text - Vertical RL */}
                        <div className="mt-4 flex justify-center overflow-visible">
                            <p className="text-[6px] font-bold uppercase tracking-[0.3em] text-[#064802]/50 whitespace-nowrap" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                                EST. 1979 • NICArb EXCELLENCE • 2026
                            </p>
                        </div>
                    </div>

                    {/* Logo & Header */}
                    <div className="flex flex-col items-start gap-6">
                        <img
                            src={NICARB_BRAND.logo}
                            alt="NICArb Logo"
                            className="w-[180px] object-contain flex-shrink-0"
                        />
                        <div className="flex flex-col space-y-4">
                            <span className="from-the-label">From the</span>
                            <h1 className="font-serif font-black uppercase tracking-[0.08em] leading-[1.2]" style={{ color: '#064802', fontSize: '1.5rem' }}>
                                Nigerian Institute Of<br />
                                Chartered Arbitrators
                            </h1>
                            <p className="text-[13px] font-medium uppercase tracking-[0.25em] text-[#064802]/50 max-w-[320px] leading-relaxed">
                                {NICARB_BRAND.tagline}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. RIGHT PILLAR: Graphic Asset (Map) */}
                <div className="relative w-[320px] h-[320px] flex items-center justify-center opacity-95 z-20 flex-shrink-0">
                    <div className="absolute inset-0 border-2 border-[#a9ce46]/30 rounded-full animate-pulse"></div>
                    <div className="absolute inset-4 border border-[#064802]/20 rounded-full"></div>

                    {/* Decorative Green Dots around Map */}
                    <div className="absolute -top-1 left-1/2 w-3 h-3 bg-[#a9ce46] rounded-full shadow-[0_0_10px_rgba(169,206,70,0.6)]"></div>
                    <div className="absolute top-1/2 -right-1 w-2 h-2 bg-[#064802] rounded-full shadow-[0_0_8px_rgba(6,72,2,0.5)]"></div>
                    <div className="absolute bottom-[10%] left-[10%] w-2.5 h-2.5 bg-[#a9ce46] rounded-full shadow-[0_0_10px_rgba(169,206,70,0.6)]"></div>
                    <div className="absolute top-[20%] -left-1 w-2 h-2 bg-[#064802] rounded-full shadow-[0_0_8px_rgba(6,72,2,0.5)]"></div>

                    <div className="absolute inset-0 bg-gradient-to-br from-[#a9ce46]/20 via-[#064802]/10 to-transparent rounded-full blur-3xl"></div>
                    <img src={NICARB_BRAND.conferenceMapImage} alt="Conference Map" className="w-[85%] h-[85%] object-contain filter contrast-[1.05] relative z-10" />
                </div>
            </div>
        </>
    );
};
