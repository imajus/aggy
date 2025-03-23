
import axios from 'axios';

// Example function to fetch data with authorization
export async function fetchData(endpoint: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_MULTIBAAS_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MULTIBAAS_KEY}`, // Include the authorization token
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}


export async function getCoreAddress() {
    console.log(process.env.NEXT_PUBLIC_MULTIBAAS_URL);
    console.log(process.env.NEXT_PUBLIC_MULTIBAAS_KEY);


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
  
  export async function approveToken(from: string, amount: string) {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_MULTIBAAS_URL}/addresses/aggy_token/contracts/aggy_token/methods/approve`,
      {
        method: 'POST',
        body: JSON.stringify({
           args: [await getCoreAddress(), amount],
           from,
           value: amount,
        }),
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MULTIBAAS_KEY}`
        }
      }
    );
    const data = await resp.json();
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
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MULTIBAAS_KEY}`
        }
      }
    );
    const data = await resp.json();
    return data.result.balance;
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
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MULTIBAAS_KEY}`
        }
      }
    );
    const data = await resp.json();
    return data.result.tx;
  }
  
  export async function fetchTaskPrivateData(userId: string, taskId: string) {
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