"use client";

import React from 'react';
import { Button, Card, CardContent, Badge } from '@repo/ui';
import {
  User,
  Building,
  Briefcase,
  Tag,
  Edit,
  Trash2,
  Search,
  AlertTriangle
} from 'lucide-react';
import type { PersonaMap } from '@shared/types/strategic-outreach';

import { usePersonaStore } from "./personaStore";

interface PersonaListProps {
  personas: PersonaMap[];
  isLoading?: boolean;
  error?: string | null;
}

export const PersonaList: React.FC<PersonaListProps> = ({
  personas,
  isLoading = false,
  error = null
}) => {
  const { selectPersona, editPersona, deletePersona } = usePersonaStore();
  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-start">
        <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
        <div>
          <p className="font-semibold">Error loading personas</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse space-y-2">
          <div className="h-12 bg-gray-700 rounded w-full"></div>
          <div className="h-12 bg-gray-700 rounded w-full"></div>
          <div className="h-12 bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (personas.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No personas found. Create your first persona to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {personas.map((persona) => (
        <Card key={persona.id} className="bg-gray-800 border-gray-700 hover:border-blue-600/50 transition-all">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-grow">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-400" />
                  <h3 className="text-lg font-medium text-gray-200">{persona.name}</h3>
                </div>

                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-400">
                  {persona.company && (
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      <span>{persona.company}</span>
                    </div>
                  )}

                  {persona.role && (
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      <span>{persona.role}</span>
                    </div>
                  )}

                  {persona.industry && (
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      <span>{persona.industry}</span>
                    </div>
                  )}
                </div>

                {persona.tags && persona.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {persona.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-700/50 text-gray-300 border-gray-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-row md:flex-col gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 border-blue-700"
                  onClick={() => selectPersona(persona)}
                >
                  <Search className="h-4 w-4 mr-1" />
                  Select
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300"
                  onClick={() => editPersona(persona)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-900/30 hover:bg-red-800/50 text-red-300 border-red-700"
                  onClick={() => deletePersona(persona.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
