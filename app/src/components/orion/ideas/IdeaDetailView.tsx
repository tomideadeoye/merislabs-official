'use client';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component
// Opportunities for improvement or consolidation.

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Textarea,
  Badge,
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
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/ui/components/ui';
import {
  Loader2,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  Save,
  MessageSquare,
  History,
  Sparkles,
  SendToBack,
} from 'lucide-react';
import { IdeaStatus, Idea, IdeaLog } from '@/types/ideas';
import { useHabiticaTaskDialogStore } from '../tasks/habiticaTaskDialogStore';

interface IdeaDetailViewProps {
  ideaId: string;
  className?: string;
}

// Status display configuration
const statusConfig: Record<IdeaStatus, { label: string; color: string }> = {
  raw_spark: { label: 'Raw Spark', color: 'bg-yellow-500' },
  fleshing_out: { label: 'Fleshing Out', color: 'bg-blue-500' },
  researching: { label: 'Researching', color: 'bg-purple-500' },
  prototyping: { label: 'Prototyping', color: 'bg-green-500' },
  on_hold: { label: 'On Hold', color: 'bg-gray-500' },
  archived: { label: 'Archived', color: 'bg-red-500' },
  completed: { label: 'Completed', color: 'bg-emerald-500' },
};

const IDEA_STATUS_VALUES: IdeaStatus[] = [
  'raw_spark',
  'fleshing_out',
  'researching',
  'prototyping',
  'on_hold',
  'archived',
  'completed',
];

