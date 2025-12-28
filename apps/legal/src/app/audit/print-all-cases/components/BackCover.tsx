/**
 * ============================================================================
 * BACK COVER COMPONENT - FULL-BLEED PDF PAGE
 * ============================================================================
 * 
 * PURPOSE:
 * Renders the back cover page of the PDF report. This page displays a
 * full-bleed image that extends to the edges of the paper.
 * 
 * ============================================================================
 * CRITICAL STYLING DECISIONS (Dec 2025):
 * ============================================================================
 * 
 * 1. EXPLICIT A4 DIMENSIONS (210mm x 297mm):
 *    ----------------------------
 *    PROBLEM: Using `100vw` or `100vh` can produce incorrect sizes depending
 *    on the browser's viewport calculation during print rendering.
 *    
 *    SOLUTION: Hardcoded `width: 210mm` and `height: 297mm` to exactly match
 *    the physical A4 paper size. This ensures the image fills the page
 *    regardless of browser viewport settings.
 * 
 * 2. CSS CLASS `.back-cover`:
 *    ----------------------------
 *    This class is defined in PrintGlobalStyles.tsx and includes:
 *    - `page: fullbleed-cover;` - Uses a named @page rule with zero margins
 *    - Ensures no page number appears on the back cover
 *    
 *    The inline styles here complement the CSS class with explicit dimensions.
 * 
 * 3. `pageBreakBefore: 'always'`:
 *    ----------------------------
 *    Forces this cover to always start on a new page, regardless of where
 *    the previous content ended. This prevents content from bleeding into
 *    the back cover.
 * 
 * 4. `objectFit: 'fill'`:
 *    ----------------------------
 *    Stretches the image to fill the entire 210mm x 297mm container.
 *    Alternative: Use 'cover' to maintain aspect ratio (may crop edges).
 * 
 * ============================================================================
 * CONSTRAINTS:
 * ============================================================================
 * 
 * - The image at `/covers/UserBackCover.jpeg` must have an aspect ratio close
 *   to A4 (1:1.414) for best results.
 * - For user-uploaded back covers, ensure image resolution is at least
 *   2480 x 3508 pixels (300 DPI at A4 size) for print quality.
 * 
 * ============================================================================
 */
import React from 'react';

export default function BackCover() {
  return (
    <div 
      className="back-cover" 
      style={{ 
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        padding: 0,
        margin: 0,
        maxWidth: 'none',
        pageBreakBefore: 'always',
        boxSizing: 'border-box'
      }}
    >
      <img 
        src="/covers/UserBackCover.jpeg" 
        alt="Report Back Cover" 
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
