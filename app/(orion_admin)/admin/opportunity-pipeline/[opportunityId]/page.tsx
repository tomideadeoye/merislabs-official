"use client";

import React, { useState, useEffect } from 'react';
import { OpportunityDetailView } from '@/components/orion/opportunities/OpportunityDetailView';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowLeft, Loader2 } from 'lucide-react';
import { Opportunity, EvaluationOutput } from '@/types/opportunity';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OpportunityDetailPageProps {
  params: {
    opportunityId: string;
  };
}

export default function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const { opportunityId } = params;
  const router = useRouter();
  
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const fetchOpportunityData = async () => {
      try {
        setLoading(true);
        
        // Fetch opportunity details
        const opportunityResponse = await fetch(`/api/orion/opportunity/${opportunityId}`);
        
        if (!opportunityResponse.ok) {
          throw new Error('Failed to fetch opportunity details');
        }
        
        const opportunityData = await opportunityResponse.json();
        
        if (opportunityData.success && opportunityData.opportunity) {
          setOpportunity(opportunityData.opportunity);
          
          // If there's an evaluation ID, fetch the evaluation
          if (opportunityData.opportunity.relatedEvaluationId) {
            try {
              const evaluationResponse = await fetch(`/api/orion/opportunity/${opportunityId}/evaluation`);
              
              if (evaluationResponse.ok) {
                const evaluationData = await evaluationResponse.json();
                
                if (evaluationData.success && evaluationData.evaluation) {
                  setEvaluation(evaluationData.evaluation);
                }
              }
            } catch (evalError) {
              console.error('Error fetching evaluation:', evalError);
              // Don't fail the whole page if just the evaluation fails
            }
          }
        } else {
          throw new Error(opportunityData.error || 'Failed to fetch opportunity details');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
        console.error('Error fetching opportunity data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOpportunityData();
  }, [opportunityId]);
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/orion/opportunity/${opportunityId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete opportunity');
      }
      
      router.push('/admin/opportunity-pipeline');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Error deleting opportunity:', err);
      setIsDeleting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-4" />
        <p className="text-gray-400">Loading opportunity details...</p>
      </div>
    );
  }
  
  if (error || !opportunity) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Opportunity Not Found"
          icon={<Briefcase className="h-7 w-7" />}
          description="The requested opportunity could not be found."
        />
        
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md">
          {error || 'Opportunity not found'}
        </div>
        
        <Button asChild>
          <Link href="/admin/opportunity-pipeline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Opportunities
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild className="border-gray-700">
          <Link href="/admin/opportunity-pipeline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Opportunities
          </Link>
        </Button>
        
        {isDeleting && (
          <div className="flex items-center text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Deleting...
          </div>
        )}
      </div>
      
      <OpportunityDetailView 
        opportunity={opportunity} 
        evaluation={evaluation || undefined}
        onDelete={handleDelete}
      />
    </div>
  );
}