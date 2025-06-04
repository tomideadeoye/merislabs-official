import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // This is a simplified implementation
    // In a real implementation, this would fetch the user's profile from a database

    // Mock profile data for demonstration purposes
    const profile = {
      name: "Tomide Adeoye",
      backgroundSummary: "Experienced software engineer with a focus on web development and a passion for building user-friendly applications. Strong background in JavaScript, TypeScript, React, and Node.js.",
      keySkills: [
        "JavaScript/TypeScript",
        "React/Next.js",
        "Node.js",
        "API Development",
        "Database Design",
        "System Architecture",
        "Project Management"
      ],
      goals: "To secure a senior software engineering role where I can leverage my technical expertise and leadership skills to build impactful products.",
      location: "London, UK",
      values: [
        "Innovation",
        "Collaboration",
        "Continuous Learning",
        "Work-Life Balance",
        "Quality"
      ],
      experience: [
        {
          title: "Senior Software Engineer",
          company: "Tech Solutions Inc.",
          duration: "2020-Present",
          description: "Led development of multiple web applications using React and Node.js. Improved system performance by 40% through architecture optimization."
        },
        {
          title: "Software Developer",
          company: "Digital Innovations Ltd.",
          duration: "2017-2020",
          description: "Developed and maintained RESTful APIs and frontend components for e-commerce platforms."
        }
      ],
      education: [
        {
          degree: "BSc Computer Science",
          institution: "University of Technology",
          year: "2017"
        }
      ]
    };

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch profile' }, { status: 500 });
  }
}
