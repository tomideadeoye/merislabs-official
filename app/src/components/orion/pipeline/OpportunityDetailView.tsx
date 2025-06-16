'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FileText, FileEdit, Search, Users, Calendar, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/ui/components/ui';
import { Badge } from '@/ui/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/ui';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/components/ui';
import type { OrionOpportunity } from '@repo/shared';
import { EvaluationOutput } from '@repo/shared/types/orion';
import { StakeholderOutreach } from './StakeholderOutreach';

interface OpportunityDetailViewProps {
  OrionOpportunity: OrionOpportunity;
  evaluation?: EvaluationOutput;
  opportunityId: string;
}

export function OpportunityDetailView({ OrionOpportunity, evaluation }: OpportunityDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold"> {OrionOpportunity.title} </h1>
          <p className="text-gray-500"> {OrionOpportunity.company} </p>
        </div>
        <Badge variant={OrionOpportunity.status === 'applied' ? 'success' : 'default'}>{OrionOpportunity.status}</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="overview">
        <TabsList className="bg-gray-800 border-gray-700 mb-4">
          <TabsTrigger value="overview"> Overview </TabsTrigger>
          <TabsTrigger value="evaluation"> Evaluation </TabsTrigger>
          <TabsTrigger value="application"> Application </TabsTrigger>
          <TabsTrigger value="networking"> Networking </TabsTrigger>
          <TabsTrigger value="notes"> Notes </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Description </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {OrionOpportunity.content ? (
                    <div dangerouslySetInnerHTML={{ __html: OrionOpportunity.content }} />
                  ) : (
                    <p className="text-gray-500"> No description available.</p>
                  )}
                </div>

                {OrionOpportunity.url && (
                  <div className="mt-4">
                    <a
                      href={OrionOpportunity.url}
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
                  <CardTitle>Details </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {OrionOpportunity.deadline && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium"> Deadline </p>
                        <p className="text-sm text-gray-500"> {OrionOpportunity.deadline} </p>
                      </div>
                    </div>
                  )}

                  {OrionOpportunity.location && (
                    <div>
                      <p className="text-sm font-medium"> Location </p>
                      <p className="text-sm text-gray-500"> {OrionOpportunity.location} </p>
                    </div>
                  )}

                  {OrionOpportunity.salary && (
                    <div>
                      <p className="text-sm font-medium"> Salary </p>
                      <p className="text-sm text-gray-500"> {OrionOpportunity.salary} </p>
                    </div>
                  )}

                  {OrionOpportunity.contact && (
                    <div>
                      <p className="text-sm font-medium"> Contact </p>
                      <p className="text-sm text-gray-500"> {OrionOpportunity.contact} </p>
                    </div>
                  )}

                  {OrionOpportunity.tags && OrionOpportunity.tags.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1"> Tags </p>
                      <div className="flex flex-wrap gap-1">
                        {OrionOpportunity.tags.map((tag: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="px-2 py-0.5 text-xs rounded-full border border-gray-600 text-gray-300"
                          >
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
                  <CardTitle>Actions </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {OrionOpportunity.tailoredCv && (
                      <div className="flex items-center justify-between mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                        <span className="text-sm"> Tailored CV</span>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/api/orion/OrionOpportunity/${OrionOpportunity.id}/cv`}>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Link>
                        </Button>
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap gap-2">
                      <Link href={`/OrionOpportunity/${OrionOpportunity.id}/analyze`}>
                        <Button variant="outline" size="sm">
                          <Search className="h-4 w-4 mr-2" />
                          Analyze JD
                        </Button>
                      </Link>
                      <Link href={`/OrionOpportunity/${OrionOpportunity.id}/cv-tailoring`}>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Tailor CV
                        </Button>
                      </Link>
                      <Link href={`/OrionOpportunity/${OrionOpportunity.id}/application`}>
                        <Button variant="outline" size="sm">
                          <FileEdit className="h-4 w-4 mr-2" />
                          Draft Application
                        </Button>
                      </Link>
                      <Link href={`/OrionOpportunity/${OrionOpportunity.id}/networking`}>
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
              <CardTitle>Evaluation </CardTitle>
            </CardHeader>
            <CardContent>
              {evaluation ? (
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-blue-400">
                    Overall Fit Score: {evaluation.overallFitScore?.toFixed(0) || 'N/A'}%
                  </p>
                  <p className="text-gray-300">Recommendation: {evaluation.recommendation || 'N/A'}</p>
                  <p className="text-gray-300">Reasoning: {evaluation.reasoning || 'No reasoning provided.'}</p>

                  {evaluation.alignmentHighlights && evaluation.alignmentHighlights.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-1">Alignment Highlights</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {evaluation.alignmentHighlights.map((highlight, index) => (
                          <li key={index} className="text-sm text-gray-300">
                            <strong>{highlight.title}</strong>: {highlight.reasoning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {evaluation.gapAnalysis && evaluation.gapAnalysis.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-1">Gap Analysis</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {evaluation.gapAnalysis.map((gap, index) => (
                          <li key={index} className="text-sm text-gray-300">
                            <strong>{gap.skill}</strong>: {gap.reasoning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {evaluation.suggestedNextSteps && evaluation.suggestedNextSteps.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-1">Suggested Next Steps</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {evaluation.suggestedNextSteps.map((step, index) => (
                          <li key={index} className="text-sm text-gray-300">
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400"> No evaluation available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="application">
          <Card>
            <CardHeader>
              <CardTitle>Application </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400"> Application drafts and actions will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="networking">
          <StakeholderOutreach opportunityId={OrionOpportunity.id} companyName={OrionOpportunity.company} />
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes </CardTitle>
            </CardHeader>
            <CardContent>
              {OrionOpportunity.notes ? (
                <p className="whitespace-pre-wrap"> {OrionOpportunity.notes} </p>
              ) : (
                <p className="text-gray-400"> No notes available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
