"use client";

import React, { useEffect } from 'react';
import { useTheme } from 'next-themes';
import Footer from '@/components/ui/footer';
import DecksSection from '../components/DecksSection';

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
                    <DecksSection />
                </div>
            </div>
            <Footer />
        </div>
    );
}
