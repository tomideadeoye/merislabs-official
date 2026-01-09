/**
 * NICArb Gift Box Dimension Calculator
 *
 * Calculates panel sizes, flat sheet requirements, and validates print feasibility.
 * Run with: npx ts-node box-calculator.ts
 */

interface BoxDimensions {
    length: number;  // mm (front-to-back)
    width: number;   // mm (left-to-right)
    height: number;  // mm (top-to-bottom / depth)
    name: string;
}

interface PanelSizes {
    top: { width: number; height: number };
    bottom: { width: number; height: number };
    front: { width: number; height: number };
    back: { width: number; height: number };
    leftSide: { width: number; height: number };
    rightSide: { width: number; height: number };
}

interface FlatSheetRequirements {
    width: number;   // Total width when unfolded
    height: number;  // Total height when unfolded
    withBleed: { width: number; height: number }; // +3mm bleed on each edge
}

// Standard print sheet sizes (mm)
const PRINT_SHEETS = {
    A4: { width: 210, height: 297 },
    A3: { width: 297, height: 420 },
    A2: { width: 420, height: 594 },
    A1: { width: 594, height: 841 },
    A0: { width: 841, height: 1189 },
    // Common commercial sizes
    SRA3: { width: 320, height: 450 },
    SRA2: { width: 450, height: 640 },
    SRA1: { width: 640, height: 900 },
    B2: { width: 500, height: 707 },
    B1: { width: 707, height: 1000 },
};

// Box configurations to test
const BOX_OPTIONS: BoxDimensions[] = [
    { name: "Option A: Mug Upright (Premium)", length: 320, width: 280, height: 180 },
    { name: "Option B: Mug Laying (Compact)", length: 350, width: 280, height: 120 },
    { name: "Option C: Standard Corporate", length: 300, width: 250, height: 100 },
    { name: "Option D: Document Compatible", length: 330, width: 240, height: 80 },
];

// Calculate panel sizes from box dimensions
function calculatePanelSizes(box: BoxDimensions): PanelSizes {
    return {
        // Top & Bottom: Length × Width
        top: { width: box.length, height: box.width },
        bottom: { width: box.length, height: box.width },
        // Front & Back: Length × Height
        front: { width: box.length, height: box.height },
        back: { width: box.length, height: box.height },
        // Sides: Width × Height
        leftSide: { width: box.width, height: box.height },
        rightSide: { width: box.width, height: box.height },
    };
}

// Calculate flat sheet (die-cut) requirements
// Standard box layout: Cross pattern (+)
function calculateFlatSheet(box: BoxDimensions, flapSize: number = 20): FlatSheetRequirements {
    // Cross pattern layout:
    // Width: Height + Length + Height (top + bottom panels stacked vertically with front/back)
    // Actually for a standard tuck box:
    // Horizontal: LeftSide + Front + RightSide + Back + Glue Tab
    // Vertical: Top Flap + Height + Bottom + Bottom Flap

    const glueTab = 15; // mm

    // Horizontal span: 2×Width + 2×Length + glueTab
    const flatWidth = (2 * box.width) + (2 * box.length) + glueTab;

    // Vertical span: Height + Length (or Width, depending on top/bottom orientation) + flaps
    const flatHeight = box.height + box.width + (2 * flapSize);

    const bleed = 3; // mm on each side

    return {
        width: flatWidth,
        height: flatHeight,
        withBleed: {
            width: flatWidth + (2 * bleed),
            height: flatHeight + (2 * bleed),
        }
    };
}

// Find smallest print sheet that fits
function findPrintSheet(flatSheet: FlatSheetRequirements): { name: string; size: { width: number; height: number }; fits: boolean } | null {
    const required = flatSheet.withBleed;

    for (const [name, size] of Object.entries(PRINT_SHEETS)) {
        // Check both orientations
        const fitsPortrait = required.width <= size.width && required.height <= size.height;
        const fitsLandscape = required.width <= size.height && required.height <= size.width;

        if (fitsPortrait || fitsLandscape) {
            return { name, size, fits: true };
        }
    }

    return null;
}

