/**
 * ============================================================================
 * PRINT GLOBAL STYLES - PDF GENERATION CSS ARCHITECTURE
 * ============================================================================
 *
 * PURPOSE:
 * This component provides the complete CSS styling for the print-ready PDF
 * report. It handles A4 page sizing, full-bleed covers, page numbering, and
 * professional typography.
 *
 * ============================================================================
 * CRITICAL ARCHITECTURE DECISIONS (Dec 2025):
 * ============================================================================
 *
 * 1. DUAL-MARGIN STRATEGY:
 *    ----------------------------
 *    PROBLEM: We need FULL-BLEED (edge-to-edge) covers but MARGINED content
 *    pages with page numbers. These are conflicting requirements.
 *
 *    SOLUTION: Use multiple @page rules:
 *    - Global @page: Sets standard margins (12mm sides, 20mm bottom) for
 *      content pages. The large bottom margin reserves space for page numbers.
 *    - @page :first: Overrides margins to 0 for the FIRST page only (cover).
 *    - @page fullbleed-cover: Named page style for the BACK cover to also
 *      have zero margins.
 *
 * 2. PAGE NUMBERING:
 *    ----------------------------
 *    Chrome/Puppeteer supports CSS Paged Media counters via @bottom-right.
 *    We use `content: counter(page)` to display just the page number.
 *    The cover page (`:first`) explicitly sets `content: none` to hide it.
 *
 *    CONSTRAINT: Safari has limited support for @page counters. For Safari
 *    users, page numbers may not appear. The static PDF artifact generated
 *    via Puppeteer is the canonical source of truth.
 *
 * 3. COLOR SCHEME - NAVY BLUE (#2d4f8f):
 *    ----------------------------
 *    All accent colors in this file use navy blue (#2d4f8f) for branding.
 *    This was updated from the original green (#009739) to match the
 *    client's preferred visual identity.
 *
 *    SEARCH-AND-REPLACE: If updating the brand color, search for "#2d4f8f"
 *    and replace globally within this file.
 *
 * 4. A4 DIMENSIONS:
 *    ----------------------------
 *    All page-level sizing uses A4 (210mm x 297mm).
 *    Cover and back cover elements use explicit `height: 297mm; width: 210mm;`
 *    to ensure pixel-perfect coverage regardless of viewport size.
 *
 * 5. FONT LOADING:
 *    ----------------------------
 *    We import Montserrat (headings) and Roboto (body) from Google Fonts.
 *    These fonts are loaded via @import to ensure availability during
 *    Puppeteer rendering where local system fonts may not be installed.
 *
 * ============================================================================
 * MAINTENANCE NOTES:
 * ============================================================================
 *
 * - If adding new section types, ensure they use `page-break-inside: avoid;`
 *   for card-like elements to prevent mid-card page breaks.
 * - The `.page-break` class forces a page break after an element.
 * - The `.avoid-break` class prevents page breaks inside an element.
 * - Debug borders are available (line ~10 inside CSS) but disabled by default.
 *
 * ============================================================================
 */
'use client';

