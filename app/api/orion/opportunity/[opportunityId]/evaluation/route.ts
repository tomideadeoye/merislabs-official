import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/database';
import { EvaluationOutput } from '@/types/opportunity';

export async function GET(
  request: NextRequest,
  { params }: { params: { opportunityId: string } }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { opportunityId } = params;
    
    // Get the opportunity to find the related evaluation ID
    const getOpportunityStmt = db.prepare(`
      SELECT relatedEvaluationId FROM opportunities WHERE id = ?
    `);
    
    const opportunity = getOpportunityStmt.get(opportunityId);
    
    if (!opportunity || !opportunity.relatedEvaluationId) {
      return NextResponse.json({ 
        success: false, 
        error: 'No evaluation found for this opportunity.' 
      }, { status: 404 });
    }
    
    // For now, we'll return mock data
    // In a real implementation, you would fetch the evaluation from your memory store
    // using the relatedEvaluationId
    
    const mockEvaluation: EvaluationOutput = {
      fitScorePercentage: 85,
      recommendation: "This opportunity is a strong match for your skills and career goals. Consider applying with a tailored application highlighting your system architecture experience.",
      reasoning: "The role aligns well with your technical background and offers growth in areas you've expressed interest in.",
      alignmentHighlights: [
        "Strong match for your backend development experience",
        "Company culture emphasizes collaboration and innovation, which aligns with your values",
        "Role offers opportunity to work with cloud technologies you're familiar with",
        "Compensation range meets your expectations"
      ],
      gapAnalysis: [
        "Role requires Go programming language, which isn't in your current skill set",
        "Consider highlighting your ability to quickly learn new programming languages"
      ],
      riskRewardAnalysis: {
        potentialRewards: "Growth opportunity in cloud infrastructure, which aligns with your career goals",
        potentialRisks: "New technology stack may require significant ramp-up time",
        careerImpact: "Positive step toward your goal of becoming a technical architect"
      },
      suggestedNextSteps: [
        "Tailor your resume to highlight relevant backend and cloud experience",
        "Research the company's products more deeply",
        "Prepare examples of your system design experience for interviews",
        "Connect with current employees to learn more about the company culture"
      ]
    };
    
    return NextResponse.json({ 
      success: true, 
      evaluation: mockEvaluation,
      evaluationId: opportunity.relatedEvaluationId
    });
    
  } catch (error: any) {
    console.error('[OPPORTUNITY_EVALUATION_GET_API_ERROR]', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch evaluation.', 
      details: error.message 
    }, { status: 500 });
  }
}