import { fetchTasks } from '@/client/TaskClient';
import { TaskData } from '@/types/Task';
import { useQuery } from '@tanstack/react-query';

export const useTasks = () => {
  return useQuery<TaskData[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await fetchTasks();
      return response.result.output;
    },
  });
};