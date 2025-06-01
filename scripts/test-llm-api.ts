import axios from 'axios';

async function testLlmApi() {
  try {
    console.log('Testing LLM API with actual provider implementation...');
    
    // Test parameters for different providers
    const testProviders = [
      { provider: 'azure', model: 'gpt-4.1-mini' },
      { provider: 'groq', model: 'groq/llama3-70b-8192' },
      { provider: 'gemini', model: 'gemini/gemini-1.5-pro-latest' },
      { provider: 'mistral', model: 'mistral/mistral-large-latest' }
    ];
    
    const prompt = 'Explain the concept of vector databases in 3 sentences.';
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    // Test each provider
    for (const { provider, model } of testProviders) {
      console.log(`\n----- Testing ${provider.toUpperCase()} with model: ${model} -----`);
      
      try {
        const response = await axios.post(`${baseUrl}/api/orion/llm/test`, {
          prompt,
          model,
          temperature: 0.7,
          max_tokens: 200
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = response.data as any;
        
        if (data.success) {
          console.log('✅ Test successful!');
          console.log('Model used:', data.model);
          console.log('Response content:', data.content);
        } else {
          console.error('❌ Test failed!');
          console.error('Error:', data.error);
          console.error('Details:', data.details);
        }
      } catch (error: any) {
        console.error(`❌ Error testing ${provider}:`, error.response?.data || error.message);
      }
    }
    
    console.log('\nAll tests completed!');
    
  } catch (error: any) {
    console.error('Error in test script:');
    console.error(error);
  }
}

// Run the test
testLlmApi().catch(console.error);