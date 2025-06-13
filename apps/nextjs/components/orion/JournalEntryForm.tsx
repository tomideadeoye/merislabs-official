"use client";

import React, { useState, useCallback } from 'react';
import { useSessionState } from '@repo/sharedhooks/useSessionState';
import { SessionStateKeys } from '@repo/sharedapp_state';
import { Button, Textarea, Input, Label, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Checkbox } from '@repo/ui';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@repo/shared/utils';
import { Loader2 } from 'lucide-react';
import type { JournalEntryNotionInput } from '@repo/shared';

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

    // State for save options - default to saving to Notion and Qdrant (via backend API)
    const [saveToNotion, setSaveToNotion] = useState<boolean>(true); // Default to true
    const [saveToQdrant, setSaveToQdrant] = useState<boolean>(true); // Default to true
    const [saveToClipboard, setSaveToClipboard] = useState<boolean>(false); // Default to false
    const [saveToSQLite, setSaveToSQLite] = useState<boolean>(false); // Default to false (not yet implemented)

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        if (!journalText || !journalText.trim()) {
            setFeedbackMessage("Journal entry cannot be empty.");
            setIsError(true);
            return;
        }

        // Check if at least one save option is selected
        if (!saveToNotion && !saveToQdrant && !saveToClipboard && !saveToSQLite) {
            setFeedbackMessage("Please select at least one save option.");
            setIsError(true);
            return;
        }

        setIsSaving(true);
        setFeedbackMessage(null);
        setIsError(false);

        let notionSaved = false;
        let qdrantSaved = false;
        let reflectionGenerated = false;
        let clipboardCopied = false;
        let sourceId: string | undefined = undefined;
        let reflectionText: string | undefined = undefined;

        try {
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
            const payload = {
                text: journalText,
                mood: mood || undefined,
                tags: tagsArray,
                entryTimestamp: new Date().toISOString(),
                saveToNotion: saveToNotion, // Include save options in payload
                saveToQdrant: saveToQdrant,
                // SQLite is handled separately for now
            };

            // Call the backend API if saving to Notion or Qdrant is selected
            if (saveToNotion || saveToQdrant) {
                const response = await fetch('/api/orion/journal/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (data.success) {
                    notionSaved = data.notionSaved || false; // Backend will indicate what was saved
                    qdrantSaved = data.qdrantSaved || false;
                    reflectionGenerated = data.reflectionGenerated || false;
                    sourceId = data.sourceId; // This will be the Notion page ID if Notion was saved
                    reflectionText = data.reflection;
                } else {
                    // If backend API call fails, it's an error for Notion/Qdrant save
                    throw new Error(data.error || "Failed to save journal entry via backend.");
                }
            }

            // Handle Clipboard save on the frontend
            if (saveToClipboard && journalText) {
                try {
                    await navigator.clipboard.writeText(journalText);
                    clipboardCopied = true;
                } catch (clipError) {
                    console.error("Failed to copy to clipboard:", clipError);
                    // Decide if clipboard failure should stop the whole process
                    // For now, log and continue.
                }
            }

            // Construct feedback message based on what was saved
            let messages: string[] = [];
            if (notionSaved) messages.push("Saved to Notion.");
            if (qdrantSaved) messages.push("Saved to Qdrant (Memory Search).");
            if (clipboardCopied) messages.push("Copied to clipboard.");
            if (saveToSQLite) messages.push("SQLite save not yet implemented."); // Indicate unimplemented

            if (messages.length > 0) {
                setFeedbackMessage(`Journal entry: ${messages.join(" ")}`);
                setIsError(false);

                // Only clear the form and notify parent if Notion or Qdrant was successfully saved
                if (notionSaved || qdrantSaved) {
                    setJournalText("");
                    setMood("");
                    setTags("");
                    // Notify parent component about the new entry if relevant destination was saved
                    if (onEntrySaved && sourceId) { // Pass sourceId (Notion ID) and reflection
                        onEntrySaved(sourceId, reflectionText);
                    }
                }

            } else if (!saveToNotion && !saveToQdrant) {
                // Case where only clipboard/sqlite were selected, and clipboard might have failed
                if (clipboardCopied) {
                    setFeedbackMessage("Journal entry copied to clipboard.");
                    setIsError(false);
                    setJournalText(""); // Clear if only clipboard was selected and succeeded
                    setMood("");
                    setTags("");
                } else if (saveToSQLite) {
                    setFeedbackMessage("SQLite save not yet implemented.");
                    setIsError(false);
                } else {
                    // Should not happen based on initial check, but for safety
                    setFeedbackMessage("No save actions were successful.");
                    setIsError(true);
                }
            } else {
                // Should not happen if backend call was successful
                setFeedbackMessage("Unknown save outcome.");
                setIsError(true);
            }


        } catch (error: any) {
            console.error("Error saving journal entry:", error);
            setFeedbackMessage(error.message || "An unexpected error occurred while saving.");
            setIsError(true);
        } finally {
            setIsSaving(false);
        }
    }, [journalText, mood, tags, saveToNotion, saveToQdrant, saveToClipboard, saveToSQLite, setJournalText, setMood, setTags, onEntrySaved]); // Add save options to dependencies

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

            {/* Save Options Section */}
            <div className="space-y-2 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200">Save Options</h3>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="saveToNotion"
                        checked={saveToNotion}
                        onCheckedChange={(checked) => setSaveToNotion(!!checked)}
                    />
                    <Label htmlFor="saveToNotion" className="text-sm font-medium text-gray-300">Save to Notion (Primary Storage)</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="saveToQdrant"
                        checked={saveToQdrant}
                        onCheckedChange={(checked) => setSaveToQdrant(!!checked)}
                    />
                    <Label htmlFor="saveToQdrant" className="text-sm font-medium text-gray-300">Save to Qdrant (Memory Search)</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="saveToClipboard"
                        checked={saveToClipboard}
                        onCheckedChange={(checked) => setSaveToClipboard(!!checked)}
                    />
                    <Label htmlFor="saveToClipboard" className="text-sm font-medium text-gray-300">Copy to Clipboard</Label>
                </div>
                <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                    <Checkbox
                        id="saveToSQLite"
                        checked={saveToSQLite}
                        onCheckedChange={(checked) => setSaveToSQLite(!!checked)}
                        disabled // SQLite not yet implemented
                    />
                    <Label htmlFor="saveToSQLite" className="text-sm font-medium text-gray-300">Save to SQLite (Local Drafts) - Not yet implemented</Label>
                </div>
            </div>

            <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-4">
                    {/* Save options would go here */}
                </div>
                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!!(isSaving || !journalText.trim() || (!saveToNotion && !saveToQdrant && !saveToClipboard && !saveToSQLite))}
                >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isSaving ? 'Saving...' : 'Save Journal Entry'}
                </Button>
            </div>
        </form>
    );
};
