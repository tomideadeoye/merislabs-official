"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, X } from 'lucide-react';
import { OpportunityCreatePayload, OpportunityNotionInput } from '@/types/orion';

interface AddOpportunityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (opportunityId: string) => void;
}

export const AddOpportunityForm: React.FC<AddOpportunityFormProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<OpportunityCreatePayload>({
    title: '',
    company: '',
    type: 'job',
    status: 'Not Started',
    content: '',
    description: '',
    sourceURL: '',
    tags: []
  });

  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: OpportunityCreatePayload) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: OpportunityCreatePayload) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData((prev: OpportunityCreatePayload) => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const notionPayload: OpportunityNotionInput = {
      title: formData.title,
      company: formData.companyOrInstitution || '',
      type: formData.type,
      status: formData.status,
      description: formData.description,
      url: formData.sourceURL,
      tags: [],
      dateIdentified: new Date().toISOString(),
      priority: 'medium',
      nextActionDate: undefined,
    };

    try {
      const response = await fetch('/api/orion/notion/opportunity/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notionPayload)
      });

      const data = await response.json();

      if (data.success && data.opportunity) {
        if (onSuccess) {
          onSuccess(data.opportunity.id);
        }
        onClose();
        setFormData({
          title: '',
          company: '',
          type: 'job',
          status: 'Not Started',
          content: '',
          description: '',
          sourceURL: '',
          tags: []
        });
        setTagsInput('');
      } else {
        throw new Error(data.error || 'Failed to create opportunity');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Error creating opportunity:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-gray-200 border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Opportunity</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Job title or opportunity name"
              className="bg-gray-700 border-gray-600 text-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyOrInstitution">Company / Institution *</Label>
            <Input
              id="companyOrInstitution"
              name="companyOrInstitution"
              value={formData.companyOrInstitution}
              onChange={handleChange}
              placeholder="Company or institution name"
              className="bg-gray-700 border-gray-600 text-gray-200"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger id="type" className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectItem value="job">Job</SelectItem>
                  <SelectItem value="education_program">Education Program</SelectItem>
                  <SelectItem value="project_collaboration">Project Collaboration</SelectItem>
                  <SelectItem value="funding">Funding</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status" className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In progress">In progress</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Offer">Offer</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Description</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Brief description of the opportunity"
              className="bg-gray-700 border-gray-600 text-gray-200 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Full description of the opportunity"
              className="bg-gray-700 border-gray-600 text-gray-200 min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceURL">Source URL</Label>
            <Input
              id="sourceURL"
              name="sourceURL"
              value={formData.sourceURL}
              onChange={handleChange}
              placeholder="https://example.com/job-posting"
              className="bg-gray-700 border-gray-600 text-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              value={tagsInput}
              onChange={handleTagsChange}
              placeholder="e.g., remote, senior, tech"
              className="bg-gray-700 border-gray-600 text-gray-200"
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Opportunity'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
