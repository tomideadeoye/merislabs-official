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
            <div className="h-2 bg-[#C8B273] w-full shrink-0" />

            {/* Bottom Section: Navy for Title */}
            <div className="bg-[#0A1930] h-[65%] w-full p-16 flex flex-col items-center text-center relative overflow-hidden shrink-0">
                <div className="absolute inset-0 opacity-10 bg-[url('/union-bank/pattern.png')] bg-repeat" />

                <h1 className="text-5xl font-serif font-bold mb-6 relative z-10 text-[#C8B273] leading-tight mt-12">
                    Comprehensive Review <br />& Standardisation
                </h1>
                <p className="text-sm uppercase tracking-[0.3em] font-medium opacity-90 relative z-10 text-white">
                    Legal Documentation Suite
                </p>

                <div className="mt-auto relative z-10 flex flex-col items-center gap-6 pb-8">
                    <div className="w-16 h-1 bg-[#C8B273]" />
                    <div className="text-white opacity-80 font-medium">
                        <p>PREPARED FOR</p>
                        <p className="font-bold text-lg mt-1">Union Bank of Nigeria</p>
                    </div>
                    <div className="text-white opacity-60 text-sm mt-4">
                        DATE: FEBRUARY 12, 2026
                    </div>
                </div>
            </div>
        </div>
    );
};
