import React from 'react';

interface ClosedCaseData {
    suitNo: string;
    status: string;
}

export const ClosedCasesSlide: React.FC<{ data: ClosedCaseData, index: number, total: number }> = ({ data, index, total }) => {
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
                <span className="text-white/20 text-[10px] font-bold tracking-[0.4em] uppercase">Archive // 2025 Resolutions</span>
            </div>

            {/* Slide Title */}
            <div className="absolute top-24 left-16 right-16 z-20 flex justify-between items-end">
                <div>
                    <div className="flex items-center space-x-4 mb-3">
                        <div className="h-[2px] w-8 bg-green-500" />
                        <span className="text-green-500 font-bold tracking-[0.4em] text-xs uppercase underline-offset-8">Resolution Complete</span>
                    </div>
                    <h2 className="text-white text-5xl font-black uppercase tracking-tighter">
                        Closed <span className="text-white/30">Cases</span>
                    </h2>
                </div>
                <div className="text-white/5 text-[10rem] font-black italic leading-none select-none -mb-4">
                    {String(index + 1).padStart(2, '0')}
                </div>
            </div>

            {/* Content Core - HIGH CONTRAST */}
            <div className="absolute top-[220px] bottom-24 left-16 right-16 z-10">
                <div className="bg-[#111] border-l-8 border-green-600 rounded-sm p-10 h-full shadow-2xl relative flex flex-col">
                    <div className="absolute top-8 right-8 w-16 h-16 border-2 border-green-600/20 rounded-full flex items-center justify-center opacity-70">
                        <span className="text-green-500 text-3xl font-bold">✓</span>
                    </div>

                    <h3 className="text-white text-2xl font-black uppercase tracking-tight mb-8 max-w-[85%] leading-snug">
                        {data.suitNo}
                    </h3>

                    <div className="h-px w-20 bg-white/10 mb-8" />

                    <div className="text-gray-100 text-lg leading-relaxed text-justify space-y-6 overflow-y-auto pr-4 custom-scrollbar flex-grow">
                        {data.status.split('\n').map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Subtle Texture */}
            <div className="absolute inset-0 z-[1] opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0)', backgroundSize: '30px 30px' }} />

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
                    background: rgba(34, 197, 94, 0.4);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};
