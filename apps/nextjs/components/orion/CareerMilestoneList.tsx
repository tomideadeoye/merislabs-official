"use client";

import React from 'react';
import { Button, Card, CardContent, Badge } from '@repo/ui';
import {
  Award,
  Calendar,
  Building,
  Edit,
  Trash2,
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import type { CareerMilestone } from '@repo/shared';
import { useCareerMilestone } from './CareerMilestoneContext';

/**
 * CareerMilestoneList
 * GOAL: Display, edit, delete, and reorder career milestones using context-based handlers for full serializability and future gamification.
 * All actions are logged for traceability and engagement analytics.
 * Connects to: CareerMilestoneContext, CareerMilestoneForm, admin dashboard.
 */

interface CareerMilestoneListProps {
  milestones: CareerMilestone[];
  isLoading?: boolean;
  error?: string | null;
}

export const CareerMilestoneList: React.FC<CareerMilestoneListProps> = ({
  milestones,
  isLoading = false,
  error = null,
}) => {
  const context = useCareerMilestone();

  // Fallbacks for context actions (for legacy/test usage)
  const handleEdit = (milestone: CareerMilestone) => {
    if (context && (context as any).setEditingMilestone) {
      (context as any).setEditingMilestone(milestone);
      console.info("[CAREER_MILESTONE_LIST][EDIT][CONTEXT]", { milestone });
    } else {
      console.warn("[CAREER_MILESTONE_LIST][EDIT][NO_CONTEXT]", { milestone });
    }
  };

  const handleDelete = (id: string) => {
    if (context && (context as any).deleteMilestone) {
      (context as any).deleteMilestone(id);
      console.info("[CAREER_MILESTONE_LIST][DELETE][CONTEXT]", { id });
    } else {
      console.warn("[CAREER_MILESTONE_LIST][DELETE][NO_CONTEXT]", { id });
    }
  };

  const handleReorder = (id: string, direction: 'up' | 'down') => {
    if (context && (context as any).reorderMilestone) {
      (context as any).reorderMilestone(id, direction);
      console.info("[CAREER_MILESTONE_LIST][REORDER][CONTEXT]", { id, direction });
    } else {
      console.warn("[CAREER_MILESTONE_LIST][REORDER][NO_CONTEXT]", { id, direction });
    }
  };
  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-start">
        <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
        <div>
          <p className="font-semibold">Error loading career milestones</p>
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

  if (milestones.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No career milestones found. Add your first milestone to get started.</p>
      </div>
    );
  }

  // Sort milestones by order
  const sortedMilestones = [...milestones].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {sortedMilestones.map((milestone) => (
        <Card key={milestone.id} className="bg-gray-800 border-gray-700 hover:border-purple-600/50 transition-all">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-grow">
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-purple-400" />
                  <h3 className="text-lg font-medium text-gray-200">{milestone.title}</h3>
                </div>

                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-400">
                  {milestone.organization && (
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      <span>{milestone.organization}</span>
                    </div>
                  )}

                  {milestone.startDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{milestone.startDate} - {milestone.endDate || 'Present'}</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-300">{milestone.description}</p>

                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-400 mb-1">Key achievements:</p>
                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                    {milestone.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>

                {milestone.skills && milestone.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {milestone.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-700/50 text-gray-300 border-gray-600">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}

                {milestone.impact && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-400">Impact:</p>
                    <p className="text-sm text-gray-300">{milestone.impact}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-row md:flex-col gap-2 justify-end">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 h-8 w-8"
                    onClick={() => handleReorder(milestone.id, 'up')}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 h-8 w-8"
                    onClick={() => handleReorder(milestone.id, 'down')}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300"
                  onClick={() => handleEdit(milestone)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-900/30 hover:bg-red-800/50 text-red-300 border-red-700"
                  onClick={() => handleDelete(milestone.id)}
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
