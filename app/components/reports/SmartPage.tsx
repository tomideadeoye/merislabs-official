import React, { useState, useEffect, useRef } from 'react';

interface SmartPageProps {
  pageNumber?: number;
  children: React.ReactNode;
  footnotes?: string[];
  footnoteStart?: number;
  useColumns?: boolean;
  onHeightCalculated?: (height: number) => void;
}

// Helper function to convert footnote text with markdown-style links to HTML
const convertFootnoteToHtml = (text: string): string => {
  // Convert <url> to <a href="url">url</a>
  return text.replace(/<([^>]+)>/g, (match, url) => {
    // Check if it's a URL (starts with http:// or https://)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${url}</a>`;
    }
    // If it's not a URL, keep the original format
    return match;
  });
};

export const SmartPage: React.FC<SmartPageProps> = ({
  pageNumber,
  children,
  footnotes,
  footnoteStart = 1,
  useColumns = true,
  onHeightCalculated
}) => {
  const [footnoteHeight, setFootnoteHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const footnoteRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Page dimensions (A4 at 96 DPI)
  const PAGE_WIDTH = 794;
  const PAGE_HEIGHT = 1123;
  const PAGE_MARGIN = 64;
  const FOOTER_HEIGHT = 24; // Space for page number

  // Calculate footnote height after initial render
  useEffect(() => {
    const calculateFootnoteHeight = () => {
      if (footnoteRef.current) {
        const height = footnoteRef.current.offsetHeight;
        setFootnoteHeight(height > 0 ? height : 0);
        if (onHeightCalculated) {
          onHeightCalculated(height > 0 ? height : 0);
        }
      }
    };

    // Initial calculation
    calculateFootnoteHeight();

    // Set up a ResizeObserver to recalculate when footnote content changes
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      const observer = new ResizeObserver(calculateFootnoteHeight);
      if (footnoteRef.current) {
        observer.observe(footnoteRef.current);
      }
      return () => observer.disconnect();
    }
  }, [footnotes, onHeightCalculated]);

  // Calculate content padding based on footnote height
  const contentBottomPadding = footnoteHeight + FOOTER_HEIGHT + 24; // Extra margin

  return (
    <div
      ref={pageRef}
      id={pageNumber ? `page-${pageNumber}` : undefined}
      className="relative bg-gray-900 border border-gray-700 mx-auto mb-4 shadow-lg shadow-purple-500/20 page-container select-text cursor-text"
      style={{
        width: `${PAGE_WIDTH}px`,
        minHeight: `${PAGE_HEIGHT}px`,
        pageBreakAfter: 'always',
        pageBreakInside: 'avoid',
        userSelect: 'text',
        WebkitUserSelect: 'text'
      }}
    >
      {/* Content area with dynamic bottom padding */}
      <div
        ref={contentRef}
        style={{
          padding: `${PAGE_MARGIN}px`,
          paddingBottom: `${contentBottomPadding}px`,
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          className={`text-sm leading-relaxed text-gray-200 flex-1 ${useColumns ? 'columns-2 gap-8 column-fill-auto' : ''}`}
          style={{
            // This ensures content doesn't overflow into footnote area
            marginBottom: `${footnoteHeight + 12}px` // Extra margin to prevent overlap
          }}
        >
          {children}
        </div>
      </div>

      {/* Footnotes section - positioned at bottom with proper spacing */}
      {footnotes && footnotes.length > 0 && (
        <div
          ref={footnoteRef}
          className="absolute left-6 right-6 text-xs text-gray-300 break-words overflow-wrap-anywhere leading-tight"
          style={{
            bottom: `${FOOTER_HEIGHT + 12}px`, // Above page number with margin
            maxHeight: '180px',
            overflow: 'visible'
          }}
        >
          <div className="border-t border-gray-600 pt-2">
            {footnotes.map((note, index) => (
              <div key={`${pageNumber}-${index + footnoteStart}`} id={`footnote-${index + footnoteStart}`} className="mb-1 break-words overflow-wrap-anywhere page-break-inside-avoid">
                <sup className="whitespace-nowrap text-[10px]">{index + footnoteStart}</sup>{' '}
                <span
                  className="break-words overflow-wrap-anywhere text-[10px]"
                  dangerouslySetInnerHTML={{ __html: convertFootnoteToHtml(note) }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Page number at bottom center */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 z-10">
        {pageNumber}
      </div>
    </div>
  );
};
