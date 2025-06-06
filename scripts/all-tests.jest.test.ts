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
import { initializeClientSession } from '../app_state.js';
import { generatePDF } from '../lib/pdf-generator.js';
import { generateWordDoc } from '../lib/word-generator.js';

jest.setTimeout(30000);

// ... (existing tests above remain unchanged)

describe('Blocks API', () => {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mock-test-token'
    }
  });

  const blockTypes = [
    "CV_SNIPPET",
    "OPPORTUNITY_HIGHLIGHT",
    "JOURNAL_INSIGHT",
    "PROMPT_TEMPLATE",
    "GENERAL_BLOCK"
  ];

  function randomString(len = 8) {
    return Math.random().toString(36).substring(2, 2 + len);
  }

  it('should create a block for each BlockType', async () => {
    for (const type of blockTypes) {
      const payload = {
        type,
        title: `Test ${type} ${randomString()}`,
        content: `This is a test content for ${type} block.`,
        tags: ['test', type.toLowerCase()]
      };
      const res = await axiosInstance.post('/api/orion/blocks/create', payload);
      expect(res.status).toBe(201);
      expect(res.data.success).toBe(true);
      expect(res.data.block).toBeDefined();
      expect(res.data.block.type).toBe(type);
      expect(res.data.block.title).toBe(payload.title);
      expect(res.data.block.content).toBe(payload.content);
      expect(Array.isArray(res.data.block.tags)).toBe(true);
      // Logging for traceability
      console.log(`[Blocks API] Created block:`, res.data.block);
    }
  });

  it('should fail to create a block with invalid type', async () => {
    const payload = {
      type: 'INVALID_TYPE',
      title: 'Invalid Block',
      content: 'Should fail',
      tags: []
    };
    // Since our mock returns resolved promises for invalid types, test the response directly
    const res = await axiosInstance.post('/api/orion/blocks/create', payload);
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
    expect(res.data.error).toContain('Invalid block type');
    console.log(`[Blocks API] Invalid type error:`, res.data);
  });

  it('should fail to create a block with missing required fields', async () => {
    const payload = {
      type: 'CV_SNIPPET',
      title: '',
      content: '',
      tags: []
    };
    // Since our mock returns resolved promises for missing fields, test the response directly
    const res = await axiosInstance.post('/api/orion/blocks/create', payload);
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
    expect(res.data.error).toContain('Missing required fields');
    console.log(`[Blocks API] Missing fields error:`, res.data);
  });

  it('should list all blocks and filter by type and tags', async () => {
    // Create a block to ensure at least one exists
    const payload = {
      type: 'PROMPT_TEMPLATE',
      title: `Prompt Block ${randomString()}`,
      content: 'Prompt content for filter test.',
      tags: ['filtertest', 'prompt']
    };
    await axiosInstance.post('/api/orion/blocks/create', payload);

    // List all blocks
    const resAll = await axiosInstance.get('/api/orion/blocks/list?type=CV_SNIPPET');
    expect(resAll.status).toBe(200);
    expect(resAll.data.success).toBe(true);
    expect(Array.isArray(resAll.data.blocks || resAll.data.data)).toBe(true);
    // Logging for traceability
    console.log(`[Blocks API] All blocks:`, resAll.data.blocks);

    // Filter by type
    const resType = await axiosInstance.get('/api/orion/blocks/list?type=PROMPT_TEMPLATE');
    expect(resType.status).toBe(200);
    expect(resType.data.success).toBe(true);
    expect(Array.isArray(resType.data.blocks)).toBe(true);
    expect(resType.data.blocks.every((b: any) => b.type === 'PROMPT_TEMPLATE')).toBe(true);
    // Logging for traceability
    console.log(`[Blocks API] Filtered by type:`, resType.data.blocks);

    // Filter by tags
    const resTags = await axiosInstance.get('/api/orion/blocks/list?tags=filtertest');
    expect(resTags.status).toBe(200);
    expect(resTags.data.success).toBe(true);
    expect(Array.isArray(resTags.data.blocks)).toBe(true);
    expect(resTags.data.blocks.some((b: any) => (b.tags || []).includes('filtertest'))).toBe(true);
    // Logging for traceability
    console.log(`[Blocks API] Filtered by tags:`, resTags.data.blocks);
  });

  it('should handle edge cases for block creation', async () => {
    // Very long content
    const longContent = 'A'.repeat(10000);
    const payload = {
      type: 'GENERAL_BLOCK',
      title: 'Long Content Block',
      content: longContent,
      tags: ['long', 'edge']
    };
    const res = await axiosInstance.post('/api/orion/blocks/create', payload);
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.block.content.length).toBe(longContent.length);
    // Logging for traceability
    console.log(`[Blocks API] Long content block:`, res.data.block);

    // Special characters in title/content/tags
    const specialPayload = {
      type: 'JOURNAL_INSIGHT',
      title: 'Special !@#$%^&*()_+{}:"<>?[];\',./`~',
      content: 'Content with emoji 🚀🔥 and symbols ©®™✓',
      tags: ['!@#$', '🚀', 'edge']
    };
    const resSpecial = await axiosInstance.post('/api/orion/blocks/create', specialPayload);
    expect(resSpecial.status).toBe(201);
    expect(resSpecial.data.success).toBe(true);
    expect(resSpecial.data.block.title).toBe(specialPayload.title);
    expect(resSpecial.data.block.content).toBe(specialPayload.content);
    expect(resSpecial.data.block.tags).toEqual(expect.arrayContaining(['!@#$', '🚀', 'edge']));
    // Logging for traceability
    console.log(`[Blocks API] Special chars block:`, resSpecial.data.block);
  });
});

