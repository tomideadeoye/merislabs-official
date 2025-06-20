// GOAL OF FILE|FEATURES|FUNCTIONS:
//   - Component for generating personalized outreach messages based on a selected persona.
//   - Integrates with LLM for drafting and handles various message contexts (email, LinkedIn).
// FILEPATH:
//   app/components/orion/networking-hub/OutreachForm.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Uses: '@/components/ui' (Button, Input, Label, Textarea, Select, RadioGroup)
//           '@/lib/stores/outreachGenerationStore' (to manage generated outreach content)
//           '@/lib/types' (for Persona, OutreachRequest, UserProfileData types)
//           '@/hooks/useUserProfile' (to get user's profile as context)
//           'lucide-react' (for icons)
//   - Connects to: '/api/orion/outreach/generate' (for POST requests to LLM)
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
//   - Assumes Persona and OutreachRequest types are correctly defined.
//   - Assumes '/api/orion/outreach/generate' endpoint exists and responds with drafted messages.
//   - Assumes useUserProfile hook provides user's profile data.
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunities to consolidate
//   - This form is designed to be highly configurable to produce varied outreach messages.
// TODOS:
//   - Implement more dynamic form fields based on selected `messageType`.
//   - Add a character counter for message length.
// SUGGESTIONS:
//   - Allow user to save/manage multiple outreach templates.
'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Label, Textarea, RadioGroup, RadioGroupItem } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOutreachGenerationStore } from '@/lib/stores/outreachGenerationStore';
import { useUserProfile } from '@/hooks/useUserProfile';
import type { Persona, OutreachRequest } from '@/lib/types';
import { Loader2, Mail, Linkedin, MessageCircle, XCircle } from 'lucide-react';
import logger from '@/lib/logger';

interface OutreachFormProps {
  persona: Persona;
}

type MessageTone = 'professional' | 'friendly' | 'formal' | 'casual' | 'persuasive' | 'curious';
type MessageLength = 'short' | 'standard' | 'detailed';
type MessageFormat = 'email' | 'linkedin' | 'whatsapp';

