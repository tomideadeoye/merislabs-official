import React from 'react';
import { HybridPage } from '../HybridPage';
import { defaultFootnotes as mainFootnotes } from '@/data';

// Helper function to convert footnote text with URLs to HTML links
const convertFootnoteToHtml = (text: string): string => {
  // First, convert <url> to <a href="url">url</a> (markdown-style links)
  let processedText = text.replace(/<([^>]+)>/g, (match, url) => {
    // Check if it's a URL (starts with http:// or https://)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // Truncate long URLs for display
      let displayUrl = url;
      if (url.length > 125) {
        displayUrl = url.substring(0, 47) + '...';
      }
      return `<a href='${url}' class='text-blue-600 hover:text-blue-800 underline'>${displayUrl}</a>`;
    }
    // If it's not a URL, keep the original format
    return match;
  });

  // Then, convert plain URLs in "Available at:" patterns to links
  processedText = processedText.replace(/(Available at:?\s*)(https?:\/\/[^\s]+)/g, (match, prefix, url) => {
    // Truncate long URLs for display
    let displayUrl = url;
    if (url.length > 125) {
      displayUrl = url.substring(0, 47) + '...';
    }
    return `${prefix}<a href='${url}' class='text-blue-600 hover:text-blue-800 underline'>${displayUrl}</a>`;
  });

  // Also convert standalone URLs that start with http:// or https://
  processedText = processedText.replace(/(https?:\/\/[^\s]+)/g, (match, url) => {
    // Skip if already converted
    if (processedText.includes(`href='${url}'`)) {
      return match;
    }
    // Truncate long URLs for display
    let displayUrl = url;
    if (url.length > 125) {
      displayUrl = url.substring(0, 47) + '...';
    }
    return `<a href='${url}' class='text-blue-600 hover:text-blue-800 underline'>${displayUrl}</a>`;
  });

  return processedText;
};

interface EndnotesPageProps {
  pageNumber?: number;
  footnoteStart?: number;
  footnoteEnd?: number;
  startFromNote?: number;
  showHeading?: boolean;
}

export const EndnotesPage: React.FC<EndnotesPageProps> = ({
  pageNumber = 1,
  footnoteStart = 1,
  footnoteEnd,
  startFromNote = 1,
  showHeading = true
}) => {
  // Determine which footnotes to display on this page
  const startIndex = startFromNote - 1;
  const endIndex = footnoteEnd ?? mainFootnotes.length;
  const pageFootnotes = mainFootnotes.slice(startIndex, endIndex);

  // Calculate the display number for each footnote
  const displayStartNumber = footnoteStart;
  const midpoint = Math.ceil(pageFootnotes.length / 2);
  const leftColumnFootnotes = pageFootnotes.slice(0, midpoint);
  const rightColumnFootnotes = pageFootnotes.slice(midpoint);

  return (
    <HybridPage
      pageNumber={pageNumber}
      components={{}}
      columns={1}
      width={794}
      height={1123}
    >
      {showHeading && (
        <h1 className="text-xl font-bold mb-6 text-blue-600 text-center">Endnotes.</h1>
      )}

      <div className="text-[8px] leading-tight columns-2 gap-6 h-full pb-8 column-fill-auto">
        {pageFootnotes.map((note: string, index: number) => {
          const displayNumber = displayStartNumber + index;
          const actualIndex = startIndex + index;
          return (
            <div key={`endnote-${actualIndex + 1}`}
              className="mb-1 break-inside-avoid"
              id={`footnote-${displayNumber}`}>
              <div className="flex items-baseline">
                <sup className="whitespace-nowrap text-[7px] mr-0.5 leading-none">{displayNumber}</sup>
                <span
                  className="break-words overflow-wrap-anywhere text-[8px] leading-tight"
                  dangerouslySetInnerHTML={{ __html: convertFootnoteToHtml(note) }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </HybridPage>
  );
};
