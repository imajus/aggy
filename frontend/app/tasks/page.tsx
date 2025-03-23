"use client";

import { useTasks } from "@/hooks/UseTasksHook";

const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return 'Created';
    case 1:
      return 'In Progress';
    case 2:
      return 'Submitted';
    case 3:
      return 'Completed';
    default:
      return 'Unknown';
  }
};

export default function TasksPage() {
  const { data: tasks, isLoading, error } = useTasks();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tasks</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <div className="grid gap-4">
        {tasks?.map((task) => (
          <div
            key={task.data.id}
            className="border rounded-lg p-4 shadow-sm"
          >
            <h2 className="text-gray-600 text-xl font-semibold">{task.data.name}</h2>
            <p className="text-gray-600 mt-2">{task.data.details}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Reward Amount</p>
                <p>{task.data.rewardAmount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stake Amount</p>
                <p>{task.data.stakeAmount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>{getStatusText(task.state.status)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p>{new Date(parseInt(task.data.deadline) * 1000).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}