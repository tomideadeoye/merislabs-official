/**
 * @fileoverview This component displays a browsable collection of MerisLabs decks and presentations,
 *   including search and filtering capabilities. It is designed to be integrated into larger layouts
 *   or pages, providing a dedicated section for showcasing presentations.
 * @description It extracts the core functionality previously found in `app/decks/page.tsx`,
 *   making it reusable and modular. Users can search by title, client, or tags, and view embedded
 *   presentations directly within the component.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To encapsulate the display and interaction logic for MerisLabs decks.
 *   - To provide a searchable and filterable interface for presentations.
 *   - To embed presentations from external platforms (e.g., Slideshare, Canva) for in-app viewing.
 *   - To serve as a reusable UI block for showcasing intellectual property.
 *
 * FILEPATH: `app/components/DecksSection.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `components/projects.ts`: Source of the `decks` data array.
 *   - `app/components/ui/input.tsx`: Utilizes a standard input component for the search bar.
 *   - `app/lib/types/index.ts` (implied): Relies on the `Deck` interface for data structure.
 *   - `components/zigzag.tsx`: Will be integrated into this component as a tabbed section.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that the `decks` array (imported from `components/projects`) is correctly structured.
 *   - Assumes that embedded `iframe` URLs are valid and allow embedding.
 *   - The component is client-side (`'use client'`) due to state management and interactive elements.
 *
 * NOTES:
 *   - This component centralizes the deck display logic, improving maintainability.
 *   - For larger datasets, consider optimizing search performance or implementing server-side search.
 *   - COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE: None, as this is a new, extracted component.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Dynamic Data Loading**: Fetch `decks` data from an API or database instead of a local file.
 *   - **Pagination/Infinite Scrolling**: Improve performance and UX for a very large number of decks.
 *   - **Error Handling**: Add more robust error handling for iframe loading failures.
 *   - **UI/UX Enhancements**: Implement loading states, clearer search feedback, or more advanced filtering options.
 */

'use client';
import { decks } from './projects';
import React, { useState, useMemo, ChangeEvent } from 'react';
import { Input } from './ui/input';

export interface Deck {
  title: string;
  iframe: string;
  link: string;
  client: string;
  tags: string[];
}

function DeckTags({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag, i) => (
        <span key={i} className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
          {tag}
        </span>
      ))}
    </div>
  );
}

export default function DecksSection() {
  const [search, setSearch] = useState('');

  const filteredDecks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return decks;
    return decks.filter((deck: Deck) => {
      const title = (deck.title || '').toLowerCase();
      const client = (deck.client || '').toLowerCase();
      const tags = (deck.tags || []).map((t: string) => t.toLowerCase()).join(' ');
      return title.includes(q) || client.includes(q) || tags.includes(q);
    });
  }, [search]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search by title, client, or tag..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredDecks.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No decks found.</div>
        ) : (
          filteredDecks.map((deck: Deck, idx: number) => (
            <div key={idx} className="bg-white rounded-lg shadow p-4">
              {deck.iframe && (
                <div className="mb-2">
                  <iframe
                    src={deck.iframe}
                    width="100%"
                    height="400"
                    style={{ border: '1px solid #CCC', borderRadius: '8px' }}
                    allowFullScreen
                    title={deck.title}
                  />
                </div>
              )}
              <div>
                <a
                  href={deck.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {deck.title}
                </a>
                <div className="text-sm text-gray-500">Client: {deck.client || 'Unknown'}</div>
                <DeckTags tags={deck.tags} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
