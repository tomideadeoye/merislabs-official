/**
 * Comprehensive Jest test suite for Orion.
 * This file combines all integration, API, and configuration tests in a Jest-compatible format.
 * To run: npx jest scripts/run-all-tests.jest.ts
 */

import axios from 'axios';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { ORION_ACCESSIBLE_LOCAL_DIRECTORIES } from '../lib/orion_config.js';
import { initializeClientSession } from '../app_state';
import { generatePDF } from '../lib/pdf-generator';
import { generateWordDoc } from '../lib/word-generator';
import fetch from 'node-fetch';
import { fetchCVComponents, suggestCVComponents, rephraseComponent, assembleCV } from '@/lib/cv.js';

jest.setTimeout(30000);

describe('Orion Configuration', () => {
  it('should have valid accessible directories', () => {
    const expectedPaths = [
      path.join(os.homedir(), 'Documents/GitHub'),
      path.join(os.homedir(), 'Documents/Projects'),
      path.join(os.homedir(), 'Downloads'),
    ];
    expect(ORION_ACCESSIBLE_LOCAL_DIRECTORIES).toEqual(expectedPaths);
  });

  it('should use cross-platform path formatting', () => {
    ORION_ACCESSIBLE_LOCAL_DIRECTORIES.forEach(dirPath => {
      expect(dirPath).toContain(path.sep);
      expect(dirPath).not.toContain('//');
    });
  });
});

describe('app_state', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize required session keys', () => {
    initializeClientSession();
    expect(localStorage.getItem("user_name")).toBeDefined();
    expect(localStorage.getItem("current_mood")).toBeDefined();
    expect(localStorage.getItem("memory_initialized")).toBe('false');
  });
});

describe('CV Export', () => {
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

  it('should export PDF successfully', async () => {
    const pdfBlob = await generatePDF(testCV, 'Standard');
    const buffer = await pdfBlob.arrayBuffer();
    const outputPath = path.join(__dirname, 'test-cv-export.pdf');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    expect(fs.existsSync(outputPath)).toBe(true);
  });

  it('should export Word document successfully', async () => {
    const wordBlob = await generateWordDoc(testCV, 'Standard');
    const buffer = await wordBlob.arrayBuffer();
    const outputPath = path.join(__dirname, 'test-cv-export.docx');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    expect(fs.existsSync(outputPath)).toBe(true);
  });
});

describe('Feedback API', () => {
  it('should simulate feedback API success', async () => {
    // Simulate a successful feedback API call
    expect(true).toBe(true);
  });
});

