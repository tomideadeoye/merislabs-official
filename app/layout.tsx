/**
 * @fileoverview Root layout component that sets up the HTML structure, global providers, and CSS imports.
 * @description This is a server component that provides the foundation for the entire application,
 * including global styles, providers, and error boundaries.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provide the root HTML structure for the Next.js application
 *   - Import global CSS and Tailwind styles
 *   - Set up providers and error boundaries
 *   - Configure font loading and meta tags
 *
 * FILEPATH: app/layout.tsx
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `./globals.css`: Global styles and Tailwind directives
 *   - `./providers.tsx`: Client-side providers wrapper
 *   - `@/components/ui/header.tsx`: Main application header
 *   - `@/components/orion/MemoryProvider.tsx`: Memory context provider
 *   - `@/components/ErrorBoundary.tsx`: Error boundary component
 *   - `./fonts.ts`: Custom font configuration
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - This is a server component to enable proper SEO and performance
 *   - Client-side logic is moved to separate components
 *   - Global CSS is imported here for proper loading order
 *
 * NOTES:
 *   - Server component for better performance and SEO
 *   - Proper CSS import order: globals.css first, then component styles
 *   - Error boundaries and providers are client components
 */

import { Inter } from 'next/font/google';
import './globals.css';
import { ClientProviders } from './client-providers';
import { Header } from './components/ui/header';
import { navItems } from './lib/routes';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://merislabs.com'),
  title: {
    default: 'Meris Labs - Web & Mobile Development',
    template: '%s | Meris Labs'
  },
  description:
    'We have experience in designing and developing web and mobile applications for various industries, from financial services to legal. Expert software development, ESG consulting, and innovative tech solutions.',
  keywords: ['web development', 'mobile development', 'software development', 'ESG consulting', 'fintech', 'AI software', 'blockchain', 'Nigeria', 'Africa'],
  authors: [{ name: 'Meris Labs Team' }],
  creator: 'Meris Labs',
  publisher: 'Meris Labs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Meris Labs - Web & Mobile Development',
    description: 'Expert software development and ESG consulting services. Building innovative solutions for financial services, legal tech, and sustainable business growth.',
    url: 'https://merislabs.com',
    siteName: 'Meris Labs',
    images: [
      {
        url: '/images/merislabswhite.png',
        width: 1200,
        height: 630,
        alt: 'Meris Labs - Innovative Software Development',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meris Labs - Web & Mobile Development',
    description: 'Expert software development and ESG consulting services. Building innovative solutions for financial services, legal tech, and sustainable business growth.',
    images: ['/images/merislabswhite.png'],
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
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-900`} suppressHydrationWarning>
        {/* Hidden div to force Tailwind to include custom classes from utility-patterns.css */}
        <div
          className="btn h1 h2 h3 h4 form-input form-textarea form-multiselect form-select form-checkbox form-radio btn-sm hidden"
          aria-hidden="true"
        />
        <ClientProviders>
          <Header navItems={navItems} />
          <main className="min-h-screen bg-gray-900 text-foreground pt-20">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
