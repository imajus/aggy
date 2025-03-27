'use client';

import { Task, TasksList } from "@/components/tasks/TasksList";

const mockTasks: Task[] = [
  {
    id: '1',
    name: 'Create Landing Page',
    details: 'Design and implement the main landing page for our dApp',
    deadline: Date.now() + 86400000 * 3,
    reward: 100,
    penalty: 50,
    status: 3,
  },
  // ... more mock tasks with status 3
];

export default function CompletedTasksPage() {
  return <TasksList tasks={mockTasks} title="Completed Tasks" />;
} 