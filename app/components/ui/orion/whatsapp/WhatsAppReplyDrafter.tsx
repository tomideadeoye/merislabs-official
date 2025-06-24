/**
 * @fileoverview This component facilitates the drafting of hyper-personalized WhatsApp replies,
 *   leveraging Orion's Large Language Model (LLM) and comprehensive user context.
 * @description It provides an interface for users to input chat transcripts, specify reply goals,
 *   and receive multiple, strategically ranked draft replies, integrating deeply with Orion's memory
 *   and user profile for enhanced personalization. Orion's goal is to be a sophisticated communication
 *   assistant that reflects Tomide's unique persona and objectives, focusing on contextual precision,
 *   personalization, goal-oriented communication, brevity, clarity, and emotional intelligence.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To enable the generation of hyper-personalized reply drafts for WhatsApp messages, reflecting Tomide's authentic persona and tone (friendly, enthusiastic, approachable, conversational, informal, appropriate emoji usage, thoughtful humor, emotional nuance).
 *   - To allow users to define explicit reply goals (clarify, set boundary, express gratitude, request support, withdraw, etc.) and choose desired tones (empathetic, assertive, humorous, formal, etc.).
 *   - To integrate deeply with Orion's LLM, user profile, and Qdrant memory for intelligent, contextually aware reply suggestions. This now includes fetching and displaying relevant memory chunks.
 *   - To present multiple distinct draft options (defaulting to 3), each with a ranked recommendation and a one-sentence rationale for its strategy/tone.
 *   - To provide robust options to save generated drafts and analysis insights back into Orion's memory system, with duplicate prevention.
 *   - To implement a "Self-Respect Check" for Tomide, ensuring replies honor values and reflect desired post-sending feelings.
 *   - To offer "Mindfulness Integration" at the end of drafting sessions, providing reflection prompts.
 *   - **Memory Visualization**: To display the specific memory chunks (from Orion's Qdrant database) that were retrieved and utilized by the LLM during the reply generation process, enhancing transparency and user understanding.
 *
 * FILEPATH: `app/components/ui/orion/whatsapp/WhatsAppReplyDrafter.tsx`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/draft-communication/DraftCommunicationClientWrapper.tsx`: This component is rendered within the 'WhatsApp Tools' tab of the Draft Communication module and passes `analyzedChatData`.
 *   - `useUserProfile` (`@/hooks/useUserProfile`): Fetches the user's profile context for personalization, ensuring replies sound authentically Tomide.
 *   - `/api/orion/communication/draft-whatsapp-reply/route.ts`: The primary backend API endpoint that this component interacts with. It now sends `chatTranscript`, `userProfileContext`, `replyGoal`, `tone`, and `numberOfDrafts`, and receives `reply` drafts along with `memoryResults`.
 *   - `/api/orion/memory/search`: This API is indirectly called by `draft-whatsapp-reply/route.ts` to retrieve relevant memories that influence the LLM's output.
 *   - `/api/orion/memory/save`: Used for saving generated drafts and analysis insights to memory (Qdrant, Notion, Postgres).
 *   - `generateLLMResponse` (`lib/orion_llm`): The core LLM call utility (backend) that processes context, including retrieved memories, and generates replies.
 *   - `DedicatedAddToMemoryFormComponent` (implied integration): For saving drafts to memory.
 *   - `react-hot-toast`: Used for displaying success/error notifications.
 *   - `app/components/ui/orion/QuadrantMemoryChunksVisualizer.tsx`: This component is now integrated directly to visually represent the `memoryResults` retrieved from the backend API, showing what memories influenced the reply generation.
 *   - `http://localhost:8000/analyze-chat` (External Python API Endpoint): This is the *actual* source of structured chat data, which is processed by the external Python service and then proxied via `/api/orion/whatsapp/analyze`. This data pre-fills the `chatTranscript`.
 *   - `app/components/orion/whatsapp/WhatsAppChatAnalysis.tsx`: Displays insights from chat analysis, and `analyzedChatData` from here informs this drafter.
 *   - `@/lib/types/index.ts` and `@/lib/types/llm.ts`: Define the `CombinedLLMResponse` and `ScoredMemoryPoint` interfaces, crucial for type-safe handling of LLM outputs and memory data.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - This component is client-side (`'use client'`) due to its use of React hooks and interactive elements.
 *   - Assumes the backend API endpoint `app/api/orion/communication/draft-whatsapp-reply/route.ts` is fully operational and correctly returns `memoryResults` in its response.
 *   - User profile data is essential for deeper personalization, though optional.
 *   - The LLM backend is expected to handle the nuanced logic of tone, persona, and strategic goals based on prompt engineering, now also incorporating memory context.
 *   - Brevity, clarity, and emotional intelligence in drafts are heavily dependent on robust LLM prompting and capabilities.
 *   - Privacy and secure handling of chat data are paramount, with temporary files used for processing.
 *   - The `Select.Item` components correctly use non-empty string values (e.g., "none") for their `value` props to avoid Radix UI errors.
 *
 * NOTES:
 *   - This component is a cornerstone of Orion's relational and strategic intelligence, translating raw communication into actionable, emotionally intelligent responses.
 *   - The OODA (Observe, Orient, Decide, Act) Loop framework guides the underlying logic:
 *     - **Observe:** Chat transcript parsing (`orion_chat_analyzer.py`), initial analysis.
 *     - **Orient:** Analyzing observations against user profile, memories (now explicitly visualized), and known communication patterns, detecting triggers.
 *     - **Decide:** Presenting strategic options for reply goals (e.g., de-escalate, assert boundary, disengage).
 *     - **Act:** Drafting multiple replies based on chosen strategies.
 *   - The ability to specify reply goals, relationship context, and leverage memory will significantly enhance the quality and relevance of drafts.
 *   - Technical robustness considerations: Preventing infinite loops (managed by `useEffect` dependencies), providing fallbacks (currently error messages, future: basic rule-based replies), and managing LLM context limits.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Configurable Reply Parameters**: Allow users to configure various parameters for reply generation, such as desired length, formality, and specific keywords to include/exclude.
 *   - **Mood-based Reply Generation**: Integrate a "mood" selection or detection feature to influence the emotional tone and empathy of the generated replies.
 *   - **Direct Memory Saving of Drafts**: Streamline the process of saving chosen drafts or the entire conversation context back to Orion's memory.
 *   - **Pre-filled Reply Context**: Allow selection of a specific message from `WhatsAppChatAnalysis` to pre-fill context for a targeted reply.
 *   - **Actionable Steps/Habitica Integration**: Based on chat analysis, suggest potential next actions or allow direct creation of tasks in Habitica.
 *   - **Enhanced Error Handling**: Implement more robust fallbacks (e.g., simple rule-based replies if LLM fails) and more specific error messages.
 *   - **User Feedback Loop**: Implement UI for users to provide feedback on the effectiveness of generated replies, to refine future drafts and analyze successful communication patterns.
 *   - **Relationship Context Nuance**: Introduce a more structured way to define and leverage nuanced relationship types for fine-grained tone and content tailoring.
 *   - **Psychological Principle Integration:** Explicitly allow selection or display of psychological principles (Reciprocity, Liking, Authority) to guide reply generation.
 *   - **OODA Loop UI/Control**: Develop UI elements that visually represent and allow user control over the "Orient" and "Decide" phases of the OODA loop, making Orion's reasoning more transparent and adjustable.
 *
 * CURRENT MODIFICATION RATIONALE:
 *   - This modification specifically addresses a TypeScript type incompatibility between `ScoredMemoryPoint[]`
 *     (received from the backend API, representing memory search results) and the `MemoryChunk[]` type
 *     expected by the `QuadrantMemoryChunksVisualizer` component.
 *   - The goal is to ensure that the `usedMemoryChunks` state, which holds the retrieved memories,
 *     is correctly mapped to the `MemoryChunk` structure expected by the visualizer.
 *   - This involves transforming `ScoredMemoryPoint` objects, which contain memory data nested under a `payload` property,
 *     into a flattened `MemoryChunk` structure where `text`, `quadrant`, and `source` are directly accessible,
 *     thus resolving `TS2322` and related property access errors.
 *   - This aligns with the principle of ensuring type safety throughout the application and maintaining
 *     a clear, predictable data flow for UI components.
 *
 * NOTE: This section documents the *specific changes currently being applied*, not the overall file purpose.
 * It will be updated or removed upon completion of the current task.
 */
