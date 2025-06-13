import { NextRequest, NextResponse } from "next/server";
import { callExternalLLM, getFallbackModels } from '@repo/shared';

const PRIMARY_MODEL = "azure/gpt-4.1";
const FALLBACK_MODELS = getFallbackModels(PRIMARY_MODEL);
const MODELS_TO_CHECK = [PRIMARY_MODEL, ...FALLBACK_MODELS];

// Configuration object using environment variables
const DEEPSEEK_CONFIG = {
  apiKey: process.env.AZURE_DEEPSEEK_API_KEY,
  basePath: process.env.AZURE_DEEPSEEK_ENDPOINT,
  apiVersion: process.env.AZURE_DEEPSEEK_API_VERSION,
};

// Validate configuration on server start
if (!DEEPSEEK_CONFIG.apiKey || !DEEPSEEK_CONFIG.basePath) {
  console.error("Azure DeepSeek configuration missing:");
  console.error("- AZURE_DEEPSEEK_API_KEY:", !!DEEPSEEK_CONFIG.apiKey);
  console.error("- AZURE_DEEPSEEK_ENDPOINT:", !!DEEPSEEK_CONFIG.basePath);
}

const AZURE_DEEPSEEK_CONFIG = {
  apiKey: process.env.AZURE_DEEPSEEK_API_KEY,
  basePath:
    "https://ai-tomideadeoyeai005753286646.services.ai.azure.com/models/chat/completions",
  apiVersion: "2024-05-01-preview",
};

export async function GET(req: NextRequest) {
  const results = [];
  for (const model of MODELS_TO_CHECK) {
    try {
      const response = await callExternalLLM(
        model,
        [{ role: "user", content: "Say hello." }],
        0.2,
        32
      );
      results.push({
        model,
        provider: model.split("/")[0],
        status: "success",
        content: response.content || null,
        error: null,
      });
    } catch (err: any) {
      results.push({
        model,
        provider: model.split("/")[0],
        status: "fail",
        content: null,
        error: err.message || String(err),
      });
    }
  }

  const [deepseekHealthy, ollamaHealthy] = await Promise.all([
    checkDeepSeekHealth(),
    checkOllamaHealth(),
  ]);

  return NextResponse.json({
    success: true,
    results,
    deepseek: deepseekHealthy ? "operational" : "outage",
    ollama: ollamaHealthy ? "operational" : "outage",
    timestamp: new Date().toISOString(),
  });
}

async function checkDeepSeekHealth() {
  const config = {
    apiKey: process.env.AZURE_DEEPSEEK_API_KEY,
    basePath: process.env.AZURE_DEEPSEEK_ENDPOINT,
    apiVersion: process.env.AZURE_DEEPSEEK_API_VERSION || "2024-05-01-preview",
  };

  if (!config.apiKey || !config.basePath) {
    return false;
  }

  try {
    const testPayload = {
      messages: [{ role: "user", content: "Health check" }],
      max_tokens: 5,
    };

    const response = await fetch(
      `${config.basePath}?api-version=${config.apiVersion}`,
      {
        method: "POST",
        headers: {
          "api-key": config.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testPayload),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("[DeepSeek Health Check] Connection failed:", error);
    return false;
  }
}

async function checkOllamaHealth() {
  // Implementation of checkOllamaHealth function
  return true; // Placeholder return, actual implementation needed
}
