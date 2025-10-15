import puppeteer from 'puppeteer';
import htmlInline from 'html-inline';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/decks/bridging-the-esg-finance-gap', { waitUntil: 'networkidle0' });
  const html = await page.content();
  const stream = htmlInline({ html, basePath: 'http://localhost:3000' });
  const writeStream = fs.createWriteStream('bridging-esg-finance-gap.html');
  stream.pipe(writeStream);
  writeStream.on('finish', () => {
    console.log('Saved to bridging-esg-finance-gap.html');
    browser.close();
  });
})();
