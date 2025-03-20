"use client";

import { Card } from "@/components/Card";

export default function CompletedTasksPage() {
  const completedTasks = [
    { id: 1, title: "Design a Logo" },
    { id: 2, title: "Fix Smart Contract Bug" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-[#2D3748]">Completed Tasks</h1>
      <div className="space-y-4">
        {completedTasks.map((task) => (
          <Card key={task.id}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#2D3748]">{task.title}</h2>
              <span className="text-sm text-[#38A169]">Completed</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 