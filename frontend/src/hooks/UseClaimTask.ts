"use client";

import { useCallback, useState } from "react";
import { useWallets, useSendTransaction, usePrivy } from "@privy-io/react-auth";
import { approveToken, claimTask, fetchTaskPrivateData } from "@/lib/api";
// ↑ Adjust import path to wherever your API functions are located

/**
 * useClaimTask:
 * - Approves token spending 
 * - Calls `claimTask` on your contract
 * - Signs/sends the returned transaction object with Privy
 * - Optionally fetches "private" task data after.
 */
export function useClaimTask() {
  const { wallets } = useWallets();
  const { user } = usePrivy(); // if you need user.id
  const { sendTransaction } = useSendTransaction();
  const [error, setError] = useState<Error | null>(null);
  const [privateData, setPrivateData] = useState<any>(null);

  // This function does the entire claim process
  const claim = useCallback(
    async (taskId: string, stakeAmount: number) => {
      setError(null);
      setPrivateData(null);

      const wallet = wallets?.[0];
      if (!wallet?.address) {
        setError(new Error("No connected wallet found"));
        return;
      }

      try {
        // 1) Approve token spending for stakeAmount
        //    (Or pass a fixed number if your contract expects a certain penalty, etc.)
        const approveTx = await approveToken(wallet.address, stakeAmount.toString());

        // 2) We typically want to sign & send the approveTx as well
        //    If your contract requires a separate TX for approving, do it here:
        await sendTransaction({
          to: approveTx.to,
          chainId: process.env.NEXT_PUBLIC_MULTIBAAS_CHAIN_ID as unknown as number || 84532,
          nonce: approveTx.nonce ?? 0,
          data: approveTx.data,
          value: approveTx.value,
          type: approveTx.type,
          gasLimit: approveTx.gasFeeCap,
          gasPrice: approveTx.gasTipCap,
        });

        // 3) Now call claimTask => returns a TX to sign
        const claimTx = await claimTask(wallet.address, taskId);

        // 4) Sign & send the claim TX
        await sendTransaction({
          to: claimTx.to,
          chainId: process.env.NEXT_PUBLIC_MULTIBAAS_CHAIN_ID as unknown as number || 84532,
          nonce: claimTx.nonce ?? 0,
          data: claimTx.data,
          value: claimTx.value,
          type: claimTx.type,
          gasLimit: claimTx.gasFeeCap,
          gasPrice: claimTx.gasTipCap,
        });

        // 5) (Optional) Once claimed, you may want to fetch private data
        if (user?.id) {
          const privateInfo = await fetchTaskPrivateData(user.id, taskId);
          setPrivateData(privateInfo);
        }
      } catch (err) {
        console.error("Error claiming task:", err);
        setError(err as Error);
      }
    },
    [wallets, sendTransaction, user]
  );

  return {
    claim,
    error,
    privateData,
  };
}
