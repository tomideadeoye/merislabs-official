import React from 'react';
import { valueAdd2026 } from '../data';

export const ValueAddSlide = () => {
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
                    <span className="text-gray-400 text-[10px] font-bold tracking-[0.5em] uppercase">Extended Advisory Scope</span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="h-px w-12 bg-red-600 shadow-[0_0_10px_rgba(232,0,0,0.5)]" />
                    <span className="text-red-600 font-black tracking-[0.4em] text-[10px] uppercase">Service Ecosystem</span>
                </div>
            </div>

            {/* Slide Title */}
            <div className="mb-20 relative z-10">
                <h2 className="text-gray-900 text-7xl font-black uppercase tracking-tighter leading-none italic skew-x-[-2deg]">
                    Value-Add<br />
                    <span className="text-red-600 not-italic skew-x-0">Services</span>
                </h2>
            </div>

            {/* Content Core - Premium Grid */}
            <div className="relative z-10 grid grid-cols-2 gap-8 flex-grow min-h-0">
                {valueAdd2026.map((item, index) => (
                    <div key={index} className="group relative glass-card bg-gray-50/30 hover:bg-white border border-gray-100 hover:border-red-600/20 p-12 rounded-sm transition-all duration-700 shadow-sm hover:shadow-2xl overflow-hidden flex flex-col justify-start">
                        {/* Background Numbering */}
                        <div className="absolute -top-6 -right-6 text-gray-900/[0.03] text-[120px] font-black italic group-hover:text-red-600/5 transition-colors select-none">
                            {String(index + 1).padStart(2, '0')}
                        </div>

                        {/* Top Accent */}
                        <div className="w-12 h-1 bg-red-600 mb-10 group-hover:w-20 transition-all duration-700 shadow-[0_0_15px_rgba(232,0,0,0.4)]" />

                        {/* Service Item Text */}
                        <p className="text-gray-800 font-bold text-[22px] leading-[1.6] tracking-tight relative z-10 group-hover:text-gray-900 transition-colors">
                            {item}
                        </p>

                        <div className="mt-auto pt-10 flex items-center space-x-4 opacity-40 group-hover:opacity-100 transition-opacity">
                            <span className="text-gray-400 font-mono text-[9px] font-bold tracking-[0.4em] uppercase group-hover:text-red-600">Protocol . JEE Adv.</span>
                            <div className="h-px flex-grow bg-gray-100 group-hover:bg-red-600/10 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            {/* Footer Reference */}
            <div className="absolute bottom-12 left-16 text-gray-400 font-mono text-[9px] tracking-[0.6em] uppercase">
                Service Delivery Matrix . SYNERGY-2026
            </div>
        </div>
    );
};
