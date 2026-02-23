import React from 'react';
import { priorities2026 } from '../data';
import { useDeckNavigation } from './NavigationContext';

export const PrioritiesSlide = () => {
    const { goToSlideById } = useDeckNavigation();
    return (
        <div className="w-full h-full relative overflow-hidden bg-white font-sans flex flex-col p-16">
            {/* Header Branding */}
            <div className="flex items-center justify-between mb-20 relative z-30">
                <div className="flex items-center space-x-4">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="JEE"
                        className="h-6 w-auto opacity-80"
                    />
                    <div className="h-4 w-px bg-gray-200" />
                    <span className="text-gray-400 text-[10px] font-bold tracking-[0.5em] uppercase">2026 Strategic Mandate</span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="h-px w-12 bg-red-600 shadow-[0_0_10px_rgba(232,0,0,0.5)]" />
                    <span className="text-red-600 font-black tracking-[0.4em] text-[10px] uppercase">Strategic Roadmap</span>
                </div>
            </div>

            {/* Content Core */}
            <div className="relative z-10 flex-grow grid grid-cols-12 gap-16 min-h-0">

                {/* Visual Strategy Column */}
                <div className="col-span-5 flex flex-col justify-center">
                    <h2 className="text-gray-900 text-[6rem] font-black uppercase tracking-tighter leading-[0.85] mb-12 italic skew-x-[-4deg] origin-left">
                        Forward<br />
                        <span className="text-red-600 not-italic skew-x-0">Strategy</span>
                    </h2>

                    <div className="relative group max-w-sm">
                        <div className="absolute inset-0 bg-red-600/5 blur-[100px] rounded-full group-hover:bg-red-600/15 transition-all duration-1000" />
                        <div className="relative glass-card bg-white/50 border border-red-600/20 rounded-sm p-12 overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="text-gray-200 font-mono text-[80px] font-black opacity-40 select-none">2026</span>
                            </div>
                            <p className="text-gray-500 font-bold tracking-[0.4em] text-[10px] uppercase mb-12 relative z-10">2026 Core Pillars</p>

                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center space-x-4">
                                    <div className="w-2 h-2 bg-red-600 rounded-full" />
                                    <span className="text-gray-900 font-black text-xs tracking-widest uppercase italic">Commercial Resolution</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-2 h-2 bg-gray-900 rounded-full" />
                                    <span className="text-gray-900 font-black text-xs tracking-widest uppercase italic">Matter Oversight</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                                    <span className="text-gray-900 font-black text-xs tracking-widest uppercase italic">Asset Recovery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Priority Cards Column */}
                <div className="col-span-7 flex flex-col justify-start space-y-6 min-h-0">
                    <div className="flex-1 overflow-y-auto pr-8 custom-scrollbar space-y-8">
                        {priorities2026.split('\n\n').map((paragraph, index) => (
                            <div key={index} className="relative group slide-transition">
                                <div className="absolute -left-4 top-0 bottom-0 w-px bg-gray-100 group-hover:bg-red-600/30 transition-colors" />
                                <div className="bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-red-600/20 p-10 rounded-sm transition-all duration-700 shadow-sm hover:shadow-xl">
                                    <div className="flex items-start space-x-10">
                                        <div className="flex flex-col items-center">
                                            <span className="text-red-600 font-mono text-3xl font-black italic opacity-20 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <div className="w-px h-12 bg-gray-200 mt-4 group-hover:bg-red-600/30 transition-colors" />
                                        </div>
                                        <p className="text-gray-800 leading-[1.8] text-[17px] font-medium tracking-wide">
                                            {paragraph}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Bar */}
                    <div className="mt-8 flex items-center justify-between px-10 py-8 bg-[#0A0A0A] rounded-sm group cursor-pointer overflow-hidden relative"
                        onClick={() => goToSlideById('04')}>
                        <div className="absolute inset-0 bg-red-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 opacity-10" />
                        <div className="relative z-10 flex flex-col">
                            <span className="text-white/30 text-[9px] font-bold tracking-[0.5em] uppercase mb-1">Up Next</span>
                            <span className="text-white text-sm font-black tracking-widest uppercase">Value-Add Advisory Services</span>
                        </div>
                        <div className="relative z-10 w-12 h-12 flex items-center justify-center border border-white/10 rounded-full group-hover:border-red-600 group-hover:bg-red-600 transition-all duration-500">
                            <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: rgba(232, 0, 0, 0.2);
                }
            `}</style>
        </div>
    );
};
