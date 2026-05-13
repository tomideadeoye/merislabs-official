'use client';

import React from 'react';

export const CoverPage: React.FC = () => {
    return (
        <div className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl print:shadow-none print:m-0 overflow-hidden h-full relative flex flex-col shrink-0">
            {/* Top Accent Border (Adapted from Union Bank) */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1a1a1a] via-[#800020] to-[#1a1a1a] z-50 shadow-[0_0_20px_rgba(0,159,227,0.3)]"></div>

            {/* Geometric Corner Accents */}
            <div className="absolute top-0 left-0 z-5 pointer-events-none">
                <div className="relative w-48 h-48">
                    <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-[#1a1a1a] to-[#800020]"></div>
                    <div className="absolute top-0 left-0 w-1 h-32 bg-gradient-to-b from-[#1a1a1a] to-[#800020]"></div>
                    <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-[#800020]/30"></div>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 z-5 pointer-events-none">
                <div className="relative w-48 h-48 translate-y-[-20%]">
                    <div className="absolute bottom-0 right-0 w-32 h-1 bg-gradient-to-l from-[#1a1a1a] to-[#800020]"></div>
                    <div className="absolute bottom-0 right-0 w-1 h-32 bg-gradient-to-t from-[#1a1a1a] to-[#800020]"></div>
                    <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[#800020]/30"></div>
                </div>
            </div>
            {/* Minimalist Header */}
            <div className="h-[15%] w-full flex items-center justify-between px-16 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="Jackson Etti & Edu"
                        className="h-9 w-auto object-contain"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-gradient-to-br from-gray-50 to-white flex flex-col justify-center items-center p-16 relative overflow-hidden">
                {/* Floating Orbs - Background Layer */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[#800020]/15 via-[#1a1a1a]/10 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute top-1/3 -right-24 w-72 h-72 bg-gradient-to-bl from-[#1a1a1a]/10 via-[#800020]/5 to-transparent rounded-full blur-2xl"></div>
                    <div className="absolute bottom-32 left-16 w-48 h-48 bg-gradient-to-tr from-[#800020]/15 to-transparent rounded-full blur-xl"></div>
                    <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-[#1a1a1a]/5 to-[#800020]/5 rounded-full blur-2xl"></div>

                    {/* Premium Decorative Rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="relative w-[800px] h-[800px]">
                            <div className="absolute inset-0 border-[2px] border-[#800020]/5 rounded-full animate-[pulse_4s_infinite]"></div>
                            <div className="absolute inset-32 border border-[#1a1a1a]/5 rounded-full"></div>
                            <div className="absolute inset-64 border border-[#800020]/5 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-center max-w-4xl space-y-12 px-8">
                    <div className="space-y-8">
                        <div className="inline-block px-6 py-2 bg-[#800020]/10 border border-[#800020]/20 rounded-full">
                            <div className="text-[#1a1a1a] text-sm font-bold tracking-widest uppercase">Partnership Selection Programme Submission</div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1a1a1a] leading-tight text-center max-w-5xl mx-auto tracking-wide">
                            PROJECT FORTIFY: COMMERCIAL DISPUTES PRACTICE GROWTH PLAN
                        </h1>

                        <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#800020] to-transparent mx-auto my-6" />

                        <div className="text-gray-700 text-lg italic max-w-2xl mx-auto px-4">
                            Commercial Disputes Practice Growth Plan (2026–2028)
                        </div>
                    </div>
                </div>
            </div>

            {/* Horizontal Candidate Card Section */}
            <div className="h-[20%] bg-gradient-to-br from-[#1a1a1a] via-[#2c000a] to-[#800020] w-full flex items-center justify-center px-16 text-white relative overflow-hidden group">
                {/* Subtle background texture/pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />
                
                <a 
                    href="https://www.linkedin.com/in/taiwoogbara"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-8 relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-2xl transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer no-underline group"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#800020] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <img 
                            src="https://media.licdn.com/dms/image/v2/D4D03AQFuh5XXx5j5Qw/profile-displayphoto-shrink_800_800/B4DZWaOFrPH4Ac-/0/1742049140562?e=1779926400&v=beta&t=9ZdcCn63OfNlDD6XQqjpSRRzI1nRgS9o8qO0yYyzGM8" 
                            alt="Taiwo Ogbara" 
                            className="w-20 h-20 rounded-full object-cover border-2 border-white/30 relative z-10 shadow-xl transition-transform duration-500 group-hover:border-white/50"
                        />
                    </div>
                    
                    <div className="text-left border-l border-white/10 pl-8">
                        <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40 mb-1 group-hover:text-white/60 transition-colors">Candidate Profile</div>
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-0.5">Taiwo Ogbara</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm font-light text-[#800020] bg-white/90 px-2 py-0.5 rounded inline-block font-medium">
                                Senior Associate, CLDR Practice
                            </p>
                            <div className="text-[10px] text-white/30 group-hover:text-white transition-colors">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
};
