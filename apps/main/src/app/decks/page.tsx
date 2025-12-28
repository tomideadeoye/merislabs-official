"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { FileText, Download, Eye } from 'lucide-react';
import { useTheme } from 'next-themes';

interface Deck {
    id: string;
    title: string;
    description: string;
    category: string;
    lastUpdated: string;
    status: 'published' | 'draft';
    href: string;
}

const decks: Deck[] = [
    {
        id: 'nicarb-conference-2025',
        title: 'NICArb Annual Conference 2025',
        description: 'Strengthening Institutional Arbitration & ADR in Africa: Charting a New Path',
        category: 'Events & Conferences',
        lastUpdated: 'November 2025',
        status: 'published',
        href: '/decks/nicarb-annual-conference-2025'
    },
    {
        id: 'nicarb-fgn-pitch',
        title: 'NICArb-FGN Partnership Proposal',
        description: 'Pitch deck for collaboration between NICArb and the Federal Government of Nigeria',
        category: 'Pitch Deck',
        lastUpdated: 'November 2025',
        status: 'published',
        href: '/decks/nicarb-annual-conference-2025?view=pitch-deck'
    },
    {
        id: 'esg-finance-gap',
        title: 'Bridging the ESG Finance Gap',
        description: 'Demand and Supply-Side Constraints Facing Nigerian Small and Medium-Sized Enterprises (SMEs)',
        category: 'ESG & Finance',
        lastUpdated: 'September 2025',
        status: 'published',
        href: '/decks/bridging-the-esg-finance-gap'
    },
    {
        id: 'morganhacks-2026',
        title: 'MorganHacks 2026 Sponsorship',
        description: 'Futuristic Tech City in a Dystopian Setting - Student-led hackathon at Morgan State University',
        category: 'Events & Sponsorship',
        lastUpdated: 'November 2025',
        status: 'published',
        href: '/decks/morganhacks-2026'
    },
    {
        id: 'bose-adeoye-retirement',
        title: 'Mrs Bose Adeoye - Retirement Celebration',
        description: 'A celebration of an outstanding career and legacy. Retirement & Thanksgiving Service.',
        category: 'Celebration',
        lastUpdated: 'December 2024',
        status: 'published',
        href: '/decks/bose-adeoye-retirement'
    },
    {
        id: 'brandqor-workshop-2026',
        title: 'SHOW UP & SHINE 2026',
        description: 'Turn your 2025 work into 10x opportunities. BrandQor Personal Branding Workshop.',
        category: 'Workshop',
        lastUpdated: 'December 2025',
        status: 'published',
        href: '/decks/brandqor-workshop-2026'
    },
    {
        id: 'nicarb-christmas-flyers',
        title: 'NICArb flyers',
        description: 'Custom branding and outreach assets for NICArb.',
        category: 'Branding Assets',
        lastUpdated: 'December 2025',
        status: 'published',
        href: '/tools/nicarb-flyers'
    },
    {
        id: 'nicarb-email-signatures',
        title: 'NICArb Email Signatures',
        description: 'Professional standardized email signatures for unified institutional communication.',
        category: 'Branding Assets',
        lastUpdated: 'December 2025',
        status: 'published',
        href: '/tools/nicarb-signatures'
    },
    // Add more decks here as they become available
];

export default function DecksPage() {
    const { setTheme } = useTheme();

    // Force light theme for decks pages
    useEffect(() => {
        setTheme('light');
    }, [setTheme]);

    return (
        <div className="min-h-screen bg-white">
            {/* Background Ornaments */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-3xl" />
                <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-slate-50/50 rounded-full blur-3xl" />
            </div>

            <div className="container relative mx-auto py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="max-w-3xl mb-16">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                            Decks & Reports
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed">
                            Professional reports and presentations covering ESG, finance, and specialized industry research.
                        </p>
                    </div>

                    {/* Decks Grid */}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {decks.map((deck) => (
                            <div
                                key={deck.id}
                                className="group relative bg-white rounded-2xl border border-slate-200/60 p-1 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1"
                            >
                                <div className="h-full flex flex-col p-6">
                                    {/* Category & Status */}
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            {deck.category}
                                        </span>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[9px] font-bold uppercase text-slate-500">
                                                {deck.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title & Description */}
                                    <div className="flex-1 mb-8">
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                            {deck.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                            {deck.description}
                                        </p>
                                    </div>

                                    {/* Meta Data */}
                                    <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400 mb-8 pb-6 border-b border-slate-50">
                                        <div className="flex items-center gap-1">
                                            <FileText className="w-3 h-3" />
                                            <span>Report</span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                                        <span>{deck.lastUpdated}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                        <Button asChild className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200 transition-all active:scale-95">
                                            <Link href={deck.href}>
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Deck
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-12 h-12 p-0 rounded-xl border-slate-200 hover:bg-slate-50 transition-all active:scale-95 group/pdf"
                                        >
                                            <Download className="w-4 h-4 text-slate-600 group-hover/pdf:text-blue-600 transition-colors" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {decks.length === 0 && (
                        <div className="text-center py-24 rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/50">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">The archive is currently empty</h3>
                            <p className="text-slate-500">New intelligence reports will appear here as they are published.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
