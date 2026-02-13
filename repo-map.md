# MerisLabs Repository Map

> **Last Updated:** February 13, 2026  
> **Repository:** merislabs-official  
> **Package Manager:** pnpm 10.12.2  
> **Node Version:** >=20.0.0

---

## 1. Project Overview

MerisLabs is a **Next.js monorepo** containing multiple web applications and shared packages for professional services, including legal case management, presentation decks, asset design tools, and business software solutions.

**Key Technologies:**

- Next.js 16.0.8 with React 19
- TypeScript 5
- Tailwind CSS
- Radix UI + Shadcn/ui components
- Turbo (monorepo task runner)
- pnpm workspaces

---

## 2. Monorepo Structure

```
merislabs-official/
├── apps/                    # Application packages
│   ├── main/               # Primary application (main site)
│   ├── legal/              # Legal case management system
│   ├── design/             # Design tools and presentations
│   └── nextjs/             # Next.js components and templates
├── packages/               # Shared packages
│   ├── config/             # Shared configuration (ESLint, Tailwind, TS)
│   ├── data/               # Shared data and constants
│   ├── types/              # Shared TypeScript types
│   └── ui/                 # Shared UI components
├── scripts/                # Build and development scripts
├── out/                    # Static export output
└── public/                 # Static assets
```

---

## 3. Applications (`apps/`)

### 3.1 Main App (`apps/main/`)

The primary application serving as the main MerisLabs website with business tools.

**Key Features:**

- Asset Factory - Design tool for creating branded assets
- NICArb Tools - Gift boxes, flyers, email signatures
- Presentation Decks - Interactive slide decks
- Project showcase pages
- Wallpaper generator

**Directory Structure:**

```
apps/main/src/
├── app/
│   ├── components/         # Shared app components
│   │   ├── ui/            # UI components (buttons, cards, etc.)
│   │   └── orion/         # Orion-specific components
│   ├── decks/             # Presentation decks
│   │   ├── nicarb-annual-conference-2025/
│   │   ├── bridging-the-esg-finance-gap/
│   │   ├── bose-adeoye-retirement/
│   │   ├── morganhacks-2026/
│   │   └── brandqor-workshop-2026/
│   ├── tools/
│   │   ├── asset-factory/     # Asset design tool
│   │   │   ├── components/    # Visual selectors
│   │   │   └── templates/     # Design templates
│   │   │       ├── nicarb-gift-box-v2/  # 3D box designer
│   │   │       ├── NICArbLuxuryTemplate.tsx
│   │   │       ├── PresidentialTemplate.tsx
│   │   │       ├── DarkLuxuryTemplate.tsx
│   │   │       └── [15+ more templates]
│   │   ├── nicarb-flyers/
│   │   └── nicarb-signatures/
│   ├── projects/[id]/      # Project detail pages
│   ├── wallpaper-generator/
│   ├── business-software-notes/
│   ├── jee-union-bank-report-1/  # Banking audit report
│   ├── state/              # State management (file selection)
│   └── styles/             # Utility styles
├── types/                  # TypeScript type definitions
└── [config files]
```

### 3.2 Legal App (`apps/legal/`)

A comprehensive legal case management and audit reporting system.

**Key Features:**

- Case audit reports with print layouts
- Litigation tracking
- Case summaries and appendices
- Authentication system

**Directory Structure:**

```
apps/legal/src/
├── app/
│   ├── audit/              # Audit functionality
│   │   ├── print-all-cases/    # Print-optimized case reports
│   │   │   ├── components/     # Print components
│   │   │   │   ├── appendices/ # Appendix sections (A-F)
│   │   │   │   ├── CaseCard.tsx
│   │   │   │   ├── CoverPage.tsx
│   │   │   │   ├── TableOfContents.tsx
│   │   │   │   └── [more components]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── library/            # Legal library
│   ├── login/              # Authentication
│   ├── components/ui/      # UI components
│   └── state/              # App state
└── [config files]
```

**Appendices Structure:**

- `AppendixASummary.tsx` - Case summary
- `AppendixBLowValue.tsx` - Low-value cases
- `AppendixCLitigationThemes.tsx` - Litigation themes
- `AppendixDDormant.tsx` - Dormant cases
- `AppendixEPending.tsx` - Pending cases
- `AppendixFBlacklisted.tsx` - Blacklisted entities

### 3.3 Design App (`apps/design/`)

Design-focused application for presentations and visual assets.

**Key Features:**

- Presentation decks (same as main but design-focused)
- Asset generation tools
- Visual design utilities

