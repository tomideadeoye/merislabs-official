import React from 'react';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { JEE_WEBSITE_URL } from '../../constants';

interface ClosedCaseData {
    suitNo: string;
    status: string;
    link?: string;
}

const ClosedCasesSlide: React.FC<{ data: ClosedCaseData, index: number, total: number }> = ({ data, index, total }) => {
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
                    <span className="text-[#211B1B]/40 text-[10px] font-bold tracking-[0.4em] uppercase">Archive . 2025 Resolutions</span>
                </div>
            </div>

            {/* Scale background indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#211B1B]/[0.02] text-[40rem] font-black italic select-none z-0">
                {String(index + 1).padStart(2, '0')}
            </div>

            {/* Main Content Container */}
            <div className="absolute inset-0 top-32 left-12 right-12 bottom-16 z-20 flex flex-col">
                {/* Slide Title */}
                <div className="mb-10 shrink-0">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="h-[1px] w-8 bg-green-500" />
                        <span className="text-green-500 font-bold tracking-[0.4em] text-[10px] uppercase">Resolution Complete</span>
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#211B1B] via-[#211B1B] to-[#211B1B]/50">
                        Closed <span className="opacity-50">Cases</span>
                    </h2>
                </div>

                {/* Content Box */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="glass-card flex-1 p-6 relative flex flex-col min-h-0 border-l-2 border-l-green-600">
                        {/* Status Icon & Link */}
                        <div className="absolute top-6 right-6 flex items-center space-x-4">
                            {data.link && (
                                <a
                                    href={data.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#211B1B]/5 hover:bg-[#211B1B]/10 text-[#211B1B]/40 hover:text-green-600 border border-[#211B1B]/10 transition-all p-3 rounded-full flex items-center justify-center cursor-pointer relative z-50"
                                    title="View Public Details"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            )}
                            <CheckCircle2 className="w-12 h-12 text-green-500/30" />
                        </div>

                        {/* Suit Number */}
                        <h3 className="text-[#211B1B] text-xl font-bold uppercase tracking-tight mb-8 max-w-[85%] leading-snug shrink-0">
                            {data.suitNo}
                        </h3>

                        <div className="h-px w-20 bg-[#211B1B]/10 mb-8 shrink-0" />

                        {/* Description - Compact for PDF */}
                        <div className="text-[#211B1B]/80 text-[14px] leading-relaxed text-left flex-1 overflow-y-auto pr-4 custom-scrollbar whitespace-pre-wrap max-w-[95%]">
                            {data.status}
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.05)_0%,transparent_50%)] z-0" />
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <style jsx>{`
                .glass-card {
                    background: rgba(33, 27, 27, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(33, 27, 27, 0.08);
                }
            `}</style>
        </div>
    );
};

export default ClosedCasesSlide;
