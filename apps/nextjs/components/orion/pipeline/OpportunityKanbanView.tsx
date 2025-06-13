"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { DropResult, DroppableProvided, DraggableProvided } from "react-beautiful-dnd";
import { Card, Badge } from "@repo/ui"; // Assuming these are your UI components
import type { OrionOpportunity } from "@repo/shared"; // Assuming this is your opportunity type
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Kanban status types
type KanbanStatus =
  | "identified"
  | "researching"
  | "evaluating"
  | "evaluated_positive"
  | "application_drafting"
  | "applied"
  | "interview_scheduled"
  | "offer_received";

interface OpportunityKanbanViewProps {
  opportunities: OrionOpportunity[];
  onStatusChange?: (opportunityId: string, newStatus: KanbanStatus) => void; // Callback for when status changes via DND
}

// Kanban columns definition
const columns: { id: KanbanStatus; title: string }[] = [
  { id: "identified", title: "Identified" },
  { id: "researching", title: "Researching" },
  { id: "evaluating", title: "Evaluating" },
  { id: "evaluated_positive", title: "Positive Evaluation" },
  { id: "application_drafting", title: "Drafting Application" },
  { id: "applied", title: "Application Submitted" },
  { id: "interview_scheduled", title: "Interview Scheduled" },
  { id: "offer_received", title: "Offer Received" },
];

export const OpportunityKanbanView: React.FC<OpportunityKanbanViewProps> = ({
  opportunities,
  onStatusChange,
}) => {
  const router = useRouter();

  // Memoized function to group opportunities by status
  const groupOpportunitiesByStatus = useCallback(
    (opps: OrionOpportunity[]): Record<KanbanStatus, OrionOpportunity[]> => {
      const initialGrouped: Record<KanbanStatus, OrionOpportunity[]> = {
        identified: [],
        researching: [],
        evaluating: [],
        evaluated_positive: [],
        application_drafting: [],
        applied: [],
        interview_scheduled: [],
        offer_received: [],
      };

      // Ensure all defined KanbanStatus keys exist in initialGrouped
      columns.forEach(column => {
        if (!initialGrouped[column.id]) {
          initialGrouped[column.id] = [];
        }
      });

      return opps.reduce((acc, opp) => {
        const status = opp.status as KanbanStatus; // Assuming opp.status is a valid KanbanStatus
        if (acc.hasOwnProperty(status)) {
          acc[status].push(opp);
        } else {
          // Fallback for unrecognized status - good to log this
          console.warn(
            `Opportunity ID ${opp.id} has an unrecognized status: "${opp.status}". Assigning to 'identified'.`
          );
          acc.identified.push({ ...opp, status: "identified" });
        }
        return acc;
      }, initialGrouped);
    },
    [] // No dependencies needed if logic is self-contained
  );

  const [opportunitiesByStatus, setOpportunitiesByStatus] = useState<
    Record<KanbanStatus, OrionOpportunity[]>
  >(() => groupOpportunitiesByStatus(opportunities));

  // Effect to update grouped opportunities when the opportunities prop changes
  useEffect(() => {
    setOpportunitiesByStatus(groupOpportunitiesByStatus(opportunities));
  }, [opportunities, groupOpportunitiesByStatus]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // No destination or dropped in the same place
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const sourceColumnId = source.droppableId as KanbanStatus;
    const destinationColumnId = destination.droppableId as KanbanStatus;

    const sourceItems = Array.from(opportunitiesByStatus[sourceColumnId]);
    const destinationItems = (sourceColumnId === destinationColumnId)
      ? sourceItems // If moving within the same column, use the same array reference before modification
      : Array.from(opportunitiesByStatus[destinationColumnId]);


    const [movedItem] = sourceItems.splice(source.index, 1); // Remove from source

    if (!movedItem) return; // Should not happen if draggableId is valid

    // Update status of the moved item
    const updatedMovedItem = { ...movedItem, status: destinationColumnId };
    destinationItems.splice(destination.index, 0, updatedMovedItem); // Add to destination

    setOpportunitiesByStatus((prev) => ({
      ...prev,
      [sourceColumnId]: sourceItems,
      [destinationColumnId]: destinationItems,
    }));

    if (onStatusChange) {
      onStatusChange(draggableId, destinationColumnId);
    }
  };

  const handleOpportunityClick = (opportunityId: string) => {
    router.push(`/admin/OrionOpportunity-pipeline/${opportunityId}`); // Ensure this route is correct
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex overflow-x-auto pb-4 space-x-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-72 md:w-80">
            <div className="bg-slate-800 rounded-t-md p-3 border-b border-slate-700 sticky top-0 z-10">
              <h3 className="font-medium text-slate-200">{column.title}</h3>
              <div className="text-xs text-slate-400 mt-1">
                {opportunitiesByStatus[column.id]?.length || 0} opportunities
              </div>
            </div>
            <Droppable droppableId={column.id} type="OPPORTUNITY">
              {(provided: DroppableProvided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-slate-800/60 rounded-b-md min-h-[calc(100vh-200px)] p-2 space-y-2 overflow-y-auto"
                >
                  {opportunitiesByStatus[column.id]?.map((opportunity, index) => (
                    <Draggable
                      key={opportunity.id}
                      draggableId={opportunity.id}
                      index={index}
                    >
                      {(providedDraggable: DraggableProvided) => (
                        <div
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          {...providedDraggable.dragHandleProps}
                          onClick={() => handleOpportunityClick(opportunity.id)}
                          className="mb-2"
                        >
                          <Card className="bg-slate-700 border-slate-600 p-3 hover:border-slate-500 cursor-pointer shadow-md">
                            <h4 className="font-medium text-slate-100 mb-1 text-sm">
                              {opportunity.title}
                            </h4>
                            <p className="text-xs text-slate-400 mb-2">
                              {opportunity.company}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {opportunity.priority && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs px-2 py-0.5 rounded-full border
                                    ${
                                      opportunity.priority === "high"
                                        ? "bg-red-700/30 text-red-300 border-red-600"
                                        : opportunity.priority === "medium"
                                        ? "bg-yellow-600/30 text-yellow-300 border-yellow-500"
                                        : "bg-green-700/30 text-green-300 border-green-600"
                                    }`}
                                >
                                  {opportunity.priority}
                                </Badge>
                              )}
                              {opportunity.relatedEvaluationId && (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-2 py-0.5 rounded-full border bg-sky-700/30 text-sky-300 border-sky-600"
                                >
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
