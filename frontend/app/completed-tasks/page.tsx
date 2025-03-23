"use client";

import TaskList from "@/components/TaskList";
import { useTasks } from "@/hooks/UseTasksHook";
import { TaskStatus } from "@/types/Task";

export default function CompletedTasksPage() {
  const { data: tasks, isLoading, error } = useTasks(TaskStatus.COMPLETED);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tasks</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Created Tasks</h1>
      <TaskList tasks={tasks || []} />
    </div>
  );
} 