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
    status: 0,
  },
  {
    id: '2',
    name: 'Smart Contract Integration',
    details: 'Integrate wallet connection and contract interactions',
    deadline: Date.now() + 86400000 * 5,
    reward: 200,
    penalty: 100,
    status: 1,
  },
];

export default function TasksPage() {
  return <TasksList tasks={mockTasks} title="Open Tasks" />;
} 