// Calculate material cost estimate (rough)
function estimateMaterial(box: BoxDimensions, quantity: number = 100): { cardboardArea: number; costEstimate: string } {
    const flatSheet = calculateFlatSheet(box);
    const areaPerBox = (flatSheet.withBleed.width * flatSheet.withBleed.height) / 1000000; // m²
    const totalArea = areaPerBox * quantity;

    // Rough cost: ₦5,000-10,000 per m² for quality cardboard with print
    const costPerM2 = 7500; // NGN average
    const materialCost = totalArea * costPerM2;

    return {
        cardboardArea: totalArea,
        costEstimate: `₦${materialCost.toLocaleString()} - ₦${(materialCost * 1.5).toLocaleString()}`,
    };
}

// Main calculation and output
function analyzeBox(box: BoxDimensions): void {
    console.log("\n" + "=".repeat(60));
    console.log(`📦 ${box.name}`);
    console.log(`   Dimensions: ${box.length}mm × ${box.width}mm × ${box.height}mm`);
    console.log(`   (${(box.length / 25.4).toFixed(1)}" × ${(box.width / 25.4).toFixed(1)}" × ${(box.height / 25.4).toFixed(1)}")`);
    console.log("=".repeat(60));

    // Panel sizes
    const panels = calculatePanelSizes(box);
    console.log("\n📐 Panel Sizes:");
    console.log(`   Top/Bottom:    ${panels.top.width}mm × ${panels.top.height}mm`);
    console.log(`   Front/Back:    ${panels.front.width}mm × ${panels.front.height}mm`);
    console.log(`   Left/Right:    ${panels.leftSide.width}mm × ${panels.leftSide.height}mm`);

    // Flat sheet
    const flatSheet = calculateFlatSheet(box);
    console.log("\n📄 Flat Sheet (Die-Cut) Requirements:");
    console.log(`   Unfolded Size:  ${flatSheet.width}mm × ${flatSheet.height}mm`);
    console.log(`   With Bleed:     ${flatSheet.withBleed.width}mm × ${flatSheet.withBleed.height}mm`);

    // Print sheet fit
    const printFit = findPrintSheet(flatSheet);
    console.log("\n🖨️  Print Sheet Fit:");
    if (printFit) {
        console.log(`   ✅ Fits on: ${printFit.name} (${printFit.size.width}mm × ${printFit.size.height}mm)`);
    } else {
        console.log(`   ❌ Does NOT fit standard sheets. Requires custom print.`);
        console.log(`   💡 Consider: Split printing or smaller box dimensions.`);
    }

    // Material estimate (100 units)
    const material = estimateMaterial(box, 100);
    console.log("\n💰 Material Estimate (100 units):");
    console.log(`   Total Cardboard: ${material.cardboardArea.toFixed(2)} m²`);
    console.log(`   Estimated Cost:  ${material.costEstimate}`);

    // Contents capacity
    console.log("\n📦 Capacity Check:");
    const canFitMugUpright = box.height >= 170;
    const canFitA5Diary = box.length >= 220 && box.width >= 160;
    const canFitA4Folder = box.length >= 310 && box.width >= 230;

    console.log(`   Mug (standing):  ${canFitMugUpright ? '✅ Yes' : '❌ No (need 170mm+ height)'}`);
    console.log(`   A5 Diary:        ${canFitA5Diary ? '✅ Yes' : '❌ No'}`);
    console.log(`   A4 Folder:       ${canFitA4Folder ? '✅ Yes' : '❌ No'}`);
}

// Run analysis for all options
console.log("\n🛡️  NICArb Gift Box Dimension Analysis");
console.log("   Calculating optimal dimensions for: Tech accessories, Water Mug, Diary\n");

BOX_OPTIONS.forEach(analyzeBox);

console.log("\n" + "=".repeat(60));
console.log("📋 RECOMMENDATION:");
console.log("   For mug + diary + tech accessories:");
console.log("   → Option A (320×280×180mm) if mug should stand upright");
console.log("   → Option B (350×280×120mm) if mug can lay flat");
console.log("=".repeat(60) + "\n");
