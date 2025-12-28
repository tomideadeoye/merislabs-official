# MerisLabs Monorepo Migration - Executive Brief

## Objective
Convert `merislabs-official` from a single Next.js app into a **pnpm monorepo** to productize our internal tools:
- `apps/main` - Current merislabs.com site (restructured to `src/`)
- `apps/legal` - `legal.merislabs.com` Product (migrated litigation audit)
- `apps/design` - `design.merislabs.com` (Portfolio, Decks, Tools)
- `packages/ui` - Shared UI components
- `packages/types` - Shared TypeScript types (Unified litigation types)
- `packages/data` - Shared litigation datasets
- `packages/config` - Shared Tailwind/ESLint configs

---

## Progress Tracker (Dec 25, 2025)

| Task | Description | Status | Owner |
|------|-------------|--------|-------|
| **T1** | Monorepo Scaffold (pnpm, Turbo, root configs) | ✅ Done | Antigravity |
| **T2** | Move existing app to `apps/main/src` | ✅ Done | Kilo/Antigravity |
| **T3** | Migrate Legal app to `apps/legal/src` | ✅ Done | Antigravity |
| **T4** | Extract shared UI to `packages/ui` | 🏗️ In Progress | Kilo |
| **T5** | Extract shared Types to `packages/types` | ✅ Done | Antigravity |
| T6 | Shared Configs in `packages/config` | ✅ Done | Kilo/Antigravity |
| TA1| Extract shared Data to `packages/data` | ✅ Done | Antigravity |
| TA2| Migrate Portfolio to `apps/design/src` | ✅ Done | Antigravity |
| T7 | Standardize `src/` convention across all apps | ✅ Done | Antigravity |
| T8 | Fix workspace imports (@merislabs/...) | ✅ Done | Antigravity |
| T9 | Vercel Deployment Setup | 🏗️ In Progress | Antigravity |
| T10| Restore Decks & Professional UI from `master` | ✅ Done | Antigravity |

---

## Recent Updates (Dec 27, 2025)

### 1. The "Decks" Restoration
- **Migration**: Successfully ported the complete `/decks` directory from the legacy `master` branch to `apps/main/src/app/decks/`.
- **Sub-routes**: All individual presentation pages (NICArb, BrandQor, MorganHacks, Bose Adeoye Retirement) are now functional within the monorepo.

### 2. Successes Section: Media Engine (ProjectMediaDisplay)
- **Priority Shift**: Implemented **Iframe (Working Example) > Video > Image** hierarchy. If a project has a working link, it's shown first to prove capability immediately.
- **Compatibility**: The component now supports both `image` and `img` keys in the project data array, ensuring legacy projects render correctly.
- **Rendering Fixes**: Removed `contain: layout style paint` from `ProjectMediaDisplay.css` as it was causing iframe invisibility in several browser engines.

### 3. Layout & Styling Root Fixes
- **Alias Resolution**: Standardized `tsconfig.json` to handle components located in both `src/app/components` and `src/components`.
- **Tailwind Scope**: Updated `tailwind.config.mjs` to scan both the `src/` directory and adjacent workspace packages (`@merislabs/ui`), preventing "Missing CSS" on production builds.
- **Client Logos**: Integrated BrandQor into the `Our Clients` section on the landing page with balanced scaling.

### 4. The Missing Links Restoration
- **Dynamic Projects**: Restored `apps/main/src/app/projects/[id]/page.tsx` with corrected path aliases to resolve 404 errors on legacy project links (e.g., Bundul, CyberStream).
- **Core Tools Migration**: Restored several missing specialized tools and routes from `master`:
    - `/business-software-notes`
    - `/tools/nicarb-flyers` & `/tools/nicarb-signatures`
    - `/invoice-generator` & `/invoice-jee`
    - `/wallpaper-generator`
- **State Management**: Migrated `app/state/fileSelection.ts` to support specific tool functionalities.

---