export default function PrintGlobalStyles() {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Roboto:wght@300;400;500;700&display=swap');

        @media print {
          /* DEBUG: DISABLED */
          /* * { outline: 1px solid rgba(255,0,0,0.3) !important; } */

          /* Default page style for content pages */
          /* Global: Standard Margins for Page Numbers */
          @page {
            size: A4;
            margin: 12mm 12mm 20mm 12mm;

            /*
               CRITICAL: Page Numbering
               Must have accurate numbering on every page except cover.
               Using Chrome's Paged Media support.

               NOTE: We do NOT reset the counter here. The cover is page 1,
               and the TOC correctly starts at page 2.
            */
            @bottom-right {
              content: counter(page);
              font-family: 'Roboto', sans-serif;
              font-size: 10px;
              color: #6b7280;
            }
          }

          /* Ensure Cover Page has NO number and NO margin (Full Bleed) */
          @page :first {
             margin: 0 !important;
             @bottom-right { content: none !important; }
          }

          /*
             CRITICAL: The body counter starts at 1 by default.
             Cover is page 1. ToC starts at page 2. This is correct behavior.
             Do NOT reset the counter after cover - that would make ToC page 1.
          */

          /* Content formatting handles margins internally */
          .print-container {
             width: 100%;
             padding: 0; /* Margins handled by @page now */
          }

          /* Named page for full-bleed covers (front and back) */
          @page fullbleed-cover {
            size: A4;
            margin: 0 !important;

            @bottom-center {
              content: none;
            }

            @bottom-right {
              content: none;
            }
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100%;
            width: 100%;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
          }

          body {
            counter-reset: page;
          }

          img {
            max-width: none !important;
          }

          .page-break {
            page-break-after: always;
          }

          .avoid-break {
            page-break-inside: avoid;
          }

          .no-print, .print-button {
            display: none !important;
            visibility: hidden !important;
            position: absolute !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Hide navigation and header elements */
          header, nav, .header, .navigation, [role="navigation"] {
            display: none !important;
          }

          .page-footer {
            display: none !important;
            visibility: hidden !important;
            position: absolute !important;
            height: 0 !important;
            width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .cover-page {
            page: fullbleed-cover;
            height: 297mm !important;
            width: 210mm !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: none !important;
            overflow: hidden !important;
            position: relative;
            box-sizing: border-box;
            page-break-before: avoid !important;
            page-break-after: always !important;
          }

          /* Ensure nothing creates a page before the cover */
          .print-container > .cover-page:first-of-type {
            page-break-before: auto !important;
          }

          .back-cover {
            page: fullbleed-cover;
            height: 297mm !important;
            width: 210mm !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: none !important;
            overflow: hidden !important;
            position: relative;
            box-sizing: border-box;
          }

          .hero-image {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 180px;
            z-index: 0;
          }

          .hero-image img {
            opacity: 0.12;
          }
        }

        * {
          box-sizing: border-box;
        }

        body {
          font-family: 'Roboto', sans-serif;
          margin: 0;
          padding: 0;
          background: #f5f5f5;
        }

        /* Hide navigation and header elements everywhere */
        header,
        nav,
        .header,
        .navigation,
        [role="navigation"],
        [role="banner"],
        body > div:first-child > header,
        body > div:first-child > nav,
        body > header,
        body > nav {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          overflow: hidden !important;
        }

        .print-container {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
        }

/* ========== COVER PAGE STYLES (Full-Bleed Image) ========== */
        .cover-page {
          height: 297mm;
          width: 210mm;
          padding: 0;
          margin: 0 auto;
          background: white;
          position: relative;
          page-break-after: always;
          box-sizing: border-box;
          overflow: hidden;
        }

        .back-cover {
          height: 297mm;
          width: 210mm;
          padding: 0;
          margin: 0 auto;
          background: white;
          position: relative;
          page-break-before: always;
          box-sizing: border-box;
          overflow: hidden;
        }

        @media print {
          .print-container {
            max-width: none !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /**
           * FULL BLEED using viewport units
           */
          .cover-page {
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            position: relative !important;
            overflow: hidden !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            box-sizing: border-box !important;
          }

          .back-cover {
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            position: relative !important;
            overflow: hidden !important;
            page-break-before: always !important;
            page-break-inside: avoid !important;
            box-sizing: border-box !important;
          }
        }

        /* Header Section */
        .cover-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0; /* Let parent gap handle spacing */
          width: 100%;
        }

        .project-badge {
          background: #2d4f8f;
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 500;
          font-size: 13px;
          margin-bottom: 15px;
          margin-top: 0;
          letter-spacing: 0.5px;
        }

        .cover-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 38px;
          font-weight: 800;
          color: #2d4f8f;
          margin: 0 0 20px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-align: center;
        }

        .logos {
          display: flex;
          align-items: center;
          gap: 40px;
          margin-bottom: 20px;
        }

        .logos img {
          height: 50px;
          width: auto;
          object-fit: contain;
        }

        .cover-subtitle {
          font-size: 16px;
          color: #4b5563;
          font-weight: 600;
          margin-top: 10px;
          text-align: center;
        }


        /* Hero Section */
        .hero-image-container {
          width: 100%;
          height: 400px !important;
          margin: 0; /* Let parent gap handle spacing */
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }

        .hero-img-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }


        /* Info Grid (Prepared For / Date) */
        .info-grid {
          width: 100%;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 60px; /* Horizontal gap increased */
          margin: 0; /* Let parent gap handle spacing */
        }

        .info-block {
          padding-left: 25px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 8px; /* Added internal gap */
        }

        .green-border {
          border-left: 4px solid #2d4f8f;
        }

        .info-block h3 {
          font-size: 15px; /* Increased from 13px */
          font-weight: 700;
          color: #374151;
          margin: 0 0 5px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-block p {
          font-size: 16px; /* Increased from 14px */
          color: #6b7280;
          margin: 0;
          line-height: 1.6;
        }


        /* Footer (Prepared By) */
        .footer-block {
          width: 100%;
          padding-left: 25px;
          border-left: 4px solid #1f2937;
          margin: 0; /* Let parent gap handle spacing */
        }

        .footer-block h3 {
          font-size: 16px; /* Increased from 15px */
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 15px 0;
        }

        .footer-details {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          font-size: 14px; /* Increased from 13px */
          color: #6b7280;
          margin-bottom: 10px;
        }

        .footer-phone {
           font-size: 14px; /* Increased from 13px */
           color: #6b7280;
        }

        .footer-details strong, .footer-phone strong {
          color: #374151;
          font-weight: 600;
        }

        .toc-page {
          padding: 40px 50px;
        }

        .toc-title {
          text-align: center;
          margin-bottom: 30px;
        }

        .toc-title h2 {
          font-family: 'Montserrat', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #2d4f8f;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }

        .toc-underline {
          width: 60px;
          height: 4px;
          background: #2d4f8f;
          margin: 15px auto;
          border-radius: 2px;
        }

        .toc-section {
          margin-bottom: 15px;
          page-break-inside: auto;
        }

        .toc-section-header {
          display: flex;
          align-items: baseline;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 6px;
          page-break-after: avoid;
        }

        .toc-section-header a {
          color: #1f2937;
          text-decoration: none;
        }

        .toc-dots {
          border-bottom: 1px dotted #d1d5db;
          margin: 0 8px;
          flex: 1;
        }

        .toc-case-list {
          margin-left: 12px;
          page-break-inside: auto;
        }

        .toc-case-item {
          display: flex;
          align-items: baseline;
          font-weight: 400;
          font-size: 11px;
          margin-bottom: 2px;
          page-break-inside: avoid;
        }

        .toc-case-item a {
          color: #374151;
          text-decoration: none;
        }

        .section-cover {
          min-height: 220mm;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          background: white;
          position: relative;
          padding: 40px;
          page-break-after: always;
        }

        .section-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 80px;
          font-weight: 800;
          color: rgba(0, 151, 57, 0.03);
          white-space: nowrap;
          pointer-events: none;
          z-index: 0;
          font-family: 'Montserrat', sans-serif;
        }

        .section-cover-content {
          position: relative;
          z-index: 2;
        }

        .section-cover-badge {
          background: #2d4f8f;
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 30px;
          font-size: 13px;
        }

        .section-cover-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: #2d4f8f;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .section-cover-count {
          font-size: 16px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 30px;
        }

        .section-cover-line {
          width: 120px;
          height: 4px;
          background: #2d4f8f;
          margin: 0 auto;
          border-radius: 2px;
        }

        .case-card {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 15px;
          page-break-inside: avoid;
        }

        .case-header {
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .case-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .risk-badge {
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
        }

        .risk-low {
          background-color: #dcfce7;
          color: #166534;
        }

        .risk-medium {
          background-color: #fef9c3;
          color: #854d0e;
        }

        .risk-high {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .case-body {
          padding: 12px 16px;
        }

        .case-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .case-section h3 {
          font-size: 14px;
          font-weight: 500;
          color: #111827;
          margin-bottom: 8px;
        }

        .case-field {
          margin-bottom: 8px;
        }

        .field-label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
        }

        .field-value {
          margin-top: 4px;
          font-size: 12px;
          color: #111827;
          word-wrap: break-word;
        }

        .additional-details {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .additional-details h3 {
          font-size: 14px;
          font-weight: 500;
          color: #111827;
          margin-bottom: 12px;
        }

        .additional-details-grid {
          column-count: 2;
          column-gap: 20px;
          display: block;
        }

        .additional-details-grid .case-field {
          break-inside: avoid;
          page-break-inside: avoid;
          display: inline-block;
          width: 100%;
          margin-bottom: 12px;
        }

        .additional-details-grid .field-value {
          text-align: justify;
        }

        .case-footer {
          display: none;
        }

        @media print {
          .case-footer {
            display: flex;
            align-items: center;
            gap: 20px;
            padding-top: 15px;
            margin-top: 20px;
            border-top: 1px solid #e5e7eb;
          }

          .case-footer img {
            height: 24px;
            width: auto;
          }
        }

        .print-button {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #2d4f8f;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          z-index: 1000;
        }

        .print-button:hover {
          background: #007a2e;
        }

        /* ========== APPENDIX STYLES ========== */

        .appendix-page {
          page-break-before: always;
          padding: 40px;
          background: white;
          min-height: 90vh;
        }

        .appendix-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #2d4f8f;
        }

        .appendix-badge {
          background: #2d4f8f;
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 15px;
          font-size: 12px;
        }

        .appendix-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #2d4f8f;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .appendix-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-top: 8px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .summary-card {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .summary-card-label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .summary-card-value {
          font-size: 24px;
          font-weight: 800;
          color: #2d4f8f;
        }

        .summary-card-value.small {
          font-size: 18px;
        }

        .appendix-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          font-size: 11px;
        }

        .appendix-table th {
          background: #2d4f8f;
          color: white;
          padding: 10px 8px;
          text-align: left;
          font-weight: 600;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .appendix-table td {
          padding: 10px 8px;
          border-bottom: 1px solid #e5e7eb;
          vertical-align: top;
        }

        .appendix-table tr:nth-child(even) {
          background: #f9fafb;
        }

        .appendix-table tr:hover {
          background: #f0fdf4;
        }

        .theme-section {
          margin-bottom: 25px;
        }

        .theme-title {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 10px;
          padding: 8px 12px;
          background: #f3f4f6;
          border-left: 4px solid #2d4f8f;
        }

        .theme-stats {
          display: flex;
          gap: 30px;
          padding: 10px 12px;
        }

        .theme-stat {
          display: flex;
          flex-direction: column;
        }

        .theme-stat-label {
          font-size: 10px;
          color: #6b7280;
          text-transform: uppercase;
        }

        .theme-stat-value {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
        }

        .theme-subsection {
          margin-top: 8px;
          padding: 8px 12px;
          background: #fafafa;
          border-radius: 6px;
        }

        .theme-subsection-label {
          font-size: 11px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .status-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 15px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 12px;
        }

        .status-item:nth-child(even) {
          background: #f9fafb;
        }

        .status-item-parties {
          flex: 1;
          font-weight: 500;
          color: #111827;
        }

        .status-item-counsel {
          color: #6b7280;
          margin-left: 20px;
          text-align: right;
        }

        .print-only {
          display: none;
        }

        @media print {
          .appendix-page {
            page-break-before: always;
            padding: 0;
            min-height: auto !important;
            height: auto !important;
            overflow: visible !important;
          }

          .print-only {
            display: block;
          }

          .summary-card {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .appendix-table th {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      ` }} />
  );
}
