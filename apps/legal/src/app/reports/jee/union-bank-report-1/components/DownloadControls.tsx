'use client';

import React, { useState } from 'react';
import { Printer, Download, ChevronUp, FileText, FileCode } from 'lucide-react';

export const DownloadControls = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-[10000] no-print">
            {/* Options Menu */}
            <div className={`absolute bottom-full right-0 mb-4 space-y-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                {/* Docx Option */}
                <a
                    href="/reports/jee-union-bank-report.docx"
                    download
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 bg-white text-[#0A1930] px-6 py-3 rounded-xl shadow-xl hover:bg-slate-50 transition-all border border-slate-200 group w-64"
                >
                    <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-sm">Microsoft Word</div>
                        <div className="text-[10px] opacity-50 uppercase tracking-tighter">Editable (.docx)</div>
                    </div>
                </a>
            </div>

            {/* Main Action Group */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-3 bg-[#0A1930] text-white px-8 py-4 rounded-full shadow-2xl hover:bg-[#009fe3] transition-all duration-300 font-bold tracking-wider uppercase text-sm"
                >
                    <Printer className="w-5 h-5" />
                    <span>Print</span>
                </button>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-4 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'bg-[#009fe3] text-white' : 'bg-[#0A1930] text-white hover:bg-[#009fe3]'}`}
                    title="More Options"
                >
                    <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronUp className="w-6 h-6" />
                    </div>
                </button>
            </div>
        </div>
    );
};
