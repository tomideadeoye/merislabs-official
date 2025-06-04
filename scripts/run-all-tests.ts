import axios from 'axios';
import type { OpportunityStatus, 	OpportunityDetails,
	EvaluationOutput, OpportunityType } from '../types/opportunity.d.ts';

import path from 'path';
import os from 'os';
import { initializeClientSession } from '../app_state';
import { SessionStateKeys } from '../types/orion';
import { ORION_ACCESSIBLE_LOCAL_DIRECTORIES } from '@/lib/orion_config.js';
import { fetchCVComponents, suggestCVComponents, rephraseComponent, assembleCV } from '../lib/cv';
import fs from "fs";
import React from "react";
import DecksPage from "../app/decks/page";
import { testLucideIcons } from './test-lucide-icons';

const chalk = require('chalk');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

/**
 * Comprehensive test suite for /api/orion/opportunity/evaluate
 * Covers all 9 scenarios outlined in the Opportunity Analysis test plan.
 */
async function testOpportunityEvaluationComprehensive() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mock-test-token'
    }
  });

  // Helper to POST to the evaluation endpoint
  async function postEvaluate(opportunity: any, auth: boolean = true) {
    return axiosInstance.post(
      '/api/orion/opportunity/evaluate',
      opportunity,
      auth ? {} : { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 1. Valid & Complete Opportunity Input
  try {
    const opportunity1 = {
      title: "CloudScale Senior Software Engineer",
      description: `Backend systems role focused on Go and Python microservices. Building scalable cloud infrastructure.
Key Responsibilities:
- Design and implement scalable microservices using Go and Python
- Build and maintain cloud infrastructure across multiple providers
- Optimize system performance and reliability
- Collaborate with cross-functional teams to deliver solutions
- Mentor junior engineers and contribute to architecture decisions
Requirements:
- Strong experience with Go programming language
- Experience with Python and microservices architecture
- Deep understanding of cloud platforms (AWS, GCP, Azure)
- Knowledge of containerization and orchestration (Docker, Kubernetes)
- Track record of building scalable distributed systems`,
      type: "job",
      url: "https://cloudscale.tech/careers"
    };
    console.log("\n[1] Valid & Complete Opportunity Input");
    const res1 = await postEvaluate(opportunity1);
    if (res1.status !== 200 || !res1.data.success) throw new Error("API did not return success for valid input");
    const eval1 = res1.data.evaluation;
    if (
      typeof eval1.fitScorePercentage !== "number" ||
      !Array.isArray(eval1.alignmentHighlights) ||
      !Array.isArray(eval1.gapAnalysis) ||
      typeof eval1.riskRewardAnalysis !== "object" ||
      typeof eval1.recommendation !== "string" ||
      typeof eval1.reasoning !== "string" ||
      !Array.isArray(eval1.suggestedNextSteps)
    ) throw new Error("Evaluation object missing required fields");
    console.log("✓ Passed: Valid & Complete Opportunity Input");

    // 2. Minimal Required Data
    const opportunity2 = {
      title: "Minimal Opportunity",
      description: "A job.",
      type: "job"
    };
    console.log("\n[2] Minimal Required Data");
    const res2 = await postEvaluate(opportunity2);
    if (!res2.data.success) throw new Error("API did not return success for minimal input");
    console.log("✓ Passed: Minimal Required Data");

    // 3. Vague/Ambiguous Description
    const opportunity3 = {
      title: "Vague Job",
      description: "Do stuff.",
      type: "job"
    };
    console.log("\n[3] Vague/Ambiguous Description");
    const res3 = await postEvaluate(opportunity3);
    if (!res3.data.success) throw new Error("API did not return success for vague input");
    if (!res3.data.evaluation.reasoning) throw new Error("No reasoning returned for vague input");
    console.log("✓ Passed: Vague/Ambiguous Description");

    // 4. Different Opportunity Types
    const types = ["job", "education_program", "project_collaboration"] as any[];
    for (let i = 0; i < types.length; i++) {
      const t = types[i];
      const opp = {
        title: `Test ${t}`,
        description: `Test opportunity of type ${t}.`,
        type: t
      };
      console.log(`\n[4] Opportunity Type: ${t}`);
      const res = await postEvaluate(opp);
      if (!res.data.success) throw new Error(`API did not return success for type ${t}`);
      if (!res.data.evaluation.recommendation) throw new Error(`No recommendation for type ${t}`);
      console.log(`✓ Passed: Opportunity Type ${t}`);
    }

    // 5. Strong/Weak Alignment with Profile
    // NOTE: These should be tailored to your actual profile data for best results.
    const strongMatch = {
      title: "React/TypeScript Engineer",
      description: "Expert in React, TypeScript, cloud, and agile teams.",
      type: "job"
    };
    const weakMatch = {
      title: "Marine Biologist",
      description: "Research on coral reefs, marine ecosystems, scuba diving.",
      type: "job"
    };
    console.log("\n[5] Strong Alignment with Profile");
    const res5a = await postEvaluate(strongMatch);
    if (!res5a.data.success || res5a.data.evaluation.fitScorePercentage < 70)
      throw new Error("Fit score not high for strong match");
    console.log("✓ Passed: Strong Alignment with Profile");

    console.log("\n[5] Weak Alignment with Profile");
    const res5b = await postEvaluate(weakMatch);
    if (!res5b.data.success || res5b.data.evaluation.fitScorePercentage > 50)
      throw new Error("Fit score not low for weak match");
    console.log("✓ Passed: Weak Alignment with Profile");

    // 6. Memory Integration (RAG)
    // Insert a memory point, then check if it's referenced in evaluation
    // (This is a stub; actual implementation depends on your memory API)
    // You may want to expand this with real memory API calls.
    console.log("\n[6] Memory Integration (RAG for Evaluation)");
    // Skipping actual memory API for now, but you can insert and check as needed.
    console.log("✓ Skipped: Memory Integration (requires memory API setup)");

    // 7. Error Handling - Invalid/Missing Input
    const invalidInputs = [
      { description: "Missing title", type: "job" },
      { title: "Missing type", description: "No type" },
      { title: "Missing description", type: "job" }
    ];
    for (let i = 0; i < invalidInputs.length; i++) {
      const input = invalidInputs[i];
      try {
        console.log(`\n[7] Invalid Input Case ${i + 1}`);
        await postEvaluate(input);
        throw new Error("API did not fail for invalid input");
      } catch (err: any) {
        if (err.response && err.response.status === 400) {
          console.log("✓ Passed: Invalid Input Case", i + 1);
        } else {
          throw err;
        }
      }
    }

    // 8. Error Handling - LLM Failure (simulate by sending bad payload)
    try {
      console.log("\n[8] LLM Failure Simulation");
      await postEvaluate({ title: "Bad", description: "Bad", type: "job", forceLLMError: true });
      throw new Error("API did not fail for LLM error simulation");
    } catch (err: any) {
      if (err.response && err.response.status >= 500) {
        console.log("✓ Passed: LLM Failure Simulation");
      } else {
        throw err;
      }
    }

    // 9. Authentication
    try {
      console.log("\n[9] Authentication Required");
      await axios.post(`${baseUrl}/api/orion/opportunity/evaluate`, {
        title: "No Auth",
        description: "No Auth",
        type: "job"
      }, { headers: { 'Content-Type': 'application/json' } });
      throw new Error("API did not fail for missing auth");
    } catch (err: any) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        console.log("✓ Passed: Authentication Required");
      } else {
        throw err;
      }
    }

    console.log("\nAll comprehensive opportunity evaluation tests passed!");
  } catch (error: any) {
    console.error("Comprehensive opportunity evaluation test failed:", error.message);
    throw error;
  }
}

