'use client';

import React from 'react';

export const CoverPage = () => {
    return (
        <div className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl print:shadow-none print:m-0 overflow-hidden h-full relative flex flex-col shrink-0">
            {/* Top Accent Border (Adapted from NICArb) */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0A1930] via-[#009fe3] to-[#0A1930] z-50 shadow-[0_0_20px_rgba(0,159,227,0.3)]"></div>

            {/* Geometric Corner Accents (Adapted from NICArb) */}
            <div className="absolute top-0 left-0 z-5 pointer-events-none">
                <div className="relative w-48 h-48">
                    <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-[#0A1930] to-[#009fe3]"></div>
                    <div className="absolute top-0 left-0 w-1 h-32 bg-gradient-to-b from-[#0A1930] to-[#009fe3]"></div>
                    <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-[#009fe3]/30"></div>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 z-5 pointer-events-none">
                <div className="relative w-48 h-48 translate-y-[-20%]"> {/* Adjusted for footer height */}
                    <div className="absolute bottom-0 right-0 w-32 h-1 bg-gradient-to-l from-[#0A1930] to-[#009fe3]"></div>
                    <div className="absolute bottom-0 right-0 w-1 h-32 bg-gradient-to-t from-[#0A1930] to-[#009fe3]"></div>
                    <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[#009fe3]/30"></div>
                </div>
            </div>
            {/* Minimalist Header */}
            <div className="h-[15%] w-full flex items-center justify-between px-16 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                    <img
                        src="/union-bank/logo.png"
                        alt="Union Bank"
                        className="h-16 w-auto object-contain"
                    />

                </div>

                <div className="text-right">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="Jackson Etti & Edu"
                        className="h-9 w-auto object-contain mb-2"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-gradient-to-br from-gray-50 to-white flex flex-col justify-center items-center p-16 relative overflow-hidden">
                {/* Floating Orbs - Background Layer (Adapted from NICArb) */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    {/* Large orb - top left */}
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[#009fe3]/15 via-[#0A1930]/10 to-transparent rounded-full blur-3xl"></div>
                    {/* Medium orb - middle right */}
                    <div className="absolute top-1/3 -right-24 w-72 h-72 bg-gradient-to-bl from-[#0A1930]/10 via-[#009fe3]/5 to-transparent rounded-full blur-2xl"></div>
                    {/* Small orb - bottom left */}
                    <div className="absolute bottom-32 left-16 w-48 h-48 bg-gradient-to-tr from-[#009fe3]/15 to-transparent rounded-full blur-xl"></div>
                    {/* Accent orb - center */}
                    <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-[#0A1930]/5 to-[#009fe3]/5 rounded-full blur-2xl"></div>

                    {/* Premium Decorative Rings (Adapted from request) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="relative w-[800px] h-[800px]">
                            <div className="absolute inset-0 border-[2px] border-[#009fe3]/5 rounded-full animate-[pulse_4s_infinite]"></div>
                            <div className="absolute inset-32 border border-[#0A1930]/5 rounded-full"></div>
                            <div className="absolute inset-64 border border-[#009fe3]/5 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Subtle geometric pattern */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-20 w-32 h-32 border border-[#009fe3]/10 rotate-45"></div>
                    <div className="absolute bottom-20 right-20 w-40 h-40 border border-[#0A1930]/10 rotate-12"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#009fe3]/5 rounded-full"></div>
                </div>

                <div className="relative z-10 text-center max-w-4xl space-y-12 px-8">
                    <div className="space-y-8">
                        <div className="inline-block px-6 py-2 bg-[#009fe3]/10 border border-[#009fe3]/20 rounded-full">
                            <div className="text-[#0A1930] text-sm font-bold tracking-widest uppercase">Legal Compliance Assessment</div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#0A1930] leading-tight text-center max-w-5xl mx-auto tracking-wide">
                            Report on the Comprehensive Review and Standardisation of Union Bank Plc's Legal Documentation.
                        </h1>

                        <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#009fe3] to-transparent mx-auto my-6" />

                        <div className="text-gray-700 text-lg italic max-w-2xl mx-auto px-4">
                            Legal frameworks, documentation standards, and compliance protocols for Union Bank Plc's operational efficiency.
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Line with Dots (Adapted from NICArb) */}
            <div className="relative h-1.5 w-full bg-gradient-to-r from-[#0A1930] via-[#009fe3] to-[#0A1930] shadow-[0_0_15px_rgba(0,159,227,0.3)]">
                {/* Decorative Dots on Line */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-2 h-2 bg-[#009fe3] rounded-full shadow-[0_0_8px_rgba(0,159,227,0.6)]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(0,159,227,0.4)]"></div>
                <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-2 h-2 bg-[#0A1930] rounded-full shadow-[0_0_8px_rgba(0,159,227,0.6)]"></div>
            </div>

            {/* Footer Section */}
            <div className="h-[20%] bg-gradient-to-r from-[#0A1930] to-[#009fe3] w-full flex items-center justify-center px-16 py-6 text-white relative overflow-hidden">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-32 h-32 border-2 border-[#009fe3] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 border-2 border-[#009fe3] rounded-full translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="text-center relative z-10">
                    <div className="text-sm font-medium uppercase tracking-wide text-opacity-80">Prepared For</div>
                    <div className="text-xl font-bold mt-1">Union Bank of Nigeria Plc</div>
                </div>
            </div>
        </div>
    );
};
