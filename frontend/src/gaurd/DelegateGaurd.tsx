"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePrivy, useWallets, WalletWithMetadata } from "@privy-io/react-auth";
import { DelegateActionButton } from "@/components/DelegateActionButton";
import { Button } from "@/components/Button";

export default function DelegateGuard({ children }: { children: ReactNode }) {
  const { authenticated, user } = usePrivy();
  const { ready } = useWallets();

  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const isAlreadyDelegated = useMemo(() => {
    return !!user?.linkedAccounts.find(
      (account): account is WalletWithMetadata =>
        account.type === "wallet" && account.delegated,
    );
  }, [user]);

  useEffect(() => {
    if (authenticated && ready && !isAlreadyDelegated) {
      setShowDelegateModal(true);
    }

  }, [authenticated, ready, isAlreadyDelegated]);

  const handleClose = () => {
    setShowDelegateModal(false);
  };

  return (
    <>
      {/* The rest of your app */}
      {children}

      {/* Show the delegate popup if the user is authenticated & not delegated */}
      {showDelegateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-black p-6 rounded shadow-md w-[400px] text-center">
            <h2 className="text-xl font-bold mb-4">
              Delegate Your Embedded Wallet
            </h2>
            <p className="mb-6">
              It looks like you haven’t delegated your embedded wallet yet. 
              Please delegate to enable seamless usage.
            </p>
            {/* The button that triggers delegation */}
            <div className="mb-4">
              <DelegateActionButton />
            </div>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </div>
      )}
    </>
  );
}
