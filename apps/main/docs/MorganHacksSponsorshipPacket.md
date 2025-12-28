# MorganHacks Sponsorship Packet Component

## Overview
The MorganHacks Sponsorship Packet component is a React component designed to showcase the MorganHacks 2026 event sponsorship opportunities with a futuristic, Spider-Man: Into the Spider-Verse inspired design.

## Features
- Futuristic tech city theme with dystopian elements
- Responsive grid layout for sponsor logos
- Interactive call-to-action buttons
- Theme-consistent styling with Tailwind CSS
- Mobile-responsive design

## Usage

### Basic Usage
```jsx
import { MorganHacksSponsorshipPacket } from '@/components/reports/esg-components/MorganHacksSponsorshipPacket';

function MyComponent() {
  return (
    <div>
      <MorganHacksSponsorshipPacket />
    </div>
  );
}
```

### Props
This component does not require any props and is self-contained.

## Design Elements

### Color Scheme
- Primary: Dark background (#0f172a to #1e293b gradient)
- Accents: Cyan (#06b6d4), Purple (#8b5cf6), Pink (#ec4899)
- Text: Light gray (#e2e8f0) and white

### Typography
- Headings: Bold with gradient text effects
- Body: Clean, readable sans-serif fonts
- Labels: Small, uppercase tags for categorization

### Layout
- Responsive grid system for sponsor logos
- Card-based design with glowing borders
- Hover effects for interactive elements

## Customization
To customize the component, you can modify the Tailwind classes directly in the component file:
- Colors: Modify the gradient and text color classes
- Spacing: Adjust padding and margin values
- Typography: Change font sizes and weights
- Effects: Modify shadow and border properties

## Integration
The component is designed to integrate seamlessly with the existing ESG reporting system and follows the same patterns as other components in the codebase.

## Testing
The component includes a test suite that verifies:
- Correct rendering of all text elements
- Presence of interactive buttons
- Display of sponsor logos
- Responsive design elements

To run the tests:
```bash
npm test MorganHacksSponsorshipPacket
```