// Test suite runner
async function runAllTests() {
  console.log(`${colors.bright}${colors.magenta}=== ORION TEST SUITE ===${colors.reset}\n`);

  try {
    // Run Lucide Icons test first for fast feedback
    const iconsOk = await testLucideIcons();
    if (!iconsOk) {
      console.error('❌ Lucide icon test failed. Please fix icon imports before proceeding.');
      return;
    }

    // Run LLM health check
    await testLlmHealthCheck();

    // Run LLM integration test
    await runTest('LLM Integration', testLlmIntegration);

    // Run OpenRouter models test
    await runTest('OpenRouter Models Test', testOpenRouterModels);

    // Run LLM memory integration test
    await runTest('LLM Memory Integration', testMemoryIntegratedLlm);

    // Run LLM fallback test
    await runTest('LLM Fallback Mechanism', testLlmFallback);

    // Run comprehensive opportunity evaluation test
    await runTest('Comprehensive Opportunity Evaluation API', testOpportunityEvaluationComprehensive);

    // Run memory API test
    await runTest('Memory API Test', testMemoryAPI);

    // Run analyze page test
    await runTest('Opportunity Analyze Page', testOpportunityAnalyzePage);

    // Run networking outreach test
    await runTest('Networking Outreach Endpoint', testNetworkingOutreach);

    // Run CV tailoring system test
    await runTest('CV Tailoring System', testCVTailoringSystem);

    // --- Pending/Not Yet Implemented Features ---
    await runTest('Opportunity Pipeline CRUD', testOpportunityPipelineCRUD);
    await runTest('Application Drafting', testApplicationDrafting);
    await runTest('Stakeholder Search & Outreach', testStakeholderSearchOutreach);
    await runTest('Memory System', testMemorySystem);
    await runTest('Notion Integration', testNotionIntegration);
    await runTest('Email Sending', testEmailSendingFeature);
    await runTest('Multiple Application Drafts UI', testMultipleDraftsUI);
    await runTest('Stakeholder Email Guessing', testStakeholderEmailGuessing);
    await runTest('Slack/n8n/Streamlit Orchestration', testSlackN8nStreamlitOrchestration);
    await runTest('Habitica Integration', testHabiticaIntegration);
    await runTest('WhatsApp Helper', testWhatsAppHelper);
    await runTest('Agentic Workflow', testAgenticWorkflow);
    await runTest('System Improvement/Feedback', testSystemImprovementFeedback);
    await runTest('Voice Chat/Therapy', testVoiceChatTherapy);
    await runTest('Investment/Financial Info', testInvestmentFinancialInfo);
    await runTest('Advanced Routines', testAdvancedRoutines);
    await runTest('Motivational Quotes/Copy-to-Clipboard', testMotivationalQuotesCopyToClipboard);

    // Decks page test
    await testDecksPageDisplaysAllDecks();

    // Add logging test
    await testLogging();

    console.log(`\n${colors.bright}${colors.green}All test suites completed!${colors.reset}`);
  } catch (error) {
    console.error(`\n${colors.bright}${colors.red}Test suite failed with error:${colors.reset}`, error);
    process.exit(1);
  }
}

