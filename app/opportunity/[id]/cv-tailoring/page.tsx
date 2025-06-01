'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CVTailoringStudio } from '@/components/orion/CVTailoringStudio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function OpportunityCVTailoringPage() {
  const params = useParams();
  const opportunityId = params.id as string;
  
  const [opportunity, setOpportunity] = useState<any>(null);
  const [jdAnalysis, setJdAnalysis] = useState<string>('');
  const [webResearch, setWebResearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tailoredCV, setTailoredCV] = useState<string | null>(null);
  
  // Fetch opportunity data
  useEffect(() => {
    async function fetchOpportunityData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch opportunity details
        const opportunityResponse = await fetch(`/api/orion/opportunity/${opportunityId}`);
        if (!opportunityResponse.ok) {
          throw new Error(`Failed to fetch opportunity: ${opportunityResponse.statusText}`);
        }
        const opportunityData = await opportunityResponse.json();
        setOpportunity(opportunityData);
        
        // Fetch JD analysis if available
        if (opportunityData.jdAnalysisId) {
          const analysisResponse = await fetch(`/api/orion/memory/${opportunityData.jdAnalysisId}`);
          if (analysisResponse.ok) {
            const analysisData = await analysisResponse.json();
            setJdAnalysis(analysisData.text || '');
          }
        }
        
        // Fetch web research if available
        if (opportunityData.webResearchId) {
          const researchResponse = await fetch(`/api/orion/memory/${opportunityData.webResearchId}`);
          if (researchResponse.ok) {
            const researchData = await researchResponse.json();
            setWebResearch(researchData.text || '');
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch opportunity data');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (opportunityId) {
      fetchOpportunityData();
    }
  }, [opportunityId]);
  
  // Handle saving the tailored CV
  const handleSaveCV = async (cv: string) => {
    setTailoredCV(cv);
    
    try {
      // Save the CV to the opportunity
      const response = await fetch(`/api/orion/opportunity/${opportunityId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tailoredCV: cv
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save tailored CV');
      }
      
      alert('CV saved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to save tailored CV');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
              <Button 
                onClick={() => window.history.back()}
                className="mt-4"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!opportunity) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p>Opportunity not found</p>
              <Button 
                onClick={() => window.history.back()}
                className="mt-4"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>CV Tailoring Studio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h2 className="text-xl font-bold">{opportunity.title}</h2>
            <p className="text-gray-500">{opportunity.company}</p>
          </div>
          
          {(!jdAnalysis || jdAnalysis.length < 50) && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
              <p>No detailed JD analysis available. For best results, analyze the job description first.</p>
              <Button 
                onClick={() => window.location.href = `/opportunity/${opportunityId}/analyze`}
                variant="outline"
                className="mt-2"
              >
                Analyze Job Description
              </Button>
            </div>
          )}
          
          <CVTailoringStudio 
            jdAnalysis={jdAnalysis || opportunity.jdText || ''}
            jobTitle={opportunity.title}
            companyName={opportunity.company}
            webResearchContext={webResearch}
            onCVAssembled={handleSaveCV}
          />
        </CardContent>
      </Card>
      
      {tailoredCV && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Tailored CV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {tailoredCV.split('\n').map((line, i) => (
                <div key={i} className={line.startsWith('**') ? 'font-bold' : ''}>
                  {line}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}