import type { Metadata } from 'next';
import { generatePageSEO, seoPresets } from '@/lib/seo';

export const metadata: Metadata = generatePageSEO({
  ...seoPresets.decks,
  image: '/images/decks-og-image.png',
});
