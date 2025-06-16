'use client';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component, usage patterns, next steps if any

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, Badge, CardHeader, CardTitle } from './ui/components/ui';
import Link from 'next/link';
import { logger } from '@/lib/logger';

import { AlertTriangle } from 'lucide-react';
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
        id: 'evaluating',
        title: 'Evaluating',
        statusValues: [OpportunityStatus.EVALUATING],
        items: [],
      },
      {
        id: 'pursuing',
        title: 'Pursuing',
        statusValues: [
          OpportunityStatus.PURSUING,
          OpportunityStatus.APPLIED,
          OpportunityStatus.INTERVIEWING,
          OpportunityStatus.INTERVIEW_SCHEDULED,
          OpportunityStatus.INTERVIEWING_ROUND_1,
          OpportunityStatus.INTERVIEWING_ROUND_2,
          OpportunityStatus.FINAL_INTERVIEW,
        ],
        items: [],
      },
      {
        id: 'decision',
        title: 'Decision',
        statusValues: [
          OpportunityStatus.OFFERED,
          OpportunityStatus.ACCEPTED,
          OpportunityStatus.REJECTED,
          OpportunityStatus.DECLINED,
          OpportunityStatus.OFFER_RECEIVED,
          OpportunityStatus.OFFER_ACCEPTED,
          OpportunityStatus.OFFER_REJECTED,
          OpportunityStatus.OFFER_RECEIVED_PENDING_REVIEW,
        ],
        items: [],
      },
      {
        id: 'archived',
        title: 'Archived',
        statusValues: [OpportunityStatus.ARCHIVED, OpportunityStatus.ON_HOLD],
        items: [],
      },
    ],
    []
  );

  useEffect(() => {
    logger.info('[KanbanView] Updating columns based on new opportunities.', {
      count: parentOpportunities.length,
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
    setColumns(newColumns);
    setError(null);
  }, [parentOpportunities, kanbanColumnsDef]);

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;

      const sourceColId = source.droppableId;
      const destColId = destination.droppableId;

      if (sourceColId === destColId && source.index === destination.index) return;

      const startCol = columns[sourceColId];
      const endCol = columns[destColId];
      if (!startCol || !endCol) return;

      const movedOpportunity = startCol.items.find((item) => item.id === draggableId);
      if (!movedOpportunity) return;

      // Optimistic UI update
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

      const newStatus = endCol.statusValues[0];
      if (onStatusChange) {
        try {
          logger.info('[KanbanView] Updating OrionOpportunity status via parent prop.', {
            id: movedOpportunity.id,
            newStatus,
          });
          await onStatusChange(movedOpportunity.id, newStatus);
          logger.success('[KanbanView] OrionOpportunity status updated successfully via parent prop.', {
            id: movedOpportunity.id,
          });
          setError(null);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
          logger.error('[KanbanView] Failed to update OrionOpportunity status via parent prop.', {
            error: errorMessage,
          });
          setError(errorMessage);
          // Revert UI on failure
          setColumns(columns);
        }
      } else {
        logger.warn('[KanbanView] onStatusChange prop not provided. Status update not performed via parent.', {
          id: movedOpportunity.id,
        });
        // Revert UI if no onStatusChange is provided and status cannot be updated
        setColumns(columns);
        setError('Status change handler not provided to Kanban view.');
      }
    },
    [columns, onStatusChange]
  );

  if (error) {
    return (
      <div className="text-center py-10 bg-gray-800 p-4 rounded-md border border-red-500/50">
        <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-2" />
        <p className="text-red-400">Error loading Kanban view: {error}</p>
      </div>
    );
  }

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
