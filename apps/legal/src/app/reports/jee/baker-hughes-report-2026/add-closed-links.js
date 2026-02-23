const fs = require('fs');

const filePath = '/Users/mac/Documents/GitHub/merislabs-official/apps/legal/src/app/reports/jee/baker-hughes-report-2026/data.ts';
let content = fs.readFileSync(filePath, 'utf8');

const links = [
    { suitStr: "PHC/1160/CS/2024", link: "https://www.google.com/search?q=F.T+GEOSOLUTIONS+Baker+Hughes" },
    { suitStr: "PHC/3042/CS/2023", link: "https://www.google.com/search?q=PASTOR+DOUGLAS+AMADI+Baker+Hughes" },
    { suitStr: "PHC/CS/3115/2023", link: "https://www.google.com/search?q=FIRST+MARINE+%26+ENGINEERING+SERVICES+Baker+Hughes" },
    { suitStr: "1014/2007", link: "https://www.google.com/search?q=TONWE+SUTE+BAKER+OIL+TOOLS" },
    { suitStr: "977EHA/2025", link: "https://www.google.com/search?q=ENVIRONMENTAL+HEALTH+AUTHORITY+Baker+Hughes" }
];

let items = content.split('    {\n        suitNo: "');
for (let i = 1; i < items.length; i++) {
    let block = items[i];

    for (const l of links) {
        if (block.includes(l.suitStr)) { // found
            if (block.includes('status: "')) {
                items[i] = block.replace(/(status: ".*",?\n)/g, `$1        link: "${l.link}",\n`);
            }
        }
    }
}

content = items.join('    {\n        suitNo: "');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated closed cases with links.");
