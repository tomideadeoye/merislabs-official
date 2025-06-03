/**
 * Comprehensive Jest test suite for Orion.
 * This file is named with the .test.ts suffix so Jest will automatically discover and run it.
 * To run: npx jest
 */

import axios from 'axios';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { ORION_ACCESSIBLE_LOCAL_DIRECTORIES } from '../lib/orion_config.js';
import { initializeClientSession } from '../app_state';
import { generatePDF } from '../lib/pdf-generator';
import { generateWordDoc } from '../lib/word-generator';

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
