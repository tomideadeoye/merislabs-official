import fs from 'fs';
import path from 'path';
import { OpportunityCreatePayload, OpportunityNotionInput, OpportunityNotionOutputShared } from '../types/orion';
import fetch from 'node-fetch';
import { parseNotionPageProperties } from '../lib/notion_service';

describe('Sequential Thinking Prompts', () => {
  const filePath = path.join(__dirname, '../data/sequential_thinking_prompts.json');

  it('should exist and be valid JSON', () => {
    expect(fs.existsSync(filePath)).toBe(true);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    expect(Array.isArray(data)).toBe(true);
  });

  it('should contain required fields for each prompt', () => {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    data.forEach((prompt: any) => {
      expect(prompt).toHaveProperty('thoughtNumber');
      expect(prompt).toHaveProperty('thought');
      expect(prompt).toHaveProperty('totalThoughts');
      expect(prompt).toHaveProperty('timestamp');
    });
  });

  it('should have logical step progression', () => {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    for (let i = 1; i < data.length; i++) {
      expect(data[i].thoughtNumber).toBe(data[i-1].thoughtNumber + 1);
    }
  });

  it('should handle empty or corrupted file gracefully', () => {
    const badPath = path.join(__dirname, '../data/bad_sequential_thinking_prompts.json');
    fs.writeFileSync(badPath, '');
    try {
      expect(() => JSON.parse(fs.readFileSync(badPath, 'utf-8'))).toThrow();
    } finally {
      fs.unlinkSync(badPath);
    }
  });
});

// Add more tests for Opportunity Pipeline, CV Tailoring, and UI as components are available.

// --- Opportunity Type Safety & Creation Tests ---
describe('Opportunity Type Safety', () => {
  it('should allow creation of OpportunityCreatePayload with content and company', () => {
    const payload: OpportunityCreatePayload = {
      title: 'Test Opportunity',
      company: 'Test Company',
      content: 'This is a test opportunity description.',
      type: 'job',
      status: 'not_started',
      priority: 'medium',
      url: 'https://example.com',
      sourceURL: 'https://example.com/source',
      tags: ['test', 'job'],
    };
    console.log('[TEST] OpportunityCreatePayload:', payload);
    expect(payload.title).toBe('Test Opportunity');
    expect(payload.company).toBe('Test Company');
    expect(payload.content).toContain('test opportunity');
    expect(payload.type).toBe('job');
    expect(payload.tags).toContain('test');
  });

  it('should allow creation of OpportunityNotionInput with content and company', () => {
    const notionInput: OpportunityNotionInput = {
      title: 'Notion Opportunity',
      company: 'Notion Company',
      content: 'Notion content',
      type: 'job',
      status: 'not_started',
      tags: ['notion', 'job'],
    };
    console.log('[TEST] OpportunityNotionInput:', notionInput);
    expect(notionInput.company).toBe('Notion Company');
    expect(notionInput.content).toBe('Notion content');
    expect(notionInput.tags).toContain('notion');
  });

  it('should allow creation of OpportunityNotionOutputShared with content and company', () => {
    const notionOutput: OpportunityNotionOutputShared = {
      id: 'notion-id',
      notion_page_id: 'page-id',
      title: 'Output Opportunity',
      company: 'Output Company',
      content: 'Output content',
      status: 'not_started',
      url: 'https://output.com',
      tags: ['output', 'job'],
    };
    console.log('[TEST] OpportunityNotionOutputShared:', notionOutput);
    expect(notionOutput.company).toBe('Output Company');
    expect(notionOutput.content).toBe('Output content');
    expect(notionOutput.tags).toContain('output');
  });

  it('should not allow description or companyOrInstitution fields', () => {
    // @ts-expect-error
    const badPayload: OpportunityCreatePayload = { title: 'Bad', description: 'no', companyOrInstitution: 'no', content: 'ok', company: 'ok', type: 'job' };
    // @ts-expect-error
    const badInput: OpportunityNotionInput = { title: 'Bad', description: 'no', companyOrInstitution: 'no', content: 'ok', company: 'ok', type: 'job' };
    // @ts-expect-error
    const badOutput: OpportunityNotionOutputShared = { id: 'bad', title: 'Bad', description: 'no', companyOrInstitution: 'no', content: 'ok', company: 'ok' };
    expect(badPayload).toBeDefined();
    expect(badInput).toBeDefined();
    expect(badOutput).toBeDefined();
  });

  it('should not allow extraneous properties in OpportunityNotionOutputShared', () => {
    // @ts-expect-error
    const badOutput: OpportunityNotionOutputShared = { id: 'bad', title: 'Bad', company: 'Bad', content: 'ok', pros: ['should not be here'], cons: ['no'], missingSkills: ['no'], scoreExplanation: 'no', contentType: 'no', recommendation: 'no' };
    // @ts-expect-error
    expect(badOutput.pros).toBeUndefined();
    // @ts-expect-error
    expect(badOutput.recommendation).toBeUndefined();
    // @ts-expect-error
    expect(badOutput.contentType).toBeUndefined();
    // @ts-expect-error
    expect(badOutput.scoreExplanation).toBeUndefined();
    // @ts-expect-error
    expect(badOutput.missingSkills).toBeUndefined();
    // @ts-expect-error
    expect(badOutput.cons).toBeUndefined();
    console.log('[TEST] Extraneous properties are not allowed in OpportunityNotionOutputShared.');
  });
});

