/**
 * FILEPATH: `app/components/orion/opportunity-pipeline/OpportunityKanbanView.tsx`
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides an interactive Kanban board interface for visualizing and managing opportunities within the Opportunity Pipeline.
 *   - Enables users to change the status of opportunities via intuitive drag-and-drop functionality, powered by `react-beautiful-dnd`.
 *   - Displays key opportunity details, including company, title, status, priority, and due dates, with appropriate styling and badges.
 *   - Implements optimistic UI updates for drag-and-drop actions, with a rollback mechanism in case of backend update failures.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/opportunity-pipeline/page.tsx`: This is the parent page component that consumes and renders the `OpportunityKanbanView`, passing in opportunity data and status change handlers.
 *   - `@/lib/types`: Defines core data structures like `REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA` and `REFACTOR TO INFERENCE TYPE SAFE FROM PRISMA. DERIVE FROM THERE` enum, which are crucial for rendering and filtering opportunities into Kanban columns.
 *   - `react-beautiful-dnd`: The external library providing the drag-and-drop capabilities.
 *   - `@/components/ui/*`: Utilizes various Shadcn UI components (e.g., `Card`, `Badge`) for visual presentation.
 *   - `@/lib/logger`: Integrates with the centralized logging utility for comprehensive tracking of component lifecycle, drag-and-drop events, and status updates.
 *   - `date-fns`: Used for safe and localized formatting of date properties like `dueDate`.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `react-beautiful-dnd` is correctly configured and compatible with the Next.js environment.
 *   - The `onStatusChange` prop is expected to be provided by the parent component and is responsible for communicating status updates to the backend (e.g., an API route or database service).
 *   - The component manages its internal column state for optimistic UI updates, which helps in providing a smooth user experience.
 *   - Includes robust checks for `dueDate` validity before rendering to prevent UI errors.
 *
 * NOTES:
 *   - This Kanban view is a central component for managing the sales/opportunity pipeline, offering a visual and interactive way to track progress.
 *   - Comprehensive logging ensures that every significant user action and data flow within the component is recorded for debugging and monitoring.
 *   - The `kanbanColumnsDef` array defines the structure and mapping of opportunity statuses to visual columns, making the board highly configurable.
 *   - Future enhancements could include more dynamic column configuration, filtering options directly within the Kanban, and richer card details.
 */
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import isEqual from 'lodash.isequal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import Link from 'next/link';
import logger from '@/lib/logger';
import { format } from 'date-fns';
import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Opportunity, $Enums } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { StatusDisplay } from '@/components/ui/orion/StatusDisplay';

// Helper function to render due date safely
const renderDueDateBadge = (dueDate: string | null): React.ReactNode => {
  if (dueDate && typeof dueDate === 'string') {
    const date = new Date(dueDate);
    if (!isNaN(date.getTime())) {
      return (
        <Badge variant="outline" className="border-amber-500 text-amber-200">
          Due: {date.toLocaleDateString()}
        </Badge>
      );
    }
  }
  return null; // Return null if date is invalid or not a string
};

interface KanbanColumn {
  id: string;
  title: string;
  statusValues: $Enums.OpportunityStatus[];
  items: Opportunity[];
}

