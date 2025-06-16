'use client';

import { useSessionStateStore } from "../../state/sessionState";
import { HabiticaTask, SessionStateKeys } from "../../types";
import { ActionReflectionDialog } from "./tasks/ActionReflectionDialog";
import { useActionReflectionDialogStore } from "./tasks/actionReflectionDialogStore";




interface HabiticaTaskListProps {
  type: 'todos' | 'dailys';
  className?: string;
}

// Basic utility function to check if a date is in the past
const isPastDue = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for comparison
  const taskDate = new Date(dateString);
  return taskDate < today;
};

export const HabiticaTaskList: React.FC<HabiticaTaskListProps> = ({ type, className }) => {
  const [tasks, setTasks] = useState<HabiticaTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const actionReflectionDialogStore = useActionReflectionDialogStore();

  const { getSessionValue } = useSessionStateStore();
  const habiticaUserId = getSessionValue(SessionStateKeys.HABITICA_USER_ID);
  const habiticaApiToken = getSessionValue(SessionStateKeys.HABITICA_API_TOKEN);

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    if (!habiticaUserId || !habiticaApiToken) {
      setError('Habitica credentials not set');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/orion/habitica/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: habiticaUserId, apiToken: habiticaApiToken, type }),
      });

      const data = await response.json();

      if (data.success) {
        const sortedTasks = data.data[type] || [];

        if (type === 'todos') {
          sortedTasks.sort((a: HabiticaTask, b: HabiticaTask) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
          });
        } else if (type === 'dailys') {
          sortedTasks.sort((a: HabiticaTask, b: HabiticaTask) => {
            if (a.completed === b.completed) {
              if (isPastDue(a.date) === isPastDue(b.date)) return 0;
              return isPastDue(a.date) ? -1 : 1; // Past due first
            }
            return a.completed ? 1 : -1; // Uncompleted first
          });
        }

        setTasks(sortedTasks);
      } else {
        throw new Error(data.error || `Failed to fetch ${type} tasks`);
      }
    } catch (err: unknown) {
      console.error(`Error fetching ${type} tasks:`, err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [habiticaUserId, habiticaApiToken, type]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskToggle = async (task: HabiticaTask) => {
    if (!habiticaUserId || !habiticaApiToken) return;

    try {
      const response = await fetch('/api/orion/habitica/tasks/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: habiticaUserId,
          apiToken: habiticaApiToken,
          taskId: task._id,
          direction: task.completed ? 'down' : 'up',
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        if (task.type === 'todo') {
          setTasks(tasks.map((t) => (t._id === task._id ? { ...t, completed: !t.completed } : t)));
        } else if (task.type === 'daily') {
          setTasks(tasks.map((d) => (d._id === task._id ? { ...d, completed: !d.completed } : d)));
        }

        // If task was just completed (not uncompleted) and has Orion origin, trigger reflection
        if (!task.completed && task.orionOrigin) {
          actionReflectionDialogStore.setDialogData({
            completedTaskText: task.text,
            habiticaTaskId: task._id,
            orionSourceModule: task.orionOrigin.orionSourceModule,
            orionSourceReferenceId: task.orionOrigin.orionSourceReferenceId,
            onReflectionSaved: fetchTasks,
          });
          actionReflectionDialogStore.open();
        }

        // Re-fetch tasks to update the list
        fetchTasks();
      } else {
        throw new Error(data.error || 'Failed to update task');
      }
    } catch (err: unknown) {
      console.error('Error updating task:', err);
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to update task'}`);
    }
  };

  const handleRefreshTasks = () => {
    fetchTasks();
  };

  const title = type === 'todos' ? 'Todos' : 'Dailies';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
        <span className="ml-2 text-gray-400">Loading tasks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <>
      <ActionReflectionDialog />
      <Card className={`bg-gray-800 border-gray-700 ${className}`}>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center">{title}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshTasks}
            disabled={isLoading}
            className="bg-gray-700 hover:bg-gray-600"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md">{error}</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400">No {type} found.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task._id} className="flex items-start space-x-3">
                  <input type="checkbox" checked={task.completed} onChange={() => handleTaskToggle(task)} />
                  <span>{task.text}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
};
