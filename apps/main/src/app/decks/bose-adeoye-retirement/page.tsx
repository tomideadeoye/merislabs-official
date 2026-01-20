import type { Metadata } from 'next/types';
import React from 'react';
import { RetirementCelebrationClient } from './client';

export const metadata: Metadata = {
    title: 'Mrs Bose Adeoye - Retirement Celebration',
    description: 'A celebration of an outstanding career and legacy. Honoring Mrs Bose Adeoye on her retirement.',
    keywords: ['Retirement', 'Celebration', 'Mrs Bose Adeoye', 'Career', 'Legacy', 'Recognition'],
    openGraph: {
        title: 'Mrs Bose Adeoye - Retirement Celebration',
        description: 'A celebration of an outstanding career and legacy. Honoring Mrs Bose Adeoye on her retirement.',
        url: '/decks/bose-adeoye-retirement',
        siteName: 'Meris Labs',
        images: [
            {
                url: '/images/mum.jpeg',
                width: 1200,
                height: 630,
                alt: 'Mrs Bose Adeoye - Retirement Celebration',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Mrs Bose Adeoye - Retirement Celebration',
        description: 'A celebration of an outstanding career and legacy. Honoring Mrs Bose Adeoye on her retirement.',
        images: ['/images/mum.jpeg'],
    },
};

export default function BoseAdeoyeRetirementPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
            <RetirementCelebrationClient />
        </div>
    );
}
