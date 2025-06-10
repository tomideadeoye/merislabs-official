"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import type { Opportunity } from '@shared/types/opportunity';
import { Card, CardContent, Badge, Loader } from '@repo/ui';
import Link from 'next/link';
import { useOpportunityCentralStore } from '@/components/orion/opportunities/opportunityCentralStore';

interface KanbanColumn {
  id: string;
  title: string;
  statusValues: string[];
  items: Opportunity[];
}

interface OpportunityKanbanViewProps {
  opportunities: Opportunity[];
  isLoading?: boolean;
  error?: string | null;
}

export const OpportunityKanbanView: React.FC<OpportunityKanbanViewProps> = ({
  opportunities: parentOpportunities,
  isLoading: parentLoading,
  error: parentError
}) => {
  const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const setNeedsRefetch = useOpportunityCentralStore((state) => state.setNeedsRefetch);

  const kanbanColumns: KanbanColumn[] = useMemo(() => [
    {
      id: 'discovery',
      title: 'Discovery',
      statusValues: ['identified', 'researching'],
      items: []
    },
    {
      id: 'evaluation',
      title: 'Evaluation',
      statusValues: ['evaluating', 'evaluated_positive', 'evaluated_negative'],
      items: []
    },
    {
      id: 'application',
      title: 'Application',
      statusValues: ['application_drafting', 'application_ready', 'applied'],
      items: []
    },
    {
      id: 'interview',
      title: 'Interview',
      statusValues: ['interview_scheduled', 'interview_completed'],
      items: []
    },
    {
      id: 'decision',
      title: 'Decision',
      statusValues: ['offer_received', 'negotiating', 'accepted', 'rejected_by_them', 'declined_by_me'],
      items: []
    }
  ], []);

  useEffect(() => {
    const newColumns = kanbanColumns.map(column => {
      return {
        ...column,
        items: parentOpportunities.filter(opp => opp.status && column.statusValues.includes(opp.status))
      };
    });

    setColumns(newColumns);
    setError(null);
  }, [parentOpportunities, kanbanColumns]);

  const handleDragEnd = useCallback(async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const opportunity = sourceColumn.items.find(item => item.id === draggableId);
    if (!opportunity) return;

    const newStatus = destColumn.statusValues[0];

    const newColumns = columns.map(column => {
      if (column.id === source.droppableId) {
        const newItems = [...column.items];
        newItems.splice(source.index, 1);
        return { ...column, items: newItems };
      }

      if (column.id === destination.droppableId) {
        const newItems = [...column.items];
        const updatedOpportunity = { ...opportunity, status: newStatus as Opportunity["status"] };
        newItems.splice(destination.index, 0, updatedOpportunity);
        return { ...column, items: newItems };
      }

      return column;
    });
    setColumns(newColumns);

    try {
      const response = await fetch(`/api/orion/notion/opportunity/${opportunity.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const revertedColumns = kanbanColumns.map(column => {
          return {
            ...column,
            items: parentOpportunities.filter(opp => opp.status && column.statusValues.includes(opp.status))
          };
        });
        setColumns(revertedColumns);

        const errorData = await response.json();
        setError(errorData.error || 'Failed to update opportunity status in Notion');
        return;
      }

      setError(null);
      setNeedsRefetch(true);

    } catch (err: any) {
      setError(err.message || 'Failed to update opportunity status.');
    }
  }, [columns, kanbanColumns, parentOpportunities, setNeedsRefetch]);

  if (parentLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="h-8 w-8 animate-spin text-blue-400" />
        <span className="ml-2 text-gray-400">Loading opportunities...</span>
      </div>
    );
  }

  if (parentError || error) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-center justify-between">
        <span>{parentError || error}</span>
        <button
          className="ml-4 px-2 py-1 bg-red-700 text-white rounded hover:bg-red-800"
          onClick={() => setError(null)}
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex overflow-x-auto pb-4 space-x-4">
        {columns.map(column => (
          <div key={column.id} className="flex-shrink-0 w-72">
            <div className="bg-gray-800 rounded-md p-3">
              <h3 className="font-medium text-gray-200 mb-3 flex justify-between">
                {column.title}
                <Badge variant="outline" className="text-gray-400 border-gray-600">
                  {column.items.length}
                </Badge>
              </h3>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px]"
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                          >
                            <Card className="bg-gray-700 border-gray-600 hover:border-gray-500">
                              <CardContent className="p-3">
                                <Link
                                  href={`/admin/opportunity-pipeline/${item.id}`}
                                  className="block"
                                >
                                  <h4 className="font-medium text-gray-200 line-clamp-2">
                                    {item.title}
                                  </h4>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {item.company}
                                  </p>
                                </Link>
                              </CardContent>
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
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
