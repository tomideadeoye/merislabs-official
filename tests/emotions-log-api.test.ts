import { POST } from '../app/api/orion/emotions/log/route';
import { NextRequest } from 'next/server';

function createMockRequest(body: any) {
  return {
    json: async () => body,
  } as unknown as NextRequest;
}

describe('POST /api/orion/emotions/log', () => {
  it('should log an emotion entry successfully', async () => {
    const payload = {
      primaryEmotion: 'Joy',
      intensity: 7,
      secondaryEmotions: ['Excitement'],
      triggers: ['Achievement'],
      physicalSensations: ['Butterflies'],
      accompanyingThoughts: 'I did it!',
      copingMechanismsUsed: ['Deep breathing'],
      contextualNote: 'Won a prize',
      relatedJournalSourceId: 'journal-123',
      cognitiveDistortionAnalysis: {
        automaticThought: 'I always win',
        distortionType: 'Overgeneralization',
        evidenceFor: ['Past wins'],
        evidenceAgainst: ['Some losses'],
      },
      entryTimestamp: '2025-06-06T12:00:00.000Z',
    };

    const req = createMockRequest(payload);
    const res = await POST(req);

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.entry.primaryEmotion).toBe('Joy');
    expect(json.entry.cognitiveDistortionAnalysis.automaticThought).toBe('I always win');
  });

  it('should fail validation if required fields are missing', async () => {
    const payload = {
      intensity: 5,
      // No primaryEmotion or cognitiveDistortionAnalysis.automaticThought
    };

    const req = createMockRequest(payload);
    const res = await POST(req);

    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/Primary emotion or an automatic thought is required/);
  });

  it('should handle missing optional fields gracefully', async () => {
    const payload = {
      primaryEmotion: 'Sadness',
      intensity: 3,
    };

    const req = createMockRequest(payload);
    const res = await POST(req);

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.entry.primaryEmotion).toBe('Sadness');
    expect(json.entry.secondaryEmotions).toEqual([]);
    expect(json.entry.copingMechanismsUsed).toEqual([]);
  });
});
