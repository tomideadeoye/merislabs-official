import { Suspense } from 'react';
import type { Metadata } from 'next';
import BrandQorWorkshopClient from './client';

export const metadata: Metadata = {
  title: 'SHOW UP & SHINE 2026 | BrandQor Workshop - Personal Branding Masterclass',
  description: 'Turn your 2025 work into 10x opportunities. Join the BrandQor Workshop on December 13th, 2025. Learn strategic content creation, personal branding, and influence building for leaders and creators.',
  keywords: [
    'BrandQor',
    'personal branding workshop',
    'SHOW UP AND SHINE 2026',
    'content strategy',
    'executive branding',
    'influence building',
    'thought leadership',
    'professional development',
    'Nigeria workshop',
    'leadership development',
  ],
  openGraph: {
    title: 'SHOW UP & SHINE 2026 | BrandQor Workshop',
    description: 'Turn your 2025 work into 10x opportunities. A strategic personal branding workshop by BrandQor.',
    url: '/decks/brandqor-workshop-2026',
    siteName: 'Meris Labs',
    images: [
      {
        url: '/brandqor/public/brandqor-banner.jpeg',
        width: 1200,
        height: 630,
        alt: 'SHOW UP & SHINE 2026 - BrandQor Workshop',
      },
    ],
    locale: 'en_US',
    type: 'event',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHOW UP & SHINE 2026 | BrandQor Workshop',
    description: 'Turn your 2025 work into 10x opportunities',
    images: ['/brandqor/public/brandqor-banner.jpeg'],
    creator: '@brandqor',
  },
};

export default function BrandQorWorkshop2026Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0F1115] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#D4A76A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60 text-sm tracking-widest uppercase">Loading Workshop</p>
                </div>
            </div>
        }>
            <BrandQorWorkshopClient />
        </Suspense>
    );
}
