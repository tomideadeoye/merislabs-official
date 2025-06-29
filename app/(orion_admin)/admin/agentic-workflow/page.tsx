'use client';

import { PageHeader } from '@/components/ui/page-header';
import { BrainCircuit } from 'lucide-react';
import { PageNames } from '@/lib/constants';
import { TaskList } from '@/components/orion/tasks/TaskList';
import { TaskForm } from '@/components/orion/tasks/TaskForm';
import { GamificationStats } from '@/components/orion/tasks/GamificationStats';
import { useState } from 'react';

export default function AgenticWorkflowFeaturePage() {
  const [refresh, setRefresh] = useState(false);

  const handleTaskSaved = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames.AGENTIC}
        icon={<BrainCircuit className="h-7 w-7" />}
        description="Automate workflows and manage your tasks in one place."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TaskList key={refresh.toString()} />
        </div>
        <div>
          <TaskForm onTaskSaved={handleTaskSaved} />
          <GamificationStats />
        </div>
      </div>
    </div>
  );
}
