"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Opportunity } from '@/types/opportunity';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface KanbanColumn {
  id: string;
  title: string;
  statusValues: string[];
  items: Opportunity[];
}

// Define props for the component
interface OpportunityKanbanViewProps {
  opportunities: Opportunity[]; // Opportunities passed from parent
  refetchOpportunities: () => Promise<void>; // Function to refetch data from parent
  isLoading?: boolean; // Optional loading state from parent
  error?: string | null; // Optional error state from parent
}

// Accept props in the component function
export const OpportunityKanbanView: React.FC<OpportunityKanbanViewProps> = ({
  opportunities: parentOpportunities,
  refetchOpportunities,
  isLoading: parentLoading,
  error: parentError
}) => {
  // Remove internal state for opportunities, loading, and error
  // const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);

  // Define the columns for the Kanban board
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

  // Organize opportunities (from parent prop) into columns whenever parentOpportunities changes
  useEffect(() => {
    const newColumns = kanbanColumns.map(column => {
      return {
        ...column,
        // Use parentOpportunities prop
        items: parentOpportunities.filter(opp => opp.status && column.statusValues.includes(opp.status))
      };
    });

    setColumns(newColumns);
  }, [parentOpportunities, kanbanColumns]);

  const handleDragEnd = useCallback(async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    // Find the source and destination columns
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    // Find the opportunity being dragged
    const opportunity = sourceColumn.items.find(item => item.id === draggableId);
    if (!opportunity) return;

    // Determine the new status based on the destination column
    // For simplicity, we'll use the first status in the destination column's statusValues
    const newStatus = destColumn.statusValues[0];

    // Optimistic UI update (optional, remove if you prefer waiting for API response)
    const newColumns = columns.map(column => {
      // Remove from source column
      if (column.id === source.droppableId) {
        const newItems = [...column.items];
        newItems.splice(source.index, 1);
        return { ...column, items: newItems };
      }

      // Add to destination column
      if (column.id === destination.droppableId) {
        const newItems = [...column.items];
        const updatedOpportunity = { ...opportunity, status: newStatus as Opportunity["status"] };
        newItems.splice(destination.index, 0, updatedOpportunity);
        return { ...column, items: newItems };
      }

      return column;
    });
    setColumns(newColumns); // Update UI immediately

    // Update the opportunity status in the backend using the Notion API route
    try {
      // Using the updated Notion API endpoint for updating opportunity status
      const response = await fetch(`/api/orion/notion/opportunity/${opportunity.id}`, {
        method: 'PATCH', // Using PATCH as per our previous plan for updates
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        // If API call fails, revert UI change (optional)
        // Revert to the opportunities state passed from the parent before the drag
        const revertedColumns = kanbanColumns.map(column => {
          return {
            ...column,
            items: parentOpportunities.filter(opp => opp.status && column.statusValues.includes(opp.status))
          };
        });
        setColumns(revertedColumns);

        const errorData = await response.json(); // Attempt to get error details from response
        throw new Error(errorData.error || 'Failed to update opportunity status in Notion');
      }

      // If API call is successful, trigger refetch in the parent component
      refetchOpportunities();

    } catch (err: any) {
      console.error('Error updating opportunity status:', err);
      // Handle error display in the UI if needed, potentially using the parentError prop
    }
  }, [columns, kanbanColumns, parentOpportunities, refetchOpportunities]); // Add dependencies

  // Use parent loading and error states
  if (parentLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <span className="ml-2 text-gray-400">Loading opportunities...</span>
      </div>
    );
  }

  if (parentError) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md">
        {parentError}
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
                                    {item.companyOrInstitution}
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
