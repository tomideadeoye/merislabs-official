import React from 'react';
import { priorities2026 } from '../data';

export const PrioritiesSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0A0A0A] font-sans">
            {/* Background branding */}
            <div className="absolute top-10 left-16 z-20 flex items-center space-x-4">
                <img
                    src="/clients/jackson etti and edu logo (1).png"
                    alt="JEE"
                    className="h-6 w-auto brightness-0 invert opacity-30"
                />
                <div className="h-4 w-px bg-white/10" />
                <span className="text-white/20 text-[10px] font-bold tracking-[0.4em] uppercase">Strategic Roadmap // 2026</span>
            </div>

            {/* Slide Title */}
            <div className="absolute top-32 left-16 right-16 z-20">
                <div className="flex items-center space-x-4 mb-3">
                    <div className="h-[2px] w-8 bg-red-600" />
                    <span className="text-red-500 font-bold tracking-[0.4em] text-xs uppercase underline-offset-8">Execution Priorities</span>
                </div>
                <h2 className="text-white text-5xl font-black uppercase tracking-tighter">
                    Forward <span className="text-red-600">Strategy</span>
                </h2>
            </div>

            {/* Content Core */}
            <div className="absolute top-[280px] bottom-24 left-16 right-16 z-10 grid grid-cols-12 gap-12">

                {/* Visual / Icon Box */}
                <div className="col-span-4 flex flex-col justify-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-red-600/20 blur-[100px] rounded-full group-hover:bg-red-600/30 transition-all duration-1000" />
                        <div className="relative w-full aspect-square border-2 border-red-600/30 rounded-sm flex items-center justify-center p-12 bg-[#0F0F0F] overflow-hidden">
                            {/* Technical Compass / Aim */}
                            <div className="absolute inset-4 border border-white/5 rounded-full" />
                            <div className="absolute inset-12 border border-white/5 rounded-full" />
                            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
                            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10" />

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[40%] h-[40%] text-red-600 animate-pulse relative z-10">
                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-8 text-center px-4">
                        <p className="text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase leading-relaxed">
                            Securing positive outcomes through proactive legal engineering
                        </p>
                    </div>
                </div>

                {/* Text Content */}
                <div className="col-span-8 flex flex-col justify-center space-y-8">
                    {priorities2026.split('\n\n').map((paragraph, index) => (
                        <div key={index} className="bg-[#111] border border-white/5 p-10 rounded-sm relative group hover:border-red-600/30 transition-all">
                            <div className="absolute top-0 left-0 w-1 h-12 bg-red-600" />
                            <div className="flex items-start space-x-6">
                                <span className="text-red-600 font-mono text-2xl font-black italic mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                    0{index + 1}
                                </span>
                                <p className="text-gray-400 leading-relaxed text-lg pt-1">
                                    {paragraph}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Frame outline aesthetic */}
            <div className="absolute inset-8 border border-white/5 pointer-events-none"></div>

            {/* Pagination / ID */}
            <div className="absolute bottom-12 left-16 text-white/20 font-mono text-xs tracking-widest">
                [ STRATEGY MODULE // 23.02 ]
            </div>
        </div>
    );
};
