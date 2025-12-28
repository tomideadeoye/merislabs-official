import type { Metadata } from 'next/types';
import React from 'react';
import { MorganHacksClient } from './client';

export const metadata: Metadata = {
  title: 'MorganHacks 2026 Sponsorship',
  description: 'Futuristic Tech City in a Dystopian Setting - Student-led hackathon at Morgan State University. Join us for an innovative event showcasing cutting-edge technology and creative solutions.',
  keywords: ['MorganHacks', 'hackathon', 'Morgan State University', 'student hackathon', 'tech event', 'sponsorship', 'innovation', 'coding competition'],
  openGraph: {
    title: 'MorganHacks 2026 - Futuristic Tech City Hackathon',
    description: 'Student-led hackathon at Morgan State University featuring futuristic tech city themes and dystopian settings. Join the innovation revolution.',
    url: '/decks/morganhacks-2026',
    siteName: 'Meris Labs',
    images: [
      {
        url: '/images/morganhacks/additional/Screenshot 2025-11-06 at 18.54.30.png',
        width: 1200,
        height: 630,
        alt: 'MorganHacks 2026 - Futuristic Tech City Hackathon',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MorganHacks 2026 - Futuristic Tech City Hackathon',
    description: 'Student-led hackathon at Morgan State University featuring futuristic tech city themes and dystopian settings. Join the innovation revolution.',
    images: ['/images/morganhacks/additional/Screenshot 2025-11-06 at 18.54.30.png'],
    creator: '@merislabs',
  },
};

export default function MorganHacksDeckPage() {
    console.log('=== MORGAN HACKS DECK PAGE ===');
    console.log('Rendering MorganHacksClient component');
    console.log('Container classes: container mx-auto py-8');
    console.log('Pointer events style: auto');

    return (
        <div className="container mx-auto py-8 bg-gray-900 min-h-screen" style={{ pointerEvents: 'auto' }}>
            <MorganHacksClient />
        </div>
    );
}
