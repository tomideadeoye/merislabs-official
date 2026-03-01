// Check Vercel deployments using Vercel SDK
import { Vercel } from '@vercel/sdk';

async function checkDeployments() {
  try {
    // Initialize Vercel SDK
    const vercel = new Vercel({
      bearerToken: process.env.VERCEL_TOKEN,
    });

    // Get project deployments
    console.log('🔍 Checking Vercel deployments...\n');

    // Note: We need the project ID to get deployments
    // For now, let's check what we can access
    console.log('Vercel SDK initialized successfully');
    console.log('Note: To check specific deployments, you need:');
    console.log('1. VERCEL_TOKEN environment variable');
    console.log('2. Project ID or name');
    console.log('\nRun: vercel link to connect this project');
    
  } catch (error) {
    console.error('Error checking deployments:', error.message);
  }
}

checkDeployments();
