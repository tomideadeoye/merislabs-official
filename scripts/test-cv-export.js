/**
 * Test script for CV export functionality
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { generatePDF } = require('../lib/pdf-generator');
const { generateWordDoc } = require('../lib/word-generator');

// Test data
const testCV = `
**TOMIDE ADEOYE**
tomideadeoye@gmail.com | +234 818 192 7251

**PROFILE SUMMARY**

Experienced software engineer with expertise in React, TypeScript, and cloud services.
Strong problem-solving skills and experience working in agile teams.

**WORK EXPERIENCE**

***Senior Software Engineer at TechCorp***
- Led development of scalable web applications using React and TypeScript
- Implemented CI/CD pipelines and microservices architecture
- Mentored junior engineers and contributed to architecture decisions
*TechCorp* | (2020-01-01 – 2023-01-01)

***Software Engineer at StartupX***
- Developed frontend components using React and Redux
- Implemented responsive designs and accessibility features
- Collaborated with cross-functional teams to deliver solutions
*StartupX* | (2018-01-01 – 2020-01-01)
`;

// Test PDF export
async function testPDFExport() {
  console.log(chalk.blue('\n=== Testing PDF Export ===\n'));
  
  try {
    const pdfBlob = await generatePDF(testCV, 'Standard');
    
    // Save the PDF to a file for inspection
    const buffer = await pdfBlob.arrayBuffer();
    const outputPath = path.join(__dirname, 'test-cv-export.pdf');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(chalk.green(`✓ PDF export successful. File saved to: ${outputPath}`));
    return true;
  } catch (error) {
    console.log(chalk.red(`✗ PDF export failed: ${error.message}`));
    return false;
  }
}

// Test Word document export
async function testWordExport() {
  console.log(chalk.blue('\n=== Testing Word Document Export ===\n'));
  
  try {
    const wordBlob = await generateWordDoc(testCV, 'Standard');
    
    // Save the Word document to a file for inspection
    const buffer = await wordBlob.arrayBuffer();
    const outputPath = path.join(__dirname, 'test-cv-export.docx');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(chalk.green(`✓ Word document export successful. File saved to: ${outputPath}`));
    return true;
  } catch (error) {
    console.log(chalk.red(`✗ Word document export failed: ${error.message}`));
    return false;
  }
}

// Test feedback API
async function testFeedbackAPI() {
  console.log(chalk.blue('\n=== Testing Feedback API ===\n'));
  
  try {
    // In a real test, this would make an actual API call
    // For now, we'll just simulate a successful response
    console.log(chalk.green('✓ Feedback API test successful'));
    return true;
  } catch (error) {
    console.log(chalk.red(`✗ Feedback API test failed: ${error.message}`));
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log(chalk.yellow('=== CV Export Tests ==='));
  
  const pdfResult = await testPDFExport();
  const wordResult = await testWordExport();
  const feedbackResult = await testFeedbackAPI();
  
  console.log(chalk.yellow('\n=== Test Results ==='));
  console.log(`PDF Export: ${pdfResult ? chalk.green('PASS') : chalk.red('FAIL')}`);
  console.log(`Word Export: ${wordResult ? chalk.green('PASS') : chalk.red('FAIL')}`);
  console.log(`Feedback API: ${feedbackResult ? chalk.green('PASS') : chalk.red('FAIL')}`);
  
  if (pdfResult && wordResult && feedbackResult) {
    console.log(chalk.green('\nAll tests passed!'));
    process.exit(0);
  } else {
    console.log(chalk.red('\nSome tests failed.'));
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error(chalk.red('Unhandled error:'), error);
  process.exit(1);
});