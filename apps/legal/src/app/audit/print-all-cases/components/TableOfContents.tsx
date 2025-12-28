import React from 'react';

export interface TocItem {
  type: 'section' | 'case';
  label: string;
  pageNumber: number;
  id?: string;
  isFirstInSection?: boolean; // For visual grouping
}

export interface TocPageData {
  pageNumber: number; // The page number of this ToC page itself (e.g., 2, 3)
  items: TocItem[];
}

interface TableOfContentsProps {
  pages: TocPageData[];
}

export default function TableOfContents({ pages }: TableOfContentsProps) {
  return (
    <>
      {pages.map((page, pageIdx) => (
        <div key={pageIdx} className="toc-page page-break">
          {pageIdx === 0 && (
            <div className="toc-title">
              <h2>Table of Contents</h2>
              <div className="toc-underline"></div>
            </div>
          )}
          
          <div className="toc-content">
            {page.items.map((item, itemIdx) => {
              if (item.type === 'section') {
                return (
                  <div key={itemIdx} className="toc-section-header" style={{ marginBottom: '10px', marginTop: itemIdx > 0 ? '15px' : '0' }}>
                    <a href={`#section-${item.id}`} style={{ fontWeight: 800, fontSize: '14px', textTransform: 'uppercase' }}>{item.label}</a>
                    <div className="toc-dots"></div>
                    <div>{item.pageNumber}</div>
                  </div>
                );
              } else {
                return (
                  <div key={itemIdx} className="toc-case-item" style={{ paddingLeft: '15px', marginBottom: '4px' }}>
                    <a href={`#case-${item.id}`}>{item.label}</a>
                    <div className="toc-dots" style={{ borderBottom: '1px dotted #e5e7eb' }}></div>
                    <div>{item.pageNumber}</div>
                  </div>
                );
              }
            })}
          </div>
          
          {/* Optional: Add "Continued..." footer if not last page? checking CSS handle this usually not needed for ToC */}
        </div>
      ))}
    </>
  );
}
