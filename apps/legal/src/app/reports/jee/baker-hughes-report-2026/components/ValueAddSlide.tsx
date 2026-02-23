import React from 'react';
import { valueAdd2026 } from '../data';
import { Zap } from 'lucide-react';
import { JEE_WEBSITE_URL } from '../../constants';

const ValueAddSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#F9F7ED] font-sans text-[#211B1B]">
            {/* Background branding */}
            <div className="absolute top-12 left-12 right-12 z-50 flex justify-between items-center border-b border-[#211B1B]/10 pb-6">
                <div className="flex items-center space-x-4">
                    <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="shrink-0 transition-transform hover:scale-105">
                        <img
                            src="/clients/jackson etti and edu logo (1).png"
                            alt="JEE"
                            className="h-6 w-auto object-contain opacity-80 hover:opacity-100"
                        />
                    </a>
                    <div className="h-4 w-px bg-[#211B1B]/20" />
                    <span className="text-[#211B1B]/40 text-[10px] font-bold tracking-[0.4em] uppercase">Service Portfolio . Beyond Litigation</span>
                </div>
            </div>

            {/* Scale background indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#211B1B]/[0.02] text-[40rem] font-black italic select-none z-0">
                V
            </div>

            {/* Main Content Container */}
            <div className="absolute inset-0 top-32 left-12 right-12 bottom-12 z-20 flex flex-col">
                {/* Slide Title */}
                <div className="mb-12 shrink-0">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="h-[1px] w-8 bg-red-600" />
                        <span className="text-red-500 font-bold tracking-[0.4em] text-[10px] uppercase">Support Ecosystem</span>
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#211B1B] via-[#211B1B] to-[#211B1B]/50">
                        Value-Add <span className="opacity-50">Advisory</span>
                    </h2>
                </div>

                {/* Content Grid */}
                <div className="flex-1 grid grid-cols-3 gap-8 items-stretch pt-4">
                    {valueAdd2026.map((item, index) => (
                        <div key={index} className="glass-card relative p-10 flex flex-col justify-start hover:bg-white/[0.05] transition-all duration-500 overflow-hidden group">
                            {/* Accent line */}
                            <div className="w-10 h-[1px] bg-red-600 mb-10 group-hover:w-full transition-all duration-700" />

                            {/* Decorative Icon */}
                            <div className="absolute top-8 right-8">
                                <Zap className="w-8 h-8 text-red-600/10 group-hover:text-red-600/30 transition-colors" />
                            </div>

                            <p className="text-[#211B1B]/80 font-bold text-lg leading-relaxed tracking-tight relative z-10">
                                {item}
                            </p>

                            <div className="mt-auto pt-10 flex items-center justify-between">
                                <span className="text-[#211B1B]/20 text-[9px] font-bold tracking-[0.3em] uppercase">JEE Advisory</span>
                                <span className="text-[#211B1B]/10 font-mono text-3xl font-black italic">0{index + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.03)_0%,transparent_50%)] z-0" />

            <style jsx>{`
                .glass-card {
                    background: rgba(33, 27, 27, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(33, 27, 27, 0.05);
                }
            `}</style>
        </div>
    );
};

export default ValueAddSlide;
