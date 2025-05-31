import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { DRAFT_APPLICATION_REQUEST_TYPE } from '@/lib/orion_config';

interface StakeholderSearchRequestBody {
  company: string;
  roles: string[];
  jobTitle?: string;
  profileData?: string;
  webContext?: string;
}

interface Stakeholder {
  name: string;
  role: string;
  company: string;
  email?: string;
  linkedIn?: string;
}

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const requestBody: StakeholderSearchRequestBody = await request.json();
    const { company, roles, jobTitle, profileData, webContext } = requestBody;

    // Basic validation
    if (!company || !roles || roles.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Company name and roles are required." 
      }, { status: 400 });
    }

    // Mock stakeholder search for now - in a real implementation, this would use an API or web scraping
    // This simulates the find_potential_stakeholders_async function from the Python code
    const stakeholders: Stakeholder[] = await findPotentialStakeholders(company, roles);
    
    // Generate outreach drafts for each stakeholder
    const outreachDrafts = await Promise.all(
      stakeholders.map(async (stakeholder) => {
        const draft = await generateOutreachDraft(
          stakeholder,
          company,
          jobTitle || '',
          profileData || '',
          webContext || ''
        );
        
        return {
          stakeholder,
          draft
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      stakeholders: outreachDrafts
    });

  } catch (error: any) {
    console.error('[STAKEHOLDER_SEARCH_API_ERROR]', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to search for stakeholders.',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * Find potential stakeholders for a company
 * This is a mock implementation - in a real implementation, this would use an API or web scraping
 */
async function findPotentialStakeholders(company: string, roles: string[]): Promise<Stakeholder[]> {
  // Mock data - in a real implementation, this would use an API or web scraping
  const mockStakeholders: Stakeholder[] = [
    {
      name: `HR Manager at ${company}`,
      role: 'HR Manager',
      company: company,
      linkedIn: `https://linkedin.com/in/hr-manager-${company.toLowerCase().replace(/\\s+/g, '-')}`
    },
    {
      name: `Hiring Manager at ${company}`,
      role: 'Hiring Manager',
      company: company,
      email: `hiring@${company.toLowerCase().replace(/\\s+/g, '')}.com`
    }
  ];
  
  // Filter by roles if specified
  if (roles.length > 0) {
    return mockStakeholders.filter(s => 
      roles.some(role => 
        s.role.toLowerCase().includes(role.toLowerCase())
      )
    );
  }
  
  return mockStakeholders;
}

/**
 * Generate an outreach draft for a stakeholder
 */
async function generateOutreachDraft(
  stakeholder: Stakeholder,
  company: string,
  jobTitle: string,
  profileData: string,
  webContext: string
): Promise<string> {
  const outreachPrompt = `
Draft a concise and professional LinkedIn connection request OR a short introductory email to ${stakeholder.name}, ${stakeholder.role} at ${company}.
My goal is to learn more about their team, the company culture, and express my interest in roles like '${jobTitle}' or related strategic positions.
Reference my background (Law + Software Dev + Tech/Management PG) and my interest in contributing to their work, potentially mentioning something specific from the company research if applicable.
Keep it brief (3-4 sentences for LinkedIn, slightly longer for email if appropriate) and focused on initiating a conversation.

Company Research Context (if available):
${webContext.substring(0, 1000)}

Output two versions if possible: one for LinkedIn, one for Email. Clearly label them.
`;

  try {
    // Call the LLM API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/orion/llm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: DRAFT_APPLICATION_REQUEST_TYPE,
        primaryContext: outreachPrompt,
        profile_context: profileData,
        temperature: 0.7,
        maxTokens: 800
      })
    });

    const llmResponseData = await response.json();

    if (!llmResponseData.success || !llmResponseData.content) {
      throw new Error(llmResponseData.error || "LLM failed to generate outreach draft.");
    }

    return llmResponseData.content;
  } catch (error) {
    console.error("Error generating outreach draft:", error);
    return `Failed to generate outreach draft for ${stakeholder.name}. Please try again.`;
  }
}