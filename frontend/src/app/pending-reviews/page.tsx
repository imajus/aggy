"use client";

import { Card } from "@/components/Card";

export default function PendingReviewsPage() {
  const pendingTasks = [
    { id: 1, title: "Landing Page Setup" },
    { id: 2, title: "Contract Audit" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-[#2D3748]">Pending Reviews</h1>
      <div className="space-y-4">
        {pendingTasks.map((task) => (
          <Card key={task.id}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#2D3748]">{task.title}</h2>
              <span className="text-sm text-[#718096]">Pending Review</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 