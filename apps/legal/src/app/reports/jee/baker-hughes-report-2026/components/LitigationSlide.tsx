import React from 'react';

interface LitigationData {
    suitNo: string;
    summary: string;
    status: string;
    nextSteps?: string;
}

export const LitigationSlide: React.FC<{ data: LitigationData }> = ({ data }) => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0A0A0A] font-sans">
            {/* Header Branding */}
            <div className="absolute top-10 left-16 z-20 flex items-center space-x-4">
                <img
                    src="/clients/jackson etti and edu logo (1).png"
                    alt="JEE"
                    className="h-6 w-auto brightness-0 invert opacity-30"
                />
                <div className="h-4 w-px bg-white/10" />
                <span className="text-white/20 text-[10px] font-bold tracking-[0.4em] uppercase">Portfolio Update // 2026</span>
            </div>

            {/* Suit Number Header */}
            <div className="absolute top-22 left-16 right-16 z-20">
                <div className="flex items-center space-x-4 mb-2">
                    <div className="h-[2px] w-6 bg-red-600" />
                    <span className="text-red-500 font-bold tracking-[0.3em] text-[10px] uppercase">Active Litigation</span>
                </div>
                <h2 className="text-white text-2xl font-black uppercase tracking-tighter leading-tight max-w-5xl">
                    {data.suitNo}
                </h2>
            </div>

            {/* Content Core - OPTIMIZED CONTRAST & SPACE */}
            <div className="absolute top-[150px] bottom-16 left-16 right-16 z-10 grid grid-cols-12 gap-8">

                {/* Summary Column */}
                <div className="col-span-5 flex flex-col h-full overflow-hidden">
                    <div className="bg-[#111] border border-white/10 rounded-sm p-7 h-full relative group hover:border-red-600/30 transition-colors flex flex-col">
                        <div className="absolute top-0 left-0 w-1 h-12 bg-red-600" />
                        <h3 className="text-red-600 text-[10px] font-black tracking-[0.4em] uppercase mb-5 shrink-0">Case Summary</h3>
                        <div className="text-gray-100 text-[14px] leading-relaxed text-justify space-y-4 overflow-y-auto pr-4 custom-scrollbar">
                            {data.summary.split('\n').map((para, i) => (
                                <p key={i} className={i > 0 ? "mt-4" : ""}>{para}</p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status & Next Steps Column */}
                <div className="col-span-7 flex flex-col space-y-6 h-full overflow-hidden">
                    {/* Status Box */}
                    <div className="bg-[#161616] border border-white/10 rounded-sm p-7 flex-grow relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 p-3">
                            <div className="flex items-center space-x-2 bg-red-600/10 px-3 py-1 border border-red-600/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                                <span className="text-red-500 text-[9px] font-bold tracking-widest uppercase">Live Update</span>
                            </div>
                        </div>
                        <h3 className="text-white/40 text-[10px] font-black tracking-[0.4em] uppercase mb-5 shrink-0">Status Update</h3>
                        <div className="text-gray-100 text-[14px] leading-relaxed space-y-4 overflow-y-auto pr-4 custom-scrollbar">
                            {data.status.split('\n').map((para, i) => (
                                <p key={i} className={i > 0 ? "mt-4" : ""}>{para}</p>
                            ))}
                        </div>
                    </div>

                    {/* Next Steps Box (Conditional) */}
                    {data.nextSteps && (
                        <div className="bg-red-600 p-8 rounded-sm shadow-2xl relative overflow-hidden group shrink-0">
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                            <h3 className="text-white text-[10px] font-black tracking-[0.4em] uppercase mb-4 relative z-10">Strategic Next Steps</h3>
                            <p className="text-white font-bold text-[14px] leading-relaxed relative z-10 drop-shadow-sm">
                                {data.nextSteps}
                            </p>
                            {/* Decorative icon */}
                            <div className="absolute bottom-[-15px] right-[-5px] text-white/10 text-8xl font-black italic select-none">NEXT</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            {/* Outline Frame */}
            <div className="absolute inset-8 border border-white/5 pointer-events-none"></div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(232, 0, 0, 0.4);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};
