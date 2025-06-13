"use client";

import React, { useState } from 'react';
import { Button } from '@repo/ui';
import { CheckSquare } from 'lucide-react';
import { OrionOpportunity } from '@repo/shared';
import { CreateHabiticaTaskDialog } from '@/components/orion/tasks/CreateHabiticaTaskDialog';
import { useHabiticaTaskDialogStore } from '@/components/orion/tasks/habiticaTaskDialogStore';

interface CreateHabiticaTaskButtonProps {
  OrionOpportunity: OrionOpportunity;
  taskText?: string;
  taskNotes?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const CreateHabiticaTaskButton: React.FC<CreateHabiticaTaskButtonProps> = ({
  OrionOpportunity,
  taskText,
  taskNotes,
  variant = "outline",
  size = "sm",
  className = "bg-amber-900/20 hover:bg-amber-900/30 text-amber-300"
}) => {
  const { openDialog } = useHabiticaTaskDialogStore();

  // Generate default task text based on OrionOpportunity status
  const getDefaultTaskText = (): string => {
    if (taskText) return taskText;

    switch (OrionOpportunity.status) {
      case 'identified':
      case 'researching':
        return `Research ${OrionOpportunity.company} for ${OrionOpportunity.title} OrionOpportunity`;
      case 'evaluated_positive':
        return `Prepare application for ${OrionOpportunity.title} at ${OrionOpportunity.company}`;
      case 'application_drafting':
      case 'application_ready':
        return `Submit application for ${OrionOpportunity.title} at ${OrionOpportunity.company}`;
      case 'applied':
        return `Follow up on ${OrionOpportunity.title} application at ${OrionOpportunity.company}`;
      case 'outreach_planned':
        return `Send outreach message to stakeholders at ${OrionOpportunity.company}`;
      case 'outreach_sent':
        return `Follow up with contacts at ${OrionOpportunity.company} about ${OrionOpportunity.title}`;
      case 'interview_scheduled':
        return `Prepare for ${OrionOpportunity.title} interview at ${OrionOpportunity.company}`;
      default:
        return `Next step for ${OrionOpportunity.title} at ${OrionOpportunity.company}`;
    }
  };

  // Generate default task notes
  const getDefaultTaskNotes = (): string => {
    if (taskNotes) return taskNotes;

    let notes = `OrionOpportunity: ${OrionOpportunity.title} at ${OrionOpportunity.company}\n`;
    if (OrionOpportunity.sourceURL) {
      notes += `Source: ${OrionOpportunity.sourceURL}\n`;
    }
    notes += `\nFrom Orion - OrionOpportunity Tracker, Ref: ${OrionOpportunity.id}`;

    return notes;
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={openDialog}
      >
        <CheckSquare className="mr-2 h-4 w-4" />
        Create Task
      </Button>

      <CreateHabiticaTaskDialog
        initialTaskText={getDefaultTaskText()}
        initialTaskNotes={getDefaultTaskNotes()}
        sourceModule="OrionOpportunity Tracker"
        sourceReferenceId={OrionOpportunity.id}
        defaultTags={OrionOpportunity.tags || []}
      />
    </>
  );
};
