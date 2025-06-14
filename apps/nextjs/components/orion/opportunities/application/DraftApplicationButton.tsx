"use client";

import React, { useState } from 'react';
// Imports updated to use @repo/ui barrel exports
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Tabs, TabsContent, TabsList, TabsTrigger, Badge } from '@repo/ui';
import { Loader2, FileText, Copy } from 'lucide-react';
import type { OrionOpportunity } from '@repo/shared';
import { useOpportunityCentralStore } from '@repo/shared';

interface DraftApplicationButtonProps {
  OrionOpportunity: OrionOpportunity;
}

export const DraftApplicationButton: React.FC<DraftApplicationButtonProps> = ({ OrionOpportunity }) => {
  const isOpen = useOpportunityCentralStore((state: any) => state.isDraftDialogOpen);
  const open = useOpportunityCentralStore((state: any) => state.openDraftDialog);
  const close = useOpportunityCentralStore((state: any) => state.closeDraftDialog);
  const dialogOpportunity = useOpportunityCentralStore((state: any) => state.draftOpportunity);
  const [isLoading, setIsLoading] = useState(false);
  const [drafts, setDrafts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('draft-1');

  const handleGenerateDrafts = async () => {
    if (!dialogOpportunity) return;
    setIsLoading(true);
    setError(null);

    try {
      // Fetch user profile data
      const profileResponse = await fetch('/api/orion/profile');
      const profileData = await profileResponse.json();

      if (!profileData.success) {
        throw new Error(profileData.error || 'Failed to fetch profile data');
      }

      // Prepare request for draft application
      const requestBody = {
        OrionOpportunity: {
          title: dialogOpportunity.title,
          company: dialogOpportunity.company,
          description: dialogOpportunity.content || '',
          tags: dialogOpportunity.tags || []
        },
        applicantProfile: profileData.profile,
        numberOfDrafts: 3
      };

      // Call the draft application API
      const response = await fetch('/api/orion/OrionOpportunity/draft-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.success && data.drafts) {
        setDrafts(data.drafts);
      } else {
        throw new Error(data.error || 'Failed to generate application drafts');
      }
    } catch (err: any) {
      console.error('Error generating application drafts:', err);
      setError(err.message || 'An error occurred while generating drafts');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Could add a toast notification here
        console.log('Copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <>
      <Button
        onClick={() => open(OrionOpportunity)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <FileText className="mr-2 h-4 w-4" /> Draft Application
      </Button>

      {dialogOpportunity && (
        <Dialog open={isOpen} onOpenChange={(openState) => { if (!openState) close(); }}>
          <DialogContent className="sm:max-w-[700px] bg-gray-800 border-gray-700 text-gray-200">
            <DialogHeader>
              <DialogTitle className="text-blue-400">
                Draft Application for {dialogOpportunity.title} at {dialogOpportunity.company}
              </DialogTitle>
            </DialogHeader>

            {!drafts.length && !isLoading && !error && (
              <div className="py-6 text-center">
                <p className="mb-4 text-gray-300">
                  Generate personalized application drafts for this OrionOpportunity based on your profile.
                </p>
                <Button
                  onClick={handleGenerateDrafts}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Generate Application Drafts
                </Button>
              </div>
            )}

            {isLoading && (
              <div className="py-10 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-400" />
                <p className="text-gray-300">Generating personalized application drafts...</p>
                <p className="text-xs text-gray-500 mt-2">This may take a moment as we craft multiple unique drafts.</p>
              </div>
            )}

            {error && (
              <div className="py-6 text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <Button
                  onClick={handleGenerateDrafts}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Try Again
                </Button>
              </div>
            )}

            {drafts.length > 0 && (
              <div className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-gray-700 border-gray-600">
                    {drafts.map((_, index) => (
                      <TabsTrigger
                        key={`draft-${index + 1}`}
                        value={`draft-${index + 1}`}
                        className="data-[state=active]:bg-blue-600"
                      >
                        Draft {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {drafts.map((draft, index) => (
                    <TabsContent
                      key={`draft-${index + 1}`}
                      value={`draft-${index + 1}`}
                      className="mt-4"
                    >
                      <div className="relative bg-gray-700 p-4 rounded-md border border-gray-600">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                          onClick={() => copyToClipboard(draft)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>

                        <div className="whitespace-pre-wrap text-gray-200 pr-8">
                          {draft}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <Badge className="bg-blue-600">Draft {index + 1}</Badge>
                        <Button
                          onClick={() => copyToClipboard(draft)}
                          variant="outline"
                          className="text-gray-300 border-gray-600"
                        >
                          <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="pt-2 text-center">
                  <Button
                    onClick={handleGenerateDrafts}
                    variant="outline"
                    className="text-gray-300 border-gray-600"
                  >
                    Regenerate Drafts
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
