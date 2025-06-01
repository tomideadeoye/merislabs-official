import type { Opportunity, OpportunityStatus, OpportunityType } from '../types/opportunity';

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
    // Using mock auth session for testing
    const mockSession = {
      user: { id: 'test-user', name: 'Test User', email: 'test@example.com' }
    };

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Test each opportunity
    for (const opportunity of opportunities) {
      console.log(`\nTesting opportunity: ${opportunity.title}`);

      console.log(`\nSending request to: ${baseUrl}/api/orion/opportunity/evaluate`);

      // 1. Test opportunity evaluation
      const evalResponse = await Promise.race([
        fetch(`${baseUrl}/api/orion/opportunity/evaluate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer mock-test-token`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(opportunity)
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout after 10s')), 10000)
        )
      ]) as Response;

      if (!evalResponse.ok) {
        throw new Error(`Evaluation failed with status ${evalResponse.status}: ${await evalResponse.text()}`);
      }

      const evalData = await evalResponse.json();

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
      const createResponse = await fetch(`${baseUrl}/api/orion/opportunity/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer mock-test-token`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...opportunity,
          status: 'evaluating' as OpportunityStatus,
          priority: 'medium',
          evaluationOutput: evaluation
        })
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create opportunity: ${await createResponse.text()}`);
      }

      const createData = await createResponse.json();
      console.log('\nCreated opportunity:', createData.opportunity.id);

      // Brief pause between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\nAll tests completed successfully!');
  } catch (error: any) {
    console.error('Error testing opportunity evaluation:', {
      message: error.message,
      status: error.status,
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
