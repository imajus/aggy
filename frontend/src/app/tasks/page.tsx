"use client";

import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  price: number;
  startDate?: string;
  deadline?: string;
}

export default function TasksPage() {
  const [tasks] = useState<Task[]>([
    {
      id: "1",
      title: "Build a Landing Page",
      description: "Create a Next.js landing page with Tailwind.",
      price: 100,
      startDate: "2025-05-01",
      deadline: "2025-05-05",
    },
    {
      id: "2",
      title: "Smart Contract Audit",
      description: "Review and audit solidity contracts.",
      price: 300,
      startDate: "2025-05-02",
      deadline: "2025-05-10",
    },
  ]);

  const handleSelectTask = (taskId: string) => {
    alert(`Contractor interested in task: ${taskId}`);
    // TODO: open a modal or store a message for the Hirer
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Available Tasks</h1>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="border p-4 rounded bg-white">
            <h2 className="text-lg font-semibold">{task.title}</h2>
            <p>{task.description}</p>
            <p className="text-sm text-gray-600">
              Price: {task.price} USDC <br />
              Start Date: {task.startDate} <br />
              Deadline: {task.deadline}
            </p>
            <button
              className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
              onClick={() => handleSelectTask(task.id)}
            >
              Message Hirer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 