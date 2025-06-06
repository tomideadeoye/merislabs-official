import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { DRAFT_COMMUNICATION_REQUEST_TYPE } from '@/lib/orion_config';
import { generateLLMResponse } from '@/lib/orion_llm';

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

Focus on establishing genuine connection, demonstrating credible interest, and proposing a clear, low-friction next step (e.g., a brief chat). Messages should be concise and tailored to the platform.

For LinkedIn messages:
- Keep under 300 characters (LinkedIn's limit)
- Be specific about why you're connecting with this particular person
- Reference their work, role, or company specifically
- Avoid generic templates or obvious mass outreach language

For email outreach:
- Be brief but substantive (4-6 sentences)
- Include a specific reference to the recipient's role or recent work if available
- Clearly articulate why this connection would be valuable to both parties
- End with a specific, low-commitment call to action

You excel at helping professionals initiate conversations that lead to meaningful relationships rather than transactional exchanges.`;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
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
    const hasJobInterest = !!jobTitle;
    const hasEmail = !!stakeholder.email;
    const personInfo = stakeholder.person_snippet || '';

    // Build a detailed context for the LLM
    let conversationStarters = '';
    if (personInfo) {
      conversationStarters = `Based on their profile: "${personInfo.substring(0, 200)}..."`;
    } else if (companyResearch) {
      conversationStarters = `Based on company research: "${companyResearch.substring(0, 200)}..."`;
    }

    let platform = hasEmail ? 'Email' : 'LinkedIn';
    let intro = `You are drafting a ${platform} outreach message to connect with ${stakeholder.name}, a ${stakeholder.role} at ${stakeholder.company}.`;
    if (stakeholder.linkedin_url) {
      intro += ` Their LinkedIn: ${stakeholder.linkedin_url}.`;
    }
    if (stakeholder.email) {
      intro += ` Their email: ${stakeholder.email}.`;
    }
    if (hasJobInterest && jobTitle) {
      intro += ` The sender is interested in the role: ${jobTitle}.`;
    }

    let contextBlock = '';
    if (context) contextBlock += `\nContext: ${context}`;
    if (profileData) contextBlock += `\nSender Profile: ${profileData}`;
    if (additionalInfo) contextBlock += `\nAdditional Info: ${additionalInfo}`;
    if (companyResearch) contextBlock += `\nCompany Research: ${companyResearch}`;
    if (conversationStarters) contextBlock += `\n${conversationStarters}`;

    const primaryContext = `${intro}\n${contextBlock}\n\nDraft a concise, authentic, and effective outreach message for this scenario. Follow the system prompt's best practices for the chosen platform.`;

    // Call the LLM
    const result = await generateLLMResponse(
      'NETWORKING_OUTREACH',
      primaryContext,
      {
        profileContext: profileData,
        systemContext: SYSTEM_PROMPT_NETWORKING_OUTREACH,
        model: undefined, // Use default for this request type
        temperature: 0.7,
        maxTokens: hasEmail ? 400 : 120 // LinkedIn is shorter
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
}

// TODO: Add/expand tests for this endpoint in tests/e2e.test.ts
