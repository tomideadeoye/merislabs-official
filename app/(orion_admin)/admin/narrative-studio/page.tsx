"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/hooks/useSessionState';
import { ValuePropositionForm } from '@/components/orion/ValuePropositionForm';
import { CareerMilestoneForm } from '@/components/orion/CareerMilestoneForm';
import { CareerMilestoneList } from '@/components/orion/CareerMilestoneList';
import { NarrativeGenerationForm } from '@/components/orion/NarrativeGenerationForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Award, 
  Lightbulb, 
  Plus, 
  Copy,
  CheckCheck
} from 'lucide-react';
import type { ValueProposition, CareerMilestone } from '@/types/narrative-clarity';

export default function NarrativeStudioPage() {
  // Value Proposition state
  const [valueProposition, setValueProposition] = useState<ValueProposition | null>(null);
  const [isLoadingValueProp, setIsLoadingValueProp] = useState<boolean>(true);
  const [valuePropError, setValuePropError] = useState<string | null>(null);
  
  // Career Milestones state
  const [milestones, setMilestones] = useState<CareerMilestone[]>([]);
  const [isLoadingMilestones, setIsLoadingMilestones] = useState<boolean>(true);
  const [milestonesError, setMilestonesError] = useState<string | null>(null);
  const [showAddMilestoneForm, setShowAddMilestoneForm] = useState<boolean>(false);
  const [editingMilestone, setEditingMilestone] = useState<CareerMilestone | null>(null);
  
  // Narrative Generation state
  const [narrativeContent, setNarrativeContent] = useSessionState(SessionStateKeys.NARRATIVE_CONTENT, "");
  const [narrativeTitle, setNarrativeTitle] = useSessionState(SessionStateKeys.NARRATIVE_TITLE, "");
  const [copied, setCopied] = useState<boolean>(false);
  
  // Fetch value proposition and career milestones on mount
  useEffect(() => {
    fetchValueProposition();
    fetchCareerMilestones();
  }, []);
  
  // Reset copy status after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Fetch value proposition from API
  const fetchValueProposition = async () => {
    setIsLoadingValueProp(true);
    setValuePropError(null);
    
    try {
      const response = await fetch('/api/orion/narrative/value-proposition');
      const data = await response.json();
      
      if (data.success) {
        setValueProposition(data.valueProposition);
      } else if (data.error !== 'Value proposition not found') {
        throw new Error(data.error || 'Failed to fetch value proposition');
      }
    } catch (err: any) {
      console.error('Error fetching value proposition:', err);
      setValuePropError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoadingValueProp(false);
    }
  };

  // Fetch career milestones from API
  const fetchCareerMilestones = async () => {
    setIsLoadingMilestones(true);
    setMilestonesError(null);
    
    try {
      const response = await fetch('/api/orion/narrative/milestones');
      const data = await response.json();
      
      if (data.success) {
        setMilestones(data.milestones || []);
      } else {
        throw new Error(data.error || 'Failed to fetch career milestones');
      }
    } catch (err: any) {
      console.error('Error fetching career milestones:', err);
      setMilestonesError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoadingMilestones(false);
    }
  };

  // Handle value proposition form submission
  const handleValuePropSubmit = async (data: Partial<ValueProposition>) => {
    try {
      const response = await fetch('/api/orion/narrative/value-proposition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      
      if (responseData.success) {
        setValueProposition(responseData.valueProposition);
      } else {
        throw new Error(responseData.error || 'Failed to save value proposition');
      }
    } catch (err: any) {
      console.error('Error saving value proposition:', err);
      throw err;
    }
  };

  // Handle career milestone form submission
  const handleMilestoneSubmit = async (data: Partial<CareerMilestone>) => {
    try {
      if (editingMilestone?.id) {
        // Update existing milestone
        const response = await fetch(`/api/orion/narrative/milestones?id=${editingMilestone.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        const responseData = await response.json();
        
        if (responseData.success) {
          setMilestones(prev => prev.map(m => m.id === editingMilestone.id ? responseData.milestone : m));
          setEditingMilestone(null);
        } else {
          throw new Error(responseData.error || 'Failed to update career milestone');
        }
      } else {
        // Create new milestone
        const response = await fetch('/api/orion/narrative/milestones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        const responseData = await response.json();
        
        if (responseData.success) {
          setMilestones(prev => [...prev, responseData.milestone]);
          setShowAddMilestoneForm(false);
        } else {
          throw new Error(responseData.error || 'Failed to create career milestone');
        }
      }
    } catch (err: any) {
      console.error('Error saving career milestone:', err);
      throw err;
    }
  };

  // Handle milestone deletion
  const handleDeleteMilestone = async (id: string) => {
    if (!confirm('Are you sure you want to delete this career milestone?')) return;
    
    try {
      const response = await fetch(`/api/orion/narrative/milestones?id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMilestones(prev => prev.filter(m => m.id !== id));
        
        // If the deleted milestone was being edited, clear editing state
        if (editingMilestone?.id === id) {
          setEditingMilestone(null);
        }
      } else {
        throw new Error(data.error || 'Failed to delete career milestone');
      }
    } catch (err: any) {
      console.error('Error deleting career milestone:', err);
      alert(`Error: ${err.message || 'Failed to delete career milestone'}`);
    }
  };

  // Handle milestone reordering
  const handleReorderMilestone = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = milestones.findIndex(m => m.id === id);
    if (currentIndex === -1) return;
    
    const newMilestones = [...milestones];
    const milestone = newMilestones[currentIndex];
    
    if (direction === 'up' && currentIndex > 0) {
      const prevMilestone = newMilestones[currentIndex - 1];
      const tempOrder = milestone.order;
      milestone.order = prevMilestone.order;
      prevMilestone.order = tempOrder;
      
      try {
        await Promise.all([
          fetch(`/api/orion/narrative/milestones?id=${milestone.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: milestone.order })
          }),
          fetch(`/api/orion/narrative/milestones?id=${prevMilestone.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: prevMilestone.order })
          })
        ]);
        
        // Re-sort the milestones
        newMilestones.sort((a, b) => a.order - b.order);
        setMilestones(newMilestones);
      } catch (err: any) {
        console.error('Error reordering milestones:', err);
        alert(`Error: ${err.message || 'Failed to reorder milestones'}`);
      }
    } else if (direction === 'down' && currentIndex < newMilestones.length - 1) {
      const nextMilestone = newMilestones[currentIndex + 1];
      const tempOrder = milestone.order;
      milestone.order = nextMilestone.order;
      nextMilestone.order = tempOrder;
      
      try {
        await Promise.all([
          fetch(`/api/orion/narrative/milestones?id=${milestone.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: milestone.order })
          }),
          fetch(`/api/orion/narrative/milestones?id=${nextMilestone.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: nextMilestone.order })
          })
        ]);
        
        // Re-sort the milestones
        newMilestones.sort((a, b) => a.order - b.order);
        setMilestones(newMilestones);
      } catch (err: any) {
        console.error('Error reordering milestones:', err);
        alert(`Error: ${err.message || 'Failed to reorder milestones'}`);
      }
    }
  };

  // Handle narrative generation
  const handleNarrativeGenerated = (content: string, title: string) => {
    setNarrativeContent(content);
    setNarrativeTitle(title);
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(narrativeContent || "");
    setCopied(true);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Narrative Clarity Studio"
        icon={<FileText className="h-7 w-7" />}
        description="Define your value proposition, document career milestones, and generate compelling narrative content."
      />

      <Tabs defaultValue="value-proposition" className="w-full">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="value-proposition" className="data-[state=active]:bg-gray-700">
            <Lightbulb className="h-4 w-4 mr-2" />
            Value Proposition
          </TabsTrigger>
          <TabsTrigger value="career-milestones" className="data-[state=active]:bg-gray-700">
            <Award className="h-4 w-4 mr-2" />
            Career Milestones
          </TabsTrigger>
          <TabsTrigger value="generate-narrative" className="data-[state=active]:bg-gray-700">
            <FileText className="h-4 w-4 mr-2" />
            Generate Narrative
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="value-proposition" className="mt-6 space-y-6">
          {/* Value Proposition Tab Content */}
          {!isLoadingValueProp && (
            <ValuePropositionForm 
              initialData={valueProposition || {}}
              onSubmit={handleValuePropSubmit}
            />
          )}
          
          {isLoadingValueProp && (
            <div className="text-center py-8">
              <div className="animate-pulse space-y-2">
                <div className="h-12 bg-gray-700 rounded w-full"></div>
                <div className="h-12 bg-gray-700 rounded w-full"></div>
                <div className="h-12 bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          )}
          
          {valuePropError && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md">
              <p className="font-semibold">Error loading value proposition</p>
              <p>{valuePropError}</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="career-milestones" className="mt-6 space-y-6">
          {/* Career Milestones Tab Content */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-200">Your Career Milestones</h2>
            <Button 
              onClick={() => {
                setShowAddMilestoneForm(!showAddMilestoneForm);
                setEditingMilestone(null);
              }}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              {showAddMilestoneForm ? 'Cancel' : 'Add Milestone'}
            </Button>
          </div>
          
          {/* Add/Edit Milestone Form */}
          {(showAddMilestoneForm || editingMilestone) && (
            <div className="mb-6">
              <CareerMilestoneForm 
                initialData={editingMilestone || {}}
                onSubmit={handleMilestoneSubmit}
                onCancel={() => {
                  setShowAddMilestoneForm(false);
                  setEditingMilestone(null);
                }}
                existingMilestonesCount={milestones.length}
              />
            </div>
          )}
          
          {/* Milestones List */}
          <CareerMilestoneList 
            milestones={milestones}
            onEdit={(milestone) => {
              setEditingMilestone(milestone);
              setShowAddMilestoneForm(false);
            }}
            onDelete={handleDeleteMilestone}
            onReorder={handleReorderMilestone}
            isLoading={isLoadingMilestones}
            error={milestonesError}
          />
        </TabsContent>
        
        <TabsContent value="generate-narrative" className="mt-6 space-y-6">
          {/* Generate Narrative Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <NarrativeGenerationForm 
                onNarrativeGenerated={handleNarrativeGenerated}
              />
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-800 border border-gray-700 rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-blue-400">
                    {narrativeTitle || "Generated Narrative"}
                  </h3>
                  {narrativeContent && (
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
                
                {narrativeContent ? (
                  <div className="whitespace-pre-wrap text-gray-300 bg-gray-700/50 p-4 rounded-md border border-gray-600 max-h-[600px] overflow-y-auto">
                    {narrativeContent}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>Fill out the form to generate narrative content.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}