'use client';

import { useState, useEffect } from 'react';
import { Button, Textarea, Label, Card, CardContent, CardHeader, CardTitle, Badge, Input } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Sparkles, MessageSquare, Loader2, InfoIcon, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useUserProfile from '@/hooks/useUserProfile';
import { ScoredMemoryPoint } from '@/lib/types/memory';
import { QuadrantMemoryChunksVisualizer } from '@/components/ui/orion/QuadrantMemoryChunksVisualizer';

// Define interfaces for chat analysis data
interface ParsedWhatsAppMessage {
  date: string; // e.g., "12/01/2023, 10:00"
  sender: string;
  message: string;
}

interface WhatsAppChatAnalysisData {
  messages: ParsedWhatsAppMessage[];
  overallSentiment?: string; // e.g., 'positive', 'neutral', 'negative'
  sentimentScore?: number; // e.g., between -1 and 1
}

interface SuggestedReply {
  text: string;
  explanation: string;
  rank: number;
}

interface WhatsAppReplyDrafterProps {
  initialChatTranscript?: string;
  initialUserProfileContext?: string;
  analyzedChatData?: WhatsAppChatAnalysisData | null;
}

const WhatsAppReplyDrafter: React.FC<WhatsAppReplyDrafterProps> = ({
  initialChatTranscript = '',
  initialUserProfileContext = '',
  analyzedChatData = null,
}) => {
  const [chatTranscript, setChatTranscript] = useState(initialChatTranscript);
  const [userProfileContext, setUserProfileContext] = useState(initialUserProfileContext);
  const [replyGoal, setReplyGoal] = useState<string>('none');
  const [tone, setTone] = useState<string>('none');
  const [suggestedReplies, setSuggestedReplies] = useState<SuggestedReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numberOfDrafts, setNumberOfDrafts] = useState<number>(3);
  const [usedMemoryChunks, setUsedMemoryChunks] = useState<ScoredMemoryPoint[]>([]);

  const { profile, isLoading: profileLoading, error: profileError } = useUserProfile();

  useEffect(() => {
    if (profile?.summary && !initialUserProfileContext) {
      setUserProfileContext(profile.summary);
    }
  }, [profile, initialUserProfileContext]);

  useEffect(() => {
    if (analyzedChatData && analyzedChatData.messages && analyzedChatData.messages.length > 0) {
      // Convert analyzed chat messages back to a string for the LLM
      const formattedChatForLLM = analyzedChatData.messages
        .map((msg: ParsedWhatsAppMessage) => `${msg.date} - ${msg.sender}: ${msg.message}`)
        .join('\n');
      setChatTranscript(formattedChatForLLM);
    } else if (initialChatTranscript) {
      setChatTranscript(initialChatTranscript);
    }
  }, [analyzedChatData, initialChatTranscript]);

  const handleSuggestReplies = async () => {
    setLoading(true);
    setError(null);
    setSuggestedReplies([]);
    try {
      if (!chatTranscript.trim()) {
        setError('Please enter a WhatsApp chat transcript or upload a file to analyze.');
        return;
      }

      const response = await fetch('/api/orion/communication/draft-whatsapp-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatTranscript,
          userProfileContext,
          replyGoal,
          tone,
          numberOfDrafts,
          overallSentiment: analyzedChatData?.overallSentiment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to suggest replies.');
      }

      const replyResult = await response.json();
      setSuggestedReplies(replyResult.drafts || []);
      if (replyResult.memoryResults) {
        const mappedMemoryChunks = replyResult.memoryResults.map((item: ScoredMemoryPoint) => ({
          text: item.payload?.text,
          quadrant: item.payload?.type || 'Uncategorized', // Use type for quadrant, fallback to Uncategorized
          source: item.payload?.title || item.payload?.type || 'Orion Memory',
        }));
        setUsedMemoryChunks(mappedMemoryChunks);
      }
    } catch (err: unknown) {
      console.error('Error suggesting replies:', err);
      setError((err as Error).message || 'Failed to suggest replies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Reply copied to clipboard!');
  };

  // Determine sentiment badge color, matching logic in WhatsAppChatAnalysis.tsx
  const getSentimentColor = (sentiment: string | undefined) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-green-600';
      case 'negative':
        return 'bg-red-600';
      case 'neutral':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
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
            WhatsApp Chat Transcript (Auto-filled from analysis or paste here)
          </Label>
          <Textarea
            id="chatTranscript"
            value={chatTranscript}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setChatTranscript(e.target.value)}
            placeholder="Paste your WhatsApp chat transcript here or upload a file via Chat Analysis tab..."
            rows={8}
            className="bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500"
          />
        </div>

        {analyzedChatData?.overallSentiment && (
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <p className="text-gray-300">
              Chat Sentiment:{' '}
              <Badge className={getSentimentColor(analyzedChatData.overallSentiment)}>
                {analyzedChatData.overallSentiment}
              </Badge>
            </p>
          </div>
        )}

        {analyzedChatData?.sentimentScore !== undefined && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Sentiment Score:</span>
            <Badge className="bg-gray-600">{analyzedChatData.sentimentScore.toFixed(2)}</Badge>
          </div>
        )}

        <div>
          <Label htmlFor="userProfileContext" className="text-sm text-gray-300 mb-1 block">
            Your User Profile Context (Optional, for personalization)
          </Label>
          {profileLoading && <p className="text-xs text-gray-500">Loading user profile...</p>}
          {profileError && <p className="text-xs text-red-500">Error loading profile: {profileError}</p>}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="replyGoal" className="text-sm text-gray-300 mb-1 block">
              Reply Goal
            </Label>
            <Select onValueChange={setReplyGoal} value={replyGoal}>
              <SelectTrigger className="w-full bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500">
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-gray-200 border-gray-600">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="clarify">Clarify</SelectItem>
                <SelectItem value="set_boundary">Set Boundary</SelectItem>
                <SelectItem value="express_gratitude">Express Gratitude</SelectItem>
                <SelectItem value="request_support">Request Support</SelectItem>
                <SelectItem value="withdraw">Withdraw</SelectItem>
                <SelectItem value="offer_assistance">Offer Assistance</SelectItem>
                <SelectItem value="de_escalate">De-escalate</SelectItem>
                <SelectItem value="assert">Assert</SelectItem>
                <SelectItem value="apologize">Apologize</SelectItem>
                <SelectItem value="negotiate">Negotiate</SelectItem>
                <SelectItem value="inform">Inform</SelectItem>
                <SelectItem value="persuade">Persuade</SelectItem>
                <SelectItem value="motivate">Motivate</SelectItem>
                <SelectItem value="celebrate">Celebrate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tone" className="text-sm text-gray-300 mb-1 block">
              Tone
            </Label>
            <Select onValueChange={setTone} value={tone}>
              <SelectTrigger className="w-full bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500">
                <SelectValue placeholder="Select a tone" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-gray-200 border-gray-200">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                <SelectItem value="approachable">Approachable</SelectItem>
                <SelectItem value="conversational">Conversational</SelectItem>
                <SelectItem value="informal">Informal</SelectItem>
                <SelectItem value="empathetic">Empathetic</SelectItem>
                <SelectItem value="assertive">Assertive</SelectItem>
                <SelectItem value="humorous">Humorous</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="grateful">Grateful</SelectItem>
                <SelectItem value="apologetic">Apologetic</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="caring">Caring (for Timi)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="numberOfDrafts" className="text-sm text-gray-300 mb-1 block">
            Number of Drafts (1-5)
          </Label>
          <Input
            id="numberOfDrafts"
            type="number"
            value={numberOfDrafts}
            onChange={(e) => setNumberOfDrafts(Math.max(1, Math.min(5, Number(e.target.value))))}
            min={1}
            max={5}
            step={1}
            className="bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500 w-full"
          />
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            <InfoIcon className="h-3 w-3 mr-1 text-gray-500" /> Choose how many reply options Orion should generate.
          </p>
        </div>

        <Button onClick={handleSuggestReplies} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          {loading ? 'Generating Replies...' : 'Suggest Replies'}
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
                <div className="flex-grow">
                  <p className="text-xs text-gray-400 mb-1">
                    <Badge variant="secondary" className="bg-gray-600 text-white mr-2">
                      Rank: {reply.rank}
                    </Badge>
                    {reply.explanation}
                  </p>
                  <Textarea
                    value={reply.text}
                    readOnly
                    rows={reply.text.split('\n').length + 1}
                    className="flex-grow bg-transparent border-none focus:ring-0 text-gray-200 resize-none"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(reply.text)}
                  className="ml-2 text-gray-400 hover:text-green-400"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {usedMemoryChunks.length > 0 && (
          <div className="border border-gray-700 p-4 rounded-lg bg-gray-900 mt-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Memories Used in Generation:</h3>
            <QuadrantMemoryChunksVisualizer chunks={usedMemoryChunks} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsAppReplyDrafter;
