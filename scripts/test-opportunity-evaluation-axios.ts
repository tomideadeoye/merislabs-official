import type { Opportunity, OpportunityStatus, OpportunityType } from '../types/opportunity';
import axios from 'axios';

// Test opportunities
const opportunities: Array<{
  title: string;
  description: string;
  type: OpportunityType;
  url?: string;
}> = [
  {
    title: "Senior Software Engineer",
    description: `Backend systems role focused on Go and Python microservices. Building scalable cloud infrastructure.

Key Responsibilities:
- Design and implement scalable microservices using Go and Python
- Build and maintain cloud infrastructure across multiple providers
- Optimize system performance and reliability
- Collaborate with cross-functional teams to deliver solutions
- Mentor junior engineers and contribute to architecture decisions

Requirements:
- Strong experience with Go programming language
- Experience with Python and microservices architecture
- Deep understanding of cloud platforms (AWS, GCP, Azure)
- Knowledge of containerization and orchestration (Docker, Kubernetes)
- Track record of building scalable distributed systems`,
    type: "job",
    url: "https://cloudscale.tech/careers"
  },
  {
    title: "MBA in Technology Management",
    description: `A comprehensive MBA program focused on technology management and digital transformation.

Program Highlights:
- Technology Strategy and Innovation
- Digital Business Models
- Data-Driven Decision Making
- Leadership in Tech Organizations
- Entrepreneurship and Venture Capital

Requirements:
- Bachelor's degree with 3.0+ GPA
- 3+ years professional experience
- GMAT/GRE scores
- Strong analytical and leadership skills`,
    type: "education_program",
    url: "https://business-school.edu/mba-tech"
  },
  {
    title: "Open Source AI Framework Collaboration",
    description: `Contributing to an innovative open-source AI framework focused on enterprise applications.

Project Scope:
- Developing enterprise-ready AI components
- Improving documentation and developer experience
- Implementing performance optimizations
- Building integration examples
- Contributing to architecture decisions

Areas of Focus:
- Enterprise AI patterns
- System architecture
- Documentation
- Community engagement
- Performance optimization`,
    type: "project_collaboration",
    url: "https://github.com/enterprise-ai-framework"
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
      console.log(`\nSending request to: ${baseUrl}/api/orion/opportunity/evaluate`);

      try {
        // 1. Test opportunity evaluation
        const evalResponse = await axiosInstance.post('/api/orion/opportunity/evaluate', opportunity);
        const evalData = evalResponse.data;

        // Validate evaluation response structure
        if (!evalData.success || !evalData.evaluation) {
          throw new Error(`Invalid evaluation response: ${JSON.stringify(evalData)}`);
        }

        const evaluation = evalData.evaluation;

        // Log evaluation results
        console.log('\nEvaluation Results:');
        console.log('Fit Score:', evaluation.fitScorePercentage + '%');
        console.log('Recommendation:', evaluation.recommendation);
        console.log('Alignment Highlights:', evaluation.alignmentHighlights);
        console.log('Gap Analysis:', evaluation.gapAnalysis);
        console.log('Risk/Reward Analysis:', evaluation.riskRewardAnalysis);
        console.log('Suggested Next Steps:', evaluation.suggestedNextSteps);

        // Validate evaluation data
        if (
          typeof evaluation.fitScorePercentage !== 'number' ||
          !Array.isArray(evaluation.alignmentHighlights) ||
          !Array.isArray(evaluation.gapAnalysis) ||
          !Array.isArray(evaluation.suggestedNextSteps) ||
          typeof evaluation.recommendation !== 'string' ||
          typeof evaluation.reasoning !== 'string'
        ) {
          throw new Error('Evaluation response missing required fields or has invalid types');
        }

        // 2. Create opportunity with evaluation
        const createResponse = await axiosInstance.post('/api/orion/opportunity/create', {
          ...opportunity,
          status: 'evaluating' as OpportunityStatus,
          priority: 'medium',
          evaluationOutput: evaluation
        });

        console.log('\nCreated opportunity:', createResponse.data.opportunity.id);

        // Brief pause between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Request failed:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
        }
        throw error;
      }
    }

    console.log('\nAll tests completed successfully!');
  } catch (error: any) {
    console.error('Error testing opportunity evaluation:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    process.exit(1);
  }
}

// Run the test
console.log('Starting opportunity evaluation test...');
testOpportunityEvaluation().catch(error => {
  console.error('Unhandled error in test:', error);
  process.exit(1);
});