**Directory Structure:**

```
apps/design/src/
├── app/
│   ├── decks/              # Presentation decks
│   ├── tools/              # Design tools
│   ├── projects/           # Project showcases
│   ├── components/         # Design components
│   └── [app files]
└── [config files]
```

### 3.4 Next.js Templates (`apps/nextjs/`)

Base Next.js application templates and components.

---

## 4. Shared Packages (`packages/`)

### 4.1 Config Package (`packages/config/`)

Shared configuration for the monorepo.

```
packages/config/
├── src/
│   ├── index.ts           # Main exports
│   └── tailwind/          # Tailwind configuration
├── eslint.config.js       # Shared ESLint rules
├── tailwind.config.ts     # Shared Tailwind config
└── tsconfig.json          # Shared TypeScript config
```

### 4.2 Data Package (`packages/data/`)

Shared data constants and datasets.

```
packages/data/src/
├── index.ts               # Main exports
├── all-cases.ts           # Legal case data
├── appeals.ts             # Appeals data
├── high-claim-cases.ts    # High-value cases
├── lawFirmMappings.ts     # Law firm mappings
├── matters-against-bank.ts # Banking matters
└── cases-instituted-by-ecobank.ts # Ecobank cases
```

### 4.3 Types Package (`packages/types/`)

Shared TypeScript type definitions.

```
packages/types/src/
└── index.ts               # Type exports
```

### 4.4 UI Package (`packages/ui/`)

Shared UI components library.

```
packages/ui/src/
├── index.ts               # Component exports
├── badge.tsx              # Badge component
├── button.tsx             # Button component
├── card.tsx               # Card component
├── navigation-menu.tsx    # Navigation menu
├── table.tsx              # Table component
└── utils.ts               # Utility functions
```

---

## 5. Key Configuration Files

### Root Level Configuration

| File                   | Purpose                                                     |
| ---------------------- | ----------------------------------------------------------- |
| `pnpm-workspace.yaml`  | pnpm workspace configuration (apps/_, packages/_)           |
| `turbo.json`           | Turborepo task orchestration (build, dev, lint, type-check) |
| `package.json`         | Root package with shared dependencies                       |
| `.eslintrc.json`       | ESLint configuration                                        |
| `eslint.config.mjs`    | ESLint flat config                                          |
| `.prettierrc`          | Prettier formatting rules                                   |
| `.stylelintrc.json`    | CSS/SCSS linting                                            |
| `tsconfig.tsbuildinfo` | TypeScript build cache                                      |
| `.nvmrc`               | Node version specification                                  |

### App-Level Configuration

Each app contains:

