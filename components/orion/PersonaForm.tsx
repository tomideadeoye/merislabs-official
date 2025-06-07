"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, CheckCircle2, UserPlus, User } from 'lucide-react';
import type { PersonaMap } from '@/types/strategic-outreach';
import { usePersonaFormStore } from './persona/personaFormStore';

interface PersonaFormProps {
  initialData?: Partial<PersonaMap>;
  onCancel?: () => void;
}

export const PersonaForm: React.FC<PersonaFormProps> = ({
  initialData = {},
  onCancel
}) => {
  const [name, setName] = useState(initialData.name || '');
  const [company, setCompany] = useState(initialData.company || '');
  const [role, setRole] = useState(initialData.role || '');
  const [industry, setIndustry] = useState(initialData.industry || '');
  const [values, setValues] = useState(initialData.values?.join(', ') || '');
  const [challenges, setChallenges] = useState(initialData.challenges?.join(', ') || '');
  const [interests, setInterests] = useState(initialData.interests?.join(', ') || '');
  const [valueProposition, setValueProposition] = useState(initialData.valueProposition || '');
  const [notes, setNotes] = useState(initialData.notes || '');
  const [tags, setTags] = useState(initialData.tags?.join(', ') || '');

  const {
    isSubmitting,
    feedback,
    submitPersona,
    clearFeedback,
  } = usePersonaFormStore();

  useEffect(() => {
    if (feedback?.type === 'success' && !initialData.id) {
      // Reset form if it's a new persona (no initialData.id)
      setName('');
      setCompany('');
      setRole('');
      setIndustry('');
      setValues('');
      setChallenges('');
      setInterests('');
      setValueProposition('');
      setNotes('');
      setTags('');
    }
  }, [feedback, initialData.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      clearFeedback();
      usePersonaFormStore.setState({
        feedback: { type: 'error', message: 'Name is required.' }
      });
      return;
    }

    clearFeedback();

    // Convert comma-separated strings to arrays
    const personaData: Partial<PersonaMap> = {
      ...initialData,
      name,
      company: company || undefined,
      role: role || undefined,
      industry: industry || undefined,
      values: values ? values.split(',').map(v => v.trim()).filter(Boolean) : undefined,
      challenges: challenges ? challenges.split(',').map(c => c.trim()).filter(Boolean) : undefined,
      interests: interests ? interests.split(',').map(i => i.trim()).filter(Boolean) : undefined,
      valueProposition: valueProposition || undefined,
      notes: notes || undefined,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined
    };

    await submitPersona(personaData);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          {initialData.id ? (
            <>
              <User className="mr-2 h-5 w-5 text-blue-400" />
              Edit Persona
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-5 w-5 text-green-400" />
              Create New Persona
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contact's name"
                className="bg-gray-700 border-gray-600 text-gray-200"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <Label htmlFor="company" className="text-gray-300">Company</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company or organization"
                className="bg-gray-700 border-gray-600 text-gray-200"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role" className="text-gray-300">Role</Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Job title or position"
                className="bg-gray-700 border-gray-600 text-gray-200"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="industry" className="text-gray-300">Industry</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Industry or sector"
                className="bg-gray-700 border-gray-600 text-gray-200"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="values" className="text-gray-300">Values (comma-separated)</Label>
            <Input
              id="values"
              value={values}
              onChange={(e) => setValues(e.target.value)}
              placeholder="e.g., innovation, sustainability, growth"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="challenges" className="text-gray-300">Challenges (comma-separated)</Label>
            <Input
              id="challenges"
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="e.g., scaling, talent acquisition, market entry"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="interests" className="text-gray-300">Interests (comma-separated)</Label>
            <Input
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., AI, blockchain, remote work"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="valueProposition" className="text-gray-300">Value Proposition</Label>
            <Textarea
              id="valueProposition"
              value={valueProposition}
              onChange={(e) => setValueProposition(e.target.value)}
              placeholder="How you can provide value to this person"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="notes" className="text-gray-300">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other relevant information"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="tags" className="text-gray-300">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., investor, mentor, potential_client"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          {feedback && (
            <div className={`p-3 rounded-md flex items-center ${
              feedback.type === 'success' ? 'bg-green-900/30 border border-green-700 text-green-300'
                                   : 'bg-red-900/30 border border-red-700 text-red-300'
            }`}>
              {feedback.type === 'success' ?
                <CheckCircle2 className="h-5 w-5 mr-2" /> :
                <AlertTriangle className="h-5 w-5 mr-2" />
              }
              {feedback.message}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : initialData.id ? 'Update Persona' : 'Create Persona'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