const BLOCK_API_BASE = 'http://localhost:3000/api/orion/blocks';
const TEST_BLOCK_TYPES = [
  'CV_SNIPPET',
  'OPPORTUNITY_HIGHLIGHT',
  'JOURNAL_INSIGHT',
  'PROMPT_TEMPLATE',
  'GENERAL_BLOCK',
];

describe('Blocks API Integration', () => {
  let createdBlockIds: string[] = [];

  TEST_BLOCK_TYPES.forEach((blockType) => {
    it(`should create and fetch a block of type ${blockType}`, async () => {
      const payload = {
        type: blockType,
        title: `Test Block ${blockType}`,
        content: `This is a test block of type ${blockType}.`,
        tags: ['test', blockType.toLowerCase()],
      };
      const createRes = await fetch(`${BLOCK_API_BASE}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const createData = await createRes.json();
      console.log(`[TEST] Create block (${blockType}):`, createData);
      expect(createRes.status).toBe(200);
      expect(createData.success).toBe(true);
      expect(createData.block).toBeDefined();
      expect(createData.block.type).toBe(blockType);
      createdBlockIds.push(createData.block.id);

      // Fetch by type
      const listRes = await fetch(`${BLOCK_API_BASE}/list?type=${blockType}`);
      const listData = await listRes.json();
      console.log(`[TEST] List blocks (${blockType}):`, listData);
      expect(listRes.status).toBe(200);
      expect(listData.success).toBe(true);
      expect(Array.isArray(listData.blocks)).toBe(true);
      // Should find at least one block of this type
      const found = listData.blocks.some((b: any) => b.id === createData.block.id);
      expect(found).toBe(true);
    });
  });

  it('should return 400 for missing type in list', async () => {
    const res = await fetch(`${BLOCK_API_BASE}/list`);
    const data = await res.json();
    console.log('[TEST] List blocks missing type:', data);
    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toMatch(/type/);
  });

  it('should return 400 for missing required fields in create', async () => {
    const res = await fetch(`${BLOCK_API_BASE}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Missing type and content' }),
    });
    const data = await res.json();
    console.log('[TEST] Create block missing fields:', data);
    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });
});

// --- Notion Property Parsing Tests ---
describe('parseNotionPageProperties', () => {
  it('should extract all fields from a well-formed Notion page', () => {
    const mockPage = {
      id: 'page-1',
      properties: {
        'Start Date': { date: { start: '2023-01-01' } },
        'End Date': { date: { start: '2023-01-31' } },
        'UniqueID': { rich_text: [{ plain_text: 'UID123' }] },
        'Component Name': { title: [{ plain_text: 'ComponentX' }] },
        'Component Type': { select: { name: 'TypeA' } },
        'Content Primary': { rich_text: [{ plain_text: 'Primary content' }] },
        'Keywords': { multi_select: [{ name: 'AI' }, { name: 'ML' }] },
        'Associated Company': { rich_text: [{ plain_text: 'Acme Corp' }] },
      }
    };
    const result = parseNotionPageProperties(mockPage);
    expect(result.StartDate).toBe('2023-01-01');
    expect(result.EndDate).toBe('2023-01-31');
    expect(result.UniqueID).toBe('UID123');
    expect(result.ComponentName).toBe('ComponentX');
    expect(result.ComponentType).toBe('TypeA');
    expect(result.ContentPrimary).toBe('Primary content');
    expect(result.Keywords).toEqual(['AI', 'ML']);
    expect(result.AssociatedCompany).toBe('Acme Corp');
  });

  it('should handle missing/optional fields gracefully', () => {
    const mockPage = {
      id: 'page-2',
      properties: {
        'Start Date': {},
        'UniqueID': {},
        'Component Name': {},
        'Component Type': {},
        'Content Primary': {},
        'Keywords': {},
        'Associated Company': {},
      }
    };
    const result = parseNotionPageProperties(mockPage);
    expect(result.StartDate).toBeNull();
    expect(result.EndDate).toBeNull();
    expect(result.UniqueID).toBeNull();
    expect(result.ComponentName).toBeNull();
    expect(result.ComponentType).toBeNull();
    expect(result.ContentPrimary).toBeNull();
    expect(result.Keywords).toEqual([]);
    expect(result.AssociatedCompany).toBeNull();
  });

  it('should log and return nulls for completely invalid input', () => {
    const result = parseNotionPageProperties(null);
    expect(result.StartDate).toBeNull();
    expect(result.EndDate).toBeNull();
    expect(result.UniqueID).toBeNull();
    expect(result.ComponentName).toBeNull();
    expect(result.ComponentType).toBeNull();
    expect(result.ContentPrimary).toBeNull();
    expect(result.Keywords).toEqual([]);
    expect(result.AssociatedCompany).toBeNull();
  });

  it('should handle extra/unexpected properties without error', () => {
    const mockPage = {
      id: 'page-3',
      properties: {
        'Start Date': { date: { start: '2023-02-01' } },
        'Extra Field': { rich_text: [{ plain_text: 'Extra' }] },
      }
    };
    const result = parseNotionPageProperties(mockPage);
    expect(result.StartDate).toBe('2023-02-01');
    expect(result.EndDate).toBeNull();
    expect(result.UniqueID).toBeNull();
    expect(result.ComponentName).toBeNull();
    expect(result.ComponentType).toBeNull();
    expect(result.ContentPrimary).toBeNull();
    expect(result.Keywords).toEqual([]);
    expect(result.AssociatedCompany).toBeNull();
  });
});
