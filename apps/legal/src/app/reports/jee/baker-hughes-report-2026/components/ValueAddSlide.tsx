import React from 'react';
import { valueAdd2026 } from '../data';

export const ValueAddSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-white font-sans">
            {/* Background branding */}
            <div className="absolute top-10 left-16 z-20 flex items-center space-x-4">
                <img
                    src="/clients/jackson etti and edu logo (1).png"
                    alt="JEE"
                    className="h-6 w-auto opacity-70"
                />
                <div className="h-4 w-px bg-gray-300" />
                <span className="text-gray-400 text-[10px] font-bold tracking-[0.4em] uppercase">Service Portfolio . Beyond Litigation</span>
            </div>

            {/* Slide Title */}
            <div className="absolute top-24 left-16 right-16 z-20">
                <div className="flex items-center space-x-4 mb-3">
                    <div className="h-[2px] w-8 bg-red-600" />
                    <span className="text-red-500 font-bold tracking-[0.4em] text-xs uppercase underline-offset-8">Support Ecosystem</span>
                </div>
                <h2 className="text-gray-900 text-5xl font-black uppercase tracking-tighter">
                    Value-Add <span className="text-red-600">Services</span>
                </h2>
            </div>

            {/* Content Core - HIGH CONTRAST */}
            <div className="absolute top-[220px] bottom-24 left-16 right-16 z-10 grid grid-cols-3 gap-8 items-start">
                {valueAdd2026.map((item, index) => (
                    <div key={index} className="group relative bg-gray-50 border border-gray-200 p-10 rounded-sm h-full flex flex-col justify-start hover:border-red-600/40 transition-all duration-500 overflow-hidden shadow-sm">
                        {/* Background glowing number */}
                        <div className="absolute -top-4 -right-4 text-gray-900/[0.04] text-8xl font-black italic group-hover:text-red-600/10 transition-colors">
                            {String(index + 1).padStart(2, '0')}
                        </div>

                        {/* Top Indicator */}
                        <div className="w-10 h-1 bg-red-600 mb-8" />

                        {/* Text Content - HIGH CONTRAST */}
                        <p className="text-gray-800 font-bold text-[19px] leading-relaxed tracking-tight relative z-10">
                            {item}
                        </p>

                        <div className="mt-auto pt-8">
                            <div className="inline-flex items-center space-x-2 text-gray-400 group-hover:text-red-500/80 transition-colors">
                                <span className="text-[10px] font-bold tracking-[0.3em] uppercase">JEE Advisory</span>
                                <div className="h-px w-4 bg-current" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Outline Frame */}
            <div className="absolute inset-8 border border-gray-200 pointer-events-none"></div>

            {/* Pagination / ID */}
            <div className="absolute bottom-12 left-16 text-gray-400 font-mono text-xs tracking-widest">
                [ SERVICE MODULE . Q1-Q4.26 ]
            </div>
        </div>
    );
};
