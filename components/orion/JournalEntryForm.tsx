"use client";

import React, { useState, useCallback } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/app_state';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JournalEntryFormProps {
    // Props can be added later if needed
}

// Predefined mood options
const moodOptions = [
    "Happy", "Excited", "Grateful", "Calm", "Content", 
    "Neutral", "Tired", "Anxious", "Stressed", "Sad", 
    "Frustrated", "Angry", "Reflective", "Motivated", "Inspired"
];

// Predefined tag options
const tagOptions = [
    "work", "personal", "health", "relationships", "career", 
    "learning", "goals", "challenges", "achievements", "ideas",
    "project_alpha", "project_beta", "finance", "travel", "family"
];

export const JournalEntryForm: React.FC<JournalEntryFormProps> = () => {
    const [journalText, setJournalText] = useSessionState(SessionStateKeys.JOURNAL_TEXT, "");
    const [mood, setMood] = useState<string>("");
    const [moodOpen, setMoodOpen] = useState(false);
    const [tags, setTags] = useState<string>("");
    const [tagsOpen, setTagsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState<boolean>(false);

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        if (!journalText || !journalText.trim()) {
            setFeedbackMessage("Journal entry cannot be empty.");
            setIsError(true);
            return;
        }

        setIsSaving(true);
        setFeedbackMessage(null);
        setIsError(false);

        try {
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
            const payload = {
                text: journalText,
                mood: mood || undefined,
                tags: tagsArray,
                entryTimestamp: new Date().toISOString(),
            };

            const response = await fetch('/api/orion/journal/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer admin-token'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                setFeedbackMessage(`Journal entry saved! Source ID: ${data.sourceId}`);
                setIsError(false);
                setJournalText("");
                setMood("");
                setTags("");
            } else {
                throw new Error(data.error || "Failed to save journal entry.");
            }
        } catch (error: any) {
            console.error("Error saving journal entry:", error);
            setFeedbackMessage(error.message || "An unexpected error occurred while saving.");
            setIsError(true);
        } finally {
            setIsSaving(false);
        }
    }, [journalText, mood, tags, setJournalText]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-6 bg-gray-800 rounded-lg shadow-xl">
            <div>
                <Label htmlFor="journalText" className="block text-sm font-medium text-gray-300 mb-1">
                    Your Thoughts:
                </Label>
                <Textarea
                    id="journalText"
                    value={journalText || ""}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="Pour out your thoughts, reflections, and observations here..."
                    className="w-full min-h-[200px] md:min-h-[300px] bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-md p-3"
                    rows={10}
                    disabled={isSaving}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <Label htmlFor="mood" className="block text-sm font-medium text-gray-300 mb-1">
                        Current Mood (Optional):
                    </Label>
                    <div className="relative">
                        <Input
                            id="mood"
                            type="text"
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            placeholder="Select or type a mood..."
                            className="w-full bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-md p-2 pr-10"
                            disabled={isSaving}
                            onClick={() => setMoodOpen(true)}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 text-gray-400"
                            onClick={() => setMoodOpen(!moodOpen)}
                        >
                            <ChevronsUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                    {moodOpen && (
                        <div className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-md mt-1 shadow-lg">
                            <Command className="bg-gray-800">
                                <CommandInput placeholder="Search moods..." className="bg-gray-800 text-gray-200" />
                                <CommandList className="bg-gray-800">
                                    <CommandEmpty>No mood found.</CommandEmpty>
                                    <CommandGroup>
                                        {moodOptions.map((option) => (
                                            <CommandItem
                                                key={option}
                                                onSelect={() => {
                                                    setMood(option);
                                                    setMoodOpen(false);
                                                }}
                                                className="text-gray-200 hover:bg-gray-700"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        mood === option ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {option}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </div>
                    )}
                </div>
                <div className="relative">
                    <Label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                        Tags (Optional, comma-separated):
                    </Label>
                    <div className="relative">
                        <Input
                            id="tags"
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="Select or type tags..."
                            className="w-full bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-md p-2 pr-10"
                            disabled={isSaving}
                            onClick={() => setTagsOpen(true)}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 text-gray-400"
                            onClick={() => setTagsOpen(!tagsOpen)}
                        >
                            <ChevronsUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                    {tagsOpen && (
                        <div className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-md mt-1 shadow-lg">
                            <Command className="bg-gray-800">
                                <CommandInput placeholder="Search tags..." className="bg-gray-800 text-gray-200" />
                                <CommandList className="bg-gray-800">
                                    <CommandEmpty>No tag found.</CommandEmpty>
                                    <CommandGroup>
                                        {tagOptions.map((option) => (
                                            <CommandItem
                                                key={option}
                                                onSelect={() => {
                                                    const currentTags = tags.split(',').map(t => t.trim()).filter(Boolean);
                                                    if (!currentTags.includes(option)) {
                                                        const newTags = [...currentTags, option].join(', ');
                                                        setTags(newTags);
                                                    }
                                                    setTagsOpen(false);
                                                }}
                                                className="text-gray-200 hover:bg-gray-700"
                                            >
                                                {option}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Button type="submit" disabled={isSaving || !journalText?.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {isSaving ? 'Saving Entry...' : 'Save Journal Entry'}
                </Button>
                {feedbackMessage && (
                    <p className={`text-sm ${isError ? 'text-red-400' : 'text-green-400'}`}>
                        {feedbackMessage}
                    </p>
                )}
            </div>
        </form>
    );
};