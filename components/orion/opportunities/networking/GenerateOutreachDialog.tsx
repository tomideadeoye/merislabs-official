"use client";

import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui';
import { Loader2, Copy, MessageSquare, Mail } from 'lucide-react';
import type { Opportunity } from '@shared/types/opportunity';
import { useOpportunityCentralStore } from '../opportunityCentralStore';

interface Stakeholder {
  name: string;
  role: string;
  company: string;
  linkedin_url?: string;
  email?: string;
}

export const GenerateOutreachDialog: React.FC = () => {
  const isOpen = useOpportunityCentralStore((state: any) => state.isOpen);
  const close = useOpportunityCentralStore((state: any) => state.close);
  const stakeholder = useOpportunityCentralStore((state: any) => state.stakeholder);
  const opportunityTitle = useOpportunityCentralStore((state: any) => state.opportunityTitle);
  const opportunityCompany = useOpportunityCentralStore((state: any) => state.opportunityCompany);
  const onOutreachGenerated = useOpportunityCentralStore((state: any) => state.onOutreachGenerated);
  // For backward compatibility, opportunity may be undefined, so fallback to empty object
  const opportunity = opportunityTitle && opportunityCompany
    ? { title: opportunityTitle, company: opportunityCompany, content: '' }
    : undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [outreachContent, setOutreachContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('linkedin');

  const handleGenerateOutreach = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch user profile data
      const profileResponse = await fetch('/api/orion/profile');
      const profileData = await profileResponse.json();

      if (!profileData.success) {
        throw new Error(profileData.error || 'Failed to fetch profile data');
      }

      // Call the generate outreach API
      if (!opportunity) {
        setError('Opportunity context is missing.');
        setIsLoading(false);
        return;
      }
      const response = await fetch('/api/orion/networking/generate-outreach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stakeholder: stakeholder,
          context: `This outreach is regarding the ${opportunity?.title ?? ''} position at ${opportunity?.company ?? ''}.`,
          profileData: profileData.profile,
          additionalInfo: opportunity?.content ?? '',
          jobTitle: opportunity?.title ?? ''
        })
      });

      const data = await response.json();

      if (data.success && data.emailDraft) {
        setOutreachContent(data.emailDraft);
      } else {
        throw new Error(data.error || 'Failed to generate outreach message');
      }
    } catch (err: any) {
      console.error('Error generating outreach message:', err);
      setError(err.message || 'An error occurred while generating outreach message');
    } finally {
      setIsLoading(false);
    }
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

  // Extract LinkedIn message and Email message from the content
  const parseOutreachContent = () => {
    if (!outreachContent) return { linkedin: '', email: '' };

    const linkedinMatch = outreachContent.match(/LinkedIn Connection Request:([\s\S]*?)(?=Email Outreach:|$)/i);
    const emailMatch = outreachContent.match(/Email Outreach:([\s\S]*?)$/i);

    return {
      linkedin: linkedinMatch ? linkedinMatch[1].trim() : '',
      email: emailMatch ? emailMatch[1].trim() : ''
    };
  };

  const { linkedin, email } = parseOutreachContent();

  if (!opportunity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) close(); }}>
      <DialogContent className="sm:max-w-[700px] bg-gray-800 border-gray-700 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-purple-400">
            Draft Outreach to {stakeholder?.name}
          </DialogTitle>
        </DialogHeader>

        {!outreachContent && !isLoading && !error && (
          <div className="py-6 text-center">
            <p className="mb-4 text-gray-300">
              Generate personalized outreach messages for {stakeholder?.name} ({stakeholder?.role} at {stakeholder?.company}).
            </p>
            <Button
              onClick={handleGenerateOutreach}
              className="bg-green-600 hover:bg-green-700"
            >
              Generate Outreach Messages
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="py-10 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-400" />
            <p className="text-gray-300">Generating personalized outreach messages...</p>
            <p className="text-xs text-gray-500 mt-2">This may take a moment as we craft tailored messages.</p>
          </div>
        )}

        {error && (
          <div className="py-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button
              onClick={handleGenerateOutreach}
              className="bg-green-600 hover:bg-green-700"
            >
              Try Again
            </Button>
          </div>
        )}

        {outreachContent && (
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-gray-700 border-gray-600">
                <TabsTrigger
                  value="linkedin"
                  className="data-[state=active]:bg-blue-600"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  LinkedIn Message
                </TabsTrigger>
                <TabsTrigger
                  value="email"
                  className="data-[state=active]:bg-purple-600"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="linkedin" className="mt-4">
                <div className="relative bg-gray-700 p-4 rounded-md border border-gray-600">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                    onClick={() => copyToClipboard(linkedin)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>

                  <div className="whitespace-pre-wrap text-gray-200 pr-8">
                    {linkedin}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-xs text-gray-400">
                    LinkedIn connection requests have a 300 character limit
                  </p>
                  <Button
                    onClick={() => copyToClipboard(linkedin)}
                    variant="outline"
                    className="text-gray-300 border-gray-600"
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="email" className="mt-4">
                <div className="relative bg-gray-700 p-4 rounded-md border border-gray-600">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                    onClick={() => copyToClipboard(email)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>

                  <div className="whitespace-pre-wrap text-gray-200 pr-8">
                    {email}
                  </div>
                </div>

                <div className="flex justify-end items-center mt-4">
                  <Button
                    onClick={() => copyToClipboard(email)}
                    variant="outline"
                    className="text-gray-300 border-gray-600"
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="pt-2 text-center">
              <Button
                onClick={handleGenerateOutreach}
                variant="outline"
                className="text-gray-300 border-gray-600"
              >
                Regenerate Messages
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
