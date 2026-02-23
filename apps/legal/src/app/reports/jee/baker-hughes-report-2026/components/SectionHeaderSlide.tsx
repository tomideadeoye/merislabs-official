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
        <div className="w-full h-full relative overflow-hidden bg-white flex flex-col items-center justify-center font-sans">
            {/* Background Grain/Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.03] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Large Faded Background Number */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-900/[0.03] text-[30rem] font-black italic select-none z-0">
                {sectionNumber}
            </div>

            {/* Glowing Accent */}
            <div className="absolute top-[20%] right-[-10%] w-[50%] aspect-square rounded-full bg-red-600/10 blur-[150px] z-0 animate-pulse" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center max-w-6xl text-center px-20">
                <div
                    onClick={() => goToSlideById('toc')}
                    className="inline-flex items-center space-x-6 mb-10 cursor-pointer group hover:scale-105 transition-transform"
                    title="Return to Table of Contents"
                >
                    <div className="h-[2px] w-16 bg-red-600 group-hover:bg-red-500 transition-colors" />
                    <span className="text-red-500 group-hover:text-red-400 font-bold tracking-[0.6em] text-sm uppercase transition-colors">Section {String(sectionNumber).padStart(2, '0')}</span>
                    <div className="h-[2px] w-16 bg-red-600 group-hover:bg-red-500 transition-colors" />
                </div>

                <h2 className="text-gray-900 text-[7.5rem] font-black uppercase tracking-tighter leading-[0.9] mb-12 italic skew-x-[-2deg]">
                    {title}
                </h2>

                {subtitle && (
                    <div className="relative inline-block">
                        <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-red-600/30" />
                        <p className="text-gray-500 text-lg font-bold tracking-[0.4em] uppercase max-w-3xl">
                            {subtitle}
                        </p>
                        <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-red-600/30" />
                    </div>
                )}
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.04] z-[1] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

            {/* Brand Logo */}
            <div className="absolute bottom-16 z-20 opacity-40 hover:opacity-100 transition-opacity">
                <img
                    src="/clients/jackson etti and edu logo (1).png"
                    alt="JEE"
                    className="h-6 w-auto"
                />
            </div>
        </div>
    );
};
