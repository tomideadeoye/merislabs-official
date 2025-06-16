'use client';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component, usage patterns, next steps if any

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Button,
  Label,
  Textarea,
} from '@/ui/components/ui';
import { useOpportunityDialogStore } from '@/app/hooks/useOpportunityDialogStore';
import { OpportunityNotionInput } from '@/app/index';

interface AddOpportunityFormProps {
  onSuccess?: (opportunityId: string) => void;
}

export const AddOpportunityForm: React.FC<AddOpportunityFormProps> = ({ onSuccess }) => {
  const { isOpen, close } = useOpportunityDialogStore((state) => ({
    isOpen: state.isOpen,
    close: state.close,
  }));
  const [formData, setFormData] = useState({
    title: '',
    company_or_institution: '',
    type: 'job',
    status: 'identified',
    content: '',
    source_url: '',
    tags: [] as string[],
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        company_or_institution: '',
        type: 'job',
        status: 'identified',
        content: '',
        source_url: '',
        tags: [],
      });
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      tags: e.target.value.split(',').map((tag) => tag.trim()),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const notionPayload: OpportunityNotionInput = {
      title: formData.title,
      companyOrInstitution: formData.company_or_institution || '',
      type: { name: formData.type },
      status: { name: formData.status },
      notes: [{ type: 'text', text: { content: formData.content } }],
      url: formData.source_url,
      tags: formData.tags.map((tag) => ({ name: tag })),
      dateIdentified: { start: new Date().toISOString() },
    };

    try {
      const response = await fetch('/api/orion/notion/OrionOpportunity/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notionPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create OrionOpportunity');
      }

      const data = await response.json();

      if (data.success) {
        if (onSuccess) {
          onSuccess(data.orion_opportunity.id);
        }
        close();
        setFormData({
          title: '',
          company_or_institution: '',
          type: 'job',
          status: 'identified',
          content: '',
          source_url: '',
          tags: [],
        });
      } else {
        setError(data.error || 'An unknown error occurred');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New OrionOpportunity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Job title, program name, etc."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_or_institution">Company / Institution *</Label>
              <Input
                id="company_or_institution"
                name="company_or_institution"
                value={formData.company_or_institution}
                onChange={handleChange}
                placeholder="Company or institution name"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Input id="type" name="type" value={formData.type} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Input id="status" name="status" value={formData.status} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Full Description *</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Full description of the OrionOpportunity"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source_url">Source URL</Label>
              <Input
                id="source_url"
                name="source_url"
                value={formData.source_url}
                onChange={handleChange}
                placeholder="https://example.com/job/123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="e.g., frontend, react, project-management"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create OrionOpportunity'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOpportunityForm;
