# NICArb Sovereign Gift Box V2 - Asset Factory Template

An interactive, geometrically validated design system for the **NICArb 47th Anniversary Executive Gift Box**.

## 🧬 Overview
This template provides a comprehensive design and visualization environment for high-end corporate packaging. It moves beyond static 2D layouts by incorporating a high-fidelity **3D WebGL/CSS Mockup** that allows for real-time validation of panel alignment, text orientation, and structural integrity.

## 📏 Physical Specifications (Print Ready)
The design is built around the **Industry Standard XL Corporate Gift Box** size.

- **Base Dimensions**: 400mm (Width) × 300mm (Depth) × 100mm (Height)
- **Lid Dimensions**: 410mm × 310mm × 40mm (Full overlap with 5mm tolerances)
- **Target DPI**: 300 DPI for professional offset printing.
- **Orientation**: **Landscape / Wide Format** (Long-edge hinge). The box opens like a **Laptop**, not a Book.

### Panel Breakdown (Print Inches)
| Panel | Dimensions (W × H) | Description |
|-------|--------------------|-------------|
| **Top (Lid)** | 16.14" × 12.2" | Main Brand Showcase / Cover |
| **Inner Lid** | 16.14" × 12.2" | Experience / Quote Panel |
| **Front/Back** | 15.75" × 3.94" | Wide Frontal Interaction Area |
| **Left/Right** | 11.81" × 3.94" | Deep Side Walls |
| **Bottom** | 15.75" × 11.81" | Base Stability Panel |

## 🏗️ Technical Architecture

### Core Components
- `index.tsx`: Main entry point and tab-based navigation shell.
- `constants.ts`: Central truth for dimensions (`PANEL_DIMENSIONS`), brand colors (`NICARB_BRAND`), and geometric data.
- `Box3DPreview.tsx`: Interactive 3D model using `framer-motion` and CSS 3D transforms.
- `box-calculator.ts`: A utility for generating millimeter-to-inch conversions and validating structural tolerances.

### 🎨 Visual Identity
The system implements the **Midnight Emerald** palette:
- **Primary**: Midnight Emerald (`#032204`) - High institutional authority.
- **Tertiary**: Anniversary Red (`#B01E23`) - Emotional legacy.
- **Accents**: Brushed Brass & Muted Lime - Modernity and growth.
- **Assets**: Guilloche patterns, African Map contours, and Sovereign Orbit animations.

## 🕹️ Interactive 3D Mockup
The template features a custom 3D virtualization engine that is **not** dependent on high-overhead WebGL libraries. It uses optimized 3D CSS transforms for:
- **Hinge Simulation**: Real-world "Wide Back Hinge" opening animation.
- **Panel Mirroring**: The 3D faces reference the exact React components used in the 2D canvas, ensuring "What You See Is What Is Printed".
- **Dynamic Rotation**: 360-degree rotation to check wall-wrap continuity.

## ⚠️ CRITICAL FAILURE LOG & ARCHITECTURAL DECISIONS

### The "Portrait Letter" Failure (Jan 2026)
**Attempt:** We tried to use `Width < Height` dimensions for the Top Panel (Portrait) and simply rotate the content by -90 degrees.
**Result:** FAILED. The 2D view displayed the panel as a vertical "Standing Letter". While the *print* file might be rotation-agnostic, the *User Experience* was broken. A laptop box lid is perceived as a wide rectangle, not a tall one. Rotating the content inside a tall rectangle made editing confusing and destroyed the "Sovereign" feel.

### The "Rotation Hack" Failure
**Attempt:** We tried to keep the 2D canvas Portrait but use CSS transforms to rotate the entire view.
**Result:** FAILED. This misaligned the editor controls (Top/Left/Right/Bottom), caused drag-and-drop artifacts, and made the 2D preview inconsistent with the 3D model, which clearly showed a wide lid.

### ✅ FINAL SUCCESS ARCHITECTURE: The "Laptop Slab" Protocol
**Solution:**
1. **Force Landscape Geometry:** In `index.tsx`, we EXPLICITLY force `Width > Height` for all "Slab" panels (`Top`, `Inner`, `Bottom`). We equate `width = max(dim)` and `height = min(dim)`.
2. **Lock 2D Rotation:** We hard-coded `rotate: 0` for these panels in the 2D view to prevent accidental user rotation into portrait mode.
3. **Horizontal Content Flow:** Inner components (`TopPanel.tsx`, `InnerPanel.tsx`) use `flex-row` layouts to naturally fill the wide canvas without CSS rotation hacks.

**WARNING:** DO NOT REVERT TO PORTRAIT DIMENSIONS FOR LID PANELS. THEY MUST REMAIN WIDE > TALL.

## 🚀 Usage & Export
1. **Design Validation**: Switch between 2D tabs to refine specific panels (Logo placement on Front, Quote scaling on Inner).
2. **Structural Check**: Use the **3D PREVIEW** tab to verify that text on the Bottom panel is perpendicular to the longest side.
3. **Print Export**: Assets can be rendered to high-resolution PNGs at specific scales (default 80px/inch for preview, 300px/inch for production).

---
*Built within the Merislabs Asset Factory - Orion Sovereign Architect Subsystem*
