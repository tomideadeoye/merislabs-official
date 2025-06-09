'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  FileEdit,
  Search,
  Users,
  Calendar,
  ExternalLink,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Opportunity, EvaluationOutput } from '@shared/types/opportunity';
import { StakeholderOutreach } from './StakeholderOutreach';

interface OpportunityDetailViewProps {
  opportunity: Opportunity;
  evaluation?: EvaluationOutput;
  opportunityId?: string;
}

export function OpportunityDetailView({ opportunity, evaluation, opportunityId }: OpportunityDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{opportunity.title}</h1>
          <p className="text-gray-500">{opportunity.company}</p>
        </div>
        <Badge variant={opportunity.status === 'applied' ? 'success' : 'default'}>
          {opportunity.status}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="overview">
        <TabsList className="bg-gray-800 border-gray-700 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
          <TabsTrigger value="networking">Networking</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {opportunity.content ? (
                    <div dangerouslySetInnerHTML={{ __html: opportunity.content }} />
                  ) : (
                    <p className="text-gray-500">No description available.</p>
                  )}
                </div>

                {opportunity.url && (
                  <div className="mt-4">
                    <a
                      href={opportunity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 flex items-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Original Posting
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {opportunity.deadline && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Deadline</p>
                        <p className="text-sm text-gray-500">{opportunity.deadline}</p>
                      </div>
                    </div>
                  )}

                  {opportunity.location && (
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-gray-500">{opportunity.location}</p>
                    </div>
                  )}

                  {opportunity.salary && (
                    <div>
                      <p className="text-sm font-medium">Salary</p>
                      <p className="text-sm text-gray-500">{opportunity.salary}</p>
                    </div>
                  )}

                  {opportunity.contact && (
                    <div>
                      <p className="text-sm font-medium">Contact</p>
                      <p className="text-sm text-gray-500">{opportunity.contact}</p>
                    </div>
                  )}

                  {opportunity.tags && opportunity.tags.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {opportunity.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {opportunity.tailoredCV && (
                      <div className="flex items-center justify-between mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                        <span className="text-sm">Tailored CV</span>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/api/orion/opportunity/${opportunity.id}/cv`}>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Link>
                        </Button>
                      </div>
                    )}

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
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="evaluation">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Evaluation details and actions will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="application">
          <Card>
            <CardHeader>
              <CardTitle>Application</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Application drafts and actions will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="networking">
          <StakeholderOutreach
            opportunityId={opportunity.id}
            companyName={opportunity.company}
          />
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {opportunity.notes ? (
                <p className="whitespace-pre-wrap">{opportunity.notes}</p>
              ) : (
                <p className="text-gray-400">No notes available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