export const IdeaDetailView: React.FC<IdeaDetailViewProps> = ({ ideaId, className }) => {
  const router = useRouter();

  const [idea, setIdea] = useState<Idea | null>(null);
  const [logs, setLogs] = useState<IdeaLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editStatus, setEditStatus] = useState<IdeaStatus>('raw_spark');
  const [editTags, setEditTags] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Note state
  const [newNote, setNewNote] = useState<string>('');
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);

  // Brainstorm state
  const [isBrainstorming, setIsBrainstorming] = useState<boolean>(false);
  const [brainstormPrompt, setBrainstormPrompt] = useState<string>('');

  const { openDialog } = useHabiticaTaskDialogStore();

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
        setEditDescription(data.idea.description || '');
        setEditStatus(data.idea.status);
        setEditTags(data.idea.tags?.join(', ') || '');
      } else {
        throw new Error(data.error || 'Failed to fetch idea');
      }
    } catch (err: unknown) {
      const errorToSet = err instanceof Error ? err : new Error(String(err));
      console.error('Error fetching idea:', errorToSet);
      setError(errorToSet.message || 'An unexpected error occurred');
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
        .map((tag) => tag.trim())
        .filter(Boolean);

      const response = await fetch(`/api/orion/ideas/${ideaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          status: editStatus,
          tags: tagArray,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIdea(data.idea);
        setIsEditing(false);
        fetchIdea(); // Refresh to get updated logs
      } else {
        throw new Error(data.error || 'Failed to update idea');
      }
    } catch (err: unknown) {
      const errorToSet = err instanceof Error ? err : new Error(String(err));
      console.error('Error updating idea:', errorToSet);
      setError(errorToSet.message || 'An unexpected error occurred');
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: newNote.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNewNote('');
        fetchIdea(); // Refresh to get updated logs
      } else {
        throw new Error(data.error || 'Failed to add note');
      }
    } catch (err: unknown) {
      const errorToSet = err instanceof Error ? err : new Error(String(err));
      console.error('Error adding note:', errorToSet);
      setError(errorToSet.message || 'An unexpected error occurred');
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: brainstormPrompt,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setBrainstormPrompt('');
        fetchIdea(); // Refresh to get updated logs
      } else {
        throw new Error(data.error || 'Failed to generate brainstorming');
      }
    } catch (err: unknown) {
      const errorToSet = err instanceof Error ? err : new Error(String(err));
      console.error('Error generating brainstorming:', errorToSet);
      setError(errorToSet.message || 'An unexpected error occurred');
    } finally {
      setIsBrainstorming(false);
    }
  };

  const handleCreateTask = () => {
    const taskText = `Develop idea: ${idea?.title}`;
    const taskNotes = `From Orion Idea Incubator: ${idea?.title}\nRef: /admin/idea-incubator/${idea?.id}\n\n${idea?.description || ''}`;
    openDialog({
      initialTaskText: taskText,
      initialTaskNotes: taskNotes,
      originalEntryId: idea?.id,
    });
  };

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
      <div className="flex flex-col items-center justify-center p-8 text-red-500">
        <AlertTriangle className="mb-2 h-12 w-12" />
        <p className="text-lg font-semibold">Error loading idea</p>
        <p className="text-sm">{error}</p>
        <Button onClick={fetchIdea} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-400">
        <Lightbulb className="mb-2 h-12 w-12" />
        <p className="text-lg font-semibold">Idea not found</p>
        <p className="text-sm">Please check the URL or create a new idea.</p>
        <Button onClick={() => router.push('/admin/idea-incubator')} className="mt-4">
          Back to Idea List
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 p-6 ${className || ''}`}>
      <Button variant="outline" onClick={() => router.push('/admin/idea-incubator')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Ideas
      </Button>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold text-blue-300">{idea.title}</CardTitle>
            <Badge
              className={`${statusConfig[idea.status]?.color || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm`}
            >
              {statusConfig[idea.status]?.label || idea.status}
            </Badge>
          </div>
          <CardDescription className="text-gray-400 mt-2">ID: {idea.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">{idea.description}</p>
          {idea.tags && idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {idea.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex space-x-2 mt-4">
            <Button onClick={() => setIsEditing(true)}>
              <Save className="mr-2 h-4 w-4" />
              Edit Idea
            </Button>
            <Button variant="outline" onClick={handleCreateTask}>
              <SendToBack className="mr-2 h-4 w-4 rotate-180" />
              Send to Habitica as Task
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="logs">
            <History className="h-4 w-4 mr-2" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="notes">
            <MessageSquare className="h-4 w-4 mr-2" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="brainstorm">
            <Sparkles className="h-4 w-4 mr-2" />
            Brainstorm
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl">Activity Log</CardTitle>
              <CardDescription className="text-gray-400">A timeline of changes and notes.</CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <p className="text-gray-400">No activity yet.</p>
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.timestamp} className="border-l-2 border-blue-500 pl-4">
                      <p className="text-sm text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
                      <p className="text-gray-300">{log.details}</p>
                      {log.content && <p className="text-xs text-gray-500 mt-1">Content: {log.content}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl">Add Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Add a new note about this idea..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
                className="bg-gray-700"
              />
              <Button onClick={handleAddNote} disabled={isAddingNote || !newNote.trim()}>
                {isAddingNote ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MessageSquare className="mr-2 h-4 w-4" />
                )}
                {isAddingNote ? 'Adding Note...' : 'Add Note'}
              </Button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brainstorm" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl">Brainstorming</CardTitle>
              <CardDescription className="text-gray-400">
                Generate new ideas or expand on existing ones using AI.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What do you want to brainstorm about this idea? E.g., 'Generate 5 potential features for this idea.'"
                value={brainstormPrompt}
                onChange={(e) => setBrainstormPrompt(e.target.value)}
                rows={4}
                className="bg-gray-700"
              />
              <Button onClick={handleBrainstorm} disabled={isBrainstorming || !brainstormPrompt.trim()}>
                {isBrainstorming ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isBrainstorming ? 'Brainstorming...' : 'Start Brainstorm'}
              </Button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Edit Idea</DialogTitle>
          <DialogDescription>Make changes to your idea here. Click save when you&apos;re done.</DialogDescription>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="col-span-3 bg-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="col-span-3 bg-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={editStatus} onValueChange={(value: IdeaStatus) => setEditStatus(value)}>
                <SelectTrigger className="col-span-3 bg-gray-700">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {IDEA_STATUS_VALUES.map((statusValue) => (
                    <SelectItem key={statusValue} value={statusValue}>
                      {statusConfig[statusValue]?.label || statusValue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags (comma-separated)
              </Label>
              <Input
                id="tags"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="col-span-3 bg-gray-700"
              />
            </div>
          </div>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
};
