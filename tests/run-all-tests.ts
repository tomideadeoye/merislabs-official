import fs from 'fs';
import path from 'path';
import { OpportunityCreatePayload, OpportunityNotionInput, OpportunityNotionOutputShared } from '../types/orion';

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
