"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, AlertTriangle, Lightbulb, ArrowLeft, Save, MessageSquare, History, Sparkles, SendToBack } from 'lucide-react';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/app_state';
import type { Idea, IdeaLog, IdeaStatus } from '@/types/ideas';

interface IdeaDetailViewProps {
  ideaId: string;
  className?: string;
}

// Status display configuration
const statusConfig: Record<IdeaStatus, { label: string; color: string }> = {
  'raw_spark': { label: 'Raw Spark', color: 'bg-yellow-500' },
  'fleshing_out': { label: 'Fleshing Out', color: 'bg-blue-500' },
  'researching': { label: 'Researching', color: 'bg-purple-500' },
  'prototyping': { label: 'Prototyping', color: 'bg-green-500' },
  'on_hold': { label: 'On Hold', color: 'bg-gray-500' },
  'archived': { label: 'Archived', color: 'bg-red-500' },
  'completed': { label: 'Completed', color: 'bg-emerald-500' }
};

export const IdeaDetailView: React.FC<IdeaDetailViewProps> = ({
  ideaId,
  className
}) => {
  const router = useRouter();

  const [idea, setIdea] = useState<Idea | null>(null);
  const [logs, setLogs] = useState<IdeaLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editStatus, setEditStatus] = useState<IdeaStatus>("raw_spark");
  const [editTags, setEditTags] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Note state
  const [newNote, setNewNote] = useState<string>("");
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);

  // Brainstorm state
  const [isBrainstorming, setIsBrainstorming] = useState<boolean>(false);
  const [brainstormPrompt, setBrainstormPrompt] = useState<string>("");

  // Habitica integration state
  const [showHabiticaDialog, setShowHabiticaDialog] = useState<boolean>(false);
  const [habiticaTaskText, setHabiticaTaskText] = useState<string>("");
  const [habiticaTaskNotes, setHabiticaTaskNotes] = useState<string>("");
  const [habiticaTaskPriority, setHabiticaTaskPriority] = useState<number>(1);
  const [isSendingToHabitica, setIsSendingToHabitica] = useState<boolean>(false);
  const [habiticaError, setHabiticaError] = useState<string | null>(null);

  const [habiticaUserId] = useSessionState(SessionStateKeys.HABITICA_USER_ID, "");
  const [habiticaApiToken] = useSessionState(SessionStateKeys.HABITICA_API_TOKEN, "");

  const fetchIdea = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/orion/ideas/${ideaId}`);
      const data = await response.json();

      if (data.success) {
        setIdea(data.idea);
        setLogs(data.logs || []);

        // Initialize edit state
        setEditTitle(data.idea.title);
        setEditDescription(data.idea.briefDescription || "");
        setEditStatus(data.idea.status);
        setEditTags(data.idea.tags?.join(', ') || "");
      } else {
        throw new Error(data.error || 'Failed to fetch idea');
      }
    } catch (err: any) {
      console.error('Error fetching idea:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [ideaId]);

  // Fetch idea on mount
  useEffect(() => {
    fetchIdea();
  }, [ideaId, fetchIdea]);

  const handleSaveChanges = async () => {
    if (!idea) return;

    setIsSaving(true);
    setError(null);

    try {
      // Process tags
      const tagArray = editTags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);

      const response = await fetch(`/api/orion/ideas/${ideaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editTitle,
          briefDescription: editDescription,
          status: editStatus,
          tags: tagArray
        })
      });

      const data = await response.json();

      if (data.success) {
        setIdea(data.idea);
        setIsEditing(false);
        fetchIdea(); // Refresh to get updated logs
      } else {
        throw new Error(data.error || 'Failed to update idea');
      }
    } catch (err: any) {
      console.error('Error updating idea:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!idea || !newNote.trim()) return;

    setIsAddingNote(true);
    setError(null);

    try {
      const response = await fetch(`/api/orion/ideas/${ideaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          note: newNote.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setNewNote("");
        fetchIdea(); // Refresh to get updated logs
      } else {
        throw new Error(data.error || 'Failed to add note');
      }
    } catch (err: any) {
      console.error('Error adding note:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleBrainstorm = async () => {
    if (!idea) return;

    setIsBrainstorming(true);
    setError(null);

    try {
      const response = await fetch(`/api/orion/ideas/${ideaId}/brainstorm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: brainstormPrompt
        })
      });

      const data = await response.json();

      if (data.success) {
        setBrainstormPrompt("");
        fetchIdea(); // Refresh to get updated logs
      } else {
        throw new Error(data.error || 'Failed to generate brainstorming');
      }
    } catch (err: any) {
      console.error('Error generating brainstorming:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsBrainstorming(false);
    }
  };

  const handleOpenHabiticaDialog = useCallback(() => {
    if (!idea) return;

    setHabiticaTaskText(`Action item for: ${idea.title}`);
    setHabiticaTaskNotes(`From Orion Idea Incubator: ${idea.title}\nRef: /admin/idea-incubator/${idea.id}\n\n${idea.briefDescription || ''}`);
    setHabiticaTaskPriority(1);
    setHabiticaError(null);
    setShowHabiticaDialog(true);
  }, [idea]);

  const handleSendToHabitica = useCallback(async () => {
    if (!idea) return;
    if (!habiticaTaskText.trim()) {
      setHabiticaError("Task text cannot be empty");
      return;
    }
    if (!habiticaUserId || !habiticaApiToken) {
      setHabiticaError("Habitica credentials not set. Please set them in the Habitica page.");
      return;
    }

    setIsSendingToHabitica(true);
    setHabiticaError(null);

    try {
      const response = await fetch('/api/orion/habitica/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: habiticaUserId,
          apiToken: habiticaApiToken,
          taskData: {
            text: habiticaTaskText,
            notes: habiticaTaskNotes,
            priority: habiticaTaskPriority
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Task "${habiticaTaskText}" added to Habitica!`);
        setShowHabiticaDialog(false);
      } else {
        throw new Error(data.error || 'Failed to add task to Habitica');
      }
    } catch (err: any) {
      console.error('Error sending task to Habitica:', err);
      setHabiticaError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSendingToHabitica(false);
    }
  }, [habiticaTaskText, habiticaTaskNotes, habiticaTaskPriority, habiticaUserId, habiticaApiToken, idea]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
        <span className="ml-2 text-gray-400">Loading idea...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>Idea not found.</p>
        <Button
          variant="outline"
          className="mt-4 text-gray-300 border-gray-600"
          onClick={() => router.push('/admin/idea-incubator')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Ideas
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/idea-incubator')}
          className="text-gray-300 border-gray-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Ideas
        </Button>

        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenHabiticaDialog}
                className="text-sky-400 border-sky-600"
              >
                <SendToBack className="mr-2 h-4 w-4" />
                Send to Habitica
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-blue-400 border-blue-600"
              >
                Edit Idea
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="text-gray-300 border-gray-600"
                disabled={isSaving}
              >
                Cancel
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Idea Details */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {!isEditing ? (
                <>
                  <CardTitle className="text-xl flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
                    {idea.title}
                  </CardTitle>

                  <Badge className={`mt-2 ${statusConfig[idea.status].color} text-white`}>
                    {statusConfig[idea.status].label}
                  </Badge>
                </>
              ) : (
                <>
                  <div className="mb-2">
                    <Label htmlFor="title" className="text-gray-400 text-sm">Title</Label>
                    <Input
                      id="title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-gray-200 mb-2"
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-gray-400 text-sm">Status</Label>
                    <Select
                      value={editStatus}
                      onValueChange={(value: any) => setEditStatus(value)}
                      disabled={isSaving}
                    >
                      <SelectTrigger id="status" className="bg-gray-700 border-gray-600 text-gray-200">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                        {Object.entries(statusConfig).map(([status, config]) => (
                          <SelectItem key={status} value={status}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {!isEditing ? (
            <>
              {idea.briefDescription ? (
                <p className="text-gray-300 whitespace-pre-wrap">{idea.briefDescription}</p>
              ) : (
                <p className="text-gray-500 italic">No description provided.</p>
              )}

              {idea.tags && idea.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4">
                  {idea.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-gray-600 text-gray-400">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
                <div>Created: {new Date(idea.createdAt).toLocaleString()}</div>
                <div>Updated: {new Date(idea.updatedAt).toLocaleString()}</div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description" className="text-gray-400 text-sm">Description</Label>
                  <Textarea
                    id="description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="min-h-[100px] bg-gray-700 border-gray-600 text-gray-200"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <Label htmlFor="tags" className="text-gray-400 text-sm">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-200"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Notes, History, and Brainstorming */}
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="bg-gray-700 border-gray-600">
          <TabsTrigger value="notes" className="data-[state=active]:bg-gray-600">
            <MessageSquare className="h-4 w-4 mr-2" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-gray-600">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="brainstorm" className="data-[state=active]:bg-gray-600">
            <Sparkles className="h-4 w-4 mr-2" />
            Brainstorm
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Notes</CardTitle>
              <CardDescription className="text-gray-400">
                Add notes and thoughts about this idea
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a new note..."
                  className="min-h-[100px] bg-gray-700 border-gray-600 text-gray-200"
                  disabled={isAddingNote}
                />

                <Button
                  onClick={handleAddNote}
                  disabled={isAddingNote || !newNote.trim()}
                  className="mt-2 bg-blue-600 hover:bg-blue-700"
                >
                  {isAddingNote ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Add Note'
                  )}
                </Button>
              </div>

              <div className="space-y-3 mt-4">
                {logs.filter(log => log.type === 'note').length === 0 ? (
                  <p className="text-gray-500 italic">No notes yet. Add your first note above.</p>
                ) : (
                  logs
                    .filter(log => log.type === 'note')
                    .map(log => (
                      <div key={log.id} className="bg-gray-750 border border-gray-700 rounded-md p-3">
                        <p className="text-gray-300 whitespace-pre-wrap">{log.content}</p>
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">History</CardTitle>
              <CardDescription className="text-gray-400">
                Timeline of changes and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <p className="text-gray-500 italic">No history available.</p>
              ) : (
                <div className="space-y-4">
                  {logs.map(log => (
                    <div key={log.id} className="flex">
                      <div className="mr-4 relative">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <div className="absolute top-3 bottom-0 left-1.5 -ml-px w-0.5 bg-gray-700"></div>
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="text-sm font-medium text-gray-300">
                          {log.type === 'initial_capture' && 'Idea Captured'}
                          {log.type === 'note' && 'Note Added'}
                          {log.type === 'status_change' && 'Status Changed'}
                          {log.type === 'llm_brainstorm' && 'Orion Brainstorming'}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          {new Date(log.timestamp).toLocaleString()} by {log.author}
                        </div>
                        <div className="text-sm text-gray-400 whitespace-pre-wrap">
                          {log.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brainstorm" className="mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Brainstorm with Orion</CardTitle>
              <CardDescription className="text-gray-400">
                Let Orion help you develop this idea further
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  value={brainstormPrompt}
                  onChange={(e) => setBrainstormPrompt(e.target.value)}
                  placeholder="Optional: Add specific questions or aspects you want Orion to focus on..."
                  className="min-h-[100px] bg-gray-700 border-gray-600 text-gray-200"
                  disabled={isBrainstorming}
                />

                <Button
                  onClick={handleBrainstorm}
                  disabled={isBrainstorming}
                  className="mt-2 bg-purple-600 hover:bg-purple-700"
                >
                  {isBrainstorming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Brainstorming...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Brainstorming
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-3 mt-4">
                {logs.filter(log => log.type === 'llm_brainstorm').length === 0 ? (
                  <p className="text-gray-500 italic">No brainstorming sessions yet. Start one above.</p>
                ) : (
                  logs
                    .filter(log => log.type === 'llm_brainstorm')
                    .map(log => (
                      <div key={log.id} className="bg-purple-900/20 border border-purple-700/50 rounded-md p-3">
                        <div className="flex items-center mb-2">
                          <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                          <span className="text-sm font-medium text-purple-400">Orion&apos;s Brainstorming</span>
                        </div>
                        <p className="text-gray-300 whitespace-pre-wrap">{log.content}</p>
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Habitica Task Creation Dialog */}
      <Dialog open={showHabiticaDialog} onOpenChange={setShowHabiticaDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-200">
          <DialogHeader>
            <DialogTitle className="text-sky-400">Create Habitica To-Do</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create an actionable task in Habitica based on this idea.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="habiticaTaskText" className="text-gray-300">Task Text</Label>
              <Input
                id="habiticaTaskText"
                value={habiticaTaskText}
                onChange={(e) => setHabiticaTaskText(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>

            <div>
              <Label htmlFor="habiticaTaskNotes" className="text-gray-300">Notes (Optional)</Label>
              <Textarea
                id="habiticaTaskNotes"
                value={habiticaTaskNotes}
                onChange={(e) => setHabiticaTaskNotes(e.target.value)}
                rows={3}
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>

            <div>
              <Label htmlFor="habiticaTaskPriority" className="text-gray-300">Priority</Label>
              <Select
                value={String(habiticaTaskPriority)}
                onValueChange={(value) => setHabiticaTaskPriority(Number(value))}
              >
                <SelectTrigger id="habiticaTaskPriority" className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectItem value="0.1">Trivial</SelectItem>
                  <SelectItem value="1">Easy</SelectItem>
                  <SelectItem value="1.5">Medium</SelectItem>
                  <SelectItem value="2">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {habiticaError && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {habiticaError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowHabiticaDialog(false)}
              className="text-gray-300 border-gray-600"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSendToHabitica}
              disabled={isSendingToHabitica || !habiticaTaskText.trim()}
              className="bg-sky-600 hover:bg-sky-700"
            >
              {isSendingToHabitica ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SendToBack className="mr-2 h-4 w-4" />
              )}
              Add to Habitica
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
