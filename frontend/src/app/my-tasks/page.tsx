'use client';

import { TasksList } from "@/components/tasks/TasksList";

export default function MyTasksPage() {
  return <TasksList title="My Tasks" filterStatus={[1]} showOnlyMine={true} />;
} 