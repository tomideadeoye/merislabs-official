import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Loader2, Star } from 'lucide-react';

const RELATIONSHIP_CONTEXTS = [
  { value: 'timi_girlfriend', label: 'Timi (Girlfriend)' },
  { value: 'close_friend', label: 'Close Friend' },
  { value: 'family_member', label: 'Family Member' },
  { value: 'professional_colleague', label: 'Professional Colleague' },
  { value: 'new_professional_contact', label: 'New Professional Contact' },
  { value: 'formal_correspondence', label: 'Formal Correspondence' },
  { value: 'default', label: 'Default' },
];

export default function WhatsAppReplyDrafter() {
  const [messageToReplyTo, setMessageToReplyTo] = useState('');
  const [messageHistory, setMessageHistory] = useState('');
  const [topicOrGoal, setTopicOrGoal] = useState('');
  const [relationshipContext, setRelationshipContext] = useState('default');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [userProfileContext, setUserProfileContext] = useState('');
  const [numberOfDrafts, setNumberOfDrafts] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<{
    text: string;
    explanation: string;
    rank: number;
  }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDrafts([]);
    try {
      const res = await fetch('/api/orion/communication/draft-whatsapp-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageToReplyTo,
          messageHistory,
          topicOrGoal,
          relationshipContext,
          userProfileContext,
          additionalInstructions,
          numberOfDrafts,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Unknown error');
      setDrafts(data.drafts);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="messageToReplyTo">Message to Reply To</Label>
          <Textarea
            id="messageToReplyTo"
            value={messageToReplyTo}
            onChange={e => setMessageToReplyTo(e.target.value)}
            placeholder="Paste the WhatsApp message you want to reply to..."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="messageHistory">Message History</Label>
          <Textarea
            id="messageHistory"
            value={messageHistory}
            onChange={e => setMessageHistory(e.target.value)}
            placeholder="(Optional) Paste additional chat history for context..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="topicOrGoal">Reply Goal</Label>
          <Input
            id="topicOrGoal"
            value={topicOrGoal}
            onChange={e => setTopicOrGoal(e.target.value)}
            placeholder="What is your goal for this reply? (e.g., clarify, set a boundary, express gratitude)"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="relationshipContext">Relationship Context</Label>
          <Select value={relationshipContext} onValueChange={setRelationshipContext}>
            <SelectTrigger id="relationshipContext">
              <SelectValue placeholder="Select relationship context" />
            </SelectTrigger>
            <SelectContent>
              {RELATIONSHIP_CONTEXTS.map(ctx => (
                <SelectItem key={ctx.value} value={ctx.value}>
                  {ctx.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalInstructions">Additional Instructions</Label>
          <Textarea
            id="additionalInstructions"
            value={additionalInstructions}
            onChange={e => setAdditionalInstructions(e.target.value)}
            placeholder="(Optional) Any specific instructions for this draft?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="userProfileContext">Profile Context</Label>
          <Textarea
            id="userProfileContext"
            value={userProfileContext}
            onChange={e => setUserProfileContext(e.target.value)}
            placeholder="(Optional) Paste your profile context for deeper personalization."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfDrafts">Number of Drafts</Label>
          <Input
            id="numberOfDrafts"
            type="number"
            min={1}
            max={5}
            value={numberOfDrafts}
            onChange={e => setNumberOfDrafts(Number(e.target.value))}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="animate-spin mr-2" /> : null}
          Generate WhatsApp Reply Drafts
        </Button>
      </form>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {drafts.length > 0 && (
        <div className="mt-8 space-y-6">
          {drafts.map((draft, idx) => (
            <Card
              key={idx}
              className={`relative ${draft.rank === 1 ? 'border-2 border-yellow-400 shadow-lg' : 'border'} transition-all`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {draft.rank === 1 && <Star className="text-yellow-400" />}Draft {draft.rank}
                  {draft.rank === 1 && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Orion's Pick</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-base mb-2">{draft.text}</div>
                <div className="text-sm text-gray-600 italic mb-2">{draft.explanation}</div>
                <Button variant="outline" size="sm" onClick={() => handleCopy(draft.text)}>
                  Copy
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
