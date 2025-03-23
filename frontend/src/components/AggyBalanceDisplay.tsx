import { getBalanceOf } from '@/lib/api';
import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
// import useAggyContract from "@/hooks/UseAggyContracts";

export default function AggyBalanceDisplay() {
    // const { getAggyToken } = useAggyContract();
    // const tokenAddress = getAggyToken();
    const tokenAddress = '0x8926c8efd17a73771f51c68dD8adb95F61B5fa32';
    const [balance, setBalance] = useState<number | null>(0.00);

    useEffect(() => {
        // if (!tokenAddress) return;

        const client = createPublicClient({
            chain: mainnet,
            transport: http(),
        });

        async function fetchBalance() {
            try {
                const balance = await getBalanceOf(tokenAddress);
                // await client.getBalance({
                //     address: tokenAddress as unknown as `0x${string}` || '0x8926c8efd17a73771f51c68dD8adb95F61B5fa32',
                // });
                setBalance(Number(balance));
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        }

        fetchBalance();
    }, [tokenAddress]);

    if (!tokenAddress) {
        return <div>No token address found</div>;
    }

    return (
        <div className="border border-gray-300 rounded-md p-2 flex items-center">
          <span className="text-sm font-mono">
            Balance: {balance !== null ? balance.toFixed(2) : 'Loading...'} AGGY
          </span>
        </div>
      );
}
