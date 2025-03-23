import { getBalanceOf, getTokenAddress } from '@/lib/api';
import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
// import useAggyContract from "@/hooks/UseAggyContracts";

export default function AggyBalanceDisplay() {
    // const { getAggyToken } = useAggyContract();
    // const tokenAddress = getAggyToken();
    const [tokenAddress, setTokenAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(0.00);

    useEffect(()=> {
        getTokenAddress().then(tokenAddress => {
            setTokenAddress(tokenAddress);
        }).catch((error) => {
            console.error('Error fetching token address:', error);
        });
    }, []);

    useEffect(() => {
        if (!tokenAddress) return;

        async function fetchBalance() {
            try {
                const balance = await getBalanceOf(tokenAddress!);
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
