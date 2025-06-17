import React, { createContext, useContext, ReactNode } from 'react';
import { CareerMilestone } from '@/lib/types';

interface CareerMilestoneContextType {
  submitMilestone: (milestone: Partial<CareerMilestone>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;
  reorderMilestone: (id: string, direction: 'up' | 'down') => Promise<void>;
}

const CareerMilestoneContext = createContext<CareerMilestoneContextType | undefined>(undefined);

export const CareerMilestoneProvider: React.FC<{
  children: ReactNode;
  submitMilestone: (milestone: Partial<CareerMilestone>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;
  reorderMilestone: (id: string, direction: 'up' | 'down') => Promise<void>;
}> = ({ children, submitMilestone, deleteMilestone, reorderMilestone }) => {
  return (
    <CareerMilestoneContext.Provider value={{ submitMilestone, deleteMilestone, reorderMilestone }}>
      {children}
    </CareerMilestoneContext.Provider>
  );
};

export const useCareerMilestones = () => {
  const context = useContext(CareerMilestoneContext);
  if (!context) {
    throw new Error('useCareerMilestones must be used within a CareerMilestoneProvider');
  }
  return context;
};
