import React from 'react';
import { useDeckNavigation } from './NavigationContext';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    sectionNumber: number;
}

export const SectionHeaderSlide: React.FC<SectionHeaderProps> = ({ title, subtitle, sectionNumber }) => {
    const { goToSlideById } = useDeckNavigation();
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0A0A0A] flex flex-col items-center justify-center font-sans">
            {/* Background Narrative Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.02] text-[40rem] font-black italic select-none">
                    {sectionNumber}
                </div>
                {/* Dynamic Lighting */}
                <div className="absolute top-[30%] left-[-10%] w-[60%] aspect-square rounded-full bg-red-600/10 blur-[180px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-red-600/5 blur-[150px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center max-w-6xl text-center px-20">
                <div
                    onClick={() => goToSlideById('toc')}
                    className="inline-flex items-center space-x-8 mb-16 cursor-pointer group"
                    title="Return to Table of Contents"
                >
                    <div className="h-px w-20 bg-red-600/50 group-hover:w-32 transition-all duration-700" />
                    <span className="text-red-500 font-black tracking-[0.8em] text-[10px] uppercase">
                        Part {String(sectionNumber).padStart(2, '0')}
                    </span>
                    <div className="h-px w-20 bg-red-600/50 group-hover:w-32 transition-all duration-700" />
                </div>

                <h2 className="text-white text-[9rem] font-black uppercase tracking-tighter leading-[0.85] mb-12 italic skew-x-[-4deg] origin-center">
                    {title}
                </h2>

                {subtitle && (
                    <div className="relative inline-block max-w-4xl">
                        <p className="text-white/40 text-xl font-light tracking-[0.3em] uppercase leading-relaxed">
                            {subtitle}
                        </p>
                    </div>
                )}
            </div>

            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.05] z-[1] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

            {/* Brand Mark */}
            <div className="absolute bottom-16 z-20 opacity-20 hover:opacity-100 transition-all duration-700">
                <img
                    src="/clients/jackson etti and edu logo (1).png"
                    alt="JEE"
                    className="h-6 w-auto invert brightness-0"
                />
            </div>

            <div className="absolute top-16 right-16 z-20 font-mono text-[8px] text-white/10 tracking-[0.5em] uppercase vertical-text">
                Strategy . 2026
            </div>
        </div>
    );
};
