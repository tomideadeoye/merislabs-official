/**
 * @fileoverview This file serves as the main landing page for the Merislabs application.
 * @description It composes various UI components to present an engaging introduction to the platform,
 *   highlighting key features through sections like a hero banner and a zigzag content layout.
 *   It serves as the entry point for unauthenticated users and provides an overview of the product.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide an attractive and informative first impression for visitors.
 *   - To showcase the core value proposition and features of the Merislabs platform.
 *   - To guide users to key areas of the application or relevant information.
 *   - To serve as the public-facing entry point for the Next.js application.
 *
 * FILEPATH: `app/page.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/components/Hero.tsx`: Integrates the main hero banner component for the introductory section.
 *   - `@/components/Zigzag.tsx`: Incorporates the zigzag layout component to display features or content in an alternating visual pattern.
 *   - `@/components/ui/button.tsx`: Utilizes shared UI button components for calls to action.
 *   - `app/layout.tsx`: This page is rendered within the global application layout.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `Hero` and `Zigzag` components are available and correctly defined in their respective paths.
 *   - Designed for public access and does not require user authentication.
 *   - Serves as a static marketing/overview page.
 *
 * NOTES:
 *   - This file is a key part of the public-facing website and should be optimized for performance and SEO.
 *   - Consider dynamic content fetching for sections if content needs frequent updates.
 *   - COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE: Ensure `Hero` and `Zigzag` are generic enough for reuse across other landing pages if needed.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Dynamic Content**: Implement content management (e.g., from a headless CMS) for Hero and Zigzag sections to allow easier updates without code changes.
 *   - **Animations**: Enhance user engagement with more subtle animations (e.g., using Framer Motion) on scroll or element appearance.
 *   - **A/B Testing**: Integrate A/B testing capabilities for different hero sections or calls to action to optimize conversion.
 *   - **Accessibility**: Conduct a thorough accessibility audit to ensure the page is usable by all users.
 *   - **SEO Optimization**: Add more detailed meta descriptions, open graph tags, and structured data for improved search engine visibility.
 */
import type { Metadata } from 'next/types';
import Hero from './components/Hero';
import Zigzag from './components/zigzag';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/ui/footer';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Meris Labs - Your partner in innovative software development, ESG consulting, and cutting-edge technology solutions. Discover our expertise in web and mobile development.',
  keywords: ['software development', 'web development', 'mobile apps', 'ESG consulting', 'fintech solutions', 'AI development', 'blockchain', 'Nigeria tech'],
  openGraph: {
    title: 'Meris Labs - Innovative Software Development & ESG Consulting',
    description: 'Expert software development and ESG consulting services. Building innovative solutions for financial services, legal tech, and sustainable business growth.',
    url: '/',
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
    title: 'Meris Labs - Innovative Software Development & ESG Consulting',
    description: 'Expert software development and ESG consulting services. Building innovative solutions for financial services, legal tech, and sustainable business growth.',
    images: ['/images/merislabswhite.png'],
    creator: '@merislabs',
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Zigzag />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  );
}
