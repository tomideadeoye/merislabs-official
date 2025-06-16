'use client';

import { useState, useEffect } from 'react';
import { Button, Textarea, Label, Card, CardContent, CardHeader, CardTitle, Badge } from '@/ui/components/ui';
import { Copy, Sparkles, MessageSquare, Loader2, InfoIcon, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useUserProfile } from '@/app/index';

/**
 * WhatsAppReplyDrafter
 * GOAL: Analyze a WhatsApp chat transcript to suggest replies, leveraging LLM and user profile context.
 * Connects to: LLM services (via API route), user profile data, session state for API keys.
 * RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
 * - Calls `/api/orion/whatsapp/analyze` for LLM processing.
 * - Uses `useUserProfile` for user context.
 * - Interacts with `react-hot-toast` for notifications.
 */

interface WhatsAppReplyDrafterProps {
  initialChatTranscript?: string;
  initialUserProfileContext?: string;
}

const WhatsAppReplyDrafter: React.FC<WhatsAppReplyDrafterProps> = ({
  initialChatTranscript = '',
  initialUserProfileContext = '',
}) => {
  const [chatTranscript, setChatTranscript] = useState(initialChatTranscript);
  const [userProfileContext, setUserProfileContext] = useState(initialUserProfileContext);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { profile, loading: profileLoading, error: profileError } = useUserProfile();

  useEffect(() => {
    if (profile?.summary && !initialUserProfileContext) {
      setUserProfileContext(profile.summary);
    }
  }, [profile, initialUserProfileContext]);

  const handleAnalyzeChat = async () => {
    setLoading(true);
    setError(null);
    setSuggestedReplies([]);
    try {
      if (!chatTranscript.trim()) {
        setError('Please enter a WhatsApp chat transcript to analyze.');
        return;
      }

      const response = await fetch('/api/orion/whatsapp/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatTranscript,
          userProfileContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze chat.');
      }

      const analysisResult = await response.json();
      setSuggestedReplies(analysisResult.suggested_replies);
    } catch (err: unknown) {
      console.error('Error analyzing chat:', err);
      setError((err as Error).message || 'Failed to analyze chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Reply copied to clipboard!');
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-green-300 flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" /> WhatsApp Reply Drafter
        </CardTitle>
        <Badge variant="outline" className="mt-2 text-xs text-gray-400 border-gray-600">
          Leverages LLM for smart reply suggestions
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="chatTranscript" className="text-sm text-gray-300 mb-1 block">
            WhatsApp Chat Transcript
          </Label>
          <Textarea
            id="chatTranscript"
            value={chatTranscript}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setChatTranscript(e.target.value)}
            placeholder="Paste your WhatsApp chat transcript here..."
            rows={8}
            className="bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500"
          />
        </div>

        <div>
          <Label htmlFor="userProfileContext" className="text-sm text-gray-300 mb-1 block">
            Your User Profile Context (Optional, for personalization)
          </Label>
          {profileLoading && <p className="text-xs text-gray-500">Loading user profile...</p>}
          {profileError && <p className="text-xs text-red-500">Error loading profile: {profileError.message}</p>}
          <Textarea
            id="userProfileContext"
            value={userProfileContext}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserProfileContext(e.target.value)}
            placeholder="e.g., 'I am a software engineer specializing in AI and data science, looking for opportunities to build impactful products.'"
            rows={4}
            className="bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            <InfoIcon className="h-3 w-3 mr-1 text-gray-500" /> This context helps the AI generate more personalized
            replies.
          </p>
        </div>

        <Button onClick={handleAnalyzeChat} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          {loading ? 'Analyzing...' : 'Suggest Replies'}
        </Button>

        {error && (
          <div className="bg-red-900/30 text-red-300 p-3 rounded-md flex items-center space-x-2">
            <XCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {suggestedReplies.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-md font-semibold text-gray-300">Suggested Replies:</h3>
            {suggestedReplies.map((reply, index) => (
              <div key={index} className="flex items-start bg-gray-700/50 p-3 rounded-md border border-gray-600">
                <Textarea
                  value={reply}
                  readOnly
                  rows={reply.split('\n').length + 1}
                  className="flex-grow bg-transparent border-none focus:ring-0 text-gray-200 resize-none"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(reply)}
                  className="ml-2 text-gray-400 hover:text-green-400"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsAppReplyDrafter;
