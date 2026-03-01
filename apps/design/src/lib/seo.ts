import type { Metadata } from 'next';

export const SITE_URL = 'https://merislabs.com';
export const SITE_NAME = 'Meris Labs';
export const TWITTER_HANDLE = '@merislabs';

interface PageSEOOptions {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  author?: string;
}

/**
 * Generate comprehensive SEO metadata for any page
 */
export function generatePageSEO(options: PageSEOOptions): Metadata {
  const url = options.path ? `${SITE_URL}${options.path}` : SITE_URL;
  const imageUrl = options.image || '/images/merislabswhite.png';

  return {
    title: {
      default: options.title,
      template: `%s | ${SITE_NAME}`
    },
    description: options.description,
    keywords: options.keywords || [],
    authors: [{ name: options.author || SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: options.title,
      description: options.description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: options.title,
        },
      ],
      locale: 'en_US',
      type: options.type || 'website',
      publishedTime: options.publishedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description: options.description,
      images: [imageUrl],
      creator: TWITTER_HANDLE,
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
}

/**
 * Pre-configured SEO for common page types
 */
export const seoPresets = {
  home: {
    title: 'Meris Labs - Innovative Software Development & ESG Consulting',
    description: 'Expert software development and ESG consulting services. Building innovative solutions for financial services, legal tech, and sustainable business growth across Africa.',
    keywords: [
      'software development',
      'web development',
      'mobile apps',
      'ESG consulting',
      'fintech solutions',
      'AI development',
      'blockchain',
      'Nigeria tech',
      'Africa technology',
      'sustainable business',
      'digital transformation',
    ],
    path: '/',
  },
  about: {
    title: 'About Meris Labs - Our Story & Mission',
    description: 'Learn about Meris Labs - a leading software development company in Nigeria specializing in web, mobile, and ESG solutions for businesses across Africa.',
    keywords: ['about merislabs', 'software company nigeria', 'tech company africa', 'ESG consulting'],
    path: '/about',
  },
  services: {
    title: 'Our Services - Web, Mobile & ESG Solutions',
    description: 'Comprehensive software development services including web applications, mobile apps, fintech solutions, ESG reporting, and digital transformation consulting.',
    keywords: [
      'web development services',
      'mobile app development',
      'ESG reporting',
      'fintech development',
      'software consulting',
      'digital transformation',
    ],
    path: '/services',
  },
  projects: {
    title: 'Our Projects - Portfolio of Innovation',
    description: 'Explore our portfolio of successful projects including fintech platforms, ESG reporting tools, mobile applications, and enterprise software solutions.',
    keywords: ['portfolio', 'case studies', 'project examples', 'software projects', 'success stories'],
    path: '/projects',
  },
  contact: {
    title: 'Contact Us - Get in Touch',
    description: 'Ready to start your project? Contact Meris Labs for expert software development and ESG consulting services. Let\'s build something great together.',
    keywords: ['contact', 'get in touch', 'software development quote', 'consulting services'],
    path: '/contact',
  },
  blog: {
    title: 'Blog - Insights & Industry Trends',
    description: 'Stay updated with the latest trends in software development, ESG reporting, fintech, and digital transformation. Expert insights from the Meris Labs team.',
    keywords: ['tech blog', 'software development insights', 'ESG trends', 'fintech news', 'digital transformation'],
    path: '/blog',
    type: 'article' as const,
  },
  decks: {
    title: 'Investment Decks & Presentations',
    description: 'Professional investment decks, pitch presentations, and business proposals created by Meris Labs for startups and enterprises.',
    keywords: ['investment deck', 'pitch deck', 'business presentation', 'investor materials'],
    path: '/decks',
  },
  tools: {
    title: 'Free Tools & Resources',
    description: 'Access free tools and resources from Meris Labs including signature generators, flyer creators, and business utilities.',
    keywords: ['free tools', 'signature generator', 'flyer creator', 'business tools'],
    path: '/tools',
  },
};

/**
 * JSON-LD structured data for rich snippets
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/merislabswhite.png`,
    description: 'Expert software development and ESG consulting services',
    founder: {
      '@type': 'Person',
      name: 'Tomide Adeoye',
    },
    sameAs: [
      'https://twitter.com/merislabs',
      'https://linkedin.com/company/merislabs',
      'https://github.com/tomideadeoye/merislabs-official',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hello@merislabs.com',
    },
  };
}

/**
 * JSON-LD for software products
 */
export function generateSoftwareSchema(software: {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: software.name,
    description: software.description,
    url: software.url,
    applicationCategory: software.applicationCategory,
    operatingSystem: software.operatingSystem || 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

/**
 * JSON-LD for articles/blog posts
 */
export function generateArticleSchema(article: {
  headline: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/merislabswhite.png`,
      },
    },
  };
}

/**
 * JSON-LD for events
 */
export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  url: string;
  image: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    location: event.location
      ? {
          '@type': 'Place',
          name: event.location,
        }
      : undefined,
    image: event.image,
    url: event.url,
    organizer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
