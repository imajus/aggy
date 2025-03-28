'use client';

import { Task, TasksList } from "@/components/tasks/TasksList";

export default function TasksPage() {
  return <TasksList title="Open Tasks" filterStatus={[0]} />;
} 