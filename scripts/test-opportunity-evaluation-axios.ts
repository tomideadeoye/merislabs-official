import type { OpportunityStatus, OpportunityType, OpportunityDetails, EvaluationOutput } from '../types/opportunity';
import axios from 'axios';

// Interface for API responses
interface ApiResponse<T> {
  success: boolean;
  error?: string;
  evaluation?: T;
  opportunity?: {
    id: string;
    [key: string]: any;
  };
}

// Test opportunities
const opportunities: Array<OpportunityDetails> = [
  {
    title: "Senior Software Engineer",
    companyOrInstitution: "Google",
    descriptionSummary: "Senior Software Engineer position focusing on AI development",
    type: "job",
    dateIdentified: "2025-05-15",
    url: "https://careers.google.com"
  },
  {
    title: "MBA in Technology Management",
    companyOrInstitution: "Stanford University",
    descriptionSummary: "Comprehensive MBA program focused on technology management",
    type: "education_program",
    dateIdentified: "2025-05-15",
    url: "https://stanford.edu/mba-tech"
  },
  {
    title: "Open Source AI Collaboration",
    companyOrInstitution: "AI Foundation",
    descriptionSummary: "Contributing to open-source AI framework development",
    type: "project_collaboration",
    dateIdentified: "2025-05-15",
    url: "https://github.com/ai-foundation"
  }
];

async function testOpportunityEvaluation() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Authorization': 'Bearer mock-test-token',
        'Content-Type': 'application/json'
      }
    });

    // Test each opportunity
    for (const opportunity of opportunities) {
      console.log(`\nTesting opportunity: ${opportunity.title}`);

      try {
        // 1. Test evaluation endpoint
        const evalResponse = await axiosInstance.post<ApiResponse<EvaluationOutput>>(
          '/api/orion/opportunity/evaluate',
          opportunity
        );

        if (!evalResponse.data.success || !evalResponse.data.evaluation) {
          throw new Error('Evaluation failed: ' + JSON.stringify(evalResponse.data));
        }

        const { evaluation } = evalResponse.data;
        console.log('Evaluation Results:', evaluation);

        // 2. Test opportunity creation
        const createResponse = await axiosInstance.post('/api/orion/opportunity/create', {
          ...opportunity,
          status: 'evaluating',
          evaluationOutput: evaluation
        });

        if (!createResponse.data.success) {
          throw new Error('Creation failed: ' + JSON.stringify(createResponse.data));
        }

        console.log('Successfully created opportunity:', createResponse.data.opportunity?.id);

      } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
      }
    }

    console.log('\nAll tests passed successfully');
  } catch (error) {
    console.error('Critical error:', error);
    process.exit(1);
  }
}

testOpportunityEvaluation();
