import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface LitigationData {
    suitNo: string;
    summary: string;
    status: string;
    nextSteps?: string;
}

export const LitigationSlide: React.FC<{ data: LitigationData }> = ({ data }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(data.suitNo);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full h-full relative overflow-hidden bg-white font-sans flex flex-col p-16">
            {/* Header Branding */}
            <div className="flex items-center justify-between mb-16 relative z-30">
                <div className="flex items-center space-x-4">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="JEE"
                        className="h-6 w-auto"
                    />
                    <div className="h-4 w-px bg-gray-200" />
                    <span className="text-gray-400 text-[10px] font-bold tracking-[0.4em] uppercase">Status Report . 2026</span>
                </div>
            </div>

            {/* Suit Number Display */}
            <div className="relative z-20 mb-12">
                <div className="flex items-start justify-between group">
                    <div className="max-w-4xl">
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-widest rounded-sm">Active Suit</span>
                        </div>
                        <h2 className="text-gray-900 text-5xl font-black uppercase tracking-tighter leading-[0.9] group-hover:text-red-600 transition-colors duration-500">
                            {data.suitNo}
                        </h2>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="text-gray-400 hover:text-red-600 transition-all p-4 rounded-full bg-gray-50 hover:bg-red-50 shadow-sm border border-gray-100"
                        title="Copy Suit Number"
                    >
                        {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Content Core - STAGGERED GLASS LAYOUT */}
            <div className="relative z-10 flex-grow grid grid-cols-12 gap-8 min-h-0">

                {/* Summary Section - Left (Larger) */}
                <div className="col-span-7 flex flex-col min-h-0">
                    <div className="glass-card bg-gray-100/30 border border-gray-200/50 rounded-sm p-10 flex-1 relative overflow-hidden flex flex-col group hover:border-red-600/20 transition-all duration-700">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                            <span className="text-[12rem] font-black uppercase tracking-tighter italic leading-none">Sum</span>
                        </div>
                        <h3 className="text-red-600 text-[10px] font-black tracking-[0.5em] uppercase mb-8 flex items-center">
                            <span className="w-8 h-px bg-red-600/30 mr-4" />
                            Case Context
                        </h3>
                        <div className="text-gray-900 text-[16px] leading-[1.6] space-y-6 overflow-y-auto pr-8 custom-scrollbar flex-1 font-medium italic-none">
                            {data.summary.split('\n').map((para, i) => (
                                <p key={i} className="relative">
                                    {para}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status Section - Right (Stacked/Smaller) */}
                <div className="col-span-5 flex flex-col min-h-0 space-y-8">
                    <div className="flex-1 glass-card bg-[#0A0A0A] border border-white/5 rounded-sm p-10 flex flex-col relative overflow-hidden group/status hover:scale-[1.02] transition-all duration-700">
                        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-red-600/10 blur-[80px] rounded-full animate-float opacity-40" />

                        <div className="flex items-center space-x-3 mb-8">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-green-500 text-[9px] font-bold tracking-widest uppercase">Live Analysis</span>
                        </div>

                        <div className="text-white/90 text-[15px] leading-[1.6] space-y-4 overflow-y-auto pr-8 custom-scrollbar-light flex-1 font-light tracking-wide">
                            {data.status.split('\n').map((para, i) => (
                                <p key={i} className="hover:text-white transition-colors duration-300">{para}</p>
                            ))}
                        </div>
                    </div>

                    {/* Meta Data Pill */}
                    <div className="bg-gray-50 border border-gray-200 rounded-sm px-8 py-6 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-gray-400 text-[8px] font-bold tracking-widest uppercase mb-1">Exposure Asset</span>
                            <span className="text-gray-900 font-mono text-[10px] tracking-widest">BH_WEST_AFRICA_PORTFOLIO</span>
                        </div>
                        <div className="h-8 w-px bg-gray-200" />
                        <div className="flex flex-col items-end">
                            <span className="text-gray-400 text-[8px] font-bold tracking-widest uppercase mb-1">Last Calibration</span>
                            <span className="text-gray-900 font-mono text-[10px] tracking-widest uppercase">2026.02.23</span>
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
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar-light::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar-light::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar-light::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};
