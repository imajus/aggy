"use client";

export default function PendingReviewsPage() {
  const pendingTasks = [
    { id: 1, title: "Landing Page Setup" },
    { id: 2, title: "Contract Audit" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pending Reviews</h1>
      <ul className="space-y-2">
        {pendingTasks.map((task) => (
          <li key={task.id} className="border p-2 bg-white">
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
} 