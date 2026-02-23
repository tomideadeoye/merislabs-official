const fs = require('fs');

const filePath = '/Users/mac/Documents/GitHub/merislabs-official/apps/legal/src/app/reports/jee/baker-hughes-report-2026/data.ts';
let content = fs.readFileSync(filePath, 'utf8');

// The bug was omitting the comma in lines like: nextSteps: "..."\n        link: "..."
// We need to add the comma before the newline.
content = content.replace(/"\n        link: "/g, '",\n        link: "');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Fixed missing commas in data.ts");
