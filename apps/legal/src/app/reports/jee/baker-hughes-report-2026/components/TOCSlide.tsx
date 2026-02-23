import React from 'react';
import { useDeckNavigation } from './NavigationContext';
import { litigationCases, closedCases2025 } from '../data';
import { JEE_WEBSITE_URL } from '../../constants';

const TOCSlide = () => {
    const { goToSlideById } = useDeckNavigation();

    // Helper to get short name from suitNo
    const getShortName = (suitNo: string) => {
        const partiesPart = suitNo.split('PARTIES:')[1] || suitNo.split('-')[1];
        if (!partiesPart) return suitNo.substring(0, 40) + '...';
        return partiesPart.trim();
    };

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
                    <span className="text-[#211B1B]/40 text-[10px] font-bold tracking-[0.4em] uppercase">Status Report . 2026</span>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full h-full flex flex-col pt-36 px-12">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="h-[1px] w-8 bg-red-600" />
                    <span className="text-red-500 font-bold tracking-[0.5em] text-[10px] uppercase">Directory</span>
                </div>

                <h2 className="text-5xl font-black uppercase tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#211B1B] via-[#211B1B] to-[#211B1B]/50">
                    Portfolio <span className="text-red-600">Breakdown</span>
                </h2>

                <div className="grid grid-cols-12 gap-12 flex-1 min-h-0">
                    {/* Section 01: Pending Litigation (2 Columns) */}
                    <div className="col-span-12 xl:col-span-8 flex flex-col min-h-0">
                        <div
                            onClick={() => goToSlideById('01')}
                            className="group cursor-pointer flex items-center space-x-4 mb-4 border-b border-[#211B1B]/10 pb-2 hover:bg-white/[0.02] transition-all px-2 -ml-2 rounded-t-sm"
                        >
                            <span className="text-red-600 font-mono text-lg font-bold">01</span>
                            <span className="text-[#211B1B] text-lg font-bold tracking-tight uppercase group-hover:text-red-500 transition-colors">Pending Litigation</span>
                            <span className="text-[#211B1B]/20 text-[9px] font-bold tracking-widest uppercase ml-auto">Active Portfolio ({litigationCases.length})</span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-1 overflow-y-auto custom-scrollbar pr-4">
                            {litigationCases.map((caseItem, idx) => (
                                <div
                                    key={idx}
                                    className="py-1.5 border-b border-white/[0.03] group/item cursor-pointer"
                                    onClick={() => goToSlideById(`case:litigation:${idx}`)}
                                >
                                    <div className="flex items-start space-x-3">
                                        <span className="text-red-600/30 text-[9px] font-mono mt-1 group-hover/item:text-red-600 transition-colors">{String(idx + 1).padStart(2, '0')}</span>
                                        <div className="flex flex-col">
                                            <span className="text-[#211B1B]/60 text-[11px] font-bold uppercase tracking-tight line-clamp-1 group-hover/item:text-[#211B1B] transition-colors">
                                                {getShortName(caseItem.suitNo)}
                                            </span>
                                            <span className="text-[#211B1B]/20 text-[8px] font-mono uppercase tracking-tighter">
                                                {caseItem.suitNo.split(' ')[2]}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Other Sections */}
                    <div className="col-span-12 xl:col-span-4 flex flex-col space-y-8">
                        {/* Section 02: Completed */}
                        <div>
                            <div
                                onClick={() => goToSlideById('02')}
                                className="group cursor-pointer flex items-center space-x-4 mb-4 border-b border-[#211B1B]/10 pb-2 hover:bg-white/[0.02] transition-all px-2 -ml-2"
                            >
                                <span className="text-red-600 font-mono text-lg font-bold">02</span>
                                <span className="text-[#211B1B] text-lg font-bold tracking-tight uppercase group-hover:text-red-500 transition-colors">Completed</span>
                            </div>
                            <div className="space-y-2">
                                {closedCases2025.slice(0, 4).map((caseItem, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center space-x-3 opacity-40 hover:opacity-100 cursor-pointer transition-opacity"
                                        onClick={() => goToSlideById(`case:closed:${idx}`)}
                                    >
                                        <div className="w-1 h-1 rounded-full bg-green-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-tight line-clamp-1">{getShortName(caseItem.suitNo)}</span>
                                    </div>
                                ))}
                                {closedCases2025.length > 4 && (
                                    <span
                                        className="text-[9px] text-[#211B1B]/20 italic pl-4 cursor-pointer hover:text-[#211B1B]/50"
                                        onClick={() => goToSlideById('02')}
                                    >
                                        + {closedCases2025.length - 4} more finalized matters
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Section 03 & 04 */}
                        <div className="space-y-2">
                            {[
                                { id: '03', title: 'Priorities 2026', desc: 'Strategic Objectives' },
                                { id: '04', title: 'Value-Add', desc: 'Beyond Litigation Advisory' }
                            ].map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => goToSlideById(item.id)}
                                    className="group cursor-pointer flex items-center space-x-4 py-3 border-b border-[#211B1B]/5 hover:bg-white/[0.02] transition-all px-2 -ml-2"
                                >
                                    <span className="text-red-600 font-mono text-lg font-bold">{item.id}</span>
                                    <div className="flex flex-col">
                                        <span className="text-[#211B1B] text-sm font-bold tracking-tight uppercase group-hover:text-red-500 transition-colors">{item.title}</span>
                                        <span className="text-[#211B1B]/20 text-[9px] uppercase tracking-widest">{item.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.03)_0%,transparent_50%)] z-0" />

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(33, 27, 27, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(232, 0, 0, 0.2);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default TOCSlide;
