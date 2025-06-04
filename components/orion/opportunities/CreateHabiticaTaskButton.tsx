"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';
import { Opportunity } from '@/types/opportunity';
import { CreateHabiticaTaskDialog } from '@/components/orion/tasks/CreateHabiticaTaskDialog';

interface CreateHabiticaTaskButtonProps {
  opportunity: Opportunity;
  taskText?: string;
  taskNotes?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const CreateHabiticaTaskButton: React.FC<CreateHabiticaTaskButtonProps> = ({
  opportunity,
  taskText,
  taskNotes,
  variant = "outline",
  size = "sm",
  className = "bg-amber-900/20 hover:bg-amber-900/30 text-amber-300"
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Generate default task text based on opportunity status
  const getDefaultTaskText = (): string => {
    if (taskText) return taskText;

    switch (opportunity.status) {
      case 'identified':
      case 'researching':
        return `Research ${opportunity.company} for ${opportunity.title} opportunity`;
      case 'evaluated_positive':
        return `Prepare application for ${opportunity.title} at ${opportunity.company}`;
      case 'application_drafting':
      case 'application_ready':
        return `Submit application for ${opportunity.title} at ${opportunity.company}`;
      case 'applied':
        return `Follow up on ${opportunity.title} application at ${opportunity.company}`;
      case 'outreach_planned':
        return `Send outreach message to stakeholders at ${opportunity.company}`;
      case 'outreach_sent':
        return `Follow up with contacts at ${opportunity.company} about ${opportunity.title}`;
      case 'interview_scheduled':
        return `Prepare for ${opportunity.title} interview at ${opportunity.company}`;
      default:
        return `Next step for ${opportunity.title} at ${opportunity.company}`;
    }
  };

  // Generate default task notes
  const getDefaultTaskNotes = (): string => {
    if (taskNotes) return taskNotes;

    let notes = `Opportunity: ${opportunity.title} at ${opportunity.company}\n`;
    if (opportunity.sourceURL) {
      notes += `Source: ${opportunity.sourceURL}\n`;
    }
    notes += `\nFrom Orion - Opportunity Tracker, Ref: ${opportunity.id}`;

    return notes;
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsDialogOpen(true)}
      >
        <CheckSquare className="mr-2 h-4 w-4" />
        Create Task
      </Button>

      <CreateHabiticaTaskDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        initialTaskText={getDefaultTaskText()}
        initialTaskNotes={getDefaultTaskNotes()}
        sourceModule="Opportunity Tracker"
        sourceReferenceId={opportunity.id}
        defaultTags={opportunity.tags || []}
      />
    </>
  );
};
