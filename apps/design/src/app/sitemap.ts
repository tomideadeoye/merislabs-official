import { MetadataRoute } from 'next';

const SITE_URL = 'https://merislabs.com';

/**
 * Static routes that should always be included in sitemap
 */
const staticRoutes = [
  {
    url: '',
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1,
  },
  {
    url: '/decks',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  },
  {
    url: '/projects',
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  },
  {
    url: '/tools',
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  },
];

/**
 * Dynamic deck routes
 */
const deckRoutes = [
  '/decks/brandqor-workshop-2026',
  '/decks/nicarb-annual-conference-2025',
  '/decks/gka-investment-teaser',
  '/decks/bridging-the-esg-finance-gap',
  '/decks/morganhacks-2026',
  '/decks/bose-adeoye-retirement',
];

/**
 * Generate sitemap for Next.js
 * This is automatically picked up by Next.js and served at /sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const deckUrls = deckRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const staticUrls = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.url}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [...staticUrls, ...deckUrls];
}