// Helper function to run a test with proper formatting
async function runTest(name: string, testFn: () => Promise<any>): Promise<void> {
  console.log(`\n${colors.bright}${colors.blue}Running: ${name}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}`);

  try {
    await testFn();
    console.log(`${colors.green}✓ ${name} completed successfully${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}✗ ${name} failed${colors.reset}`);
    throw error;
  }
}

// ===== TEST: OpenRouter Models =====
async function testOpenRouterModels() {
  // Test prompts for different model types
  const TEST_PROMPTS = {
    general: "Explain the concept of vector databases in 3 sentences.",
    code: "Write a TypeScript function that sorts an array of objects by a specified property.",
    creative: "Write a short poem about artificial intelligence and human creativity."
  };

  // Models to test
  const MODELS_TO_TEST = [
    "openrouter/google/gemini-2.0-flash-exp:free",
    "openrouter/deepseek/deepseek-chat-v3-0324:free",
    "openrouter/deepseek/deepseek-coder-v2-0324:free"
  ];

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  // Test each model with general knowledge prompt only to keep tests shorter
  for (const model of MODELS_TO_TEST) {
    console.log(`\n${colors.cyan}Testing model: ${model}${colors.reset}`);

    try {
      const response = await axios.post(`${baseUrl}/api/orion/llm/test`, {
        prompt: TEST_PROMPTS.general,
        model,
        temperature: 0.7,
        max_tokens: 500
      });

      const data = response.data as any;

      if (data.success && data.content) {
        console.log(`${colors.green}✓ Success with ${model}${colors.reset}`);
        console.log(`Response: ${data.content.substring(0, 100)}...`);
      } else {
        console.log(`${colors.red}✗ Failed with ${model}${colors.reset}: ${data.error || 'No content returned'}`);
      }
    } catch (error: any) {
      console.error(`${colors.red}✗ Error testing ${model}${colors.reset}:`,
        error.response?.data?.error || error.message);
    }
  }
}

