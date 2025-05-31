"use client";

import React, { useState } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/app_state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertTriangle, CheckCircle2, Send } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import type { PersonaMap } from '@/types/strategic-outreach';

interface OutreachFormProps {
  persona: PersonaMap;
  onOutreachGenerated: (draft: string) => void;
}

export const OutreachForm: React.FC<OutreachFormProps> = ({ 
  persona,
  onOutreachGenerated
}) => {
  const [opportunityDetails, setOpportunityDetails] = useSessionState(SessionStateKeys.OUTREACH_OPPORTUNITY, "");
  const [goal, setGoal] = useSessionState(SessionStateKeys.OUTREACH_GOAL, "");
  const [communicationType, setCommunicationType] = useSessionState(SessionStateKeys.OUTREACH_TYPE, "email");
  const [tone, setTone] = useSessionState(SessionStateKeys.OUTREACH_TONE, "professional");
  const [additionalContext, setAdditionalContext] = useState("");
  
  const [isGenerating, setIsGenerating] = useSessionState(SessionStateKeys.OUTREACH_GENERATING, false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!opportunityDetails.trim() || !goal.trim()) {
      setError("Opportunity details and goal are required.");
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/orion/outreach/craft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personaId: persona.id,
          opportunityDetails,
          goal,
          communicationType,
          tone,
          additionalContext: additionalContext.trim() || undefined
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.outreach) {
        onOutreachGenerated(data.outreach.draft);
      } else {
        throw new Error(data.error || 'Failed to generate outreach content.');
      }
    } catch (err: any) {
      console.error('Error generating outreach content:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Send className="mr-2 h-5 w-5 text-blue-400" />
          Craft Outreach for {persona.name}
        </CardTitle>
        <CardDescription className="text-gray-400">
          Generate personalized outreach content based on this persona and your goals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="opportunityDetails" className="text-gray-300">Opportunity Details *</Label>
            <Textarea
              id="opportunityDetails"
              value={opportunityDetails || ""}
              onChange={(e) => setOpportunityDetails(e.target.value)}
              placeholder="Describe the opportunity or context for this outreach"
              className="min-h-[100px] bg-gray-700 border-gray-600 text-gray-200"
              disabled={isGenerating}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="goal" className="text-gray-300">Goal of Outreach *</Label>
            <Input
              id="goal"
              value={goal || ""}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Schedule a meeting, Get feedback on a proposal, etc."
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isGenerating}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="communicationType" className="text-gray-300">Communication Type</Label>
              <Select 
                value={communicationType || "email"} 
                onValueChange={(value) => setCommunicationType(value as any)}
                disabled={isGenerating}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="linkedin">LinkedIn Message</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tone" className="text-gray-300">Tone</Label>
              <Select 
                value={tone || "professional"} 
                onValueChange={(value) => setTone(value as any)}
                disabled={isGenerating}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="additionalContext" className="text-gray-300">Additional Context (Optional)</Label>
            <Textarea
              id="additionalContext"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Any additional information that might be helpful"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isGenerating}
            />
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={isGenerating || !opportunityDetails?.trim() || !goal?.trim()} 
            className="bg-blue-600 hover:bg-blue-700 w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Outreach Content...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Generate Outreach Content
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};