'use client';

import React from 'react';

export const BackCover = () => {
    return (
        <div className="max-w-[210mm] w-full mx-auto bg-[#0A1930] shadow-2xl overflow-hidden mb-12 print:mb-0 print:shadow-none print:break-before-page h-[297mm] relative flex flex-col items-center justify-center shrink-0 print:break-inside-avoid back-cover-print">
            <div className="absolute inset-0 opacity-10 bg-[url('/union-bank/pattern.png')] bg-repeat" />

            {/* Centered Logo */}
            <div className="relative z-10 mb-12 text-center flex flex-col items-center">
                <img
                    src="/clients/jackson etti and edu logo (1).png"
                    alt="Jackson Etti & Edu"
                    className="h-24 w-auto brightness-0 invert"
                />
            </div>

            {/* Gold Divider */}
            <div className="w-16 h-1 bg-[#009fe3] mb-12 relative z-10" />

            {/* Contact Info */}
            <div className="text-center text-white/80 space-y-4 relative z-10 px-12">
                <p className="font-serif text-2xl font-bold text-[#009fe3]">Jackson, Etti & Edu</p>
                <div className="text-sm tracking-widest uppercase opacity-60">Legal Excellence | Sector Focus</div>

                <div className="pt-12 space-y-2 text-sm max-w-sm mx-auto">
                    <p>RCO Court, 3-5 Sinari Daranijo Street</p>
                    <p>Off Ajose Adeogun, Victoria Island, Lagos</p>
                    <div className="pt-8 space-y-2">
                        <div className="space-y-1">
                            <p className="text-[#009fe3] font-bold tracking-wider">+234 (1) 462 6841/3</p>
                            <p className="text-[#009fe3] font-bold tracking-wider">(1) 2806989</p>
                        </div>
                        <p className="opacity-80 text-[13px] pt-2">jee@jee.africa</p>
                        <p className="text-[#009fe3] font-bold pt-4 uppercase tracking-widest text-[10px]">www.jee.africa</p>
                    </div>
                </div>
            </div>


        </div>
    );
};
