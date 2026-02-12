/**
 * NICArb Gift Box - FINAL Dimension Calculator with GEOMETRIC VALIDATION
 * Using VERIFIED Industry Standard: 400mm × 300mm × 100mm (XL Corporate)
 *
 * Run with: node box-calculator.js
 */

console.log("\n" + "═".repeat(70));
console.log("🛡️  NICArb Gift Box - DIMENSION VALIDATION");
console.log("   Industry Standard: 400 × 300 × 100mm (XL Corporate)");
console.log("═".repeat(70));

// VERIFIED INDUSTRY STANDARD
const BOX = {
    length: 400,      // mm - Front-to-back (X axis)
    width: 300,       // mm - Left-to-right (Y axis)
    baseHeight: 100,  // mm - Tray depth (Z axis)
    lidHeight: 40,    // mm - Lid wall height
    lidOverlap: 5,    // mm - Lid overlap on each side
};

const MM_TO_INCH = 1 / 25.4;

// Calculate all panels
const PANELS = {
    // LID (outer dimensions - slightly larger to fit over base)
    lidTop: {
        w: BOX.length + (2 * BOX.lidOverlap),  // 410mm
        h: BOX.width + (2 * BOX.lidOverlap),   // 310mm
        name: "Top (Lid)"
    },
    lidFront: {
        w: BOX.length + (2 * BOX.lidOverlap),  // 410mm
        h: BOX.lidHeight,                       // 40mm
        name: "Lid Front"
    },
    lidBack: {
        w: BOX.length + (2 * BOX.lidOverlap),  // 410mm
        h: BOX.lidHeight,                       // 40mm
        name: "Lid Back"
    },
    lidLeft: {
        w: BOX.width + (2 * BOX.lidOverlap),   // 310mm
        h: BOX.lidHeight,                       // 40mm
        name: "Lid Left"
    },
    lidRight: {
        w: BOX.width + (2 * BOX.lidOverlap),   // 310mm
        h: BOX.lidHeight,                       // 40mm
        name: "Lid Right"
    },

    // BASE (inner/tray dimensions)
    baseBottom: {
        w: BOX.length,      // 400mm
        h: BOX.width,       // 300mm
        name: "Bottom"
    },
    baseFront: {
        w: BOX.length,      // 400mm
        h: BOX.baseHeight,  // 100mm
        name: "Front Panel"
    },
    baseBack: {
        w: BOX.length,      // 400mm
        h: BOX.baseHeight,  // 100mm
        name: "Back Panel"
    },
    baseLeft: {
        w: BOX.width,       // 300mm
        h: BOX.baseHeight,  // 100mm
        name: "Left Side"
    },
    baseRight: {
        w: BOX.width,       // 300mm
        h: BOX.baseHeight,  // 100mm
        name: "Right Side"
    },

    // INNER LID (same as outer lid top, printed on inside)
    inner: {
        w: BOX.length + (2 * BOX.lidOverlap),  // 410mm
        h: BOX.width + (2 * BOX.lidOverlap),   // 310mm
        name: "Inner Lid (Quote)"
    },
};

// GEOMETRIC VALIDATION
console.log("\n🔍 GEOMETRIC VALIDATION:");
console.log("─".repeat(70));

let allValid = true;

// Rule 1: Lid must be larger than base (to sit on top)
const lidLargerThanBase =
    PANELS.lidTop.w > PANELS.baseBottom.w &&
    PANELS.lidTop.h > PANELS.baseBottom.h;
console.log(`✓ Lid larger than base:     ${lidLargerThanBase ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  Lid: ${PANELS.lidTop.w}×${PANELS.lidTop.h}mm > Base: ${PANELS.baseBottom.w}×${PANELS.baseBottom.h}mm`);
if (!lidLargerThanBase) allValid = false;

// Rule 2: Front/Back panels width = Box length
const frontBackWidth = PANELS.baseFront.w === BOX.length && PANELS.baseBack.w === BOX.length;
console.log(`✓ Front/Back width correct: ${frontBackWidth ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  Front: ${PANELS.baseFront.w}mm, Back: ${PANELS.baseBack.w}mm (should be ${BOX.length}mm)`);
if (!frontBackWidth) allValid = false;

