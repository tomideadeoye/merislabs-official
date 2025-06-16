'use client';

import React from 'react';

import { CreateHabiticaTaskDialog } from '../tasks/CreateHabiticaTaskDialog';
import { useHabiticaTaskDialogStore } from '../tasks/habiticaTaskDialogStore';
import type { OrionOpportunity, OpportunityStatus } from '@/types';
import { Button } from '@/components/ui';
import { CheckSquare } from 'lucide-react';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component

interface CreateHabiticaTaskButtonProps {
  OrionOpportunity: OrionOpportunity;
  taskText?: string;
  taskNotes?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const CreateHabiticaTaskButton: React.FC<CreateHabiticaTaskButtonProps> = ({
  OrionOpportunity,
  taskText,
  taskNotes,
  variant = 'outline',
  size = 'sm',
  className = 'bg-amber-900/20 hover:bg-amber-900/30 text-amber-300',
}) => {
  const { openDialog } = useHabiticaTaskDialogStore();

  // Generate default task text based on OrionOpportunity status
  const getDefaultTaskText = (): string => {
    if (taskText) return taskText;

    switch (OrionOpportunity.status) {
      case OpportunityStatus.IDENTIFIED:
      case OpportunityStatus.RESEARCHING:
        return `Research ${OrionOpportunity.company} for ${OrionOpportunity.title} Opportunity`;
      case OpportunityStatus.EVALUATED_POSITIVE:
        return `Prepare application for ${OrionOpportunity.title} at ${OrionOpportunity.company}`;
      case OpportunityStatus.APPLICATION_DRAFTING:
      case OpportunityStatus.APPLICATION_READY:
        return `Submit application for ${OrionOpportunity.title} at ${OrionOpportunity.company}`;
      case OpportunityStatus.APPLIED:
        return `Follow up on ${OrionOpportunity.title} application at ${OrionOpportunity.company}`;
      case OpportunityStatus.OUTREACH_PLANNED:
        return `Send outreach message to stakeholders at ${OrionOpportunity.company}`;
      case OpportunityStatus.OUTREACH_SENT:
        return `Follow up with contacts at ${OrionOpportunity.company} about ${OrionOpportunity.title}`;
      case OpportunityStatus.INTERVIEW_SCHEDULED:
        return `Prepare for ${OrionOpportunity.title} interview at ${OrionOpportunity.company}`;
      default:
        return `Next step for ${OrionOpportunity.title} at ${OrionOpportunity.company}`;
    }
  };

  // Generate default task notes
  const getDefaultTaskNotes = (): string => {
    if (taskNotes) return taskNotes;

    let notes = `Opportunity: ${OrionOpportunity.title} at ${OrionOpportunity.company}\n`;
    if (OrionOpportunity.sourceUrl) {
      notes += `Source: ${OrionOpportunity.sourceUrl}\n`;
    }
    notes += `\nFrom Orion - Opportunity Tracker, Ref: ${OrionOpportunity.id}`;

    return notes;
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() =>
          openDialog({
            initialTaskText: getDefaultTaskText(),
            initialTaskNotes: getDefaultTaskNotes(),
            sourceModule: 'Opportunity Tracker',
            sourceReferenceId: OrionOpportunity.id,
            defaultTags: OrionOpportunity.tags || [],
          })
        }
      >
        <CheckSquare className="mr-2 h-4 w-4" />
        Create Task
      </Button>

      <CreateHabiticaTaskDialog />
    </>
  );
};
