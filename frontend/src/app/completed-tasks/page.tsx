"use client";

export default function CompletedTasksPage() {
  const completedTasks = [
    { id: 1, title: "Design a Logo" },
    { id: 2, title: "Fix Smart Contract Bug" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Completed Tasks</h1>
      <ul className="space-y-2">
        {completedTasks.map((task) => (
          <li key={task.id} className="border p-2 bg-white">
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
} 