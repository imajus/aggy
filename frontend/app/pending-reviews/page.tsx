"use client";

import TaskList from "@/components/TaskList";
import { useTasks } from "@/hooks/UseTasksHook";
import { TaskStatus } from "@/types/Task";

export default function PendingReviewsPage() {
  const { data: tasks, isLoading, error } = useTasks(TaskStatus.PENDING_REVIEW);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tasks</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-[#3173E2]">Pending Reviews</h1>
      <TaskList tasks={tasks || []} />
    </div>
  );
} 