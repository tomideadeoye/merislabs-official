'use client';

// GOAL OF FILE|FEATURES|FUNCTIONS: Provides an interactive Kanban board for the Opportunity Pipeline, allowing users to visualize and manage opportunities via drag-and-drop. Leverages `react-beautiful-dnd`.
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/components/orion/opportunity-pipeline/OpportunityKanbanView.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Consumed by `OpportunityPipelinePage` (`app/(orion_admin)/admin/opportunity-pipeline/page.tsx`).
//   - Receives `opportunities` data and `onStatusChange` handler from the parent (likely using `useOpportunities`).
//   - Uses `react-beautiful-dnd` for drag-and-drop functionality.
//   - Uses `OpportunityStatus` enum (`@/lib/types`) to define column groupings.
//   - Uses `@/components/ui` components (`Card`, `Badge`) for visual structure.
//   - Uses `logger` (`@/lib/logger`) for logging.
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed `react-beautiful-dnd` is compatible with the Next.js version and environment. Assumed `onStatusChange` prop is provided and handles backend updates.
// NOTES: This component manages its internal column state for optimistic UI updates during drag-and-drop. It includes error handling and logging for the drag-and-drop process and status updates. There is a duplicate `StatusUpdateButton` component (`app/components/ui/orion/opportunities/StatusUpdateButton.tsx` and `app/components/orion/opportunity-pipeline/StatusUpdateButton.tsx`) which should be consolidated, although this component doesn't directly use it, the parent might.

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import isEqual from 'lodash.isequal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import Link from 'next/link';
import logger from '@/lib/logger';

