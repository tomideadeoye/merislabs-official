"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Loader2, X, Plus } from 'lucide-react';
import { OpportunityCreatePayload, OpportunityType, OpportunityStatus, OpportunityPriority } from '@/types/opportunity';

interface AddOpportunityFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddOpportunityForm: React.FC<AddOpportunityFormProps> = ({ onSuccess, onCancel }) => {
  const [title, setTitle] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [type, setType] = useState<OpportunityType>('job');
  const [status, setStatus] = useState<OpportunityStatus>('identified');
  const [priority, setPriority] = useState<OpportunityPriority>('medium');
  const [description, setDescription] = useState<string>('');
  const [sourceURL, setSourceURL] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !company.trim()) {
      setError('Title and Company/Institution are required.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const opportunityData: OpportunityCreatePayload = {
        title,
        companyOrInstitution: company,
        type,
        status,
        priority,
        descriptionSummary: description || undefined,
        sourceURL: sourceURL || undefined,
        tags: tags.length > 0 ? tags : undefined,
        notes: notes || undefined
      };
      
      const response = await fetch('/api/orion/opportunity/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(opportunityData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        onSuccess();
      } else {
        throw new Error(data.error || 'Failed to create opportunity');
      }
    } catch (err: any) {
      console.error('Error creating opportunity:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="title" className="text-gray-300">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Senior Product Manager"
          className="bg-gray-700 border-gray-600 text-gray-200"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company" className="text-gray-300">Company/Institution *</Label>
        <Input
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="e.g., Acme Corporation"
          className="bg-gray-700 border-gray-600 text-gray-200"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-gray-300">Type</Label>
          <Select value={type} onValueChange={(value: OpportunityType) => setType(value)}>
            <SelectTrigger id="type" className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectItem value="job">Job</SelectItem>
              <SelectItem value="education_program">Education Program</SelectItem>
              <SelectItem value="project_collaboration">Project/Collaboration</SelectItem>
              <SelectItem value="funding">Funding</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status" className="text-gray-300">Status</Label>
          <Select value={status} onValueChange={(value: OpportunityStatus) => setStatus(value)}>
            <SelectTrigger id="status" className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectItem value="identified">Identified</SelectItem>
              <SelectItem value="researching">Researching</SelectItem>
              <SelectItem value="evaluating">Evaluating</SelectItem>
              <SelectItem value="application_ready">Application Ready</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
              <SelectItem value="offer_received">Offer Received</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected_by_them">Rejected</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priority" className="text-gray-300">Priority</Label>
          <Select value={priority} onValueChange={(value: OpportunityPriority) => setPriority(value)}>
            <SelectTrigger id="priority" className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-300">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description or summary of the opportunity"
          className="min-h-[100px] bg-gray-700 border-gray-600 text-gray-200"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="sourceURL" className="text-gray-300">Source URL</Label>
        <Input
          id="sourceURL"
          type="url"
          value={sourceURL}
          onChange={(e) => setSourceURL(e.target.value)}
          placeholder="https://example.com/job-posting"
          className="bg-gray-700 border-gray-600 text-gray-200"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags" className="text-gray-300">Tags</Label>
        <div className="flex">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Add tags and press Enter"
            className="bg-gray-700 border-gray-600 text-gray-200"
          />
          <Button 
            type="button"
            onClick={handleAddTag}
            className="ml-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <div 
                key={tag} 
                className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-gray-400 hover:text-gray-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-gray-300">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes or thoughts about this opportunity"
          className="min-h-[100px] bg-gray-700 border-gray-600 text-gray-200"
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || !title.trim() || !company.trim()} 
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Opportunity'
          )}
        </Button>
      </div>
    </form>
  );
};