interface OpportunityKanbanViewProps {
  opportunities: Opportunity[];
  onStatusChange?: (id: string, newStatus: $Enums.OpportunityStatus) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const OpportunityKanbanView: React.FC<OpportunityKanbanViewProps> = ({
  opportunities: parentOpportunities,
  onStatusChange,
  isLoading,
  error: initialError,
}) => {
  const [columns, setColumns] = useState<Record<string, KanbanColumn>>({});
  const [internalError, setInternalError] = useState<string | null>(null);

  useEffect(() => {
    if (initialError) {
      setInternalError(initialError);
    } else {
      setInternalError(null);
    }
  }, [initialError]);

  const kanbanColumnsDef: KanbanColumn[] = useMemo(
    () => [
      {
        id: 'identified',
        title: 'Identified',
        statusValues: [$Enums.OpportunityStatus.IDENTIFIED],
        items: [],
      },
      {
        id: 'researching',
        title: 'Researching',
        statusValues: [$Enums.OpportunityStatus.RESEARCHING],
        items: [],
      },
      {
        id: 'evaluating',
        title: 'Evaluating',
        statusValues: [
          $Enums.OpportunityStatus.EVALUATING,
          $Enums.OpportunityStatus.EVALUATED_POSITIVE,
          $Enums.OpportunityStatus.EVALUATED_NEGATIVE,
        ],
        items: [],
      },
      {
        id: 'application',
        title: 'Application',
        statusValues: [
          $Enums.OpportunityStatus.APPLICATION_DRAFTING,
          $Enums.OpportunityStatus.APPLICATION_READY,
          $Enums.OpportunityStatus.APPLIED,
        ],
        items: [],
      },
      {
        id: 'outreach',
        title: 'Outreach',
        statusValues: [
          $Enums.OpportunityStatus.OUTREACH_PLANNED,
          $Enums.OpportunityStatus.OUTREACH_SENT,
          $Enums.OpportunityStatus.FOLLOW_UP_NEEDED,
          $Enums.OpportunityStatus.FOLLOW_UP_SENT,
        ],
        items: [],
      },
      {
        id: 'interviewing',
        title: 'Interviewing',
        statusValues: [
          $Enums.OpportunityStatus.INTERVIEWING,
          $Enums.OpportunityStatus.INTERVIEW_SCHEDULED,
          $Enums.OpportunityStatus.INTERVIEW_COMPLETED,
          $Enums.OpportunityStatus.INTERVIEWING_ROUND_1,
          $Enums.OpportunityStatus.INTERVIEWING_ROUND_2,
          $Enums.OpportunityStatus.FINAL_INTERVIEW,
        ],
        items: [],
      },
      {
        id: 'offer',
        title: 'Offer & Negotiation',
        statusValues: [
          $Enums.OpportunityStatus.OFFER_RECEIVED,
          $Enums.OpportunityStatus.NEGOTIATING,
          $Enums.OpportunityStatus.OFFERED,
          $Enums.OpportunityStatus.OFFER_RECEIVED_PENDING_REVIEW,
        ],
        items: [],
      },
      {
        id: 'closed',
        title: 'Closed',
        statusValues: [
          $Enums.OpportunityStatus.ACCEPTED,
          $Enums.OpportunityStatus.REJECTED_BY_THEM,
          $Enums.OpportunityStatus.DECLINED_BY_ME,
          $Enums.OpportunityStatus.OFFER_ACCEPTED,
          $Enums.OpportunityStatus.OFFER_REJECTED,
        ],
        items: [],
      },
      {
        id: 'on_hold_archived',
        title: 'On Hold / Archived',
        statusValues: [$Enums.OpportunityStatus.ON_HOLD, $Enums.OpportunityStatus.ARCHIVED],
        items: [],
      },
    ],
    []
  );

  useEffect(() => {
    logger.info('[KANBAN_VIEW][USE_EFFECT][OPPORTUNITIES_UPDATE] Updating columns based on new opportunities.', {
      parentOpportunitiesCount: parentOpportunities.length,
      currentColumnsKeys: Object.keys(columns).length,
    });
    const newColumns: Record<string, KanbanColumn> = kanbanColumnsDef.reduce(
      (acc, col) => {
        acc[col.id] = {
          ...col,
          items: parentOpportunities.filter(
            (opp) =>
              opp.status !== null &&
              opp.status !== undefined &&
              col.statusValues.includes(opp.status as $Enums.OpportunityStatus)
          ),
        };
        return acc;
      },
      {} as Record<string, KanbanColumn>
    );

    // Only update state if there's a material change to prevent infinite re-renders
    if (!isEqual(newColumns, columns)) {
      logger.debug('[KANBAN_VIEW][USE_EFFECT][COLUMNS_STATE_UPDATE] Columns state updated due to material change.', {
        newColumnsKeys: Object.keys(newColumns).length,
      });
      setColumns(newColumns);
    } else {
      logger.debug('[KANBAN_VIEW][USE_EFFECT][COLUMNS_STATE_NO_CHANGE] No material change in columns state.');
    }
  }, [parentOpportunities, kanbanColumnsDef, columns]); // Include columns in dependency array for deep comparison

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      logger.info('[KANBAN_VIEW][DRAG_END][START] Drag-and-drop operation ended.', { result });
      const { source, destination, draggableId } = result;
      if (!destination) {
        logger.warn('[KANBAN_VIEW][DRAG_END][NO_DESTINATION] No destination for draggable.');
        return;
      }

      const sourceColId = source.droppableId;
      const destColId = destination.droppableId;

      if (sourceColId === destColId && source.index === destination.index) {
        logger.debug('[KANBAN_VIEW][DRAG_END][SAME_POSITION] Item dropped in the same position.', {
          source,
          destination,
        });
        return;
      }

      const startCol = columns[sourceColId];
      const endCol = columns[destColId];
      if (!startCol || !endCol) {
        logger.error('[KANBAN_VIEW][DRAG_END][INVALID_COLUMNS] Source or destination column not found.', {
          sourceColId,
          destColId,
        });
        return;
      }

      const movedOpportunity = startCol.items.find((item) => item.id === draggableId);
      if (!movedOpportunity) {
        logger.error('[KANBAN_VIEW][DRAG_END][OPPORTUNITY_NOT_FOUND] Moved opportunity not found in source column.', {
          draggableId,
          sourceColId,
        });
        return;
      }

      // Optimistic UI update
      const newColumns = { ...columns };
      const newStartColItems = Array.from(startCol.items);
      const [removed] = newStartColItems.splice(source.index, 1);
      newColumns[sourceColId] = {
        ...newColumns[sourceColId],
        items: newStartColItems,
      };

      const newDestColItems = Array.from(endCol.items);
      newDestColItems.splice(destination.index, 0, removed);
      newColumns[destColId] = {
        ...newColumns[destColId],
        items: newDestColItems,
      };
      setColumns(newColumns);

      // Update status in the backend
      if (onStatusChange) {
        const newStatus = endCol.statusValues[0]; // Assuming the first status value is the primary one for the column
        logger.info('[KANBAN_VIEW][DRAG_END][STATUS_UPDATE] Attempting to update opportunity status via prop.', {
          id: draggableId,
          newStatus,
        });
        try {
          await onStatusChange(draggableId, newStatus);
          // If successful, the parent prop update should trigger useEffect to re-sync columns
          logger.success('[KANBAN_VIEW][DRAG_END][STATUS_UPDATE_SUCCESS] Opportunity status updated successfully.', {
            id: draggableId,
            newStatus,
          });
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          logger.error('[KANBAN_VIEW][DRAG_END][STATUS_UPDATE_FAILURE] Failed to update opportunity status.', {
            id: draggableId,
            newStatus,
            error: errorMessage,
          });
          // Revert UI on failure
          logger.warn('[KANBAN_VIEW][DRAG_END][UI_REVERT] Reverting UI due to status update failure.');
          setColumns(columns); // Revert to previous state
          setInternalError(`Failed to update status for ${movedOpportunity.title}: ${errorMessage}`);
        }
      } else {
        logger.warn(
          '[KANBAN_VIEW][DRAG_END][NO_STATUS_HANDLER] Status change handler not provided to Kanban view. Cannot update status in backend.'
        );
        // Revert UI if no onStatusChange is provided and status cannot be updated
        setColumns(columns); // Revert to previous state
        setInternalError('Status change handler not provided to Kanban view. Cannot update status.');
      }
      logger.info('[KANBAN_VIEW][DRAG_END][END] Drag-and-drop operation completed.');
    },
    [columns, onStatusChange]
  );

  const combinedError = initialError || internalError;

  if (isLoading || combinedError) {
    return (
      <StatusDisplay
        isLoading={isLoading}
        error={combinedError}
        loadingMessage="Loading kanban board..."
        errorMessage={combinedError ? String(combinedError) : 'An unknown error occurred.'}
      />
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto p-4 space-x-4 bg-gray-900 rounded-lg shadow-inner min-h-[500px]">
        {kanbanColumnsDef.map((column) => (
          <Droppable droppableId={column.id} key={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`shrink-0 w-80 p-4 rounded-lg shadow-md transition-all duration-200
                  ${snapshot.isDraggingOver ? 'bg-indigo-900/50' : 'bg-gray-800/50'}
                  flex flex-col border border-gray-700`}
              >
                <h2 className="text-lg font-semibold mb-4 text-purple-300 border-b border-purple-500 pb-2 flex justify-between items-center">
                  {column.title}
                  <Badge className="bg-purple-700 text-purple-100 px-2 py-1 rounded-full text-xs">
                    {columns[column.id]?.items.length || 0}
                  </Badge>
                </h2>
                <div className="grow overflow-y-auto space-y-3 pr-2 scrollbar-thumb-purple-500 scrollbar-track-transparent scrollbar-thin">
                  {columns[column.id]?.items.map((opportunity, index) => (
                    <Draggable key={opportunity.id} draggableId={opportunity.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-gray-700 p-3 rounded-lg shadow-md transition-all duration-200
                            ${snapshot.isDragging ? 'bg-blue-600/70' : 'hover:bg-gray-600'}
                            border border-gray-600 text-white`}
                        >
                          <Link href={`/admin/opportunity/${opportunity.id}/analyze`} passHref>
                            <h3 className="font-semibold text-lg text-gold mb-1 hover:underline cursor-pointer">
                              {opportunity.title}
                            </h3>
                          </Link>
                          {opportunity.company && <p className="text-sm text-gray-300">{opportunity.company}</p>}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {opportunity.status && (
                              <Badge variant="outline" className="border-purple-500 text-purple-200">
                                {column.statusValues.includes(opportunity.status as $Enums.OpportunityStatus)
                                  ? opportunity.status
                                  : 'Unknown Status'}
                              </Badge>
                            )}
                            {opportunity.priority && opportunity.priority !== 'LOW' && (
                              <Badge
                                variant="secondary"
                                className={
                                  opportunity.priority === 'HIGH'
                                    ? 'bg-red-600 text-red-100'
                                    : 'bg-yellow-600 text-yellow-100'
                                }
                              >
                                Priority: {opportunity.priority}
                              </Badge>
                            )}
                            {renderDueDateBadge(opportunity.deadline as string | null)}
                            {opportunity.tags &&
                              opportunity.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="border-gray-500 text-gray-300">
                                  {tag}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default OpportunityKanbanView;
