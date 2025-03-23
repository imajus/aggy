import { TaskResponse } from '@/types/Task';
import axios from 'axios';

export const fetchTasks = async (): Promise<TaskResponse> => {
  const response = await axios.post(
    'https://rti6n6fe7jgcrcbsv64xolgm5i.multibaas.com/api/v0/chains/ethereum/addresses/aggy_task_factory/contracts/aggy_task_factory/methods/getTasks',
    { args: [] },
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}; 