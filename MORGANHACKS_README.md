# MorganHacks 2026 Sponsorship Packet Implementation

## Overview
This implementation adds a new sponsorship packet design for MorganHacks 2026 with a futuristic dystopian theme inspired by Spider-Man: Into the Spider-Verse. The design has been integrated into the existing ESG reporting system.

## Files Created

### Components
1. `app/components/reports/esg-components/MorganHacksSponsorshipPacket.tsx` - Main sponsorship packet component
2. `app/components/reports/esg-pages/MorganHacksPage.tsx` - Full ESG page incorporating the sponsorship packet
3. `app/components/reports/esg-pages/MorganHacksDemoPage.tsx` - Demo page showing usage

### Deck Integration
1. `app/decks/morganhacks-2026/page.tsx` - Main page for the MorganHacks deck
2. `app/decks/morganhacks-2026/client.tsx` - Client component wrapper

### Documentation
1. `MORGANHACKS_DESIGN.md` - Detailed design documentation
2. `MORGANHACKS_README.md` - This file

## Features Implemented

### Design Elements
- Futuristic tech city theme with dystopian elements
- Spider-Man: Into the Spider-Verse inspired visual style
- Bold colors, neon glows, and glitch textures
- Responsive grid layout for sponsor logos
- Interactive elements with hover effects

### Content Sections
- Event details (name, dates, location, theme)
- Design goals and visual elements
- Previous sponsors display (20+ companies)
- Sponsorship value proposition
- Detailed sponsorship tiers table

### Integration Points
- Added to the main decks page (`/decks`)
- Follows existing ESG page structure and patterns
- Uses the HybridPage layout system
- Responsive design for all screen sizes

## How to View

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000/decks` to see the decks page
3. Click on "MorganHacks 2026 Sponsorship" to view the packet

## Technical Details

### Component Structure
The implementation follows the existing ESG component patterns:
- Reusable `MorganHacksSponsorshipPacket` component
- Full-page `MorganHacksPage` component using HybridPage
- Proper TypeScript interfaces for props
- Consistent styling with Tailwind CSS

### Styling Approach
- Dark theme with vibrant accent colors (cyan, purple, pink)
- Gradient text effects for headings
- Glowing borders and shadows for depth
- Responsive grid layouts
- Interactive hover states

### Data Management
- Static sponsor data included in component
- Configurable page numbers and footnotes
- Flexible width/height properties
- TypeScript type safety throughout

## Future Enhancements

1. **Dynamic Sponsor Data**: Connect to a database or CMS for sponsor information
2. **Image Gallery**: Add the requested event pictures from `/Users/mac/Downloads/MorganHacks Pictures`
3. **Interactive Elements**: Add more animations and transitions
4. **PDF Export**: Implement PDF generation for the sponsorship packet
5. **Customization Options**: Allow theme customization for different events

## Usage Examples

### In ESG Reports
```jsx
import { MorganHacksPage } from '@/components/reports/esg-pages/MorganHacksPage';

// In your report component
<MorganHacksPage pageNumber={15} />
```

### As a Standalone Component
```jsx
import { MorganHacksSponsorshipPacket } from '@/components/reports/esg-components/MorganHacksSponsorshipPacket';

// In your component
<MorganHacksSponsorshipPacket />
```
