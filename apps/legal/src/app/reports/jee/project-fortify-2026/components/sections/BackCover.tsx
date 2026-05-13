'use client';

import React from 'react';

export const BackCover: React.FC = () => {
    return (
        <div className="max-w-[210mm] w-full mx-auto bg-[#1a1a1a] shadow-2xl overflow-hidden h-full relative flex flex-col items-center justify-center shrink-0">
            <div className="absolute inset-0 opacity-10" />

            {/* Premium Decorative Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative w-[500px] h-[500px]">
                        {/* Animated Rings */}
                        <div className="absolute inset-0 border-2 border-[#800020]/10 rounded-full animate-pulse"></div>
                        <div className="absolute inset-16 border border-[#800020]/5 rounded-full"></div>
                        <div className="absolute inset-32 border border-[#800020]/5 rounded-full"></div>

                        {/* Enhanced glow effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#800020]/5 via-transparent to-transparent rounded-full blur-3xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-[#800020]/5 to-transparent rounded-full blur-2xl"></div>

                        {/* Decorative Pattern Dots */}
                        <div className="absolute -top-4 left-1/2 w-3 h-3 bg-[#800020]/40 rounded-full shadow-[0_0_15px_rgba(0,159,227,0.3)]"></div>
                        <div className="absolute top-1/2 -right-4 w-2 h-2 bg-[#1a1a1a] border border-[#800020]/50 rounded-full shadow-[0_0_10px_rgba(0,159,227,0.2)]"></div>
                        <div className="absolute -bottom-4 left-1/4 w-2.5 h-2.5 bg-[#800020]/30 rounded-full"></div>
                        <div className="absolute top-1/4 -left-4 w-2 h-2 bg-[#800020]/20 rounded-full"></div>
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
            <div className="w-16 h-1 bg-[#800020] mb-12 relative z-10" />

            {/* Contact Info */}
            <div className="text-center text-white/80 space-y-4 relative z-10 px-12">
                <p className="font-serif text-2xl font-bold text-[#800020]">Jackson, Etti & Edu</p>
                <div className="text-sm tracking-widest opacity-60">The Full-Service Law Firm with Sector Expertise</div>

                <div className="pt-12 space-y-2 text-sm max-w-sm mx-auto">
                    <p>RCO Court, 3-5 Sinari Daranijo Street</p>
                    <p>Off Ajose Adeogun, Victoria Island, Lagos</p>
                    <div className="pt-8 space-y-2">
                        <div className="space-y-1">
                            <p className="text-[#800020] font-bold tracking-wider">+234 (1) 462 6841/3</p>
                            <p className="text-[#800020] font-bold tracking-wider">(1) 2806989</p>
                        </div>
                        <p className="opacity-80 text-[13px] pt-2">jee@jee.africa</p>
                        <p className="text-[#800020] font-bold pt-4 uppercase tracking-widest text-[10px]">www.jee.africa</p>
                    </div>
                </div>

                {/* Profile Image and LinkedIn */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <a 
                        href="https://www.linkedin.com/in/taiwoogbara"
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 hover:no-underline group"
                    >
                        <img 
                            src="https://media.licdn.com/dms/image/v2/D4D03AQFuh5XXx5j5Qw/profile-displayphoto-shrink_800_800/B4DZWaOFrPH4Ac-/0/1742049140562?e=1779926400&v=beta&t=9ZdcCn63OfNlDD6XQqjpSRRzI1nRgS9o8qO0yYyzGM8" 
                            alt="Taiwo Ogbara" 
                            className="w-20 h-20 rounded-full object-cover border-2 border-[#800020] group-hover:border-[#800020]/80 transition-colors"
                        />
                        <div className="text-left">
                            <p className="text-white font-medium">Taiwo Ogbara</p>
                            <p className="text-[#800020] text-sm">Senior Associate, CLDR Practice</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};
