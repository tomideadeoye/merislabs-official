import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface StatusUpdateButtonProps {
  opportunityId: string;
  currentStatus: string;
  onStatusUpdated: () => void;
  isLoading: boolean;
}

export const StatusUpdateButton: React.FC<StatusUpdateButtonProps> = ({
  opportunityId,
  currentStatus,
  onStatusUpdated,
  isLoading,
}) => {
  const handleClick = () => {
    // Placeholder for API call to update status
    console.log(`Updating status for opportunity ${opportunityId} from ${currentStatus}`);
    // Simulate success
    setTimeout(() => {
      onStatusUpdated();
    }, 1000);
  };

  return (
    <Button onClick={handleClick} disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white">
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Update Status'}
    </Button>
  );
};