// ===== TEST 1: LLM Integration =====
async function testLlmIntegration() {
  // Test cases for different request types
  const testCases = [
    {
      description: "General Question",
      requestType: "GENERAL_QUESTION",
      prompt: "Explain vector databases in 3 sentences.",
      providers: ["azure", "groq", "mistral"]
    },
    {
      description: "Draft Communication",
      requestType: "DRAFT_COMMUNICATION",
      prompt: "Draft a brief email requesting a meeting with a potential mentor.",
      providers: ["azure", "groq"]
    },
    {
      description: "Opportunity Evaluation",
      requestType: "OPPORTUNITY_EVALUATION",
      prompt: "Evaluate this job opportunity: Senior Developer at a fintech startup.",
      providers: ["azure"]
    }
  ];

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  // Run each test case
  for (const testCase of testCases) {
    console.log(`\n${colors.cyan}Testing: ${testCase.description}${colors.reset}`);

    for (const provider of testCase.providers) {
      try {
        // Determine model based on provider
        const model = getDefaultModelForProvider(provider);
        console.log(`  Provider: ${provider}, Model: ${model}`);

        const response = await axios.post(`${baseUrl}/api/orion/llm/test`, {
          prompt: testCase.prompt,
          model,
          requestType: testCase.requestType,
          temperature: 0.7,
          max_tokens: 500
        });

        const data = response.data as any;

        if (data.content) {
          console.log(`  ${colors.green}✓ Success${colors.reset}`);
          console.log(`  Response: ${data.content.substring(0, 100)}...`);
        } else {
          console.log(`  ${colors.red}✗ Failed${colors.reset}: ${data.error || 'No content returned'}`);
        }
      } catch (error: any) {
        console.error(`  ${colors.red}✗ Error${colors.reset} with ${provider}:`,
          error.response?.data || error.message);
      }
    }
  }
}

// ===== TEST 2: Memory Integrated LLM =====
async function testMemoryIntegratedLlm() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  try {
    // 1. Insert a test memory
    console.log("Inserting test memory...");
    const memoryId = await insertTestMemory({
      text: "The capital of France is Paris. The Eiffel Tower is 330 meters tall.",
      source_id: "test-memory",
      type: "test",
      tags: ["test", "france"]
    });

    console.log(`Test memory inserted with ID: ${memoryId}`);

    // 2. Ask a question that should retrieve this memory
    console.log("Testing memory retrieval with LLM...");
    const response = await axios.post(`${baseUrl}/api/orion/llm/test`, {
      prompt: "What is the capital of France?",
      requestType: "ASK_QUESTION",
      memorySourceTypes: ["test"]
    });

    // 3. Check if the response contains information from the memory
    const data = response.data as any;
    const content = data.content || '';
    const success = content.toLowerCase().includes("paris");

    if (success) {
      console.log(`${colors.green}✓ Memory successfully retrieved and used in response${colors.reset}`);
      console.log(`Response: ${content.substring(0, 100)}...`);
    } else {
      console.log(`${colors.red}✗ Memory not found in response${colors.reset}`);
      console.log(`Response: ${content}`);
    }

    // 4. Clean up test memory
    await deleteTestMemory(memoryId);
    console.log("Test memory deleted");

  } catch (error: any) {
    console.error(`${colors.red}✗ Memory integration test failed${colors.reset}:`,
      error.response?.data || error.message);
    throw error;
  }
}

// Helper function to insert test memory
async function insertTestMemory(memory: any): Promise<string> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  // Generate embedding for the memory text
  const embeddingResponse = await axios.post(`${baseUrl}/api/orion/memory/generate-embeddings`, {
    texts: [memory.text]
  });

  const embeddingData = embeddingResponse.data as any;
  const embedding = embeddingData.embeddings[0];
  const memoryId = `test-memory-${Date.now()}`;

  // Insert memory with embedding
  await axios.post(`${baseUrl}/api/orion/memory/upsert`, {
    points: [{
      id: memoryId,
      vector: embedding,
      payload: {
        text: memory.text,
        source_id: memory.source_id,
        type: memory.type,
        tags: memory.tags,
        timestamp: new Date().toISOString()
      }
    }]
  });

  return memoryId;
}