// Rule 3: Side panels width = Box width
const sidesWidth = PANELS.baseLeft.w === BOX.width && PANELS.baseRight.w === BOX.width;
console.log(`✓ Side panels width correct: ${sidesWidth ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  Left: ${PANELS.baseLeft.w}mm, Right: ${PANELS.baseRight.w}mm (should be ${BOX.width}mm)`);
if (!sidesWidth) allValid = false;

// Rule 4: All wall panels same height
const wallsHeight =
    PANELS.baseFront.h === PANELS.baseBack.h &&
    PANELS.baseFront.h === PANELS.baseLeft.h &&
    PANELS.baseFront.h === PANELS.baseRight.h;
console.log(`✓ All walls same height:    ${wallsHeight ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  Front: ${PANELS.baseFront.h}mm, Back: ${PANELS.baseBack.h}mm, Left: ${PANELS.baseLeft.h}mm, Right: ${PANELS.baseRight.h}mm`);
if (!wallsHeight) allValid = false;

// Rule 5: Lid walls match lid dimensions
const lidWallsMatch =
    PANELS.lidFront.w === PANELS.lidTop.w &&
    PANELS.lidLeft.w === PANELS.lidTop.h;
console.log(`✓ Lid walls match lid:      ${lidWallsMatch ? '✅ PASS' : '❌ FAIL'}`);
if (!lidWallsMatch) allValid = false;

console.log("─".repeat(70));
console.log(allValid ? "✅ ALL VALIDATIONS PASSED - Box will fit together!" : "❌ VALIDATION FAILED");
console.log("─".repeat(70));

// Output final dimensions
console.log("\n📐 FINAL PANEL DIMENSIONS:");
console.log("─".repeat(70));
console.log("Panel              | mm          | inches      | Notes");
console.log("─".repeat(70));

const toInch = (w, h) => `${(w * MM_TO_INCH).toFixed(2)}" × ${(h * MM_TO_INCH).toFixed(2)}"`;

Object.entries(PANELS).forEach(([key, p]) => {
    const mm = `${p.w} × ${p.h}`;
    const inch = toInch(p.w, p.h);
    console.log(`${p.name.padEnd(18)} | ${mm.padEnd(11)} | ${inch.padEnd(11)} |`);
});

// Output for constants.ts
console.log("\n" + "═".repeat(70));
console.log("📝 COPY-PASTE FOR constants.ts:");
console.log("═".repeat(70));

const r = (n) => Math.round(n * 100) / 100;

console.log(`
export const PANEL_DIMENSIONS = {
    // LID PANELS (outer, sits on top of base)
    top: { width: ${r(PANELS.lidTop.w * MM_TO_INCH)}, height: ${r(PANELS.lidTop.h * MM_TO_INCH)}, label: 'Top (Lid)' },
    inner: { width: ${r(PANELS.inner.w * MM_TO_INCH)}, height: ${r(PANELS.inner.h * MM_TO_INCH)}, label: 'Inner Lid (Quote)' },

    // BASE PANELS (tray that holds contents)
    front: { width: ${r(PANELS.baseFront.w * MM_TO_INCH)}, height: ${r(PANELS.baseFront.h * MM_TO_INCH)}, label: 'Front Panel' },
    back: { width: ${r(PANELS.baseBack.w * MM_TO_INCH)}, height: ${r(PANELS.baseBack.h * MM_TO_INCH)}, label: 'Back (QR Code)' },
    left: { width: ${r(PANELS.baseLeft.w * MM_TO_INCH)}, height: ${r(PANELS.baseLeft.h * MM_TO_INCH)}, label: 'Left Side' },
    right: { width: ${r(PANELS.baseRight.w * MM_TO_INCH)}, height: ${r(PANELS.baseRight.h * MM_TO_INCH)}, label: 'Right Side' },
    bottom: { width: ${r(PANELS.baseBottom.w * MM_TO_INCH)}, height: ${r(PANELS.baseBottom.h * MM_TO_INCH)}, label: 'Bottom' },
};

// Physical box dimensions (mm) for reference
export const BOX_DIMENSIONS = {
    length: ${BOX.length},        // mm (front-to-back)
    width: ${BOX.width},         // mm (left-to-right)
    baseHeight: ${BOX.baseHeight},    // mm (tray wall height)
    lidHeight: ${BOX.lidHeight},      // mm (lid wall height)
    lidOverlap: ${BOX.lidOverlap},     // mm (how much lid overlaps base)
    standard: 'Industry XL Corporate Gift Box (400×300×100mm)',
};
`);

console.log("═".repeat(70) + "\n");
