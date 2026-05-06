const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');

const markdownContent = fs.readFileSync('./src/app/reports/jee/psp-business-plan-2026/fortify.md', 'utf8');
const lines = markdownContent.split('\n');

const docElements = [];

docElements.push(
  new Paragraph({
    text: 'PROJECT FORTIFY',
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 }
  }),
  new Paragraph({
    text: 'COMMERCIAL DISPUTES PRACTICE GROWTH PLAN',
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { after: 800 }
  })
);

let inList = false;

lines.forEach(line => {
  const cleanLine = line.trim();
  if (!cleanLine) return;

  if (cleanLine.startsWith('•') || cleanLine.startsWith('-')) {
    docElements.push(
      new Paragraph({
        text: cleanLine.replace(/^[•\-]\s*/, ''),
        bullet: { level: 0 },
        spacing: { before: 100, after: 100 }
      })
    );
  } else if (cleanLine === cleanLine.toUpperCase() && cleanLine.length > 15) {
    docElements.push(
      new Paragraph({
        text: cleanLine,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      })
    );
  } else {
    docElements.push(
      new Paragraph({
        text: cleanLine,
        spacing: { before: 100, after: 100 },
        alignment: AlignmentType.JUSTIFIED
      })
    );
  }
});

const doc = new Document({
  styles: {
    default: {
      heading1: {
        run: { color: 'E80000', size: 36, bold: true, font: 'Playfair Display' },
        paragraph: { spacing: { before: 240, after: 120 } }
      },
      heading2: {
        run: { color: '211B1B', size: 28, bold: true, font: 'Playfair Display' },
        paragraph: { spacing: { before: 240, after: 120 } }
      },
      document: {
        run: { size: 22, font: 'Inter' },
        paragraph: { spacing: { line: 360 } }
      }
    }
  },
  sections: [{ children: docElements }]
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('Project-Fortify-Plan.docx', buffer);
  console.log('Successfully created Project-Fortify-Plan.docx!');
});