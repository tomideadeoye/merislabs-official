/**
 * Test script for CV Tailoring System
 */

const fetch = require('node-fetch');
const chalk = require('chalk');

// Configuration
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5002';
const NEXTJS_API_URL = process.env.NEXTJS_API_URL || 'http://localhost:3000';

// Test data
const testData = {
  jdAnalysis: `
    Senior Software Engineer position requiring expertise in React, TypeScript, and cloud services.
    The ideal candidate will have 5+ years of experience building scalable web applications,
    strong communication skills, and experience working in agile teams.
    Experience with AWS, CI/CD pipelines, and microservices architecture is a plus.
  `,
  jobTitle: "Senior Software Engineer",
  companyName: "TechCorp",
  webResearchContext: "TechCorp is a leading technology company focused on cloud solutions."
};

// Helper function to log test results
function logResult(testName, success, message, data = null) {
  if (success) {
    console.log(chalk.green(`✓ ${testName}: ${message}`));
  } else {
    console.log(chalk.red(`✗ ${testName}: ${message}`));
  }
  
  if (data) {
    console.log(chalk.gray('  Data:'), typeof data === 'string' ? data : JSON.stringify(data, null, 2));
  }
}

// Fetch CV components
async function fetchCVComponents() {
  try {
    console.log(chalk.blue('\n=== Testing CV Component Fetching ===\n'));
    
    const response = await fetch(`${PYTHON_API_URL}/api/notion/cv-components`);
    const components = await response.json();
    
    logResult(
      'Fetch CV Components', 
      Array.isArray(components) && components.length > 0, 
      `Fetched ${components.length} components`,
      components.slice(0, 1)
    );
    
    return components;
  } catch (error) {
    logResult('Fetch CV Components', false, `Error: ${error.message}`);
    return [];
  }
}

// Suggest CV components
async function suggestCVComponents() {
  try {
    console.log(chalk.blue('\n=== Testing CV Component Suggestion ===\n'));
    
    const response = await fetch(`${PYTHON_API_URL}/api/llm/cv/suggest-components`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jd_analysis: testData.jdAnalysis,
        job_title: testData.jobTitle,
        company_name: testData.companyName
      })
    });
    
    const result = await response.json();
    
    logResult(
      'Suggest CV Components', 
      result.success && Array.isArray(result.suggested_component_ids), 
      `Suggested ${result.suggested_component_ids?.length || 0} components`,
      result
    );
    
    return result.suggested_component_ids || [];
  } catch (error) {
    logResult('Suggest CV Components', false, `Error: ${error.message}`);
    return [];
  }
}

// Rephrase CV component
async function rephraseComponent(componentId) {
  try {
    console.log(chalk.blue('\n=== Testing CV Component Rephrasing ===\n'));
    
    const response = await fetch(`${PYTHON_API_URL}/api/llm/cv/rephrase-component`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        component_id: componentId,
        jd_analysis: testData.jdAnalysis,
        web_research_context: testData.webResearchContext
      })
    });
    
    const result = await response.json();
    
    logResult(
      'Rephrase CV Component', 
      result.success && result.rephrased_content, 
      `Rephrased component ${componentId}`,
      {
        original: result.original_content?.substring(0, 100) + '...',
        rephrased: result.rephrased_content?.substring(0, 100) + '...'
      }
    );
    
    return result.rephrased_content;
  } catch (error) {
    logResult('Rephrase CV Component', false, `Error: ${error.message}`);
    return null;
  }
}

// Tailor CV summary
async function tailorSummary(componentId) {
  try {
    console.log(chalk.blue('\n=== Testing CV Summary Tailoring ===\n'));
    
    const response = await fetch(`${PYTHON_API_URL}/api/llm/cv/tailor-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        component_id: componentId,
        jd_analysis: testData.jdAnalysis,
        web_research_context: testData.webResearchContext
      })
    });
    
    const result = await response.json();
    
    logResult(
      'Tailor CV Summary', 
      result.success && result.tailored_content, 
      `Tailored summary ${componentId}`,
      {
        original: result.original_content?.substring(0, 100) + '...',
        tailored: result.tailored_content?.substring(0, 100) + '...'
      }
    );
    
    return result.tailored_content;
  } catch (error) {
    logResult('Tailor CV Summary', false, `Error: ${error.message}`);
    return null;
  }
}

// Assemble CV
async function assembleCV(componentIds, tailoredContentMap) {
  try {
    console.log(chalk.blue('\n=== Testing CV Assembly ===\n'));
    
    const response = await fetch(`${PYTHON_API_URL}/api/llm/cv/assemble`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selected_component_ids: componentIds,
        template_name: 'Standard',
        header_info: '**TOMIDE ADEOYE**\ntomideadeoye@gmail.com | +234 818 192 7251',
        tailored_content_map: tailoredContentMap
      })
    });
    
    const result = await response.json();
    
    logResult(
      'Assemble CV', 
      result.success && result.assembled_cv, 
      `Assembled CV with ${componentIds.length} components`,
      result.assembled_cv?.substring(0, 200) + '...'
    );
    
    return result.assembled_cv;
  } catch (error) {
    logResult('Assemble CV', false, `Error: ${error.message}`);
    return null;
  }
}

// Run the full test
async function runTest() {
  console.log(chalk.yellow('=== CV Tailoring System Test ==='));
  
  // Step 1: Fetch CV components
  const components = await fetchCVComponents();
  if (components.length === 0) {
    console.log(chalk.red('Cannot proceed with testing: No CV components found'));
    return;
  }
  
  // Step 2: Suggest components
  const suggestedComponentIds = await suggestCVComponents();
  if (suggestedComponentIds.length === 0) {
    console.log(chalk.red('Cannot proceed with testing: No components suggested'));
    return;
  }
  
  // Step 3: Rephrase a component
  const componentToRephrase = components.find(c => c.unique_id === suggestedComponentIds[0]);
  if (!componentToRephrase) {
    console.log(chalk.red('Cannot proceed with testing: Component not found'));
    return;
  }
  
  const rephrasedContent = await rephraseComponent(componentToRephrase.unique_id);
  
  // Step 4: Tailor a summary
  const summaryComponent = components.find(c => c.component_type === 'Profile Summary');
  let tailoredSummary = null;
  
  if (summaryComponent) {
    tailoredSummary = await tailorSummary(summaryComponent.unique_id);
  }
  
  // Step 5: Assemble CV
  const tailoredContentMap = {};
  if (rephrasedContent) {
    tailoredContentMap[componentToRephrase.unique_id] = rephrasedContent;
  }
  if (tailoredSummary && summaryComponent) {
    tailoredContentMap[summaryComponent.unique_id] = tailoredSummary;
  }
  
  const selectedComponentIds = suggestedComponentIds.slice(0, 5);
  if (summaryComponent && !selectedComponentIds.includes(summaryComponent.unique_id)) {
    selectedComponentIds.push(summaryComponent.unique_id);
  }
  
  await assembleCV(selectedComponentIds, tailoredContentMap);
  
  console.log(chalk.yellow('\n=== Test Complete ==='));
}

// Run the test
runTest().catch(error => {
  console.error(chalk.red('Unhandled error:'), error);
});