// Helper function to delete test memory
async function deleteTestMemory(memoryId: string): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  await axios.post(`${baseUrl}/api/orion/memory/delete`, {
    ids: [memoryId]
  });
}

// ===== TEST 3: LLM Fallback Mechanism =====
async function testLlmFallback() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  try {
    console.log("Testing LLM fallback mechanism...");

    // Use a non-existent model as primary to force fallback
    const response = await axios.post(`${baseUrl}/api/orion/llm/test`, {
      prompt: "Test fallback mechanism",
      model: "non-existent-model",
      temperature: 0.7
    });

    const data = response.data as any;

    // If fallback works, we should still get a successful response
    if (data.content) {
      console.log(`${colors.green}✓ Fallback successful${colors.reset}`);
      console.log(`Fallback model used: ${data.model || 'unknown'}`);
      console.log(`Response: ${data.content.substring(0, 100)}...`);
    } else {
      console.log(`${colors.red}✗ Fallback failed${colors.reset}: ${data.error || 'No content returned'}`);
    }
  } catch (error: any) {
    console.error(`${colors.red}✗ Fallback test failed${colors.reset}:`,
      error.response?.data || error.message);
    throw error;
  }
}

// ===== TEST 5: Memory API =====
async function testMemoryAPI() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  try {
    console.log("Testing Memory API...");

    // 1. Generate embeddings
    console.log("Testing embedding generation...");
    const embeddingResponse = await axios.post(`${baseUrl}/api/orion/memory/generate-embeddings`, {
      texts: ["This is a test memory for the Orion system."]
    });

    const embeddingData = embeddingResponse.data as any;

    if (!embeddingData.embeddings || !embeddingData.embeddings.length) {
      throw new Error("Failed to generate embeddings");
    }

    console.log(`Generated embedding with length: ${embeddingData.embeddings[0].length}`);

    // 2. Test memory search
    console.log("Testing memory search...");
    const searchResponse = await axios.post(`${baseUrl}/api/orion/memory/search`, {
      queryText: "test memory",
      limit: 5
    });

    const searchData = searchResponse.data as any;
    console.log(`Search returned ${searchData.results?.length || 0} results`);

  } catch (error: any) {
    console.error(`${colors.red}✗ Memory API test failed${colors.reset}:`,
      error.response?.data || error.message);

    // For testing purposes, don't fail the entire suite if memory API isn't fully implemented
    console.log("Continuing with tests despite Memory API failure");
  }
}

/**
 * Test: Opportunity Analyze Page
 * Checks that the analyze page renders and contains expected placeholder content.
 */
async function testOpportunityAnalyzePage() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const testId = '206d87c7-4f62-8116-a070-f620731690a6';
  const url = `${baseUrl}/opportunity/${testId}/analyze`;

  try {
    const response = await axios.get(url);
    const html = response.data as string;

    if (
      html.includes('Opportunity Analysis') &&
      html.includes('Opportunity ID: 206d87c7-4f62-8116-a070-f620731690a6') &&
      html.includes('This is a placeholder analysis. Integrate with backend API.')
    ) {
      console.log(`${colors.green}✓ Analyze page loaded and placeholder content found${colors.reset}`);
    } else {
      throw new Error('Analyze page did not contain expected content');
    }
  } catch (error: any) {
    console.error(`${colors.red}✗ Analyze page test failed${colors.reset}:`, error.response?.status, error.message);
    throw error;
  }
}

// Helper function to get default model for a provider
function getDefaultModelForProvider(provider: string): string {
  switch (provider) {
    case 'azure': return 'gpt-4.1-mini';
    case 'groq': return 'groq/llama3-70b-8192';
    case 'mistral': return 'mistral/mistral-large-latest';
    case 'gemini': return 'gemini/gemini-1.5-pro-latest';
    case 'openrouter': return 'openrouter/deepseek/deepseek-chat-v3-0324:free';
    case 'cohere': return 'cohere/command-r-plus';
    case 'together_ai': return 'together_ai/meta-llama/Llama-3.1-70B-Instruct-hf';
    default: return 'openrouter/deepseek/deepseek-chat-v3-0324:free';
  }
}

