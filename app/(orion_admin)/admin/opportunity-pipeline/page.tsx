"use client";

import { useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { BriefcaseBusiness } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OpportunityEvaluator } from "@/components/orion/OpportunityEvaluator";
import { OpportunityNetworking } from "@/components/orion/OpportunityNetworking";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OpportunityPipelineFeaturePage() {
  const [activeTab, setActiveTab] = useState<string>("evaluate");
  const [opportunityTitle, setOpportunityTitle] = useState<string>("");
  const [opportunityCompany, setOpportunityCompany] = useState<string>("");
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  // Handler to capture evaluation results
  const handleEvaluationComplete = (result: any) => {
    setEvaluationResult(result);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames.PIPELINE}
        icon={<BriefcaseBusiness className="h-7 w-7" />}
        description="Evaluate opportunities, generate application materials, and connect with key stakeholders."
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="evaluate">Evaluate Opportunity</TabsTrigger>
          <TabsTrigger value="apply">Draft Application</TabsTrigger>
          <TabsTrigger value="network">Networking Outreach</TabsTrigger>
        </TabsList>
        
        <TabsContent value="evaluate" className="mt-0">
          <OpportunityEvaluator className="mb-6" />
        </TabsContent>
        
        <TabsContent value="apply" className="mt-0">
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Draft Application Materials</CardTitle>
              <CardDescription className="text-gray-400">
                Generate personalized cover letters and application emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Use this feature to create tailored application materials based on the opportunity details and your profile.
              </p>
              
              <Button 
                onClick={() => window.location.href = '/api/orion/opportunity/draft-application'}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Draft Application Materials
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="network" className="mt-0">
          <OpportunityNetworking 
            opportunityTitle={opportunityTitle}
            opportunityCompany={opportunityCompany}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}