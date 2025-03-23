"use client";

import { useClaimTask } from "@/hooks/UseClaimTask";
import { useTasks } from "@/hooks/UseTasksHook";
import { getStatusText } from "@/types/Task";

export default function TasksPage() {
  const { data: tasks, isLoading, error } = useTasks();
  const { claim, isSending, error: claimError, privateData } = useClaimTask();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tasks</div>;

  // A small helper for conditionally showing "Claim" only if the task is not claimed yet
  const canClaimTask = (task: any) => {
    // e.g. check if task.state.status === 0 or "CREATED" or however your contract flags it
    return task.state.status === 0;
  };

  const handleClaim = (task: any) => {
    // Pass the ID and stakeAmount from the task data
    const taskId = task.data.id;
    const stakeAmount = parseInt(task.data.stakeAmount, 10) || 0;
    claim(taskId, stakeAmount);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>

      {claimError && (
        <div className="text-red-500 mb-4">
          Error claiming task: {claimError.message}
        </div>
      )}

      {/* If you want to see fetched private data after claiming: */}
      {privateData && (
        <div className="bg-green-100 p-2 rounded mb-4">
          <h2 className="font-semibold">Private Task Data</h2>
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(privateData, null, 2)}
          </pre>
        </div>
      )}

      <div className="grid gap-4">
        {tasks?.map((task) => (
          <div
            key={task.data.id}
            className="border rounded-lg p-4 shadow-sm"
          >
            <h2 className="text-gray-600 text-xl font-semibold">
              {task.data.name}
            </h2>
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
                <p>
                  {new Date(
                    parseInt(task.data.deadline, 10) * 1000
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Claim Button (only if not claimed yet) */}
            {canClaimTask(task) && (
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => handleClaim(task)}
                disabled={isSending}
              >
                {isSending ? "Claiming..." : "Claim Task"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
