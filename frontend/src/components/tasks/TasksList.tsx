'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { fetchTasks } from '@/lib/api';

export interface Task {
  id: string;
  name: string;
  details: string;
  deadline: number;
  reward: number;
  penalty: number;
  status: 0 | 1 | 2 | 3 | 4 | 5;
}

export const STATUS_MAP = {
  0: { label: 'Created', color: 'bg-gray-500' },
  1: { label: 'In Progress', color: 'bg-blue-500' },
  2: { label: 'Reviewed', color: 'bg-yellow-500' },
  3: { label: 'Completed', color: 'bg-green-500' },
  4: { label: 'Failed', color: 'bg-red-500' },
  5: { label: 'Cancelled', color: 'bg-slate-500' },
};

interface TasksListProps {
  title: string;
  filterStatus?: number[];
}

export function TasksList({ title, filterStatus }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await fetchTasks();
        const filteredTasks = filterStatus 
          ? data.filter(task => filterStatus.includes(task.status))
          : data;
        setTasks(filteredTasks);
      } catch (err) {
        setError('Failed to load tasks');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, [filterStatus]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <div className="flex items-center justify-center h-64">
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <Card className="p-6 bg-red-50">
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      
      {tasks.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground">No tasks found</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{task.name}</h2>
                  <p className="text-muted-foreground mt-1">{task.details}</p>
                </div>
                <Badge 
                  variant="default"
                  className={`${STATUS_MAP[task.status].color} text-white`}
                >
                  {STATUS_MAP[task.status].label}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Deadline</p>
                  <p className="font-medium">
                    {formatDistanceToNow(task.deadline, { addSuffix: true })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reward</p>
                  <p className="font-medium text-green-600">
                    {task.reward} AGGY
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Penalty</p>
                  <p className="font-medium text-red-600">
                    {task.penalty} AGGY
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 