'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Textarea,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
} from '@/components/ui';
import { CalendarDays, Tag, Paperclip, Smile, Lightbulb, Loader2, Trash2, Edit } from 'lucide-react';
import { useMemoryContext } from '@/components/orion/MemoryProvider';
import { MEMORY_TYPES } from '@/lib/orion_config';
import { JournalEntryInput, ScoredMemoryPoint, EmotionalLogEntry, CognitiveDistortionAnalysisData } from '@/lib/types';
import logger from '@/lib/logger';
import { useRouter } from 'next/navigation';

// Define moods and emotions for selection
const moods = ['Happy', 'Sad', 'Neutral', 'Excited', 'Anxious', 'Angry', 'Calm', 'Stressed', 'Grateful'];
const primaryEmotions = ['Joy', 'Sadness', 'Anger', 'Fear', 'Surprise', 'Disgust', 'Anticipation', 'Trust'];
const cognitiveDistortions = [
  { id: 'allOrNothingThinking', name: 'All-or-Nothing Thinking' },
  { id: 'overgeneralization', name: 'Overgeneralization' },
  { id: 'mentalFilter', name: 'Mental Filter' },
  { id: 'discountingThePositive', name: 'Discounting the Positive' },
  { id: 'jumpingToConclusions', name: 'Jumping to Conclusions' },
  { id: 'magnificationAndMinimization', name: 'Magnification and Minimization' },
  { id: 'emotionalReasoning', name: 'Emotional Reasoning' },
  { id: 'shouldStatements', name: 'Should Statements' },
  { id: 'labelingAndMislabeling', name: 'Labeling and Mislabeling' },
  { id: 'personalization', name: 'Personalization' },
];

