'use client';

import React from 'react';

export const CoverPage = () => {
    return (
        <div className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl overflow-hidden mb-12 print:mb-0 print:shadow-none print:break-after-page h-[297mm] relative flex flex-col shrink-0 print:break-inside-avoid">
            {/* Top Section: White for Logo Contrast */}
            <div className="bg-white h-[35%] w-full flex items-center justify-center relative p-12 shrink-0 gap-16">
                <img
                    src="/union-bank/logo.png"
                    alt="Union Bank"
                    className="h-20 w-auto object-contain"
                />
                <div className="w-px h-16 bg-gray-200" />
                <img
                    src="/clients/jackson etti and edu logo (1).png"
                    alt="Jackson Etti & Edu"
                    className="h-10 w-auto object-contain"
                />
            </div>

            {/* Gold Separation Line */}
            <div className="h-2 bg-[#009fe3] w-full shrink-0" />

            {/* Bottom Section: Navy for Title with Skyline Background */}
            <div className="h-[65%] w-full flex flex-col items-center text-center relative overflow-hidden shrink-0">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-[url('/union-bank/marina-skyline.jpg')] bg-cover bg-center"
                    style={{ filter: 'brightness(0.7)' }}
                />

                {/* Blue Overlay: Slightly less opaque as requested */}
                <div className="absolute inset-0 bg-[#0A1930]/65" />

                <div className="absolute inset-0 opacity-10 bg-[url('/union-bank/pattern.png')] bg-repeat" />

                <h1 className="text-4xl font-serif font-bold mb-8 relative z-10 text-[#009fe3] leading-tight mt-12 uppercase tracking-wide px-8 drop-shadow-lg">
                    Report on the Comprehensive Review AND Standardisation of Union Bank Plc’s Legal Documentation
                </h1>

                <div className="mt-auto relative z-10 flex flex-col items-center gap-6 pb-20">
                    <div className="w-16 h-1 bg-[#009fe3]" />
                    <div className="text-white opacity-80 font-medium tracking-widest text-xs">
                        <p>PREPARED FOR</p>
                        <p className="font-bold text-xl mt-2 text-white">Union Bank of Nigeria Plc</p>
                    </div>
                    <div className="text-white opacity-60 text-xs tracking-[0.2em] mt-4 font-light">
                        DATE: FEBRUARY 12, 2026
                    </div>
                </div>
            </div>
        </div>
    );
};
