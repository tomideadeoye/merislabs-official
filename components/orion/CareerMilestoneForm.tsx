"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, CheckCircle2, Award, Plus, Trash2 } from 'lucide-react';
import type { CareerMilestone } from '@/types/narrative-clarity';

/**
 * CareerMilestoneForm
 * GOAL: Absurdly engaging, gamified, and robust form for adding/editing career milestones.
 * Uses context-based handlers for submit/cancel to ensure serializable props and enable future gamification.
 * Connects to: CareerMilestoneContext, CareerMilestoneList, admin dashboard, engagement features.
 * All actions and state changes are logged with full context for traceability and rapid improvement.
 */

import { useCareerMilestone } from "./CareerMilestoneContext";

interface CareerMilestoneFormProps {
  initialData?: Partial<CareerMilestone>;
  existingMilestonesCount?: number;
}

export const CareerMilestoneForm: React.FC<CareerMilestoneFormProps> = ({
  initialData = {},
  existingMilestonesCount = 0,
}) => {
  const {
    submitMilestone,
    cancelMilestone,
    isSubmitting,
    feedback,
    setFeedback,
  } = useCareerMilestone();
  const [title, setTitle] = useState(initialData.title || '');
  const [organization, setOrganization] = useState(initialData.organization || '');
  const [startDate, setStartDate] = useState(initialData.startDate || '');
  const [endDate, setEndDate] = useState(initialData.endDate || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [skills, setSkills] = useState(initialData.skills?.join(', ') || '');
  const [achievements, setAchievements] = useState<string[]>(initialData.achievements || ['']);
  const [impact, setImpact] = useState(initialData.impact || '');
  const [order, setOrder] = useState(initialData.order !== undefined ? initialData.order : existingMilestonesCount);

  // All state changes are logged for traceability
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.info("[CAREER_MILESTONE_FORM][SUBMIT][ATTEMPT]", {
      title,
      description,
      achievements,
      user: "Tomide",
    });

    if (!title.trim() || !description.trim()) {
      setFeedback({ type: "error", message: "Title and description are required." });
      console.warn("[CAREER_MILESTONE_FORM][VALIDATION][FAIL]", { title, description });
      return;
    }

    const filteredAchievements = achievements.filter((a) => a.trim());
    if (filteredAchievements.length === 0) {
      setFeedback({ type: "error", message: "At least one achievement is required." });
      console.warn("[CAREER_MILESTONE_FORM][VALIDATION][FAIL][ACHIEVEMENTS]", { achievements });
      return;
    }

    const milestoneData: Partial<CareerMilestone> = {
      ...initialData,
      title,
      organization: organization || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      description,
      skills: skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
      achievements: filteredAchievements,
      impact,
      order,
    };

    await submitMilestone(milestoneData);

    // Reset form if it's a new milestone (no initialData.id)
    if (!initialData.id) {
      setTitle("");
      setOrganization("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setSkills("");
      setAchievements([""]);
      setImpact("");
      setOrder(existingMilestonesCount + 1);
      console.info("[CAREER_MILESTONE_FORM][RESET][NEW_MILESTONE]");
    }
  };

  const addAchievement = () => {
    setAchievements([...achievements, '']);
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...achievements];
    newAchievements[index] = value;
    setAchievements(newAchievements);
  };

  const removeAchievement = (index: number) => {
    if (achievements.length > 1) {
      const newAchievements = achievements.filter((_, i) => i !== index);
      setAchievements(newAchievements);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Award className="mr-2 h-5 w-5 text-purple-400" />
          {initialData.id ? 'Edit Career Milestone' : 'Add Career Milestone'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Position or role title"
                className="bg-gray-700 border-gray-600 text-gray-200"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <Label htmlFor="organization" className="text-gray-300">Organization</Label>
              <Input
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Company or institution name"
                className="bg-gray-700 border-gray-600 text-gray-200"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-gray-300">Start Date</Label>
              <Input
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="e.g., Jan 2020"
                className="bg-gray-700 border-gray-600 text-gray-200"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="endDate" className="text-gray-300">End Date</Label>
              <Input
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="e.g., Present or Dec 2022"
                className="bg-gray-700 border-gray-600 text-gray-200"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="order" className="text-gray-300">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                min={0}
                className="bg-gray-700 border-gray-600 text-gray-200"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the role and responsibilities"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <Label className="text-gray-300">Achievements *</Label>
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  value={achievement}
                  onChange={(e) => updateAchievement(index, e.target.value)}
                  placeholder="Specific accomplishment or contribution"
                  className="bg-gray-700 border-gray-600 text-gray-200"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAchievement(index)}
                  disabled={isSubmitting || achievements.length <= 1}
                  className="h-10 w-10 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAchievement}
              disabled={isSubmitting}
              className="mt-1 bg-gray-700 hover:bg-gray-600"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Achievement
            </Button>
          </div>

          <div>
            <Label htmlFor="skills" className="text-gray-300">Skills (comma-separated)</Label>
            <Input
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., project management, data analysis, team leadership"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="impact" className="text-gray-300">Impact</Label>
            <Textarea
              id="impact"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder="The overall impact or results of your work"
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
            <Button
              type="button"
              variant="outline"
              onClick={cancelMilestone}
              disabled={isSubmitting}
              className="bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : initialData.id ? 'Update Milestone' : 'Add Milestone'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
