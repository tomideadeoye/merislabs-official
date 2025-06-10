"use client";

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, Badge } from '@repo/ui';
import { Opportunity, OpportunityStatus } from '@shared/types/opportunity';
import { useRouter } from 'next/navigation';

interface OpportunityKanbanViewProps {
  opportunities: Opportunity[];
  onStatusChange?: (opportunityId: string, newStatus: OpportunityStatus) => void;
}

// Define the columns/lanes for our Kanban board
const columns: { id: OpportunityStatus; title: string }[] = [
  { id: 'identified', title: 'Identified' },
  { id: 'researching', title: 'Researching' },
  { id: 'evaluating', title: 'Evaluating' },
  { id: 'evaluated_positive', title: 'Positive Evaluation' },
  { id: 'application_drafting', title: 'Drafting' },
  { id: 'applied', title: 'Applied' },
  { id: 'interview_scheduled', title: 'Interview' },
  { id: 'offer_received', title: 'Offer' },
];

export const OpportunityKanbanView: React.FC<OpportunityKanbanViewProps> = ({
  opportunities,
  onStatusChange
}) => {
  const router = useRouter();

  // Group opportunities by status
  const getOpportunitiesByStatus = () => {
    const grouped: Record<string, Opportunity[]> = {};

    // Initialize all columns with empty arrays
    columns.forEach(column => {
      grouped[column.id] = [];
    });

    // Add opportunities to their respective columns
    opportunities.forEach(opportunity => {
      const statusKey = opportunity.status || 'identified'; // Use fallback if status is undefined
      if (grouped[statusKey]) {
        grouped[statusKey].push(opportunity);
      } else {
        // This else case might be redundant now, but keeping it for safety
        grouped['identified'].push(opportunity);
      }
    });

    return grouped;
  };

  const [opportunitiesByStatus, setOpportunitiesByStatus] = useState<Record<string, Opportunity[]>>(
    getOpportunitiesByStatus()
  );

  // Handle drag end event
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped back in its original position
    if (!destination ||
        (destination.droppableId === source.droppableId &&
         destination.index === source.index)) {
      return;
    }

    // Find the moved opportunity
    const opportunity = opportunitiesByStatus[source.droppableId].find(
      opp => opp.id === draggableId
    );

    if (!opportunity) return;

    // Create a new state object
    const newState = { ...opportunitiesByStatus };

    // Remove from source
    newState[source.droppableId] = newState[source.droppableId].filter(
      opp => opp.id !== draggableId
    );

    // Add to destination
    const newStatus = destination.droppableId as OpportunityStatus;
    newState[newStatus] = [
      ...newState[newStatus].slice(0, destination.index),
      { ...opportunity, status: newStatus },
      ...newState[newStatus].slice(destination.index)
    ];

    setOpportunitiesByStatus(newState);

    // Call the callback if provided
    if (onStatusChange) {
      onStatusChange(draggableId, newStatus);
    }
  };

  const handleOpportunityClick = (opportunityId: string) => {
    router.push(`/admin/opportunity-pipeline/${opportunityId}`);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex overflow-x-auto pb-4 space-x-4">
        {columns.map(column => (
          <div key={column.id} className="flex-shrink-0 w-72">
            <div className="bg-gray-800 rounded-t-md p-3 border-b border-gray-700">
              <h3 className="font-medium text-gray-200">{column.title}</h3>
              <div className="text-xs text-gray-400 mt-1">
                {opportunitiesByStatus[column.id]?.length || 0} opportunities
              </div>
            </div>

            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-800/50 rounded-b-md min-h-[500px] p-2"
                >
                  {opportunitiesByStatus[column.id]?.map((opportunity, index) => (
                    <Draggable
                      key={opportunity.id}
                      draggableId={opportunity.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => handleOpportunityClick(opportunity.id)}
                          className="mb-2"
                        >
                          <Card className="bg-gray-700 border-gray-600 p-3 hover:border-gray-500 cursor-pointer">
                            <h4 className="font-medium text-gray-200 mb-1">{opportunity.title}</h4>
                            <p className="text-xs text-gray-400 mb-2">{opportunity.company}</p>

                            <div className="flex flex-wrap gap-1">
                              {opportunity.priority && (
                                <Badge
                                  variant="outline"
                                  className={
                                    opportunity.priority === 'high' ? 'bg-red-900/30 text-red-300 border-red-700' :
                                    opportunity.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' :
                                    'bg-green-900/30 text-green-300 border-green-700'
                                  }
                                >
                                  {opportunity.priority}
                                </Badge>
                              )}

                              {opportunity.relatedEvaluationId && (
                                <Badge variant="outline" className="bg-blue-900/20 text-blue-300 border-blue-700/50">
                                  Evaluated
                                </Badge>
                              )}
                            </div>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
