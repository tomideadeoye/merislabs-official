import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, ExternalLink, Shield } from 'lucide-react';

interface LitigationData {
    suitNo: string;
    summary: string;
    status: string;
    nextSteps?: string;
    link?: string;
}

const LitigationSlide: React.FC<{ data: LitigationData }> = ({ data }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(data.suitNo);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#F9F7ED] font-sans text-[#211B1B]">
            {/* Header Branding */}
            <div className="absolute top-12 left-12 right-12 z-50 flex justify-between items-center border-b border-[#211B1B]/10 pb-6">
                <div className="flex items-center space-x-4">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="JEE"
                        className="h-6 w-auto object-contain opacity-80"
                    />
                    <div className="h-4 w-px bg-[#211B1B]/20" />
                    <span className="text-[#211B1B]/40 text-[10px] font-bold tracking-[0.4em] uppercase">Status Report . 2026</span>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="absolute inset-0 top-32 left-12 right-12 bottom-16 z-20 flex flex-col">

                {/* Case Header Section */}
                <div className="mb-6 shrink-0">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="h-[1px] w-8 bg-red-600" />
                        <span className="text-red-500 font-bold tracking-[0.4em] text-[10px] uppercase">Active Litigation</span>
                    </div>

                    <div className="flex items-start justify-between">
                        <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight max-w-[85%] text-transparent bg-clip-text bg-gradient-to-r from-[#211B1B] via-[#211B1B] to-[#211B1B]/50">
                            {data.suitNo}
                        </h2>
                        <div className="flex space-x-2 mt-1 shrink-0">
                            {data.link && (
                                <a
                                    href={data.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#211B1B]/5 hover:bg-[#211B1B]/10 text-[#211B1B]/40 hover:text-red-600 border border-[#211B1B]/10 transition-all p-3 rounded-md flex items-center justify-center"
                                    title="View Public Details"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                            <button
                                onClick={handleCopy}
                                className="bg-[#211B1B]/5 hover:bg-[#211B1B]/10 text-[#211B1B]/40 hover:text-[#211B1B] border border-[#211B1B]/10 transition-all p-3 rounded-md flex items-center justify-center"
                                title="Copy Suit Number"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                    {/* Summary Card */}
                    <div className="col-span-12 lg:col-span-5 h-full flex flex-col min-h-0">
                        <div className="glass-card flex-1 p-6 relative flex flex-col min-h-0 border-l-2 border-l-red-600">
                            <h3 className="text-red-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4 shrink-0">Case Summary</h3>
                            <div className="text-[#211B1B]/80 text-[13px] leading-relaxed text-justify overflow-y-auto pr-4 custom-scrollbar flex-1 whitespace-pre-wrap">
                                {data.summary}
                            </div>
                        </div>
                    </div>

                    {/* Status & Next Steps Column */}
                    <div className="col-span-12 lg:col-span-7 flex flex-col space-y-4 min-h-0 cursor-default">
                        {/* Status Card */}
                        <div className="glass-card flex-1 p-6 relative flex flex-col min-h-0">
                            <h3 className="text-[#211B1B]/50 text-[10px] font-black tracking-[0.4em] uppercase mb-4 shrink-0">Status Update</h3>
                            <div className="text-[#211B1B] text-[13px] leading-relaxed overflow-y-auto pr-4 custom-scrollbar flex-1 whitespace-pre-wrap">
                                {data.status}
                            </div>
                        </div>

                        {/* Next Steps Card */}
                        {data.nextSteps && (
                            <div className="bg-red-500/[0.03] border border-red-500/10 p-6 flex flex-col relative overflow-hidden shrink-0 group">
                                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                                    <Shield className="w-20 h-20 rotate-12 text-[#211B1B]" />
                                </div>
                                <h3 className="text-red-600 text-[10px] font-black tracking-[0.4em] uppercase mb-3 relative z-10 shrink-0">Strategic Next Steps</h3>
                                <div className="text-[#211B1B] text-[13px] font-semibold leading-relaxed relative z-10 overflow-y-auto pr-4 custom-scrollbar whitespace-pre-wrap max-h-[9rem]">
                                    {data.nextSteps}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(220,38,38,0.05)_0%,transparent_50%)] z-0" />
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <style jsx>{`
                .glass-card {
                    background: rgba(33, 27, 27, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(33, 27, 27, 0.08);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(33, 27, 27, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(232, 0, 0, 0.4);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default LitigationSlide;
