'use client';

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Card, CardContent } from '@/components/ui';
import { Users, Loader2, Mail, Copy } from 'lucide-react';
import { useState } from 'react';
import { useOpportunityCentralStore, OpportunityCentralStoreType } from '@/app/opportunityCentralStore';
import { OrionOpportunity } from '@/types';
import consolidatedLogger from '@/lib/logger';
import type { Stakeholder } from '@/types';

interface FindStakeholdersButtonProps {
  OrionOpportunity: OrionOpportunity;
}

export const FindStakeholdersButton: React.FC<FindStakeholdersButtonProps> = ({ OrionOpportunity }) => {
  const isOpen = useOpportunityCentralStore((state: OpportunityCentralStoreType) => state.isFindStakeholdersDialogOpen);
  const open = useOpportunityCentralStore((state: OpportunityCentralStoreType) => state.openFindStakeholdersDialog);
  const close = useOpportunityCentralStore((state: OpportunityCentralStoreType) => state.closeFindStakeholdersDialog);
  const stakeholders = useOpportunityCentralStore((state: OpportunityCentralStoreType) => state.stakeholders);
  const setStakeholders = useOpportunityCentralStore((state: OpportunityCentralStoreType) => state.setStakeholders);
  const setSelectedStakeholder = useOpportunityCentralStore(
    (state: OpportunityCentralStoreType) => state.setSelectedStakeholder
  );
  const setOpportunity = useOpportunityCentralStore((state: OpportunityCentralStoreType) => state.setOpportunity);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFindStakeholders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/orion/networking/find-stakeholders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company: OrionOpportunity.company,
          role: OrionOpportunity.title,
          count: 5,
        }),
      });

      const data = await response.json();

      if (data.success && data.stakeholders) {
        setStakeholders(data.stakeholders);
      } else {
        throw new Error(data.error || 'Failed to find stakeholders');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        consolidatedLogger.error('[FindStakeholdersButton][ERROR] Error finding stakeholders:', err);
        setError(err.message || 'An error occurred');
      } else {
        consolidatedLogger.error('[FindStakeholdersButton][ERROR] An unknown error occurred:', { error: err });
        setError('An unknown error occurred while finding stakeholders.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateOutreach = (stakeholder: Stakeholder) => {
    setSelectedStakeholder(stakeholder);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpportunity(OrionOpportunity);
          open();
        }}
        className="bg-purple-600 hover:bg-purple-700"
      >
        <Users className="mr-2 h-4 w-4" /> Find Stakeholders
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(openState) => {
          if (!openState) close();
        }}
      >
        <DialogContent className="sm:max-w-[700px] bg-gray-800 border-gray-700 text-gray-200">
          <DialogHeader>
            <DialogTitle className="text-purple-400">Find Key Stakeholders at {OrionOpportunity.company}</DialogTitle>
          </DialogHeader>

          {!stakeholders.length && !isLoading && !error && (
            <div className="py-6 text-center">
              <p className="mb-4 text-gray-300">
                Find key stakeholders at {OrionOpportunity.company} who might be relevant for this OrionOpportunity.
              </p>
              <Button onClick={handleFindStakeholders} className="bg-green-600 hover:bg-green-700">
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
              <Button onClick={handleFindStakeholders} className="bg-green-600 hover:bg-green-700">
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
                          <p className="text-gray-400 text-sm">
                            {stakeholder.role} at {stakeholder.company}
                          </p>

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

                          {stakeholder.linkedinUrl && (
                            <a
                              href={stakeholder.linkedinUrl}
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
                <Button onClick={handleFindStakeholders} variant="outline" className="text-gray-300 border-gray-600">
                  Find More Stakeholders
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
