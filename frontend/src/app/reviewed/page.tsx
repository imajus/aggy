'use client';

import { Task, TasksList } from "@/components/tasks/TasksList";

export default function ReviewedTasksPage() {
  return <TasksList title="Tasks in Review" filterStatus={[2]} />;
} 