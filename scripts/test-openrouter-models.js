/**
 * Test script for OpenRouter models
 * 
 * This script tests the OpenRouter models configured in the system
 */

const axios = require('axios');

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

async function testModel(model, prompt, description) {
  console.log(`\n${'-'.repeat(80)}`);
  console.log(`Testing ${model} with ${description} prompt`);
  console.log(`Prompt: "${prompt}"`);
  
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await axios.post(`${baseUrl}/api/orion/llm/test`, {
      prompt,
      model,
      temperature: 0.7,
      max_tokens: 500
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      console.log(`\n✅ Success with ${model}`);
      console.log(`Response:\n${response.data.content}`);
    } else {
      console.error(`\n❌ Failed with ${model}: ${response.data.error}`);
    }
  } catch (error) {
    console.error(`\n❌ Error testing ${model}:`, 
      error.response?.data?.error || error.message);
  }
}

async function runTests() {
  console.log("=== TESTING OPENROUTER MODELS ===\n");
  
  // Test each model with each prompt type
  for (const model of MODELS_TO_TEST) {
    await testModel(model, TEST_PROMPTS.general, "general knowledge");
    await testModel(model, TEST_PROMPTS.code, "code generation");
    await testModel(model, TEST_PROMPTS.creative, "creative writing");
  }
  
  console.log("\n=== TESTS COMPLETED ===");
}

// Run the tests
runTests().catch(console.error);
