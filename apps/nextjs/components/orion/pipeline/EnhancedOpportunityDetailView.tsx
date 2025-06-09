"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Opportunity, EvaluationOutput } from '@shared/types/opportunity';
import {
  ArrowLeft,
  BarChart2,
  FileText,
  Users,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Copy,
  Save,
  Calendar,
  BookText,
  CheckSquare,
  BookOpen,
  LayoutGrid,
  Loader2,
  Edit2
} from 'lucide-react';
import { format } from 'date-fns';
import { EvaluateWithOrionButton } from '../opportunities/EvaluateWithOrionButton';
import { NarrativeAlignmentSection } from '../opportunities/NarrativeAlignmentSection';
import { CreateHabiticaTaskButton } from '../opportunities/CreateHabiticaTaskButton';
import { JournalReflectionDialog } from '../opportunities/JournalReflectionDialog';
import { useJournalReflectionDialogStore } from '../opportunities/journalReflectionDialogStore';
import { StatusUpdateButton } from '../opportunities/StatusUpdateButton';
import { PastOpportunitiesSection } from '../opportunities/PastOpportunitiesSection';
import { LessonsLearnedSection } from '../opportunities/LessonsLearnedSection';
import { DraftApplicationButton } from '../opportunities/application/DraftApplicationButton';
import { FindStakeholdersButton } from '../opportunities/networking/FindStakeholdersButton';
import { ComprehensiveAnalysis } from '../opportunities/ComprehensiveAnalysis';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface EnhancedOpportunityDetailViewProps {
  opportunityId: string;
}

