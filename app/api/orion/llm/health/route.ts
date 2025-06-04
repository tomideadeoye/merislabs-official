import { NextRequest, NextResponse } from 'next/server';
import { callExternalLLM, getFallbackModels } from '@/lib/orion_llm';

const PRIMARY_MODEL = 'azure/gpt-4.1';
const FALLBACK_MODELS = getFallbackModels(PRIMARY_MODEL);
const MODELS_TO_CHECK = [PRIMARY_MODEL, ...FALLBACK_MODELS];

export async function GET(req: NextRequest) {
  const results = [];
  for (const model of MODELS_TO_CHECK) {
    try {
      const response = await callExternalLLM(model, [
        { role: 'user', content: 'Say hello.' }
      ], 0.2, 32);
      results.push({
        model,
        provider: model.split('/')[0],
        status: 'success',
        content: response.content || null,
        error: null
      });
    } catch (err: any) {
      results.push({
        model,
        provider: model.split('/')[0],
        status: 'fail',
        content: null,
        error: err.message || String(err)
      });
    }
  }
  return NextResponse.json({ success: true, results });
}
