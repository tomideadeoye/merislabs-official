'use client';

import React, { useState } from 'react';
import { Printer, Download, ChevronUp, FileText, FileCode } from 'lucide-react';

export const DownloadControls = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-[10000] no-print">
            {/* Options Menu */}
            <div className={`absolute bottom-full right-0 mb-4 space-y-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                {/* Word Option */}
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(false);
                    }}
                    className="flex items-center gap-4 bg-white text-[#211B1B] px-6 py-4 rounded-2xl shadow-2xl hover:bg-[#F9F7ED] transition-all border border-[#211B1B]/10 group w-72"
                >
                    <div className="bg-[#E80000]/10 p-2.5 rounded-xl group-hover:bg-[#E80000]/20 transition-colors">
                        <FileText className="w-6 h-6 text-[#E80000]" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-sm">Review Document</div>
                        <div className="text-xs opacity-50 font-medium">Microsoft Word (.docx)</div>
                    </div>
                </a>
            </div>

            {/* Main Action Group */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-4 bg-[#211B1B] text-white px-10 py-5 rounded-full shadow-[0_20px_50px_rgba(33,27,27,0.3)] hover:bg-[#E80000] transition-all duration-500 font-bold tracking-[0.1em] uppercase text-xs relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <Printer className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Print Report</span>
                </button>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-5 rounded-full shadow-2xl transition-all duration-500 border-2 ${isOpen ? 'bg-[#E80000] border-[#E80000] text-white rotate-180' : 'bg-white border-[#211B1B]/10 text-[#211B1B] hover:border-[#E80000] hover:text-[#E80000]'}`}
                    title="Report Options"
                >
                    <ChevronUp className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};
