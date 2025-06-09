"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertTriangle, Users, Send, Copy, ExternalLink } from 'lucide-react';
import { Badge } from '@/comp.onents/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { useMultiSelectStore } from '@/components/ui/multiSelectStore';

// Default stakeholder roles for networking
const DEFAULT_STAKEHOLDER_ROLES = [
  "CEO",
  "Founder",
  "Hiring Manager",
  "Technical Lead",
  "Engineering Manager",
  "Product Manager",
  "Director",
  "VP Engineering",
  "VP Product",
  "CTO",
  "COO",
  "Recruiter",
  "HR Manager",
];

interface Stakeholder {
  name: string;
  role: string;
  company: string;
  linkedin_url?: string;
  email?: string;
  person_snippet?: string;
}

interface StakeholderWithOutreach extends Stakeholder {
  outreachDraft?: string;
}

interface OpportunityNetworkingProps {
  className?: string;
  opportunityTitle?: string;
  opportunityCompany?: string;
}

export const OpportunityNetworking: React.FC<OpportunityNetworkingProps> = ({
  className,
  opportunityTitle = '',
  opportunityCompany = ''
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(opportunityCompany);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(DEFAULT_STAKEHOLDER_ROLES.slice(0, 5));
  const multiSelectStore = useMultiSelectStore("networking-roles");
  const [stakeholders, setStakeholders] = useState<StakeholderWithOutreach[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a company name to search for stakeholders.");
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch('/api/orion/networking/stakeholder-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: searchQuery,
          roles: selectedRoles
        })
      });

      const data = await response.json();

      if (data.success) {
        setStakeholders(data.stakeholders || []);
        if (data.stakeholders.length === 0) {
          setError("No stakeholders found. Try different search terms or roles.");
        }
      } else {
        throw new Error(data.error || 'Failed to search for stakeholders');
      }
    } catch (err: any) {
      console.error('Error searching for stakeholders:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerateOutreach = async () => {
    if (stakeholders.length === 0) {
      setError("No stakeholders found. Please search for stakeholders first.");
      return;
    }

    setIsGeneratingOutreach(true);
    setError(null);

    try {
      const updatedStakeholders = [...stakeholders];

      // Generate outreach for each stakeholder
      for (let i = 0; i < updatedStakeholders.length; i++) {
        const stakeholder = updatedStakeholders[i];

        const response = await fetch('/api/orion/networking/generate-outreach', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            stakeholder,
            jobTitle: opportunityTitle,
            additionalInfo: `This outreach is regarding a ${opportunityTitle} position at ${opportunityCompany || stakeholder.company}.`
          })
        });

        const data = await response.json();

        if (data.success) {
          updatedStakeholders[i] = {
            ...stakeholder,
            outreachDraft: data.emailDraft
          };
        }
      }

      setStakeholders(updatedStakeholders);
    } catch (err: any) {
      console.error('Error generating outreach:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsGeneratingOutreach(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  React.useEffect(() => {
    multiSelectStore.getState().setOptions(DEFAULT_STAKEHOLDER_ROLES.map(role => ({ label: role, value: role })));
    multiSelectStore.getState().setSelected(DEFAULT_STAKEHOLDER_ROLES.slice(0, 5));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const unsub = multiSelectStore.subscribe((state) => setSelectedRoles(state.selected));
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Users className="mr-2 h-5 w-5 text-blue-400" />
            Networking Outreach
          </CardTitle>
          <CardDescription className="text-gray-400">
            Find key stakeholders and generate personalized outreach messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Company Name</label>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter company name"
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Target Roles</label>
              <MultiSelect
                id="networking-roles"
                className="bg-gray-700 border-gray-600 text-gray-200"
                placeholder="Select roles"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Find Stakeholders
                </>
              )}
            </Button>

            <Button
              onClick={handleGenerateOutreach}
              disabled={isGeneratingOutreach || stakeholders.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGeneratingOutreach ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Generate Outreach
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {stakeholders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-200">Found Stakeholders</h3>

          {stakeholders.map((stakeholder, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-blue-300">{stakeholder.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {stakeholder.role} at {stakeholder.company}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {stakeholder.linkedin_url && (
                      <a
                        href={stakeholder.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {stakeholder.person_snippet && (
                  <p className="text-sm text-gray-300 mb-4">{stakeholder.person_snippet}</p>
                )}

                {stakeholder.email && (
                  <Badge variant="outline" className="mb-4 border-gray-600 text-gray-300">
                    {stakeholder.email}
                  </Badge>
                )}

                {stakeholder.outreachDraft ? (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-purple-400">Outreach Draft</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(stakeholder.outreachDraft || '')}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={stakeholder.outreachDraft}
                      readOnly
                      className="min-h-[150px] bg-gray-700 border-gray-600 text-gray-200"
                    />
                  </div>
                ) : (
                  <p className="text-gray-400 italic">Generate outreach to see draft messages</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