## Issues Noticed & Observations
1. **Dynamic Routes 404**: The monorepo migration initially missed the `app/projects/[id]` dynamic route, causing links from the landing page to break. This is now resolved.
2. **Video Playback Limitations**: GitHub raw URLs used for project videos don't work reliably in HTML5 `<video>` elements due to:
    - Lack of range request support (needed for seeking)
    - Incorrect Content-Type headers
    - CORS restrictions
    - **Current Solution**: Removed `autoPlay`, added error handling with fallback "Download Video" links
    - **Future Recommendation**: Migrate videos to a proper CDN (Cloudinary/Vercel Blob) or video platform (YouTube/Vimeo) for reliable playback
3. **Missing Assets**: `bundul.png` was missing in `master`. Using placeholders (`qorepay.png`) for now. Need to source the correct asset.
4. **Tool Visibility**: While tools are restored, they are not yet prominent in the main navigation. Consider adding a "Tools" category to the header or footer.
5. **Uncommitted/Branch Check**: Performance cross-reference with `master` branch confirmed no other significant branches (besides local `monorepo-migration`) exist with additional features.

---

## Component Mapping & Responsibilities (Legal Intelligence)

| Component | File Path | Responsibility |
|-----------|-----------|----------------|
| **PDF Orchestrator** | `apps/legal/src/app/audit/print-all-cases/page.tsx` | Main engine for fetching data and rendering the multi-page report. |
| **Front Cover** | `.../components/CoverPage.tsx` | Premium high-impact front cover (A4 full-bleed). |
| **Back Cover** | `.../components/BackCover.tsx` | Branded closing page (A4 full-bleed). |
| **Table of Contents** | `.../components/TableOfContents.tsx` | Dynamic TOC with page-link logic. |
| **Case Detail Card** | `.../components/CaseCard.tsx` | The atom of the report; displays metadata, suit numbers, and claim values. |
| **Section Header** | `.../components/SectionCover.tsx` | Full-page visual transition between audit categories. |
| **Print Engine** | `.../components/PrintGlobalStyles.tsx` | Critical CSS for forcing browsers to respect full-bleed covers and print sizing. |
| **Appendices (A-F)** | `.../components/appendices/*.tsx` | Specialized tabular views for summary data, low-value cases, themes, and blacklists. |

---

## Technical Architecture & Rationale

### 1. The `src/` Directory Standard
- **Why**: Standardizing on `src/` (e.g., `apps/legal/src/app`) ensures configuration files (`package.json`, `tailwind.config`, `tsconfig`) live at the root, while logic is isolated. This prevents "phantom" module resolution errors in Next.js 15.

### 2. Workspace Package Extraction
- **`@merislabs/types`**: Unified source of truth for all litigation data structures.
- **`@merislabs/data`**: Shared litigation datasets (Appeals, Ecobank cases, etc.) consumed by both Audit and Marketing.
- **Rationale**: We build once, consume everywhere. Avoids "Data Drift" where one dashboard shows different numbers than another.

### 3. Print-Specific Logic
- **DOM Removal**: On routes starting with `/print-`, the `NavigationBar` returns `null`. This is critical because `display: none` can still trigger layout offsets in Puppeteer/Safari print engines.
- **Global Print CSS**: Standardized via `PrintGlobalStyles.tsx` to handle the specific requirements of Nigerian legal report aesthetics (Navy headers, specific font weights).

---

## Execution Plan (Updated)

### Orion (Sovereign Architect)
- [x] Create monorepo structure and packages.
- [x] Migrate `legal` landing and dashboard to `apps/legal/src`.
- [x] Extract `@merislabs/types` and `@merislabs/data`.
- [x] Handle Decks migration and `ProjectMediaDisplay` enhancement.
- [x] Standardize Path Aliases in `tsconfig.json`.
- [x] Restore missing dynamic routes and tool pages.
- [ ] Finalize Vercel `pnpm` workspace deployment configuration.
- [ ] Audit `apps/design` for redundancy (consider merging into `apps/main` if separate domain isn't needed).

---

## Important Structure Notes

Imports should now follow these aliases:
- `@merislabs/ui` -> `packages/ui/src`
- `@merislabs/types` -> `packages/types/src`
- `@merislabs/data` -> `packages/data/src`
- `@/*` -> `./src/app/*` (Local app components/logic)
- `@/components/*` -> `./src/app/components/*` AND `./src/components/*`

---

*Last Updated: December 27, 2025 by Antigravity*
