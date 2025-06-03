import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

// Default stakeholder roles for networking
const DEFAULT_STAKEHOLDER_ROLES = [
  "CEO",
  "Founder",
  "Hiring Manager",
  "Technical Lead",
  "Engineering Manager",
  "Product Manager",
  "Director",
  "VP Engineering",
  "VP Product",
  "CTO",
  "COO",
  "Recruiter",
  "HR Manager",
];

interface StakeholderSearchRequestBody {
  query: string;
  roles?: string[];
}

interface Stakeholder {
  name: string;
  role: string;
  company: string;
  company_name?: string;
  company_description?: string;
  company_website?: string;
  linkedin_url?: string;
  email?: string;
  person_snippet?: string;
  title?: string;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const requestBody: StakeholderSearchRequestBody = await request.json();
    const { query, roles } = requestBody;

    // Basic validation
    if (!query) {
      return NextResponse.json({
        success: false,
        error: "Search query is required."
      }, { status: 400 });
    }

    // Find stakeholders
    const stakeholders = await findPotentialStakeholders(query, roles);

    return NextResponse.json({
      success: true,
      stakeholders
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
 * This is a simplified implementation based on the Python version
 */
async function findPotentialStakeholders(
  query: string,
  roles?: string[]
): Promise<Stakeholder[]> {
  // Get company info
  const companyInfo = await getCompanyInfo(query);

  if (!companyInfo) {
    return [];
  }

  // Use provided roles or default roles
  const searchRoles = roles && roles.length > 0 ? roles : DEFAULT_STAKEHOLDER_ROLES;

  // Search for stakeholders for each role
  const stakeholdersPromises = searchRoles.map(role =>
    searchLinkedInProfiles(query, role)
  );

  const stakeholdersArrays = await Promise.all(stakeholdersPromises);

  // Flatten and enrich with company info
  let stakeholders = stakeholdersArrays.flat().map(stakeholder => ({
    ...stakeholder,
    company_name: companyInfo.name,
    company_description: companyInfo.description,
    company_website: companyInfo.website
  }));

  // Remove duplicates based on LinkedIn URL
  const seen = new Set();
  stakeholders = stakeholders.filter(s => {
    if (!s.linkedin_url || seen.has(s.linkedin_url)) {
      return false;
    }
    seen.add(s.linkedin_url);
    return true;
  });

  // Generate potential email addresses
  stakeholders = stakeholders.map(stakeholder => {
    const email = generateEmail(stakeholder);
    return { ...stakeholder, email };
  });

  return stakeholders;
}

/**
 * Get company information
 * This is a mock implementation - in a real implementation, this would use an API or web scraping
 */
async function getCompanyInfo(company: string): Promise<{
  name: string;
  description: string;
  website: string;
} | null> {
  // In a real implementation, this would use web scraping or an API
  // For now, return mock data
  return {
    name: company,
    description: `${company} is a leading company in its industry.`,
    website: `https://www.${company.toLowerCase().replace(/\\s+/g, '')}.com`
  };
}

/**
 * Search for LinkedIn profiles
 * This is a mock implementation - in a real implementation, this would use an API or web scraping
 */
async function searchLinkedInProfiles(company: string, role: string): Promise<Stakeholder[]> {
  // In a real implementation, this would use web scraping or an API
  // For now, return mock data
  return [
    {
      name: `${role} at ${company}`,
      role: role,
      company: company,
      linkedin_url: `https://linkedin.com/in/${role.toLowerCase().replace(/\\s+/g, '-')}-${company.toLowerCase().replace(/\\s+/g, '-')}`,
      person_snippet: `Experienced ${role} at ${company} with a track record of success.`,
      title: `${role} at ${company} | LinkedIn`
    }
  ];
}

/**
 * Generate a potential email address for a stakeholder
 */
function generateEmail(stakeholder: Stakeholder): string | undefined {
  try {
    if (!stakeholder.name || !stakeholder.company_website) {
      return undefined;
    }

    const name = stakeholder.name.toLowerCase().split(' ');
    const domain = stakeholder.company_website.split('//')[1]?.split('/')[0].replace('www.', '');

    if (!domain || name.length < 2) {
      return undefined;
    }

    // Common email patterns
    return `${name[0]}.${name[name.length - 1]}@${domain}`;
  } catch (error) {
    console.error('Error generating email:', error);
    return undefined;
  }
}
