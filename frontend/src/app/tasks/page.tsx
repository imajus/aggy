"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

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
      <h1 className="text-2xl font-bold mb-6 text-[#2D3748]">Available Tasks</h1>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <h2 className="text-lg font-semibold text-[#2D3748] mb-2">{task.title}</h2>
            <p className="text-[#4A5568] mb-3">{task.description}</p>
            <div className="text-sm text-[#718096] mb-4">
              <p>Price: {task.price} USDC</p>
              <p>Start Date: {task.startDate}</p>
              <p>Deadline: {task.deadline}</p>
            </div>
            <Button variant="primary" onClick={() => handleSelectTask(task.id)}>
              Message Hirer
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
} 