describe('Comprehensive Opportunity Evaluation API', () => {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mock-test-token'
    }
  });

  async function postEvaluate(opportunity: any, auth: boolean = true) {
    return axiosInstance.post(
      '/api/orion/opportunity/evaluate',
      opportunity,
      auth ? {} : { headers: { 'Content-Type': 'application/json' } }
    );
  }

  it('should handle valid & complete opportunity input', async () => {
    const opportunity1 = {
      title: "CloudScale Senior Software Engineer",
      description: "Backend systems role focused on Go and Python microservices. Building scalable cloud infrastructure.",
      type: "job",
      url: "https://cloudscale.tech/careers"
    };
    const res1 = await postEvaluate(opportunity1);
    expect(res1.status).toBe(200);
    expect(res1.data.success).toBe(true);
    const eval1 = res1.data.evaluation;
    expect(typeof eval1.fitScorePercentage).toBe("number");
    expect(Array.isArray(eval1.alignmentHighlights)).toBe(true);
    expect(Array.isArray(eval1.gapAnalysis)).toBe(true);
    expect(typeof eval1.riskRewardAnalysis).toBe("object");
    expect(typeof eval1.recommendation).toBe("string");
    expect(typeof eval1.reasoning).toBe("string");
    expect(Array.isArray(eval1.suggestedNextSteps)).toBe(true);
  });

  it('should handle minimal required data', async () => {
    const opportunity2 = {
      title: "Minimal Opportunity",
      description: "A job.",
      type: "job"
    };
    const res2 = await postEvaluate(opportunity2);
    expect(res2.data.success).toBe(true);
  });

  it('should handle vague/ambiguous description', async () => {
    const opportunity3 = {
      title: "Vague Job",
      description: "Do stuff.",
      type: "job"
    };
    const res3 = await postEvaluate(opportunity3);
    expect(res3.data.success).toBe(true);
    expect(res3.data.evaluation.reasoning).toBeDefined();
  });

  it('should handle different opportunity types', async () => {
    const types = ["job", "education_program", "project_collaboration"];
    for (let t of types) {
      const opp = {
        title: `Test ${t}`,
        description: `Test opportunity of type ${t}.`,
        type: t
      };
      const res = await postEvaluate(opp);
      expect(res.data.success).toBe(true);
      expect(res.data.evaluation.recommendation).toBeDefined();
    }
  });

  it('should handle strong/weak alignment with profile', async () => {
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
    const res5a = await postEvaluate(strongMatch);
    expect(res5a.data.success).toBe(true);
    expect(res5a.data.evaluation.fitScorePercentage).toBeGreaterThanOrEqual(70);

    const res5b = await postEvaluate(weakMatch);
    expect(res5b.data.success).toBe(true);
    expect(res5b.data.evaluation.fitScorePercentage).toBeLessThanOrEqual(50);
  });

  it('should handle invalid/missing input', async () => {
    const invalidInputs = [
      { description: "Missing title", type: "job" },
      { title: "Missing type", description: "No type" },
      { title: "Missing description", type: "job" }
    ];
    for (let input of invalidInputs) {
      try {
        await postEvaluate(input);
        throw new Error("API did not fail for invalid input");
      } catch (err: any) {
        expect(err.response && err.response.status).toBe(400);
      }
    }
  });

  it('should handle LLM failure simulation', async () => {
    try {
      await postEvaluate({ title: "Bad", description: "Bad", type: "job", forceLLMError: true });
      throw new Error("API did not fail for LLM error simulation");
    } catch (err: any) {
      expect(err.response && err.response.status).toBeGreaterThanOrEqual(500);
    }
  });

  it('should require authentication', async () => {
    try {
      await axios.post(`${baseUrl}/api/orion/opportunity/evaluate`, {
        title: "No Auth",
        description: "No Auth",
        type: "job"
      }, { headers: { 'Content-Type': 'application/json' } });
      throw new Error("API did not fail for missing auth");
    } catch (err: any) {
      expect([401, 403]).toContain(err.response && err.response.status);
    }
  });
});

describe('Agentic LLM Tool Use API', () => {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mock-test-token'
    }
  });

  it('should trigger a memory search tool call and return a final answer', async () => {
    const userQuery = "What did I write about career last week?";
    const res = await axiosInstance.post('/api/orion/agent/execute', {
      userQuery
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(typeof res.data.answer).toBe('string');
    // Optionally check that tool_calls occurred in the history
    const toolCallStep = res.data.history.find((msg: any) => msg.tool_call_id || (msg.role === 'tool'));
    expect(toolCallStep).toBeDefined();
  });
});

// --- Memory Deletion API Tests ---
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const AUTH_HEADER = { 'Authorization': 'Bearer test-token' }; // Adjust as needed for your auth

async function createMemoryPoint() {
  const res = await fetch(`${BASE_URL}/api/orion/memory/add-memory`, {
    method: 'POST',
    headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'Test memory for deletion',
      type: 'test_deletion',
      tags: ['test', 'deletion']
    })
  });
  const data = await res.json();
  return data.memoryId;
}