export function OutreachForm({ persona }: OutreachFormProps) {
  const { setLatestOutreach, setIsLoading, setError, isLoading, error } = useOutreachGenerationStore();
  const { profile: userProfile, loading: profileLoading, error: profileError } = useUserProfile();

  const [messageType, setMessageType] = useState<MessageFormat>('email');
  const [outreachGoal, setOutreachGoal] = useState<string>('');
  const [specificContext, setSpecificContext] = useState<string>('');
  const [tone, setTone] = useState<MessageTone>('professional');
  const [length, setLength] = useState<MessageLength>('standard');
  const [callToAction, setCallToAction] = useState<string>('');

  useEffect(() => {
    logger.info('[OutreachForm] Persona selected for outreach', { personaName: persona.name });
    // Reset outreach draft when persona changes
    setLatestOutreach(null);
    setError(null);
  }, [persona, setLatestOutreach, setError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setLatestOutreach(null); // Clear previous draft
    logger.info('[OutreachForm] Generating outreach message', { messageType, tone, length, personaId: persona.id });

    if (!outreachGoal.trim()) {
      setError('Outreach goal is required.');
      setIsLoading(false);
      logger.warn('[OutreachForm] Outreach goal is empty.');
      return;
    }

    if (profileLoading) {
      setError('User profile is still loading. Please wait.');
      setIsLoading(false);
      logger.warn('[OutreachForm] User profile still loading during submission.');
      return;
    }

    if (profileError || !userProfile) {
      setError('Failed to load user profile. Cannot generate outreach without it.');
      setIsLoading(false);
      logger.error('[OutreachForm] User profile missing or errored.', { profileError });
      return;
    }

    try {
      const requestBody: OutreachRequest = {
        persona: persona,
        outreachGoal: outreachGoal,
        messageType: messageType,
        tone: tone,
        length: length,
        specificContext: specificContext,
        callToAction: callToAction,
        userProfile: userProfile,
      };
      logger.debug('[OutreachForm] Sending outreach generation request', { requestBody });

      const response = await fetch('/api/orion/outreach/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (result.success && result.outreach) {
        setLatestOutreach(result.outreach);
        logger.success('[OutreachForm] Outreach generated successfully.');
      } else {
        throw new Error(result.error || 'Failed to generate outreach.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      logger.error('[OutreachForm] Error generating outreach', { error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-green-400">Craft Outreach for {persona.name}</CardTitle>
        <div className="text-gray-400 text-sm">
          <p>
            <span className="font-semibold">Description:</span> {persona.description}
          </p>
          <p>
            <span className="font-semibold">Traits:</span> {persona.traits?.join(', ') || 'N/A'}
          </p>
          <p>
            <span className="font-semibold">Goals:</span> {persona.goals?.join(', ') || 'N/A'}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {persona.role || 'N/A'} at {persona.company || 'N/A'}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="outreachGoal" className="text-gray-300">
              My Goal for this Outreach*
            </Label>
            <Input
              id="outreachGoal"
              type="text"
              value={outreachGoal}
              onChange={(e) => setOutreachGoal(e.target.value)}
              placeholder="e.g., Introduce myself for a potential role, request an informational interview, follow up on a meeting"
              className="bg-gray-700 border-gray-600 text-gray-200"
              required
            />
          </div>

          <div>
            <Label htmlFor="specificContext" className="text-gray-300">
              Specific Context (Optional)
            </Label>
            <Textarea
              id="specificContext"
              value={specificContext}
              onChange={(e) => setSpecificContext(e.target.value)}
              rows={3}
              placeholder="e.g., We met at the 'Future of AI' conference; I saw your post on X about generative models; I'm applying for the Senior PM role."
              className="bg-gray-700 border-gray-600 text-gray-200"
            />
          </div>

          <div>
            <Label htmlFor="messageType" className="text-gray-300">
              Message Format
            </Label>
            <Select value={messageType} onValueChange={(value) => setMessageType(value as MessageFormat)}>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-200">
                <SelectValue placeholder="Select message type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                <SelectItem value="email" className="hover:bg-gray-700">
                  <Mail className="inline-block mr-2 h-4 w-4" /> Email
                </SelectItem>
                <SelectItem value="linkedin" className="hover:bg-gray-700">
                  <Linkedin className="inline-block mr-2 h-4 w-4" /> LinkedIn Message
                </SelectItem>
                <SelectItem value="whatsapp" className="hover:bg-gray-700">
                  <MessageCircle className="inline-block mr-2 h-4 w-4" /> WhatsApp Message
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300">Tone</Label>
            <RadioGroup
              value={tone}
              onValueChange={(value) => setTone(value as MessageTone)}
              className="flex flex-wrap gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="tone-professional" className="text-blue-400" />
                <Label htmlFor="tone-professional" className="text-gray-300">
                  Professional
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friendly" id="tone-friendly" className="text-blue-400" />
                <Label htmlFor="tone-friendly" className="text-gray-300">
                  Friendly
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="formal" id="tone-formal" className="text-blue-400" />
                <Label htmlFor="tone-formal" className="text-gray-300">
                  Formal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="casual" id="tone-casual" className="text-blue-400" />
                <Label htmlFor="tone-casual" className="text-gray-300">
                  Casual
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="persuasive" id="tone-persuasive" className="text-blue-400" />
                <Label htmlFor="tone-persuasive" className="text-gray-300">
                  Persuasive
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="curious" id="tone-curious" className="text-blue-400" />
                <Label htmlFor="tone-curious" className="text-gray-300">
                  Curious
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-gray-300">Length</Label>
            <RadioGroup
              value={length}
              onValueChange={(value) => setLength(value as MessageLength)}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="short" id="length-short" className="text-blue-400" />
                <Label htmlFor="length-short" className="text-gray-300">
                  Short
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="length-standard" className="text-blue-400" />
                <Label htmlFor="length-standard" className="text-gray-300">
                  Standard
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="detailed" id="length-detailed" className="text-blue-400" />
                <Label htmlFor="length-detailed" className="text-gray-300">
                  Detailed
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="callToAction" className="text-gray-300">
              Call to Action (Optional)
            </Label>
            <Input
              id="callToAction"
              type="text"
              value={callToAction}
              onChange={(e) => setCallToAction(e.target.value)}
              placeholder="e.g., Suggest a 15-min call next week; Ask for a referral; Invite them to coffee"
              className="bg-gray-700 border-gray-600 text-gray-200"
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-900/30 border border-red-700 text-red-300 flex items-center space-x-2">
              <XCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || profileLoading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Outreach Message'
            )}
          </Button>
          {profileLoading && <p className="text-gray-400 text-center text-sm">Loading user profile...</p>}
        </form>
      </CardContent>
    </Card>
  );
}
