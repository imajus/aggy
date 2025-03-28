import { Task } from '@/components/tasks/TasksList';

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MULTIBAAS_URL}/addresses/aggy_task_factory/contracts/aggy_task_factory/methods/getTasks`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MULTIBAAS_KEY}`,
      },
      body: JSON.stringify({ args: [] }),
    }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const { status, message, result } = await response.json();
  if (status !== 200) {
    throw new Error(`Failed to fetch tasks: ${message}`);
  }
  return result.output.map(({ data, state }) => ({
    id: data.id,
    name: data.name,
    details: data.details,
    deadline: data.deadline * 1000,
    reward: parseInt(data.rewardAmount),
    penalty: parseInt(data.stakeAmount),
    status: state.status,
    contractor:
      state.contractor !== '0x0000000000000000000000000000000000000000'
        ? state.contractor
        : null,
  }));
}

export async function getTokenAddress() {
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_MULTIBAAS_URL}/addresses/aggy_token`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MULTIBAAS_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const data = await resp.json();
  if (data.status !== 200) {
    throw new Error(`Failed to get token address: ${data.message}`);
  }
  return data.result.address;
}

export async function getCoreAddress() {
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_MULTIBAAS_URL}/addresses/aggy_core`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MULTIBAAS_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const data = await resp.json();
  if (data.status !== 200) {
    throw new Error(`Failed to get core address: ${data.message}`);
  }
  return data.result.address;
}

export async function approveToken(from: string, amount: string) {
  const coreAddress = await getCoreAddress();
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_MULTIBAAS_URL}/addresses/aggy_token/contracts/aggy_token/methods/approve`,
    {
      method: 'POST',
      body: JSON.stringify({
        args: [coreAddress, amount],
        from,
      }),
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MULTIBAAS_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const data = await resp.json();
  if (data.status !== 200) {
    throw new Error(`Failed to approve token: ${data.message}`);
  }
  return data.result.tx;
}

export async function getBalanceOf(address: string) {
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_MULTIBAAS_URL}/addresses/aggy_token/contracts/aggy_token/methods/balanceOf`,
    {
      method: 'POST',
      body: JSON.stringify({
        args: [address],
        from: address,
      }),
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MULTIBAAS_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const data = await resp.json();
  if (data.status !== 200) {
    throw new Error(`Failed to get balance of token: ${data.message}`);
  }
  return data.result.output;
}

export async function claimTask(from: string, taskId: string) {
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_MULTIBAAS_URL}/addresses/aggy_core/contracts/aggy_core/methods/claimTask`,
    {
      method: 'POST',
      body: JSON.stringify({
        args: [taskId],
        from,
      }),
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MULTIBAAS_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const data = await resp.json();
  if (data.status !== 200) {
    throw new Error(`Failed to claim task: ${data.message}`);
  }
  return data.result.tx;
}

export async function completeTask(
  from: string,
  taskId: string,
  result: string
) {
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_MULTIBAAS_URL}/addresses/aggy_core/contracts/aggy_core/methods/completeTask`,
    {
      method: 'POST',
      body: JSON.stringify({
        //TODO: Add result...
        args: [taskId],
        from,
      }),
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MULTIBAAS_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const data = await resp.json();
  if (data.status !== 200) {
    throw new Error(`Failed to complete task: ${data.message}`);
  }
  return data.result.tx;
}

export async function fetchTaskPrivateData(userId: string, taskId: string) {
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_AGENT_URL}/webhook/95010b94-c3b3-43ae-9c0d-c843568ac6ea?userId=${userId}&taskId=${taskId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const result = await resp.json();
  return result?.data;
}
