"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye } from 'lucide-react';
import { useTheme } from 'next-themes';

interface Deck {
  id: string;
  title: string;
  description: string;
  category: string;
  lastUpdated: string;
  status: 'published' | 'draft';
  href: string;
}

const decks: Deck[] = [
  {
    id: 'esg-finance-gap',
    title: 'Bridging the ESG Finance Gap',
    description: 'Demand and Supply-Side Constraints Facing Nigerian Small and Medium-Sized Enterprises (SMEs)',
    category: 'ESG & Finance',
    lastUpdated: 'September 2025',
    status: 'published',
    href: '/decks/bridging-the-esg-finance-gap'
  },
  // Add more decks here as they become available
];

export default function DecksPage() {
  const { setTheme } = useTheme();

  // Force light theme for decks pages
  useEffect(() => {
    setTheme('light');
  }, [setTheme]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Decks & Reports</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional reports and presentations covering ESG, finance, and business insights.
          </p>
        </div>

        {/* Decks Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <Card key={deck.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{deck.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-600 mb-3">
                      {deck.description}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={deck.status === 'published' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {deck.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="font-medium">{deck.category}</span>
                  <span>{deck.lastUpdated}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={deck.href}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {decks.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No decks available</h3>
            <p className="text-gray-600">Check back later for new reports and presentations.</p>
          </div>
        )}

      </div>
    </div>
  );
}
