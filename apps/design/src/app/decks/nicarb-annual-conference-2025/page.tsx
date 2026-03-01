import { Suspense } from 'react';
import type { Metadata } from 'next';
import NicarbConferenceClient from './client';

export const metadata: Metadata = {
  title: 'NICArb Annual Conference 2025 | Strengthening Arbitration & ADR in Africa',
  description: 'NICArb 2025 Annual International Arbitration and ADR Conference - Charting a New Path. Join legal experts, arbitrators, and industry leaders for Nigeria\'s premier arbitration event.',
  keywords: [
    'NICArb',
    'arbitration conference',
    'ADR Nigeria',
    'dispute resolution',
    'international arbitration',
    'legal conference Africa',
    'commercial arbitration',
    'mediation',
    'Nigerian Institute of Chartered Arbitrators',
    'legal professionals',
  ],
  openGraph: {
    title: 'NICArb Annual Conference 2025 | Strengthening Institutional Arbitration',
    description: 'Charting a New Path - Nigeria\'s premier arbitration and ADR conference featuring expert speakers and networking opportunities.',
    url: '/decks/nicarb-annual-conference-2025',
    siteName: 'Meris Labs',
    images: [
      {
        url: '/nicarb/NICARB-LOGO-GREEN-BOLD.webp',
        width: 1200,
        height: 630,
        alt: 'NICArb Annual Conference 2025',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NICArb Annual Conference 2025',
    description: 'Strengthening Institutional Arbitration & ADR in Africa',
    images: ['/nicarb/NICARB-LOGO-GREEN-BOLD.webp'],
    creator: '@nicarb',
  },
};

export default function NicarbAnnualConference2025Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Deck...</div>}>
            <NicarbConferenceClient />
        </Suspense>
    );
}
