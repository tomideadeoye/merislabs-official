'use client';

import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Card, CardContent } from '@/components/ui';
import { Loader2, Users, Copy, Mail, Save } from 'lucide-react';
import type { OrionOpportunity } from '@/lib/types';
import type { Stakeholder } from '@/lib/types';
import { OpportunityCentralStoreType } from '@/lib/opportunityCentralStore';
import { useOpportunityCentralStore } from '@/lib/opportunityCentralStore';
import toast from 'react-hot-toast';

interface FindStakeholdersButtonProps {
  orionOpportunity: OrionOpportunity;
}

export const FindStakeholdersButton: React.FC<FindStakeholdersButtonProps> = ({ orionOpportunity }) => {
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
  const [savingContactId, setSavingContactId] = useState<string | null>(null);

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
          company: orionOpportunity.company,
          role: orionOpportunity.title,
          count: 5,
        }),
      });

      const data = await response.json();

      if (data.success && data.stakeholders) {
        const stakeholdersWithIds = data.stakeholders.map((s: Stakeholder) => ({
          ...s,
          id: s.id || Math.random().toString(36).substring(7),
        }));
        setStakeholders(stakeholdersWithIds);
      } else {
        throw new Error(data.error || 'Failed to find stakeholders');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error finding stakeholders:', err);
        setError(err.message || 'An error occurred');
      } else {
        console.error('An unknown error occurred:', err);
        setError('An unknown error occurred while finding stakeholders.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContact = async (stakeholder: Stakeholder) => {
    if (savingContactId === stakeholder.id) return;

    setSavingContactId(stakeholder.id || null);
    toast.loading(`Saving ${stakeholder.name}...`);

    try {
      const response = await fetch('/api/orion/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: stakeholder.name,
          email: stakeholder.email,
          linkedinUrl: stakeholder.linkedinUrl,
          role: stakeholder.role,
          company: stakeholder.company,
        }),
      });

      const data = await response.json();

      if (data.success && data.contact) {
        toast.success(`${stakeholder.name} saved to contacts!`);
      } else {
        throw new Error(data.error || 'Failed to save contact');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error saving contact:', err);
      toast.error(`Failed to save ${stakeholder.name}: ${errorMessage}`);
    } finally {
      setSavingContactId(null);
    }
  };

  const handleGenerateOutreach = (stakeholder: Stakeholder) => {
    setSelectedStakeholder(stakeholder);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', { duration: 1500 });
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpportunity(orionOpportunity);
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
            <DialogTitle className="text-purple-400">Find Key Stakeholders at {orionOpportunity.company}</DialogTitle>
          </DialogHeader>

          {!stakeholders.length && !isLoading && !error && (
            <div className="py-6 text-center">
              <p className="mb-4 text-gray-300">
                Find key stakeholders at {orionOpportunity.company} who might be relevant for this OrionOpportunity.
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
                  <Card key={stakeholder.id || index} className="bg-gray-700 border-gray-600">
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

                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={() => handleGenerateOutreach(stakeholder)}
                          >
                            Draft Outreach
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-600"
                            onClick={() => handleSaveContact(stakeholder)}
                            disabled={savingContactId === stakeholder.id}
                          >
                            {savingContactId === stakeholder.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="mr-2 h-4 w-4" />
                            )}
                            Save to Contacts
                          </Button>
                        </div>
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
