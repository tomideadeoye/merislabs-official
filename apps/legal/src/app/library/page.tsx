'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Shield, Scale, ExternalLink, Download, Search } from 'lucide-react';

export default function LegalLibrary() {
    const documents = [
        {
            title: "Nigeria Tax Act, 2025",
            category: "Taxation",
            description: "Comprehensive legislation repealing certain tax acts and enacting the Nigeria Tax Act, 2025. Governs the ascertainment of chargeable gains and disposal of assets.",
            path: "/legal/NIGERIA-TAX-ACT-2025.pdf",
            date: "July 2025",
            type: "PDF"
        },
        {
            title: "Companies and Allied Matters Act, 2020",
            category: "Corporate",
            description: "The primary legislation governing corporate affairs, company registration, and insolvency in Nigeria. Modernized the 1990 Act with significant ease-of-business reforms.",
            path: "/legal/CAMA-2020.pdf",
            date: "Aug 2020",
            type: "PDF"
        },
        {
            title: "Banks and Other Financial Institutions Act (BOFIA), 2020",
            category: "Banking",
            description: "The governing framework for banking operations and other financial institutions in Nigeria. Enacted as Gazette No. 183 of Nov 2020.",
            path: "/legal/BOFIA-2020-GAZETTE.pdf",
            date: "Nov 2020",
            type: "PDF"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0A1930] text-white selection:bg-[#C8B273] selection:text-[#0A1930]">
            {/* Background Pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-5">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #C8B273 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
                {/* Header Section */}
                <div className="mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8B273]/10 border border-[#C8B273]/20 text-[#C8B273] text-xs font-bold uppercase tracking-widest mb-6">
                        <Shield className="w-3 h-3" />
                        Sovereign Repository
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
                        Legal <span className="text-[#C8B273]">Library</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                        A curated baseline of Nigerian legal and regulatory frameworks.
                        Standardized for institutional research and strategic compliance.
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="relative mb-12">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search legislation, acts, or circulars..."
                        className="w-full bg-[#0D1F3D] border border-slate-800 rounded-xl py-4 pl-12 pr-6 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#C8B273]/50 transition-all"
                    />
                </div>

                {/* Document Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc, idx) => (
                        <div key={idx} className="group relative bg-[#0D1F3D] border border-slate-800 rounded-2xl p-8 hover:border-[#C8B273]/30 transition-all">
                            <div className="absolute top-4 right-4">
                                <div className="px-2 py-1 rounded bg-black/30 border border-slate-700 text-[10px] uppercase font-bold text-slate-500 tracking-tighter">
                                    {doc.type}
                                </div>
                            </div>

                            <div className="w-12 h-12 bg-[#C8B273]/10 rounded-xl flex items-center justify-center mb-6 text-[#C8B273] group-hover:scale-110 transition-transform">
                                <Scale className="w-6 h-6" />
                            </div>

                            <div className="mb-2 flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C8B273]">{doc.category}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                <span className="text-[10px] uppercase tracking-widest text-slate-500">{doc.date}</span>
                            </div>

                            <h3 className="text-xl font-bold mb-3 group-hover:text-[#C8B273] transition-colors">
                                {doc.title}
                            </h3>

                            <p className="text-sm text-slate-400 mb-8 leading-relaxed line-clamp-3">
                                {doc.description}
                            </p>

                            <div className="flex items-center gap-4">
                                <a
                                    href={doc.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#C8B273] text-[#0A1930] rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    View
                                </a>
                                <a
                                    href={doc.path}
                                    download
                                    className="w-12 h-12 flex items-center justify-center bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
                                    title="Download Copy"
                                >
                                    <Download className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="mt-24 pt-12 border-t border-slate-800 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold">
                        Jackson, Etti & Edu • Sovereign Research Intelligence
                    </p>
                </div>
            </main>
        </div>
    );
}
