/**
 * Test script for OpenRouter models
 */

const axios = require('axios');

// Models to test
const MODELS_TO_TEST = [
  "openrouter/google/gemini-2.0-flash-exp:free",
  "openrouter/deepseek/deepseek-chat-v3-0324:free",
  "openrouter/deepseek/deepseek-coder-v2-0324:free"
];

// Test prompt
const TEST_PROMPT = "Explain the concept of vector databases in 3 sentences.";

async function testModel(model) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Testing ${model}`);
  
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await axios.post(`${baseUrl}/api/orion/llm/test`, {
      prompt: TEST_PROMPT,
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
  
  // Test each model
  for (const model of MODELS_TO_TEST) {
    await testModel(model);
  }
  
  console.log("\n=== TESTS COMPLETED ===");
}

// Run the tests
runTests().catch(console.error);
