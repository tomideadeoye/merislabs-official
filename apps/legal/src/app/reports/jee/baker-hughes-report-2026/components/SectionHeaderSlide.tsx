import React from 'react';
import { useDeckNavigation } from './NavigationContext';
import { JEE_WEBSITE_URL } from '../../constants';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    sectionNumber: number;
}

const SectionHeaderSlide: React.FC<SectionHeaderProps> = ({ title, subtitle, sectionNumber }) => {
    const { goToSlideById } = useDeckNavigation();
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#F9F7ED] flex flex-col items-center justify-center font-sans text-[#211B1B]">
            {/* Background Grain/Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.03] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Large Faded Background Number */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#211B1B]/[0.02] text-[40rem] font-black italic select-none z-0 leading-none">
                {String(sectionNumber).padStart(2, '0')}
            </div>

            {/* Glowing Accent */}
            <div className="absolute top-[20%] right-[-10%] w-[50%] aspect-square rounded-full bg-red-600/5 blur-[150px] z-0 animate-pulse" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center max-w-6xl text-center px-20">
                <div
                    onClick={() => goToSlideById('toc')}
                    className="inline-flex items-center space-x-6 mb-12 cursor-pointer group hover:scale-105 transition-transform"
                    title="Return to Table of Contents"
                >
                    <div className="h-[1px] w-12 bg-red-600 group-hover:bg-red-500 transition-colors" />
                    <span className="text-red-500 group-hover:text-red-400 font-bold tracking-[0.5em] text-xs uppercase transition-colors">Section {String(sectionNumber).padStart(2, '0')}</span>
                    <div className="h-[1px] w-12 bg-red-600 group-hover:bg-red-500 transition-colors" />
                </div>

                <h2 className="text-[#211B1B] text-[8rem] font-black uppercase tracking-tighter leading-[0.9] mb-12 italic skew-x-[-2deg] text-transparent bg-clip-text bg-gradient-to-b from-[#211B1B] via-[#211B1B] to-[#211B1B]/40">
                    {title}
                </h2>

                {subtitle && (
                    <div className="relative inline-block mt-4">
                        <p className="text-[#211B1B]/40 text-xl font-bold tracking-[0.5em] uppercase max-w-4xl px-12 border-x border-red-600/20">
                            {subtitle}
                        </p>
                    </div>
                )}
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] z-[1] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

            {/* Brand Logo */}
            <div className="absolute bottom-16 z-20 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="JEE"
                        className="h-6 w-auto object-contain transition-transform hover:scale-105"
                    />
                </a>
            </div>
        </div>
    );
};

export default SectionHeaderSlide;