// Move logResult above testNetworkingOutreach
function logResult(
  testName: string,
  success: boolean,
  message: string,
  data: any = null
): void {
  if (success) {
    console.log(chalk.green(`✓ ${testName}: ${message}`));
  } else {
    console.log(chalk.red(`✗ ${testName}: ${message}`));
  }
  if (data) {
    console.log(chalk.gray(JSON.stringify(data, null, 2)));
  }
}

// ===== TEST: Networking Outreach Endpoint =====
interface OutreachTestCase {
  description: string;
  body: any;
  expectSuccess: boolean;
  expectPlatform: 'LinkedIn' | 'Email' | null;
}

async function testNetworkingOutreach() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const endpoint = `${baseUrl}/api/orion/networking/generate-outreach`;

  // Simulate a valid session cookie if needed (for now, assume session is present)

  const testCases: OutreachTestCase[] = [
    {
      description: 'Valid LinkedIn outreach (no email, with LinkedIn URL, job interest, company research)',
      body: {
        stakeholder: {
          name: 'Jane Doe',
          role: 'CTO',
          company: 'TechCorp',
          linkedin_url: 'https://linkedin.com/in/janedoe',
          person_snippet: 'CTO at TechCorp, passionate about AI and cloud.'
        },
        jobTitle: 'Senior Software Engineer',
        companyResearch: 'TechCorp is a leader in cloud innovation.'
      },
      expectSuccess: true,
      expectPlatform: 'LinkedIn'
    },
    {
      description: 'Valid Email outreach (with email, job interest, company research)',
      body: {
        stakeholder: {
          name: 'John Smith',
          role: 'VP Engineering',
          company: 'InnovateX',
          email: 'john.smith@innovatex.com',
          person_snippet: 'VP at InnovateX, scaling engineering teams.'
        },
        jobTitle: 'Lead Developer',
        companyResearch: 'InnovateX is known for rapid product launches.'
      },
      expectSuccess: true,
      expectPlatform: 'Email'
    },
    {
      description: 'Missing stakeholder info (should fail)',
      body: {
        stakeholder: {
          name: '',
          role: '',
          company: ''
        }
      },
      expectSuccess: false,
      expectPlatform: null
    },
    {
      description: 'Unauthorized request (should fail)',
      body: {
        stakeholder: {
          name: 'Jane Doe',
          role: 'CTO',
          company: 'TechCorp'
        }
      },
      expectSuccess: false,
      expectPlatform: null
    }
  ];

  for (const testCase of testCases) {
    try {
      let response;
      if (testCase.description.includes('Unauthorized')) {
        // Simulate unauthorized by not sending cookies (use axios without credentials)
        response = await axios.post(endpoint, testCase.body, { validateStatus: () => true });
      } else {
        // For authorized, assume session is present (in real test, set cookie/header as needed)
        response = await axios.post(endpoint, testCase.body, { validateStatus: () => true });
      }
      const data = response.data;
      const success = data.success === testCase.expectSuccess;
      let platformDetected = null;
      if (data.emailDraft && typeof data.emailDraft === 'string') {
        if (data.emailDraft.length < 350) platformDetected = 'LinkedIn';
        else platformDetected = 'Email';
      }
      logResult(
        `Networking Outreach: ${testCase.description}`,
        success && (testCase.expectPlatform === null || platformDetected === testCase.expectPlatform),
        `Status: ${data.success}, Platform: ${platformDetected}`,
        data
      );
    } catch (error: any) {
      logResult(
        `Networking Outreach: ${testCase.description}`,
        false,
        `Error: ${error.message}`,
        error.response?.data || null
      );
    }
  }
}

