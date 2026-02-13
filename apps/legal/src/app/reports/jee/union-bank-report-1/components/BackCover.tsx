'use client';

import React from 'react';

export const BackCover = () => {
    return (
        <div className="max-w-[210mm] w-full mx-auto bg-[#0A1930] shadow-2xl overflow-hidden h-[297mm] relative flex flex-col items-center justify-center shrink-0">
            <div className="absolute inset-0 opacity-10 bg-[url('/union-bank/pattern.png')] bg-repeat" />

            {/* Premium Decorative Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative w-[500px] h-[500px]">
                        {/* Animated Rings */}
                        <div className="absolute inset-0 border-2 border-[#009fe3]/10 rounded-full animate-pulse"></div>
                        <div className="absolute inset-16 border border-[#009fe3]/5 rounded-full"></div>
                        <div className="absolute inset-32 border border-[#009fe3]/5 rounded-full"></div>

                        {/* Enhanced glow effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#009fe3]/5 via-transparent to-transparent rounded-full blur-3xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-[#009fe3]/5 to-transparent rounded-full blur-2xl"></div>

                        {/* Decorative Pattern Dots */}
                        <div className="absolute -top-4 left-1/2 w-3 h-3 bg-[#009fe3]/40 rounded-full shadow-[0_0_15px_rgba(0,159,227,0.3)]"></div>
                        <div className="absolute top-1/2 -right-4 w-2 h-2 bg-[#0A1930] border border-[#009fe3]/50 rounded-full shadow-[0_0_10px_rgba(0,159,227,0.2)]"></div>
                        <div className="absolute -bottom-4 left-1/4 w-2.5 h-2.5 bg-[#009fe3]/30 rounded-full"></div>
                        <div className="absolute top-1/4 -left-4 w-2 h-2 bg-[#009fe3]/20 rounded-full"></div>
                    </div>
                </div>
            </div>

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
                <div className="text-sm tracking-widest opacity-60">The Full-Service Law Firm with Sector Expertise</div>

                <div className="pt-12 space-y-2 text-sm max-w-sm mx-auto">
                    <p>RCO Court, 3-5 Sinari Daranijo Street</p>
                    <p>Off Ajose Adeogun, Victoria Island, Lagos</p>
                    <div className="pt-8 space-y-2">
                        <div className="space-y-1">
                            <a href="tel:+23414626841" className="text-[#009fe3] font-bold tracking-wider hover:underline block">+234 (1) 462 6841/3</a>
                            <a href="tel:+23412806989" className="text-[#009fe3] font-bold tracking-wider hover:underline block">(1) 2806989</a>
                        </div>
                        <a href="mailto:jee@jee.africa" className="opacity-80 text-[13px] pt-2 block hover:text-[#009fe3] transition-colors font-medium">jee@jee.africa</a>
                        <a
                            href="https://jee.africa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#009fe3] font-bold pt-4 uppercase tracking-widest text-[10px] block hover:underline"
                        >
                            www.jee.africa
                        </a>
                    </div>
                </div>
            </div>


        </div>
    );
};
