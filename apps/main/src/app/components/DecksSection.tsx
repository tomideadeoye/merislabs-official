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
import { decks, type Deck } from './projects';
import React, { useState, useMemo, ChangeEvent } from 'react';
import { Input } from './ui/input';

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
          placeholder="SEARCH PRESENTATIONS..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="w-full px-6 py-4 bg-[#1e293b] border-slate-800 text-white placeholder:text-slate-500 font-mono text-xs uppercase tracking-[0.2em] focus:ring-violet-500/50 rounded-xl"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDecks.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-2 font-mono text-sm uppercase tracking-widest">No matching presentations</div>
          </div>
        ) : (
          filteredDecks.map((deck: Deck, idx: number) => (
            <div 
              key={idx} 
              className="group flex flex-col bg-[#1e293b] rounded-xl overflow-hidden border border-slate-800 hover:border-violet-500/50 transition-all duration-300 shadow-xl"
            >
              {deck.iframe ? (
                <div className="w-full h-[220px] relative overflow-hidden bg-slate-950 border-b border-slate-800">
                  <iframe
                    src={deck.iframe}
                    className="w-full h-full border-0 pointer-events-none group-hover:pointer-events-auto"
                    allowFullScreen
                    title={deck.title}
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-full h-[220px] flex items-center justify-center bg-slate-950 border-b border-slate-800">
                   <span className="text-slate-800 font-mono text-[10px] uppercase tracking-[0.3em]">No Preview</span>
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div className="font-mono text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                    {deck.client || 'MerisLabs'}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded uppercase">
                    Proprietary
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-violet-400 transition-colors">
                  {deck.title}
                </h3>
                
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {deck.tags && deck.tags.slice(0, 3).map((tag, i) => (
                    <span 
                      key={i} 
                      className="text-[9px] font-mono uppercase tracking-tighter px-2 py-0.5 bg-slate-800/50 text-slate-400 rounded-sm border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="mt-auto">
                  <a
                    href={deck.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded transition-all shadow-lg shadow-violet-900/20 uppercase tracking-widest"
                  >
                    View Deck
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
