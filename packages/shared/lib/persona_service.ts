/**
 * Persona Service for Strategic Outreach Engine
 *
 * This module provides functions to manage persona maps for strategic outreach.
 */

/// <reference types="uuid" />
import { v4 as uuidv4 } from 'uuid';
import { PersonaMap } from '@/types/strategic-outreach';

// In-memory storage for personas (in a real app, this would be a database)
let personas: PersonaMap[] = [];

/**
 * Create a new persona map
 */
export async function createPersona(personaData: Omit<PersonaMap, 'id' | 'createdAt' | 'updatedAt'>): Promise<PersonaMap> {
  const now = new Date().toISOString();
  const newPersona: PersonaMap = {
    id: uuidv4(),
    ...personaData,
    createdAt: now,
    updatedAt: now
  };

  personas.push(newPersona);
  return newPersona;
}

/**
 * Get all persona maps
 */
export async function getPersonas(): Promise<PersonaMap[]> {
  return personas;
}

/**
 * Get a persona map by ID
 */
export async function getPersonaById(id: string): Promise<PersonaMap | null> {
  const persona = personas.find(p => p.id === id);
  return persona || null;
}

/**
 * Update a persona map
 */
export async function updatePersona(id: string, personaData: Partial<PersonaMap>): Promise<PersonaMap | null> {
  const index = personas.findIndex(p => p.id === id);
  if (index === -1) return null;

  const updatedPersona = {
    ...personas[index],
    ...personaData,
    updatedAt: new Date().toISOString()
  };

  personas[index] = updatedPersona;
  return updatedPersona;
}

/**
 * Delete a persona map
 */
export async function deletePersona(id: string): Promise<boolean> {
  const initialLength = personas.length;
  personas = personas.filter(p => p.id !== id);
  return personas.length < initialLength;
}

/**
 * Search personas by name, company, role, or tags
 */
export async function searchPersonas(query: string): Promise<PersonaMap[]> {
  if (!query) return personas;

  const lowerQuery = query.toLowerCase();
  return personas.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    (p.company && p.company.toLowerCase().includes(lowerQuery)) ||
    (p.role && p.role.toLowerCase().includes(lowerQuery)) ||
    (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
  );
}
