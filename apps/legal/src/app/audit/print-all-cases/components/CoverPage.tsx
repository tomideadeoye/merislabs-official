/**
 * ============================================================================
 * COVER PAGE COMPONENT - FULL-BLEED IMAGE COVER
 * ============================================================================
 * 
 * CRITICAL CONSTRAINT (Dec 2025):
 * --------------------------------
 * We CANNOT use pdf-lib to merge a JPEG cover after Puppeteer generates the PDF.
 * Doing so would DESTROY the internal hyperlinks in the Table of Contents.
 * 
 * Puppeteer's HTML-to-PDF conversion preserves <a href="#anchor"> links as 
 * clickable PDF links. If we use pdf-lib to prepend/append pages from a 
 * separate PDF, those links break because pdf-lib doesn't understand the
 * internal link structure.
 * 
 * SOLUTION: The cover MUST be rendered as part of the HTML that Puppeteer 
 * prints. We use an <img> element with CSS to make it fill the full A4 page.
 * 
 * ============================================================================
 */
import React from 'react';

export default function CoverPage() {
  return (
    <div 
      className="cover-page" 
      style={{ 
        position: 'relative',
        width: '100vw',
        height: '297mm', // A4 page height - ensures cover takes exactly 1 page
        overflow: 'hidden',
        padding: 0,
        margin: 0,
        maxWidth: 'none',
        pageBreakAfter: 'always',
        boxSizing: 'border-box',
      }}
    >
      {/* 
        FULL-BLEED IMAGE TECHNIQUE:
        The image uses position: absolute with all edges set to 0
        to ensure it fills the entire container regardless of 
        any browser quirks with mm units in print context.
      */}
      <img 
        src="/covers/UserCover.jpeg" 
        alt="Report Cover" 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          display: 'block',
        }} 
      />
    </div>
  );
}
