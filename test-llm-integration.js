/**
 * Test script for LLM integration with CV Tailoring System
 * 
 * This script tests the LLM integration for CV component selection,
 * rephrasing, and summary tailoring.
 */

const fetch = require('node-fetch');
const chalk = require('chalk');

// Configuration
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5002';
const LLM_API_URL = process.env.LLM_API_URL || 'http://localhost:3000/api/orion/llm';

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
    console.log(chalk.gray('  Data:'), typeof data === 'string' ? data : JSON.stringify(data, null, 2));
  }
}

// Test LLM for CV component selection
async function testLLMComponentSelection() {
  console.log(chalk.blue('\n=== Testing LLM for CV Component Selection ===\n'));
  
  try {
    // Get CV components
    const componentsResponse = await fetch(`${PYTHON_API_URL}/api/notion/cv-components`);
    const components = await componentsResponse.json();
    
    if (!Array.isArray(components) || components.length === 0) {
      logResult('Get Components', false, 'Failed to fetch CV components');
      return;
    }
    
    // Format components for LLM prompt
    const componentOptions = components.slice(0, 10).map(c => 
      `- ID: ${c.unique_id}, Name: ${c.component_name}, Type: ${c.component_type}`
    ).join('\n');
    
    // Create LLM prompt
    const prompt = `
      Given this JD analysis:
      ${testData.jdAnalysis}
      
      And these available CV components:
      ${componentOptions}
      
      Suggest a comma-separated list of up to 5 UniqueIDs of the MOST RELEVANT components for this job.
      Prioritize impact and direct skill match. Output only the comma-separated list of UniqueIDs.
    `;
    
    // Call LLM API
    const llmResponse = await fetch(LLM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
        requestType: 'CV_COMPONENT_SELECTION',
        temperature: 0.2,
        maxTokens: 100
      })
    });
    
    const llmData = await llmResponse.json();
    
    // Check if response contains comma-separated IDs
    const success = llmResponse.ok && 
                   llmData.content && 
                   llmData.content.includes(',');
    
    logResult(
      'LLM Component Selection', 
      success,
      success ? 'Successfully selected components' : 'Failed to select components',
      llmData.content
    );
    
  } catch (error) {
    console.error(chalk.red('Error testing LLM component selection:'), error);
  }
}

// Test LLM for CV component rephrasing
async function testLLMComponentRephrasing() {
  console.log(chalk.blue('\n=== Testing LLM for CV Component Rephrasing ===\n'));
  
  try {
    // Get CV components
    const componentsResponse = await fetch(`${PYTHON_API_URL}/api/notion/cv-components`);
    const components = await componentsResponse.json();
    
    if (!Array.isArray(components) || components.length === 0) {
      logResult('Get Components', false, 'Failed to fetch CV components');
      return;
    }
    
    // Select a component that's not a summary
    const component = components.find(c => c.component_type !== 'Profile Summary');
    
    if (!component) {
      logResult('Find Component', false, 'Failed to find suitable component');
      return;
    }
    
    // Create LLM prompt
    const prompt = `
      Job Description Analysis:
      ${testData.jdAnalysis}
      
      Company Web Research Context:
      ${testData.webResearchContext}
      
      Original CV Content from '${component.component_name}' (${component.component_type}):
      ${component.content_primary}
      
      Rewrite the original CV content to be highly impactful and directly relevant for the job description and the company context provided.
      Emphasize skills & achievements that align with the JD and company information.
      Focus on quantifiable results where possible.
      Output only the rewritten CV content for this component.
    `;
    
    // Call LLM API
    const llmResponse = await fetch(LLM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
        requestType: 'CV_BULLET_REPHRASING',
        temperature: 0.3,
        maxTokens: 300
      })
    });
    
    const llmData = await llmResponse.json();
    
    // Check if response contains rephrased content
    const success = llmResponse.ok && 
                   llmData.content && 
                   llmData.content.length > 20;
    
    logResult(
      'LLM Component Rephrasing', 
      success,
      success ? 'Successfully rephrased component' : 'Failed to rephrase component',
      llmData.content
    );
    
  } catch (error) {
    console.error(chalk.red('Error testing LLM component rephrasing:'), error);
  }
}

// Test LLM for CV summary tailoring
async function testLLMSummaryTailoring() {
  console.log(chalk.blue('\n=== Testing LLM for CV Summary Tailoring ===\n'));
  
  try {
    // Get CV components
    const componentsResponse = await fetch(`${PYTHON_API_URL}/api/notion/cv-components`);
    const components = await componentsResponse.json();
    
    if (!Array.isArray(components) || components.length === 0) {
      logResult('Get Components', false, 'Failed to fetch CV components');
      return;
    }
    
    // Select a summary component
    const summaryComponent = components.find(c => c.component_type === 'Profile Summary');
    
    if (!summaryComponent) {
      logResult('Find Summary Component', false, 'Failed to find summary component');
      return;
    }
    
    // Create LLM prompt
    const prompt = `
      Job Description Analysis:
      ${testData.jdAnalysis}
      
      Company Web Research Context:
      ${testData.webResearchContext}
      
      My current base profile summary:
      ${summaryComponent.content_primary}
      
      Rewrite this into a compelling, concise (2-4 sentences) professional profile sharply targeted for the job described and the company context.
      Highlight my most relevant strengths that align with the JD and company.
      Output only the rewritten summary.
    `;
    
    // Call LLM API
    const llmResponse = await fetch(LLM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
        requestType: 'CV_SUMMARY_TAILORING',
        temperature: 0.3,
        maxTokens: 200
      })
    });
    
    const llmData = await llmResponse.json();
    
    // Check if response contains tailored summary
    const success = llmResponse.ok && 
                   llmData.content && 
                   llmData.content.length > 20;
    
    logResult(
      'LLM Summary Tailoring', 
      success,
      success ? 'Successfully tailored summary' : 'Failed to tailor summary',
      llmData.content
    );
    
  } catch (error) {
    console.error(chalk.red('Error testing LLM summary tailoring:'), error);
  }
}

// Run tests
async function runTests() {
  console.log(chalk.yellow('=== LLM Integration Tests for CV Tailoring ==='));
  
  await testLLMComponentSelection();
  await testLLMComponentRephrasing();
  await testLLMSummaryTailoring();
  
  console.log(chalk.yellow('\n=== Tests Complete ==='));
}

runTests();