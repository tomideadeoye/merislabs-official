/**
 * Unified WhatsApp Reply Drafter: A strategic command console for communication.
 * - Allows paste or .txt upload of WhatsApp chat transcript.
 * - Captures strategic inputs: Reply Goal, Desired Tone, Reply Types, User Context.
 * - If no reply types are selected, it defaults to generating all types.
 * - On "Generate Reply", sends a comprehensive payload to the backend for analysis and drafting.
 * - Renders a structured markdown response including deep analysis and categorized reply options.
 * - Integrates memory visualization and an option to save results.
 */
'use client';

import React, { useState, useRef } from 'react';
import {
  Button,
  Textarea,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
} from '@/components/ui';
import { Loader2, UploadCloud, Sparkles, XCircle, BrainCircuit, Bot, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { QuadrantMemoryChunksVisualizer } from '@/components/ui/orion/QuadrantMemoryChunksVisualizer';
import ReactMarkdown from 'react-markdown';
import UnifiedSaveToMemoryComponent from '../UnifiedSaveToMemoryComponent';
// import { UnifiedSaveToMemoryComponent } from '@/components/ui/orion/UnifiedSaveToMemoryComponent'; // Assuming this component exists

// Define types and constants for our new state
type DesiredTone = 'Architect' | 'Strategist' | 'Collaborator' | 'Khan' | 'Neutral';
type ReplyType = 'Direct Answer' | 'Deflect / Evade' | 'Set a Boundary' | 'Ask a Question' | 'Acknowledge (Empathy)' | 'Aggressive Counter';

const decisionOptions: ReplyType[] = [
  'Direct Answer',
  'Deflect / Evade',
  'Set a Boundary',
  'Ask a Question',
  'Acknowledge (Empathy)',
  'Aggressive Counter',
];

const relationshipOptions = [
  'Romantic',
  'Sibling',
  'Relative',
  'Work Colleague',
  'Client',
  'Professional',
  'Friend',
  'Acquaintance',
  'Other',
];

const WhatsAppReplyDrafter: React.FC = () => {
  const [chatTranscript, setChatTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markdownResult, setMarkdownResult] = useState<string | null>(null);
  const [memoryChunks, setMemoryChunks] = useState<any[]>([]);
  const [showSaveToMemory, setShowSaveToMemory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- NEW STATE FOR STRATEGIC INPUTS ---
  const [replyGoal, setReplyGoal] = useState('');
  const [desiredTone, setDesiredTone] = useState<DesiredTone | "">("");
  const [selectedReplyTypes, setSelectedReplyTypes] = useState<ReplyType[]>([]);
  const [userContext, setUserContext] = useState('');
  const [numberOfDrafts, setNumberOfDrafts] = useState(5);
  const [relationshipType, setRelationshipType] = useState("");

  const handleReplyTypeChange = (type: ReplyType) => {
    setSelectedReplyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'text/plain') {
      toast.error('Only .txt files are supported.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setChatTranscript(text || '');
    };
    reader.onerror = () => toast.error('Error reading file.');
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setChatTranscript(text || '');
      };
      reader.onerror = () => toast.error('Error reading file.');
      reader.readAsText(file);
    } else {
      toast.error('Only .txt files are supported.');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleGenerateReply = async () => {
    setLoading(true);
    setError(null);
    setMarkdownResult(null);
    setShowSaveToMemory(false);
    setMemoryChunks([]);

    try {
      if (!chatTranscript.trim()) {
        setError('Please paste or upload a WhatsApp chat transcript.');
        setLoading(false);
        return;
      }
      if (!relationshipType) {
        setError('Please select a Relationship Type.');
        setLoading(false);
        return;
      }

      // --- NEW: LOGIC TO DEFAULT TO ALL OPTIONS IF NONE ARE SELECTED ---
      const effectiveDecisionOptions = selectedReplyTypes.length > 0
        ? selectedReplyTypes
        : decisionOptions; // Defaults to the full list of all possible types

      const payload = {
        chatContext: chatTranscript,
        replyGoal: replyGoal.trim() || 'Achieve the most advantageous outcome for me.',
        desiredTone: desiredTone || null,
        decisionOptions: effectiveDecisionOptions,
        userContext: userContext.trim(),
        numberOfDrafts,
        relationshipType,
      };

      const response = await fetch('/api/orion/communication/draft-whatsapp-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate reply.');
      }

      const result = await response.json();

      // Robustly extract markdown from response
      let markdown = '';
      if (typeof result.markdown === 'string' && result.markdown.trim()) markdown = result.markdown;
      else if (typeof result.reply === 'string' && result.reply.trim()) markdown = result.reply;
      else if (typeof result.content === 'string' && result.content.trim()) markdown = result.content;

      setMarkdownResult(markdown || 'No reply content returned from backend.');
      if (result.memoryResults) setMemoryChunks(result.memoryResults);
      setShowSaveToMemory(!!markdown);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-green-300 flex items-center">
          <BrainCircuit className="mr-2 h-6 w-6" /> Orion Strategic Comms Console
        </CardTitle>
        <Badge variant="outline" className="mt-2 text-xs text-gray-400 border-gray-600">
          Analyze Context, Leverage Memory, Architect Responses
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* --- SECTION 1: CHAT INPUT --- */}
        <div>
          <Label htmlFor="chatTranscript" className="text-sm font-semibold text-gray-300 mb-2 block">
            1. Input Chat Transcript
          </Label>
          <Textarea
            id="chatTranscript"
            value={chatTranscript}
            onChange={(e) => setChatTranscript(e.target.value)}
            placeholder="Paste your WhatsApp chat transcript here or use the uploader..."
            rows={8}
            className="bg-gray-900 text-gray-200 border-gray-600 focus:border-blue-500"
          />
        </div>
        <div
          className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md cursor-pointer transition-colors border-gray-600 hover:border-blue-500 bg-gray-800/50"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input ref={fileInputRef} type="file" accept=".txt" className="hidden" onChange={handleFileChange} title="Upload WhatsApp chat transcript" />
          <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-300">Drag & drop a .txt file or click to upload</p>
        </div>

        {/* --- SECTION 2: STRATEGIC PARAMETERS --- */}
        <div className="space-y-4 pt-4 border-t border-gray-700">
          <Label className="text-sm font-semibold text-gray-300 mb-2 block">
            2. Define Strategy & Parameters
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="replyGoal" className="text-xs text-gray-400">My Primary Goal</Label>
              <Input
                id="replyGoal"
                value={replyGoal}
                onChange={(e) => setReplyGoal(e.target.value)}
                placeholder="e.g., Set a boundary, get a commitment..."
                className="bg-gray-700 text-gray-200 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="desiredTone" className="text-xs text-gray-400">Desired Tone / Persona</Label>
              <Select value={desiredTone} onValueChange={(value) => setDesiredTone(value as DesiredTone)}>
                <SelectTrigger className="bg-gray-700 text-gray-200 border-gray-600">
                  <SelectValue placeholder="Select a tone..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-gray-200">
                  <SelectItem value="Strategist">Strategist (Assertive & Confident)</SelectItem>
                  <SelectItem value="Architect">Architect (Logical & Detached)</SelectItem>
                  <SelectItem value="Collaborator">Collaborator (Warm & Empathetic)</SelectItem>
                  <SelectItem value="Neutral">Neutral & Professional</SelectItem>
                  <SelectItem value="Khan" className="text-red-400">Khan (Dominant - Use with Caution)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="userContext" className="text-xs text-gray-400">My Current State/Context (Optional)</Label>
            <Input
              id="userContext"
              value={userContext}
              onChange={(e) => setUserContext(e.target.value)}
              placeholder="e.g., Feeling tired, need a quick exit..."
              className="bg-gray-700 text-gray-200 border-gray-600"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400 block mb-2">Requested Reply Types (defaults to all if none selected)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {decisionOptions.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={selectedReplyTypes.includes(type)}
                    onCheckedChange={() => handleReplyTypeChange(type)}
                    className="border-gray-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor={type} className="text-sm text-gray-300 font-normal cursor-pointer">{type}</Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="numberOfDrafts" className="text-xs text-gray-400">Drafts per Category</Label>
            <Input
              id="numberOfDrafts"
              type="number"
              value={numberOfDrafts}
              onChange={(e) => setNumberOfDrafts(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="3" // Limiting to 3 for brevity and speed
              className="bg-gray-700 text-gray-200 border-gray-600 w-24"
            />
          </div>
          <div className="mt-2">
            <Label htmlFor="relationshipType" className="text-xs text-gray-400">Relationship Type</Label>
            <Select value={relationshipType} onValueChange={setRelationshipType}>
              <SelectTrigger className="bg-gray-700 text-gray-200 border-gray-600">
                <SelectValue placeholder="Select relationship type..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-gray-200">
                {relationshipOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleGenerateReply} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-base py-3">
          {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
          {loading ? 'Architecting...' : 'Architect Responses'}
        </Button>

        {/* --- SECTION 3: OUTPUT & ANALYSIS --- */}
        {error && (
          <div className="bg-red-900/30 text-red-300 p-3 rounded-md flex items-center space-x-2">
            <XCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {(markdownResult || memoryChunks.length > 0) && (
          <div className="pt-4 border-t border-gray-700 space-y-6">
            <h2 className="text-lg font-semibold text-green-300 flex items-center">
              <Bot className="mr-2 h-5 w-5" /> Orion&apos;s Output
            </h2>
            {markdownResult && (
              <div className="prose prose-invert max-w-none bg-gray-900 p-4 rounded-lg border border-gray-700">
                <ReactMarkdown>{markdownResult}</ReactMarkdown>
              </div>
            )}
            {memoryChunks.length > 0 && (
              <div className="border border-gray-700 p-4 rounded-lg bg-gray-900">
                <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center"><Search className="mr-2" /> Memories Used in Analysis:</h3>
                <QuadrantMemoryChunksVisualizer chunks={memoryChunks} />
              </div>
            )}
            {showSaveToMemory && <UnifiedSaveToMemoryComponent />}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsAppReplyDrafter;
