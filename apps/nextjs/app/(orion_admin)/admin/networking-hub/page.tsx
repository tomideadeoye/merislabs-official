"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from "@repo/ui";
import { PageNames, SessionStateKeys } from "@repo/sharedapp_state";
import { useSessionState } from '@repo/sharedhooks/useSessionState';
import { PersonaForm } from '@/components/orion/PersonaForm';
import { PersonaList } from '@/components/orion/PersonaList';
import { OutreachForm } from '@/components/orion/OutreachForm';
import { useOutreachGenerationStore } from '@/components/orion/outreachGenerationStore';
import { Button } from '@repo/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui';
import { Input } from '@repo/ui';
import {
  Network,
  Users,
  UserPlus,
  Search,
  Send,
  Copy,
  CheckCheck
} from 'lucide-react';
import type { Persona } from '@repo/shared';
import { usePersonaStore } from '@/components/orion/personaStore';
import { usePersonaFormStore } from '@/components/orion/persona/personaFormStore';

export default function NetworkingHubPage() {
  // State for personas
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoadingPersonas, setIsLoadingPersonas] = useState<boolean>(true);
  const [personasError, setPersonasError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);

  // State for outreach
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  // Zustand persona store
  const { selectedPersona: storeSelectedPersona, editPersona, deletePersona } = usePersonaStore();

  const { latestOutreach: outreachDraft, clearLatestOutreach } = useOutreachGenerationStore();
  const [copied, setCopied] = useState<boolean>(false);

  // PersonaForm store
  const { feedback, lastSubmittedData, clearFeedback } = usePersonaFormStore();

  // Sync selectedPersona with personaStore
  useEffect(() => {
    if (storeSelectedPersona) {
      setSelectedPersona(storeSelectedPersona);
      clearLatestOutreach();
    }
  }, [storeSelectedPersona, clearLatestOutreach]);

  // Fetch personas on mount
  // Fetch personas from API
  const fetchPersonas = useCallback(async () => {
    setIsLoadingPersonas(true);
    setPersonasError(null);

    try {
      const response = await fetch(`/api/orion/personas${searchQuery ? `?query=${encodeURIComponent(searchQuery)}` : ''}`);
      const data = await response.json();

      if (data.success) {
        setPersonas(data.personas || []);
      } else {
        throw new Error(data.error || 'Failed to fetch personas');
      }
    } catch (err: any) {
      console.error('Error fetching personas:', err);
      setPersonasError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoadingPersonas(false);
    }
  }, [searchQuery]);


  useEffect(() => {
    fetchPersonas();
  }, [fetchPersonas]);

  // Reset copy status after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Side effect: close form and refresh list on PersonaForm success
  useEffect(() => {
    if (feedback?.type === 'success') {
      setShowAddForm(false);
      setEditingPersona(null);
      fetchPersonas();
      clearFeedback();
    }
  }, [feedback, fetchPersonas, clearFeedback]);

  // Listen for persona delete action in personaStore and update local state
  useEffect(() => {
    // This is a placeholder for future implementation:
    // You may want to listen for a deletePersona event and update local state accordingly.
    // For now, deletion is handled via API and local state update.
  }, []);

  // Handle outreach generation
  // (No longer needed: handled by global store)

  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(outreachDraft || "");
    setCopied(true);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Strategic Outreach Engine"
        icon={<Network className="h-7 w-7" />}
        description="Create persona maps and craft personalized outreach messages."
      />

      <Tabs defaultValue="personas" className="w-full">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="personas" className="data-[state=active]:bg-gray-700">
            <Users className="h-4 w-4 mr-2" />
            Personas
          </TabsTrigger>
          <TabsTrigger value="outreach" className="data-[state=active]:bg-gray-700" disabled={!selectedPersona}>
            <Send className="h-4 w-4 mr-2" />
            Craft Outreach
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personas" className="mt-6 space-y-6">
          {/* Personas Tab Content */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search personas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 bg-gray-700 border-gray-600 text-gray-200"
              />
              <Button
                onClick={() => fetchPersonas()}
                variant="outline"
                className="bg-gray-700 hover:bg-gray-600"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingPersona(null);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {showAddForm ? 'Cancel' : 'Add New Persona'}
            </Button>
          </div>

          {/* Add/Edit Persona Form */}
          {(showAddForm || editingPersona) && (
            <div className="mb-6">
              <PersonaForm
                initialData={editingPersona || {}}
                onCancel={() => {
                  setShowAddForm(false);
                  setEditingPersona(null);
                }}
              />
            </div>
          )}

          {/* Personas List */}
          <PersonaList
            personas={personas}
            isLoading={isLoadingPersonas}
            error={personasError}
          />
        </TabsContent>

        <TabsContent value="outreach" className="mt-6 space-y-6">
          {/* Outreach Tab Content */}
          {selectedPersona ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <OutreachForm
                  persona={selectedPersona}
                />
              </div>

              <div className="space-y-4">
                <div className="bg-gray-800 border border-gray-700 rounded-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-blue-400">Generated Outreach</h3>
                    {outreachDraft && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700 hover:bg-gray-600"
                        onClick={handleCopyToClipboard}
                      >
                        {copied ? (
                          <>
                            <CheckCheck className="mr-1 h-4 w-4 text-green-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1 h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {outreachDraft ? (
                    <div className="whitespace-pre-wrap text-gray-300 bg-gray-700/50 p-4 rounded-md border border-gray-600 max-h-[600px] overflow-y-auto">
                      {outreachDraft}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <Send className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>Fill out the form to generate outreach content.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Select a persona from the Personas tab to craft outreach content.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
