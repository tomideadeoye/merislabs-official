import { useState, useEffect } from 'react';

interface HybridPaginationOptions {
  content: string;
  components?: Record<string, React.ReactNode>;
  pageWidth?: number;
  pageHeight?: number;
  margin?: number;
  footerHeight?: number;
  columnCount?: number;
}

interface HybridPageData {
  content: string;
  components: Record<string, React.ReactNode>;
  hasFootnotes: boolean;
}

export const useHybridPagination = ({
  content,
  components = {},
  pageWidth = 794,
  pageHeight = 1123,
  margin = 64,
  footerHeight = 24,
  columnCount = 1
}: HybridPaginationOptions) => {
  const [pages, setPages] = useState<HybridPageData[]>([]);
  const [loading, setLoading] = useState(true);

  // Strict A4 compliance - never exceed printable dimensions
  const availableContentHeight = Math.min(
    pageHeight - (margin * 2) - footerHeight - 60, // Conservative height
    900 // Absolute maximum to ensure printability and prevent overflow
  );

  // Smart pagination: break content naturally but densely
  const breakContentIntoPages = (content: string): string[] => {
    // Create a temporary element to measure content
    const tempDiv = document.createElement('div');
    tempDiv.style.width = `${pageWidth - (margin * 2)}px`;
    tempDiv.style.fontSize = '13px';
    tempDiv.style.lineHeight = '1.5';
    tempDiv.style.fontFamily = 'system-ui, sans-serif';
    tempDiv.style.position = 'absolute';
    tempDiv.style.top = '-9999px';
    tempDiv.style.padding = '64px';
    // Add column styling if needed
    if (columnCount > 1) {
      tempDiv.style.columnCount = columnCount.toString();
      tempDiv.style.columnGap = '32px';
    }
    document.body.appendChild(tempDiv);

    try {
      // Adjust available height for columns
      const availableHeight = pageHeight - (margin * 2) - footerHeight - 20;
      const columnAdjustedHeight = columnCount > 1 ? availableHeight : availableHeight;

      // Split by major sections
      const sections = content.split(/(?=<h[1-3][^>]*>)/g).filter(s => s.trim());

      const pages: string[] = [];
      let currentPage = '';
      let currentHeight = 0;

      for (const section of sections) {
        tempDiv.innerHTML = currentPage + section;
        const combinedHeight = tempDiv.offsetHeight;

        // If adding this section would exceed the page height and we already have content
        if (combinedHeight > columnAdjustedHeight && currentPage) {
          // Save current page and start a new one
          pages.push(currentPage);
          currentPage = section;
          tempDiv.innerHTML = currentPage;
          currentHeight = tempDiv.offsetHeight;
        } else {
          // Add section to current page
          currentPage += section;
          currentHeight = combinedHeight;
        }
      }

      // Add the last page if it has content
      if (currentPage) {
        pages.push(currentPage);
      }

      // If no pages were created (content is very short), create one page
      if (pages.length === 0) {
        pages.push(content);
      }

      return pages;
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  useEffect(() => {
    if (!content) {
      setPages([]);
      setLoading(false);
      return;
    }

    try {
      // Break content into pages
      const pageContents = breakContentIntoPages(content);

      // Create page data objects
      const pageData: HybridPageData[] = pageContents.map((content, index) => ({
        content,
        components,
        hasFootnotes: index === pageContents.length - 1 // Only last page has footnotes
      }));

      setPages(pageData);
    } catch (error) {
      console.error('Error during pagination:', error);
      // Fallback to single page
      setPages([{
        content,
        components,
        hasFootnotes: true
      }]);
    }

    setLoading(false);
  }, [content, components, pageWidth, pageHeight, margin, footerHeight, columnCount]);

  return {
    pages,
    loading,
    pageDimensions: {
      width: pageWidth,
      height: pageHeight,
      margin,
      footerHeight,
      availableContentHeight
    }
  };
};
