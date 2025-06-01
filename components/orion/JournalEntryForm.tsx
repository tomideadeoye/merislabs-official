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
    onEntrySaved?: (entryId: string, reflection?: string) => void;
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

export const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ onEntrySaved }) => {
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
                    'Content-Type': 'application/json'
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

                // Notify parent component about the new entry
                if (onEntrySaved) {
                    onEntrySaved(data.sourceId, data.reflection);
                }
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
    }, [journalText, mood, tags, setJournalText, onEntrySaved]);

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
                                    <CommandEmpty>No matching moods found.</CommandEmpty>
                                    <CommandGroup>
                                        {moodOptions.map((moodOption) => (
                                            <CommandItem
                                                key={moodOption}
                                                onSelect={() => {
                                                    setMood(moodOption);
                                                    setMoodOpen(false);
                                                }}
                                                className="cursor-pointer hover:bg-gray-700"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        mood === moodOption ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {moodOption}
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
                            placeholder="Type or select tags..."
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
                                    <CommandEmpty>No matching tags found.</CommandEmpty>
                                    <CommandGroup>
                                        {tagOptions.map((tagOption) => (
                                            <CommandItem
                                                key={tagOption}
                                                onSelect={() => {
                                                    const currentTags = tags
                                                        .split(',')
                                                        .map((t) => t.trim())
                                                        .filter(Boolean);
                                                    if (!currentTags.includes(tagOption)) {
                                                        setTags(
                                                            currentTags.length > 0
                                                                ? `${tags}, ${tagOption}`
                                                                : tagOption
                                                        );
                                                    }
                                                    setTagsOpen(false);
                                                }}
                                                className="cursor-pointer hover:bg-gray-700"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        tags.split(',').map(t => t.trim()).includes(tagOption)
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {tagOption}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </div>
                    )}
                </div>
            </div>

            {feedbackMessage && (
                <div
                    className={cn(
                        "p-3 rounded-md text-sm",
                        isError
                            ? "bg-red-900/50 text-red-200 border border-red-800"
                            : "bg-green-900/50 text-green-200 border border-green-800"
                    )}
                >
                    {feedbackMessage}
                </div>
            )}

            <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSaving}
            >
                {isSaving ? "Saving..." : "Save Journal Entry"}
            </Button>
        </form>
    );
};
