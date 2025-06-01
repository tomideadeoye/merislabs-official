"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Opportunity, EvaluationOutput } from '@/types/opportunity';
import { 
  ArrowLeft, 
  BarChart2, 
  FileText, 
  Users, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Save,
  Calendar,
  BookText,
  CheckSquare,
  BookOpen,
  LayoutGrid
} from 'lucide-react';
import { format } from 'date-fns';
import { EvaluateWithOrionButton } from '../opportunities/EvaluateWithOrionButton';
import { NarrativeAlignmentSection } from '../opportunities/NarrativeAlignmentSection';
import { CreateHabiticaTaskButton } from '../opportunities/CreateHabiticaTaskButton';
import { JournalReflectionDialog } from '../opportunities/JournalReflectionDialog';
import { StatusUpdateButton } from '../opportunities/StatusUpdateButton';
import { DraftApplicationButton } from '../opportunities/application/DraftApplicationButton';
import { FindStakeholdersButton } from '../opportunities/networking/FindStakeholdersButton';

interface EnhancedOpportunityDetailViewProps {
  opportunityId: string;
}

export const EnhancedOpportunityDetailView: React.FC<EnhancedOpportunityDetailViewProps> = ({ opportunityId }) => {
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationOutput | null>(null);
  const [applicationDrafts, setApplicationDrafts] = useState<string[]>([]);
  const [stakeholders, setStakeholders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isDraftingApplication, setIsDraftingApplication] = useState<boolean>(false);
  const [isSearchingStakeholders, setIsSearchingStakeholders] = useState<boolean>(false);
  const [showReflectionDialog, setShowReflectionDialog] = useState<boolean>(false);
  const [reflectionType, setReflectionType] = useState<'application_sent' | 'interview_completed' | 'outreach_sent' | 'general'>('general');

  // Fetch opportunity data
  useEffect(() => {
    const fetchOpportunityData = async () => {
      try {
        const response = await fetch(`/api/orion/opportunity/${opportunityId}`);
        const data = await response.json();
        
        if (data.success) {
          setOpportunity(data.opportunity);
          
          // If there's an evaluation ID, fetch the evaluation
          if (data.opportunity.relatedEvaluationId) {
            fetchEvaluation();
          }
          
          // Fetch application drafts if they exist
          if (data.opportunity.applicationMaterialIds) {
            fetchApplicationDrafts();
          }
          
          // Fetch stakeholders if they exist
          if (data.opportunity.stakeholderContactIds) {
            fetchStakeholders();
          }
        }
      } catch (error) {
        console.error("Error fetching opportunity:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOpportunityData();
  }, [opportunityId]);

  // Fetch evaluation data
  const fetchEvaluation = async () => {
    try {
      const response = await fetch(`/api/orion/opportunity/${opportunityId}/evaluation`);
      const data = await response.json();
      
      if (data.success) {
        setEvaluation(data.evaluation);
      }
    } catch (error) {
      console.error("Error fetching evaluation:", error);
    }
  };

  // Fetch application drafts
  const fetchApplicationDrafts = async () => {
    try {
      const response = await fetch(`/api/orion/opportunity/${opportunityId}/drafts`);
      const data = await response.json();
      
      if (data.success) {
        setApplicationDrafts(data.drafts);
      }
    } catch (error) {
      console.error("Error fetching application drafts:", error);
    }
  };

  // Fetch stakeholders
  const fetchStakeholders = async () => {
    try {
      const response = await fetch(`/api/orion/opportunity/${opportunityId}/stakeholders`);
      const data = await response.json();
      
      if (data.success) {
        setStakeholders(data.stakeholders);
      }
    } catch (error) {
      console.error("Error fetching stakeholders:", error);
    }
  };

  // Run evaluation
  const handleEvaluate = async () => {
    if (!opportunity) return;
    
    setIsEvaluating(true);
    
    try {
      const response = await fetch('/api/orion/opportunity/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: opportunity.title,
          description: opportunity.descriptionSummary || '',
          type: opportunity.type,
          url: opportunity.sourceURL
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setEvaluation(data.evaluation);
        
        // Update opportunity with evaluation ID
        await fetch(`/api/orion/opportunity/${opportunityId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            relatedEvaluationId: data.evaluationId
          })
        });
      }
    } catch (error) {
      console.error("Error evaluating opportunity:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Draft application
  const handleDraftApplication = async () => {
    if (!opportunity) return;
    
    setIsDraftingApplication(true);
    
    try {
      const response = await fetch('/api/orion/opportunity/draft-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          opportunity: {
            title: opportunity.title,
            company: opportunity.companyOrInstitution,
            description: opportunity.descriptionSummary || '',
          },
          evaluationSummary: evaluation,
          numberOfDrafts: 3
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setApplicationDrafts(data.drafts);
        
        // Update opportunity with application draft IDs
        await fetch(`/api/orion/opportunity/${opportunityId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            applicationMaterialIds: JSON.stringify(data.draftIds || [])
          })
        });
      }
    } catch (error) {
      console.error("Error drafting application:", error);
    } finally {
      setIsDraftingApplication(false);
    }
  };

  // Search stakeholders
  const handleSearchStakeholders = async () => {
    if (!opportunity) return;
    
    setIsSearchingStakeholders(true);
    
    try {
      const response = await fetch('/api/orion/networking/stakeholder-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company: opportunity.companyOrInstitution,
          roles: ['Engineering Manager', 'Recruiter', 'CTO']
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStakeholders(data.stakeholders);
        
        // Update opportunity with stakeholder IDs
        await fetch(`/api/orion/opportunity/${opportunityId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            stakeholderContactIds: JSON.stringify(data.stakeholderIds || [])
          })
        });
      }
    } catch (error) {
      console.error("Error searching stakeholders:", error);
    } finally {
      setIsSearchingStakeholders(false);
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  // Save to memory
  const saveToMemory = async (content: string, type: string) => {
    try {
      await fetch('/api/orion/memory/add-memory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: content,
          sourceId: `${type}_${opportunityId}_${Date.now()}`,
          tags: [type, 'opportunity', opportunity?.companyOrInstitution?.toLowerCase().replace(/\s+/g, '_')],
          metadata: {
            type,
            opportunityId,
            company: opportunity?.companyOrInstitution,
            title: opportunity?.title,
            timestamp: new Date().toISOString()
          }
        })
      });
      
      // Could add a toast notification here
    } catch (error) {
      console.error("Error saving to memory:", error);
    }
  };

  // Open reflection dialog
  const openReflectionDialog = (type: 'application_sent' | 'interview_completed' | 'outreach_sent' | 'general') => {
    setReflectionType(type);
    setShowReflectionDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Opportunity not found.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.push('/admin/opportunity-pipeline')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Opportunities
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/opportunity-pipeline')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Opportunities
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/opportunity-pipeline/kanban')}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Kanban View
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge 
            variant="outline" 
            className={
              opportunity.status === 'applied' ? 'bg-green-900/30 text-green-300 border-green-700' :
              opportunity.status === 'interview_scheduled' ? 'bg-blue-900/30 text-blue-300 border-blue-700' :
              opportunity.status === 'offer_received' ? 'bg-purple-900/30 text-purple-300 border-purple-700' :
              'bg-gray-900/30 text-gray-300 border-gray-700'
            }
          >
            {opportunity.status.replace(/_/g, ' ')}
          </Badge>
          
          {opportunity.priority && (
            <Badge 
              variant="outline" 
              className={
                opportunity.priority === 'high' ? 'bg-red-900/30 text-red-300 border-red-700' :
                opportunity.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' :
                'bg-green-900/30 text-green-300 border-green-700'
              }
            >
              {opportunity.priority} priority
            </Badge>
          )}
          
          <StatusUpdateButton 
            opportunity={opportunity} 
            onStatusUpdate={(newStatus) => {
              if (opportunity) {
                setOpportunity({
                  ...opportunity,
                  status: newStatus,
                  lastStatusUpdate: new Date().toISOString()
                });
              }
            }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Overview & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl">{opportunity.title}</CardTitle>
              <CardDescription className="text-gray-400">{opportunity.companyOrInstitution}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {opportunity.descriptionSummary && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Description</h3>
                  <p className="text-sm text-gray-400">{opportunity.descriptionSummary}</p>
                </div>
              )}
              
              {opportunity.sourceURL && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Source</h3>
                  <a 
                    href={opportunity.sourceURL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    {opportunity.sourceURL}
                  </a>
                </div>
              )}
              
              {opportunity.dateIdentified && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Date Identified</h3>
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{format(new Date(opportunity.dateIdentified), 'PPP')}</span>
                  </div>
                </div>
              )}
              
              {opportunity.nextActionDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Next Action Date</h3>
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{format(new Date(opportunity.nextActionDate), 'PPP')}</span>
                  </div>
                </div>
              )}
              
              {opportunity.tags && opportunity.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {opportunity.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-700 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-md">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Evaluate with Orion Button */}
              {!evaluation ? (
                <EvaluateWithOrionButton 
                  opportunity={opportunity}
                  onEvaluationComplete={(evaluationId) => {
                    fetchEvaluation();
                  }}
                />
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-blue-900/20 hover:bg-blue-900/30 text-blue-300"
                  onClick={handleEvaluate}
                  disabled={isEvaluating}
                >
                  {isEvaluating ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <BarChart2 className="mr-2 h-4 w-4" />
                  )}
                  Re-evaluate Opportunity
                </Button>
              )}
              
              {/* Draft Application Button */}
              <DraftApplicationButton opportunity={opportunity} />
              
              {/* Find Stakeholders Button */}
              <FindStakeholdersButton opportunity={opportunity} />
              
              {/* Create Habitica Task Button */}
              <CreateHabiticaTaskButton 
                opportunity={opportunity}
                className="w-full justify-start bg-amber-900/20 hover:bg-amber-900/30 text-amber-300"
              />
              
              {/* Journal Reflection Button */}
              <Button 
                variant="outline" 
                className="w-full justify-start bg-indigo-900/20 hover:bg-indigo-900/30 text-indigo-300"
                onClick={() => openReflectionDialog('general')}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Add Reflection
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Core Workflow */}
        <div className="lg:col-span-2 space-y-6">
          {/* Evaluation Results Section */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-blue-400" />
                Opportunity Evaluation
              </CardTitle>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleEvaluate}
                disabled={isEvaluating}
                className="bg-gray-700 hover:bg-gray-600"
              >
                {isEvaluating ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Re-evaluate
              </Button>
            </CardHeader>
            
            <CardContent>
              {evaluation ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-1">Overall Fit Score</h3>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-700 rounded-full h-4">
                        <div 
                          className={`h-4 rounded-full ${
                            evaluation.fitScorePercentage >= 75 ? 'bg-green-500' :
                            evaluation.fitScorePercentage >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${evaluation.fitScorePercentage}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 font-bold text-lg">
                        {evaluation.fitScorePercentage}%
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-1">Recommendation</h3>
                    <p className="text-blue-400">{evaluation.recommendation}</p>
                  </div>
                  
                  {evaluation.alignmentHighlights && evaluation.alignmentHighlights.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-1 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-400" />
                        Alignment Highlights
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {evaluation.alignmentHighlights.map((highlight, index) => (
                          <li key={index} className="text-sm text-gray-300">{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {evaluation.gapAnalysis && evaluation.gapAnalysis.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1 text-yellow-400" />
                        Gap Analysis
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {evaluation.gapAnalysis.map((gap, index) => (
                          <li key={index} className="text-sm text-gray-300">{gap}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {evaluation.suggestedNextSteps && evaluation.suggestedNextSteps.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-medium text-gray-300 flex items-center">
                          <CheckSquare className="h-4 w-4 mr-1 text-amber-400" />
                          Suggested Next Steps
                        </h3>
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {evaluation.suggestedNextSteps.map((step, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start">
                            <span className="mr-2 flex-1">{step}</span>
                            <CreateHabiticaTaskButton
                              opportunity={opportunity}
                              taskText={step}
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400">No evaluation data available.</p>
                  <EvaluateWithOrionButton 
                    opportunity={opportunity}
                    onEvaluationComplete={(evaluationId) => {
                      fetchEvaluation();
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Narrative Alignment Section - Only show if evaluation exists */}
          {evaluation && (
            <NarrativeAlignmentSection opportunity={opportunity} evaluation={evaluation} />
          )}
          
          {/* Application Drafts Section */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-400" />
                Application Drafts
              </CardTitle>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openReflectionDialog('application_sent')}
                  className="bg-indigo-900/20 hover:bg-indigo-900/30 text-indigo-300"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Reflect
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDraftApplication}
                  disabled={isDraftingApplication}
                  className="bg-gray-700 hover:bg-gray-600"
                >
                  {isDraftingApplication ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Generate New
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {applicationDrafts.length > 0 ? (
                <Tabs defaultValue="draft0">
                  <TabsList className="bg-gray-700 border-gray-600">
                    {applicationDrafts.map((_, index) => (
                      <TabsTrigger key={index} value={`draft${index}`}>
                        Draft {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {applicationDrafts.map((draft, index) => (
                    <TabsContent key={index} value={`draft${index}`}>
                      <div className="relative">
                        <Textarea 
                          value={draft} 
                          readOnly 
                          className="min-h-[300px] bg-gray-700 border-gray-600 text-gray-200"
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => copyToClipboard(draft)}
                            className="bg-gray-800/70 hover:bg-gray-700"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => saveToMemory(draft, 'application_draft')}
                            className="bg-gray-800/70 hover:bg-gray-700"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400">No application drafts available.</p>
                  <DraftApplicationButton opportunity={opportunity} />
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Stakeholder Outreach Section */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-400" />
                Stakeholder Outreach
              </CardTitle>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openReflectionDialog('outreach_sent')}
                  className="bg-indigo-900/20 hover:bg-indigo-900/30 text-indigo-300"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Reflect
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSearchStakeholders}
                  disabled={isSearchingStakeholders}
                  className="bg-gray-700 hover:bg-gray-600"
                >
                  {isSearchingStakeholders ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Find More
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {stakeholders.length > 0 ? (
                <div className="space-y-4">
                  {stakeholders.map((stakeholder, index) => (
                    <Card key={index} className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-200">{stakeholder.name}</h3>
                            <p className="text-sm text-gray-400">{stakeholder.role} at {stakeholder.company}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-purple-900/20 hover:bg-purple-900/30 text-purple-300"
                          >
                            Draft Outreach
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400">No stakeholders identified yet.</p>
                  <FindStakeholdersButton opportunity={opportunity} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Journal Reflection Dialog */}
      {opportunity && (
        <JournalReflectionDialog
          isOpen={showReflectionDialog}
          setIsOpen={setShowReflectionDialog}
          opportunity={opportunity}
          actionType={reflectionType}
        />
      )}
    </div>
  );
};