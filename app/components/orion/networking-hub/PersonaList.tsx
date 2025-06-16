'use client';

import React from 'react';
import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePersonaStore } from '@/lib/stores/personaStore';
import type { Persona } from '@/lib/types';
import { Edit, Trash2, Users, Loader2 } from 'lucide-react';
import logger from '@/lib/logger';

interface PersonaListProps {
  personas: Persona[];
  isLoading: boolean;
  error: string | null;
}

export function PersonaList({ personas, isLoading, error }: PersonaListProps) {
  const { setSelectedPersona, deletePersonaFromList, selectedPersona } = usePersonaStore();

  const handleDelete = async (id: string) => {
    logger.warn('[PersonaList] Attempting to delete persona', { personaId: id });
    if (!window.confirm('Are you sure you want to delete this persona?')) {
      return;
    }
    try {
      const response = await fetch(`/api/orion/personas/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        deletePersonaFromList(id);
        logger.success('[PersonaList] Persona deleted successfully', { personaId: id });
      } else {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete persona.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      logger.error('[PersonaList] Error deleting persona', { personaId: id, error: errorMessage });
      alert(`Error deleting persona: ${errorMessage}`);
    }
  };

  if (isLoading) {
    logger.info('[PersonaList] Loading personas...');
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="py-8 text-center text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading personas...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    logger.error('[PersonaList] Error loading personas', { error });
    return (
      <Card className="bg-red-900/30 border border-red-700">
        <CardHeader>
          <CardTitle className="text-red-300">Error Loading Personas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">{error}</p>
          <p className="text-sm text-red-400/80 mt-2">Please ensure the backend API is running and accessible.</p>
        </CardContent>
      </Card>
    );
  }

  if (personas.length === 0) {
    logger.info('[PersonaList] No personas found.');
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="py-8 text-center text-gray-400">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No personas created yet. Use the \"Add New Persona\" button to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {personas.map((persona) => (
        <Card
          key={persona.id}
          className={`bg-gray-800 border-gray-700 hover:border-blue-500 transition-all cursor-pointer
            ${selectedPersona?.id === persona.id ? 'border-blue-500 shadow-md' : ''}`}
          onClick={() => {
            setSelectedPersona(persona);
            logger.debug('[PersonaList] Persona selected', { personaId: persona.id, personaName: persona.name });
          }}
        >
          <CardHeader>
            <CardTitle className="text-xl text-white">{persona.name}</CardTitle>
            <CardDescription className="text-gray-400 line-clamp-2">{persona.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-300">
            <p className="text-sm">
              <span className="font-semibold text-blue-300">Role:</span> {persona.role || 'N/A'}
            </p>
            <p className="text-sm">
              <span className="font-semibold text-purple-300">Company:</span> {persona.company || 'N/A'}
            </p>
            <div className="flex flex-wrap gap-1 text-xs">
              {persona.tags?.map((tag, index) => (
                <span key={index} className="bg-gray-700 px-2 py-0.5 rounded text-gray-400">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="text-yellow-400 border-yellow-600 hover:bg-yellow-900/30"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card selection on button click
                  // This action should trigger the form to open in edit mode
                  // Since PersonaList doesn't have direct access to setShowAddForm/setEditingPersona,
                  // this would typically be handled by a prop or a global event/store.
                  // For now, it will just log. The parent page will handle this.
                  logger.info('[PersonaList] Edit button clicked for persona', { personaId: persona.id });
                  // This is where the parent component needs to pass a handler to trigger editing.
                  // For now, `page.tsx`'s useEffect for `feedback` will handle resetting form state.
                  // A better pattern would be `onEditClick: (persona: Persona) => void` prop.
                  // Simulating update:
                  setSelectedPersona(persona); // Select for potential edit
                  // Parent `page.tsx` needs to react to `selectedPersona` change OR an explicit `onEdit` prop.
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card selection on button click
                  handleDelete(persona.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
