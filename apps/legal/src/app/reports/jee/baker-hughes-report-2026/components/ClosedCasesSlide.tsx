import React from 'react';

interface ClosedCaseData {
    suitNo: string;
    status: string;
}

export const ClosedCasesSlide: React.FC<{ data: ClosedCaseData, index: number, total: number }> = ({ data, index, total }) => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-white font-sans flex flex-col p-16">
            {/* Header Branding */}
            <div className="flex items-center justify-between mb-16 relative z-30">
                <div className="flex items-center space-x-4">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="JEE"
                        className="h-6 w-auto opacity-80"
                    />
                    <div className="h-4 w-px bg-gray-200" />
                    <span className="text-gray-400 text-[10px] font-bold tracking-[0.5em] uppercase">Archive . 2025 Resolution Matrix</span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="h-px w-12 bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.5)]" />
                    <span className="text-emerald-600 font-black tracking-[0.4em] text-[10px] uppercase">Finalized Case Status</span>
                </div>
            </div>

            {/* Content Core */}
            <div className="relative z-10 grid grid-cols-12 gap-16 flex-grow min-h-0">
                {/* Left Side: Case Info */}
                <div className="col-span-5 flex flex-col justify-center">
                    <div className="mb-8">
                        <span className="text-emerald-600 font-mono text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Case Seq . {String(index + 1).padStart(2, '0')}</span>
                        <h2 className="text-gray-900 text-6xl font-black uppercase tracking-tighter leading-none italic skew-x-[-2deg]">
                            Case<br />
                            <span className="text-emerald-600 not-italic skew-x-0">Closed</span>
                        </h2>
                    </div>

                    <div className="glass-card bg-emerald-50/30 border border-emerald-100 p-8 rounded-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="w-10 h-10 rounded-full border border-emerald-200 flex items-center justify-center text-emerald-600 font-black">✓</div>
                        </div>
                        <p className="text-emerald-800/40 font-mono text-[9px] font-bold uppercase tracking-[0.4em] mb-6">Docket Reference</p>
                        <h3 className="text-gray-900 text-xl font-black uppercase tracking-tight leading-snug">
                            {data.suitNo}
                        </h3>
                    </div>
                </div>

                {/* Right Side: Resolution Narrative */}
                <div className="col-span-7 flex flex-col justify-center">
                    <div className="relative group slide-transition h-full flex flex-col">
                        <div className="absolute -left-8 top-0 bottom-0 w-px bg-emerald-100 group-hover:bg-emerald-600/30 transition-colors" />

                        <div className="flex-grow glass-card bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-emerald-600/20 p-12 rounded-sm transition-all duration-700 shadow-sm hover:shadow-2xl overflow-hidden flex flex-col">
                            <span className="text-emerald-600 font-black tracking-[0.4em] text-[10px] uppercase mb-10 flex items-center space-x-2">
                                <span className="w-4 h-px bg-emerald-600" />
                                <span>Resolution Process & Finality</span>
                            </span>

                            <div className="flex-1 overflow-y-auto pr-6 custom-scrollbar text-gray-800 text-[18px] leading-[1.8] font-medium tracking-wide space-y-6">
                                {data.status.split('\n').map((para, i) => (
                                    <p key={i} className="text-justify">{para}</p>
                                ))}
                            </div>

                            <div className="mt-12 pt-10 border-t border-emerald-50 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-emerald-600 font-black text-[9px] tracking-[0.4em] uppercase">Status Check</span>
                                    <span className="text-gray-900 font-bold text-xs uppercase italic">Archived Successfully</span>
                                </div>
                                <div className="px-4 py-2 bg-emerald-600/10 rounded-full border border-emerald-600/20">
                                    <span className="text-emerald-600 font-black text-[9px] tracking-[0.2em] uppercase">Secured</span>
                                </div>
                            </div>
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
                    background: rgba(5, 150, 105, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: rgba(5, 150, 105, 0.3);
                }
            `}</style>
        </div>
    );
};