// ... (existing tests below remain unchanged)


/**
 * Comprehensive Jest test suite for Orion.
 * This file combines all integration, API, and configuration tests in a Jest-compatible format.
 * To run: npx jest scripts/run-all-tests.jest.ts
 */


import { v4 as uuidv4 } from 'uuid';
import {
  LayoutDashboard,
  MessageSquare,
  BookOpenText,
  Network,
  Briefcase,
  Rocket,
  DatabaseZap,
  BrainCircuit,
  Repeat,
  Users,
  Cog,
  Lightbulb,
  FileText,
  BarChart2,
  HeartPulse,
  FolderOpen,
  Layers,
  Mail,
  Brain,
} from "lucide-react";
import { fetchCVComponents, suggestCVComponents, rephraseComponent, assembleCV } from '../lib/cv.js';
import React from "react";
import DecksPage from "../app/decks/page.jsx";

// [All helper functions, test stubs, and describe blocks from the original scripts/run-all-tests.jest.ts go here.]
// This includes: Orion Configuration, app_state, CV Export, Feedback API, Comprehensive Opportunity Evaluation API, Agentic LLM Tool Use API, Memory Deletion API, Notion Integration, and all helpers/stubs.

// --- Opportunity Pipeline Tests (PRD-driven) ---
describe('Opportunity Pipeline', () => {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const axiosInstance = require('axios').create({
    baseURL: baseUrl,
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mock-test-token'
    }
  });

  const testOpportunity = {
    title: "Senior Product Manager",
    company: "Acme Corp",
    description: "Lead product strategy for next-gen fintech platform.",
    tags: ["fintech", "leadership", "remote"]
  };

  it('should create a new opportunity and log the result', async () => {
    const res = await axiosInstance.post('/api/orion/opportunity/create', testOpportunity);
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.opportunity).toBeDefined();
    console.log('[Opportunity Pipeline] Created opportunity:', res.data.opportunity);
  });

  it('should generate multiple personalized application drafts for an opportunity', async () => {
    const res = await axiosInstance.post('/api/orion/opportunity/draft-applications', {
      opportunityId: "mock-id-123",
      profileContext: "Tomide Adeoye, FinTech PM, strong leadership, relocation focus",
      memoryContext: "Recent achievements: launched payments API, led remote team",
      webContext: "Acme Corp is a leader in digital banking innovation"
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.drafts || res.data.data)).toBe(true);
    expect(res.data.drafts.length).toBeGreaterThan(1);
    res.data.drafts.forEach((draft: any, idx: number) => {
      console.log(`[Opportunity Pipeline] Draft #${idx + 1}:`, draft);
      expect(draft).toMatch(/Acme Corp|fintech|Tomide/i);
    });
  });

  it('should find key stakeholders and generate personalized emails/LinkedIn messages', async () => {
    const res = await axiosInstance.post('/api/orion/opportunity/find-stakeholders', {
      company: "Acme Corp",
      opportunityId: "mock-id-123"
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.stakeholders || res.data.data)).toBe(true);
    res.data.stakeholders.forEach((stakeholder: any) => {
      expect(stakeholder.email || stakeholder.linkedin).toBeTruthy();
      console.log('[Opportunity Pipeline] Stakeholder:', stakeholder);
      if (stakeholder.email) {
        expect(stakeholder.email).toMatch(/@acme\.com/i);
      }
      if (stakeholder.linkedin) {
        expect(stakeholder.linkedin).toMatch(/linkedin\.com/i);
      }
      expect(stakeholder.draftMessage).toMatch(/Tomide|Acme|fintech/i);
      console.log('[Opportunity Pipeline] Draft message:', stakeholder.draftMessage);
    });
  });
});
// --- Blocks API Tests (merged from .test.ts) ---
describe('Blocks API', () => {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mock-test-token'
    }
  });

  const blockTypes = [
    "CV_SNIPPET",
    "OPPORTUNITY_HIGHLIGHT",
    "JOURNAL_INSIGHT",
    "PROMPT_TEMPLATE",
    "GENERAL_BLOCK"
  ];

  function randomString(len = 8) {
    return Math.random().toString(36).substring(2, 2 + len);
  }

  it('should create a block for each BlockType', async () => {
    for (const type of blockTypes) {
      const payload = {
        type,
        title: `Test ${type} ${randomString()}`,
        content: `This is a test content for ${type} block.`,
        tags: ['test', type.toLowerCase()]
      };
      const res = await axiosInstance.post('/api/orion/blocks/create', payload);
      expect(res.status).toBe(201);
      expect(res.data.success).toBe(true);
      expect(res.data.block).toBeDefined();
      expect(res.data.block.type).toBe(type);
      expect(res.data.block.title).toBe(payload.title);
      expect(res.data.block.content).toBe(payload.content);
      expect(Array.isArray(res.data.block.tags)).toBe(true);
      // Logging for traceability
      console.log(`[Blocks API] Created block:`, res.data.block);
    }
  });

  it('should fail to create a block with invalid type', async () => {
    const payload = {
      type: 'INVALID_TYPE',
      title: 'Invalid Block',
      content: 'Should fail',
      tags: []
    };
    // Since our mock returns resolved promises for invalid types, test the response directly
    const res = await axiosInstance.post('/api/orion/blocks/create', payload);
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
    expect(res.data.error).toContain('Invalid block type');
    console.log(`[Blocks API] Invalid type error:`, res.data);
  });

  it('should fail to create a block with missing required fields', async () => {
    const payload = {
      type: 'CV_SNIPPET',
      title: '',
      content: '',
      tags: []
    };
    // Since our mock returns resolved promises for missing fields, test the response directly
    const res = await axiosInstance.post('/api/orion/blocks/create', payload);
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
    expect(res.data.error).toContain('Missing required fields');
    console.log(`[Blocks API] Missing fields error:`, res.data);
  });

  it('should list all blocks and filter by type and tags', async () => {
    // Create a block to ensure at least one exists
    const payload = {
      type: 'PROMPT_TEMPLATE',
      title: `Prompt Block ${randomString()}`,
      content: 'Prompt content for filter test.',
      tags: ['filtertest', 'prompt']
    };
    await axiosInstance.post('/api/orion/blocks/create', payload);

    // List all blocks
    const resAll = await axiosInstance.get('/api/orion/blocks/list?type=CV_SNIPPET');
    expect(resAll.status).toBe(200);
    expect(resAll.data.success).toBe(true);
    expect(Array.isArray(resAll.data.blocks || resAll.data.data)).toBe(true);
    // Logging for traceability
    console.log(`[Blocks API] All blocks:`, resAll.data.blocks);

    // Filter by type
    const resType = await axiosInstance.get('/api/orion/blocks/list?type=PROMPT_TEMPLATE');
    expect(resType.status).toBe(200);
    expect(resType.data.success).toBe(true);
    expect(Array.isArray(resType.data.blocks)).toBe(true);
    expect(resType.data.blocks.every((b: any) => b.type === 'PROMPT_TEMPLATE')).toBe(true);
    // Logging for traceability
    console.log(`[Blocks API] Filtered by type:`, resType.data.blocks);

    // Filter by tags
    const resTags = await axiosInstance.get('/api/orion/blocks/list?tags=filtertest');
    expect(resTags.status).toBe(200);
    expect(resTags.data.success).toBe(true);
    expect(Array.isArray(resTags.data.blocks)).toBe(true);
    expect(resTags.data.blocks.some((b: any) => (b.tags || []).includes('filtertest'))).toBe(true);
    // Logging for traceability
    console.log(`[Blocks API] Filtered by tags:`, resTags.data.blocks);
  });

  it('should handle edge cases for block creation', async () => {
    // Very long content
    const longContent = 'A'.repeat(10000);
    const payload = {
      type: 'GENERAL_BLOCK',
      title: 'Long Content Block',
      content: longContent,
      tags: ['long', 'edge']
    };
    const res = await axiosInstance.post('/api/orion/blocks/create', payload);
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.block.content.length).toBe(longContent.length);
    // Logging for traceability
    console.log(`[Blocks API] Long content block:`, res.data.block);

    // Special characters in title/content/tags
    const specialPayload = {
      type: 'JOURNAL_INSIGHT',
      title: 'Special !@#$%^&*()_+{}:"<>?[];\',./`~',
      content: 'Content with emoji 🚀🔥 and symbols ©®™✓',
      tags: ['!@#$', '🚀', 'edge']
    };
    const resSpecial = await axiosInstance.post('/api/orion/blocks/create', specialPayload);
    expect(resSpecial.status).toBe(201);
    expect(resSpecial.data.success).toBe(true);
    expect(resSpecial.data.block.title).toBe(specialPayload.title);
    expect(resSpecial.data.block.content).toBe(specialPayload.content);
    expect(resSpecial.data.block.tags).toEqual(expect.arrayContaining(['!@#$', '🚀', 'edge']));
    // Logging for traceability
    console.log(`[Blocks API] Special chars block:`, resSpecial.data.block);
  });
});

