'use client';

import { useEffect, useState } from 'react';

interface StructuredDataProps {
  data: Record<string, unknown>;
}

/**
 * StructuredData component for injecting JSON-LD schema markup
 * This helps search engines understand your content better and enables rich snippets
 */
export function StructuredData({ data }: StructuredDataProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
