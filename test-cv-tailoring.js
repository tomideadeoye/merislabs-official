/**
 * Test script for CV Tailoring System
 * 
 * This script tests all components of the CV Tailoring System:
 * 1. Python API Server endpoints
 * 2. Next.js API Routes
 * 3. LLM integration
 */

const fetch = require('node-fetch');
const chalk = require('chalk');

// Configuration
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5002';
const NEXTJS_API_URL = process.env.NEXTJS_API_URL || 'http://localhost:3000';

// Test data
const testData = {
  jdAnalysis: `
    Job requires a skilled software engineer with 5+ years of experience in React, Node.js, and TypeScript.
    Must have experience with cloud services (AWS preferred) and CI/CD pipelines.
    The ideal candidate will have strong communication skills and experience working in agile teams.
    Experience with AI/ML is a plus.
  `,
  jobTitle: "Senior Software Engineer",
  companyName: "TechCorp Inc.",
  webResearchContext: "TechCorp is a leading technology company focused on AI solutions for enterprise clients."
};

// Helper function to log test results
function logResult(testName, success, message, data = null) {
  if (success) {
    console.log(chalk.green(`✓ ${testName}: ${message}`));
  } else {
    console.log(chalk.red(`✗ ${testName}: ${message}`));
  }
  
  if (data) {
    console.log(chalk.gray('  Data:'), data);
  }
}

