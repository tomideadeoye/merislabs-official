import type { Metadata, Viewport } from 'next/types';
import HybridESGDemoClient from './client.tsx';

export const metadata: Metadata = {
  metadataBase: new URL('https://merislabs.com'),
  title: 'Bridging the ESG Finance Gap: Unlocking Sustainable Investment in Nigeria',
  description: 'Comprehensive analysis of barriers to ESG adoption in Nigerian SMEs and actionable strategies to bridge the sustainable finance gap. Discover key insights on regulatory frameworks, funding challenges, and pathways to sustainable business growth.',
  keywords: ['ESG', 'Sustainable Finance', 'Nigeria', 'SMEs', 'Green Investment', 'ESG Barriers', 'Sustainable Development', 'Finance Gap', 'Regulatory Framework'],
  authors: [{ name: 'Meris Labs' }],
  creator: 'Meris Labs',
  publisher: 'Meris Labs',
  openGraph: {
    title: 'Bridging the ESG Finance Gap: Unlocking Sustainable Investment in Nigeria',
    description: 'Comprehensive analysis of barriers to ESG adoption in Nigerian SMEs and actionable strategies to bridge the sustainable finance gap.',
    url: '/decks/bridging-the-esg-finance-gap',
    siteName: 'Meris Labs',
    images: [
      {
        url: '/bridgin_financing_gap/incentive_vacuum_and_funding_chasm.png',
        width: 1200,
        height: 630,
        alt: 'Bridging the ESG Finance Gap - Incentive Vacuum and Funding Chasm',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bridging the ESG Finance Gap: Unlocking Sustainable Investment in Nigeria',
    description: 'Comprehensive analysis of barriers to ESG adoption in Nigerian SMEs and actionable strategies to bridge the sustainable finance gap.',
    images: ['/bridgin_financing_gap/incentive_vacuum_and_funding_chasm.png'],
    creator: '@merislabs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function HybridESGDemo() {
  return <HybridESGDemoClient />;
}
