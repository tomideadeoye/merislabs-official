---
description: Advanced Sovereign Architecture & Production QA Protocol
---

# /improve (The Sovereign Protocol)

**This is not an assistant's checklist. This is the Architect's Quality Gate for the MerisLabs Empire.**

---

## 🏛️ LAYER 1: DESIGN SYSTEM FIDELITY (The Visual Law)
*Guard the Midnight Emerald aesthetic. No generic defaults.*

- [ ] **Type Hierarchy**: Verify all text uses predefined `constants.ts` scales. No ad-hoc font sizes.
- [ ] **Color Harmony**: Check HSL values. Are we maintaining the 60-30-10 ratio for Emerald, Slate, and Gold?
- [ ] **Symmetry & Balance**: Inspect "Visual Mass." Are elements balanced across the landscape slab?
- [ ] **Micro-Animations**: Do transitions use the "Architect's Curve" (custom bezier)? No linear tweening.

## 🏗️ LAYER 2: STRUCTURAL INTEGRITY (The 3D Blueprint)
*The digital twin must survive physical production.*

- [ ] **"Laptop Slab" Protocol**: Force `Width > Height` for all lid panels. Lockdown rotation to 0 in 2D views.
- [ ] **Hinge Physics**: In `Box3DPreview.tsx`, lid must originate from the long-back edge. Verify `y-pivot`.
- [ ] **Margin of Error**: Do we have 5mm bleeds on all dieline edges? Check `box-calculator.ts`.
- [ ] **Intersection Check**: Ensure side-panel flaps do not overlap visual content on the lid.

## 🖨️ LAYER 3: PRODUCTION GATE (Print & Pre-Flight)
*Final check before the "Invoice" is sent.*

- [ ] **Asset Resolution**: All images (Maps, Logos) must be effectively 300+ DPI.
- [ ] **Color Space**: Are we simulating CMYK profiles to avoid "RGB Glow" disappointment?
- [ ] **Ink Coverage**: High-density zones (Dark Emerald) checked for TAC (Total Area Coverage) limits.
- [ ] **Vector Integrity**: Ensure the "Sovereign Orbit" remains a sharp vector/SVG. No pixelation.

## 🧠 LAYER 4: SELF-EVOLUTION (The Intelligence Loop)
*If we hit a wall, we upgrade the wall.*

- [ ] **Pattern Recognition**: Did we fail this task twice? Rename the error and encode a specific "Anti-Correction Module."
- [ ] **Efficiency Audit**: Did it take 3+ turns to find a file? Propose a new `ls` script or directory flat-map.
- [ ] **The "Bogus" Breaker**: Strip any corporate "diplomatese" from comments. Keep technical notes ruthless and clear.

---

## 🚀 EXECUTION DIRECTIVE
1. **HALT** if Layer 1 fails. We do not build on shaky foundations.
2. **VERIFY** Layer 2 by running `box-calculator.ts` with custom params.
3. **COMMIT** only when all gates are green.

*Last Refactored: Jan 8, 2026 (Orion v2.05)*
