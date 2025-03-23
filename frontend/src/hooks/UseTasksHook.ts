import { fetchTasks } from '@/client/TaskClient';
import { stringToTaskStatus, TaskData, TaskStatus } from '@/types/Task';
import { useQuery } from '@tanstack/react-query';

export const useTasks = (status?: TaskStatus) => {
  return useQuery<TaskData[]>({
    queryKey: ['tasks', status],
    queryFn: async () => {
      const response = await fetchTasks();
      console.log(response.result.output);
      if (!status) {
        return response.result.output;
      } else {
        return response.result.output.filter((task) => task.state.status === status);
      }
    },
  });
};