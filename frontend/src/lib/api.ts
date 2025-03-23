async function getCoreAddress() {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_MULTIBAAS_URL}/addresses/aggy_core`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MULTIBAAS_KEY}`
        }
      }
    );
    const data = await resp.json();
    return data.result.address;
  }
  
  async function approveToken(from: string, amount: string) {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_MULTIBAAS_URL}/addresses/aggy_token/contracts/aggy_token/methods/approve`,
      {
        method: 'POST',
        body: JSON.stringify({
           args: [await getCoreAddress()],
           from,
        }),
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MULTIBAAS_KEY}`
        }
      }
    );
    const data = await resp.json();
    return data.result.tx;
  }
  
  async function claimTask(from: string, taskId: string) {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_MULTIBAAS_URL}/addresses/aggy_core/contracts/aggy_core/methods/claimTask`,
      {
        method: 'POST',
        body: JSON.stringify({
           args: [taskId],
           from,
        }),
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MULTIBAAS_KEY}`
        }
      }
    );
    const data = await resp.json();
    return data.result.tx;
  }
  
  async function fetchTaskPrivateData(userId: string, taskId: string) {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_AGENT_URL}/webhook/95010b94-c3b3-43ae-9c0d-c843568ac6ea`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    const result = await resp.json();
    return result?.data;
  }