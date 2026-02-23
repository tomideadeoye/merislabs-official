import React from 'react';

export const TOCSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0A0A0A] font-sans">
            {/* Background Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square rounded-full bg-red-600/5 blur-[120px] z-0" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square rounded-full bg-white/5 blur-[120px] z-0" />

            {/* Inverted Logo */}
            <div className="absolute top-12 left-16 z-20">
                <img
                    src="/clients/jackson etti and edu logo (1).png"
                    alt="JEE"
                    className="h-8 w-auto brightness-0 invert opacity-60"
                />
            </div>

            <div className="relative z-10 w-full h-full flex pt-32 px-24">
                {/* Left side content */}
                <div className="w-1/2 flex flex-col justify-start pt-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="h-[2px] w-8 bg-red-600" />
                        <span className="text-red-600 font-bold tracking-[0.4em] text-xs uppercase">Structure</span>
                    </div>

                    <h2 className="text-white text-6xl font-black uppercase tracking-tighter mb-10">
                        Table of <span className="text-red-600">Contents</span>
                    </h2>

                    <div className="space-y-2 max-w-md">
                        {[
                            { id: '01', title: 'Pending Litigation', subtitle: 'Active legal matters across Nigeria' },
                            { id: '02', title: 'Completed Matters', subtitle: 'Resolution summary for 2025' },
                            { id: '03', title: 'Priorities for 2026', subtitle: 'Strategic alignment and goals' },
                            { id: '04', title: 'Value-Add Services', subtitle: 'Expanded legal advisory scope' }
                        ].map((item, idx) => (
                            <div key={idx} className="group cursor-pointer flex items-center space-x-6 py-4 border-b border-white/5 hover:border-red-600/50 transition-all">
                                <span className="text-red-600 font-mono text-xl font-bold opacity-40 group-hover:opacity-100 transition-opacity">{item.id}</span>
                                <div className="flex flex-col">
                                    <span className="text-white text-xl font-bold tracking-tight group-hover:text-red-500 transition-colors uppercase">{item.title}</span>
                                    <span className="text-gray-500 text-[10px] font-medium tracking-wide uppercase mt-1">{item.subtitle}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right side graphic */}
                <div className="w-1/2 flex items-center justify-center p-12">
                    <div className="relative w-full aspect-[4/5] bg-[#111] rounded-sm shadow-2xl overflow-hidden border border-white/10 group">
                        <div className="absolute inset-0 bg-[url('/union-bank/marina-skyline.jpg')] bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-60"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>

                        {/* Overlay text */}
                        <div className="absolute bottom-8 left-8">
                            <p className="text-white font-black text-2xl uppercase tracking-widest leading-none">Jackson, Etti & Edu</p>
                            <p className="text-red-600 font-bold text-sm tracking-[0.3em] uppercase mt-2">Lagos Portfolio</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Frame outline aesthetic */}
            <div className="absolute inset-8 border border-white/5 pointer-events-none"></div>

            {/* Page indicator - MOVED to avoid clashing with 03/04 */}
            <div className="absolute top-14 right-16 text-white/10 font-mono text-[9px] tracking-widest uppercase">
                Directory Reference // SEQ. 02
            </div>
        </div>
    );
};
