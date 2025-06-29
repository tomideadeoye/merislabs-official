'use client';

import { useOpportunityDialogStore } from '@/hooks/useOpportunityDialogStore';
import { $Enums } from '@/lib/types';
import {
  Input,
  Textarea,
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'; // Use your project's UI components
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog'; // Use your project's Dialog

import React, { useState, useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface AddOpportunityFormProps {
  onSuccess?: (id: string) => void;
}

// Define the interface for the form's internal state
interface AddOpportunityFormState {
  title: string;
  companyOrInstitution: string;
  type: $Enums.OpportunityType | ''; // Allow empty string for optional selection
  status: $Enums.OpportunityStatus;
  priority: $Enums.OpportunityPriority;
  content: string;
  url: string;
  tags: string[];
  location: string; // Keep as string, handle null in payload
  position: string;
  salary: string;
  notes: string;
  contactPerson: string;
  contactEmail: string;
  stage: string;
  attachments: string[];
  relatedEvaluationId: string;
  sourceUrl: string;
  nextActionDate: string;
  tailoredCv: string;
  deadline: string;
  contact: string;
  lastStatusUpdate: string;
  dateIdentified: string; // Explicitly included and typed as string
}

export const AddOpportunityForm: React.FC<AddOpportunityFormProps> = ({ onSuccess }) => {
  const { isOpen, close } = useOpportunityDialogStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      close: state.close,
    }))
  );

  const initialFormData: AddOpportunityFormState = useMemo(
    () => ({
      title: '',
      companyOrInstitution: '',
      type: '', // Start with an empty string for optional selection
      status: $Enums.OpportunityStatus.IDENTIFIED, // This will now be 'IDENTIFIED'
      priority: $Enums.OpportunityPriority.MEDIUM, // This will now be 'MEDIUM'
      content: '',
      url: '',
      tags: [] as string[],
      location: '',
      position: '',
      salary: '',
      notes: '',
      contactPerson: '',
      contactEmail: '',
      stage: '',
      attachments: [] as string[],
      relatedEvaluationId: '',
      sourceUrl: '',
      nextActionDate: '',
      tailoredCv: '',
      deadline: '',
      contact: '',
      lastStatusUpdate: '',
      dateIdentified: '',
    }),
    []
  );

  const [formData, setFormData] = useState<AddOpportunityFormState>(initialFormData);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData); // Reset to initial state
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, initialFormData]); // Added initialFormData to dependency array

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof AddOpportunityFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value as (typeof prev)[typeof name] }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      tags: e.target.value.split(',').map((tag) => tag.trim()),
    }));
  };

  const handleDialogClose = () => {
    close();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/orion/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Failed to create opportunity');
      }

      const data = await response.json();

      if (data.success) {
        if (onSuccess) {
          onSuccess(data.id); // Prisma returns id directly on the created object
        }
        handleDialogClose();
      } else {
        setError(data.error || data.details || 'An unknown error occurred');
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
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-2xl bg-gray-800 border-gray-700 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-blue-400">Add New Opportunity</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter the details for the new opportunity. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-2 space-y-4 py-4">
          {/* Form fields with consistent styling */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">
              Title *
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Senior Product Manager, PhD Program in AI"
              required
              className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyOrInstitution" className="text-gray-300">
                Company / Institution
              </Label>
              <Input
                id="companyOrInstitution"
                name="companyOrInstitution"
                value={formData.companyOrInstitution}
                onChange={handleChange}
                placeholder="e.g., Google, Stanford University"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position" className="text-gray-300">
                Position / Role
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g., Product Manager, PhD Candidate"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-gray-300">
                Type
              </Label>
              <Select
                name="type"
                value={formData.type}
                onValueChange={(value: $Enums.OpportunityType | '') => handleSelectChange('type', value)}
              >
                <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                  {Object.values($Enums.OpportunityType).map((typeValue: $Enums.OpportunityType) => (
                    <SelectItem key={typeValue} value={typeValue}>
                      {typeValue.charAt(0).toUpperCase() + typeValue.slice(1).replace(/([A-Z])/g, ' $1')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-300">
                Status
              </Label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={(value: $Enums.OpportunityStatus) => handleSelectChange('status', value)}
              >
                <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                  {Object.values($Enums.OpportunityStatus).map((statusValue: $Enums.OpportunityStatus) => (
                    <SelectItem key={statusValue} value={statusValue}>
                      {statusValue.charAt(0).toUpperCase() +
                        statusValue
                          .slice(1)
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-gray-300">
                Priority
              </Label>
              <Select
                name="priority"
                value={formData.priority}
                onValueChange={(value: $Enums.OpportunityPriority) => handleSelectChange('priority', value)}
              >
                <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                  {Object.values($Enums.OpportunityPriority).map((priorityValue: $Enums.OpportunityPriority) => (
                    <SelectItem key={priorityValue} value={priorityValue}>
                      {priorityValue.charAt(0).toUpperCase() + priorityValue.slice(1).replace(/([A-Z])/g, ' $1')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-300">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., San Francisco, CA or Remote"
              className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary" className="text-gray-300">
              Salary / Compensation
            </Label>
            <Input
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g., $120,000 USD or Competitive"
              className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-gray-300">
              Full Description / Content
            </Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Paste the job description, program details, or any relevant content here."
              rows={6}
              className="w-full min-h-[150px] bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-md p-3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url" className="text-gray-300">
              URL (Main Link)
            </Label>
            <Input
              id="url"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="e.g., https://linkedin.com/jobs/123"
              className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceUrl" className="text-gray-300">
              Source URL (Original Discovery Link)
            </Label>
            <Input
              id="sourceUrl"
              name="sourceUrl"
              type="url"
              value={formData.sourceUrl}
              onChange={handleChange}
              placeholder="e.g., https://career-site.com/listing"
              className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateIdentified" className="text-gray-300">
              Date Identified (YYYY-MM-DD)
            </Label>
            <Input
              id="dateIdentified"
              name="dateIdentified"
              type="date"
              value={formData.dateIdentified}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-300">
              Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional notes about this opportunity."
              rows={3}
              className="w-full min-h-[90px] bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-md p-3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="text-gray-300">
                Contact Person
              </Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="e.g., John Doe"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-gray-300">
                Contact Email
              </Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="e.g., john.doe@example.com"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage" className="text-gray-300">
              Stage
            </Label>
            <Input
              id="stage"
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              placeholder="e.g., Initial Screening, Technical Interview"
              className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-gray-300">
              Tags (comma-separated)
            </Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              placeholder="e.g., frontend, react, project-management"
              className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-gray-300">
              Application Deadline (YYYY-MM-DD)
            </Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastStatusUpdate" className="text-gray-300">
              Last Status Update (YYYY-MM-DD)
            </Label>
            <Input
              id="lastStatusUpdate"
              name="lastStatusUpdate"
              type="date"
              value={formData.lastStatusUpdate}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm">Error: {error}</p>}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleDialogClose}
              className="text-gray-300 border-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? 'Creating...' : 'Create Opportunity'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOpportunityForm;
