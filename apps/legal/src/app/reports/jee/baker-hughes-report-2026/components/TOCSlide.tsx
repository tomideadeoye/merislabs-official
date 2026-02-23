import React from 'react';
import { useDeckNavigation } from './NavigationContext';

export const TOCSlide = () => {
    const { goToSlideById } = useDeckNavigation();
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0A0A0A] font-sans">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            <div className="relative z-10 w-full h-full flex pt-24 px-24">
                {/* Left side content */}
                <div className="w-1/2 flex flex-col justify-center">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="h-[2px] w-12 bg-red-600 shadow-[0_0_10px_rgba(232,0,0,0.8)]" />
                        <span className="text-red-600 font-black tracking-[0.6em] text-[10px] uppercase">Portfolio Structure</span>
                    </div>

                    <h2 className="text-white text-7xl font-black uppercase tracking-tighter mb-16 leading-none italic skew-x-[-2deg]">
                        Strategic<br />
                        <span className="text-red-600 not-italic skew-x-0">Directory</span>
                    </h2>

                    <div className="space-y-4 max-w-lg">
                        {[
                            { id: '01', title: 'Pending Litigation', subtitle: 'Active legal matters across Nigeria' },
                            { id: '02', title: 'Completed Matters', subtitle: 'Resolution summary for 2025' },
                            { id: '03', title: 'Priorities for 2026', subtitle: 'Strategic alignment and goals' },
                            { id: '04', title: 'Value-Add Services', subtitle: 'Expanded legal advisory scope' }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => goToSlideById(item.id)}
                                className="group cursor-pointer flex items-center space-x-8 py-5 border-b border-white/5 hover:border-red-600/40 transition-all duration-500"
                            >
                                <span className="text-white/20 font-mono text-xl font-black group-hover:text-red-600 transition-colors">{item.id}</span>
                                <div className="flex flex-col">
                                    <span className="text-white/80 text-[22px] font-bold tracking-tight group-hover:text-white transition-colors uppercase">{item.title}</span>
                                    <span className="text-white/30 text-[9px] font-medium tracking-[0.2em] uppercase mt-1.5">{item.subtitle}</span>
                                </div>
                                <div className="flex-grow" />
                                <div className="w-2 h-2 rounded-full border border-white/20 group-hover:bg-red-600 group-hover:border-red-600 transition-all shadow-[0_0_10px_transparent] group-hover:shadow-red-600/50" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right side graphic - CINEMATIC VERSION */}
                <div className="w-1/2 flex items-center justify-center pl-24 py-16">
                    <div className="relative w-full h-full bg-[#111] rounded-sm shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 group">
                        <img
                            src="/baker_hughes_industrial_abstract_1771855197762.png"
                            alt="Background"
                            className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2000ms] opacity-60 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/40"></div>

                        {/* Brand Overlay */}
                        <div className="absolute top-12 left-12">
                            <img
                                src="/clients/jackson etti and edu logo (1).png"
                                alt="JEE"
                                className="h-6 w-auto invert brightness-0"
                            />
                        </div>

                        {/* Bottom Tag */}
                        <div className="absolute bottom-12 left-12">
                            <p className="text-white font-black text-2xl uppercase tracking-widest leading-none drop-shadow-2xl">Lagos Portfolio</p>
                            <p className="text-red-600 font-bold text-[10px] tracking-[0.5em] uppercase mt-4">Baker Hughes . 2026 Strategy</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Tracking Data */}
            <div className="absolute top-12 right-16 flex items-center space-x-6 text-white/20 font-mono text-[9px] tracking-[0.5em] uppercase">
                <span>Ref . Baker Hughes 2026</span>
                <div className="w-1 h-1 bg-red-600 animate-pulse" />
                <span>Sector . Energy</span>
            </div>
        </div>
    );
};