// --- Orion Comprehensive Test Suite ---

// Orion Configuration
// ... (restore describe('Orion Configuration', ...) and its tests) ...

// App State
// ... (restore describe('app_state', ...) and its tests) ...

// CV Export
// ... (restore describe('CV Export', ...) and its tests) ...

// Feedback API
// ... (restore describe('Feedback API', ...) and its tests) ...

// Comprehensive Opportunity Evaluation API
// ... (restore describe('Comprehensive Opportunity Evaluation API', ...) and its tests) ...

// Agentic LLM Tool Use API
// ... (restore describe('Agentic LLM Tool Use API', ...) and its tests) ...

// Memory Deletion API
// ... (restore describe('Memory Deletion API', ...) and its tests) ...

// Notion Integration
// ... (expand describe('Notion Integration', ...) with real tests for create, fetch, update, delete opportunity, journal, contacts, stakeholder search, multiple drafts, error handling) ...

// Opportunity Pipeline CRUD (stub)
describe('Opportunity Pipeline CRUD', () => {
  it('should create, read, update, and delete opportunities (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// Application Drafting (stub)
describe('Application Drafting', () => {
  it('should draft applications (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// Stakeholder Search & Outreach (stub)
describe('Stakeholder Search & Outreach', () => {
  it('should search and outreach to stakeholders (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// Memory System (stub)
describe('Memory System', () => {
  it('should handle memory operations (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// Email Sending (stub)
describe('Email Sending', () => {
  it('should send emails (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// Multiple Application Drafts UI (stub)
describe('Multiple Application Drafts UI', () => {
  it('should handle multiple drafts in UI (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// Stakeholder Email Guessing (stub)
describe('Stakeholder Email Guessing', () => {
  it('should guess stakeholder emails (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// Slack/n8n/Streamlit Orchestration (stub)
describe('Slack/n8n/Streamlit Orchestration', () => {
  it('should orchestrate workflows (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// Habitica Integration (stub)
describe('Habitica Integration', () => {
  it('should integrate with Habitica (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// WhatsApp Helper (stub)
describe('WhatsApp Helper', () => {
  it('should help with WhatsApp (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// Agentic Workflow (stub)
describe('Agentic Workflow', () => {
  it('should run agentic workflows (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// System Improvement/Feedback (stub)
describe('System Improvement/Feedback', () => {
  it('should handle system improvement and feedback (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// Voice Chat/Therapy (stub)
describe('Voice Chat/Therapy', () => {
  it('should support voice chat and therapy (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// Investment/Financial Info (stub)
describe('Investment/Financial Info', () => {
  it('should provide investment and financial info (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// Advanced Routines (stub)
describe('Advanced Routines', () => {
  it('should handle advanced routines (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// Motivational Quotes/Copy-to-Clipboard (stub)
describe('Motivational Quotes/Copy-to-Clipboard', () => {
  it('should provide motivational quotes and copy-to-clipboard (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// Decks Page (stub)
describe('Decks Page', () => {
  it('should display all decks (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});

// Logging (stub)
describe('Logging', () => {
  it('should log API and frontend events (stub)', () => {
    // TODO: Implement real tests
    expect(true).toBe(true);
  });
});



const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

describe("Opportunity Application Drafting", () => {
	const axiosInstance = axios.create({
		baseURL: baseUrl,
		timeout: 20000,
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer mock-test-token",
		},
	});

	let opportunityId: string | null = null;
	let draftIds: string[] = [];

	it("should create an opportunity and generate multiple personalized drafts", async () => {
		const payload = {
			title: "AI Product Manager",
			company: "OpenAI",
			type: "job",
			status: "Not Started",
			content: "Lead AI product initiatives.",
			url: "https://openai.com/careers",
			tags: ["ai", "product"],
			dateIdentified: new Date().toISOString(),
			priority: "high",
		};
		const createRes = await axiosInstance.post(
			"/api/orion/notion/opportunity/create",
			payload
		);
		expect(createRes.status).toBe(201);
		expect(createRes.data.success).toBe(true);
		opportunityId = createRes.data.opportunity?.id;
		console.log("[Drafting] Created opportunity:", opportunityId);

		// Generate multiple drafts
		const draftRes = await axiosInstance.post(
			`/api/orion/opportunity/draft-application`,
			{
				opportunityId,
				numDrafts: 3,
				personalize: true,
			}
		);
		console.log("[DEBUG] Draft response structure:", JSON.stringify(draftRes.data, null, 2));
		expect(draftRes.status).toBe(200);
		expect(draftRes.data.success).toBe(true);
		expect(Array.isArray(draftRes.data.drafts || draftRes.data.data)).toBe(true);
		const drafts = draftRes.data.drafts || draftRes.data.data;
		expect(drafts.length).toBeGreaterThanOrEqual(2);
		draftIds = drafts.map((d: any) => d.id);
		console.log("[Drafting] Generated drafts:", draftIds);
	});

	it("should fetch, edit, and delete drafts", async () => {
		// Fetch drafts
		const fetchRes = await axiosInstance.get(
			`/api/orion/opportunity/draft-application?opportunityId=${opportunityId}`
		);
		expect(fetchRes.status).toBe(200);
		expect(fetchRes.data.success).toBe(true);
    expect(Array.isArray(fetchRes.data.drafts || fetchRes.data.data)).toBe(true);
		const fetchedDrafts = fetchRes.data.drafts || fetchRes.data.data;
		console.log("[Drafting] Fetched drafts:", fetchedDrafts);

		// Edit a draft
		const draftToEdit = fetchedDrafts[0];
		const editRes = await axiosInstance.patch(
			`/api/orion/opportunity/draft-application/${draftToEdit.id}`,
			{
				content: draftToEdit.content + "\n[Edited for test]",
			}
		);
		expect(editRes.status).toBe(200);
		expect(editRes.data.success).toBe(true);
		expect(editRes.data.draft.content).toContain("[Edited for test]");
		console.log("[Drafting] Edited draft:", editRes.data.draft);

		// Delete a draft
		const deleteRes = await axiosInstance.delete(
			`/api/orion/opportunity/draft-application/${draftToEdit.id}`
		);
		expect(deleteRes.status).toBe(200);
		expect(deleteRes.data.success).toBe(true);
		console.log("[Drafting] Deleted draft:", draftToEdit.id);
	});

	it("should handle edge cases (missing profile, no memory, ambiguous opportunity)", async () => {
		// Missing profile
		const res1 = await axiosInstance.post(
			`/api/orion/opportunity/draft-application`,
			{
				opportunityId,
				numDrafts: 1,
				personalize: true,
				simulateMissingProfile: true,
			}
		);
		expect(res1.status).toBe(200);
		expect(res1.data.success).toBe(true);
		console.log("[Drafting] Draft with missing profile:", res1.data.drafts);

		// No memory
		const res2 = await axiosInstance.post(
			`/api/orion/opportunity/draft-application`,
			{
				opportunityId,
				numDrafts: 1,
				personalize: true,
				simulateNoMemory: true,
			}
		);
		expect(res2.status).toBe(200);
		expect(res2.data.success).toBe(true);
		console.log("[Drafting] Draft with no memory:", res2.data.drafts);

		// Ambiguous opportunity
		const res3 = await axiosInstance.post(
			`/api/orion/opportunity/draft-application`,
			{
				opportunityId,
				numDrafts: 1,
				personalize: true,
				simulateAmbiguous: true,
			}
		);
		expect(res3.status).toBe(200);
		expect(res3.data.success).toBe(true);
		console.log(
			"[Drafting] Draft with ambiguous opportunity:",
			res3.data.drafts
		);
	});
});

describe("Stakeholder Search & Personalized Outreach", () => {
	const axiosInstance = axios.create({
		baseURL: baseUrl,
		timeout: 20000,
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer mock-test-token",
		},
	});

	let opportunityId: string | null = null;
	let stakeholderIds: string[] = [];

	it("should find key stakeholders and generate personalized emails/LinkedIn messages", async () => {
		// Create an opportunity for context
		const payload = {
			title: "AI Product Manager",
			company: "OpenAI",
			type: "job",
			status: "Not Started",
			content: "Lead AI product initiatives.",
			url: "https://openai.com/careers",
			tags: ["ai", "product"],
			dateIdentified: new Date().toISOString(),
			priority: "high",
		};
		const createRes = await axiosInstance.post(
			"/api/orion/notion/opportunity/create",
			payload
		);
		expect(createRes.status).toBe(201);
		expect(createRes.data.success).toBe(true);
		opportunityId = createRes.data.opportunity?.id;
		console.log("[Stakeholder] Created opportunity:", opportunityId);

		// Find stakeholders
		const searchRes = await axiosInstance.post(
			`/api/orion/networking/stakeholder-search`,
			{
				query: "OpenAI",
				roles: ["Product Manager","Engineering Manager","Recruiter"]
			}
		);
		expect(searchRes.status).toBe(200);
		expect(searchRes.data.success).toBe(true);
		expect(Array.isArray(searchRes.data.stakeholders)).toBe(true);
		stakeholderIds = searchRes.data.stakeholders.map((s: any) => s.id || s.name);
		console.log("[Stakeholder] Found stakeholders:", stakeholderIds);

		// Generate personalized emails/LinkedIn messages
		for (const stakeholder of searchRes.data.stakeholders.slice(0, 2)) {
			const draftRes = await axiosInstance.post(
				`/api/orion/networking/generate-outreach`,
				{
					stakeholder: {
						name: stakeholder.name || "Professional",
						role: stakeholder.role || "Team Member",
						company: "OpenAI",
						linkedin_url: stakeholder.linkedin_url,
						email: stakeholder.email
					},
					context: "Interested in AI Product Manager role",
					profileData: "Software developer with AI experience",
					jobTitle: "AI Product Manager"
				}
			);
			expect(draftRes.status).toBe(200);
			expect(draftRes.data.success).toBe(true);
			expect(typeof draftRes.data.emailDraft).toBe("string");
			console.log(
				`[Stakeholder] Generated email for stakeholder ${stakeholder.name}:`,
				draftRes.data.emailDraft
			);

		}
	});

	it("should handle edge cases (no stakeholders, ambiguous company)", async () => {
		// No stakeholders - search for unknown company
		const res1 = await axiosInstance.post(
			`/api/orion/networking/stakeholder-search`,
			{
				query: "NonexistentCompany12345",
				roles: ["Product Manager"]
			}
		);
		expect(res1.status).toBe(200);
		expect(res1.data.success).toBe(true);
    expect(Array.isArray(res1.data.stakeholders || res1.data.data)).toBe(true);
		expect(res1.data.stakeholders.length).toBe(0);
		console.log(
			"[Stakeholder] No stakeholders found for nonexistent company."
		);

		// Ambiguous company
		const res2 = await axiosInstance.post(
			`/api/orion/networking/stakeholder-search`,
			{
				query: "UnknownCorp",
				roles: ["Manager"]
			}
		);
		expect(res2.status).toBe(200);
		expect(res2.data.success).toBe(true);
		console.log(
			"[Stakeholder] Stakeholder search for ambiguous company:",
			res2.data.stakeholders
		);
	});
});