// --- ApplicationDraftsPanel ---
const ApplicationDraftsPanel = ({ opportunityId }: { opportunityId: string }) => {
  const [drafts, setDrafts] = useState<any[]>([]); // [{ draft_content, context }]
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editModal, setEditModal] = useState<{ open: boolean; draftIdx: number | null; text: string }>({ open: false, draftIdx: null, text: '' });
  const [saveStatus, setSaveStatus] = useState<{ [key: number]: string }>({});
  const [editSaveStatus, setEditSaveStatus] = useState<string>('');

  const fetchDrafts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.info('[ApplicationDraftsPanel] Fetching application drafts for', { opportunityId });
      const response = await fetch(`/api/orion/opportunity/${opportunityId}/draft-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numberOfDrafts: 3 })
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.drafts)) {
        setDrafts(data.drafts);
        console.info('[ApplicationDraftsPanel] Drafts loaded', { count: data.drafts.length });
      } else {
        setError(data.error || 'Failed to load drafts');
        console.error('[ApplicationDraftsPanel] Error loading drafts', data.error);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading drafts');
      console.error('[ApplicationDraftsPanel] Exception', err);
    } finally {
      setIsLoading(false);
    }
  }, [opportunityId]);

  useEffect(() => { fetchDrafts(); }, [fetchDrafts]);

  const handleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
    console.info('[ApplicationDraftsPanel] Draft expanded', { idx });
  };
  const handleEdit = (idx: number) => {
    setEditModal({ open: true, draftIdx: idx, text: drafts[idx].draft_content });
    console.info('[ApplicationDraftsPanel] Edit modal opened', { idx });
  };
  const handleEditSave = () => {
    if (editModal.draftIdx !== null) {
      const updated = [...drafts];
      updated[editModal.draftIdx].draft_content = editModal.text;
      setDrafts(updated);
      setEditModal({ open: false, draftIdx: null, text: '' });
      console.info('[ApplicationDraftsPanel] Draft edited and saved', { idx: editModal.draftIdx });
    }
  };
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    console.info('[ApplicationDraftsPanel] Draft copied to clipboard');
  };

  const saveToMemory = async (content: string, idx: number) => {
    setSaveStatus((prev) => ({ ...prev, [idx]: 'Saving...' }));
    try {
      const res = await fetch('/api/orion/memory/add-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
          sourceId: `application_draft_${opportunityId}_${idx}_${Date.now()}`,
          tags: ['application', 'draft', opportunityId],
          metadata: {
            type: 'application_draft',
            opportunityId,
            draftIndex: idx,
            timestamp: new Date().toISOString()
          }
        })
      });
      if (res.ok) {
        setSaveStatus((prev) => ({ ...prev, [idx]: 'Saved!' }));
        console.info('[ApplicationDraftsPanel] Draft saved to memory', { idx });
      } else {
        setSaveStatus((prev) => ({ ...prev, [idx]: 'Error saving' }));
        console.error('[ApplicationDraftsPanel] Error saving draft to memory', { idx });
      }
    } catch (err) {
      setSaveStatus((prev) => ({ ...prev, [idx]: 'Error saving' }));
      console.error('[ApplicationDraftsPanel] Exception saving draft to memory', { idx, err });
    }
    setTimeout(() => setSaveStatus((prev) => ({ ...prev, [idx]: '' })), 2000);
  };

  const saveEditToMemory = async () => {
    if (editModal.draftIdx === null) return;
    setEditSaveStatus('Saving...');
    try {
      const res = await fetch('/api/orion/memory/add-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: editModal.text,
          sourceId: `application_draft_edit_${opportunityId}_${editModal.draftIdx}_${Date.now()}`,
          tags: ['application', 'draft', 'edited', opportunityId],
          metadata: {
            type: 'application_draft_edited',
            opportunityId,
            draftIndex: editModal.draftIdx,
            timestamp: new Date().toISOString()
          }
        })
      });
      if (res.ok) {
        setEditSaveStatus('Saved!');
        console.info('[ApplicationDraftsPanel] Edited draft saved to memory', { idx: editModal.draftIdx });
      } else {
        setEditSaveStatus('Error saving');
        console.error('[ApplicationDraftsPanel] Error saving edited draft to memory', { idx: editModal.draftIdx });
      }
    } catch (err) {
      setEditSaveStatus('Error saving');
      console.error('[ApplicationDraftsPanel] Exception saving edited draft to memory', { idx: editModal.draftIdx, err });
    }
    setTimeout(() => setEditSaveStatus(''), 2000);
  };

  if (isLoading) return <div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Loading drafts...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!drafts.length) return <div>No drafts found. Click to generate.</div>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={fetchDrafts} className="px-4 py-2 bg-blue-700 rounded text-white hover:bg-blue-800">Regenerate Drafts</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {drafts.map((draft, idx) => {
          const draftKey = draft.id || draft.draft_id || draft.draft_content?.slice(0, 16) || idx;
          if (!draftKey) console.warn('[EnhancedOpportunityDetailView] Empty draft key detected', { draft, idx });
          return (
            <div key={draftKey} className="bg-gray-800 rounded-lg shadow p-4 border border-gray-700">
              <div className="flex justify-between items-center">
                <div className="font-bold text-lg">Draft {idx + 1}</div>
                <div className="flex gap-2">
                  <button onClick={() => handleExpand(idx)} className="text-blue-400 hover:text-blue-200"><FileText /></button>
                  <button onClick={() => handleEdit(idx)} className="text-yellow-400 hover:text-yellow-200"><Edit2 /></button>
                  <button onClick={() => handleCopy(draft.draft_content)} className="text-green-400 hover:text-green-200"><Copy /></button>
                  <button onClick={() => saveToMemory(draft.draft_content, idx)} className="text-purple-400 hover:text-purple-200"><Save /></button>
                </div>
              </div>
              <div className="mt-2 text-gray-300 line-clamp-3">{draft.draft_content?.slice(0, 180)}...</div>
              {saveStatus[idx] && <div className="text-xs text-purple-300 mt-1">{saveStatus[idx]}</div>}
              {expandedIndex === idx && (
                <Accordion type="single" value={expandedIndex === idx ? `draft-${idx}` : undefined} className="mt-4">
                  <AccordionItem value={`draft-${idx}`}>
                    <AccordionTrigger>Show Full Draft & Context</AccordionTrigger>
                    <AccordionContent>
                      <div className="whitespace-pre-wrap text-gray-200 mb-4">{draft.draft_content}</div>
                      <div className="mb-2"><span className="font-semibold">Profile Context:</span> <span className="text-gray-400">{draft.context?.profileContext}</span></div>
                      <div className="mb-2"><span className="font-semibold">Company Web Context:</span> <span className="text-gray-400">{draft.context?.companyWebContext}</span></div>
                      <div className="mb-2"><span className="font-semibold">Memories Considered:</span>
                        <ul className="list-disc ml-6 text-gray-400">
                          {draft.context?.memoryResults?.map((mem: any, i: number) => {
                            const memKey = mem.id || mem.source_id || mem.text || mem.content || i;
                            if (!memKey) console.warn('[EnhancedOpportunityDetailView] Empty memoryResult key detected', { mem, i });
                            return <li key={memKey}>{mem.text || mem.content || JSON.stringify(mem)}</li>;
                          })}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          );
        })}
        {/* Edit Modal */}
        <Dialog open={editModal.open} onOpenChange={(open) => setEditModal({ ...editModal, open })}>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader><DialogTitle>Edit Draft</DialogTitle></DialogHeader>
            <textarea
              className="w-full h-40 p-2 rounded bg-gray-800 border border-gray-600 text-gray-200"
              value={editModal.text}
              onChange={e => setEditModal({ ...editModal, text: e.target.value })}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditModal({ open: false, draftIdx: null, text: '' })} className="px-4 py-2 bg-gray-700 rounded text-gray-300">Cancel</button>
              <button onClick={handleEditSave} className="px-4 py-2 bg-blue-600 rounded text-white">Save</button>
              <button onClick={saveEditToMemory} className="px-4 py-2 bg-purple-700 rounded text-white flex items-center gap-2"><Save className="h-4 w-4" />Save to Memory</button>
              {editSaveStatus && <span className="ml-2 text-purple-300 text-xs">{editSaveStatus}</span>}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export const EnhancedOpportunityDetailView: React.FC<EnhancedOpportunityDetailViewProps> = ({ opportunityId }) => {
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationOutput | null>(null);
  const [applicationDrafts, setApplicationDrafts] = useState<string[]>([]);
  const [stakeholders, setStakeholders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isDraftingApplication, setIsDraftingApplication] = useState<boolean>(false);
  const [isSearchingStakeholders, setIsSearchingStakeholders] = useState<boolean>(false);
  const journalReflectionDialogStore = useJournalReflectionDialogStore();

  // Fetch evaluation data
  const fetchEvaluation = useCallback(async () => {
    try {
      const response = await fetch(`/api/orion/opportunity/${opportunityId}/evaluation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // Send empty JSON object
      });
      const data = await response.json();

      if (data.success) {
        setEvaluation(data.evaluation);
      }
    } catch (error) {
      console.error("Error fetching evaluation:", error);
    }
  }, [opportunityId]);

  // Fetch application drafts
  const fetchApplicationDrafts = useCallback(async () => {
    try {
      const response = await fetch(`/api/orion/opportunity/${opportunityId}/drafts`);
      const data = await response.json();

      if (data.success) {
        setApplicationDrafts(data.drafts);
      }
    } catch (error) {
      console.error("Error fetching application drafts:", error);
    }
  }, [opportunityId]);

  // Fetch stakeholders
  const fetchStakeholders = useCallback(async () => {
    try {
      const response = await fetch(`/api/orion/opportunity/${opportunityId}/stakeholders`);
      const data = await response.json();

      if (data.success) {
        setStakeholders(data.stakeholders);
      }
    } catch (error) {
      console.error("Error fetching stakeholders:", error);
    }
  }, [opportunityId]);

  // Fetch opportunity data
  const fetchOpportunityData = useCallback(async () => {
    try {
      const response = await fetch(`/api/orion/opportunity/${opportunityId}`);
      const data = await response.json();

      if (data.success) {
        setOpportunity(data.opportunity);

        // If there's an evaluation ID, fetch the evaluation
        if (data.opportunity.relatedEvaluationId) {
          fetchEvaluation();
        }

        // Fetch application drafts if they exist
        if (data.opportunity.applicationMaterialIds) {
          fetchApplicationDrafts();
        }

        // Fetch stakeholders if they exist
        if (data.opportunity.stakeholderContactIds) {
          fetchStakeholders();
        }
      }
    } catch (error) {
      console.error("Error fetching opportunity:", error);
    } finally {
      setIsLoading(false);
    }
  }, [opportunityId, fetchEvaluation, fetchApplicationDrafts, fetchStakeholders]);

  // Fetch opportunity data
  useEffect(() => {
    fetchOpportunityData();
  }, [opportunityId, fetchOpportunityData]);

  // Run evaluation
  const handleEvaluate = async () => {
    if (!opportunity) return;

    setIsEvaluating(true);

    try {
      const response = await fetch(`/api/orion/opportunity/${opportunityId}/evaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Only need to send a body, the ID is in the URL
        })
      });

      const data = await response.json();

      if (data.success) {
        setEvaluation(data.evaluation);

        // Update opportunity with evaluation ID
        await fetch(`/api/orion/opportunity/${opportunityId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            relatedEvaluationId: data.evaluationId
          })
        });
      }
    } catch (error) {
      console.error("Error evaluating opportunity:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Draft application
  const handleDraftApplication = async () => {
    if (!opportunity) return;

    setIsDraftingApplication(true);

    try {
      const response = await fetch('/api/orion/opportunity/draft-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          opportunity: {
            title: opportunity.title,
            company: opportunity.company,
            content: opportunity.content || '',
          },
          evaluationSummary: evaluation,
          numberOfDrafts: 3
        })
      });

      const data = await response.json();

      if (data.success) {
        setApplicationDrafts(data.drafts);

        // Update opportunity with application draft IDs
        await fetch(`/api/orion/opportunity/${opportunityId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            applicationMaterialIds: JSON.stringify(data.draftIds || [])
          })
        });
      }
    } catch (error) {
      console.error("Error drafting application:", error);
    } finally {
      setIsDraftingApplication(false);
    }
  };

  // Search stakeholders
  const handleSearchStakeholders = async () => {
    if (!opportunity) return;

    setIsSearchingStakeholders(true);

    try {
      const response = await fetch('/api/orion/networking/stakeholder-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company: opportunity.company,
          roles: ['Engineering Manager', 'Recruiter', 'CTO']
        })
      });

      const data = await response.json();

      if (data.success) {
        setStakeholders(data.stakeholders);

        // Update opportunity with stakeholder IDs
        await fetch(`/api/orion/opportunity/${opportunityId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            stakeholderContactIds: JSON.stringify(data.stakeholderIds || [])
          })
        });
      }
    } catch (error) {
      console.error("Error searching stakeholders:", error);
    } finally {
      setIsSearchingStakeholders(false);
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  // Open reflection dialog
  const openReflectionDialog = (type: 'application_sent' | 'interview_completed' | 'outreach_sent' | 'general') => {
    if (opportunity) {
      journalReflectionDialogStore.setDialogData({ opportunity, actionType: type });
      journalReflectionDialogStore.open();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!opportunity) {
    return <div>Opportunity not found.</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <Button onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Pipeline
      </Button>

      <header className="mb-6">
        <h1 className="text-3xl font-bold">{opportunity.title}</h1>
        <p className="text-xl text-muted-foreground">{opportunity.company}</p>
      </header>

      <div className="mt-6">
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader><CardTitle>Opportunity Details</CardTitle></CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: opportunity.content || '' }} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Orion's Analysis</CardTitle>
                  <Button onClick={handleEvaluate} disabled={isEvaluating}>
                    {isEvaluating ? 'Evaluating...' : 'Re-evaluate'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ComprehensiveAnalysis evaluation={evaluation} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="application">
            <Card>
              <CardHeader><CardTitle>Application Materials</CardTitle></CardHeader>
              <CardContent>
                <ApplicationDraftsPanel opportunityId={opportunityId} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stakeholders">
            <Card>
              <CardHeader><CardTitle>Key Stakeholders</CardTitle></CardHeader>
              <CardContent>
                <FindStakeholdersButton opportunity={opportunity} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
