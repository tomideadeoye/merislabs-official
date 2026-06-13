# Proposal System — Design System & Architecture

A config-driven, template-based proposal engine for MerisLabs. Proposals are defined as JSON, rendered through swappable visual templates, and have a live edit mode for rapid iteration.

## Architecture

```
proposals/
├── lib/
│   ├── types.ts               # TypeScript schemas
│   ├── page-wrapper.tsx        # A4 print wrapper
│   ├── proposal-document.tsx   # Config + template → rendered pages
│   └── templates/
│       ├── registry.ts         # Template lookup + discovery
│       ├── indigo.tsx          # First template (gradient, card-grid)
│       └── professional.tsx    # Second template (minimal, underline)
├── data/
│   └── ai-workflow-consulting.json  # Example proposal config
├── [slug]/
│   └── page.tsx                # Dynamic proposal viewer
├── builder/
│   └── [slug]/
│       └── page.tsx            # Edit mode (template + color + text)
└── page.tsx                    # Proposals landing (auto-discovers data/)
```

## Adding a New Proposal

Create a JSON file in `data/{slug}.json` following the schema:

```json
{
  "slug": "my-proposal",
  "title": "Proposal Title",
  "template": "indigo",
  "brand": {
    "primary": "#4f46e5",
    "accent": "#7c3aed",
    "highlight": "#6d28d9",
    "text": "#1e293b",
    "textLight": "#64748b",
    "background": "#ffffff",
    "cardBg": "#f1f5f9"
  },
  "pages": [
    { "type": "cover", "title": "...", "subtitle": "...", "logo": "/MERISLABS-LOGO.png" },
    { "type": "stats", "title": "...", "subtitle": "...", "highlight": "...", "stats": [...] },
    { "type": "offerings", "title": "...", "subtitle": "...", "items": [...] },
    { "type": "pricing", "title": "...", "subtitle": "...", "note": "...", "tiers": [...] },
    { "type": "process", "title": "...", "subtitle": "...", "steps": [...] },
    { "type": "contact", "title": "...", "subtitle": "...", "cta": "...", "logo": "...", "blocks": [...] }
  ]
}
```

Pages render in order. You can include any subset — all 6 types are optional.

### Page Types

| Type | Renders | Editable fields (in builder) |
|------|---------|------------------------------|
| `cover` | Full-bleed gradient page with logo + title + subtitle | title, subtitle |
| `stats` | White page with header, section label, grid of stat cards | title, subtitle, highlight |
| `offerings` | 2-column card grid | title, subtitle |
| `pricing` | 2x2 tier grid + yellow note bar | title, subtitle, note |
| `process` | Vertical timeline with steps | title, subtitle |
| `contact` | Full-bleed gradient page with contact blocks | title, subtitle, cta |

## Adding a New Template

Create `lib/templates/{name}.tsx`:

```tsx
import type { BrandConfig, PageType } from '../types';
import type { TemplateDefinition } from './registry';
import { A4Page } from '../page-wrapper';

export const myTemplate: TemplateDefinition = {
  name: 'My Template',
  renderPage(page: PageType, brand: BrandConfig): React.ReactNode {
    switch (page.type) {
      case 'cover': return <A4Page key="cover">{/* ... */}</A4Page>;
      case 'stats': // ...
      // ... handle all 6 types
    }
  },
};
```

Then register in `registry.ts`:

```ts
import { myTemplate } from './my-template';

const registry: Record<string, TemplateDefinition> = {
  indigo,
  professional,
  'my-template': myTemplate,
};
```

Each page renderer receives the page data and brand config. The result is wrapped in `<A4Page>` with a unique `key`. Every `case` must return a ReactNode — no fall-through.

### Template Styling Guide

- **Cover/Contact pages** use full-bleed gradients. Use `brand.primary`, `brand.accent`, `brand.highlight`, `brand.background` for colors.
- **Inner pages** use white background (for print) and reference `brand.text`, `brand.textLight`, `brand.cardBg`, `brand.primary`.
- Use the `A4Page` component wrapper for every page — it provides print CSS and exact dimensions.
- `print-color-adjust: exact`, `@page { size: A4; margin: 0 }`, `page-break-after: always` are baked into the wrapper.

## Print CSS

```css
@page { size: A4; margin: 0 }
@media print {
  .page-wrapper { page-break-after: always; }
  .no-print { display: none !important; }
}
```

The `.page-wrapper` div is 210mm × 297mm with `overflow: hidden`. All templates render through this wrapper.

## Brand Config

| Field | Purpose | Example |
|-------|---------|---------|
| `primary` | Main brand color (buttons, headings, stats) | `#4f46e5` |
| `accent` | Accent (gradients, highlights) | `#7c3aed` |
| `highlight` | Gradient endpoint | `#6d28d9` |
| `text` | Body text color | `#1e293b` |
| `textLight` | Secondary/muted text | `#64748b` |
| `background` | White/page background | `#ffffff` |
| `cardBg` | Card/panel background | `#f1f5f9` |

All fields are required — the edit mode color picker toolbar lets you change any of them in real time.

## Edit Mode (`/proposals/builder/{slug}`)

Three editing panels:

1. **Template** — Switches between registered templates. The proposal re-renders instantly.
2. **Colors** — Inline color pickers for all 7 brand fields. Changes the rendered proposal live.
3. **Text** — Select a page by type, edit its title/subtitle/highlight/note/CTA fields in text inputs.

The edit mode is a separate route and does not persist changes to the JSON file. Use it as a preview-and-tune tool before updating the data file.

## Routes

| Route | Purpose |
|-------|---------|
| `/proposals` | Landing page — auto-discovers all JSON files in `data/` |
| `/proposals/{slug}` | View proposal with DownloadControls for PDF |
| `/proposals/builder/{slug}` | Edit mode — template + color + text editor |

## Dependencies

- `@merislabs/ui` — provides `DownloadControls` component (in-browser PDF download)
- Next.js dynamic imports for JSON data files (`@/proposals/data/{slug}.json`)
- Tailwind CSS for utility classes
