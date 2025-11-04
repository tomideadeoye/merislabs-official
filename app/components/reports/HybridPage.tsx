import React, { useState, useEffect, useRef } from 'react';

interface HybridPageProps {
  pageNumber?: number;
  htmlContent?: string;
  children?: React.ReactNode;
  components: Record<string, React.ReactNode>;
  footnotes?: string[];
  footnoteStart?: number;
  columns?: number;
  width?: number;
  height?: number;
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

export const HybridPage: React.FC<HybridPageProps> = ({
  pageNumber,
  htmlContent,
  children,
  components,
  footnotes,
  footnoteStart = 1,
  columns = 1,
  width = 794,
  height = 1123
}) => {
  console.log('=== HYBRID PAGE COMPONENT ===');
  console.log('Props received:', { pageNumber, columns, width, height, footnoteStart });
  console.log('Footnotes count:', footnotes?.length || 0);
  console.log('Components count:', Object.keys(components).length);

  const [footnoteHeight, setFootnoteHeight] = useState(24); // Default height for page number
  const footnoteRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Calculate footnote height after initial render and when content changes
  useEffect(() => {
    console.log('=== HYBRID PAGE EFFECT ===');
    console.log('Footnotes updated, recalculating height');

    const calculateFootnoteHeight = () => {
      if (footnoteRef.current) {
        const height = footnoteRef.current.offsetHeight;
        console.log('Footnote height calculated:', height);
        setFootnoteHeight(height > 0 ? height + 24 : 24); // Add margin for page number
        console.log('Setting footnote height to:', height > 0 ? height + 24 : 24);
      }
    };

    // Initial calculation
    calculateFootnoteHeight();

    // Set up ResizeObserver for dynamic updates
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      const observer = new ResizeObserver(calculateFootnoteHeight);
      if (footnoteRef.current) {
        console.log('Setting up ResizeObserver for footnotes');
        observer.observe(footnoteRef.current);
      }
      return () => {
        console.log('Disconnecting ResizeObserver');
        observer.disconnect();
      };
    }
  }, [footnotes]);

  // Generate column classes based on the columns prop
  const getColumnClasses = () => {
    console.log('=== GET COLUMN CLASSES ===');
    console.log('Columns value:', columns);

    if (columns <= 1) {
      console.log('Single column mode, no column classes');
      return '';
    }

    const columnClass = `columns-${columns} gap-8 column-fill-auto`;
    console.log('Multi-column mode, column classes:', columnClass);
    return columnClass;
  };

  console.log('=== HYBRID PAGE RENDER ===');
  console.log('Page dimensions:', { width, height });
  console.log('Column classes:', getColumnClasses());
  console.log('Footnote height:', footnoteHeight);

  return (
    <div
      id={pageNumber ? `page-${pageNumber}` : undefined}
      className="relative bg-gray-900 border border-gray-700 mx-auto mb-4 shadow-lg shadow-purple-500/20 select-text cursor-text rounded-xl"
      style={{
        width: `${width}px`, // Configurable width
        height: `${height}px`, // Configurable height
        pageBreakAfter: 'always',
        pageBreakInside: 'avoid',
        overflow: 'visible', // Changed from hidden to visible
        userSelect: 'text',
        WebkitUserSelect: 'text'
      }}
    >
      {/* Content area with dynamic bottom padding */}
      <div
        ref={contentRef}
        style={{
          padding: '64px',
          paddingBottom: `${footnoteHeight + 48}px`, // Add extra space for page number and buffer
          minHeight: '100%',
          maxHeight: '100%', // Prevent content from exceeding page height
          overflow: 'visible' // Changed from hidden to visible
        }}
        className="flex flex-col h-full"
      >
        <div
          className={`text-[13px] leading-relaxed text-gray-200 flex-1 ${getColumnClasses()}`}
          style={{
            // Prevent headings from being isolated at the bottom of a column/page
            breakInside: 'avoid',
            // Keep headings with their following content
            pageBreakInside: 'avoid',
            // Prevent content overflow
            maxHeight: '100%',
            overflow: 'visible'
          }}
        >
          {/* Render content - either HTML string or React children */}
          {htmlContent ? (
            <div dangerouslySetInnerHTML={{ __html: htmlContent! }} />
          ) : (
            children
          )}

          {/* Render React components */}
          {Object.entries(components).map(([key, component]) => (
            <div key={key}>{component}</div>
          ))}
        </div>
      </div>

      {/* Footnotes section - positioned at bottom with proper spacing */}
      {footnotes && footnotes.length > 0 && (
        <div
          ref={footnoteRef}
          className="absolute left-6 right-6 text-xs text-gray-300 break-words overflow-wrap-anywhere leading-tight"
          style={{
            bottom: `${footnoteHeight + 24}px`, // Position above page number with proper spacing
            maxHeight: '180px', // Reasonable max height
            overflow: 'visible' // Allow footnotes to extend if needed
          }}
        >
          <div className="border-t border-gray-600 pt-2">
            {footnotes.map((note, index) => (
              <div key={note} id={`footnote-${index + footnoteStart}`} className="mb-1 break-words overflow-wrap-anywhere page-break-inside-avoid">
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
      <div className="absolute bottom-6 left-0 right-0 text-center text-sm text-gray-400 z-10">
        {pageNumber}
      </div>
    </div>
  );
};
