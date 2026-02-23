const fs = require('fs');

const filePath = '/Users/mac/Documents/GitHub/merislabs-official/apps/legal/src/app/reports/jee/baker-hughes-report-2026/data.ts';
let content = fs.readFileSync(filePath, 'utf8');

const links = [
    { suitStr: "NHC/9/CS/2024", link: "https://www.google.com/search?q=Intels+Nigeria+v+Baker+Hughes" },
    { suitStr: "LD/4853CMW/2023", link: "https://www.google.com/search?q=Pressure+Control+Systems+Eroton" },
    { suitStr: "FHC/L/CS/919/2007", link: "https://esgian.com/2023/12/29/esgian-rig-analytics-market-roundup-week-52-2/" },
    { suitStr: "NICN/PHC/61/2024", link: "https://www.google.com/search?q=Onuhadeka+Alli+Baker+Hughes" },
    { suitStr: "PHC/4676/CS/2020", link: "https://www.google.com/search?q=Baker+Hughes+Zenith+Bank+Fadfae" },
    { suitStr: "NICN/YEN/260/2016", link: "https://www.google.com/search?q=Godspower+Oke-Oghene+Baker+Hughes" },
    { suitStr: "NICN/LA/280/2021", link: "https://www.google.com/search?q=Richard+Anyanwu+Baker+Hughes" },
    { suitStr: "NICN/LA/04/2022", link: "https://www.google.com/search?q=Leonard+Okoronkwo+Baker+Hughes" },
    { suitStr: "FHC/ABJ/CS/49/2025", link: "https://www.oedigital.com/news/532200-dolphin-drilling-pursues-105m-payment-as-nigerian-receiver-takes-control-of-ghl" },
    { suitStr: "FHC/L/CS/2378/2024", link: "https://proshare.co/articles/225m-debt-the-exchanges-between-firstbank-and-general-hydrocarbons" },
    { suitStr: "OBIDIKE BONIFACE", link: "https://www.google.com/search?q=Obidike+Boniface+Baker+Hughes" }
];

let items = content.split('    {\n        suitNo: "');
for (let i = 1; i < items.length; i++) {
    // Only process up to closedCases (first 11 are litigationCases)
    if (i > 11) break;
    
    // items[i] starts with the actual string like "SUIT NO: NHC/9/CS/2024..."
    let block = items[i];
    
    for (const l of links) {
        if (block.includes(l.suitStr)) { // found
            // we need to add the link property right before the closing brace for this object.
            // Replace the last newline before "    }," or "    }"
            if (block.includes('nextSteps: "')) {
                items[i] = block.replace(/(nextSteps: ".*",?\n)/g, `$1        link: "${l.link}",\n`);
            } else if (block.includes('status: "')) {
                items[i] = block.replace(/(status: ".*",?\n)/g, `$1        link: "${l.link}",\n`);
            }
        }
    }
}

content = items.join('    {\n        suitNo: "');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated data.ts");
