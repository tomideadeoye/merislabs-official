"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import type { OrionOpportunity, OrionOpportunityStatus } from '@repo/shared';
import { Card, CardContent, Badge, Loader } from '@repo/ui';
import Link from 'next/link';
import { useOpportunityCentralStore, OpportunityCentralStoreType } from '@repo/shared';
import { logger } from '@repo/shared/logger';

interface KanbanColumn {
  id: string;
  title: string;
  statusValues: OrionOpportunityStatus[];
  items: OrionOpportunity[];
}

interface OpportunityKanbanViewProps {
  opportunities: OrionOpportunity[];
}

export const OpportunityKanbanView: React.FC<OpportunityKanbanViewProps> = ({ opportunities: parentOpportunities }) => {
  const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState<Record<string, KanbanColumn>>({});
  const setNeedsRefetch = useOpportunityCentralStore((state: OpportunityCentralStoreType) => state.setNeedsRefetch);

  const kanbanColumnsDef: KanbanColumn[] = useMemo(() => [
    { id: 'identified', title: 'Identified', statusValues: ['identified'], items: [] },
    { id: 'evaluating', title: 'Evaluating', statusValues: ['evaluating'], items: [] },
    { id: 'pursuing', title: 'Pursuing', statusValues: ['pursuing', 'applied', 'interviewing'], items: [] },
    { id: 'decision', title: 'Decision', statusValues: ['negotiating', 'accepted', 'rejected', 'declined'], items: [] },
    { id: 'archived', title: 'Archived', statusValues: ['archived'], items: [] }
  ], []);

  useEffect(() => {
    logger.info('[KanbanView] Updating columns based on new opportunities.', { count: parentOpportunities.length });
    const newColumns: Record<string, KanbanColumn> = kanbanColumnsDef.reduce((acc, col) => {
      acc[col.id] = { ...col, items: parentOpportunities.filter(opp => col.statusValues.includes(opp.status)) };
      return acc;
    }, {} as Record<string, KanbanColumn>);
    setColumns(newColumns);
    setError(null);
  }, [parentOpportunities, kanbanColumnsDef]);

  const onDragEnd = useCallback(async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;

    if (sourceColId === destColId && source.index === destination.index) return;

    const startCol = columns[sourceColId];
    const endCol = columns[destColId];
    if (!startCol || !endCol) return;

    const movedOpportunity = startCol.items.find(item => item.id === draggableId);
    if (!movedOpportunity) return;

    // Optimistic UI update
    const newStartItems = Array.from(startCol.items);
    newStartItems.splice(source.index, 1);

    const newEndItems = Array.from(endCol.items);
    newEndItems.splice(destination.index, 0, movedOpportunity);

    const newColumnsState = {
      ...columns,
      [sourceColId]: { ...startCol, items: newStartItems },
      [destColId]: { ...endCol, items: newEndItems }
    };
    setColumns(newColumnsState);

    const newStatus = endCol.statusValues[0];
    try {
      logger.info('[KanbanView] Updating OrionOpportunity status.', { id: movedOpportunity.id, newStatus });
      // NOTE: The API endpoint seems to be `/api/orion/notion/OrionOpportunity/:id` from another file.
      // This should be unified. Assuming this is the correct one for now.
      const response = await fetch(`/api/orion/opportunities/${movedOpportunity.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update OrionOpportunity status');
      }

      logger.success('[KanbanView] OrionOpportunity status updated successfully.', { id: movedOpportunity.id });
      setError(null);
      setNeedsRefetch(true);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      logger.error('[KanbanView] Failed to update OrionOpportunity status.', { error: errorMessage });
      setError(errorMessage);
      // Revert UI on failure
      setColumns(columns);
    }
  }, [columns, setNeedsRefetch]);


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-center justify-between mb-4">
          <span>{error}</span>
          <button
            className="ml-4 px-2 py-1 bg-red-700 text-white rounded hover:bg-red-800"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      <div className="flex overflow-x-auto pb-4 space-x-4">
        {Object.values(columns).map(column => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-shrink-0 w-72 bg-gray-800 rounded-md p-3 transition-colors ${snapshot.isDraggingOver ? 'bg-gray-700/50' : ''}`}
              >
                <h3 className="font-medium text-gray-200 mb-3 flex justify-between items-center">
                  {column.title}
                  <Badge variant="secondary" className="text-gray-400 border-gray-600 bg-gray-700">
                    {column.items.length}
                  </Badge>
                </h3>
                <div className="min-h-[200px] space-y-2">
                  {column.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Card className={`bg-gray-700 border-gray-600 hover:border-blue-500 ${snapshot.isDragging ? 'ring-2 ring-blue-500' : ''}`}>
                            <CardContent className="p-3">
                              <Link href={`/admin/OrionOpportunity-pipeline/${item.id}`} className="block">
                                <h4 className="font-medium text-gray-200 line-clamp-2">{item.position}</h4>
                                <p className="text-xs text-gray-400 mt-1">{item.company}</p>
                              </Link>
                            </CardContent>
                          </Card>
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