// Test Python API Server endpoints
async function testPythonAPI() {
  console.log(chalk.blue('\n=== Testing Python API Server ===\n'));
  
  try {
    // Test health check
    const healthResponse = await fetch(`${PYTHON_API_URL}/`);
    const healthData = await healthResponse.json();
    logResult('Health Check', healthResponse.ok, 'Server is running', healthData);
    
    // Test CV components endpoint
    const componentsResponse = await fetch(`${PYTHON_API_URL}/api/notion/cv-components`);
    const componentsData = await componentsResponse.json();
    logResult(
      'CV Components', 
      componentsResponse.ok && Array.isArray(componentsData), 
      `Fetched ${componentsData.length} components`,
      componentsData.slice(0, 1)
    );
    
    // Store component IDs for later tests
    const componentIds = componentsData.map(c => c.unique_id);
    
    // Test suggest components endpoint
    const suggestResponse = await fetch(`${PYTHON_API_URL}/api/llm/cv/suggest-components`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jd_analysis: testData.jdAnalysis,
        job_title: testData.jobTitle,
        company_name: testData.companyName
      })
    });
    const suggestData = await suggestResponse.json();
    logResult(
      'Suggest Components', 
      suggestResponse.ok && suggestData.success, 
      `Suggested ${suggestData.suggested_component_ids?.length || 0} components`,
      suggestData
    );
    
    // Test rephrase component endpoint
    if (componentIds.length > 0) {
      const rephraseResponse = await fetch(`${PYTHON_API_URL}/api/llm/cv/rephrase-component`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          component_id: componentIds[0],
          jd_analysis: testData.jdAnalysis,
          web_research_context: testData.webResearchContext
        })
      });
      const rephraseData = await rephraseResponse.json();
      logResult(
        'Rephrase Component', 
        rephraseResponse.ok && rephraseData.success, 
        'Component rephrased successfully',
        rephraseData
      );
    }
    
    // Test tailor summary endpoint
    const summaryComponent = componentsData.find(c => c.component_type.includes('Summary'));
    if (summaryComponent) {
      const tailorResponse = await fetch(`${PYTHON_API_URL}/api/llm/cv/tailor-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          component_id: summaryComponent.unique_id,
          jd_analysis: testData.jdAnalysis,
          web_research_context: testData.webResearchContext
        })
      });
      const tailorData = await tailorResponse.json();
      logResult(
        'Tailor Summary', 
        tailorResponse.ok && tailorData.success, 
        'Summary tailored successfully',
        tailorData
      );
    }
    
    // Test assemble CV endpoint
    if (componentIds.length > 0) {
      const assembleResponse = await fetch(`${PYTHON_API_URL}/api/llm/cv/assemble`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selected_component_ids: componentIds.slice(0, 5),
          template_name: 'Standard',
          header_info: '**TOMIDE ADEOYE**\ntomideadeoye@gmail.com',
          tailored_content_map: {}
        })
      });
      const assembleData = await assembleResponse.json();
      logResult(
        'Assemble CV', 
        assembleResponse.ok && assembleData.success, 
        'CV assembled successfully',
        { cv_length: assembleData.assembled_cv?.length || 0 }
      );
    }
    
  } catch (error) {
    console.error(chalk.red('Error testing Python API:'), error);
  }
}

// Test Next.js API Routes
async function testNextJSAPI() {
  console.log(chalk.blue('\n=== Testing Next.js API Routes ===\n'));
  
  try {
    // Test suggest components endpoint
    const suggestResponse = await fetch(`${NEXTJS_API_URL}/api/orion/cv/suggest-components`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jd_analysis: testData.jdAnalysis,
        job_title: testData.jobTitle,
        company_name: testData.companyName
      })
    });
    const suggestData = await suggestResponse.json();
    logResult(
      'Suggest Components', 
      suggestResponse.ok && suggestData.success, 
      `Suggested ${suggestData.suggested_component_ids?.length || 0} components`,
      suggestData
    );
    
    // Get component IDs from Python API for testing
    const componentsResponse = await fetch(`${PYTHON_API_URL}/api/notion/cv-components`);
    const componentsData = await componentsResponse.json();
    const componentIds = componentsData.map(c => c.unique_id);
    
    // Test rephrase component endpoint
    if (componentIds.length > 0) {
      const rephraseResponse = await fetch(`${NEXTJS_API_URL}/api/orion/cv/rephrase-component`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          component_id: componentIds[0],
          jd_analysis: testData.jdAnalysis,
          web_research_context: testData.webResearchContext
        })
      });
      const rephraseData = await rephraseResponse.json();
      logResult(
        'Rephrase Component', 
        rephraseResponse.ok && rephraseData.success, 
        'Component rephrased successfully',
        rephraseData
      );
    }
    
    // Test tailor summary endpoint
    const summaryComponent = componentsData.find(c => c.component_type.includes('Summary'));
    if (summaryComponent) {
      const tailorResponse = await fetch(`${NEXTJS_API_URL}/api/orion/cv/tailor-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          component_id: summaryComponent.unique_id,
          jd_analysis: testData.jdAnalysis,
          web_research_context: testData.webResearchContext
        })
      });
      const tailorData = await tailorResponse.json();
      logResult(
        'Tailor Summary', 
        tailorResponse.ok && tailorData.success, 
        'Summary tailored successfully',
        tailorData
      );
    }
    
    // Test assemble CV endpoint
    if (componentIds.length > 0) {
      const assembleResponse = await fetch(`${NEXTJS_API_URL}/api/orion/cv/assemble`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selected_component_ids: componentIds.slice(0, 5),
          template_name: 'Standard',
          header_info: '**TOMIDE ADEOYE**\ntomideadeoye@gmail.com',
          tailored_content_map: {}
        })
      });
      const assembleData = await assembleResponse.json();
      logResult(
        'Assemble CV', 
        assembleResponse.ok && assembleData.success, 
        'CV assembled successfully',
        { cv_length: assembleData.assembled_cv?.length || 0 }
      );
    }
    
  } catch (error) {
    console.error(chalk.red('Error testing Next.js API:'), error);
  }
}

// Run tests
async function runTests() {
  console.log(chalk.yellow('=== CV Tailoring System Tests ==='));
  
  await testPythonAPI();
  await testNextJSAPI();
  
  console.log(chalk.yellow('\n=== Tests Complete ==='));
}

runTests();