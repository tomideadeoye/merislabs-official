"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    // Add more decks here as they become available
];

import Footer from '@/components/ui/footer';

export default function DecksPage() {
    const { setTheme } = useTheme();

    // Force light theme for decks pages
    useEffect(() => {
        setTheme('light');
    }, [setTheme]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="h2 font-playfair-display text-slate-900 mb-4">Decks & Reports</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Professional reports and presentations covering ESG, finance, and business insights.
                        </p>
                    </div>

                    {/* Decks Grid */}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {decks.map((deck) => (
                            <Card key={deck.id} className="hover:shadow-2xl transition-all duration-300 border-slate-200">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl font-bold text-slate-900 mb-2">{deck.title}</CardTitle>
                                            <CardDescription className="text-sm text-slate-600 mb-3">
                                                {deck.description}
                                            </CardDescription>
                                        </div>
                                        <Badge
                                            variant={deck.status === 'published' ? 'default' : 'secondary'}
                                            className="ml-2 uppercase tracking-wider text-[10px]"
                                        >
                                            {deck.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mt-2">
                                        <span className="uppercase tracking-widest">{deck.category}</span>
                                        <span>{deck.lastUpdated}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex gap-3">
                                        <Link href={deck.href} className="flex-1">
                                            <Button variant="default" size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                                <Eye className="w-4 h-4 mr-2" />
                                                Explore
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm" disabled className="text-slate-400">
                                            <Download className="w-4 h-4 mr-2" />
                                            PDF
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {decks.length === 0 && (
                        <div className="text-center py-20">
                            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">No decks available</h3>
                            <p className="text-slate-600">Check back later for new reports and presentations.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
