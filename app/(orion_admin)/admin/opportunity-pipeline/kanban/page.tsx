"use client";

import React, { useState, useEffect } from 'react';
import { OpportunityKanbanView } from '@/components/orion/pipeline/OpportunityKanbanView';
import { Opportunity, OpportunityStatus } from '@/types/opportunity';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft, RefreshCw } from 'lucide-react';

export default function OpportunityKanbanPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch opportunities
  const fetchOpportunities = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/orion/opportunity/list');
      const data = await response.json();
      
      if (data.success) {
        setOpportunities(data.opportunities);
      } else {
        throw new Error(data.error || 'Failed to fetch opportunities');
      }
    } catch (err: any) {
      console.error('Error fetching opportunities:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  // Handle status change
  const handleStatusChange = async (opportunityId: string, newStatus: OpportunityStatus) => {
    try {
      const response = await fetch('/api/orion/opportunity/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          opportunityId,
          status: newStatus
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error updating status:', data.error);
        // Refresh to get the current state
        fetchOpportunities();
      }
    } catch (err) {
      console.error('Error updating opportunity status:', err);
      // Refresh to get the current state
      fetchOpportunities();
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/opportunity-pipeline')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            List View
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-200">Opportunity Pipeline</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchOpportunities}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
          
          <Button
            onClick={() => router.push('/admin/opportunity/new')}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Opportunity
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <OpportunityKanbanView 
          opportunities={opportunities} 
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}