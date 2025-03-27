'use client';

import { Task, TasksList } from "@/components/tasks/TasksList";

export default function CompletedTasksPage() {
  return <TasksList title="Completed Tasks" filterStatus={[3]} />;
} 