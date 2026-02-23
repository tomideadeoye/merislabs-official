const fs = require('fs');
const path = require('path');

const dir = '/Users/mac/Documents/GitHub/merislabs-official/apps/legal/src/app/reports/jee/baker-hughes-report-2026';

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Core color replacements for Light cinematic theme
    content = content.replace(/bg-\[\#0A0A0A\]/g, 'bg-[#F9F7ED]');

    // In LitigationSlide, the background uses text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 - we need to handle that carefully.
    content = content.replace(/from-white via-white to-white\/(\d+)/g, 'from-[#211B1B] via-[#211B1B] to-[#211B1B]/$1');

    content = content.replace(/text-white/g, 'text-[#211B1B]');
    content = content.replace(/bg-white\/(\d+)/g, 'bg-[#211B1B]/$1');
    content = content.replace(/text-white\/(\d+)/g, 'text-[#211B1B]/$1');
    content = content.replace(/border-white\/(\d+)/g, 'border-[#211B1B]/$1');

    // Remove invert from logos so they remain black/red
    content = content.replace(/brightness-0 invert/g, 'object-contain');

    // Specific tweaks
    content = content.replace(/bg-\[\#111\]/g, 'bg-gray-100');
    content = content.replace(/rgba\(255, 255, 255, /g, 'rgba(33, 27, 27, '); // For glass cards

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + filePath);
}

processFile(path.join(dir, 'page.tsx'));

const componentsDir = path.join(dir, 'components');
const components = fs.readdirSync(componentsDir);
for (const c of components) {
    if (c === 'CoverSlide.tsx' || c === 'NavigationContext.tsx' || c === 'SlideWrapper.tsx') continue;
    if (c.endsWith('.tsx')) {
        processFile(path.join(componentsDir, c));
    }
}
