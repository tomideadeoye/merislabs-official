'use client';

import React from 'react';
import Image from 'next/image';

export const CoverPage: React.FC = () => {
    return (
        <div className="relative h-full flex flex-col justify-between pt-24 pb-12 px-16 bg-[#05386f] text-white overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/banwo-bg.jpg"
                    alt="Background"
                    fill
                    className="object-cover opacity-40"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#05386f] via-[#05386f]/80 to-transparent" />
            </div>

            <div className="flex flex-col gap-12 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-1 bg-[#D4AF37]" />
                    <div className="text-xl font-bold tracking-[0.3em] uppercase gold-shimmer">
                        Banwo & Ighodalo
                    </div>
                </div>

                <div className="max-w-xl">
                    <h1 className="text-7xl font-bold font-header leading-[1] tracking-tighter mb-8 italic text-white">
                        Bridging the <br />
                        <span className="text-[#D4AF37] not-italic">ESG Finance</span> <br />
                        Gap
                    </h1>
                    <div className="w-32 h-[1px] bg-[#D4AF37]/30 mb-8" />
                    <p className="text-lg font-medium text-white/70 leading-relaxed uppercase tracking-widest">
                        Demand and Supply-Side Constraints Facing Nigerian Small and Medium-Sized Enterprises (SMEs)
                    </p>
                </div>
            </div>

            <div className="flex justify-end items-end relative z-10">
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/10">
                    <Image
                        src="/assets/banwo-logo.webp"
                        alt="Banwo & Ighodalo Logo"
                        width={220}
                        height={70}
                        className="object-contain"
                    />
                </div>
            </div>
            
            {/* Background geometric accents */}
            <div className="absolute top-0 right-0 w-[60%] h-[70%] bg-white/[0.03] -z-10" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-black/[0.1] -z-10" style={{ clipPath: 'polygon(0 100%, 100% 100%, 0 0)' }} />
        </div>
    );
};