export default function UnifiedJournalingPage() {
  const { search, searchResults, loading, addMemory, deleteMemory } = useMemoryContext();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('new');
  const [journalContent, setJournalContent] = useState('');
  const [journalTitle, setJournalTitle] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | undefined>(undefined);
  const [selectedPrimaryEmotion, setSelectedPrimaryEmotion] = useState<string | undefined>(undefined);
  const [emotionContext, setEmotionContext] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState<number | undefined>(undefined);
  const [reflectionText, setReflectionText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingEntry, setEditingEntry] = useState<ScoredMemoryPoint | null>(null);
  const [showOptionalFields, setShowOptionalFields] = useState({
    mood: false,
    emotionLog: false,
    reflection: false,
    attachments: false,
  });
  const [cognitiveDistortionAnalysis, setCognitiveDistortionAnalysis] = useState<CognitiveDistortionAnalysisData | null>(null);

  const fetchJournalEntries = useCallback(() => {
    search('', { filter: { must: [{ key: 'payload.type', match: { value: MEMORY_TYPES.JOURNAL } }] }, limit: 20 });
  }, [search]);

  useEffect(() => {
    fetchJournalEntries();
  }, [fetchJournalEntries]);

  const resetForm = () => {
    setJournalContent('');
    setJournalTitle('');
    setSelectedMood(undefined);
    setSelectedPrimaryEmotion(undefined);
    setEmotionContext('');
    setEmotionIntensity(undefined);
    setReflectionText('');
    setAttachments([]);
    setFeedback(null);
    setEditingEntry(null);
    setCognitiveDistortionAnalysis(null);
    setShowOptionalFields({
      mood: false,
      emotionLog: false,
      reflection: false,
      attachments: false,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments(Array.from(event.target.files));
    }
  };

  const handleSaveJournal = async () => {
    if (!journalContent.trim() && !journalTitle.trim()) {
      setFeedback({ type: 'error', message: 'Journal entry cannot be empty.' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const newEntry: JournalEntryInput = {
        userId: 'current_user_id', // TODO: Replace with actual user ID
        date: new Date().toISOString(),
        content: journalContent,
        title: journalTitle,
        tags: ['journal', 'journal_entry'],
        contentType: 'text',
        attachments: attachments.map(file => file.name), // Store file names for now
      };

      if (selectedMood) {
        newEntry.mood = selectedMood;
        newEntry.tags?.push(`mood:${selectedMood.toLowerCase()}`);
      }

      if (selectedPrimaryEmotion && emotionContext && emotionIntensity !== undefined) {
        const emotionalLog: EmotionalLogEntry = {
          id: `emotion_${Date.now()}`, // Temporary ID
          timestamp: new Date().toISOString(),
          emotion: selectedPrimaryEmotion,
          primaryEmotion: selectedPrimaryEmotion,
          intensity: emotionIntensity,
          context: emotionContext,
          cognitiveDistortionAnalysis: cognitiveDistortionAnalysis || undefined,
        };
        // Merge emotional log fields into journal entry
        Object.assign(newEntry, emotionalLog);
        newEntry.tags?.push(`emotion:${selectedPrimaryEmotion.toLowerCase()}`);
      }

      if (reflectionText) {
        newEntry.reflectionId = `reflection_${Date.now()}`; // Temporary ID
        newEntry.tags?.push('reflection');
        // For now, reflection text is part of the main content or a separate memory entry.
        // For unified, we'll store it as part of the journal entry content or a specific field.
        // For simplicity, let's append it to content if not already there.
        if (!newEntry.content?.includes(reflectionText)) {
          newEntry.content = `${newEntry.content || ''}

Reflection: ${reflectionText}`;
        }
      }

      if (editingEntry) {
        // Handle update
        // This would typically call an API endpoint to update the journal entry
        // For now, simulate update in memory context
        await deleteMemory(editingEntry.id); // Remove old entry
        await addMemory({
          id: editingEntry.id, // Keep same ID for update
          text: newEntry.content || '',
          source_id: editingEntry.payload?.source_id || `journal_${Date.now()}`,
          timestamp: newEntry.date.toString(),
          indexedAt: new Date().toISOString(),
          type: MEMORY_TYPES.JOURNAL,
          tags: newEntry.tags,
          mood: newEntry.mood,
          title: newEntry.title,
          attachments: newEntry.attachments,
          // Add other fields from newEntry to payload as needed
          ...newEntry, // Spread all fields for comprehensive payload
        });
        setFeedback({ type: 'success', message: 'Journal entry updated successfully!' });
      } else {
        // Handle new entry
        const sourceId = `journal_${Date.now()}`;
        await addMemory({
          text: newEntry.content || '',
          source_id: sourceId,
          timestamp: newEntry.date.toString(),
          indexedAt: new Date().toISOString(),
          type: MEMORY_TYPES.JOURNAL,
          tags: newEntry.tags,
          mood: newEntry.mood,
          title: newEntry.title,
          attachments: newEntry.attachments,
          // Add other fields from newEntry to payload as needed
          ...newEntry, // Spread all fields for comprehensive payload
        });
        setFeedback({ type: 'success', message: 'Journal entry saved to Orion Memory successfully!' });
      }

      resetForm();
      fetchJournalEntries(); // Refresh list
      setActiveTab('history'); // Switch to history tab after saving
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setFeedback({ type: 'error', message: `Failed to save entry: ${errorMessage}` });
      logger.error('[UnifiedJournalingPage] Failed to save journal entry.', { error: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (entry: ScoredMemoryPoint) => {
    setEditingEntry(entry);
    setJournalTitle(entry.payload?.title || '');
    setJournalContent(entry.payload?.text || '');
    setSelectedMood(entry.payload?.mood);
    // Populate other fields if they exist in payload
    setReflectionText(entry.payload?.reflection || ''); // Assuming reflection is a direct payload field
    setAttachments(entry.payload?.attachments?.map((name: string) => new File([], name)) || []); // Recreate dummy files
    // Set optional fields visibility based on existing data
    setShowOptionalFields({
      mood: !!entry.payload?.mood,
      emotionLog: !!entry.payload?.primaryEmotion,
      reflection: !!entry.payload?.reflection,
      attachments: (entry.payload?.attachments?.length || 0) > 0,
    });
    setActiveTab('new'); // Switch to new entry tab for editing
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        setIsSaving(true); // Use saving state to prevent multiple actions
        await deleteMemory(id);
        setFeedback({ type: 'success', message: 'Journal entry deleted successfully!' });
        fetchJournalEntries(); // Refresh list
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setFeedback({ type: 'error', message: `Failed to delete entry: ${errorMessage}` });
        logger.error('[UnifiedJournalingPage] Failed to delete journal entry.', { error: errorMessage });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCognitiveDistortionChange = (field: keyof CognitiveDistortionAnalysisData, value: any) => {
    setCognitiveDistortionAnalysis(prev => ({
      ...(prev || {
        situation: '',
        automaticThought: '',
        emotion: '',
        distortionIdentified: [],
        rationalResponse: '',
        outcome: '',
      }),
      [field]: value,
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-100">Unified Journaling</h1>

      {feedback && (
        <div
          className={`p-4 rounded-md mb-6 ${
            feedback.type === 'success' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-6">
          <TabsTrigger value="new">New Entry</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700 text-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">{editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="journalTitle" className="text-gray-300">Title (Optional)</Label>
                <Input
                  id="journalTitle"
                  placeholder="A brief title for your entry"
                  value={journalTitle}
                  onChange={(e) => setJournalTitle(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 mt-1"
                  disabled={isSaving}
                />
              </div>
              <div>
                <Label htmlFor="journalContent" className="text-gray-300">Journal Content</Label>
                <Textarea
                  id="journalContent"
                  placeholder="Write your thoughts, reflections, or insights here..."
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  rows={8}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 mt-1"
                  disabled={isSaving}
                />
              </div>

              {/* Optional Fields Toggle */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOptionalFields(prev => ({ ...prev, mood: !prev.mood }))}
                  className="text-gray-300 border-gray-600 hover:bg-gray-700"
                >
                  <Smile className="h-4 w-4 mr-2" /> {showOptionalFields.mood ? 'Hide Mood' : 'Add Mood'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOptionalFields(prev => ({ ...prev, emotionLog: !prev.emotionLog }))}
                  className="text-gray-300 border-gray-600 hover:bg-gray-700"
                >
                  <Smile className="h-4 w-4 mr-2" /> {showOptionalFields.emotionLog ? 'Hide Emotion Log' : 'Add Emotion Log'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOptionalFields(prev => ({ ...prev, reflection: !prev.reflection }))}
                  className="text-gray-300 border-gray-600 hover:bg-gray-700"
                >
                  <Lightbulb className="h-4 w-4 mr-2" /> {showOptionalFields.reflection ? 'Hide Reflection' : 'Add Reflection'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOptionalFields(prev => ({ ...prev, attachments: !prev.attachments }))}
                  className="text-gray-300 border-gray-600 hover:bg-gray-700"
                >
                  <Paperclip className="h-4 w-4 mr-2" /> {showOptionalFields.attachments ? 'Hide Attachments' : 'Add Attachments'}
                </Button>
              </div>

              {/* Mood Selector */}
              {showOptionalFields.mood && (
                <div>
                  <Label htmlFor="moodSelect" className="text-gray-300">Mood</Label>
                  <Select value={selectedMood} onValueChange={setSelectedMood} disabled={isSaving}>
                    <SelectTrigger id="moodSelect" className="bg-gray-700 border-gray-600 text-white mt-1">
                      <SelectValue placeholder="Select your mood" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white">
                      {moods.map((mood) => (
                        <SelectItem key={mood} value={mood}>
                          {mood}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Emotional Log */}
              {showOptionalFields.emotionLog && (
                <div className="space-y-3 border border-gray-700 p-4 rounded-md">
                  <h3 className="text-lg font-semibold text-gray-200">Emotional Log</h3>
                  <div>
                    <Label htmlFor="primaryEmotion" className="text-gray-300">Primary Emotion</Label>
                    <Select value={selectedPrimaryEmotion} onValueChange={setSelectedPrimaryEmotion} disabled={isSaving}>
                      <SelectTrigger id="primaryEmotion" className="bg-gray-700 border-gray-600 text-white mt-1">
                        <SelectValue placeholder="Select primary emotion" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white">
                        {primaryEmotions.map((emotion) => (
                          <SelectItem key={emotion} value={emotion}>
                            {emotion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="emotionIntensity" className="text-gray-300">Intensity (1-10)</Label>
                    <Input
                      id="emotionIntensity"
                      type="number"
                      min="1"
                      max="10"
                      value={emotionIntensity || ''}
                      onChange={(e) => setEmotionIntensity(parseInt(e.target.value))}
                      placeholder="e.g., 7"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 mt-1"
                      disabled={isSaving}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emotionContext" className="text-gray-300">Context</Label>
                    <Textarea
                      id="emotionContext"
                      placeholder="What happened or what were you thinking when you felt this emotion?"
                      value={emotionContext}
                      onChange={(e) => setEmotionContext(e.target.value)}
                      rows={3}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 mt-1"
                      disabled={isSaving}
                    />
                  </div>

                  {/* Cognitive Distortion Analysis (Optional) */}
                  <div className="space-y-2">
                    <h4 className="text-md font-semibold text-gray-300">Cognitive Distortion Analysis (Optional)</h4>
                    <div>
                      <Label htmlFor="situation" className="text-gray-400 text-sm">Situation</Label>
                      <Input
                        id="situation"
                        value={cognitiveDistortionAnalysis?.situation || ''}
                        onChange={(e) => handleCognitiveDistortionChange('situation', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 mt-1"
                        disabled={isSaving}
                      />
                    </div>
                    <div>
                      <Label htmlFor="automaticThought" className="text-gray-400 text-sm">Automatic Thought</Label>
                      <Input
                        id="automaticThought"
                        value={cognitiveDistortionAnalysis?.automaticThought || ''}
                        onChange={(e) => handleCognitiveDistortionChange('automaticThought', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 mt-1"
                        disabled={isSaving}
                      />
                    </div>
                    <div>
                      <Label htmlFor="distortionIdentified" className="text-gray-400 text-sm">Distortion Identified</Label>
                      <Select
                        value={cognitiveDistortionAnalysis?.distortionIdentified?.[0] || ''}
                        onValueChange={(value) => handleCognitiveDistortionChange('distortionIdentified', [value])}
                        disabled={isSaving}
                      >
                        <SelectTrigger id="distortionIdentified" className="bg-gray-700 border-gray-600 text-white mt-1">
                          <SelectValue placeholder="Select distortion" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 text-white">
                          {cognitiveDistortions.map((distortion) => (
                            <SelectItem key={distortion.id} value={distortion.id}>
                              {distortion.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="rationalResponse" className="text-gray-400 text-sm">Rational Response</Label>
                      <Textarea
                        id="rationalResponse"
                        value={cognitiveDistortionAnalysis?.rationalResponse || ''}
                        onChange={(e) => handleCognitiveDistortionChange('rationalResponse', e.target.value)}
                        rows={2}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 mt-1"
                        disabled={isSaving}
                      />
                    </div>
                    <div>
                      <Label htmlFor="outcome" className="text-gray-400 text-sm">Outcome</Label>
                      <Input
                        id="outcome"
                        value={cognitiveDistortionAnalysis?.outcome || ''}
                        onChange={(e) => handleCognitiveDistortionChange('outcome', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 mt-1"
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Reflection */}
              {showOptionalFields.reflection && (
                <div>
                  <Label htmlFor="reflectionText" className="text-gray-300">Reflection</Label>
                  <Textarea
                    id="reflectionText"
                    placeholder="Reflect on your entry, what did you learn?"
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    rows={4}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 mt-1"
                    disabled={isSaving}
                  />
                </div>
              )}

              {/* Attachments */}
              {showOptionalFields.attachments && (
                <div>
                  <Label htmlFor="attachments" className="text-gray-300">Attachments</Label>
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="bg-gray-700 border-gray-600 text-white file:text-gray-300 file:bg-gray-600 file:border-0 file:mr-4 file:py-2 file:px-4 rounded-md mt-1"
                    disabled={isSaving}
                  />
                  {attachments.length > 0 && (
                    <div className="mt-2 text-sm text-gray-400">
                      Selected files: {attachments.map(file => file.name).join(', ')}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2">
                {editingEntry && (
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="text-gray-300 border-gray-600 hover:bg-gray-700"
                    disabled={isSaving}
                  >
                    Cancel Edit
                  </Button>
                )}
                <Button
                  onClick={handleSaveJournal}
                  disabled={isSaving || (!journalContent.trim() && !journalTitle.trim())}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {editingEntry ? 'Update Entry' : 'Save Entry'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Recent Entries</h2>
          {loading ? (
            <p className="text-gray-400">Loading entries...</p>
          ) : searchResults.length === 0 ? (
            <p className="text-gray-400">No journal entries found.</p>
          ) : (
            <div className="space-y-4">
              {searchResults.map((entry: ScoredMemoryPoint) => (
                <Card key={entry.payload?.source_id || entry.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    {entry.payload?.title && <h3 className="text-lg font-semibold text-gray-100 mb-2">{entry.payload.title}</h3>}
                    <p className="text-sm text-gray-300 whitespace-pre-wrap mb-3">{entry.payload?.text}</p>

                    <div className="flex flex-wrap items-center text-xs text-gray-400 gap-4">
                      <span className="flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {entry.payload?.timestamp ? new Date(entry.payload.timestamp).toLocaleString() : 'N/A'}
                      </span>

                      {entry.payload?.mood && (
                        <span className="flex items-center">
                          <Smile className="h-3 w-3 mr-1" /> Mood: {entry.payload.mood}
                        </span>
                      )}

                      {entry.payload?.primaryEmotion && (
                        <span className="flex items-center">
                          Emotion: {entry.payload.primaryEmotion} (Intensity: {entry.payload.intensity})
                        </span>
                      )}

                      {entry.payload?.attachments && entry.payload.attachments.length > 0 && (
                        <span className="flex items-center">
                          <Paperclip className="h-3 w-3 mr-1" /> Attachments: {entry.payload.attachments.join(', ')}
                        </span>
                      )}

                      {entry.payload?.tags && entry.payload.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                          <Tag className="h-3 w-3" />
                          <div className="flex flex-wrap gap-1">
                            {entry.payload.tags
                              .filter((tag: string) => tag !== 'journal' && tag !== 'journal_entry')
                              .map((tag: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
                                  {tag}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(entry)} disabled={isSaving}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(entry.id)} disabled={isSaving}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Journaling Analytics & Trends</h2>
          <Card className="bg-gray-800 border-gray-700 text-gray-200">
            <CardHeader>
              <CardTitle>Mood Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                {/* TODO: Implement actual mood trend visualization */}
                Mood trend visualization will appear here. This section will show how your moods have changed over days, weeks, or months.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-gray-200">
            <CardHeader>
              <CardTitle>Emotion Frequency & Intensity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                {/* TODO: Implement actual emotion frequency and intensity charts */}
                This section will display the frequency of different emotions logged and their average intensity.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-gray-200">
            <CardHeader>
              <CardTitle>Reflection Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                {/* TODO: Implement AI-powered reflection insights */}
                AI-powered insights from your reflections will be summarized here, highlighting key learnings and patterns.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Journaling Prompts</h2>
          <Card className="bg-gray-800 border-gray-700 text-gray-200">
            <CardHeader>
              <CardTitle>Daily Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                {/* TODO: Implement dynamic daily prompts */}
                "What are you grateful for today?"
              </p>
              <p className="text-gray-400">
                "What's on your mind right now?"
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700 text-gray-200">
            <CardHeader>
              <CardTitle>AI-Generated Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                {/* TODO: Implement AI-generated prompts based on past entries */}
                "Based on your recent entries about productivity, how do you plan to optimize your workflow this week?"
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}