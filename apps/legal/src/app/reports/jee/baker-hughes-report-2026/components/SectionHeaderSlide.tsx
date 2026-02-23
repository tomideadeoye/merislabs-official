import React from 'react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    sectionNumber: number;
}

export const SectionHeaderSlide: React.FC<SectionHeaderProps> = ({ title, subtitle, sectionNumber }) => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-white p-12 flex flex-col items-center justify-center font-sans border-[12px] border-[#ececec]">
            {/* Background Accent */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] aspect-square rounded-full bg-red-500/5 blur-3xl z-0" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[50%] aspect-square rounded-full bg-red-600/5 blur-3xl z-0" />

            {/* Section Number Badge */}
            <div className="relative z-10 mb-8 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#E80000] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-red-500/20 mb-4">
                    {sectionNumber}
                </div>
                <div className="h-0.5 w-12 bg-[#E80000]" />
            </div>

            {/* Title Content */}
            <div className="relative z-10 text-center max-w-4xl px-8">
                <h2 className="text-white bg-[#211B1B] text-5xl font-black uppercase tracking-[0.2em] px-12 py-6 shadow-2xl skew-x-[-2deg] mb-6">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-red-600 text-lg font-bold tracking-[0.4em] uppercase opacity-80 mt-4 leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Brand elements */}
            <div className="absolute bottom-12 left-12 z-20 flex space-x-3 items-center opacity-40 grayscale">
                <img
                    src="/clients/jackson etti and edu logo (1).png"
                    alt="JEE"
                    className="h-8 w-auto grayscale"
                />
            </div>

            {/* Decorative Ribbon */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E80000]" style={{
                clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
            }} />
        </div>
    );
};
