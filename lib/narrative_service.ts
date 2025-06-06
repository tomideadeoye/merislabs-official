/**
 * Narrative Service for Narrative Clarity Studio
 * 
 * This module provides functions to manage narrative documents and components.
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  NarrativeDocument, 
  NarrativeType, 
  CareerMilestone, 
  ValueProposition 
} from '@/types/narrative-clarity';

// In-memory storage for narrative documents (in a real app, this would be a database)
let narrativeDocuments: NarrativeDocument[] = [];
let careerMilestones: CareerMilestone[] = [];
let valueProposition: ValueProposition | null = null;

/**
 * Create a new narrative document
 */
export async function createNarrativeDocument(data: Omit<NarrativeDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<NarrativeDocument> {
  const now = new Date().toISOString();
  const newDocument: NarrativeDocument = {
    id: uuidv4(),
    ...data,
    createdAt: now,
    updatedAt: now
  };
  
  narrativeDocuments.push(newDocument);
  return newDocument;
}

/**
 * Get all narrative documents
 */
export async function getNarrativeDocuments(): Promise<NarrativeDocument[]> {
  return narrativeDocuments;
}

/**
 * Get a narrative document by ID
 */
export async function getNarrativeDocumentById(id: string): Promise<NarrativeDocument | null> {
  const document = narrativeDocuments.find(d => d.id === id);
  return document || null;
}

/**
 * Update a narrative document
 */
export async function updateNarrativeDocument(id: string, data: Partial<NarrativeDocument>): Promise<NarrativeDocument | null> {
  const index = narrativeDocuments.findIndex(d => d.id === id);
  if (index === -1) return null;
  
  const updatedDocument = {
    ...narrativeDocuments[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  narrativeDocuments[index] = updatedDocument;
  return updatedDocument;
}

/**
 * Delete a narrative document
 */
export async function deleteNarrativeDocument(id: string): Promise<boolean> {
  const initialLength = narrativeDocuments.length;
  narrativeDocuments = narrativeDocuments.filter(d => d.id !== id);
  return narrativeDocuments.length < initialLength;
}

/**
 * Get narrative documents by type
 */
export async function getNarrativeDocumentsByType(type: NarrativeType): Promise<NarrativeDocument[]> {
  return narrativeDocuments.filter(d => d.type === type);
}

/**
 * Career Milestone Functions
 */

export async function saveCareerMilestone(milestone: Omit<CareerMilestone, 'id'>): Promise<CareerMilestone> {
  const newMilestone: CareerMilestone = {
    id: uuidv4(),
    ...milestone
  };
  
  careerMilestones.push(newMilestone);
  // Sort by order
  careerMilestones.sort((a, b) => a.order - b.order);
  return newMilestone;
}

export async function getCareerMilestones(): Promise<CareerMilestone[]> {
  return careerMilestones;
}

export async function updateCareerMilestone(id: string, data: Partial<CareerMilestone>): Promise<CareerMilestone | null> {
  const index = careerMilestones.findIndex(m => m.id === id);
  if (index === -1) return null;
  
  const updatedMilestone = {
    ...careerMilestones[index],
    ...data
  };
  
  careerMilestones[index] = updatedMilestone;
  // Re-sort if order changed
  if (data.order !== undefined) {
    careerMilestones.sort((a, b) => a.order - b.order);
  }
  return updatedMilestone;
}

export async function deleteCareerMilestone(id: string): Promise<boolean> {
  const initialLength = careerMilestones.length;
  careerMilestones = careerMilestones.filter(m => m.id !== id);
  return careerMilestones.length < initialLength;
}

/**
 * Value Proposition Functions
 */

export async function saveValueProposition(data: Omit<ValueProposition, 'id' | 'updatedAt'>): Promise<ValueProposition> {
  const now = new Date().toISOString();
  const newValueProp: ValueProposition = {
    id: valueProposition?.id || uuidv4(),
    ...data,
    updatedAt: now
  };
  
  valueProposition = newValueProp;
  return newValueProp;
}

export async function getValueProposition(): Promise<ValueProposition | null> {
  return valueProposition;
}