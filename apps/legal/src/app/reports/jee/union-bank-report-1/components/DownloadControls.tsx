'use client';

import React, { useState } from 'react';
import { Printer, Download, ChevronUp, FileText, FileCode } from 'lucide-react';

export const DownloadControls = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-[10000] no-print">
            {/* Options Menu */}
            <div className={`absolute bottom-full right-0 mb-4 space-y-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                {/* PDF Option */}
                <button
                    onClick={() => {
                        window.print();
                        setIsOpen(false);
                    }}
                    className="flex items-center gap-4 bg-white text-[#211B1B] px-6 py-4 rounded-2xl shadow-2xl hover:bg-[#F9F7ED] transition-all border border-[#211B1B]/10 group w-72"
                >
                    <div className="bg-red-600/10 p-2.5 rounded-xl group-hover:bg-red-600/20 transition-colors">
                        <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-sm uppercase tracking-tight">Export as PDF</div>
                        <div className="text-xs opacity-50 font-medium whitespace-nowrap">Official Document Format</div>
                    </div>
                </button>

                {/* Presentation Option */}
                <button
                    onClick={() => {
                        setIsOpen(false);
                    }}
                    className="flex items-center gap-4 bg-white text-[#211B1B] px-6 py-4 rounded-2xl shadow-2xl hover:bg-[#F9F7ED] transition-all border border-[#211B1B]/10 group w-72"
                >
                    <div className="bg-orange-600/10 p-2.5 rounded-xl group-hover:bg-orange-600/20 transition-colors">
                        <FileCode className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-sm uppercase tracking-tight">Presentation Mode</div>
                        <div className="text-xs opacity-50 font-medium whitespace-nowrap">PowerPoint Deck (.pptx)</div>
                    </div>
                </button>

                {/* Word Option */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 bg-white text-[#211B1B] px-6 py-4 rounded-2xl shadow-2xl hover:bg-[#F9F7ED] transition-all border border-[#211B1B]/10 group w-72"
                >
                    <div className="bg-blue-600/10 p-2.5 rounded-xl group-hover:bg-blue-600/20 transition-colors">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-sm uppercase tracking-tight">Draft Review</div>
                        <div className="text-xs opacity-50 font-medium whitespace-nowrap">Microsoft Word (.docx)</div>
                    </div>
                </button>
            </div>

            {/* Main Action Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-4 px-10 py-5 rounded-full shadow-[0_20px_50px_rgba(33,27,27,0.3)] transition-all duration-500 font-bold tracking-[0.1em] uppercase text-xs relative overflow-hidden group border-2 ${isOpen
                        ? 'bg-[#E80000] border-[#E80000] text-white'
                        : 'bg-[#211B1B] border-[#211B1B] text-white hover:bg-red-600 hover:border-red-600'
                    }`}
            >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <Download className={`w-5 h-5 relative z-10 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
                <span className="relative z-10">Download Options</span>
            </button>
        </div>
    );
};