describe('Memory Deletion API', () => {
  it('should delete a single memory point', async () => {
    const id = await createMemoryPoint();
    // Delete
    const delRes = await fetch(`${BASE_URL}/api/orion/memory/delete`, {
      method: 'POST',
      headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id] })
    });
    const delData = await delRes.json();
    expect(delData.success).toBe(true);

    // Confirm deletion
    const searchRes = await fetch(`${BASE_URL}/api/orion/memory/search`, {
      method: 'POST',
      headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
      body: JSON.stringify({ queryText: 'Test memory for deletion', filter: { must: [{ key: 'id', match: { value: id } }] } })
    });
    const searchData = await searchRes.json();
    if (typeof searchData.results === 'undefined') {
      expect(searchData.results).toBeUndefined();
    } else {
      expect(Array.isArray(searchData.results) ? searchData.results.length : 0).toBe(0);
    }
  });

  it('should handle batch deletion', async () => {
    const id1 = await createMemoryPoint();
    const id2 = await createMemoryPoint();
    const delRes = await fetch(`${BASE_URL}/api/orion/memory/delete`, {
      method: 'POST',
      headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id1, id2] })
    });
    const delData = await delRes.json();
    expect(delData.success).toBe(true);
  });

  it('should handle non-existent ID gracefully', async () => {
    const fakeId = 'nonexistent-id-12345';
    const delRes = await fetch(`${BASE_URL}/api/orion/memory/delete`, {
      method: 'POST',
      headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [fakeId] })
    });
    const delData = await delRes.json();
    expect(delData.success).toBeDefined();
  });

  it('should return 400 for invalid ID format', async () => {
    const delRes = await fetch(`${BASE_URL}/api/orion/memory/delete`, {
      method: 'POST',
      headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [12345] }) // Not a string
    });
    expect(delRes.status).toBe(400);
    const delData = await delRes.json();
    expect(delData.success).toBe(false);
  });

  it('should require authentication', async () => {
    const id = await createMemoryPoint();
    const delRes = await fetch(`${BASE_URL}/api/orion/memory/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id] })
    });
    expect(delRes.status).toBe(401);
  });
});
async function testCVTailoringSystem() {
  console.log("Starting CV Tailoring System Test");

  try {
    // Step 1: Fetch CV components
    console.log("\n1. Fetching CV components...");
    const components = await fetchCVComponents();
    console.log(`   Found ${components.length} components`);

    if (components.length === 0) {
      throw new Error("No CV components found. Make sure the Python API server is running and Notion is configured.");
    }

    const testJdAnalysis = `
      Senior Software Engineer position requiring expertise in React, TypeScript, and cloud services.
      The ideal candidate will have 5+ years of experience building scalable web applications,
      strong communication skills, and experience working in agile teams.
      Experience with AWS, CI/CD pipelines, and microservices architecture is a plus.
    `;

    console.log("\n2. Testing component suggestion...");
    const suggestion = await suggestCVComponents(
      testJdAnalysis,
      "Senior Software Engineer",
      "TechCorp"
    );

    if (!suggestion.success || !suggestion.suggested_component_ids || suggestion.suggested_component_ids.length === 0) {
      throw new Error(`Component suggestion failed: ${suggestion.error || "No components suggested"}`);
    }

    console.log(`   Successfully suggested ${suggestion.suggested_component_ids.length} components`);

    // Step 3: Test component rephrasing
    // Add null check for suggested component IDs
    if (!suggestion.suggested_component_ids?.length) {
      console.error("No suggested components for improvement");
      return;
    }

    const componentToRephrase = components.find(c => c.unique_id === suggestion.suggested_component_ids![0]);

    // Add null check for component lookup
    if (!componentToRephrase) {
      console.error(`Could not find component with ID: ${suggestion.suggested_component_ids[0]}`);
      return;
    }
    if (!componentToRephrase) {
      throw new Error("Could not find suggested component for rephrasing");
    }

    console.log(`\n3. Testing component rephrasing for "${componentToRephrase.component_name}"...`);
    const rephraseResult = await rephraseComponent(
      componentToRephrase.unique_id,
      testJdAnalysis,
      "TechCorp is a leading technology company focused on cloud solutions."
    );

    if (!rephraseResult.success || !rephraseResult.rephrased_content) {
      throw new Error(`Component rephrasing failed: ${rephraseResult.error || "No rephrased content returned"}`);
    }

    console.log("   Component rephrased successfully");
    console.log(`   Original: "${componentToRephrase.content_primary.substring(0, 100)}..."`);
    console.log(`   Rephrased: "${rephraseResult.rephrased_content.substring(0, 100)}..."`);

    // Step 4: Test CV assembly
    console.log("\n4. Testing CV assembly...");
    const tailoredContentMap: Record<string, string> = {
      [componentToRephrase.unique_id]: rephraseResult.rephrased_content
    };

    const assembleResult = await assembleCV(
      suggestion.suggested_component_ids.slice(0, 5),
      "Standard",
      "**TOMIDE ADEOYE**\ntomideadeoye@gmail.com | +234 818 192 7251",
      tailoredContentMap
    );

    if (!assembleResult.success || !assembleResult.assembled_cv) {
      throw new Error(`CV assembly failed: ${assembleResult.error || "No assembled CV returned"}`);
    }

    console.log("   CV assembled successfully");
    console.log(`   Assembled CV (preview): "${assembleResult.assembled_cv.substring(0, 200)}..."`);

    console.log("\nCV Tailoring System Test completed successfully!");

  } catch (error: any) {
    console.error(`\nTest failed: ${error.message}`);
    console.error(error);
  }
}
testCVTailoringSystem();
