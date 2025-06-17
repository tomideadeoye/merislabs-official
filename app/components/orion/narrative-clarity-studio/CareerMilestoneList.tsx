import React from 'react';
import { CareerMilestone } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Edit, Trash2, Loader2 } from 'lucide-react';

interface CareerMilestoneListProps {
  milestones: CareerMilestone[];
  isLoading: boolean;
  error: string | null;
  onEdit: (milestone: CareerMilestone) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
}

export const CareerMilestoneList: React.FC<CareerMilestoneListProps> = ({
  milestones,
  isLoading,
  error,
  onEdit,
  onDelete,
  onReorder,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <p className="ml-2 text-gray-400">Loading milestones...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error loading milestones: {error}</p>;
  }

  if (milestones.length === 0) {
    return <p className="text-gray-400">No career milestones added yet. Add one to get started!</p>;
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <Card key={milestone.id} className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-100">{milestone.title}</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onReorder(milestone.id, 'up')}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onReorder(milestone.id, 'down')}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(milestone)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(milestone.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>{milestone.description}</p>
            {milestone.organization && <p className="text-sm text-gray-400">Organization: {milestone.organization}</p>}
            {milestone.startDate && (
              <p className="text-sm text-gray-400">
                Dates: {milestone.startDate} - {milestone.endDate || 'Present'}
              </p>
            )}
            {milestone.achievements && milestone.achievements.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-semibold text-gray-400">Achievements:</h4>
                <ul className="list-disc list-inside">
                  {milestone.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
            {milestone.skills && milestone.skills.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">Skills: {milestone.skills.join(', ')}</p>
            )}
            {milestone.impact && <p className="text-sm text-gray-400 mt-2">Impact: {milestone.impact}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
