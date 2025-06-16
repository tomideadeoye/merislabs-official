'use client';

import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
} from '@/ui/components/ui';
import { FileText, Search, FileEdit, Mail, Users, Calendar, ExternalLink } from 'lucide-react';
import { OrionOpportunity, OpportunityStatus, EvaluationOutput } from '@repo/shared/types/orion';

interface OpportunityDetailViewProps {
  OrionOpportunity: OrionOpportunity;
  evaluation?: EvaluationOutput; // Keep this if it's needed
  onEdit?: () => void;
  onDelete?: () => void;
  opportunityId: string;
}

export function OpportunityDetailView({
  OrionOpportunity,
  evaluation,
  onEdit,
  onDelete,
  opportunityId,
}: OpportunityDetailViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{OrionOpportunity.title}</h1>
          <p className="text-gray-500">{OrionOpportunity.company}</p>
        </div>
        <Badge variant={OrionOpportunity.status === OpportunityStatus.APPLIED ? 'success' : 'default'}>
          {OrionOpportunity.status || 'Unknown'}
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
              <CardTitle>OrionOpportunity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        Created:{' '}
                        {OrionOpportunity.createdAt ? new Date(OrionOpportunity.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    {OrionOpportunity.url && (
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <a
                          href={OrionOpportunity.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Link
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
                        JD Analysis: {OrionOpportunity.webResearchContext ? 'Complete' : 'Not started'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        CV Tailoring: {OrionOpportunity.tailoredCv ? 'Complete' : 'Not started'}
                      </span>
                    </div>
                    {/* No direct equivalent for coverLetter in OrionOpportunity. If needed, a new field should be added to the shared type. */}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Job Description</h3>
                <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">
                    {OrionOpportunity.content || 'No job description available.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link href={`/admin/opportunity-pipeline/${OrionOpportunity.id}/analyze`}>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Analyze JD
                  </Button>
                </Link>
                <Link href={`/admin/opportunity-pipeline/${OrionOpportunity.id}/cv-tailoring`}>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Tailor CV
                  </Button>
                </Link>
                <Link href={`/admin/opportunity-pipeline/${OrionOpportunity.id}/application`}>
                  <Button variant="outline" size="sm">
                    <FileEdit className="h-4 w-4 mr-2" />
                    Draft Application
                  </Button>
                </Link>
                <Link href={`/admin/opportunity-pipeline/${OrionOpportunity.id}/networking`}>
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

              <Link href={`/admin/opportunity-pipeline/${OrionOpportunity.id}/analyze`}>
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

              <Link href={`/admin/opportunity-pipeline/${OrionOpportunity.id}/cv-tailoring`}>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Go to CV Tailoring Studio
                </Button>
              </Link>

              {OrionOpportunity.tailoredCv && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Tailored CV Preview</h3>
                  <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
                    <p className="text-sm whitespace-pre-wrap">{OrionOpportunity.tailoredCv.substring(0, 300)}...</p>
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

              <Link href={`/admin/opportunity-pipeline/${OrionOpportunity.id}/application`}>
                <Button>
                  <Mail className="h-4 w-4 mr-2" />
                  Draft Application
                </Button>
              </Link>

              {/* No direct equivalent for coverLetter in OrionOpportunity. If needed, a new field should be added to the shared type. */}
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

              <Link href={`/admin/opportunity-pipeline/${OrionOpportunity.id}/networking`}>
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
                <p>Track the progress of your application, interviews, and follow-ups.</p>
              </div>

              <Link href={`/admin/opportunity-pipeline/${OrionOpportunity.id}/tracking`}>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Go to Tracking
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
