import axios from 'axios';

async function testLlmIntegration() {
  try {
    console.log('Testing LLM integration...');
    
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/orion/llm/test`;
    
    console.log(`Sending request to: ${apiUrl}`);
    
    const response = await axios.post(apiUrl, {
      prompt: 'What is the capital of France?',
      temperature: 0.7,
      max_tokens: 100
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\nResponse status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('\nLLM integration test successful!');
      console.log('Content:', response.data.content);
      console.log('Model used:', response.data.model);
    } else {
      console.error('\nLLM integration test failed!');
      console.error('Error:', response.data.error);
      console.error('Details:', response.data.details);
    }
    
  } catch (error: any) {
    console.error('Error testing LLM integration:');
    
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('Error message:', error.message);
    } else {
      console.error(error);
    }
    
    process.exit(1);
  }
}

// Run the test
testLlmIntegration().catch(console.error);