- `package.json` - App-specific dependencies
- `next.config.js/mjs` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.mjs` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration
- `vercel.json` - Vercel deployment config (where applicable)

---

## 6. Scripts and Tooling

### Available Scripts (Root)

```json
{
  "dev": "node scripts/dev.mjs", // Development server
  "map": "node scripts/dev.mjs --info-only", // Show app info
  "build": "next build --webpack", // Production build
  "build:vercel": "next build --webpack", // Vercel build
  "start": "next start", // Start production server
  "lint": "eslint '**/*.ts*' --fix .", // Lint all files
  "test": "jest", // Run tests
  "test:watch": "jest --watch", // Run tests in watch mode
  "deploy:vercel": "vercel --prod" // Deploy to Vercel
}
```

### Custom Scripts (`scripts/`)

```
scripts/
├── dev.mjs                      # Development orchestrator
└── export-nicarb-box-panels.mjs # NICArb box panel exporter
```

### Utility Scripts (Root)

| Script                       | Purpose                       |
| ---------------------------- | ----------------------------- |
| `generate-nicarb-invoice.js` | Invoice generation for NICArb |
| `generate-single-html.js`    | Single HTML file generator    |
| `index-browser.js`           | Browser-specific utilities    |

---

## 7. Asset Templates (Asset Factory)

The Asset Factory contains 20+ design templates for creating branded materials:

### NICArb Templates

- `NICArbLuxuryTemplate.tsx` - Premium luxury design
- `RoyalObsidianTemplate.tsx` - Royal obsidian theme
- `RoyalObsidianWhiteTemplate.tsx` - Light variant
- `EmeraldPrestigeTemplate.tsx` - Emerald green prestige
- `EmeraldPrestigeAllWhiteTemplate.tsx` - White variant
- `EmeraldFestiveJazzTemplate.tsx` - Festive design

### Corporate Templates

- `PresidentialTemplate.tsx` - Executive style
- `PresidentialExecutiveTemplate.tsx` - Enhanced executive
- `DarkLuxuryTemplate.tsx` - Dark luxury theme
- `CleanCorporateTemplate.tsx` - Minimal corporate

### Gift Box Templates

- `nicarb-gift-box-v2/` - Full 3D box designer with:
  - `Box3DPreview.tsx` - 3D visualization
  - `FrontPanel.tsx`, `BackPanel.tsx`, `SidePanels.tsx`
  - `TopPanel.tsx`, `BottomPanel.tsx`, `InnerPanel.tsx`
  - `box-calculator.ts` - Dimension calculations
  - `PatternBackground.tsx` - Background patterns
  - `SovereignOrbit.tsx` - Orbital design element

### Special Templates

- `LifestyleTemplate.tsx` - Lifestyle photography
- `TealDrapesTemplate.tsx` - Teal curtain design
- `HolidayCardTemplate.tsx` - Holiday greetings
- `AppreciationCardTemplate.tsx` - Thank you cards

---

## 8. Presentation Decks

### Available Decks

1. **NICArb Annual Conference 2025**
   - Path: `apps/main/src/app/decks/nicarb-annual-conference-2025/`
   - Interactive presentation with client-side rendering

2. **Bridging the ESG Finance Gap**
   - Path: `apps/main/src/app/decks/bridging-the-esg-finance-gap/`
   - ESG (Environmental, Social, Governance) finance presentation

3. **Bose Adeoye Retirement**
   - Path: `apps/main/src/app/decks/bose-adeoye-retirement/`
   - Retirement tribute presentation

4. **MorganHacks 2026**
   - Path: `apps/main/src/app/decks/morganhacks-2026/`
   - Hackathon presentation

5. **BrandQor Workshop 2026**
   - Path: `apps/main/src/app/decks/brandqor-workshop-2026/`
   - Workshop presentation materials

### Deck Structure

```
decks/[name]/
├── page.tsx           # Server component
├── client.tsx         # Client-side presentation logic
└── slides.ts          # Slide definitions (optional)
```

---

## 9. Static Assets

### Output Directory (`out/`)

Contains static export artifacts:

```
out/
├── _next/             # Next.js static assets
│   ├── static/        # JS chunks, CSS
│   └── [build-id]/    # Build-specific files
├── bridgin_financing_gap/   # ESG deck images
├── images/            # General images
├── videos/            # Video assets
├── [project-images]/  # Project screenshots
└── favicon.ico
```

### Public Assets (`public/`)

```
public/
└── nicarb/
    ├── lagos-skyline.jpg
    └── lagos-skyline.png
```

### Assets Directory (`assets/`)

```
assets/
└── logos/
    └── nicarb/        # NICArb logo assets
```

---

## 10. Documentation

### Handoff Documents

- `HANDOFF_FOR_NEW_CHAT.md` - New chat context
- `HANDOFF_SOVEREIGN_FEBRUARY_2026.md` - February 2026 context
- `MONOREPO_MIGRATION_BRIEF.md` - Migration notes

### Setup Documents

- `README.md` - Type usage guidelines
- `VERCEL_SETUP.md` - Vercel deployment guide
- `DEPLOYMENT.md` - General deployment notes

### Generated Assets

- `decks_page_*.png` - Screenshots for documentation
- `horizontal_b64.txt`, `stacked_b64.txt` - Base64 encoded assets
- `NICArb_Logos_Final.zip` - Logo package

---

## 11. Type System Architecture

### Prisma as Source of Truth

**Guideline:** All enums and types must be imported from `@/lib/types`

```typescript
// CORRECT
import { Opportunity, $Enums } from '@/lib/types';
const type = $Enums.OpportunityType;

// INCORRECT
import { OpportunityType } from '@/generated';
import { Opportunity } from '@prisma/client';
```

This ensures:

- Single source of truth
- DRY (Don't Repeat Yourself)
- Monorepo-safe imports
- Strict type safety

---

## 12. Development Workflow

### Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build all apps
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

### Working with Multiple Apps

```bash
# View app information
pnpm map