import { AlertTriangle } from 'lucide-react';
import { Badge, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { OpportunityStatus, OrionOpportunity } from '@/lib/types';

interface KanbanColumn {
  id: string;
  title: string;
  statusValues: OpportunityStatus[];
  items: OrionOpportunity[];
}

interface OpportunityKanbanViewProps {
  opportunities: OrionOpportunity[];
  onStatusChange?: (opportunityId: string, newStatus: OpportunityStatus) => Promise<void>;
}

export const OpportunityKanbanView: React.FC<OpportunityKanbanViewProps> = ({
  opportunities: parentOpportunities,
  onStatusChange,
}) => {
  logger.debug('[KANBAN_VIEW][RENDER] Component rendering.', { opportunitiesCount: parentOpportunities.length });
  const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState<Record<string, KanbanColumn>>({});

  const kanbanColumnsDef: KanbanColumn[] = useMemo(
    () => [
      {
        id: 'identified',
        title: 'Identified',
        statusValues: [OpportunityStatus.IDENTIFIED],
        items: [],
      },
      {
        id: 'researching',
        title: 'Researching',
        statusValues: [OpportunityStatus.RESEARCHING],
        items: [],
      },
      {
        id: 'evaluating',
        title: 'Evaluating',
        statusValues: [
          OpportunityStatus.EVALUATING,
          OpportunityStatus.EVALUATED_POSITIVE,
          OpportunityStatus.EVALUATED_NEGATIVE,
        ],
        items: [],
      },
      {
        id: 'application',
        title: 'Application',
        statusValues: [
          OpportunityStatus.APPLICATION_DRAFTING,
          OpportunityStatus.APPLICATION_READY,
          OpportunityStatus.APPLIED,
        ],
        items: [],
      },
      {
        id: 'outreach',
        title: 'Outreach',
        statusValues: [
          OpportunityStatus.OUTREACH_PLANNED,
          OpportunityStatus.OUTREACH_SENT,
          OpportunityStatus.FOLLOW_UP_NEEDED,
          OpportunityStatus.FOLLOW_UP_SENT,
        ],
        items: [],
      },
      {
        id: 'interviewing',
        title: 'Interviewing',
        statusValues: [
          OpportunityStatus.INTERVIEWING,
          OpportunityStatus.INTERVIEW_SCHEDULED,
          OpportunityStatus.INTERVIEW_COMPLETED,
          OpportunityStatus.INTERVIEWING_ROUND_1,
          OpportunityStatus.INTERVIEWING_ROUND_2,
          OpportunityStatus.FINAL_INTERVIEW,
        ],
        items: [],
      },
      {
        id: 'offer',
        title: 'Offer & Negotiation',
        statusValues: [
          OpportunityStatus.OFFER_RECEIVED,
          OpportunityStatus.NEGOTIATING,
          OpportunityStatus.OFFERED,
          OpportunityStatus.OFFER_RECEIVED_PENDING_REVIEW,
        ],
        items: [],
      },
      {
        id: 'closed',
        title: 'Closed',
        statusValues: [
          OpportunityStatus.ACCEPTED,
          OpportunityStatus.REJECTED_BY_THEM,
          OpportunityStatus.DECLINED_BY_ME,
          OpportunityStatus.OFFER_ACCEPTED,
          OpportunityStatus.OFFER_REJECTED,
        ],
        items: [],
      },
      {
        id: 'on_hold_archived',
        title: 'On Hold / Archived',
        statusValues: [OpportunityStatus.ON_HOLD, OpportunityStatus.ARCHIVED],
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
              col.statusValues.includes(opp.status as OpportunityStatus)
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
    setError(null);
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
        logger.error('[KANBAN_VIEW][DRAG_END][OPPORTUNITY_NOT_FOUND] Moved opportunity not found.', {
          draggableId,
          sourceColId,
        });
        return;
      }

      // Optimistic UI update
      logger.info('[KANBAN_VIEW][DRAG_END][OPTIMISTIC_UPDATE] Applying optimistic UI update.', {
        opportunityId: movedOpportunity.id,
        from: sourceColId,
        to: destColId,
      });
      const newStartItems = Array.from(startCol.items);
      newStartItems.splice(source.index, 1);

      const newEndItems = Array.from(endCol.items);
      newEndItems.splice(destination.index, 0, movedOpportunity);

      const newColumnsState = {
        ...columns,
        [sourceColId]: { ...startCol, items: newStartItems },
        [destColId]: { ...endCol, items: newEndItems },
      };
      setColumns(newColumnsState);

      const newStatus = endCol.statusValues[0]; // Take the first status value as the primary for the column
      if (onStatusChange) {
        try {
          logger.info('[KANBAN_VIEW][DRAG_END][STATUS_CHANGE_CALL] Calling onStatusChange prop.', {
            id: movedOpportunity.id,
            newStatus,
          });
          await onStatusChange(movedOpportunity.id, newStatus);
          logger.success(
            '[KANBAN_VIEW][DRAG_END][STATUS_CHANGE_SUCCESS] OrionOpportunity status updated successfully via parent prop.',
            {
              id: movedOpportunity.id,
              newStatus,
            }
          );
          setError(null);
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          logger.error(
            '[KANBAN_VIEW][DRAG_END][STATUS_CHANGE_FAILURE] Failed to update OrionOpportunity status via parent prop.',
            {
              id: movedOpportunity.id,
              newStatus,
              error: errorMessage,
            }
          );
          setError(errorMessage);
          // Revert UI on failure
          logger.warn('[KANBAN_VIEW][DRAG_END][UI_REVERT] Reverting UI due to status update failure.');
          setColumns(columns); // Revert to previous state on error
        }
      } else {
        logger.warn(
          '[KANBAN_VIEW][DRAG_END][NO_STATUS_HANDLER] onStatusChange prop not provided. Status update not performed via parent.',
          {
            id: movedOpportunity.id,
          }
        );
        // Revert UI if no onStatusChange is provided and status cannot be updated
        setColumns(columns); // Revert to previous state
        setError('Status change handler not provided to Kanban view. Cannot update status.');
      }
      logger.info('[KANBAN_VIEW][DRAG_END][END] Drag-and-drop operation completed.');
    },
    [columns, onStatusChange] // Depend on columns for accurate state and onStatusChange prop stability
  );

  if (error) {
    logger.error('[KANBAN_VIEW][RENDER_ERROR] Displaying error message.', { error });
    return (
      <div className="text-center py-10 bg-gray-800 p-4 rounded-md border border-red-500/50">
        <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-2" />
        <p className="text-red-400">Error loading Kanban view: {error}</p>
      </div>
    );
  }

  logger.debug('[KANBAN_VIEW][RENDER] Returning JSX for DragDropContext.');
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {kanbanColumnsDef.map((column) => (
          <Droppable droppableId={column.id} key={column.id}>
            {(provided) => (
              <Card
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg flex flex-col"
              >
                <CardHeader className="px-4 py-3 border-b border-gray-700 bg-gray-750 rounded-t-lg sticky top-0 z-10">
                  <CardTitle className="text-lg font-semibold text-gray-100 flex justify-between items-center">
                    {column.title}
                    <Badge className="bg-blue-600 text-white ml-2 rounded-full px-2 py-0.5 text-xs">
                      {(columns[column.id]?.items || []).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
                  {columns[column.id]?.items.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No opportunities in this stage.</p>
                  ) : (
                    (columns[column.id]?.items || []).map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-900 border border-gray-700 rounded-md shadow-sm p-3 hover:shadow-md transition-shadow duration-200 ease-in-out"
                          >
                            <Link href={`/admin/opportunity-pipeline/${item.id}`}>
                              <p className="text-gray-200 font-medium leading-tight mb-1">{item.title}</p>
                              <p className="text-gray-400 text-sm mb-2">{item.companyOrInstitution}</p>
                              <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
                                {item.status}
                              </Badge>
                            </Link>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </CardContent>
              </Card>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default OpportunityKanbanView;
