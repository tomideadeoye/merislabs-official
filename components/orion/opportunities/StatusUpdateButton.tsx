"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Loader2, ChevronDown } from 'lucide-react';
import { Opportunity, OpportunityStatus } from '@/types/opportunity';
import { JournalReflectionDialog } from './JournalReflectionDialog';

interface StatusUpdateButtonProps {
  opportunity: Opportunity;
  onStatusUpdate?: (newStatus: OpportunityStatus) => void;
}

// Define status transitions based on current status
const getNextStatuses = (currentStatus: OpportunityStatus): { status: OpportunityStatus; label: string }[] => {
  switch (currentStatus) {
    case 'identified':
      return [
        { status: 'researching', label: 'Start Researching' },
        { status: 'evaluating', label: 'Start Evaluation' }
      ];
    case 'researching':
      return [
        { status: 'evaluating', label: 'Start Evaluation' },
        { status: 'on_hold', label: 'Put On Hold' }
      ];
    case 'evaluating':
      return [
        { status: 'evaluated_positive', label: 'Mark as Positive Evaluation' },
        { status: 'evaluated_negative', label: 'Mark as Negative Evaluation' }
      ];
    case 'evaluated_positive':
      return [
        { status: 'application_drafting', label: 'Start Drafting Application' },
        { status: 'outreach_planned', label: 'Plan Stakeholder Outreach' }
      ];
    case 'application_drafting':
      return [
        { status: 'application_ready', label: 'Application Ready' },
        { status: 'applied', label: 'Mark as Applied' }
      ];
    case 'application_ready':
      return [
        { status: 'applied', label: 'Mark as Applied' }
      ];
    case 'applied':
      return [
        { status: 'follow_up_needed', label: 'Follow-up Needed' },
        { status: 'interview_scheduled', label: 'Interview Scheduled' },
        { status: 'rejected_by_them', label: 'Rejected by Company' }
      ];
    case 'outreach_planned':
      return [
        { status: 'outreach_sent', label: 'Outreach Sent' }
      ];
    case 'outreach_sent':
      return [
        { status: 'follow_up_needed', label: 'Follow-up Needed' },
        { status: 'interview_scheduled', label: 'Interview Scheduled' }
      ];
    case 'follow_up_needed':
      return [
        { status: 'follow_up_sent', label: 'Follow-up Sent' }
      ];
    case 'follow_up_sent':
      return [
        { status: 'interview_scheduled', label: 'Interview Scheduled' },
        { status: 'rejected_by_them', label: 'Rejected by Company' }
      ];
    case 'interview_scheduled':
      return [
        { status: 'interview_completed', label: 'Interview Completed' }
      ];
    case 'interview_completed':
      return [
        { status: 'offer_received', label: 'Offer Received' },
        { status: 'rejected_by_them', label: 'Rejected by Company' }
      ];
    case 'offer_received':
      return [
        { status: 'negotiating', label: 'Start Negotiation' },
        { status: 'accepted', label: 'Offer Accepted' },
        { status: 'declined_by_me', label: 'Offer Declined' }
      ];
    case 'negotiating':
      return [
        { status: 'accepted', label: 'Offer Accepted' },
        { status: 'declined_by_me', label: 'Offer Declined' }
      ];
    default:
      return [
        { status: 'on_hold', label: 'Put On Hold' },
        { status: 'archived', label: 'Archive' }
      ];
  }
};

// Define which status changes should trigger reflection
const shouldPromptReflection = (newStatus: OpportunityStatus): boolean => {
  return ['applied', 'interview_completed', 'outreach_sent', 'offer_received', 'accepted', 'declined_by_me', 'rejected_by_them'].includes(newStatus);
};

// Get reflection type based on status
const getReflectionType = (status: OpportunityStatus): 'application_sent' | 'interview_completed' | 'outreach_sent' | 'general' => {
  if (status === 'applied') return 'application_sent';
  if (status === 'interview_completed') return 'interview_completed';
  if (status === 'outreach_sent') return 'outreach_sent';
  return 'general';
};

export const StatusUpdateButton: React.FC<StatusUpdateButtonProps> = ({
  opportunity,
  onStatusUpdate
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OpportunityStatus | null>(null);
  const [reflectionType, setReflectionType] = useState<'application_sent' | 'interview_completed' | 'outreach_sent' | 'general'>('general');
  
  const nextStatuses = getNextStatuses(opportunity.status);
  
  const handleStatusSelect = async (newStatus: OpportunityStatus) => {
    // Check if we should prompt for reflection
    if (shouldPromptReflection(newStatus)) {
      setPendingStatus(newStatus);
      setReflectionType(getReflectionType(newStatus));
      setShowReflection(true);
      return;
    }
    
    // Otherwise, update status directly
    await updateStatus(newStatus);
  };
  
  const updateStatus = async (newStatus: OpportunityStatus) => {
    setIsUpdating(true);
    
    try {
      const response = await fetch('/api/orion/opportunity/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          opportunityId: opportunity.id,
          status: newStatus
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (onStatusUpdate) {
          onStatusUpdate(newStatus);
        }
      } else {
        console.error('Error updating status:', data.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
      setPendingStatus(null);
    }
  };
  
  const handleReflectionComplete = () => {
    // After reflection is saved, update the status
    if (pendingStatus) {
      updateStatus(pendingStatus);
    }
    setShowReflection(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-900/20 hover:bg-blue-900/30 text-blue-300"
            disabled={isUpdating || nextStatuses.length === 0}
          >
            {isUpdating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                Update Status <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-200">
          {nextStatuses.map((item) => (
            <DropdownMenuItem
              key={item.status}
              onClick={() => handleStatusSelect(item.status)}
              className="cursor-pointer hover:bg-gray-700"
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {opportunity && showReflection && (
        <JournalReflectionDialog
          isOpen={showReflection}
          setIsOpen={(isOpen) => {
            setShowReflection(isOpen);
            if (!isOpen && pendingStatus) {
              // If dialog is closed without saving, still update the status
              updateStatus(pendingStatus);
            }
          }}
          opportunity={opportunity}
          actionType={reflectionType}
        />
      )}
    </>
  );
};