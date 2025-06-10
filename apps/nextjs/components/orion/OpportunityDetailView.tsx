'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Button, Tabs, TabsContent, TabsList, TabsTrigger, Badge } from '@repo/ui';
import {
  FileText,
  Search,
  FileEdit,
  Mail,
  Users,
  Calendar,
  ExternalLink
} from 'lucide-react';

interface OpportunityDetailViewProps {
  opportunity: {
    id: string;
    title: string;
    company: string;
    status: string;
    jdText?: string;
    jdAnalysis?: string;
    companyUrl?: string;
    tailoredCV?: string;
    coverLetter?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export function OpportunityDetailView({ opportunity }: OpportunityDetailViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{opportunity.title}</h1>
          <p className="text-gray-500">{opportunity.company}</p>
        </div>
        <Badge variant={opportunity.status === 'Applied' ? 'success' : 'default'}>
          {opportunity.status}
        </Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analyze">Analyze</TabsTrigger>
          <TabsTrigger value="cv">CV</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
          <TabsTrigger value="networking">Networking</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">Created: {new Date(opportunity.createdAt).toLocaleDateString()}</span>
                    </div>
                    {opportunity.companyUrl && (
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <a
                          href={opportunity.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Company Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Application Progress</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Search className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        JD Analysis: {opportunity.jdAnalysis ? 'Complete' : 'Not started'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        CV Tailoring: {opportunity.tailoredCV ? 'Complete' : 'Not started'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FileEdit className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        Cover Letter: {opportunity.coverLetter ? 'Complete' : 'Not started'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Job Description</h3>
                <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">
                    {opportunity.jdText || 'No job description available.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link href={`/opportunity/${opportunity.id}/analyze`}>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Analyze JD
                  </Button>
                </Link>
                <Link href={`/opportunity/${opportunity.id}/cv-tailoring`}>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Tailor CV
                  </Button>
                </Link>
                <Link href={`/opportunity/${opportunity.id}/application`}>
                  <Button variant="outline" size="sm">
                    <FileEdit className="h-4 w-4 mr-2" />
                    Draft Application
                  </Button>
                </Link>
                <Link href={`/opportunity/${opportunity.id}/networking`}>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Find Contacts
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyze">
          <Card>
            <CardHeader>
              <CardTitle>Job Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p>Analyze the job description to identify key requirements, skills, and company information.</p>
              </div>

              <Link href={`/opportunity/${opportunity.id}/analyze`}>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Go to Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cv">
          <Card>
            <CardHeader>
              <CardTitle>CV Tailoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p>Tailor your CV to match the job requirements using AI-powered component selection and rephrasing.</p>
              </div>

              <Link href={`/opportunity/${opportunity.id}/cv-tailoring`}>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Go to CV Tailoring Studio
                </Button>
              </Link>

              {opportunity.tailoredCV && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Tailored CV Preview</h3>
                  <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
                    <p className="text-sm whitespace-pre-wrap">
                      {opportunity.tailoredCV.substring(0, 300)}...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="application">
          <Card>
            <CardHeader>
              <CardTitle>Application Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p>Draft cover letters and application emails tailored to the job and company.</p>
              </div>

              <Link href={`/opportunity/${opportunity.id}/application`}>
                <Button>
                  <Mail className="h-4 w-4 mr-2" />
                  Draft Application
                </Button>
              </Link>

              {opportunity.coverLetter && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Cover Letter Preview</h3>
                  <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
                    <p className="text-sm whitespace-pre-wrap">
                      {opportunity.coverLetter.substring(0, 300)}...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="networking">
          <Card>
            <CardHeader>
              <CardTitle>Networking & Outreach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p>Find and connect with potential stakeholders at the company.</p>
              </div>

              <Link href={`/opportunity/${opportunity.id}/networking`}>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Find Contacts
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle>Application Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p>Track the status of your application and schedule follow-ups.</p>
              </div>

              <Link href={`/opportunity/${opportunity.id}/tracking`}>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Track Application
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