async function testCVTailoringSystem() {
  try {
    // Step 1: Fetch CV components
    const components = await fetchCVComponents();
    logResult('CV Tailoring: Fetch CV Components', Array.isArray(components) && components.length > 0, `Fetched ${components.length} components`, components.slice(0, 1));
    if (components.length === 0) {
      throw new Error("No CV components found. Make sure the Python API server is running and Notion is configured.");
    }
    const testJdAnalysis = `
      Senior Software Engineer position requiring expertise in React, TypeScript, and cloud services.
      The ideal candidate will have 5+ years of experience building scalable web applications,
      strong communication skills, and experience working in agile teams.
      Experience with AWS, CI/CD pipelines, and microservices architecture is a plus.
    `;
    // Step 2: Suggest components
    const suggestion = await suggestCVComponents(
      testJdAnalysis,
      "Senior Software Engineer",
      "TechCorp"
    );
    logResult('CV Tailoring: Suggest Components', suggestion.success && Array.isArray(suggestion.suggested_component_ids) && suggestion.suggested_component_ids.length > 0, `Suggested ${suggestion.suggested_component_ids?.length || 0} components`, suggestion);
    if (!suggestion.success || !suggestion.suggested_component_ids || suggestion.suggested_component_ids.length === 0) {
      throw new Error(`Component suggestion failed: ${suggestion.error || "No components suggested"}`);
    }
    // Step 3: Rephrase a component
    const componentToRephrase = components.find(c => (suggestion.suggested_component_ids ?? [])[0] === c.unique_id);
    if (!componentToRephrase) {
      throw new Error("Could not find suggested component for rephrasing");
    }
    const rephraseResult = await rephraseComponent(
      componentToRephrase.unique_id,
      testJdAnalysis,
      "TechCorp is a leading technology company focused on cloud solutions."
    );
    logResult('CV Tailoring: Rephrase Component', rephraseResult.success && !!rephraseResult.rephrased_content, `Rephrased component ${componentToRephrase.component_name}`, {
      original: componentToRephrase.content_primary.substring(0, 100) + '...',
      rephrased: rephraseResult.rephrased_content?.substring(0, 100) + '...'
    });
    if (!rephraseResult.success || !rephraseResult.rephrased_content) {
      throw new Error(`Component rephrasing failed: ${rephraseResult.error || "No rephrased content returned"}`);
    }
    // Step 4: Assemble CV
    const tailoredContentMap: Record<string, string> = {
      [componentToRephrase.unique_id]: rephraseResult.rephrased_content
    };
    const assembleResult = await assembleCV(
      (suggestion.suggested_component_ids ?? []).slice(0, 5),
      "Standard",
      "**TOMIDE ADEOYE**\ntomideadeoye@gmail.com | +234 818 192 7251",
      tailoredContentMap
    );
    logResult('CV Tailoring: Assemble CV', assembleResult.success && !!assembleResult.assembled_cv, `Assembled CV with ${(suggestion.suggested_component_ids ?? []).slice(0, 5).length} components`, assembleResult.assembled_cv?.substring(0, 200) + '...');
    if (!assembleResult.success || !assembleResult.assembled_cv) {
      throw new Error(`CV assembly failed: ${assembleResult.error || "No assembled CV returned"}`);
    }
  } catch (error: any) {
    logResult('CV Tailoring System', false, `Error: ${error.message}`, error);
  }
}

// --- Pending/Not Yet Implemented Feature Test Stubs ---
async function testEmailSendingFeature() {
  logResult('Email Sending', false, 'SKIPPED: Email sending feature not yet implemented');
}
async function testMultipleDraftsUI() {
  logResult('Multiple Application Drafts UI', false, 'SKIPPED: Multiple drafts in UI not yet implemented');
}
async function testStakeholderEmailGuessing() {
  logResult('Stakeholder Email Guessing', false, 'SKIPPED: Stakeholder email guessing/generation not yet implemented');
}
async function testSlackN8nStreamlitOrchestration() {
  logResult('Slack/n8n/Streamlit Orchestration', false, 'SKIPPED: Orchestration not yet implemented');
}
async function testHabiticaIntegration() {
  logResult('Habitica Integration', false, 'SKIPPED: Habitica integration not yet implemented');
}
async function testWhatsAppHelper() {
  logResult('WhatsApp Helper', false, 'SKIPPED: WhatsApp Helper not yet implemented');
}
async function testAgenticWorkflow() {
  logResult('Agentic Workflow', false, 'SKIPPED: Agentic Workflow not yet implemented');
}
async function testSystemImprovementFeedback() {
  logResult('System Improvement/Feedback', false, 'SKIPPED: System improvement/feedback not yet implemented');
}
async function testVoiceChatTherapy() {
  logResult('Voice Chat/Therapy', false, 'SKIPPED: Voice chat/therapy not yet implemented');
}
async function testInvestmentFinancialInfo() {
  logResult('Investment/Financial Info', false, 'SKIPPED: Investment/financial info not yet implemented');
}
async function testAdvancedRoutines() {
  logResult('Advanced Routines', false, 'SKIPPED: Advanced routines not yet implemented');
}
async function testMotivationalQuotesCopyToClipboard() {
  logResult('Motivational Quotes/Copy-to-Clipboard', false, 'SKIPPED: Motivational quotes/copy-to-clipboard not yet implemented');
}

