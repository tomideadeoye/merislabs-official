'use client';

// GOAL OF FILE|FEATURES|FUNCTIONS: Provides a form for creating or editing a Persona profile. Handles form state, submission to the backend API, and updates the global persona list store.
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/components/orion/networking-hub/PersonaForm.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Consumed by `app/(orion_admin)/admin/networking-hub/page.tsx` (implied parent).
//   - Uses `usePersonaFormStore` (`@/lib/stores/personaFormStore`) for local form state management (formData, loading, feedback).
//   - Uses `usePersonaStore` (`@/lib/stores/personaStore`) to add/update the persona in the global list after successful API call.
//   - Interacts with backend API routes: `/api/orion/personas` (POST for create) and `/api/orion/personas/[id]` (PUT for update).
//   - Uses `@/components/ui` for form elements (`Button`, `Input`, `Label`, `Textarea`, `Card`, `Badge`).
import React, { useEffect } from 'react';
import isEqual from 'lodash.isequal';
import { Button, Input, Label, Textarea, Badge } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePersonaFormStore } from '@/lib/stores/personaFormStore';
import { usePersonaStore } from '@/lib/stores/personaStore';
import type { Persona } from '@/lib/types';
import { Loader2, PlusCircle, XCircle } from 'lucide-react';
import logger from '@/lib/logger';

interface PersonaFormProps {
  initialData?: Partial<Persona>;
  onCancel?: () => void;
}

export function PersonaForm({ initialData, onCancel }: PersonaFormProps) {
  const { formData, setFormData, isLoading, feedback, setIsLoading, setFeedback, resetForm } = usePersonaFormStore();
  const { addPersona, updatePersonaInList } = usePersonaStore();

  const isEditing = !!initialData?.id;

  useEffect(() => {
    logger.debug('[PersonaForm] Initializing form with data:', { initialData, isEditing });

    // Construct the expected formData if resetForm was called with initialData
    // This handles the default empty values for missing properties in initialData
    const targetFormData = {
      name: initialData?.name || '',
      description: initialData?.description || '',
      traits: initialData?.traits || [],
      goals: initialData?.goals || [],
      company: initialData?.company || '',
      role: initialData?.role || '',
      tags: initialData?.tags || [],
    };

    // Compare the current formData from the store with the targetFormData
    // Only reset if they are not deeply equal, preventing unnecessary updates
    if (!isEqual(formData, targetFormData)) {
      logger.info('[PersonaForm] Current form data differs from initial data. Resetting form.', {
        current: formData,
        target: targetFormData,
      });
      resetForm(initialData);
    } else {
      logger.debug('[PersonaForm] Current form data already matches initial data. No reset needed.');
    }
  }, [initialData, resetForm, isEditing, formData]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ [e.target.id]: e.target.value });
  };

  const handleArrayChange = (id: 'traits' | 'goals' | 'tags', value: string) => {
    // Split by comma, trim, filter out empty strings
    const newArray = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    setFormData({ [id]: newArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback({ type: null, message: null });
    logger.info('[PersonaForm] Submitting persona form', { formData, isEditing });

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/orion/personas/${initialData?.id}` : '/api/orion/personas';

      const dataToSend = {
        ...formData,
        // Ensure arrays are sent as arrays, defaulting to empty array if undefined
        traits: formData.traits || [],
        goals: formData.goals || [],
        tags: formData.tags || [],
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.success) {
        setFeedback({ type: 'success', message: `Persona ${isEditing ? 'updated' : 'created'} successfully!` });
        logger.success(`[PersonaForm] Persona ${isEditing ? 'updated' : 'created'} successfully`, {
          persona: result.persona,
        });
        if (isEditing) {
          updatePersonaInList(result.persona);
        } else {
          addPersona(result.persona);
        }
        resetForm(); // Clear form after successful submission
      } else {
        throw new Error(result.error || `Failed to ${isEditing ? 'update' : 'create'} persona.`);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setFeedback({ type: 'error', message: errorMessage });
      logger.error(`[PersonaForm] Error ${isEditing ? 'updating' : 'creating'} persona`, { error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-blue-400">{isEditing ? 'Edit Persona' : 'Add New Persona'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300">
              Name*
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleTextChange}
              className="bg-gray-700 border-gray-600 text-gray-200"
              required
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-gray-300">
              Description*
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleTextChange}
              rows={4}
              className="bg-gray-700 border-gray-600 text-gray-200"
              required
            />
          </div>
          <div>
            <Label htmlFor="traits" className="text-gray-300">
              Traits (comma-separated)
            </Label>
            <Input
              id="traits"
              type="text"
              value={Array.isArray(formData.traits) ? formData.traits.join(', ') : ''}
              onChange={(e) => handleArrayChange('traits', e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-200"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {Array.isArray(formData.traits) &&
                formData.traits.map((trait, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-900 text-blue-200">
                    {trait}
                  </Badge>
                ))}
            </div>
          </div>
          <div>
            <Label htmlFor="goals" className="text-gray-300">
              Goals (comma-separated)
            </Label>
            <Input
              id="goals"
              type="text"
              value={Array.isArray(formData.goals) ? formData.goals.join(', ') : ''}
              onChange={(e) => handleArrayChange('goals', e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-200"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {Array.isArray(formData.goals) &&
                formData.goals.map((goal, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-900 text-purple-200">
                    {goal}
                  </Badge>
                ))}
            </div>
          </div>
          <div>
            <Label htmlFor="company" className="text-gray-300">
              Company (Optional)
            </Label>
            <Input
              id="company"
              type="text"
              value={formData.company || ''}
              onChange={handleTextChange}
              className="bg-gray-700 border-gray-600 text-gray-200"
            />
          </div>
          <div>
            <Label htmlFor="role" className="text-gray-300">
              Role (Optional)
            </Label>
            <Input
              id="role"
              type="text"
              value={formData.role || ''}
              onChange={handleTextChange}
              className="bg-gray-700 border-gray-600 text-gray-200"
            />
          </div>
          <div>
            <Label htmlFor="tags" className="text-gray-300">
              Tags (comma-separated)
            </Label>
            <Input
              id="tags"
              type="text"
              value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
              onChange={(e) => handleArrayChange('tags', e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-200"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {Array.isArray(formData.tags) &&
                formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-600 text-gray-200">
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>

          {feedback.message && (
            <div
              className={`p-3 rounded-md flex items-center space-x-2 ${
                feedback.type === 'success'
                  ? 'bg-green-900/30 border border-green-700 text-green-300'
                  : 'bg-red-900/30 border border-red-700 text-red-300'
              }`}
            >
              {feedback.type === 'success' ? <PlusCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <span>{feedback.message}</span>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="text-gray-300 border-gray-600">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : isEditing ? (
                'Update Persona'
              ) : (
                'Create Persona'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
