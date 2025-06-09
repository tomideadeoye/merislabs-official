"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Linkedin } from 'lucide-react';

interface Stakeholder {
  name: string;
  title: string;
  email?: string;
  linkedin?: string;
}

interface StakeholderOutreachProps {
  opportunityId: string;
  companyName: string;
}

export const StakeholderOutreach: React.FC<StakeholderOutreachProps> = ({ opportunityId, companyName }) => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(companyName);

  const findStakeholders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/orion/networking/find-stakeholders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: searchQuery, opportunityId }),
      });
      const data = await response.json();
      if (data.success) {
        setStakeholders(data.stakeholders);
      } else {
        setError(data.error || 'Failed to find stakeholders.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDraftEmail = (stakeholder: Stakeholder) => {
    // Placeholder for drafting email
    console.log('Drafting email for:', stakeholder);
  };

  const handleDraftLinkedIn = (stakeholder: Stakeholder) => {
    // Placeholder for drafting LinkedIn message
    console.log('Drafting LinkedIn message for:', stakeholder);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stakeholder Outreach</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter company name to search"
          />
          <Button onClick={findStakeholders} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Find Stakeholders'}
          </Button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {stakeholders.map((stakeholder, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <div>
                <p className="font-bold flex items-center"><User className="w-4 h-4 mr-2" />{stakeholder.name}</p>
                <p className="text-sm text-gray-500">{stakeholder.title}</p>
              </div>
              <div className="flex gap-2">
                {stakeholder.email && (
                  <Button variant="outline" size="sm" onClick={() => handleDraftEmail(stakeholder)}>
                    <Mail className="w-4 h-4 mr-1" /> Email
                  </Button>
                )}
                {stakeholder.linkedin && (
                  <Button variant="outline" size="sm" onClick={() => handleDraftLinkedIn(stakeholder)}>
                    <Linkedin className="w-4 h-4 mr-1" /> LinkedIn
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