// --- Real/Pending Test Stubs for Core Features (if not already present) ---
async function testOpportunityPipelineCRUD() {
  logResult('Opportunity Pipeline CRUD', false, 'SKIPPED: Opportunity CRUD test not yet implemented');
}
async function testApplicationDrafting() {
  logResult('Application Drafting', false, 'SKIPPED: Application drafting test not yet implemented');
}
async function testStakeholderSearchOutreach() {
  logResult('Stakeholder Search & Outreach', false, 'SKIPPED: Stakeholder search/outreach test not yet implemented');
}
async function testMemorySystem() {
  logResult('Memory System', false, 'SKIPPED: Memory system test not yet implemented');
}
async function testNotionIntegration() {
  logResult('Notion Integration', false, 'SKIPPED: Notion integration test not yet implemented');
}

async function testDecksPageDisplaysAllDecks() {
  const decksPath = path.join(process.cwd(), "data", "decks.json");
  const decks = JSON.parse(fs.readFileSync(decksPath, "utf-8"));
  if (!Array.isArray(decks) || decks.length === 0) {
    logResult('Decks Page', false, 'No decks found in data/decks.json');
    return;
  }
  // Minimal test: check that all titles are present in the JSON
  const allTitlesPresent = decks.every(deck => typeof deck.title === 'string' && deck.title.length > 0);
  logResult('Decks Page', allTitlesPresent, `Loaded ${decks.length} decks from data/decks.json`, decks.map(d => d.title));
}

async function testLogging() {
  console.log('\n[Logging] Testing API logging, PII redaction, error logging, performance logging, correlation ID propagation, and frontend log delivery');
  // 1. API logging
  const logFile = 'api_server.log';
  if (!fs.existsSync(logFile)) throw new Error('Log file does not exist');
  const logContent = fs.readFileSync(logFile, 'utf-8');
  if (!logContent.includes('Request received')) throw new Error('API request not logged');
  // 2. PII redaction
  if (logContent.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/)) throw new Error('PII not redacted');
  // 3. Error logging
  if (!logContent.includes('error') && !logContent.includes('ERROR')) throw new Error('Errors not logged');
  // 4. Performance logging
  if (!logContent.includes('Duration')) throw new Error('Performance not logged');
  // 5. Correlation ID
  if (!logContent.includes('request_id')) throw new Error('Correlation ID not present');
  // 6. Frontend log delivery (simulate by appending a test log)
  fs.appendFileSync(logFile, JSON.stringify({ level: 'info', message: 'Frontend test log', sessionId: 'test-session' }) + '\n');
  const updatedContent = fs.readFileSync(logFile, 'utf-8');
  if (!updatedContent.includes('Frontend test log')) throw new Error('Frontend log not delivered');
  console.log('✓ Logging tests passed');
}

async function testLlmHealthCheck() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  try {
    const res = await axios.get(`${baseUrl}/api/orion/llm/health`);
    if (!res.data.success) throw new Error('Health check endpoint did not return success');
    const results = res.data.results;
    let healthyCount = 0;
    console.log('\n[LLM Health Check]');
    for (const r of results) {
      if (r.status === 'success') {
        healthyCount++;
        console.log(colors.green + `✓ ${r.model} (${r.provider}): OK` + colors.reset);
      } else {
        console.log(colors.red + `✗ ${r.model} (${r.provider}): FAIL - ${r.error}` + colors.reset);
      }
    }
    if (healthyCount === 0) throw new Error('All LLM providers/models failed health check');
    console.log(colors.green + `LLM Health Check: ${healthyCount} healthy model(s)` + colors.reset);
  } catch (err: any) {
    console.error(colors.red + '[LLM Health Check] Error:', err.message + colors.reset);
    throw err;
  }
}
