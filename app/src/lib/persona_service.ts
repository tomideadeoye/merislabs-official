/**
 * Persona Service for Strategic Outreach Engine
 * GOAL:
 * RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
 * Note if any: components to merge with, similar or redundant component
 * Opportunities for improvement or consolidation.
 * This module provides functions to manage persona maps for strategic outreach.
 */

import { Persona } from "../types";



// In-memory storage for personas (in a real app, this would be a database)
let personas: Persona[] = [];

/**
 * Create a new persona map
 */
export async function createPersona(
  personaData: Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Persona> {
  const { name, description, traits, goals, ...otherProps } =
    personaData as Persona;

  const newPersona: Persona = {
    name,
    description,
    traits,
    goals,
    ...otherProps,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  personas.push(newPersona);
  return newPersona;
}

/**
 * Get all persona maps
 */
export async function getPersonas(): Promise<Persona[]> {
  return personas;
}

/**
 * Get a persona map by ID
 */
export async function getPersonaById(id: string): Promise<Persona | null> {
  return personas.find((p) => p.id === id) || null;
}

/**
 * Update a persona map
 */
export async function updatePersona(
  id: string,
  personaData: Partial<Persona>,
): Promise<Persona | null> {
  const index = personas.findIndex((p) => p.id === id);
  if (index === -1) return null;
  personas[index] = {
    ...personas[index],
    ...personaData,
    updatedAt: new Date().toISOString(),
  };
  return personas[index];
}

/**
 * Delete a persona map
 */
export async function deletePersona(id: string): Promise<boolean> {
  const initialLength = personas.length;
  personas = personas.filter((p) => p.id !== id);
  return personas.length < initialLength;
}

/**
 * Search personas by name, company, role, or tags
 */
export async function searchPersonas(query: string): Promise<Persona[]> {
  const lowerQuery = query.toLowerCase();
  return personas.filter(
    (p) =>
      (p.name && p.name.toLowerCase().includes(lowerQuery)) ||
      (p.company && p.company.toLowerCase().includes(lowerQuery)) ||
      (p.role && p.role.toLowerCase().includes(lowerQuery)) ||
      (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))),
  );
}
