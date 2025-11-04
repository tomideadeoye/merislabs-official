# MorganHacks 2026 Sponsorship Packet Design

## Overview
This document provides details on the new MorganHacks 2026 Sponsorship Packet design component that has been integrated into the ESG reporting system.

## Components Created

### 1. MorganHacksSponsorshipPacket (`MorganHacksSponsorshipPacket.tsx`)
A reusable React component that displays the sponsorship packet with the following features:
- Futuristic tech city theme with dystopian elements
- Spider-Man: Into the Spider-Verse inspired design
- Bold colors, neon glows, and glitch textures
- Display of previous sponsors in a responsive grid
- Call-to-action buttons for sponsorship inquiries

### 2. MorganHacksPage (`MorganHacksPage.tsx`)
A full ESG report page that incorporates the sponsorship packet component:
- Uses the HybridPage layout system
- Includes sponsorship tiers table
- Provides value proposition for sponsors
- Follows the same structure as other ESG pages

## How to Use

### In ESG Reports
To include the MorganHacks sponsorship packet in an ESG report, import and use the [MorganHacksPage] component:

```jsx
import { MorganHacksPage } from '@/components/reports/esg-pages/MorganHacksPage';

// In your report component
<MorganHacksPage pageNumber={15} />
```

### As a Standalone Component
To use just the sponsorship packet component:

```jsx
import { MorganHacksSponsorshipPacket } from '@/components/reports/esg-components/MorganHacksSponsorshipPacket';

// In your component
<MorganHacksSponsorshipPacket />
```

## Design Features

### Theme Implementation
- **Color Scheme**: Dark background with vibrant neon accents (cyan, purple, pink)
- **Typography**: Bold headings with gradient text effects
- **Layout**: Responsive grid system for sponsor logos
- **Visual Elements**: Glowing borders, hover effects, and gradient backgrounds

### Spider-Verse Inspiration
- Dynamic color transitions
- Asymmetric design elements
- Layered visual effects
- Animated hover states

## Sponsorship Tiers
The design includes a comprehensive sponsorship tiers table with benefits for:
- Bronze ($1,000)
- Silver ($2,500)
- Gold ($5,000)
- Platinum ($10,000)

Each tier provides progressively more visibility and engagement opportunities.

## Integration with Existing System
The component follows the same patterns as other ESG components:
- Uses the HybridPage layout system
- Supports footnotes and page numbering
- Responsive design for different screen sizes
- Consistent styling with the rest of the application
