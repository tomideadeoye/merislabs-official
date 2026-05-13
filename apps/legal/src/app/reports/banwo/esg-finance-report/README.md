# ESG Finance Report Documentation

## Overview
This directory contains the Banwo & Ighodalo ESG Finance Insight Report (Sustainable Finance Series 2026). The report is a 15-page high-fidelity React application designed for both web viewing and high-quality PDF printing.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Vanilla Tailwind CSS
- **Icons:** Lucide React
- **Assets:** Custom assets located in `public/assets/`

## Component Structure
The report logic is centralized in `apps/legal/src/app/reports/banwo/esg-finance-report/`.

### 1. `page.tsx`
- The main entry point.
- Maps an array of React components (`pages`) to the `PageWrapper`.
- Handles the download action and routing.

### 2. `components/ContentPages.tsx`
- Contains all individual page components:
    - **SectionHeader:** The core architectural header with gold-shimmer styling.
    - **Content Sections:** Modular sections (Introduction, Demand Side, Supply Side, etc.).
    - **Infographics:** Custom SVG/Lucide-based visuals for internal/external barriers.
    - **FootnotesPage:** Consolidated footnotes layout.
    - **BackCover:** The architecturally-designed final page with contributors and office details.

### 3. `components/PageWrapper.tsx`
- Standardizes the PDF/print layout (210mm x 297mm - A4 dimensions).
- Handles header/footer injection and page numbering.

## Customization Guide

### Adding New Sections
1. Create a new `Export const` component in `ContentPages.tsx`.
2. Add it to the `pages` array in `page.tsx`.
3. If adding a new visual infographic, create a sub-component within `ContentPages.tsx` using `RoadmapStep` or the existing grid patterns to maintain design consistency.

### Updating Assets
- Store images in `apps/legal/public/assets/`.
- Reference them in components using `/assets/[filename]`.

### Modifying Print Layout
- The layout is constrained to `210mm` width and `297mm` height in `PageWrapper.tsx`.
- Use the `print:` Tailwind prefix for print-specific overrides (e.g., hiding the download button).

## Maintenance
- **Build:** `pnpm run build`
- **PDF Export:** Triggered via the `Download PDF` button (linked to the static build asset in `public/reports/banwo/esg-finance-report.pdf`).
