"use client";

import React, { useState } from 'react';
import { Button } from '@repo/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Card, CardContent } from '@repo/ui';
import { Loader2, Users, Copy, Mail } from 'lucide-react';
import { GenerateOutreachDialog } from './GenerateOutreachDialog';
import { useOpportunityCentralStore } from '../opportunityCentralStore';
import type { Opportunity } from '@shared/types/opportunity';

export interface Stakeholder {
  name: string;
  role: string;
  company: string;
  linkedin_url?: string;
  email?: string;
}

interface FindStakeholdersButtonProps {
  opportunity: Opportunity;
}

export const FindStakeholdersButton: React.FC<FindStakeholdersButtonProps> = ({ opportunity }) => {
  const isOpen = useOpportunityCentralStore((state: any) => state.isOpen);
  const open = useOpportunityCentralStore((state: any) => state.open);
  const close = useOpportunityCentralStore((state: any) => state.close);
  const stakeholders = useOpportunityCentralStore((state: any) => state.stakeholders);
  const setStakeholders = useOpportunityCentralStore((state: any) => state.setStakeholders);
  const selectedStakeholder = useOpportunityCentralStore((state: any) => state.selectedStakeholder);
  const setSelectedStakeholder = useOpportunityCentralStore((state: any) => state.setSelectedStakeholder);
  const setOpportunity = useOpportunityCentralStore((state: any) => state.setOpportunity);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFindStakeholders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the find stakeholders API
      const response = await fetch('/api/orion/networking/find-stakeholders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company: opportunity.company,
          role: opportunity.title,
          count: 5
        })
      });

      const data = await response.json();

      if (data.success && data.stakeholders) {
        setStakeholders(data.stakeholders);
      } else {
        throw new Error(data.error || 'Failed to find stakeholders');
      }
    } catch (err: any) {
      console.error('Error finding stakeholders:', err);
      setError(err.message || 'An error occurred while finding stakeholders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateOutreach = (stakeholder: Stakeholder) => {
    setSelectedStakeholder(stakeholder);
    // Open GenerateOutreachDialog via its own store
    (useOpportunityCentralStore.getState() as any).closeOutreachDialog(); // Ensure closed before opening
    (useOpportunityCentralStore.getState() as any).openOutreachDialog({
      stakeholder,
      opportunityTitle: opportunity.title,
      opportunityCompany: opportunity.company,
      onOutreachGenerated: () => {},
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpportunity(opportunity);
          open();
        }}
        className="bg-purple-600 hover:bg-purple-700"
      >
        <Users className="mr-2 h-4 w-4" /> Find Stakeholders
      </Button>

      <Dialog open={isOpen} onOpenChange={(openState) => { if (!openState) close(); }}>
        <DialogContent className="sm:max-w-[700px] bg-gray-800 border-gray-700 text-gray-200">
          <DialogHeader>
            <DialogTitle className="text-purple-400">
              Find Key Stakeholders at {opportunity.company}
            </DialogTitle>
          </DialogHeader>

          {!stakeholders.length && !isLoading && !error && (
            <div className="py-6 text-center">
              <p className="mb-4 text-gray-300">
                Find key stakeholders at {opportunity.company} who might be relevant for this opportunity.
              </p>
              <Button
                onClick={handleFindStakeholders}
                className="bg-green-600 hover:bg-green-700"
              >
                Find Stakeholders
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="py-10 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-400" />
              <p className="text-gray-300">Searching for key stakeholders...</p>
              <p className="text-xs text-gray-500 mt-2">This may take a moment as we search for relevant contacts.</p>
            </div>
          )}

          {error && (
            <div className="py-6 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <Button
                onClick={handleFindStakeholders}
                className="bg-green-600 hover:bg-green-700"
              >
                Try Again
              </Button>
            </div>
          )}

          {stakeholders.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {stakeholders.map((stakeholder: Stakeholder, index: number) => (
                  <Card key={index} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-gray-200 font-medium">{stakeholder.name}</h3>
                          <p className="text-gray-400 text-sm">{stakeholder.role} at {stakeholder.company}</p>

                          {stakeholder.email && (
                            <div className="flex items-center mt-1 text-gray-300 text-sm">
                              <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                              {stakeholder.email}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2 h-6 w-6 p-0 text-gray-400 hover:text-gray-200"
                                onClick={() => copyToClipboard(stakeholder.email || '')}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}

                          {stakeholder.linkedin_url && (
                            <a
                              href={stakeholder.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm mt-1 inline-block"
                            >
                              LinkedIn Profile
                            </a>
                          )}
                        </div>

                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleGenerateOutreach(stakeholder)}
                        >
                          Draft Outreach
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="pt-2 text-center">
                <Button
                  onClick={handleFindStakeholders}
                  variant="outline"
                  className="text-gray-300 border-gray-600"
                >
                  Find More Stakeholders
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* GenerateOutreachDialog is now managed by its own store and does not need to be rendered here */}
    </>
  );
};
