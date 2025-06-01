// Import types
import { type OpportunityDetails, type EvaluationOutput } from '../types/opportunity.d';
import { auth } from '../auth';

async function testOpportunityEvaluation() {
  // Test different opportunity types
  const opportunities: OpportunityDetails[] = [
    {
      // Test case 1: Software engineering role
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
      // Test case 2: Project collaboration
      title: "Open Source ML Infrastructure Project",
      description: `Seeking contributors for an open source machine learning infrastructure project.

Project Goals:
- Build reusable components for ML model deployment
- Develop monitoring and observability tools
- Create documentation and examples
- Focus on making ML deployment more accessible

Ideal Contributors:
- Interested in ML operations and infrastructure
- Experience with Python, Docker, or Kubernetes
- Passion for open source and documentation
- Any level of experience welcome`,
      type: "project",
      url: "https://github.com/ml-infra-project"
    }
  ];
  // Get mocked auth session
  const session = await auth();
  const cloudScaleOpportunity: OpportunityDetails = {
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
  };

  try {
    // Get mock auth session token
    if (!session?.user) {
      throw new Error('Failed to get authenticated session');
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    // Test each opportunity
    for (const opportunity of opportunities) {
      console.log(`\nTesting opportunity: ${opportunity.title}`);
      
      // 1. Test opportunity evaluation
      const evalResponse = await fetch(`${baseUrl}/api/orion/opportunity/evaluate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer mock-test-token`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(opportunity)
      });

      if (!evalResponse.ok) {
        throw new Error(`Evaluation failed with status ${evalResponse.status}: ${await evalResponse.text()}`);
      }

      const evalData = await evalResponse.json();
      
      // Validate evaluation response structure
      if (!evalData.success || !evalData.evaluation) {
        throw new Error(`Invalid evaluation response: ${JSON.stringify(evalData)}`);
      }

      const evaluation = evalData.evaluation as EvaluationOutput;
      
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
          status: 'evaluating',
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
