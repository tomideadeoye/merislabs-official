'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { FileText, Shield, Scale, ExternalLink, Download, Search, Filter, Calendar, History, ChevronDown } from 'lucide-react';

type DocType = 'Act' | 'Bill' | 'Regulation' | 'Gazette';

interface Document {
    id: string;
    slug: string;
    title: string;
    category: string;
    classification: DocType;
    year: number;
    description: string;
    path: string;
    version: 'Current' | 'Previous' | 'Draft';
    date: string;
    type: string;
}

export default function LegalLibrary() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClassification, setSelectedClassification] = useState<DocType | 'All'>('All');
    const [selectedYear, setSelectedYear] = useState<number | 'All'>('All');
    const [expandedHistory, setExpandedHistory] = useState<string | null>(null);

    const documents: Document[] = [
        {
            id: 'tax-2025',
            slug: 'nigeria-tax-act',
            title: "Nigeria Tax Act, 2025",
            category: "Taxation",
            classification: "Act",
            year: 2025,
            description: "Comprehensive legislation repealing certain tax acts and enacting the Nigeria Tax Act, 2025. Governs the ascertainment of chargeable gains and disposal of assets.",
            path: "/legal/nigeria-tax-act-2025.pdf",
            version: "Current",
            date: "July 2025",
            type: "PDF"
        },
        {
            id: 'tax-2004',
            slug: 'nigeria-tax-act',
            title: "Nigeria Tax Act, 2004",
            category: "Taxation",
            classification: "Act",
            year: 2004,
            description: "Historical version of the Tax Act (Repealed). Included for comparative regulatory analysis and historical tax treatment research.",
            path: "/legal/nigeria-tax-act-2004.pdf",
            version: "Previous",
            date: "2004",
            type: "PDF"
        },
        {
            id: 'cama-2020',
            slug: 'cama',
            title: "Companies and Allied Matters Act, 2020",
            category: "Corporate",
            classification: "Act",
            year: 2020,
            description: "The primary legislation governing corporate affairs, company registration, and insolvency in Nigeria. Modernized the 1990 Act with significant ease-of-business reforms.",
            path: "/legal/cama-2020.pdf",
            version: "Current",
            date: "Aug 2020",
            type: "PDF"
        },
        {
            id: 'bofia-2020',
            slug: 'bofia',
            title: "Banks and Other Financial Institutions Act (BOFIA), 2020",
            category: "Banking",
            classification: "Gazette",
            year: 2020,
            description: "The governing framework for banking operations and other financial institutions in Nigeria. Enacted as Gazette No. 183 of Nov 2020.",
            path: "/legal/bofia-2020.pdf",
            version: "Current",
            date: "Nov 2020",
            type: "PDF"
        }
    ];

    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
            const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.category.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesClass = selectedClassification === 'All' || doc.classification === selectedClassification;
            const matchesYear = selectedYear === 'All' || doc.year === selectedYear;

            return matchesSearch && matchesClass && matchesYear;
        });
    }, [searchQuery, selectedClassification, selectedYear]);

    // Robust display logic:
    // If no search/filters are applied, group by law (slug) and show only the latest.
    // Otherwise, show all matches.
    const displayDocuments = useMemo(() => {
        if (searchQuery || selectedClassification !== 'All' || selectedYear !== 'All') {
            return filteredDocuments;
        }

        const groups = new Map<string, Document>();
        // Process in order so Current overwrites if it exists
        const sorted = [...filteredDocuments].sort((a, b) => {
            if (a.version === 'Current') return -1;
            if (b.version === 'Current') return 1;
            return b.year - a.year;
        });

        sorted.forEach(doc => {
            if (!groups.has(doc.slug)) {
                groups.set(doc.slug, doc);
            }
        });

        return Array.from(groups.values());
    }, [filteredDocuments, searchQuery, selectedClassification, selectedYear]);

    const getHistory = (slug: string) => {
        return documents.filter(d => d.slug === slug && d.version !== 'Current');
    };

    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(documents.map(d => d.year)));
        return uniqueYears.sort((a, b) => b - a);
    }, [documents]);

    const classifications: (DocType | 'All')[] = ['All', 'Act', 'Bill', 'Regulation', 'Gazette'];

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
                        Legal Repository
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
                        Legal <span className="text-[#C8B273]">Library</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                        A curated repository of Nigerian legal and regulatory frameworks.
                        Standardized document naming for permanent reference and comparative research.
                    </p>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col gap-6 mb-12">
                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-slate-500" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search legislation, acts, or circulars..."
                            className="w-full bg-[#0D1F3D] border border-slate-800 rounded-xl py-4 pl-12 pr-6 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#C8B273]/50 transition-all font-medium"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap items-center gap-10">
                        {/* Classification Filter */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mr-2">
                                <Filter className="w-3 h-3" />
                                Type
                            </div>
                            {classifications.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedClassification(type)}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${selectedClassification === type
                                        ? 'bg-[#C8B273] text-[#0A1930] border-[#C8B273]'
                                        : 'bg-transparent text-slate-400 border-slate-800 hover:border-slate-600'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        {/* Year Filter */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mr-2">
                                <Calendar className="w-3 h-3" />
                                Year
                            </div>
                            <button
                                onClick={() => setSelectedYear('All')}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${selectedYear === 'All'
                                    ? 'bg-[#C8B273] text-[#0A1930] border-[#C8B273]'
                                    : 'bg-transparent text-slate-400 border-slate-800 hover:border-slate-600'
                                    }`}
                            >
                                All
                            </button>
                            {years.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => setSelectedYear(year)}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${selectedYear === year
                                        ? 'bg-[#C8B273] text-[#0A1930] border-[#C8B273]'
                                        : 'bg-transparent text-slate-400 border-slate-800 hover:border-slate-600'
                                        }`}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Document Grid */}
                {displayDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayDocuments.map((doc) => (
                            <div key={doc.id} className="group relative bg-[#0D1F3D] border border-slate-800 rounded-2xl p-8 hover:border-[#C8B273]/30 transition-all flex flex-col">
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {doc.version === 'Current' && (
                                        <div className="px-2 py-1 rounded bg-[#C8B273]/20 border border-[#C8B273]/30 text-[10px] uppercase font-bold text-[#C8B273] tracking-tighter">
                                            Latest
                                        </div>
                                    )}
                                    <div className="px-2 py-1 rounded bg-black/30 border border-slate-700 text-[10px] uppercase font-bold text-slate-500 tracking-tighter">
                                        {doc.type}
                                    </div>
                                </div>

                                <div className="w-12 h-12 bg-[#C8B273]/10 rounded-xl flex items-center justify-center mb-6 text-[#C8B273] group-hover:scale-110 transition-transform">
                                    <Scale className="w-6 h-6" />
                                </div>

                                <div className="mb-2 flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C8B273]">{doc.classification}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500">{doc.category}</span>
                                    <span className="ml-auto text-[10px] font-bold bg-white/5 text-slate-400 px-2 py-0.5 rounded leading-none">{doc.year}</span>
                                </div>

                                <h3 className="text-xl font-bold mb-3 group-hover:text-[#C8B273] transition-colors leading-snug">
                                    {doc.title}
                                </h3>

                                <p className="text-sm text-slate-400 mb-8 leading-relaxed line-clamp-3">
                                    {doc.description}
                                </p>

                                <div className="mt-auto flex flex-col gap-4">
                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-4">
                                        <a
                                            href={doc.path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#C8B273] text-[#0A1930] rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            View {doc.classification}
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

                                    {/* History/Versions section - only show if not currently filtering by year/search */}
                                    {getHistory(doc.slug).length > 0 && !searchQuery && selectedYear === 'All' && (
                                        <div className="pt-4 border-t border-slate-800">
                                            <button
                                                onClick={() => setExpandedHistory(expandedHistory === doc.slug ? null : doc.slug)}
                                                className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8B273] hover:text-white transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <History className="w-3 h-3" />
                                                    View Version History ({getHistory(doc.slug).length})
                                                </div>
                                                <ChevronDown className={`w-3 h-3 transition-transform ${expandedHistory === doc.slug ? 'rotate-180' : ''}`} />
                                            </button>

                                            {expandedHistory === doc.slug && (
                                                <div className="mt-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                                    {getHistory(doc.slug).map(hist => (
                                                        <a
                                                            key={hist.id}
                                                            href={hist.path}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-slate-800 hover:border-slate-700 transition-all text-xs group/item"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-200">{hist.year} Version</span>
                                                                <span className="text-[10px] text-slate-500 uppercase tracking-wider">{hist.classification}</span>
                                                            </div>
                                                            <ExternalLink className="w-3 h-3 text-slate-500 group-hover/item:text-[#C8B273]" />
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-[#0D1F3D] border border-slate-800 rounded-3xl">
                        <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-300">No matching documents found</h3>
                        <p className="text-slate-500 mt-2">Try adjusting your filters or search query.</p>
                    </div>
                )}

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
