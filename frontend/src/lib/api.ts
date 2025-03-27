import { Task } from '@/components/tasks/TasksList';

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(
    'https://rti6n6fe7jgcrcbsv64xolgm5i.multibaas.com/api/v0/chains/ethereum/addresses/aggy_task_factory/contracts/aggy_task_factory/methods/getTasks',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzQyNzEzOTA3LCJqdGkiOiI0MTBjMjhjYS0zYzg2LTQzZjgtYTM0Mi0yYzU2MTJlYjBkODEifQ.puZ-ykOt9_JcLhcjct3KVGWI7GwgnCTb0lBb00zVSQE',
      },
      body: JSON.stringify({ args: [] }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  const {
    result: { output },
  } = await response.json();

  return output.map(({ data, state }) => ({
    id: data.id,
    name: data.name,
    details: data.details,
    deadline: new Date(data.deadline * 1000),
    reward: parseInt(data.rewardAmount),
    penalty: parseInt(data.stakeAmount),
    status: state.status,
  }));
}
