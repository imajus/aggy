import { TaskData } from "@/types/Task";
import { getStatusText } from "@/types/Task";

interface TaskListProps {
  tasks: TaskData[];
}

export default function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <div key={task.data.id} className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-xl font-semibold">{task.data.name}</h2>
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
  );
} 