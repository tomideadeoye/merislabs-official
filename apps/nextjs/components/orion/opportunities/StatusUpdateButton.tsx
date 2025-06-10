"use client";

import React, { useState } from 'react';
import { Button } from '@repo/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@repo/ui';
import { ChevronDown, Loader2 } from 'lucide-react';

interface StatusUpdateButtonProps {
  opportunityId: string; // This should be the Notion page ID
  currentStatus: string;
  // Add a prop to signal a successful update to the parent, if needed
  onStatusUpdated?: () => void;
}

export const StatusUpdateButton: React.FC<StatusUpdateButtonProps> = ({
  opportunityId,
  currentStatus,
  onStatusUpdated // Added prop
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define status groups and their options
  const statusGroups = [
    {
      label: 'Discovery',
      statuses: [
        { value: 'identified', label: 'Identified' },
        { value: 'researching', label: 'Researching' }
      ]
    },
    {
      label: 'Evaluation',
      statuses: [
        { value: 'evaluating', label: 'Evaluating' },
        { value: 'evaluated_positive', label: 'Evaluated Positive' },
        { value: 'evaluated_negative', label: 'Evaluated Negative' }
      ]
    },
    {
      label: 'Application',
      statuses: [
        { value: 'application_drafting', label: 'Drafting Application' },
        { value: 'application_ready', label: 'Application Ready' },
        { value: 'applied', label: 'Applied' }
      ]
    },
    {
      label: 'Follow-up',
      statuses: [
        { value: 'outreach_planned', label: 'Outreach Planned' },
        { value: 'outreach_sent', label: 'Outreach Sent' },
        { value: 'follow_up_needed', label: 'Follow-up Needed' },
        { value: 'follow_up_sent', label: 'Follow-up Sent' }
      ]
    },
    {
      label: 'Interview',
      statuses: [
        { value: 'interview_scheduled', label: 'Interview Scheduled' },
        { value: 'interview_completed', label: 'Interview Completed' }
      ]
    },
    {
      label: 'Decision',
      statuses: [
        { value: 'offer_received', label: 'Offer Received' },
        { value: 'negotiating', label: 'Negotiating' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'rejected_by_them', label: 'Rejected by Them' },
        { value: 'declined_by_me', label: 'Declined by Me' }
      ]
    },
    {
      label: 'Other',
      statuses: [
        { value: 'on_hold', label: 'On Hold' },
        { value: 'archived', label: 'Archived' }
      ]
    }
  ];

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    setError(null);

    try {
      // Updated API endpoint to use the new Notion-specific route with ID
      const response = await fetch(`/api/orion/notion/opportunity/${opportunityId}`, {
        method: 'PATCH', // Changed method to PATCH
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus // Send only the updated status
          // Add other fields here if updating more than just status
        })
      });

      const data = await response.json();

      if (data.success) {
        // Status updated successfully
        console.log('Opportunity status updated successfully:', data.opportunity);
        // Call the parent callback if provided
        if (onStatusUpdated) {
          onStatusUpdated();
        }
        // Instead of reloading, the parent component using this hook
        // should ideally re-fetch opportunities or update its state.
        // Removing window.location.reload();
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Error updating opportunity status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Find the current status label
  const currentStatusLabel = statusGroups
    .flatMap(group => group.statuses)
    .find(status => status.value === currentStatus)?.label || 'Unknown Status';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="bg-gray-700 hover:bg-gray-600">
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                Status: {currentStatusLabel}
                <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-gray-200">
          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700" />

          {statusGroups.map((group, groupIndex) => (
            <React.Fragment key={group.label}>
              {groupIndex > 0 && <DropdownMenuSeparator className="bg-gray-700" />}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-gray-400">{group.label}</DropdownMenuLabel>
                {group.statuses.map(status => (
                  <DropdownMenuItem
                    key={status.value}
                    className={`cursor-pointer ${status.value === currentStatus ? 'bg-gray-700' : ''}`}
                    disabled={isUpdating || status.value === currentStatus}
                    onClick={() => handleStatusUpdate(status.value)}
                  >
                    {status.label}
                    {status.value === currentStatus && (
                      <span className="ml-auto text-xs text-gray-400">(Current)</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {error && (
        <div className="mt-2 text-sm text-red-400">
          {error}
        </div>
      )}
    </>
  );
};
