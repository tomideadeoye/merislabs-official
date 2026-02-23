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
        <div className="w-full h-full relative overflow-hidden bg-white font-sans">
            {/* Header Branding */}
            <div className="absolute top-10 left-16 z-20 flex items-center space-x-4">
                <img
                    src="/clients/jackson etti and edu logo (1).png"
                    alt="JEE"
                    className="h-6 w-auto opacity-70"
                />
                <div className="h-4 w-px bg-gray-300" />
                <span className="text-gray-400 text-[10px] font-bold tracking-[0.4em] uppercase">Portfolio Update // 2026</span>
            </div>

            <div className="absolute top-22 left-16 right-16 z-20">
                <div className="flex items-center space-x-4 mb-2">
                    <div className="h-[2px] w-6 bg-red-600" />
                    <span className="text-red-500 font-bold tracking-[0.3em] text-[10px] uppercase">Active Litigation</span>
                </div>
                <div className="flex items-center space-x-4 group">
                    <h2 className="text-gray-900 text-2xl font-black uppercase tracking-tighter leading-tight max-w-5xl">
                        {data.suitNo}
                    </h2>
                    <button
                        onClick={handleCopy}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-full hover:bg-gray-100"
                        title="Copy Suit Number"
                    >
                        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <Link href={`/lawyers?suit=${encodeURIComponent(data.suitNo)}`} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-full hover:bg-gray-100" title="View Counsel Directory">
                        <ExternalLink className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Content Core - STACKED LAYOUT CONSISTENT WITH SVG GUIDE */}
            <div className="absolute top-[130px] bottom-16 left-16 right-16 z-10 flex flex-col space-y-6">

                {/* Summary Section - Larger Box */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="bg-gray-50 border border-gray-200 rounded-sm p-8 h-full relative group hover:border-red-600/30 shadow-sm transition-colors flex flex-col overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-16 bg-red-600" />
                        <h3 className="text-red-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4 shrink-0">Case Summary</h3>
                        <div className="text-gray-700 text-[15px] leading-relaxed text-justify space-y-4 overflow-y-auto pr-6 custom-scrollbar flex-1">
                            {data.summary.split('\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status & Next Steps Section - Secondary Box */}
                <div className="flex-[0.8] flex flex-col space-y-6 min-h-0">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-sm p-8 flex flex-col relative overflow-hidden group/status hover:border-red-600/30 shadow-sm transition-colors min-h-0">
                        <Link href={`/audit?search=${encodeURIComponent(data.suitNo)}`} className="absolute top-0 right-0 p-3 z-20 cursor-pointer">
                            <div className="flex items-center space-x-1.5 bg-red-600/5 hover:bg-red-600/10 px-3 py-1 border border-red-600/20 hover:border-red-200 transition-colors rounded-sm group/badge">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                                <span className="text-red-600 group-hover/badge:text-red-700 text-[9px] font-bold tracking-widest uppercase transition-colors">Live Status Update</span>
                                <ExternalLink className="w-3 h-3 text-red-600 opacity-0 group-hover/badge:opacity-100 transition-opacity ml-1" />
                            </div>
                        </Link>
                        <h3 className="text-gray-400 text-[10px] font-black tracking-[0.4em] uppercase mb-4 shrink-0">Current Status Update</h3>
                        <div className="text-gray-700 text-[15px] leading-relaxed space-y-4 overflow-y-auto pr-6 custom-scrollbar flex-1">
                            {data.status.split('\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                    </div>

                    {/* Next Steps - Integrated if exists */}
                    {data.nextSteps && (
                        <div className="bg-red-600 p-6 rounded-sm shadow-xl relative overflow-hidden group shrink-0">
                            <div className="absolute inset-0 bg-white/5 group-hover:bg-white/0 transition-colors" />
                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex-1">
                                    <h3 className="text-white text-[10px] font-black tracking-[0.4em] uppercase mb-2">Strategic Next Steps</h3>
                                    <p className="text-white font-bold text-[14px] leading-relaxed drop-shadow-sm">
                                        {data.nextSteps}
                                    </p>
                                </div>
                                <div className="text-white/20 text-5xl font-black italic select-none ml-4 self-end">NEXT</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            {/* Outline Frame */}
            <div className="absolute inset-8 border border-gray-200 pointer-events-none"></div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(232, 0, 0, 0.4);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};