# Run specific app
cd apps/main && pnpm dev
cd apps/legal && pnpm dev
```

### Adding New Templates

1. Create template in `apps/main/src/app/tools/asset-factory/templates/`
2. Export from `apps/main/src/app/tools/asset-factory/templates/index.ts`
3. Add to data file if needed
4. Update template selector component

---

## 13. Dependencies Overview

### Core Framework

- **Next.js 16.0.8** - React framework
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety

### UI Libraries

- **@radix-ui/\*** - Headless UI primitives
- **@shadcn/ui** - Component library
- **framer-motion** - Animation library
- **tailwindcss** - CSS framework
- **lucide-react** - Icon library

### Data & Visualization

- **@nivo/\*** - Data visualization
- **recharts** - Charts
- **reactflow** - Node-based graphs

### Document Generation

- **@react-pdf/renderer** - PDF generation
- **jspdf** - PDF creation
- **html2canvas-pro** - HTML to canvas
- **docx** - Word documents

### Utilities

- **zustand** - State management
- **@tanstack/react-query** - Data fetching
- **zod** - Schema validation
- **react-hook-form** - Form handling
- **date-fns** - Date utilities

---

## 14. Key Features by App

### Main App Features

- ✅ Asset Factory with 20+ templates
- ✅ NICArb branded materials generator
- ✅ Interactive presentation decks
- ✅ Project showcase
- ✅ Wallpaper generator
- ✅ Business software notes

### Legal App Features

- ✅ Comprehensive case audit system
- ✅ Print-optimized reports
- ✅ Litigation tracking
- ✅ Case categorization (A-F appendices)
- ✅ Authentication system

### Design App Features

- ✅ Design-focused deck presentations
- ✅ Asset generation tools
- ✅ Visual design utilities

---

## 15. Navigation Quick Reference

### Find By Purpose

| Looking For          | Location                                                              |
| -------------------- | --------------------------------------------------------------------- |
| Design Templates     | `apps/main/src/app/tools/asset-factory/templates/`                    |
| 3D Box Designer      | `apps/main/src/app/tools/asset-factory/templates/nicarb-gift-box-v2/` |
| Presentation Decks   | `apps/*/src/app/decks/`                                               |
| Legal Case Reports   | `apps/legal/src/app/audit/print-all-cases/`                           |
| Shared UI Components | `packages/ui/src/`                                                    |
| Shared Data          | `packages/data/src/`                                                  |
| Type Definitions     | `packages/types/src/`                                                 |
| Configuration        | `packages/config/src/`                                                |
| Scripts              | `scripts/`                                                            |
| Static Output        | `out/`                                                                |
| Public Assets        | `public/`                                                             |

### Find By File Type

| File Type    | Location Pattern                                 |
| ------------ | ------------------------------------------------ |
| Components   | `apps/*/src/app/components/`, `packages/ui/src/` |
| Pages/Routes | `apps/*/src/app/**/page.tsx`                     |
| Layouts      | `apps/*/src/app/layout.tsx`                      |
| State        | `apps/*/src/app/state/`                          |
| Styles       | `apps/*/src/app/styles/`, `apps/*/src/app/css/`  |
| Types        | `apps/*/src/types/`, `packages/types/src/`       |
| Config       | Root, `apps/*/` root, `packages/*/` root         |

---

## 16. Architecture Patterns

### Monorepo Organization

- **Apps** contain user-facing features
- **Packages** contain shared code
- **Clear separation** between business logic and UI

### Component Architecture

- **UI components** in `packages/ui` (shared)
- **App-specific components** in `apps/*/src/app/components/`
- **Feature components** co-located with features

### State Management

- **Zustand** for client state (`apps/*/src/app/state/`)
- **React Query** for server state
- **URL state** for shareable UI state

### Template System

- Templates are React components
- Template data passed via props
- Selector component for switching templates
- Preview component for live rendering

---

## 17. Build & Deployment

### Build Pipeline

1. Turbo orchestrates builds across apps/packages
2. Dependencies build first (^build)
3. Outputs cached (.next/, dist/)
4. Static export generates `out/` directory

### Deployment Targets

- **Vercel** - Primary deployment platform
- **Static export** - For hosting anywhere

### Environment Files

- `.env` - Base environment
- `.env.local` - Local overrides (gitignored)
- `.env.example` - Template for required variables

---

## Map Legend

**Icons:**

- 📁 Directory
- 📄 File
- 🔧 Configuration
- 🚀 Script
- 🎨 Template
- 📊 Data
- 🧩 Component
- 📖 Documentation

**Patterns:**

- `*` - Wildcard (any value)
- `[name]` - Dynamic segment
- `(...)` - Optional/conditional

---

## Contributing

When adding new features:

1. Place shared code in `packages/`
2. Keep app-specific code in `apps/`
3. Follow existing naming conventions
4. Update this map when adding major structures
5. Run `pnpm lint` before committing

---

_End of Repository Map_
