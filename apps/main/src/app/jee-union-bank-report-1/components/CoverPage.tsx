'use client';

import React from 'react';

export const CoverPage = () => {
    return (
        <div className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl overflow-hidden h-[297mm] relative flex flex-col shrink-0">
            {/* Minimalist Header */}
            <div className="h-[15%] w-full flex items-center justify-between px-16 py-8 border-b border-gray-200">
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
                            Report on the Comprehensive Review and Standardisation of Union Bank Plc's Legal Documentation
                        </h1>

                        <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#009fe3] to-transparent mx-auto my-6" />

                        <div className="text-gray-700 text-lg italic max-w-2xl mx-auto px-4">
                            Legal frameworks, documentation standards, and compliance protocols for Union Bank Plc's operational efficiency
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="h-[20%] bg-gradient-to-r from-[#0A1930] to-[#009fe3] w-full flex items-center justify-center px-16 py-6 text-white">
                <div className="text-center">
                    <div className="text-sm font-medium uppercase tracking-wide text-opacity-80">Prepared For</div>
                    <div className="text-xl font-bold mt-1">Union Bank of Nigeria Plc</div>
                </div>
            </div>
        </div>
    );
};
