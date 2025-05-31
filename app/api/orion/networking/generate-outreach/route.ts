import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { DRAFT_COMMUNICATION_REQUEST_TYPE } from '@/lib/orion_config';

interface OutreachRequestBody {
  stakeholder: {
    name: string;
    role: string;
    company: string;
    linkedin_url?: string;
    email?: string;
    person_snippet?: string;
  };
  context?: string;
  profileData?: string;
  additionalInfo?: string;
  jobTitle?: string;
  companyResearch?: string;
}

// Enhanced system prompt for networking outreach
const SYSTEM_PROMPT_NETWORKING_OUTREACH = `
You are an expert networking strategist who specializes in crafting personalized, effective outreach messages that build meaningful professional connections. You understand the nuances of different platforms (LinkedIn vs. Email) and how to adapt your approach accordingly.

Your strengths include:
1. Creating authentic, non-generic messages that demonstrate genuine interest
2. Establishing credibility and relevance without appearing desperate
3. Finding subtle connection points between the sender and recipient
4. Balancing professionalism with approachability
5. Crafting messages that are concise yet impactful
6. Providing clear value propositions for why the connection would be mutually beneficial

You excel at helping professionals initiate conversations that lead to meaningful relationships rather than transactional exchanges.`;

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const requestBody: OutreachRequestBody = await request.json();
    const { stakeholder, context, profileData, additionalInfo, jobTitle, companyResearch } = requestBody;

    // Basic validation
    if (!stakeholder || !stakeholder.name || !stakeholder.company) {
      return NextResponse.json({ 
        success: false, 
        error: "Stakeholder information is required." 
      }, { status: 400 });
    }

    // Generate outreach email
    const emailDraft = await generateOutreachEmail(
      stakeholder,
      profileData || '',
      context || '',
      additionalInfo,
      jobTitle,
      companyResearch
    );

    return NextResponse.json({ 
      success: true, 
      emailDraft
    });

  } catch (error: any) {
    console.error('[OUTREACH_EMAIL_API_ERROR]', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate outreach email.',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * Generate an outreach email for a stakeholder with enhanced prompting
 */
async function generateOutreachEmail(
  stakeholder: OutreachRequestBody['stakeholder'],
  profileData: string,
  context: string,
  additionalInfo?: string,
  jobTitle?: string,
  companyResearch?: string
): Promise<string> {
  try {
    // Determine outreach purpose and approach
    const hasJobInterest = !!jobTitle;
    const hasEmail = !!stakeholder.email;
    const personInfo = stakeholder.person_snippet || '';
    
    // Extract potential conversation starters from available information
    let conversationStarters = '';
    if (personInfo) {
      conversationStarters = `Based on their profile: "${personInfo.substring(0, 200)}..."`;
    } else if (companyResearch) {
      conversationStarters = `Based on company research: "${companyResearch.substring(0, 200)}..."`;
    }

    const primaryContext = `
## NETWORKING OUTREACH TASK
Create personalized outreach messages to connect with ${stakeholder.name}, who is a ${stakeholder.role} at ${stakeholder.company}.

## CONTACT CONTEXT
- Name: ${stakeholder.name}
- Role: ${stakeholder.role}
- Company: ${stakeholder.company}
- LinkedIn URL: ${stakeholder.linkedin_url || 'Unknown'}
- Email Address: ${stakeholder.email || 'Unknown'}
${personInfo ? `- Profile Information: ${personInfo.substring(0, 300)}` : ''}

## OUTREACH PURPOSE
${hasJobInterest 
  ? `Primary purpose: Professional networking related to the ${jobTitle} position at their company.` 
  : 'Primary purpose: Building a professional connection for industry networking.'}
${additionalInfo ? `\nAdditional context: ${additionalInfo}` : ''}

## POTENTIAL CONVERSATION STARTERS
${conversationStarters || 'Focus on shared industry interests or their professional background.'}
${companyResearch ? `\nCompany Research: "${companyResearch.substring(0, 300)}..."` : ''}

## DELIVERABLES
Please create two distinct versions:

1. LinkedIn Connection Request:
   - Must be under 300 characters (LinkedIn's limit)
   - Personalized and specific (not generic)
   - Clear reason for connecting
   - Professional but conversational tone
   - No direct ask for job help in initial message

2. Email Outreach:
   - Brief but more detailed than LinkedIn (4-6 sentences)
   - Professional with a warm tone
   - Specific reference to their role or company
   - Clear value proposition for why they should respond
   - Concrete but small next step/call to action
   ${hasJobInterest ? '- Subtle reference to your interest in opportunities at their company' : ''}
   - Proper greeting and sign-off

Format your response with clear "LinkedIn Connection Request:" and "Email Outreach:" headers.
`;

    // Call the LLM API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/orion/llm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: DRAFT_COMMUNICATION_REQUEST_TYPE,
        primaryContext,
        profileContext: profileData,
        system_prompt_override: SYSTEM_PROMPT_NETWORKING_OUTREACH,
        temperature: 0.7,
        maxTokens: 1000
      })
    });

    const llmResponseData = await response.json();

    if (!llmResponseData.success || !llmResponseData.content) {
      throw new Error(llmResponseData.error || "LLM failed to generate outreach email.");
    }

    return llmResponseData.content;
  } catch (error) {
    console.error("Error generating outreach email:", error);
    return `Failed to generate outreach email for ${stakeholder.name}. Please try again.`;
  }
}